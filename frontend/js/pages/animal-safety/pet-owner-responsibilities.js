/**
 * Pet Owner Responsibilities Page
 *
 * Educational page about responsibilities of pet owners
 * for animal welfare and community safety.
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ========== INITIALIZATION ==========

/**
 * Initialize the pet owner responsibilities page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Initialize hero background effect
    initHeroEffect();

    // Add smooth scrolling for resource links
    initSmoothScrolling();
});

/**
 * Initialize hero background parallax effect
 */
function initHeroEffect() {
    const heroBg = document.getElementById('heroBg');
    if (!heroBg) return;

    // Add subtle parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroBg.style.transform = `translateY(${rate}px) scale(${1 + scrolled * 0.0002})`;
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const resourceLinks = document.querySelectorAll('.resource-link');

    resourceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // For now, just prevent default since links are placeholders
            // In production, these would link to actual resources
            e.preventDefault();
            console.log('Resource link clicked:', this.textContent);
            // Could show a modal or redirect to external resources
        });
    });
}

// ========== RESPONSIVE DESIGN HELPERS ==========

/**
 * Handle responsive adjustments
 */
function handleResponsive() {
    const width = window.innerWidth;

    // Adjust grid layouts for mobile
    if (width < 768) {
        // Mobile-specific adjustments if needed
    }
}

// Listen for window resize
window.addEventListener('resize', handleResponsive);

// Initialize responsive handling
handleResponsive();