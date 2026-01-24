
// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateToggle(savedTheme);

    // Toggle theme on click
    themeToggle.addEventListener('click', function () {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggle(newTheme);
    });

    // Update toggle position based on theme
    function updateToggle(theme) {
        const slider = document.querySelector('.theme-slider');
        if (theme === 'dark') {
            slider.style.transform = 'translateX(26px)';
        } else {
            slider.style.transform = 'translateX(0)';
        }
    }
});
