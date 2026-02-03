const DB_NAME = 'MoonlightCache';
const STORE_NAME = 'thumbnails';

// Initialize the Database
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Save image as a Base64 string
async function saveImage(url, blob) {
    const db = await initDB();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(reader.result, url);
    };
}

// Main logic to apply to every image
export async function loadCachedImage(imgElement) {
    const url = imgElement.getAttribute('data-src');
    if (!url) return;

    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const cached = await new Promise(res => {
        const req = tx.objectStore(STORE_NAME).get(url);
        req.onsuccess = () => res(req.result);
    });

    if (cached) {
        // Use the cached version
        imgElement.src = cached;
        imgElement.classList.add('loaded');
    } else {
        // Download and save for next time
        try {
            const resp = await fetch(url);
            const blob = await resp.blob();
            imgElement.src = url; // Show the live one for now
            saveImage(url, blob);
            imgElement.classList.add('loaded');
        } catch (e) {
            console.error("Cache failed for:", url);
        }
    }
}
