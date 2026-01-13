/**
 * Login Page JavaScript
 * Handles login form submission and password visibility toggle
 * 
 * @file Login.js
 * @description External JavaScript for the Login page
 * @see frontend/pages/Login.html
 */

/**
 * Toggle Password Visibility
 * Switches the password input between 'password' and 'text' types
 * and updates the eye icon accordingly.
 * 
 * @param {string} inputId - The ID of the password input element
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
 * Handle Login Form Submission
 * Validates the form, simulates login, stores user data in localStorage,
 * and redirects to the home page.
 * 
 * @param {Event} e - The form submission event
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
 * Initialize Login Page
 * Sets up event listeners when the DOM is fully loaded
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
