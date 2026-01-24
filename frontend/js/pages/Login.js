/**
 * Login Page JavaScript
 *
 * Handles user authentication, password visibility toggle, and login form submission
 * for the environmental and animal safety platform.
 *
 * Features:
 * - Password visibility toggle
 * - Form validation and submission
 * - Local storage for login state
 * - Redirect after successful login
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

/**
 * Toggle password visibility for input fields
 * @param {string} inputId - ID of the password input element
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + "-icon");

    if (!input || !icon) {
        console.error(`Element with ID '${inputId}' or '${inputId}-icon' not found.`);
        return;
    }

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
function handleLoginSubmit(e) {
    e.preventDefault();

    // Simulate Login
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'Eco Warrior');
    alert("Success! Welcome back to EcoLife.");
    window.location.href = "../index.html";
}

/**
 * Initialize login page functionality
 */
function initLoginPage() {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    } else {
        console.error("Login form element not found.");
    }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initLoginPage);