// Register the Service Worker (The "Unblocker")
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./uv/uv.sw.js', {
            scope: __uv$config.prefix
        });
    });
}

function launch() {
    let url = document.getElementById('url').value.trim();
    if (!url.includes('.')) url = 'https://www.google.com/search?q=' + url;
    else if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'https://' + url;

    // Open in about:blank for total stealth
    const win = window.open('about:blank', '_blank');
    const iframe = win.document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = window.location.origin + __uv$config.prefix + __uv$config.encodeUrl(url);
    win.document.body.appendChild(iframe);
}
