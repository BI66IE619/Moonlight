/**
 * MOONLIGHT CORE ENGINE
 * Handles: Background Physics, Viewport Management, and System Initialization
 */

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
let mouseX = 0;
let mouseY = 0;
const STAR_COUNT = 180;

// Initialize System
function init() {
    // Set canvas to exact viewport dimensions to prevent scrollbars
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.8,
            opacity: Math.random(),
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.15,
            drift: Math.random() * 0.05
        });
    }
}

// Track Mouse for Parallax Effect
window.addEventListener('mousemove', (e) => {
    // Calculate offset from center
    mouseX = (e.clientX - window.innerWidth / 2) * 0.04;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.04;
});

// Main Animation Loop
function animate() {
    // True black background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        // Draw Star
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        
        // Apply parallax (based on mouse) + subtle drift
        const xPos = star.x + (mouseX * star.size);
        const yPos = star.y + (mouseY * star.size);
        
        ctx.arc(xPos, yPos, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Constant slow drift
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap around screen
        if (star.x < -10) star.x = canvas.width + 10;
        if (star.x > canvas.width + 10) star.x = -10;
        if (star.y < -10) star.y = canvas.height + 10;
        if (star.y > canvas.height + 10) star.y = -10;
    });
    
    requestAnimationFrame(animate);
}

// Window Resize Handler
window.addEventListener('resize', () => {
    init();
});

// Navigation & Interactive Logic
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        const target = this.querySelector('h3').innerText;
        console.log(`Initializing Module: ${target}`);
        
        // Visual feedback on click
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
            this.style.transform = "translateY(-5px)";
            // Add your module loading logic here
            // Example: if(target === 'GAMES') openGames();
        }, 100);
    });
});

// Initialization
init();
animate();

// Loader Progress Simulation (Only runs on index.html)
if (document.querySelector('.progress-fill')) {
    const statusText = document.querySelector('.status');
    const statuses = [
        "BYPASSING FILTERS...",
        "DECRYPTING ASSETS...",
        "STABILIZING CORE...",
        "WELCOME TO MOONLIGHT"
    ];
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < statuses.length) {
            statusText.innerText = statuses[i];
            i++;
        } else {
            clearInterval(interval);
        }
    }, 800);
}
