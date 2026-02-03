import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_KEY = "AIzaSyAmNGAEX_IBWA_e3LzfiJqYxkFS9uwRDvU"; 
const SCALEDRONE_ID = "0jB5WrKukVaz6Yb6";

const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

let drone, room, localStream;
let pcPeers = {}; // Track multiple connections: { clientId: RTCPeerConnection }

// --- 1. AI SCREENING ---
async function screenUsername(name) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Return JSON {"status": "APPROVED" | "REJECTED", "reason": "string"} for username: "${name}".`;
    try {
        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
    } catch (e) { return { status: "APPROVED" }; }
}

window.checkAndJoin = async () => {
    const input = document.getElementById('username-input');
    const btn = document.getElementById('init-btn');
    const name = input.value.trim();
    if (name.length < 2) return;

    btn.innerText = "VERIFYING...";
    const check = await screenUsername(name);

    if (check.status === "REJECTED") {
        document.getElementById('filter-warning').innerText = check.reason.toUpperCase();
        document.getElementById('filter-warning').style.display = "block";
        btn.innerText = "INITIALIZE LINK";
    } else {
        document.getElementById('identity-overlay').style.display = "none";
        startComms(name);
    }
};

// --- 2. THE CORE ENGINE ---
function startComms(username) {
    drone = new ScaleDrone(SCALEDRONE_ID, { data: { name: username } });

    drone.on('open', error => {
        if (error) return console.error(error);
        room = drone.subscribe('observable-moonlight-voice');

        // Capture local audio
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            localStream = stream;
            // Initially muted
            localStream.getAudioTracks()[0].enabled = false;
            setupVoiceActivity(stream);
        });

        room.on('members', members => {
            updateUI(members);
            // Connect to everyone already in the room
            members.forEach(m => {
                if (m.id !== drone.clientId) {
                    createPeerConnection(m.id, true);
                }
            });
        });

        room.on('member_join', member => {
            console.log("Member joined:", member.clientData.name);
            updateUI(room.members);
        });

        room.on('member_leave', member => {
            updateUI(room.members);
            if (pcPeers[member.id]) {
                pcPeers[member.id].close();
                delete pcPeers[member.id];
            }
        });

        room.on('data', (data, member) => {
            if (member.id === drone.clientId) return;
            handleSignaling(data, member.id);
        });
    });
}

function updateUI(members) {
    const list = document.getElementById('member-list');
    list.innerHTML = members.map(m => `
        <div class="member-item" id="user-${m.id}">
            <span class="member-dot"></span> 
            ${m.clientData.name} ${m.id === drone.clientId ? '(YOU)' : ''}
        </div>
    `).join('');
    document.getElementById('connection-status').innerText = `${members.length} OPERATIVES ACTIVE`;
}

// --- 3. WebRTC SIGNALING ---
function createPeerConnection(peerId, isOfferer) {
    const pc = new RTCPeerConnection(configuration);
    pcPeers[peerId] = pc;

    pc.onicecandidate = event => {
        if (event.candidate) {
            drone.publish({ room: 'observable-moonlight-voice', message: { candidate: event.candidate, to: peerId } });
        }
    };

    pc.ontrack = event => {
        const remoteAudio = new Audio();
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.autoplay = true;
    };

    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    if (isOfferer) {
        pc.createOffer().then(offer => {
            pc.setLocalDescription(offer);
            drone.publish({ room: 'observable-moonlight-voice', message: { sdp: offer, to: peerId } });
        });
    }
}

function handleSignaling(data, fromId) {
    if (data.to && data.to !== drone.clientId) return;

    let pc = pcPeers[fromId] || createPeerConnection(fromId, false);

    if (data.sdp) {
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
            if (pc.remoteDescription.type === 'offer') {
                pc.createAnswer().then(answer => {
                    pc.setLocalDescription(answer);
                    drone.publish({ room: 'observable-moonlight-voice', message: { sdp: answer, to: fromId } });
                });
            }
        });
    } else if (data.candidate) {
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
}

// --- 4. MIC & VOICE ACTIVITY ---
window.toggleMic = () => {
    const track = localStream.getAudioTracks()[0];
    track.enabled = !track.enabled;
    const btn = document.getElementById('mic-btn');
    btn.innerText = track.enabled ? "MIC: ON" : "MIC: OFF";
    btn.classList.toggle('active', track.enabled);
};

function setupVoiceActivity(stream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function checkVolume() {
        analyser.getByteFrequencyData(dataArray);
        let values = 0;
        for (let i = 0; i < bufferLength; i++) { values += dataArray[i]; }
        const average = values / bufferLength;

        const myDot = document.querySelector(`#user-${drone.clientId} .member-dot`);
        if (myDot) {
            myDot.style.boxShadow = average > 30 ? "0 0 15px #00ff00" : "0 0 5px #fff";
            myDot.style.background = average > 30 ? "#00ff00" : "#fff";
        }
        requestAnimationFrame(checkVolume);
    }
    checkVolume();
}
