/**
 * MOONLIGHT CORE ENGINE
 * Version 1.3 - Fixed Render Layering & Star Physics
 */

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
let mouseX = 0;
let mouseY = 0;
const STAR_COUNT = 150;

/**
 * SYSTEM INITIALIZATION
 * Calibrates canvas size and generates starfield data.
 */
function init() {
    // Prevent scrollbars by strictly matching viewport dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random(),
            speedX: (Math.random() - 0.5) * 0.1,
            speedY: (Math.random() - 0.5) * 0.1,
            parallax: Math.random() * 0.03 // Individual depth multiplier
        });
    }
}

/**
 * INTERACTIVE PARALLAX
 * Updates mouse coordinates for background movement.
 */
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - window.innerWidth / 2;
    mouseY = e.clientY - window.innerHeight / 2;
});

/**
 * ANIMATION ENGINE
 * Handles frame-by-frame rendering of the starfield.
 */
function animate() {
    // Clear background with true black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        
        // Calculate position based on movement + mouse parallax
        const xPos = star.x + (mouseX * star.parallax);
        const yPos = star.y + (mouseY * star.parallax);
        
        ctx.arc(xPos, yPos, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Apply constant drift
        star.x += star.speedX;
        star.y += star.speedY;

        // Screen Wrap (Infinite Loop)
        if (star.x < -10) star.x = canvas.width + 10;
        if (star.x > canvas.width + 10) star.x = -10;
        if (star.y < -10) star.y = canvas.height + 10;
        if (star.y > canvas.height + 10) star.y = -10;
    });
    
    requestAnimationFrame(animate);
}

/**
 * COMPONENT HANDLERS
 * Attaches logic to the UI grid cards.
 */
function setupCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const label = this.querySelector('h3').innerText;
            
            // Visual feedback
            this.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            
            setTimeout(() => {
                this.style.backgroundColor = "";
                console.log(`Moonlight Hub: Accessing ${label}...`);
                // Add redirection logic here
            }, 100);
        });
    });
}

/**
 * SYSTEM BOOT
 */
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
    setupCards();
    
    // Status update logic if on index.html
    const status = document.querySelector('.status');
    if (status) {
        const steps = ["STABILIZING INTERFACE...", "CLEARING CACHE...", "CONNECTION SECURE"];
        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                status.innerText = steps[i];
                i++;
            } else {
                clearInterval(interval);
            }
        }, 800);
    }
});

window.addEventListener('resize', init);

/**
 * TAB CLOAK ENGINE
 * Mimics a productivity tool to bypass visual inspection.
 */

const cloakSettings = {
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
};

const originalSettings = {
    title: document.title,
    icon: '' // Will be grabbed on load
};

let isCloaked = false;

function toggleCloak() {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    
    if (!isCloaked) {
        // Save original if not already saved
        if (!originalSettings.icon) {
            const currentIcon = document.querySelector("link[rel*='icon']");
            originalSettings.icon = currentIcon ? currentIcon.href : '';
        }

        // Apply Cloak
        document.title = cloakSettings.title;
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = cloakSettings.icon;
        document.getElementsByTagName('head')[0].appendChild(link);
        
        console.log("Moonlight: Ghost Mode Active.");
    } else {
        // Restore Moonlight
        document.title = originalSettings.title;
        link.href = originalSettings.icon;
        console.log("Moonlight: Interface Restored.");
    }
    
    isCloaked = !isCloaked;
}

// Listen for the 'Escape' key to toggle cloak
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        toggleCloak();
    }
});
