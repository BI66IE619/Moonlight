// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./uv/uv.sw.js', {
        scope: __uv$config.prefix
    });
}

function updateServer() {
    const select = document.getElementById('server-select');
    localStorage.setItem('moonlight_bare', select.value);
    // Reload to apply the new Bare server to the config
    location.reload();
}

function launchProxy() {
    let url = document.getElementById('url-input').value.trim();
    if (!url) return;
    if (!url.includes('.')) url = 'https://www.google.com/search?q=' + url;
    else if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'https://' + url;

    const win = window.open('about:blank', '_blank');
    const iframe = win.document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = window.location.origin + __uv$config.prefix + __uv$config.encodeUrl(url);
    win.document.body.appendChild(iframe);
}
