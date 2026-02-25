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
            // THE REDIRECT: Once finished, move to main.html
            setTimeout(() => {
                loaderWrapper.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = 'gateway.html';
                }, 800); // Wait for the fade animation to finish
            }, 500);
        }
    }

    runBootSequence();
});
