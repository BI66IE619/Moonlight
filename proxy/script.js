function launchProxy() {
    let url = document.getElementById('url-input').value.trim();
    if (!url) return;

    // Search Engine Routing
    if (!url.includes(".")) {
        url = "https://www.google.com/search?q=" + encodeURIComponent(url);
    } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
        url = "https://" + url;
    }

    // Use a high-performance 2026 Mirror (Interstellar Engine)
    // If this mirror gets blocked, just update this one variable
    const proxyEngine = "https://artclass.site/uv/service/" + btoa(url);

    const win = window.open();
    if (!win) {
        alert("Please allow pop-ups for Moonlight to function.");
        return;
    }

    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    
    // The actual Cloak
    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.src = proxyEngine;

    win.document.body.appendChild(iframe);
    
    // Optional: Redirect original tab to Google to 'hide' evidence
    window.location.replace("https://google.com");
}

// Handle 'Enter' key
document.getElementById('url-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') launchProxy();
});
