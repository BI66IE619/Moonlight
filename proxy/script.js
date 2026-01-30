function launchProxy() {
    let input = document.getElementById('url-input').value.trim();
    if (!input) return;

    // 1. Prepare the URL
    let url = input;
    if (!url.includes(".")) {
        url = "https://www.google.com/search?q=" + encodeURIComponent(url);
    } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
        url = "https://" + url;
    }

    // 2. The Mirror Engine (Ultraviolet-powered)
    // We use a Base64 encoded URL format which most proxies use
    const proxyEngine = "https://artclass.site/uv/service/" + btoa(url);

    // 3. Create the 'about:blank' tab FIRST (must be immediate)
    const win = window.open('about:blank', '_blank');
    if (!win) {
        alert("Pop-up blocked! Click the icon in your address bar to 'Always Allow' for Moonlight.");
        return;
    }

    // 4. Inject the content into the new tab
    win.document.title = "Google Classroom"; // Stealth title
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    win.document.body.style.overflow = 'hidden';
    
    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.src = proxyEngine;

    win.document.body.appendChild(iframe);

    // 5. SUCCESS: Clear your input
    document.getElementById('url-input').value = "";
}

// Ensure Enter key works without triggering popup blockers
document.getElementById('url-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        launchProxy();
    }
});
