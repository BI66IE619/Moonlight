const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
let mouseX = 0;
let mouseY = 0;

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            opacity: Math.random(),
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2
        });
    }
}

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
});

function animate() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        // The x and y are adjusted by mouse position for depth
        ctx.arc(star.x + mouseX * star.size, star.y + mouseY * star.size, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
    });
    
    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);
init();
animate();
