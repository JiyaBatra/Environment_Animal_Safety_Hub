/**
 * SOS Emergency Page JavaScript
 *
 * Handles theme toggle functionality and AOS (Animate On Scroll) initialization
 * for the emergency SOS page with accessibility considerations.
 *
 * Features:
 * - AOS library initialization for smooth scroll animations
 * - Dark/light theme toggle with localStorage persistence
 * - Automatic theme detection based on user preferences
 * - Responsive design with accessibility features
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== AOS INITIALIZATION =====
/**
 * Initialize Animate On Scroll (AOS) library
 * Configures smooth scroll animations for the SOS emergency page
 */
AOS.init({
    duration: 800,    // Animation duration in milliseconds
    once: true,       // Animation occurs only once per element
});

// ===== THEME TOGGLE SYSTEM =====
/**
 * Theme toggle button element
 * @type {HTMLElement}
 */
const themeToggle = document.getElementById('themeToggle');

/**
 * Media query for user's preferred color scheme
 * @type {MediaQueryList}
 */
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Initialize theme toggle functionality
 * Checks for saved theme preference or uses system preference as default
 */
function initializeThemeToggle() {
    // Check for saved theme preference in localStorage
    const currentTheme = localStorage.getItem('theme');

    // Apply dark theme if user previously selected it or if system prefers dark and no preference saved
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        themeToggle.classList.add('dark');
    }

    // Add click event listener for theme toggle
    themeToggle.addEventListener('click', () => {
        // Toggle dark theme class on body
        document.body.classList.toggle('dark-theme');

        // Toggle dark class on toggle button
        themeToggle.classList.toggle('dark');

        // Save theme preference to localStorage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

// ===== INITIALIZATION =====
/**
 * Initialize all SOS page functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
});