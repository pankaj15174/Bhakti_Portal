// jaadu.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const funModeBtn = document.getElementById('funModeBtn');
    const learnModeBtn = document.getElementById('learnModeBtn');
    const learnSubMenu = document.getElementById('learnSubMenu');
    const alphabetsBtn = document.getElementById('alphabetsBtn');
    const numbersBtn = document.getElementById('numbersBtn');
    const tensSelection = document.getElementById('tensSelection');
    const tensButtonsContainer = document.querySelector('.tens-buttons-container');
    const startFromOneBtn = document.getElementById('startFromOneBtn');
    const expandedNumbersContainer = document.getElementById('expandedNumbers'); // NEW
    const instructionText = document.getElementById('instructionText');
    const displayMain = document.getElementById('displayMain');
    const displaySub = document.getElementById('displaySub');
    const completionMessage = document.getElementById('completionMessage');
    const resetButton = document.getElementById('resetButton');

    // --- State Variables ---
    let currentMode = 'fun';
    let currentLearnMode = null;
    let currentLetterIndex = 0;
    let currentNumberIndex = 1;
    let currentAudio = null;
    let currentInput = '';
    let inputTimeout = null;
    let isProcessing = false;

    // --- Data ---
    const funSounds = [
        new Audio('01.mp3'),
        new Audio('02.mp3'),
        new Audio('03.mp3'),
        new Audio('04.mp3')
    ];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
        '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
        '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
        '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
        '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
        '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
        '81', '82', '83', '84', '85', '86', '87', '88', '89', '90',
        '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'
    ];
    const numberSpellings = [
        'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty',
        'Twenty-one', 'Twenty-two', 'Twenty-three', 'Twenty-four', 'Twenty-five', 'Twenty-six', 'Twenty-seven', 'Twenty-eight', 'Twenty-nine', 'Thirty',
        'Thirty-one', 'Thirty-two', 'Thirty-three', 'Thirty-four', 'Thirty-five', 'Thirty-six', 'Thirty-seven', 'Thirty-eight', 'Thirty-nine', 'Forty',
        'Forty-one', 'Forty-two', 'Forty-three', 'Forty-four', 'Forty-five', 'Forty-six', 'Forty-seven', 'Forty-eight', 'Forty-nine', 'Fifty',
        'Fifty-one', 'Fifty-two', 'Fifty-three', 'Fifty-four', 'Fifty-five', 'Fifty-six', 'Fifty-seven', 'Fifty-eight', 'Fifty-nine', 'Sixty',
        'Sixty-one', 'Sixty-two', 'Sixty-three', 'Sixty-four', 'Sixty-five', 'Sixty-six', 'Sixty-seven', 'Sixty-eight', 'Sixty-nine', 'Seventy',
        'Seventy-one', 'Seventy-two', 'Seventy-three', 'Seventy-four', 'Seventy-five', 'Seventy-six', 'Seventy-seven', 'Seventy-eight', 'Seventy-nine', 'Eighty',
        'Eighty-one', 'Eighty-two', 'Eighty-three', 'Eighty-four', 'Eighty-five', 'Eighty-six', 'Eighty-seven', 'Eighty-eight', 'Eighty-nine', 'Ninety',
        'Ninety-one', 'Ninety-two', 'Ninety-three', 'Ninety-four', 'Ninety-five', 'Ninety-six', 'Ninety-seven', 'Ninety-eight', 'Ninety-nine', 'One Hundred'
    ];


    // --- Functions ---
    function playSound(path, onEndedCallback) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        currentAudio = new Audio(path);
        currentAudio.onended = onEndedCallback;
        currentAudio.play().catch(e => console.error("Error playing sound:", e));
    }

    function updateUI() {
        // Hide all main interactive elements by default
        completionMessage.classList.add('hidden');
        resetButton.classList.add('hidden');
        instructionText.classList.add('hidden');
        displayMain.classList.add('hidden');
        displaySub.classList.add('hidden');
        learnSubMenu.classList.add('hidden');
        tensSelection.classList.add('hidden');
        expandedNumbersContainer.classList.add('hidden'); // NEW: Hide expanded grid

        currentInput = '';

        if (currentMode === 'fun') {
            instructionText.classList.remove('hidden');
            displayMain.classList.remove('hidden');
            displaySub.classList.remove('hidden');
            instructionText.textContent = `Please Press`;
            displayMain.textContent = alphabet[currentLetterIndex];
            displaySub.textContent = '';
        } else if (currentMode === 'learn') {
            learnSubMenu.classList.remove('hidden');
            if (currentLearnMode === 'alphabets') {
                instructionText.classList.remove('hidden');
                displayMain.classList.remove('hidden');
                displaySub.classList.remove('hidden');
                instructionText.textContent = `Please Press`;
                displayMain.textContent = alphabet[currentLetterIndex];
                displaySub.textContent = '';
            } else if (currentLearnMode === 'numbers') {
                // If a number sequence has started (currentNumberIndex > 0)
                if (currentNumberIndex > 0) {
                    instructionText.classList.remove('hidden');
                    displayMain.classList.remove('hidden');
                    displaySub.classList.remove('hidden');
                    instructionText.textContent = `Please Press`;
                    displayMain.textContent = numbers[currentNumberIndex - 1];
                    displaySub.textContent = numberSpellings[currentNumberIndex - 1];
                } else {
                    // Show tens selection when in numbers mode but no sequence has started
                    tensSelection.classList.remove('hidden');
                    instructionText.textContent = 'Please select a starting number:';
                    instructionText.classList.remove('hidden');
                }
            } else {
                instructionText.classList.remove('hidden');
                instructionText.textContent = `Please select Alphabets or Numbers to begin.`;
            }
        }
    }

    // NEW: Function to generate and display the expanded number grid
    function showExpandedNumbers(startNum) {
        expandedNumbersContainer.innerHTML = '';
        const endNum = Math.min(startNum + 9, 100);
        for (let i = startNum; i <= endNum; i++) {
            const btn = document.createElement('button');
            btn.classList.add('expanded-num-btn');
            btn.textContent = i;
            expandedNumbersContainer.appendChild(btn);
        }
        expandedNumbersContainer.classList.remove('hidden');
    }

    function handleCompletion() {
        instructionText.classList.add('hidden');
        displayMain.classList.add('hidden');
        displaySub.classList.add('hidden');
        completionMessage.classList.remove('hidden');
        resetButton.classList.remove('hidden');
        console.log("Sequence complete!");
    }

    function resetJaadu() {
        currentLetterIndex = 0;
        currentNumberIndex = 0; // Reset to 0 to indicate selection screen
        currentInput = '';
        if (inputTimeout) clearTimeout(inputTimeout);
        isProcessing = false;
        // Reset active class on tens buttons
        document.querySelectorAll('.tens-btn').forEach(btn => btn.classList.remove('active'));
        updateUI();
    }


    // --- Event Handlers ---
    funModeBtn.addEventListener('click', () => {
        funModeBtn.classList.add('active');
        learnModeBtn.classList.remove('active');
        currentMode = 'fun';
        currentLearnMode = null;
        resetJaadu();
    });

    learnModeBtn.addEventListener('click', () => {
        learnModeBtn.classList.add('active');
        funModeBtn.classList.remove('active');
        currentMode = 'learn';
        currentLearnMode = null;
        resetJaadu();
    });

    alphabetsBtn.addEventListener('click', () => {
        alphabetsBtn.classList.add('active');
        numbersBtn.classList.remove('active');
        currentLearnMode = 'alphabets';
        resetJaadu();
    });

    numbersBtn.addEventListener('click', () => {
        alphabetsBtn.classList.remove('active');
        numbersBtn.classList.add('active');
        currentLearnMode = 'numbers';
        currentNumberIndex = 0; // Flag to show tens buttons
        tensSelection.classList.remove('hidden');
        updateUI();
    });
    
    // NEW: Handles clicks on the tens buttons
    tensButtonsContainer.addEventListener('click', (event) => {
        const selectedBtn = event.target;
        document.querySelectorAll('.tens-btn').forEach(btn => btn.classList.remove('active'));
        selectedBtn.classList.add('active');
        
        const selectedNum = parseInt(selectedBtn.textContent.replace('Start from ', ''), 10);
        
        if (!isNaN(selectedNum)) {
            // This is the click that shows the expanded grid
            showExpandedNumbers(selectedNum);
        }
    });

    // NEW: Handles clicks on the expanded numbers
    expandedNumbersContainer.addEventListener('click', (event) => {
        const selectedNum = parseInt(event.target.textContent, 10);
        if (!isNaN(selectedNum)) {
            currentNumberIndex = selectedNum;
            expandedNumbersContainer.classList.add('hidden');
            tensSelection.classList.add('hidden');
            resetButton.classList.remove('hidden');
            updateUI();
        }
    });

    resetButton.addEventListener('click', resetJaadu);

    document.addEventListener('keydown', (event) => {
        if (isProcessing) return;

        const pressedKey = event.key.toUpperCase();

        if (currentMode === 'fun') {
            if (currentLetterIndex >= alphabet.length) { return; }
            const expectedLetter = alphabet[currentLetterIndex];
            if (pressedKey === expectedLetter) {
                const soundToPlayIndex = currentLetterIndex % funSounds.length;
                isProcessing = true;
                playSound(funSounds[soundToPlayIndex].src, () => {
                    isProcessing = false;
                    currentLetterIndex++;
                    currentLetterIndex < alphabet.length ? updateUI() : handleCompletion();
                });
            }
        } else if (currentMode === 'learn' && currentLearnMode === 'alphabets') {
            if (currentLetterIndex >= alphabet.length) { return; }
            const expectedLetter = alphabet[currentLetterIndex];
            if (pressedKey === expectedLetter) {
                isProcessing = true;
                playSound(`sounds/alphabets/${expectedLetter.toLowerCase()}.mp3`, () => {
                    isProcessing = false;
                    currentLetterIndex++;
                    currentLetterIndex < alphabet.length ? updateUI() : handleCompletion();
                });
            }
        } else if (currentMode === 'learn' && currentLearnMode === 'numbers') {
            if (currentNumberIndex > numbers.length || currentNumberIndex < 1) { return; }
            const expectedNumber = numbers[currentNumberIndex - 1];

            if (event.key.match(/^[0-9]$/)) {
                currentInput += event.key;

                if (inputTimeout) {
                    clearTimeout(inputTimeout);
                }
                
                inputTimeout = setTimeout(() => {
                    currentInput = '';
                    console.log('Timeout. Input cleared.');
                }, 4000);

                if (currentInput === expectedNumber) {
                    clearTimeout(inputTimeout);
                    isProcessing = true;
                    
                    playSound(`sounds/numbers/${currentInput}.mp3`, () => {
                        isProcessing = false;
                        currentNumberIndex++;
                        currentNumberIndex <= numbers.length ? updateUI() : handleCompletion();
                    });

                } else if (!expectedNumber.startsWith(currentInput)) {
                    currentInput = '';
                    console.log('Wrong number prefix. Input cleared.');
                }
            }
        }
    });

    // --- Initial Setup ---
    currentMode = 'learn'; // Set default to learn mode
    currentLearnMode = 'numbers'; // And numbers mode
    currentNumberIndex = 0; // To trigger tens selection on load
    updateUI();
});