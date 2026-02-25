document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('boot-status');
    const progressFill = document.getElementById('progress-fill');
    const loaderWrapper = document.getElementById('loader-wrapper');

    const bootSequences = [
        { text: "INITIALIZING KERNEL...", delay: 400, progress: 20 },
        { text: "CONNECTING TO RELAY...", delay: 600, progress: 45 },
        { text: "DECRYPTING ASSETS...", delay: 500, progress: 70 },
        { text: "CALIBRATING STARFIELD...", delay: 700, progress: 90 },
        { text: "SYSTEMS OPTIMAL.", delay: 300, progress: 100 }
    ];

    let currentStep = 0;

    function runBootSequence() {
        if (currentStep < bootSequences.length) {
            const step = bootSequences[currentStep];
            
            statusText.innerText = step.text;
            progressFill.style.width = `${step.progress}%`;

            setTimeout(() => {
                currentStep++;
                runBootSequence();
            }, step.delay);
        } else {
            // --- AUTOMATED STEALTH LAUNCH ---
            setTimeout(() => {
                loaderWrapper.style.opacity = '0';
                
                // Trigger the cloak and redirect
                autoInitializeCloak();
            }, 500);
        }
    }

    function autoInitializeCloak() {
        // Path to your actual hub
        const mainUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/main.html";
        // The decoy site that stays in your history/tab
        const decoyUrl = "https://www.google.com"; 

        const win = window.open();
        
        if (!win) {
            // If popups are blocked, give the user a way to manual-trigger
            statusText.style.color = "#ff3333";
            statusText.innerText = "POPUP_BLOCKED: CLICK_TO_PROCEED";
            loaderWrapper.style.opacity = '1'; // Bring loader back so they can see the message
            
            window.onclick = () => {
                const retryWin = window.open();
                if (retryWin) finalize(retryWin, mainUrl, decoyUrl);
            };
            return;
        }

        finalize(win, mainUrl, decoyUrl);
    }

    function finalize(win, mainUrl, decoyUrl) {
        // Build the about:blank disguise
        win.document.title = "Google Docs"; 
        win.document.body.style.margin = "0";
        win.document.body.style.height = "100vh";
        win.document.body.style.overflow = "hidden";
        win.document.body.style.background = "#000";

        const iframe = win.document.createElement('iframe');
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.src = mainUrl;
        
        win.document.body.appendChild(iframe);

        // Instantly switch this tab to the decoy
        window.location.replace(decoyUrl);
    }

    runBootSequence();
});
