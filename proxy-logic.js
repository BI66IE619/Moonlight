const nodes = {
    1: "https://intelleducation.netlify.app/",
    2: "https://vm.mathfilm.dk/",
    3: "https://your-proxy-3.com", 
    4: "https://your-proxy-4.com"  
};

document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('dropdown-trigger');
    const menu = document.getElementById('proxy-menu');
    const frame = document.getElementById('proxy-frame');
    const frameContainer = document.querySelector('.window-container');
    const overlay = document.getElementById('loading-overlay');

    // 1. Toggle Menu
    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents immediate closing
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    });

    // 2. Select Item
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            
            // Update UI
            document.getElementById('current-node-label').innerText = name;
            document.getElementById('active-node-name').innerText = name;
            menu.style.display = 'none';

            // Flicker & Load
            if (frameContainer) frameContainer.classList.add('flicker-active');
            if (overlay) {
                overlay.style.display = 'flex';
                overlay.style.opacity = '1';
            }

            setTimeout(() => {
                frame.src = nodes[id];
                setTimeout(() => {
                    if (frameContainer) frameContainer.classList.remove('flicker-active');
                }, 400);
            }, 300);
        });
    });

    // 3. Close if clicking anywhere else
    window.addEventListener('click', () => {
        menu.style.display = 'none';
    });
});
