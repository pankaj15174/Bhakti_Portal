// jaap_counter.js

const jaapMessageInput = document.getElementById('jaapMessage');
const targetCountInput = document.getElementById('targetCount');
const startButton = document.getElementById('startButton');
const currentCountSpan = document.getElementById('currentCount');
const tapToCountButton = document.getElementById('tapToCount');
const bellSound = document.getElementById('bellSound');
const timeDisplay = document.getElementById('timeDisplay'); // New element for "Time"

let targetCount = 0;
let currentCount = 0;
let timeInstance = 0; // New variable for "Time" counter
let recognition; // Will hold the SpeechRecognition object
let isJaapRunning = false; // To track if the Jaap is actively running

// --- Speech Recognition Setup ---
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false; // Only return final results
    recognition.lang = 'en-US'; // Set language, adjust as needed

    recognition.onresult = function(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
            }
        }
        console.log("Speech recognized:", transcript);

        const jaapMessage = jaapMessageInput.value.trim();
        if (isJaapRunning && jaapMessage && transcript.toLowerCase().includes(jaapMessage.toLowerCase())) {
            incrementCount();
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access for speech recognition to work.');
            stopJaap(); // Stop if permission is denied
        } else if (event.error === 'no-speech') {
            console.log('No speech detected, continuing to listen.');
        } else {
            // alert('An error occurred with speech recognition: ' + event.error);
            console.error('An unhandled error occurred with speech recognition:', event.error);
            // Optionally, you might want to stop or restart here based on error type
        }
    };

    recognition.onend = function() {
        console.log('Speech recognition ended.');
        // If Jaap is running and not explicitly stopped, restart recognition
        if (isJaapRunning) {
            console.log('Restarting speech recognition...');
            recognition.start();
        }
    };
} else {
    alert("Speech Recognition not supported in this browser. Please use Chrome or a similar browser.");
    startButton.disabled = true;
    tapToCountButton.disabled = true; // Disable tap button too if voice isn't working as intended
}

// --- Functions ---

function incrementCount() {
    if (!isJaapRunning) return; // Only increment if Jaap is running

    currentCount++;
    currentCountSpan.textContent = currentCount;

    if (currentCount === targetCount) {
        bellSound.play(); // Play sound immediately
        timeInstance++; // Increment time instance
        timeDisplay.textContent = timeInstance; // Update time display
        currentCount = 0; // Reset current count
        currentCountSpan.textContent = currentCount; // Update display immediately
    }
}

function startJaap() {
    const message = jaapMessageInput.value.trim();
    const count = parseInt(targetCountInput.value, 10);

    if (!message) {
        alert('Please provide the Jaap Message.');
        return;
    }
    if (isNaN(count) || count <= 0) {
        alert('Please provide a valid Target Count (a positive number).');
        return;
    }

    targetCount = count;
    currentCount = 0;
    timeInstance = 0; // Reset time instance on new start
    currentCountSpan.textContent = currentCount;
    timeDisplay.textContent = timeInstance; // Update time display

    isJaapRunning = true; // Set Jaap as running

    if (recognition) {
        try {
            recognition.start();
            console.log('Speech recognition started.');
            startButton.textContent = 'Stop Jaap';
            startButton.style.backgroundColor = '#f44336'; // Red
            jaapMessageInput.disabled = true; // Disable inputs while running
            targetCountInput.disabled = true;
        } catch (e) {
            console.error('Error starting speech recognition:', e);
            if (e.name === 'InvalidStateError') {
                // This can happen if start is called when already running or during a brief end state
                console.warn('Speech recognition was already active or in invalid state, attempting to restart.');
                // We'll let onend handle the restart if it was a temporary state
            } else {
                alert('Could not start speech recognition. Make sure you grant microphone access.');
                stopJaap(); // Stop the process if we can't start
            }
        }
    } else {
        alert("Speech Recognition is not available.");
        stopJaap(); // Ensure consistent state if no recognition
    }
}

function stopJaap() {
    isJaapRunning = false; // Set Jaap as stopped

    if (recognition) {
        recognition.stop();
        console.log('Speech recognition stopped.');
    }
    startButton.textContent = 'Start Jaap';
    startButton.style.backgroundColor = '#4CAF50'; // Green
    jaapMessageInput.disabled = false; // Re-enable inputs
    targetCountInput.disabled = false;
}

// --- Event Listeners ---

startButton.addEventListener('click', () => {
    if (isJaapRunning) { // Check the running state directly
        stopJaap();
    } else {
        startJaap();
    }
});

tapToCountButton.addEventListener('click', incrementCount);

// Initial state on load
stopJaap(); // Ensure everything is in a stopped state initially