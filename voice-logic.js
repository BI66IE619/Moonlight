import { GoogleGenerativeAI } from "@google/generative-ai";

// These variables should be injected via GitHub Actions / Secret variables
const GEMINI_KEY = "AIzaSyAmNGAEX_IBWA_e3LzfiJqYxkFS9uwRDvU"; 
const SCALEDRONE_ID = "0jB5WrKukVaz6Yb6";

const genAI = new GoogleGenerativeAI(GEMINI_KEY);

// 1. AI SCREENING (Gemini 2.5 Flash)
async function screenUsername(name) {
    // Upgraded to gemini-2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
        System: Moonlight Secure Terminal.
        Task: Screen username "${name}" for toxicity, slurs, or bypasses.
        Constraint: Respond ONLY in JSON: {"status": "APPROVED" | "REJECTED", "reason": "short string"}.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (e) {
        console.warn("AI Offline, proceeding with caution.");
        return { status: "APPROVED" };
    }
}

// 2. IDENTITY INITIALIZATION
window.checkAndJoin = async () => {
    const name = document.getElementById('username-input').value.trim();
    const btn = document.getElementById('init-btn');
    const warn = document.getElementById('filter-warning');

    if (name.length < 2) return;

    btn.innerText = "THINKING...";
    btn.classList.add('loading');

    const check = await screenUsername(name);

    if (check.status === "REJECTED") {
        warn.innerText = `IDENTITY REJECTED: ${check.reason.toUpperCase()}`;
        warn.style.display = "block";
        btn.innerText = "INITIALIZE LINK";
        btn.classList.remove('loading');
    } else {
        document.getElementById('identity-overlay').style.display = "none";
        startVoice(name);
    }
};

// 3. SCALEDRONE & WEBRTC LOGIC
function startVoice(username) {
    const drone = new ScaleDrone(SCALEDRONE_ID, { data: { name: username } });
    const room = drone.subscribe('observable-moonlight-voice');

    room.on('members', m => {
        const list = document.getElementById('member-list');
        list.innerHTML = m.map(user => `
            <div class="member-item"><span class="member-dot"></span> ${user.clientData.name}</div>
        `).join('');
        
        // Signal connection
        document.getElementById('connection-status').innerText = "LINK ESTABLISHED";
        document.getElementById('mic-btn').disabled = false;
        document.getElementById('mic-btn').classList.remove('disabled');
    });

    // WebRTC PeerConnection logic goes here...
}
