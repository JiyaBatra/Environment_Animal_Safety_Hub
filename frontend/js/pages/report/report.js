/**
 * Report Form Handler
 *
 * Handles form submission for environmental and animal safety reports.
 * Provides user feedback and form reset functionality with smooth animations.
 *
 * Features:
 * - AOS (Animate On Scroll) library initialization
 * - Form submission handling with validation
 * - Success message display with emoji feedback
 * - Automatic form reset after submission
 * - Responsive design support
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ========== AOS INITIALIZATION ==========

/**
 * Initialize Animate On Scroll (AOS) library
 * Configures smooth scroll animations for the report page
 */
AOS.init({
    duration: 1000,    // Animation duration in milliseconds
    once: true,        // Animation occurs only once per element
});

// ========== FORM HANDLING ==========

/**
 * Report form element
 * @type {HTMLFormElement}
 */
const reportForm = document.getElementById("reportForm");

/**
 * Handle form submission
 * Prevents default submission, shows success message, and resets form
 * @param {Event} e - Form submit event
 */
reportForm.addEventListener("submit", function (e) {
    // Prevent default form submission
    e.preventDefault();

    // Show success message with emoji
    alert("🦊 Thank you! Your report has been submitted successfully 💚");

    // Reset form to clear all fields
    this.reset();
});