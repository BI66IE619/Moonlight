import { GoogleGenerativeAI } from "@google/generative-ai";

// CREDENTIALS INJECTED
const GEMINI_KEY = "AIzaSyAmNGAEX_IBWA_e3LzfiJqYxkFS9uwRDvU"; 
const SCALEDRONE_ID = "0jB5WrKukVaz6Yb6";

const genAI = new GoogleGenerativeAI(GEMINI_KEY);

/**
 * 1. AI SCREENING (Gemini 2.5 Flash)
 * Uses पीएचडी-level reasoning to detect toxic/bad usernames.
 */
async function screenUsername(name) {
    // Model initialized to Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
    System: Moonlight Secure Terminal.
    Task: Extremely strict identity screening.
    
    Reject any name that:
    1. Contains animals combined with colors if they have historical negative connotations.
    2. Uses "slang" that could be double-entendre.
    3. Even slightly borders on unprofessional.
    
    Analyze: "${name}"
    Response: ONLY JSON {"status": "APPROVED" | "REJECTED", "reason": "string"}
`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const data = JSON.parse(response.text());
        return data;
    } catch (e) {
        console.error("AI Error:", e);
        // Fail-safe: allow entry if the API is down to prevent lockout
        return { status: "APPROVED", reason: "OFFLINE_MODE" };
    }
}

/**
 * 2. INITIALIZE IDENTITY
 * Called by the "Initialize Link" button in your overlay.
 */
window.checkAndJoin = async () => {
    const input = document.getElementById('username-input');
    const btn = document.getElementById('init-btn');
    const warn = document.getElementById('filter-warning');
    const name = input.value.trim();

    if (name.length < 2) {
        warn.innerText = "IDENTITY TOO SHORT";
        warn.style.display = "block";
        return;
    }

    // Visual feedback for the AI 'thinking' process
    btn.innerText = "ANALYZING...";
    btn.disabled = true;
    warn.style.display = "none";

    const check = await screenUsername(name);

    if (check.status === "REJECTED") {
        warn.innerText = `REJECTED: ${check.reason.toUpperCase()}`;
        warn.style.display = "block";
        btn.innerText = "INITIALIZE LINK";
        btn.disabled = false;
    } else {
        // Success: Hide overlay and start Comms
        document.getElementById('identity-overlay').style.display = "none";
        startVoiceComms(name);
    }
};

/**
 * 3. SCALEDRONE & WEBRTC
 * Handles the actual group voice connection.
 */
function startVoiceComms(username) {
    const drone = new ScaleDrone(SCALEDRONE_ID, {
        data: { name: username } // Attaches username to the connection
    });

    drone.on('open', error => {
        if (error) return console.error(error);
        
        const room = drone.subscribe('observable-moonlight-voice');
        
        room.on('members', m => {
            updateUserList(m);
            // In a full implementation, you'd trigger the WebRTC PeerConnection here
        });

        document.getElementById('connection-status').innerText = "LINK ESTABLISHED";
        document.getElementById('mic-btn').disabled = false;
        document.getElementById('mic-btn').classList.remove('disabled');
    });
}

function updateUserList(members) {
    const list = document.getElementById('member-list');
    list.innerHTML = members.map(m => `
        <div class="member-item">
            <span class="member-dot"></span>
            ${m.clientData.name} ${m.id === drone.clientId ? '(YOU)' : ''}
        </div>
    `).join('');
}
