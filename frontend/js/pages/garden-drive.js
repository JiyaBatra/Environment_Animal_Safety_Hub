/**
 * Garden Drive Form Handler
 *
 * Handles form submission for garden drive participation with smooth animations,
 * loading states, and success feedback for the environmental garden initiative.
 *
 * Features:
 * - Scroll-triggered animations for page elements
 * - Form submission with loading animation
 * - Success message display with smooth scrolling
 * - Responsive design with accessibility considerations
 * - Intersection Observer API for performance optimization
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== SCROLL ANIMATION SYSTEM =====
/**
 * Initialize scroll-triggered animations for garden drive page elements
 * Uses Intersection Observer API for performance and smooth animations
 */
document.addEventListener("DOMContentLoaded", () => {
    // Select all elements that need to animate on scroll
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    // Create the Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // If the element is in the viewport
            if (entry.isIntersecting) {
                // Add the class that resets opacity and transform
                entry.target.classList.add("is-visible");

                // Stop observing once animated (performance optimization)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before the bottom
    });

    // Attach observer to all animated elements
    animatedElements.forEach((el) => observer.observe(el));
});

// ===== FORM HANDLING SYSTEM =====
/**
 * Garden drive participation form and success message elements
 * @type {HTMLFormElement}
 */
const form = document.getElementById("gardenForm");

/**
 * Success message element displayed after form submission
 * @type {HTMLElement}
 */
const successMsg = document.getElementById("successMsg");

/**
 * Handle garden drive form submission with loading animation
 * Prevents default submission, shows loading state, then displays success message
 * @param {Event} e - Form submit event
 */
if (form) {
    form.addEventListener("submit", function (e) {
        // Prevent default form submission
        e.preventDefault();

        // Get submit button for loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate network delay for better UX feel
        setTimeout(() => {
            // Hide form and show success message
            form.style.display = "none";
            successMsg.style.display = "block";

            // Scroll to the success message smoothly
            successMsg.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Reset button state (in case form needs to reappear later)
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500); // 1.5 second delay for UX
    });
}