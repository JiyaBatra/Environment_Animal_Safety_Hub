/**
 * Animal Feeding Calculator Page JavaScript
 *
 * Interactive calculator for determining appropriate feeding amounts and types
 * for different animals based on species and size. Provides safe feeding
 * recommendations to prevent overfeeding and promote animal health.
 *
 * Features:
 * - Species-specific feeding guidelines (birds, squirrels, cats, dogs)
 * - Size-based portion recommendations (small, medium, large, extra-large)
 * - Interactive calculator with validation
 * - Animated result display with smooth transitions
 * - Theme toggle with localStorage persistence
 * - AOS (Animate On Scroll) integration
 * - Responsive design with accessibility features
 *
 * Supported Animals:
 * - Birds: Small finches, medium parakeets, large species
 * - Squirrels: Small chipmunks, medium gray squirrels
 * - Cats: Small kittens, medium adult cats, large cats
 * - Dogs: Small breeds, medium breeds, large breeds, extra-large breeds
 *
 * Safety Guidelines:
 * - Never overfeed wild animals
 * - Use appropriate food types for each species
 * - Provide clean water always
 * - Monitor animal health and behavior
 * - Consult veterinarians for domestic pets
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 * @requires AOS (Animate On Scroll) library
 */

// ===== INITIALIZATION =====
/**
 * Initialize feeding calculator page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeFeedingCalculator();
});

// ===== MAIN INITIALIZATION FUNCTION =====
/**
 * Initialize all feeding calculator functionality
 * Sets up AOS animations, theme toggle, and calculator logic
 */
function initializeFeedingCalculator() {
    // Initialize AOS animations
    initializeAOS();

    // Initialize theme toggle functionality
    initializeThemeToggle();

    // Initialize feeding calculator
    initializeFeedingCalculatorLogic();
}

// ===== ANIMATION INITIALIZATION =====
/**
 * Initialize AOS (Animate On Scroll) library for smooth page animations
 */
function initializeAOS() {
    AOS.init({
        duration: 800,
        once: true
    });
}

// ===== THEME MANAGEMENT =====
/**
 * Initialize theme toggle functionality with localStorage persistence
 * Supports light/dark mode switching with user preference saving
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Load saved theme preference (default is dark theme)
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        // Toggle light theme class
        body.classList.toggle('light-theme');

        // Save user preference
        if (body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ===== FEEDING DATA =====
/**
 * Comprehensive feeding guidelines for different animal species and sizes
 * All recommendations are in grams per day with specific food types
 * @type {Object<string, Object<string, string>>}
 */
const feedingData = {
    bird: {
        small: "15-20g seeds (Millet/Sunflower). Clean water.",
        medium: "30g Mixed Seeds + Fruit chunks.",
        large: "N/A",
        xlarge: "N/A"
    },
    squirrel: {
        small: "20g nuts (unsalted) & fruit.",
        medium: "40g corn, apple, walnuts.",
        large: "N/A",
        xlarge: "N/A"
    },
    cat: {
        small: "80g Wet Food / 30g Dry Food.",
        medium: "150g Wet Food / 50g Dry Food.",
        large: "200g+ Wet Food.",
        xlarge: "N/A"
    },
    dog: {
        small: "100g Balanced Meal.",
        medium: "300g Balanced Meal.",
        large: "500g Balanced Meal.",
        xlarge: "800g+ Balanced Meal."
    }
};

// ===== CALCULATOR LOGIC =====
/**
 * Initialize feeding calculator functionality
 * Sets up form validation, calculation logic, and result display
 */
function initializeFeedingCalculatorLogic() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultBox = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');

    // Calculate button click handler
    calculateBtn.addEventListener('click', () => {
        const animalType = document.getElementById('animalType').value;
        const animalSize = document.getElementById('animalSize').value;

        // Validate input selection
        if (!animalType || !animalSize) {
            // Visual feedback for invalid input
            showValidationError(calculateBtn);
            return;
        }

        // Hide current result and prepare for new calculation
        resultBox.classList.remove('show');

        // Calculate and display result with animation delay
        setTimeout(() => {
            const result = calculateFeedingRecommendation(animalType, animalSize);
            displayResult(result);
        }, 100);
    });
}

// ===== CALCULATION FUNCTIONS =====
/**
 * Calculate feeding recommendation based on animal type and size
 * @param {string} type - Animal type (bird, squirrel, cat, dog)
 * @param {string} size - Animal size (small, medium, large, xlarge)
 * @returns {string} Feeding recommendation or error message
 */
function calculateFeedingRecommendation(type, size) {
    // Check if data exists for the selected combination
    if (feedingData[type] && feedingData[type][size]) {
        return feedingData[type][size];
    }

    // Return default message for unavailable combinations
    return "Data unavailable for this combination.";
}

// ===== RESULT DISPLAY =====
/**
 * Display feeding recommendation with animated reveal
 * @param {string} result - The feeding recommendation to display
 */
function displayResult(result) {
    const resultBox = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');

    // Update result content
    resultContent.innerHTML = `<strong>Recommendation:</strong><br>${result}`;

    // Show result with animation
    resultBox.classList.add('show');
}

// ===== VALIDATION FEEDBACK =====
/**
 * Show visual validation error for missing form inputs
 * @param {HTMLElement} button - The calculate button element
 */
function showValidationError(button) {
    // Simple shake animation for user feedback
    button.style.transform = "translateX(5px)";
    setTimeout(() => {
        button.style.transform = "translateX(0)";
    }, 100);
}