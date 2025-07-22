// jaap_counter.js

const jaapMessageInput = document.getElementById('jaapMessage');
const targetCountInput = document.getElementById('targetCount');
const startButton = document.getElementById('startButton');
const currentCountSpan = document.getElementById('currentCount');
const tapToCountButton = document.getElementById('tapToCount');
const bellSound = document.getElementById('bellSound');
const timeDisplay = document.getElementById('timeDisplay');
const voiceModeBtn = document.getElementById('voiceModeBtn'); // New button
const tapModeBtn = document.getElementById('tapModeBtn');     // New button

let targetCount = 0;
let currentCount = 0;
let timeInstance = 0;
let recognition; // SpeechRecognition object
let isJaapRunning = false; // Tracks if the Jaap is actively running
let currentMode = 'voice'; // 'voice' or 'tap' - default to voice

// --- Speech Recognition Setup ---
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
            }
        }
        console.log("Speech recognized:", transcript);

        const jaapMessage = jaapMessageInput.value.trim();
        // Only increment if Jaap is running AND in voice mode AND message matches
        if (isJaapRunning && currentMode === 'voice' && jaapMessage && transcript.toLowerCase().includes(jaapMessage.toLowerCase())) {
            incrementCount();
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access for speech recognition to work.');
            stopJaap(); // Stop if permission is denied
        } else if (event.error === 'no-speech') {
            console.log('No speech detected, continuing to listen (if active).');
        } else {
            console.error('An unhandled error occurred with speech recognition:', event.error);
            // Consider stopping or restarting based on error type
        }
    };

    recognition.onend = function() {
        console.log('Speech recognition ended.');
        // Only restart if Jaap is running AND in voice mode
        if (isJaapRunning && currentMode === 'voice') {
            console.log('Restarting speech recognition...');
            recognition.start();
        }
    };
} else {
    alert("Speech Recognition not supported in this browser. Please use Chrome or a similar browser for Voice Mode.");
    voiceModeBtn.disabled = true; // Disable voice mode button if not supported
}

// --- Functions ---

function incrementCount() {
    if (!isJaapRunning) return; // Only increment if Jaap is running

    currentCount++;
    currentCountSpan.textContent = currentCount;

    if (currentCount === targetCount) {
        bellSound.play();
        timeInstance++;
        timeDisplay.textContent = timeInstance;
        currentCount = 0; // Reset current count
        currentCountSpan.textContent = currentCount; // Update display immediately
    }
}

// Controls UI elements based on current mode and running state
function updateUIForMode(mode) {
    // Reset active class for mode buttons
    voiceModeBtn.classList.remove('active');
    tapModeBtn.classList.remove('active');

    if (mode === 'voice') {
        voiceModeBtn.classList.add('active');
        jaapMessageInput.disabled = false; // Enable message input for voice
        tapToCountButton.classList.add('hidden'); // Hide tap button
        tapToCountButton.disabled = true; // Disable tap button interaction
        if (!recognition) voiceModeBtn.disabled = true; // If voice not supported, keep disabled
    } else { // mode === 'tap'
        tapModeBtn.classList.add('active');
        jaapMessageInput.disabled = true; // Disable message input for tap
        tapToCountButton.classList.remove('hidden'); // Show tap button
        tapToCountButton.disabled = false; // Enable tap button interaction
    }

    // Always enable start/stop button based on overall state, not mode selection
    startButton.disabled = false;
    targetCountInput.disabled = false;
}

function startJaap() {
    const count = parseInt(targetCountInput.value, 10);

    if (isNaN(count) || count <= 0) {
        alert('Please provide a valid Target Count (a positive number).');
        return;
    }

    if (currentMode === 'voice') {
        const message = jaapMessageInput.value.trim();
        if (!message) {
            alert('Please provide the Jaap Message for Voice Mode.');
            return;
        }
        if (!recognition) {
            alert("Speech Recognition is not available in this browser.");
            return;
        }
        try {
            recognition.start();
            console.log('Speech recognition started.');
        } catch (e) {
            console.error('Error starting speech recognition:', e);
            if (e.name === 'InvalidStateError') {
                console.warn('Speech recognition was already active or in invalid state. Attempting to restart via onend.');
            } else {
                alert('Could not start speech recognition. Make sure you grant microphone access.');
                return; // Prevent setting isJaapRunning if start fails
            }
        }
    } else { // currentMode === 'tap'
        console.log('Tap mode activated. Speech recognition not started.');
        // Ensure speech recognition is explicitly stopped if it was somehow left running
        if (recognition && recognition.recognizing) {
            recognition.stop();
        }
    }

    targetCount = count;
    currentCount = 0;
    timeInstance = 0;
    currentCountSpan.textContent = currentCount;
    timeDisplay.textContent = timeInstance;

    isJaapRunning = true; // Set Jaap as running
    startButton.textContent = 'Stop Jaap';
    startButton.style.backgroundColor = '#f44336'; // Red

    // Disable relevant inputs while running
    jaapMessageInput.disabled = true;
    targetCountInput.disabled = true;
    voiceModeBtn.disabled = true;
    tapModeBtn.disabled = true;
    if (currentMode === 'tap') { // Re-enable tap button if in tap mode
        tapToCountButton.disabled = false;
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

    // Re-enable inputs and mode buttons
    jaapMessageInput.disabled = false;
    targetCountInput.disabled = false;
    voiceModeBtn.disabled = false;
    tapModeBtn.disabled = false;
    tapToCountButton.disabled = true; // Tap button should always be disabled when not actively running

    // Ensure UI is correctly updated based on current mode after stopping
    updateUIForMode(currentMode);
}

// --- Event Listeners ---

startButton.addEventListener('click', () => {
    if (isJaapRunning) {
        stopJaap();
    } else {
        startJaap();
    }
});

tapToCountButton.addEventListener('click', incrementCount); // This remains unchanged, logic controlled by isJaapRunning & currentMode

voiceModeBtn.addEventListener('click', () => {
    if (isJaapRunning) { // Prevent mode change if already running
        alert("Please stop the current Jaap before changing modes.");
        return;
    }
    currentMode = 'voice';
    updateUIForMode('voice');
});

tapModeBtn.addEventListener('click', () => {
    if (isJaapRunning) { // Prevent mode change if already running
        alert("Please stop the current Jaap before changing modes.");
        return;
    }
    currentMode = 'tap';
    updateUIForMode('tap');
});

// --- Initial Setup ---
// Set default date to today for convenience when page loads
const today = new Date();
taskDateInput.value = today.toISOString().split('T')[0];

stopJaap(); // Ensure everything is in a stopped state initially
updateUIForMode(currentMode); // Set initial UI for default 'voice' mode