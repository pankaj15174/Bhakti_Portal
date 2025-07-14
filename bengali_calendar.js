// bengali_calendar.js

const currentMonthYearDisplay = document.getElementById('currentMonthYear');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const englishCalendarBody = document.querySelector('#englishCalendar tbody');
const bengaliCalendarBody = document.querySelector('#bengaliCalendar tbody');
const bengaliMonthYearDisplay = document.getElementById('bengaliMonthYear');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const eventDetailsContent = document.getElementById('eventDetailsContent');

let currentDisplayDate = new Date(); // Start with today's date
let selectedDateCell = null; // To keep track of the currently selected cell

// --- Bengali Calendar Data (Approximation/Mapping) ---
// This is a simplified mapping. Accurate calculations require complex algorithms.
const bengaliMonths = [
    "বৈশাখ (Baishakh)", "জ্যৈষ্ঠ (Jyaishtha)", "আষাঢ় (Asharh)", "শ্রাবণ (Shrabon)",
    "ভাদ্র (Bhadra)", "আশ্বিন (Ashwin)", "কার্তিক (Kartik)", "অগ্রহায়ণ (Agrahayan)",
    "পৌষ (Paush)", "মাঘ (Magh)", "ফাল্গুন (Falgun)", "চৈত্র (Chaitra)"
];

// Approximate start days for Bengali months relative to Gregorian months in a common year
// This is a rough estimation for display purposes. Exact starts vary by year.
// You might need to adjust these based on the specific Bengali calendar you follow.
const bengaliMonthApproxStartDay = {
    // Gregorian Month Index (0-11): [Bengali Month Index, approximate start day]
    3: [0, 14],  // April: Baishakh starts around 14th
    4: [1, 15],  // May: Jyaishtha starts around 15th
    5: [2, 15],  // June: Asharh starts around 15th
    6: [3, 16],  // July: Shrabon starts around 16th
    7: [4, 16],  // August: Bhadra starts around 16th
    8: [5, 16],  // September: Ashwin starts around 16th
    9: [6, 16],  // October: Kartik starts around 16th
    10: [7, 15], // November: Agrahayan starts around 15th
    11: [8, 15], // December: Paush starts around 15th
    0: [9, 14],  // January: Magh starts around 14th
    1: [10, 13], // February: Falgun starts around 13th
    2: [11, 14]  // March: Chaitra starts around 14th
};


// --- Event Data (You must populate this for your specific dates) ---
// Key format: YYYY-MM-DD
const bengaliCalendarEvents = {
    // Current date is July 14, 2025. Adding some example events for current/upcoming dates.
    "2025-07-14": { // Example for current date
        englishEvent: "Bastille Day (France)",
        bengaliEvent: "রথযাত্রা (Ratha Yatra)",
        tithi: "দ্বিতীয় (Dwitiya)" // Lunar day - this is crucial for guidelines
    },
    "2025-07-15": {
        englishEvent: "World Youth Skills Day",
        bengaliEvent: "পুনর্য়াত্রা (Punar Yatra)",
        tithi: "তৃতীয় (Tritiya)"
    },
    // Example: An Ekadashi date - you need to know this and mark it.
    "2025-07-17": {
        englishEvent: "",
        bengaliEvent: "শয়ন একাদশী (Shayan Ekadashi)",
        tithi: "একাদশী (Ekadashi)" // IMPORTANT: Mark as Ekadashi
    },
    "2025-07-20": {
        englishEvent: "International Chess Day",
        bengaliEvent: "পঞ্চমী তিথি (Panchami Tithi)",
        tithi: "পঞ্চমী (Panchami)"
    },
    "2025-07-23": {
        englishEvent: "",
        bengaliEvent: "বঙ্কিমচন্দ্র চট্টোপাধ্যায় জন্মদিন (Bankim Chandra Chattopadhyay's Birthday)",
        tithi: "অষ্টমী (Ashtami)"
    },
    // Example: An Amavasya date
    "2025-07-26": {
        englishEvent: "",
        bengaliEvent: "শ্রাবণ অমাবস্যা (Shrabon Amavasya)",
        tithi: "অমাবস্যা (Amavasya)" // IMPORTANT: Mark as Amavasya
    },
    // Example: A Purnima date
    "2025-08-10": {
        englishEvent: "",
        bengaliEvent: "গুরু পূর্ণিমা (Guru Purnima)",
        tithi: "পূর্ণিমা (Purnima)" // IMPORTANT: Mark as Purnima
    },
    "2025-08-15": {
        englishEvent: "Indian Independence Day",
        bengaliEvent: "স্বাধীনতা দিবস (Independence Day), শুভ জন্মাষ্টমী (Shubh Janmashtami)",
        tithi: "অষ্টমী (Ashtami)"
    },
    "2025-10-02": {
        englishEvent: "Gandhi Jayanti",
        bengaliEvent: "গান্ধী জয়ন্তী (Gandhi Jayanti), দুর্গাপূজা সপ্তমী (Durga Puja Saptami)",
        tithi: "সপ্তমী (Saptami)"
    },
    "2025-10-03": {
        englishEvent: "",
        bengaliEvent: "দুর্গাপূজা অষ্টমী (Durga Puja Ashtami)",
        tithi: "অষ্টমী (Ashtami)"
    },
    "2025-10-04": {
        englishEvent: "",
        bengaliEvent: "দুর্গাপূজা নবমী (Durga Puja Navami)",
        tithi: "নবমী (Navami)"
    },
    "2025-10-05": {
        englishEvent: "Dussehra",
        bengaliEvent: "বিজয়া দশমী (Bijoya Dashami)",
        tithi: "দশমী (Dashami)"
    },
    // Add more events/tithis as needed for specific dates
};

// --- Guidelines Data ---
// This object defines the 'Do's' and 'Don'ts' based on Tithis, days, or festivals.
// Keys should match the 'tithi' values you put in bengaliCalendarEvents or specific day names/periods.
const guidelines = {
    "একাদশী (Ekadashi)": {
        dos: [
            "Fasting (full or partial) is highly recommended.",
            "Devotional practices like chanting, bhajans, Vishnu puja.",
            "Eat only satvik food if fasting partially (fruits, milk, nuts)."
        ],
        donts: [
            "Avoid rice and grains.",
            "Avoid meat, onion, garlic, lentils.",
            "Refrain from shaving or cutting nails/hair.",
            "Avoid too much sleep or laziness.",
            "Avoid sexual activity."
        ],
        notes: "Rice soaks up more water and the moon’s effect on water is high on Ekadashi, which can disturb body balance, especially the digestive system."
    },
    "অমাবস্যা (Amavasya)": {
        dos: [
            "Good day for tarpan (ancestral offerings).",
            "Perform Pitra puja.",
            "Lighting sesame oil lamp for ancestors."
        ],
        donts: [
            "Avoid starting anything new.",
            "Avoid traveling alone at night.",
            "Avoid non-veg, alcohol.",
            "Avoid cutting hair/nails.",
            "Avoid planting trees or harvesting."
        ],
        notes: ""
    },
    "পূর্ণিমা (Purnima)": {
        dos: [
            "Ideal for Lakshmi Puja, Satyanarayan Katha, and fasting.",
            "Good day for donations (especially of food, clothing).",
            "Keep clean and practice celibacy."
        ],
        donts: [
            "Avoid quarrels, ego clashes.",
            "Avoid excessive food."
        ],
        notes: ""
    },
    "চতুর্দশী (Chaturdashi)": {
        dos: [],
        donts: [
            "Avoid tamasic food (especially Naraka Chaturdashi).",
            "Generally not preferred for auspicious events."
        ],
        notes: ""
    },
    "অষ্টমী (Ashtami)": {
        dos: [],
        donts: [
            "Avoid onion, garlic (during Durga puja or fasting)."
        ],
        notes: "Maintain satvik purity."
    },
    "নবমী (Navami)": {
        dos: [],
        donts: [
            "Avoid onion, garlic (during Durga puja or fasting)."
        ],
        notes: "Maintain satvik purity."
    },
    "মঙ্গলবার (Tuesday)": { // Mangalvar
        dos: [],
        donts: [
            "Avoid cutting nails/hair, considered inauspicious."
        ],
        notes: ""
    },
    "শনিবার (Saturday)": { // Shanivar
        dos: [],
        donts: [
            "Avoid oil massage or washing hair during evening."
        ],
        notes: ""
    },
    // --- Festival/Period specific guidelines ---
    // IMPORTANT: These dates (2025) are examples. You will need to update them annually.
    "Shravan Month": { // Roughly July 16 - Aug 16 in Gregorian for 2025
        dos: [],
        donts: [
            "Avoid onion, garlic, non-veg, brinjal."
        ],
        notes: "Increases body heat; focus on Lord Shiva."
    },
    "Navratri": { // Roughly Sept 25 - Oct 3 in Gregorian for 2025
        dos: [
            "Fasting (grains, salt substitution)."
        ],
        donts: [
            "Avoid grains (use sendha namak if fasting).",
            "Avoid non-veg, onion, garlic."
        ],
        notes: "Fasting rules; to purify mind & body."
    },
    "Kartik Month": { // Roughly Oct 17 - Nov 15 in Gregorian for 2025
        dos: [],
        donts: [
            "Avoid brinjal, meat."
        ],
        notes: "Considered impure in this month."
    },
    "Shraddha Paksha": { // Roughly Sept 2 - Sept 17 in Gregorian for 2025
        dos: [
            "Perform ancestral rites (tarpan, pind daan)."
        ],
        donts: [
            "Don't buy new clothes.",
            "Avoid celebrations (marriages, housewarmings).",
            "Avoid starting new ventures."
        ],
        notes: "Period for paying homage to ancestors."
    }
};

// Define date ranges for broader periods (e.g., festivals spanning multiple days)
// Keys are formatted as 'MM-DD' for start and end, and `year` for the year.
const festivalPeriodsDates = {
    "Shravan Month": {
        "2025": { start: "07-16", end: "08-16" } // Example for 2025
    },
    "Navratri": {
        "2025": { start: "09-25", end: "10-03" } // Example for 2025
    },
    "Kartik Month": {
        "2025": { start: "10-17", end: "11-15" } // Example for 2025
    },
    "Shraddha Paksha": {
        "2025": { start: "09-02", end: "09-17" } // Example for 2025
    }
    // You will need to add more years and update these dates annually for accuracy.
};


// --- Helper Functions ---

function getBengaliDate(gregorianDate) {
    const month = gregorianDate.getMonth();
    const date = gregorianDate.getDate();
    const year = gregorianDate.getFullYear();

    let bengaliMonthIndex = -1;
    let bengaliDay = -1;
    let bengaliYear = year - 593; // Approximate conversion for Bengali Year (Bangabda)

    if (bengaliMonthApproxStartDay[month]) {
        const [bmIndex, startDay] = bengaliMonthApproxStartDay[month];
        if (date >= startDay) {
            bengaliMonthIndex = bmIndex;
            bengaliDay = date - startDay + 1;
        } else {
            // It's the end of the previous Bengali month
            bengaliMonthIndex = (bmIndex - 1 + 12) % 12;
            // This calculation for previous month's day is complex and depends on month length.
            // For simplicity, we'll just indicate it's the previous month's last few days.
            // Here, we'll just show the Gregorian date if it falls before the Bengali month starts.
            return null; // Indicates we cannot precisely map this day
        }
    } else {
         // Handle edge cases where current month starts with previous Bengali month.
         const prevMonthIndex = (month - 1 + 12) % 12;
         if (bengaliMonthApproxStartDay[prevMonthIndex]) {
             const [prevBmIndex, prevStartDay] = bengaliMonthApproxStartDay[prevMonthIndex];
             // Estimate last day of previous Bengali month if current date is before startDay
             const estimatedDaysInPrevBengaliMonth = 30; // Most Bengali months are ~30 days
             if (date < (bengaliMonthApproxStartDay[month] ? bengaliMonthApproxStartDay[month][1] : 1) && bengaliMonthApproxStartDay[month] && bengaliMonthApproxStartDay[month][0] === 0) {
                 bengaliMonthIndex = (bengaliMonthApproxStartDay[month][0] - 1 + 12) % 12; // Chaitra
                 bengaliDay = (estimatedDaysInPrevBengaliMonth - (bengaliMonthApproxStartDay[month][1] - date));
             }
         }
         if (bengaliMonthIndex === -1) return null; // Fallback if no precise mapping
    }

    if (bengaliMonthIndex === 0 && gregorianDate.getMonth() < 3) {
        // If Baishakh (month 0) and Gregorian month is Jan-Mar, it's the next Bengali year
        bengaliYear++;
    }

    // A more robust conversion is needed for edge cases, leap years, and specific panchang rules.
    return {
        day: bengaliDay,
        month: bengaliMonths[bengaliMonthIndex],
        year: bengaliYear
    };
}


function renderCalendar() {
    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth(); // 0-11 for Jan-Dec

    // Set month and year display
    currentMonthYearDisplay.textContent = new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // Clear previous calendar
    englishCalendarBody.innerHTML = '';
    bengaliCalendarBody.innerHTML = '';

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 6 for Saturday
    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let date = 1;

    // Determine the Bengali month name for the Gregorian month being displayed
    let currentBengaliMonthName = "তথ্য নেই"; // "No Info"
    let currentBengaliYear = year - 593; // Rough approximation
    if (bengaliMonthApproxStartDay[month]) {
        currentBengaliMonthName = bengaliMonths[bengaliMonthApproxStartDay[month][0]];
    }
    // Adjust Bengali year for Baishakh (starts mid-April)
    if (month < 3 && bengaliMonthApproxStartDay[0] && new Date(year, month, 1) < new Date(year, 3, bengaliMonthApproxStartDay[3][1])) {
         // If current month is Jan-March, the Bengali year might be the previous one relative to Baishakh
        currentBengaliYear--;
    }


    bengaliMonthYearDisplay.textContent = `${currentBengaliMonthName}, ${currentBengaliYear} বঙ্গাব্দ`;


    for (let i = 0; i < 6; i++) { // Max 6 weeks in a month
        const englishRow = englishCalendarBody.insertRow();
        const bengaliRow = bengaliCalendarBody.insertRow();

        for (let j = 0; j < 7; j++) { // 7 days in a week
            const englishCell = englishRow.insertCell();
            const bengaliCell = bengaliRow.insertCell();

            if (i === 0 && j < firstDayOfMonth) {
                // Empty cells before the first day of the month
                englishCell.classList.add('empty');
                bengaliCell.classList.add('empty');
                englishCell.textContent = '';
                bengaliCell.textContent = '';
            } else if (date > daysInMonth) {
                // Empty cells after the last day of the month
                englishCell.classList.add('empty');
                bengaliCell.classList.add('empty');
                englishCell.textContent = '';
                bengaliCell.textContent = '';
            } else {
                // Fill with dates
                const currentDate = new Date(year, month, date);
                const today = new Date();
                const isToday = currentDate.toDateString() === today.toDateString();

                const formattedDateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                const hasEvent = bengaliCalendarEvents[formattedDateKey];

                // English Calendar Cell
                englishCell.innerHTML = `<span class="english-date">${date}</span>`;
                englishCell.dataset.date = formattedDateKey; // Store date string for easy lookup
                if (isToday) englishCell.classList.add('today');
                if (hasEvent) englishCell.classList.add('has-event');
                englishCell.addEventListener('click', () => selectDate(englishCell, formattedDateKey));

                // Bengali Calendar Cell (simplified: just maps Gregorian day number)
                const bengaliDateInfo = getBengaliDate(currentDate);
                let bengaliDateHtml = '';
                if (bengaliDateInfo && bengaliDateInfo.day !== -1) {
                    bengaliDateHtml = `<span class="bengali-date">${bengaliDateInfo.day}</span>`;
                } else {
                    bengaliDateHtml = '<span class="bengali-date">--</span>'; // Indicate no precise map
                }

                bengaliCell.innerHTML = `<span class="english-date">${date}</span>${bengaliDateHtml}`;
                bengaliCell.dataset.date = formattedDateKey; // Store date string
                if (isToday) bengaliCell.classList.add('today');
                if (hasEvent) bengaliCell.classList.add('has-event');
                bengaliCell.addEventListener('click', () => selectDate(bengaliCell, formattedDateKey));

                date++;
            }
        }
    }
    // Initially select today's date if it's in the current view
    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() === month) {
        const todayCell = englishCalendarBody.querySelector(`td[data-date="${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}"]`);
        if (todayCell) {
            selectDate(todayCell, todayCell.dataset.date);
        }
    } else {
        // Clear selection and event details if changing month
        if (selectedDateCell) {
            selectedDateCell.classList.remove('selected');
            // Also remove from the paired cell in the other calendar
            const pairedCellSelector = `#${selectedDateCell.closest('.calendar').id === 'englishCalendar' ? 'bengali' : 'english'}Calendar tbody td[data-date="${selectedDateCell.dataset.date}"]`;
            const pairedCell = document.querySelector(pairedCellSelector);
            if (pairedCell) {
                pairedCell.classList.remove('selected');
            }
            selectedDateCell = null;
        }
        selectedDateDisplay.textContent = ' ';
        eventDetailsContent.innerHTML = '<p>Click on a date to see its details.</p>';
    }
}

function selectDate(cell, dateKey) {
    // Remove selected class from previously selected cell
    if (selectedDateCell) {
        selectedDateCell.classList.remove('selected');
        // Also remove from the paired cell in the other calendar
        const pairedCellSelector = `#${selectedDateCell.closest('.calendar').id === 'englishCalendar' ? 'bengali' : 'english'}Calendar tbody td[data-date="${selectedDateCell.dataset.date}"]`;
        const pairedCell = document.querySelector(pairedCellSelector);
        if (pairedCell) {
            pairedCell.classList.remove('selected');
        }
    }

    // Add selected class to the clicked cell
    cell.classList.add('selected');
    selectedDateCell = cell;

    // Also highlight the paired cell in the other calendar
    const pairedCellSelector = `#${cell.closest('.calendar').id === 'englishCalendar' ? 'bengali' : 'english'}Calendar tbody td[data-date="${dateKey}"]`;
    const pairedCell = document.querySelector(pairedCellSelector);
    if (pairedCell) {
        pairedCell.classList.add('selected');
    }

    // --- Display Event Details and Guidelines ---
    selectedDateDisplay.textContent = new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const eventData = bengaliCalendarEvents[dateKey]; // Custom event data

    let detailsHtml = '';

    // 1. Custom Events
    if (eventData) {
        if (eventData.englishEvent) detailsHtml += `<p><strong>English Event:</strong> ${eventData.englishEvent}</p>`;
        if (eventData.bengaliEvent) detailsHtml += `<p><strong>Bengali Event:</strong> ${eventData.bengaliEvent}</p>`;
        if (eventData.tithi) detailsHtml += `<p><strong>Tithi:</strong> ${eventData.tithi}</p>`;
    } else {
        detailsHtml += '<p>No specific events or Tithi mentioned for this date.</p>';
    }

    // 2. Tithi-specific Guidelines (from eventData.tithi)
    if (eventData && eventData.tithi) {
        const tithiGuidelines = guidelines[eventData.tithi.split(' ')[0]]; // Get just the Bengali name or first word
        if (tithiGuidelines) {
            detailsHtml += '<div class="guidelines-section">';
            detailsHtml += `<h3>Guidelines for ${eventData.tithi}:</h3>`;
            if (tithiGuidelines.dos && tithiGuidelines.dos.length > 0) {
                detailsHtml += '<p><strong>Do\'s:</strong></p><ul>';
                tithiGuidelines.dos.forEach(item => detailsHtml += `<li>${item}</li>`);
                detailsHtml += '</ul>';
            }
            if (tithiGuidelines.donts && tithiGuidelines.donts.length > 0) {
                detailsHtml += '<p><strong>Don\'ts:</strong></p><ul>';
                tithiGuidelines.donts.forEach(item => detailsHtml += `<li>${item}</li>`);
                detailsHtml += '</ul>';
            }
            if (tithiGuidelines.notes) {
                detailsHtml += `<p class="guidelines-note"><em>Note: ${tithiGuidelines.notes}</em></p>`;
            }
            detailsHtml += '</div>';
        }
    }

    // 3. Day of Week Guidelines
    const dayOfWeek = new Date(dateKey).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayNamesBengali = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
    const currentDayBengali = dayNamesBengali[dayOfWeek];

    if (currentDayBengali === "মঙ্গলবার") {
        const dayGuidelines = guidelines["মঙ্গলবার (Tuesday)"];
        if (dayGuidelines && dayGuidelines.donts.length > 0) {
            detailsHtml += '<div class="guidelines-section">';
            detailsHtml += `<h3>Guidelines for ${currentDayBengali}:</h3>`;
            detailsHtml += '<p><strong>Don\'ts:</strong></p><ul>';
            dayGuidelines.donts.forEach(item => detailsHtml += `<li>${item}</li>`);
            detailsHtml += '</ul>';
            detailsHtml += '</div>';
        }
    } else if (currentDayBengali === "শনিবার") {
        const dayGuidelines = guidelines["শনিবার (Saturday)"];
        if (dayGuidelines && dayGuidelines.donts.length > 0) {
            detailsHtml += '<div class="guidelines-section">';
            detailsHtml += `<h3>Guidelines for ${currentDayBengali}:</h3>`;
            detailsHtml += '<p><strong>Don\'ts:</strong></p><ul>';
            dayGuidelines.donts.forEach(item => detailsHtml += `<li>${item}</li>`);
            detailsHtml += '</ul>';
            detailsHtml += '</div>';
        }
    }


    // 4. Period-Specific Guidelines (Shravan, Navratri, Kartik, Shraddha Paksha)
    const selectedDate = new Date(dateKey);
    const selectedYear = selectedDate.getFullYear();
    const selectedMonthDay = `${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

    for (const periodName in festivalPeriodsDates) {
        if (festivalPeriodsDates[periodName][selectedYear]) {
            const period = festivalPeriodsDates[periodName][selectedYear];
            const startDate = new Date(`${selectedYear}-${period.start}`);
            const endDate = new Date(`${selectedYear}-${period.end}`);

            // Check if selectedDate is within the period (inclusive)
            if (selectedDate >= startDate && selectedDate <= endDate) {
                const periodGuidelines = guidelines[periodName];
                if (periodGuidelines) {
                    detailsHtml += '<div class="guidelines-section">';
                    detailsHtml += `<h3>Guidelines for ${periodName}:</h3>`;
                    if (periodGuidelines.dos && periodGuidelines.dos.length > 0) {
                        detailsHtml += '<p><strong>Do\'s:</strong></p><ul>';
                        periodGuidelines.dos.forEach(item => detailsHtml += `<li>${item}</li>`);
                        detailsHtml += '</ul>';
                    }
                    if (periodGuidelines.donts && periodGuidelines.donts.length > 0) {
                        detailsHtml += '<p><strong>Don\'ts:</strong></p><ul>';
                        periodGuidelines.donts.forEach(item => detailsHtml += `<li>${item}</li>`);
                        detailsHtml += '</ul>';
                    }
                    if (periodGuidelines.notes) {
                        detailsHtml += `<p class="guidelines-note"><em>Note: ${periodGuidelines.notes}</em></p>`;
                    }
                    detailsHtml += '</div>';
                }
            }
        }
    }


    eventDetailsContent.innerHTML = detailsHtml;
}

// --- Event Listeners ---
prevMonthButton.addEventListener('click', () => {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
    renderCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
    renderCalendar();
});

// Initial render
renderCalendar();