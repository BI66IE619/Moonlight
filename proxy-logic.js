const nodes = {
    1: "https://intelleducation.netlify.app/",
    2: "https://vm.mathfilm.dk/",
    3: "https://testp34343.vercel.app/", 
    4: "https://spacing-infinite.b-cdn.net/"  
};

function toggleDropdown() {
    const menu = document.getElementById('proxy-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function selectNode(id, name) {
    const frame = document.getElementById('proxy-frame');
    const label = document.getElementById('current-node-label');
    const frameContainer = document.querySelector('.window-container');
    const overlay = document.getElementById('loading-overlay'); // Make sure this ID exists
    
    label.innerText = name;
    document.getElementById('active-node-name').innerText = name;
    toggleDropdown();

    // Trigger Flicker & Loading
    frameContainer.classList.add('flicker-active');
    if(overlay) {
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
    }

    setTimeout(() => {
        frame.src = nodes[id];
        setTimeout(() => {
            frameContainer.classList.remove('flicker-active');
        }, 400);
    }, 300);
}

// Close dropdown if user clicks outside
window.onclick = function(event) {
    if (!event.target.closest('.node-dropdown')) {
        const menu = document.getElementById('proxy-menu');
        if(menu) menu.style.display = 'none';
    }
}
