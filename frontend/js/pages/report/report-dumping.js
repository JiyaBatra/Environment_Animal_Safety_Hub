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
if (form) {
    form.addEventListener("submit", function (e) {
        // Prevent default form submission
        e.preventDefault();

        // VALDIATION
        const nameInput = document.getElementById("reporterName");
        // Note: location/desc don't have IDs in HTML but we can target by type or add IDs.
        // We know structure: div > label + input/textarea.
        // Let's get them by selector to be safe.
        const locationInput = form.querySelector("input[placeholder='Enter location']");
        const descInput = form.querySelector("textarea");

        let isValid = true;
        let errorMessage = "";

        if (nameInput && !nameInput.value.trim()) {
            isValid = false;
            errorMessage += "Name is required.\n";
            nameInput.style.borderColor = "red";
        } else if (nameInput) {
            nameInput.style.borderColor = "#ddd";
        }

        if (locationInput && !locationInput.value.trim()) {
            isValid = false;
            errorMessage += "Location is required.\n";
            locationInput.style.borderColor = "red";
        } else if (locationInput) {
            locationInput.style.borderColor = "#ddd";
        }

        if (descInput && !descInput.value.trim()) {
            isValid = false;
            errorMessage += "Description is required.\n";
            descInput.style.borderColor = "red";
        } else if (descInput) {
            descInput.style.borderColor = "#ddd";
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector("button[type='submit']");
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Submitting...";
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Restore button
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;

            // Display success message
            if (successMsg) {
                successMsg.style.display = "block";
                successMsg.textContent = "✅ Report Submitted Successfully! Thank you for your help.";

                // Smooth scroll to success message
                window.scrollTo({
                    top: successMsg.offsetTop - 100,
                    behavior: "smooth"
                });

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMsg.style.display = "none";
                }, 5000);
            } else {
                alert("Report Submitted Successfully!");
            }

            // Reset form
            form.reset();

        }, 1500); // 1.5s delay
    });
}