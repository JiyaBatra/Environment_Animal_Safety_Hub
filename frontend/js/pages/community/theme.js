/**
 * Theme Toggle System
 *
 * Manages light/dark theme switching for the community platform
 * with persistent storage and visual feedback.
 *
 * Features:
 * - Light/dark theme toggle
 * - Local storage persistence
 * - Dynamic icon updates
 * - Smooth theme transitions
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

/**
 * Initialize theme toggle functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('themeToggle');

    if (!toggleButton) return;

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    /**
     * Handle theme toggle button click
     */
    toggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    /**
     * Update toggle button icon based on current theme
     * @param {string} theme - Current theme ('light' or 'dark')
     */
    function updateIcon(theme) {
        if (theme === 'dark') {
            toggleButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
            toggleButton.style.color = '#ffd700'; // Yellow sun
        } else {
            toggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
            toggleButton.style.color = '#ffffff'; // White moon
        }
    }
});