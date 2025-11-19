// Theme Management

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupThemeToggle();
});

// Initialize theme from localStorage or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('newsHubTheme');
    let theme = 'light';

    if (savedTheme) {
        theme = savedTheme;
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }

    applyTheme(theme);
}

// Apply theme to the page
function applyTheme(theme) {
    const body = document.body;
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');

    // Remove existing theme class
    body.classList.remove('theme-light', 'theme-dark');

    // Add new theme class
    body.classList.add(`theme-${theme}`);

    // Update button icon
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    // Save to localStorage
    localStorage.setItem('newsHubTheme', theme);

    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

// Setup theme toggle button
function setupThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
}

// Toggle between light and dark theme
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('theme-light') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    applyTheme(newTheme);
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a theme
        if (!localStorage.getItem('newsHubTheme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Export function for external use
window.toggleTheme = toggleTheme;
