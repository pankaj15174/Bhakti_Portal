// hanuman_chalisa.js

const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const targetInstancesInput = document.getElementById('targetInstances');
const startButton = document.getElementById('startButton');
const currentInstanceSpan = document.getElementById('currentInstance');
const chalisaContent = document.getElementById('chalisaContent');
const bellSound = document.getElementById('bellSound');

let totalDurationMs = 0; // Total time including freezes
let actualScrollDurationMs = 0; // Time spent actively scrolling
let targetInstances = 0;
let currentInstance = 0;
let scrollAnimationFrameId = null; // To store the requestAnimationFrame ID
let freezeTimeoutId = null; // To store the setTimeout ID for freezes
let isChalisaRunning = false; // To track if the process is active

const FREEZE_DURATION_MS = 5000; // 5 seconds freeze at start and end

function calculateDurations() {
    const mins = parseInt(minutesInput.value, 10) || 0;
    const secs = parseInt(secondsInput.value, 10) || 0;
    totalDurationMs = (mins * 60 + secs) * 1000;

    if (totalDurationMs <= (FREEZE_DURATION_MS * 2)) { // Total time must be greater than 10 seconds (2 * 5s freezes)
        alert(`Total time must be greater than ${FREEZE_DURATION_MS / 1000 * 2} seconds to accommodate the freeze periods.`);
        return false;
    }

    actualScrollDurationMs = totalDurationMs - (FREEZE_DURATION_MS * 2);
    console.log(`Total duration: ${totalDurationMs / 1000}s, Actual scroll duration: ${actualScrollDurationMs / 1000}s`);
    return true;
}

function updateControlsState(running) {
    minutesInput.disabled = running;
    secondsInput.disabled = running;
    targetInstancesInput.disabled = running;
    startButton.textContent = running ? 'Stop Chalisa' : 'Start Chalisa';
    startButton.style.backgroundColor = running ? '#f44336' : '#007bff'; // Red for stop, blue for start
}

function startScrollCycle() {
    if (!isChalisaRunning) return; // Ensure it's still intended to be running

    chalisaContent.scrollTop = 0; // Ensure it starts from the very top

    // Freeze at the beginning
    console.log('Freezing at start for 5 seconds...');
    freezeTimeoutId = setTimeout(() => {
        if (!isChalisaRunning) return; // Check again in case it was stopped during freeze
        console.log('Starting scroll...');
        animateScrollingDown();
    }, FREEZE_DURATION_MS);
}

function animateScrollingDown() {
    let startTime = null;
    const startScrollPos = chalisaContent.scrollTop; // Should be 0
    const endScrollPos = chalisaContent.scrollHeight - chalisaContent.clientHeight;

    const scrollStep = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / actualScrollDurationMs;
        const scrollAmount = startScrollPos + (endScrollPos - startScrollPos) * progress;

        chalisaContent.scrollTop = scrollAmount;

        if (progress < 1) {
            scrollAnimationFrameId = requestAnimationFrame(scrollStep);
        } else {
            // Scrolling to bottom completed
            chalisaContent.scrollTop = endScrollPos; // Ensure it's exactly at the bottom
            console.log('Scrolling completed. Freezing at end for 5 seconds...');

            // Freeze at the end
            freezeTimeoutId = setTimeout(() => {
                if (!isChalisaRunning) return; // Check again in case it was stopped during freeze
                console.log('End freeze completed. Playing bell and checking instance...');

                bellSound.play();
                currentInstance++;
                currentInstanceSpan.textContent = currentInstance;

                if (currentInstance >= targetInstances) {
                    stopChalisa(); // Stop if target instances reached
                    console.log(`Target of ${targetInstances} Chalisa recitations reached!`);
                } else {
                    // Not target, restart the whole cycle
                    console.log('Target not yet reached, restarting cycle...');
                    startScrollCycle(); // Start next cycle
                }
            }, FREEZE_DURATION_MS);
        }
    };

    scrollAnimationFrameId = requestAnimationFrame(scrollStep);
}

function startChalisa() {
    if (!calculateDurations()) return; // Validates time and sets actualScrollDurationMs

    targetInstances = parseInt(targetInstancesInput.value, 10);
    if (isNaN(targetInstances) || targetInstances <= 0) {
        alert('Please enter a valid Target Times (a positive number).');
        return;
    }

    currentInstance = 0;
    currentInstanceSpan.textContent = currentInstance; // Reset display

    isChalisaRunning = true;
    updateControlsState(true); // Disable inputs and change button text

    startScrollCycle(); // Start the first cycle (which includes the initial freeze)
}

function stopChalisa() {
    isChalisaRunning = false;
    updateControlsState(false); // Enable inputs and change button text

    if (scrollAnimationFrameId) {
        cancelAnimationFrame(scrollAnimationFrameId);
        scrollAnimationFrameId = null;
    }
    if (freezeTimeoutId) {
        clearTimeout(freezeTimeoutId);
        freezeTimeoutId = null;
    }
    console.log('Chalisa scrolling stopped.');
}

// --- Event Listeners ---
startButton.addEventListener('click', () => {
    if (isChalisaRunning) {
        stopChalisa();
    } else {
        startChalisa();
    }
});

// Initial state
updateControlsState(false);
currentInstanceSpan.textContent = 0; // Ensure initial display is 0