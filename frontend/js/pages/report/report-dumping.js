/**
 * Illegal Dumping Report Form Handler
 *
 * Handles form submission for illegal waste dumping reports.
 * Provides visual feedback with success message display and smooth scrolling.
 *
 * Features:
 * - Form submission handling with validation
 * - Success message display with smooth scrolling
 * - Automatic form reset after submission
 * - User-friendly feedback system
 * - Responsive design support
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ========== DOM ELEMENTS ==========

/**
 * Report form element for illegal dumping
 * @type {HTMLFormElement}
 */
const form = document.getElementById("reportForm");

/**
 * Success message element displayed after form submission
 * @type {HTMLElement}
 */
const successMsg = document.getElementById("successMsg");

// ========== FORM HANDLING ==========

/**
 * Handle form submission for illegal dumping reports
 * Prevents default submission, shows success message, resets form, and scrolls to message
 * @param {Event} e - Form submit event
 */
form.addEventListener("submit", function(e) {
    // Prevent default form submission
    e.preventDefault();

    // Display success message
    successMsg.style.display = "block";

    // Reset form to clear all input fields
    form.reset();

    // Smooth scroll to success message with offset for better visibility
    window.scrollTo({
        top: successMsg.offsetTop - 100,
        behavior: "smooth"
    });
});