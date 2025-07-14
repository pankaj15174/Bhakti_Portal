// theme.js

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = localStorage.getItem('theme'); // 'light', 'dark', or null

    // Function to apply the theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            if (themeToggleBtn) { // Check if button exists on the page
                themeToggleBtn.textContent = 'Light Mode';
            }
        } else {
            document.documentElement.classList.remove('dark-mode');
            if (themeToggleBtn) {
                themeToggleBtn.textContent = 'Dark Mode';
            }
        }
        localStorage.setItem('theme', theme);
    }

    // Initial theme application
    if (currentTheme) {
        // If theme preference exists in localStorage, use it
        applyTheme(currentTheme);
    } else if (prefersDarkMode) {
        // If no preference, but system prefers dark mode, use dark
        applyTheme('dark');
    } else {
        // Otherwise, default to light mode
        applyTheme('light');
    }

    // Event listener for the toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.documentElement.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }
});