if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./uv/uv.sw.js', {
            scope: __uv$config.prefix
        });
    });
}

function updateServer() {
    const select = document.getElementById('server-select');
    localStorage.setItem('moonlight_bare', select.value);
    location.reload();
}

// Sync the dropdown with saved choice
document.getElementById('server-select').value = localStorage.getItem('moonlight_bare') || 'https://bare.benroberts.dev/';

function launchProxy() {
    let url = document.getElementById('url-input').value.trim();
    if (!url) return;

    if (!url.includes('.'
