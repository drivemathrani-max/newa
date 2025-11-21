// Theme Management

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
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
