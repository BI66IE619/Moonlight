const launchBtn = document.getElementById('launch-btn');
const urlInput = document.getElementById('url-input');

// 2026 High-Performance Mirror List (Ultraviolet & Interstellar Nodes)
// These are current as of late January 2026.
const nodes = [
    "https://x.j0.icom.org.np/main/",           // Interstellar Node 1
    "https://artclass.site/uv/service/",       // Ultraviolet Node 2
    "https://mathspot.li/uv/service/",         // Ultraviolet Node 3
    "https://b.gnorth.cyou/uv/service/",       // G-Math Node 4
    "https://clever.com.organicway.org/uv/s/"  // Stealth Node 5
];

function launchProxy() {
    let input = urlInput.value.trim();
    if (!input) return;

    // 1. Process URL/Search
    let url = input;
    if (!url.includes(".")) {
        url = "https://www.google.com/search?q=" + encodeURIComponent(url);
    } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
        url = "https://" + url;
    }

    // 2. Encode for Ultraviolet compatibility
    const encodedUrl = btoa(url).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');

    // 3. Launch with Tab Cloaking
    const win = window.open('about:blank', '_blank');
    if (!win) {
        alert("Pop-up blocked! Enable pop-ups to use Moonlight.");
        return;
    }

    // Set a decoy title immediately
    win.document.title = "Google Classroom"; 
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    win.document.body.style.backgroundColor = '#000';

    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.referrerPolicy = "no-referrer";

    // Try Node 0 first; if it fails, you can manually rotate in the code
    iframe.src = nodes[0] + encodedUrl;

    win.document.body.appendChild(iframe);
    urlInput.value = "";
}

launchBtn.onclick = launchProxy;
urlInput.onkeydown = (e) => { if (e.key === 'Enter') launchProxy(); };
