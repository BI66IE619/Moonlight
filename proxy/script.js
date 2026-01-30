// Register UV Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./uv/uv.sw.js', {
            scope: __uv$config.prefix
        }).catch(err => console.error("SW Registration Failed:", err));
    });
}

function updateServer() {
    const select = document.getElementById('server-select');
    localStorage.setItem('moonlight_bare', select.value);
    location.reload();
}

// Sync dropdown on load
window.onload = () => {
    const saved = localStorage.getItem('moonlight_bare');
    if (saved) document.getElementById('server-select').value = saved;
};

function launchProxy() {
    const input = document.getElementById('url-input').value.trim();
    if (!input) return;

    let url = input;
    if (!url.includes('.')) {
        url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
    } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        url = 'https://' + url;
    }

    const win = window.open('about:blank', '_blank');
    if (!win) {
        alert("Pop-up blocked!");
        return;
    }

    win.document.title = "Google Docs";
    const iframe = win.document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    
    // Crucial: Use the __uv$config you already have
    iframe.src = window.location.origin + __uv$config.prefix + __uv$config.encodeUrl(url);
    
    win.document.body.style.margin = '0';
    win.document.body.style.overflow = 'hidden';
    win.document.body.appendChild(iframe);
}
