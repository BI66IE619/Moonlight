const launchBtn = document.getElementById('launch-btn');
const urlInput = document.getElementById('url-input');

function launchProxy() {
    let input = urlInput.value.trim();
    if (!input) return;

    // 1. Format URL or Search
    let url = input;
    if (!url.includes(".")) {
        url = "https://www.google.com/search?q=" + encodeURIComponent(url);
    } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
        url = "https://" + url;
    }

    // 2. Updated 2026 Mirrors (Try these in order if one fails)
    // Mirror A: Interstellar Engine
    // Mirror B: Nebula Proxy
    const engineBase = "https://toddler-dance.com/uv/service/"; 
    const encodedUrl = btoa(url).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
    const finalProxyUrl = engineBase + encodedUrl;

    // 3. Launch Cloaked Window
    const win = window.open('about:blank', '_blank');
    if (!win) {
        alert("Pop-up blocked! Enable pop-ups to use the proxy.");
        return;
    }

    // 4. Inject Stealth Content
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    
    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.referrerPolicy = "no-referrer";
    iframe.src = finalProxyUrl;

    win.document.body.appendChild(iframe);
    
    // Clear input for next use
    urlInput.value = "";
}

launchBtn.onclick = launchProxy;
urlInput.onkeydown = (e) => { if (e.key === 'Enter') launchProxy(); };
