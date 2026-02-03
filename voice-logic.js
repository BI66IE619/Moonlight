import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_KEY = "AIzaSyAmNGAEX_IBWA_e3LzfiJqYxkFS9uwRDvU"; 
const SCALEDRONE_ID = "0jB5WrKukVaz6Yb6";

const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

let drone, room, localStream;
let pcPeers = {}; 
let currentMembers = []; // Global state for the user list

// 1. AI SCREENING
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
    const name = input.value.trim();
    if (name.length < 2) return;

    const check = await screenUsername(name);
    if (check.status === "REJECTED") {
        alert(check.reason);
    } else {
        document.getElementById('identity-overlay').style.display = "none";
        startComms(name);
    }
};

// 2. THE ENGINE
function startComms(username) {
    drone = new ScaleDrone(SCALEDRONE_ID, { data: { name: username } });

    drone.on('open', error => {
        if (error) return console.error(error);
        
        // Use observable- prefix for member tracking
        room = drone.subscribe('observable-moonlight-voice');

        // Capture Mic immediately
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            localStream = stream;
            localStream.getAudioTracks()[0].enabled = false; // Start muted
            document.getElementById('mic-btn').disabled = false;
            document.getElementById('mic-btn').classList.remove('disabled');
            setupVoiceActivity(stream);
        });

        // EVENT: Initial List
        room.on('members', m => {
            currentMembers = m;
            renderUserList();
            currentMembers.forEach(m => {
                if (m.id !== drone.clientId) createPeerConnection(m.id, true);
            });
        });

        // EVENT: Someone joins
        room.on('member_join', member => {
            currentMembers.push(member);
            renderUserList();
        });

        // EVENT: Someone leaves
        room.on('member_leave', ({id}) => {
            const index = currentMembers.findIndex(m => m.id === id);
            if (index > -1) currentMembers.splice(index, 1);
            if (pcPeers[id]) {
                pcPeers[id].close();
                delete pcPeers[id];
            }
            renderUserList();
        });

        // EVENT: WebRTC Signaling
        room.on('data', (data, member) => {
            if (member.id === drone.clientId) return;
            handleSignaling(data, member.id);
        });
    });
}

// 3. UI RENDERING (The fix for your "Not Updating" issue)
function renderUserList() {
    const list = document.getElementById('member-list');
    const status = document.getElementById('connection-status');
    
    status.innerText = `${currentMembers.length} OPERATIVES ONLINE`;
    
    list.innerHTML = currentMembers.map(m => `
        <div class="member-item" id="user-${m.id}">
            <span class="member-dot"></span> 
            ${m.clientData.name} ${m.id === drone.clientId ? '<span class="you-tag">(YOU)</span>' : ''}
        </div>
    `).join('');
}

// 4. WebRTC & MIC TOGGLE
window.toggleMic = () => {
    const track = localStream.getAudioTracks()[0];
    track.enabled = !track.enabled;
    const btn = document.getElementById('mic-btn');
    btn.innerText = track.enabled ? "MIC: ON" : "MIC: OFF";
    btn.style.background = track.enabled ? "#fff" : "transparent";
    btn.style.color = track.enabled ? "#000" : "#fff";
};

// WebRTC Signaling Logic (Shortened for brevity - same as before)
function createPeerConnection(peerId, isOfferer) {
    const pc = new RTCPeerConnection(configuration);
    pcPeers[peerId] = pc;
    pc.onicecandidate = e => {
        if (e.candidate) drone.publish({ room: 'observable-moonlight-voice', message: { candidate: e.candidate, to: peerId } });
    };
    pc.ontrack = e => {
        const audio = new Audio();
        audio.srcObject = e.streams[0];
        audio.autoplay = true;
    };
    localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
    if (isOfferer) {
        pc.createOffer().then(d => { pc.setLocalDescription(d); drone.publish({ room: 'observable-moonlight-voice', message: { sdp: d, to: peerId } }); });
    }
    return pc;
}

function handleSignaling(data, fromId) {
    if (data.to && data.to !== drone.clientId) return;
    let pc = pcPeers[fromId] || createPeerConnection(fromId, false);
    if (data.sdp) {
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
            if (pc.remoteDescription.type === 'offer') {
                pc.createAnswer().then(a => { pc.setLocalDescription(a); drone.publish({ room: 'observable-moonlight-voice', message: { sdp: a, to: fromId } }); });
            }
        });
    } else if (data.candidate) pc.addIceCandidate(new RTCIceCandidate(data.candidate));
}

// Voice Activity Visualizer
function setupVoiceActivity(stream) {
    const ctx = new AudioContext();
    const analyzer = ctx.createAnalyser();
    const src = ctx.createMediaStreamSource(stream);
    src.connect(analyzer);
    const data = new Uint8Array(analyzer.frequencyBinCount);
    function update() {
        analyzer.getByteFrequencyData(data);
        const vol = data.reduce((a, b) => a + b) / data.length;
        const dot = document.querySelector(`#user-${drone.clientId} .member-dot`);
        if (dot && localStream.getAudioTracks()[0].enabled) {
            dot.style.background = vol > 10 ? "#00ff00" : "#fff";
            dot.style.boxShadow = vol > 10 ? "0 0 15px #00ff00" : "none";
        }
        requestAnimationFrame(update);
    }
    update();
}
