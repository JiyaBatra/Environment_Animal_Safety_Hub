/**
 * Urban Wildlife Safety Page JavaScript
 *
 * Interactive features for the urban wildlife safety education page.
 *
 * Features:
 * - Smooth scrolling for navigation
 * - Interactive prevention cards
 * - AOS animations initialization
 * - Responsive behavior
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ========== INITIALIZATION ==========

/**
 * Initialize the urban wildlife safety page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initSmoothScrolling();
    initPreventionCards();
    initHeroBackground();
});

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize interactive prevention cards with hover effects
 */
function initPreventionCards() {
    const cards = document.querySelectorAll('.prevention-card, .practice-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Initialize hero background parallax effect
 */
function initHeroBackground() {
    const heroBg = document.getElementById('heroBg');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const deltaY = currentScrollY - lastScrollY;

        // Subtle parallax effect
        const translateY = currentScrollY * 0.5;
        heroBg.style.transform = `translateY(${translateY}px) scale(${1 + currentScrollY * 0.0002})`;

        lastScrollY = currentScrollY;
    });
}

/**
 * Utility function to check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Add scroll-based animations for sections
 */
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('.prevention-section, .behavior-section, .response-section, .habitat-section, .practices-section');

    sections.forEach(section => {
        if (isInViewport(section)) {
            section.classList.add('animate-in');
        }
    });
});

// ========== RESPONSIVE BEHAVIOR ==========

/**
 * Handle responsive behavior on window resize
 */
window.addEventListener('resize', function () {
    // Reinitialize components if needed for responsive design
    initPreventionCards();
});

// ========== ACCESSIBILITY ==========

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', function (e) {
    // Add keyboard navigation for cards if needed
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('prevention-card') || focusedElement.classList.contains('practice-card')) {
            focusedElement.click();
        }
    }
});