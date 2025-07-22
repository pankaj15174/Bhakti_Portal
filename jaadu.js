// jaadu.js

document.addEventListener('DOMContentLoaded', () => {
    const displayLetter = document.getElementById('displayLetter');
    const completionMessage = document.getElementById('completionMessage');
    const resetButton = document.getElementById('resetButton');

    // Get references to all the audio elements
    const sounds = [
        document.getElementById('sound01'),
        document.getElementById('sound02'),
        document.getElementById('sound03'),
        document.getElementById('sound04')
    ];

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let currentLetterIndex = 0; // Tracks which letter we are currently on (A, B, C...)

    // Function to play a sound
    function playSound(audioElement) {
        if (!audioElement) {
            console.warn("Audio element not found!");
            return;
        }
        audioElement.currentTime = 0; // Rewind to start if already playing
        audioElement.play().catch(e => console.error("Error playing sound:", e));
    }

    // Function to update the displayed letter
    function updateDisplay() {
        if (currentLetterIndex < alphabet.length) {
            displayLetter.textContent = alphabet[currentLetterIndex];
            completionMessage.classList.add('hidden');
            resetButton.classList.add('hidden');
            displayLetter.classList.remove('hidden');
        } else {
            // End of the sequence (Z has been pressed)
            displayLetter.classList.add('hidden');
            completionMessage.classList.remove('hidden');
            resetButton.classList.remove('hidden');
            console.log("Sequence complete!");
        }
    }

    // Reset function
    function resetJaadu() {
        currentLetterIndex = 0;
        updateDisplay();
    }

    // Listen for any keydown event on the entire document
    document.addEventListener('keydown', (event) => {
        // Only proceed if the Jaadu sequence is not yet complete
        if (currentLetterIndex >= alphabet.length) {
            return; // Sequence is finished, ignore key presses
        }

        // Get the key pressed by the user and convert to uppercase
        const pressedKey = event.key.toUpperCase();
        // Get the letter we are currently expecting
        const expectedLetter = alphabet[currentLetterIndex];

        // Check if the pressed key matches the expected letter
        if (pressedKey === expectedLetter) {
            // Determine which sound to play based on the current letter's position
            // Sounds cycle 01, 02, 03, 04, 01, 02...
            const soundToPlayIndex = currentLetterIndex % sounds.length;
            playSound(sounds[soundToPlayIndex]);

            // Move to the next letter
            currentLetterIndex++;
            updateDisplay(); // Update display for the next letter
        } else if (alphabet.includes(pressedKey)) {
            // If it's a letter, but the wrong one
            console.log(`Wrong key! Expected "${expectedLetter}", but pressed "${pressedKey}".`);
            // Optionally, you could play a "wrong" sound or show a temporary message.
        }
        // Ignore non-alphabetic keys
    });

    // Reset button event listener
    resetButton.addEventListener('click', resetJaadu);

    // Initial display when the page loads
    updateDisplay();
});