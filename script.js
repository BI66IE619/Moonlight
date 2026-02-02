/**
 * MOONLIGHT CORE ENGINE
 * Version 1.2 - Fixed Layering & Viewport Logic
 */

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
let mouseX = 0;
let mouseY = 0;
const STAR_COUNT = 150;

/**
 * SYSTEM INITIALIZATION
 * Sets up the canvas and generates star objects.
 */
function init() {
    // Force canvas to fill the window without creating scrollbars
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reset star array on resize to prevent "stretching"
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.6,
            opacity: Math.random(),
            speedX: (Math.random() - 0.5) * 0.15,
            speedY: (Math.random() - 0.5) * 0.1,
            parallaxMult: Math.random() * 0.5 + 0.1 // Unique depth for each star
        });
    }
}

/**
 * MOUSE TRACKING
 * Calculates displacement from center for the parallax effect.
 */
window.addEventListener('mousemove', (e) => {
    // Determine mouse distance from the center of the screen
    mouseX = (e.clientX - window.innerWidth / 2);
    mouseY = (e.clientY - window.innerHeight / 2);
});

/**
 * ANIMATION LOOP
 * Handles the background rendering and star drift.
 */
function animate() {
    // 1. Clear the frame with true black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Render Stars
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        
        // Apply Parallax: Star position + (Mouse offset * depth multiplier)
        // Divide mouseX/Y to keep the movement subtle
        const xPos = star.x + (mouseX * 0.02 * star.parallaxMult);
        const yPos = star.y + (mouseY * 0.02 * star.parallaxMult);
        
        ctx.arc(xPos, yPos, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 3. Constant Drift Logic
        star.x += star.speedX;
        star.y += star.speedY;

        // Screen Wrap-around (Infinite Universe)
        if (star.x < -20) star.x = canvas.width + 20;
        if (star.x > canvas.width + 20) star.x = -20;
        if (star.y < -20) star.y = canvas.height + 20;
        if (star.y > canvas.height + 20) star.y = -20;
    });
    
    requestAnimationFrame(animate);
}

/**
 * MODULE INTERACTION
 * Handles clicking on the grid cards.
 */
function setupInteractions() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const moduleName = this.querySelector('h3').innerText;
            
            // Interaction Feedback
            this.style.transform = "scale(0.95)";
            this.style.borderColor = "#ffffff";
            
            setTimeout(() => {
                this.style.transform = "";
                console.log(`Moonlight: Loading ${moduleName} UI...`);
                // Trigger transition to specific module here
            }, 150);
        });
    });
}

/**
 * LOADER LOGIC
 * Progress simulation for index.html.
 */
const runLoader = () => {
    const statusText = document.querySelector('.status');
    const progressFill = document.querySelector('.progress-fill');
    
    if (statusText && progressFill) {
        const statuses = [
            "INITIALIZING...",
            "BYPASSING FILTERS...",
            "STABILIZING CORE...",
            "ACCESS GRANTED"
        ];
        
        let step = 0;
        const interval = setInterval(() => {
            if (step < statuses.length) {
                statusText.innerText = statuses[step];
                step++;
            } else {
                clearInterval(interval);
            }
        }, 700);
    }
};

// --- Execute ---
window.addEventListener('resize', init);

// Wait for DOM to load before initializing
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
    setupInteractions();
    runLoader();
});
