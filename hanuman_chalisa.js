// hanuman_chalisa.js

const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const targetInstancesInput = document.getElementById('targetInstances');
const startButton = document.getElementById('startButton');
const hindiButton = document.getElementById('hindiButton'); // New button
const englishButton = document.getElementById('englishButton'); // New button
const currentInstanceSpan = document.getElementById('currentInstance');
const chalisaContent = document.getElementById('chalisaContent');
const bellSound = document.getElementById('bellSound');

let totalDurationMs = 0;
let actualScrollDurationMs = 0;
let targetInstances = 0;
let currentInstance = 0;
let scrollAnimationFrameId = null;
let freezeTimeoutId = null;
let isChalisaRunning = false;
let currentLanguage = 'english'; // Default language

const FREEZE_DURATION_MS = 5000; // 5 seconds freeze at start and end

// --- Hanuman Chalisa Texts ---
const hanumanChalisaTexts = {
    english: `
        <p>Shri Guru Charan Saroj Raj, Nij Man Mukur Sudhari.</p>
        <p>Barnau Raghuvar Bimal Jasu, Jo Dayak Phal Chari.</p>
        <p>Buddhi heen Tanu Janike, Sumirau Pavan Kumar.</p>
        <p>Bal Buddhi Vidya Dehu Mohi, Harahu Kalesh Vikar.</p>
        <br>
        <p>Jai Hanuman Gyan Gun Sagar.</p>
        <p>Jai Kapis Tihu Lok Ujagar.</p>
        <p>Ram Doot Atulit Bal Dhama.</p>
        <p>Anjani Putra Pavan Sut Nama.</p>
        <p>Mahabir Bikram Bajrangi.</p>
        <p>Kumati Nivar Sumati Ke Sangi.</p>
        <p>Kanchan Baran Biraj Subesa.</p>
        <p>Kanan Kundal Kunchit Kesa.</p>
        <br>
        <p>Hath Bajra Aur Dhvaja Birajai.</p>
        <p>Kandhe Moonj Janeu Sajai.</p>
        <p>Shankar Suvan Kesari Nandan.</p>
        <p>Tej Pratap Maha Jag Bandan.</p>
        <p>Vidya Van Guni Ati Chatur.</p>
        <p>Ram Kaj Karibe Ko Atur.</p>
        <p>Prabhu Charitra Sunibe Ko Rasiya.</p>
        <p>Ram Lakhan Sita Man Basiya.</p>
        <br>
        <p>Sukshma Roop Dhari Siyahi Dikhawa.</p>
        <p>Bikat Roop Dhari Lank Jarawa.</p>
        <p>Bhim Roop Dhari Asur Sanhare.</p>
        <p>Ramchandra Ke Kaj Sanvare.</p>
        <p>Lay Sanjivan Lakhan Jiyaye.</p>
        <p>Shri Raghubir Harashi Ur Laye.</p>
        <br>
        <p>Raghupati Kinhi Bahut Badai.</p>
        <p>Tum Mam Priya Bharat Hi Sam Bhai.</p>
        <p>Sahas Badan Tumhro Jas Gaavein.</p>
        <p>As Kahi Shri Pati Kanth Lagavein.</p>
        <p>Sankadik Bramhadi Munisa.</p>
        <p>Narad Sarad Sahit Ahisa.</p>
        <p>Jam Kuber Digpal Jahan Te.</p>
        <p>Kavi Kobid Kahi Sake Kahan Te.</p>
        <br>
        <p>Tum Upkar Sugreevahi Keenha.</p>
        <p>Ram Milay Rajpad Deenha.</p>
        <p>Tumhro Mantra Vibhishan Mana.</p>
        <p>Lankeshwar Bhaye Sab Jag Jana.</p>
        <p>Jug Sahasra Jojan Par Bhanu.</p>
        <p>Leelyo Tahi Madhur Phal Janu.</p>
        <br>
        <p>Prabhu Mudrika Meli Mukh Mahi.</p>
        <p>Jaladhi Ladhi Gaye Achraj Nahi.</p>
        <p>Durgam Kaj Jagat Ke Jete.</p>
        <p>Sugam Anugrah Tumhre Tete.</p>
        <p>Ram Duare Tum Rakhvare.</p>
        <p>Hot Na Agya Binu Paisare.</p>
        <br>
        <p>Sab Sukh Lahai Tumhari Sarna.</p>
        <p>Tum Rakshak Kahu Ko Darna.</p>
        <p>Aapan Tej Samharo Aapai.</p>
        <p>Tino Lok Hank Te Kanpai.</p>
        <p>Bhoot Pisach Nikat Nahi Avei.</p>
        <p>Mahabir Jab Nam Sunavei.</p>
        <p>Nase Rog Hare Sab Peera.</p>
        <p>Japat Nirantar Hanuman Beera.</p>
        <br>
        <p>Sankat Te Hanuman Chudavei.</p>
        <p>Man Kram Bachan Dhyan Jo Lavei.</p>
        <p>Sab Par Ram Tapasvi Raja.</p>
        <p>Tin Ke Kaj Sakal Tum Saja.</p>
        <p>Aur Manorath Jo Koi Lavei.</p>
        <p>Soi Amit Jivan Phal Pavei.</p>
        <p>Charo Jug Partap Tumhara.</p>
        <p>Hai Parsiddh Jagat Ujiyara.</p>
        <br>
        <p>Sadhu Sant Ke Tum Rakhvare.</p>
        <p>Asur Nikandan Ram Dulare.</p>
        <p>Ashta Siddhi Nav Niddhi Ke Data.</p>
        <p>As Bar Deen Janaki Mata.</p>
        <p>Ram Rasayan Tumhre Pasa.</p>
        <p>Sada Raho Raghupati Ke Dasa.</p>
        <br>
        <p>Tumhre Bhajan Ram Ko Pavai.</p>
        <p>Janam Janam Ke Dukh Bisravai.</p>
        <p>Ant Kal Raghuvar Pur Jai.</p>
        <p>Jahan Janm Hari Bhakt Kahai.</p>
        <p>Aur Devta Chitt Na Dharai.</p>
        <p>Hanumat Sei Sarva Sukh Karai.</p>
        <br>
        <p>Sankat Kate Mite Sab Peera.</p>
        <p>Jo Sumire Hanumat Balbeera.</p>
        <p>Jai Jai Jai Hanuman Gosai.</p>
        <p>Kripa Karahu Gurudev Ki Nai.</p>
        <p>Jo Sat Bar Path Kare Koi.</p>
        <p>Chhutahi Bandi Maha Sukh Hoi.</p>
        <br>
        <p>Jo Yah Padhe Hanuman Chalisa.</p>
        <p>Hoye Siddhi Sakhi Gaurisa.</p>
        <p>Tulsidas Sada Hari Chera.</p>
        <p>Kije Nath Hriday Mah Dera.</p>
        <br>
        <p>Pavan Tanay Sankat Haran, Mangal Murati Roop.</p>
        <p>Ram Lakhan Sita Sahit, Hriday Basahu Sur Bhoop.</p>
    `,
    hindi: `
        <p>श्री गुरु चरण सरोज रज, निज मन मुकुर सुधारि।</p>
        <p>बरनऊँ रघुवर बिमल जसु, जो दायक फल चारि॥</p>
        <br>
        <p>बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।</p>
        <p>बल बुद्धि विद्या देहु मोहिं, हरहु कलेश विकार॥</p>
        <br>
        <p>जय हनुमान ज्ञान गुन सागर।</p>
        <p>जय कपीस तिहुँ लोक उजागर॥</p>
        <p>राम दूत अतुलित बल धामा।</p>
        <p>अंजनि पुत्र पवनसुत नामा॥</p>
        <p>महाबीर बिक्रम बजरंगी।</p>
        <p>कुमति निवार सुमति के संगी॥</p>
        <p>कंचन बरन बिराज सुबेसा।</p>
        <p>कानन कुण्डल कुंचित केसा॥</p>
        <br>
        <p>हाथ बज्र औ ध्वजा बिराजै।</p>
        <p>काँधे मूँज जनेऊ साजै॥</p>
        <p>शंकर सुवन केसरी नंदन।</p>
        <p>तेज प्रताप महा जग वंदन॥</p>
        <p>विद्यावान गुनी अति चातुर।</p>
        <p>राम काज करिबे को आतुर॥</p>
        <p>प्रभु चरित्र सुनिबे को रसिया।</p>
        <p>राम लखन सीता मन बसिया॥</p>
        <br>
        <p>सूक्ष्म रूप धरि सियहिं दिखावा।</p>
        <p>बिकट रूप धरि लंक जरावा॥</p>
        <p>भीम रूप धरि असुर संहारे।</p>
        <p>रामचन्द्र के काज सँवारे॥</p>
        <p>लाय सजीवन लखन जियाये।</p>
        <p>श्री रघुबीर हरषि उर लाये॥</p>
        <br>
        <p>रघुपति कीन्ही बहुत बड़ाई।</p>
        <p>तुम मम प्रिय भरतहि सम भाई॥</p>
        <p>सहस बदन तुम्हरो जस गावैं।</p>
        <p>अस कहि श्रीपति कंठ लगावैं॥</p>
        <p>सनकादिक ब्रह्मादि मुनीसा।</p>
        <p>नारद सारद सहित अहीसा॥</p>
        <p>जम कुबेर दिगपाल जहाँ ते।</p>
        <p>कबि कोबिद कहि सके कहाँ ते॥</p>
        <br>
        <p>तुम उपकार सुग्रीवहिं कीन्हा।</p>
        <p>राम मिलाय राज पद दीन्हा॥</p>
        <p>तुम्हरो मंत्र बिभीषन माना।</p>
        <p>लंकेश्वर भए सब जग जाना॥</p>
        <p>जुग सहस्र जोजन पर भानू।</p>
        <p>लील्यो ताहि मधुर फल जानू॥</p>
        <br>
        <p>प्रभु मुद्रिका मेलि मुख माहीं।</p>
        <p>जलधि लाँघि गये अचरज नाहीं॥</p>
        <p>दुर्गम काज जगत के जेते।</p>
        <p>सुगम अनुग्रह तुम्हरे तेते॥</p>
        <p>राम दुआरे तुम रखवारे।</p>
        <p>होत न आज्ञा बिनु पैसारे॥</p>
        <br>
        <p>सब सुख लहै तुम्हारी सरना।</p>
        <p>तुम रक्षक काहू को डरना॥</p>
        <p>आपन तेज सम्हारो आपै।</p>
        <p>तीनों लोक हाँक ते काँपै॥</p>
        <p>भूत पिसाच निकट नहिं आवै।</p>
        <p>महाबीर जब नाम सुनावै॥</p>
        <p>नासै रोग हरै सब पीरा।</p>
        <p>जपत निरंतर हनुमत बीरा॥</p>
        <br>
        <p>संकट तै हनुमान छुड़ावै।</p>
        <p>मन क्रम बचन ध्यान जो लावै॥</p>
        <p>सब पर राम तपस्वी राजा।</p>
        <p>तिन के काज सकल तुम साजा॥</p>
        <p>और मनोरथ जो कोई लावै।</p>
        <p>सोइ अमित जीवन फल पावै॥</p>
        <p>चारों जुग परताप तुम्हारा।</p>
        <p>है परसिद्ध जगत उजियारा॥</p>
        <br>
        <p>साधु संत के तुम रखवारे।</p>
        <p>असुर निकंदन राम दुलारे॥</p>
        <p>अष्ट सिद्धि नौ निधि के दाता।</p>
        <p>अस बर दीन जानकी माता॥</p>
        <p>राम रसायन तुम्हरे पासा।</p>
        <p>सदा रहो रघुपति के दासा॥</p>
        <br>
        <p>तुम्हरे भजन राम को भावै।</p>
        <p>जनम जनम के दुख बिसरावै॥</p>
        <p>अंत काल रघुवर पुर जाई।</p>
        <p>जहाँ जन्म हरि भक्त कहाई॥</p>
        <p>और देवता चित्त न धरई।</p>
        <p>हनुमत सेइ सर्ब सुख करई॥</p>
        <br>
        <p>संकट कटै मिटै सब पीरा।</p>
        <p>जो सुमिरै हनुमत बलबीरा॥</p>
        <p>जय जय जय हनुमान गोसाईं।</p>
        <p>कृपा करहु गुरुदेव की नाईं॥</p>
        <p>जो सत बार पाठ कर कोई।</p>
        <p>छूटहि बंदि महा सुख होई॥</p>
        <br>
        <p>जो यह पढ़ै हनुमान चालीसा।</p>
        <p>होय सिद्धि साखी गौरीसा॥</p>
        <p>तुलसीदास सदा हरि चेरा।</p>
        <p>कीजै नाथ हृदय महँ डेरा॥</p>
        <br>
        <p>पवन तनय संकट हरन, मंगल मूरति रूप।</p>
        <p>राम लखन सीता सहित, हृदय बसहु सुर भूप॥</p>
    `
};

// --- Functions ---

function calculateDurations() {
    const mins = parseInt(minutesInput.value, 10) || 0;
    const secs = parseInt(secondsInput.value, 10) || 0;
    totalDurationMs = (mins * 60 + secs) * 1000;

    if (totalDurationMs <= (FREEZE_DURATION_MS * 2)) {
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
    startButton.style.backgroundColor = running ? '#f44336' : '#007bff';

    // Disable language buttons when Chalisa is running
    hindiButton.disabled = running;
    englishButton.disabled = running;
}

function startScrollCycle() {
    if (!isChalisaRunning) return;

    chalisaContent.scrollTop = 0;

    console.log('Freezing at start for 5 seconds...');
    freezeTimeoutId = setTimeout(() => {
        if (!isChalisaRunning) return;
        console.log('Starting scroll...');
        animateScrollingDown();
    }, FREEZE_DURATION_MS);
}

function animateScrollingDown() {
    let startTime = null;
    const startScrollPos = chalisaContent.scrollTop;
    const endScrollPos = chalisaContent.scrollHeight - chalisaContent.clientHeight;

    const scrollStep = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / actualScrollDurationMs;
        const scrollAmount = startScrollPos + (endScrollPos - startScrollPos) * progress;

        chalisaContent.scrollTop = scrollAmount;

        if (progress < 1) {
            scrollAnimationFrameId = requestAnimationFrame(scrollStep);
        } else {
            chalisaContent.scrollTop = endScrollPos;
            console.log('Scrolling completed. Freezing at end for 5 seconds...');

            freezeTimeoutId = setTimeout(() => {
                if (!isChalisaRunning) return;
                console.log('End freeze completed. Playing bell and checking instance...');

                bellSound.play();
                currentInstance++;
                currentInstanceSpan.textContent = currentInstance;

                if (currentInstance >= targetInstances) {
                    stopChalisa();
                    console.log(`Target of ${targetInstances} Chalisa recitations reached!`);
                } else {
                    console.log('Target not yet reached, restarting cycle...');
                    startScrollCycle();
                }
            }, FREEZE_DURATION_MS);
        }
    };

    scrollAnimationFrameId = requestAnimationFrame(scrollStep);
}


function startChalisa() {
    if (!calculateDurations()) return;

    targetInstances = parseInt(targetInstancesInput.value, 10);
    if (isNaN(targetInstances) || targetInstances <= 0) {
        alert('Please enter a valid Target Times (a positive number).');
        return;
    }

    currentInstance = 0;
    currentInstanceSpan.textContent = currentInstance;

    isChalisaRunning = true;
    updateControlsState(true);

    startScrollCycle();
}

function stopChalisa() {
    isChalisaRunning = false;
    updateControlsState(false);

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

// Function to set the Chalisa text language
function setChalisaLanguage(language) {
    if (isChalisaRunning) {
        alert("Please stop the current recitation before changing language.");
        return;
    }
    currentLanguage = language;
    chalisaContent.innerHTML = hanumanChalisaTexts[language];

    // Toggle button visibility
    if (language === 'hindi') {
        hindiButton.classList.add('hidden');
        englishButton.classList.remove('hidden');
    } else {
        englishButton.classList.add('hidden');
        hindiButton.classList.remove('hidden');
    }

    // Scroll back to top after language change
    chalisaContent.scrollTop = 0;
}

// --- Event Listeners ---
startButton.addEventListener('click', () => {
    if (isChalisaRunning) {
        stopChalisa();
    } else {
        startChalisa();
    }
});

hindiButton.addEventListener('click', () => {
    setChalisaLanguage('hindi');
});

englishButton.addEventListener('click', () => {
    setChalisaLanguage('english');
});

// --- Initial Setup ---
updateControlsState(false);
currentInstanceSpan.textContent = 0;
setChalisaLanguage('english'); // Set default language on load