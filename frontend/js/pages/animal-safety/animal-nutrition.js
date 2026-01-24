/**
 * Animal Nutrition Calculator and Information System
 *
 * Interactive platform for calculating balanced diets for pets and wildlife
 * with comprehensive nutritional information and species-specific recommendations.
 *
 * Features:
 * - Interactive nutrition calculator based on animal type, weight, age, and activity
 * - Species-specific nutritional requirements and guidelines
 * - Dynamic result display with detailed feeding recommendations
 * - AOS (Animate On Scroll) integration for smooth animations
 * - Responsive design with mobile optimization
 * - Comprehensive nutritional data for multiple animal species
 * - Health benefits and longevity information
 *
 * Supported Animals:
 * - Dogs, Cats, Birds, Rabbits, Horses, Deer, Squirrels
 * - Different life stages: Puppy/Kitten, Adult, Senior
 * - Activity levels: Low, Moderate, High
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 * @requires AOS (Animate On Scroll) library
 */

// ========== INITIALIZATION ==========

/**
 * Initialize the animal nutrition page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNutritionPage();
});

/**
 * Main initialization function for the nutrition page
 */
function initializeNutritionPage() {
    // Initialize AOS animations
    initializeAOS();

    // Initialize nutrition calculator
    initializeNutritionCalculator();

    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling();
}

// ========== ANIMATION INITIALIZATION ==========

/**
 * Initialize AOS (Animate On Scroll) library for smooth page animations
 */
function initializeAOS() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
}

// ========== SMOOTH SCROLLING ==========

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

// ========== NUTRITION CALCULATOR ==========

/**
 * Comprehensive nutritional data for different animal species
 * Includes caloric requirements, macronutrient ratios, and feeding guidelines
 * @type {Object<string, Object>}
 */
const nutritionData = {
    dog: {
        name: "Dog",
        baseCaloriesPerKg: 30, // Base calories per kg of body weight
        lifeStages: {
            puppy: { multiplier: 2.0, protein: "28-30%", fat: "15-20%", carbs: "40-50%" },
            adult: { multiplier: 1.6, protein: "18-25%", fat: "10-15%", carbs: "30-50%" },
            senior: { multiplier: 1.2, protein: "18-25%", fat: "10-15%", carbs: "30-50%" }
        },
        activityMultipliers: {
            low: 1.2,
            moderate: 1.0,
            high: 0.8
        },
        recommendations: [
            "High-quality commercial dog food or balanced homemade diet",
            "Include lean proteins like chicken, fish, or turkey",
            "Add vegetables like carrots, green beans, and pumpkin",
            "Essential fatty acids from fish oil or flaxseed",
            "Calcium and phosphorus for bone health",
            "Fresh water available at all times"
        ]
    },
    cat: {
        name: "Cat",
        baseCaloriesPerKg: 25,
        lifeStages: {
            puppy: { multiplier: 2.5, protein: "30-35%", fat: "15-20%", carbs: "30-40%" },
            adult: { multiplier: 1.4, protein: "26-30%", fat: "9-15%", carbs: "20-35%" },
            senior: { multiplier: 1.1, protein: "26-30%", fat: "9-15%", carbs: "20-35%" }
        },
        activityMultipliers: {
            low: 1.3,
            moderate: 1.0,
            high: 0.9
        },
        recommendations: [
            "Taurine-rich foods (essential amino acid for cats)",
            "High-quality commercial cat food",
            "Lean proteins like chicken, turkey, or fish",
            "Limited carbohydrates, cats are obligate carnivores",
            "Arachidonic acid for skin and coat health",
            "Fresh water and clean litter box"
        ]
    },
    bird: {
        name: "Bird",
        baseCaloriesPerKg: 40,
        lifeStages: {
            puppy: { multiplier: 1.8, protein: "15-18%", fat: "5-8%", carbs: "55-70%" },
            adult: { multiplier: 1.4, protein: "12-16%", fat: "4-8%", carbs: "50-70%" },
            senior: { multiplier: 1.2, protein: "12-16%", fat: "4-8%", carbs: "50-70%" }
        },
        activityMultipliers: {
            low: 1.4,
            moderate: 1.0,
            high: 0.8
        },
        recommendations: [
            "High-quality bird seed mix appropriate for species",
            "Fresh fruits like apples, berries, and melon",
            "Leafy greens such as kale, spinach, and lettuce",
            "Limited sunflower seeds (high fat)",
            "Calcium supplement for egg-laying birds",
            "Clean water and proper perches"
        ]
    },
    rabbit: {
        name: "Rabbit",
        baseCaloriesPerKg: 20,
        lifeStages: {
            puppy: { multiplier: 2.2, protein: "14-16%", fat: "2-4%", carbs: "45-55%" },
            adult: { multiplier: 1.5, protein: "12-14%", fat: "2-4%", carbs: "45-55%" },
            senior: { multiplier: 1.3, protein: "12-14%", fat: "2-4%", carbs: "45-55%" }
        },
        activityMultipliers: {
            low: 1.3,
            moderate: 1.0,
            high: 0.9
        },
        recommendations: [
            "High-fiber hay (timothy, orchard grass)",
            "Leafy greens like romaine, parsley, and cilantro",
            "Limited pellets (2-4% of body weight)",
            "Fresh vegetables in moderation",
            "No high-sugar treats or grains",
            "Constant access to fresh water"
        ]
    },
    horse: {
        name: "Horse",
        baseCaloriesPerKg: 15,
        lifeStages: {
            puppy: { multiplier: 1.8, protein: "12-14%", fat: "3-5%", carbs: "60-70%" },
            adult: { multiplier: 1.4, protein: "10-12%", fat: "3-5%", carbs: "60-70%" },
            senior: { multiplier: 1.2, protein: "10-12%", fat: "3-5%", carbs: "60-70%" }
        },
        activityMultipliers: {
            low: 1.4,
            moderate: 1.0,
            high: 0.7
        },
        recommendations: [
            "High-quality hay or pasture grass",
            "Commercial horse feed with balanced nutrients",
            "Mineral supplements for electrolytes",
            "Clean water (10-12 gallons per day)",
            "Salt block for sodium supplementation",
            "Regular dental care and hoof maintenance"
        ]
    },
    deer: {
        name: "Deer",
        baseCaloriesPerKg: 18,
        lifeStages: {
            puppy: { multiplier: 2.0, protein: "14-16%", fat: "3-5%", carbs: "55-65%" },
            adult: { multiplier: 1.5, protein: "12-14%", fat: "3-5%", carbs: "55-65%" },
            senior: { multiplier: 1.3, protein: "12-14%", fat: "3-5%", carbs: "55-65%" }
        },
        activityMultipliers: {
            low: 1.3,
            moderate: 1.0,
            high: 0.8
        },
        recommendations: [
            "Natural browse (leaves, twigs, buds)",
            "High-quality hay in managed care",
            "Limited grains and concentrates",
            "Mineral supplements for antler growth",
            "Fresh water sources",
            "Natural foraging opportunities"
        ]
    },
    squirrel: {
        name: "Squirrel",
        baseCaloriesPerKg: 35,
        lifeStages: {
            puppy: { multiplier: 2.2, protein: "15-18%", fat: "8-12%", carbs: "50-60%" },
            adult: { multiplier: 1.6, protein: "12-15%", fat: "6-10%", carbs: "50-60%" },
            senior: { multiplier: 1.3, protein: "12-15%", fat: "6-10%", carbs: "50-60%" }
        },
        activityMultipliers: {
            low: 1.4,
            moderate: 1.0,
            high: 0.8
        },
        recommendations: [
            "Mixed nuts (unsalted, in moderation)",
            "Fresh fruits like apples and berries",
            "Corn and sunflower seeds",
            "Limited peanut butter (high fat)",
            "Fresh vegetables occasionally",
            "Clean water in shallow dishes"
        ]
    }
};

/**
 * Initialize the nutrition calculator functionality
 */
function initializeNutritionCalculator() {
    const calculateBtn = document.getElementById('calculateNutrition');
    const resultBox = document.getElementById('nutritionResult');
    const resultContent = document.getElementById('resultContent');

    // Calculate button click handler
    calculateBtn.addEventListener('click', function() {
        const animalType = document.getElementById('animalType').value;
        const animalWeight = parseFloat(document.getElementById('animalWeight').value);
        const animalAge = document.getElementById('animalAge').value;
        const activityLevel = document.getElementById('activityLevel').value;

        // Validate inputs
        if (!animalType || !animalWeight || animalWeight <= 0) {
            showValidationError(calculateBtn);
            return;
        }

        // Hide current result and prepare for new calculation
        resultBox.classList.remove('show');

        // Calculate and display result with animation delay
        setTimeout(() => {
            const result = calculateNutritionPlan(animalType, animalWeight, animalAge, activityLevel);
            displayNutritionResult(result);
        }, 300);
    });
}

/**
 * Calculate nutrition plan based on animal parameters
 * @param {string} type - Animal type
 * @param {number} weight - Animal weight in kg
 * @param {string} age - Life stage (puppy, adult, senior)
 * @param {string} activity - Activity level (low, moderate, high)
 * @returns {Object} Nutrition plan object
 */
function calculateNutritionPlan(type, weight, age, activity) {
    const animalData = nutritionData[type];

    if (!animalData) {
        return { error: "Animal type data not available" };
    }

    // Calculate daily caloric needs
    let calories = animalData.baseCaloriesPerKg * weight;

    // Apply life stage multiplier
    calories *= animalData.lifeStages[age].multiplier;

    // Apply activity level multiplier
    calories *= animalData.activityMultipliers[activity];

    // Round to nearest 10 calories
    calories = Math.round(calories / 10) * 10;

    return {
        animalName: animalData.name,
        dailyCalories: calories,
        weight: weight,
        lifeStage: age,
        activityLevel: activity,
        macronutrients: animalData.lifeStages[age],
        recommendations: animalData.recommendations
    };
}

/**
 * Display nutrition calculation results
 * @param {Object} result - Nutrition plan result object
 */
function displayNutritionResult(result) {
    const resultBox = document.getElementById('nutritionResult');
    const resultContent = document.getElementById('resultContent');

    if (result.error) {
        resultContent.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${result.error}</p>
            </div>
        `;
    } else {
        const lifeStageLabel = result.lifeStage.charAt(0).toUpperCase() + result.lifeStage.slice(1);
        const activityLabel = result.activityLevel.charAt(0).toUpperCase() + result.activityLevel.slice(1);

        resultContent.innerHTML = `
            <div class="result-summary">
                <div class="result-stats">
                    <div class="stat">
                        <span class="stat-value">${result.dailyCalories}</span>
                        <span class="stat-label">Daily Calories</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${result.weight}kg</span>
                        <span class="stat-label">Body Weight</span>
                    </div>
                </div>

                <div class="animal-details">
                    <p><strong>Animal:</strong> ${result.animalName}</p>
                    <p><strong>Life Stage:</strong> ${lifeStageLabel}</p>
                    <p><strong>Activity Level:</strong> ${activityLabel} Activity</p>
                </div>

                <div class="macronutrient-breakdown">
                    <h4>Macronutrient Ratios</h4>
                    <div class="macro-grid">
                        <div class="macro-item">
                            <span class="macro-name">Protein</span>
                            <span class="macro-value">${result.macronutrients.protein}</span>
                        </div>
                        <div class="macro-item">
                            <span class="macro-name">Fat</span>
                            <span class="macro-value">${result.macronutrients.fat}</span>
                        </div>
                        <div class="macro-item">
                            <span class="macro-name">Carbohydrates</span>
                            <span class="macro-value">${result.macronutrients.carbs}</span>
                        </div>
                    </div>
                </div>

                <div class="feeding-recommendations">
                    <h4>Feeding Recommendations</h4>
                    <ul>
                        ${result.recommendations.map(rec => `<li><i class="fas fa-check-circle"></i> ${rec}</li>`).join('')}
                    </ul>
                </div>

                <div class="health-note">
                    <i class="fas fa-info-circle"></i>
                    <p><strong>Health Note:</strong> These are general guidelines. Consult a veterinarian for personalized nutrition plans, especially for animals with health conditions.</p>
                </div>
            </div>
        `;
    }

    // Show result with animation
    resultBox.classList.add('show');
}

/**
 * Show visual validation error for missing form inputs
 * @param {HTMLElement} button - The calculate button element
 */
function showValidationError(button) {
    // Shake animation for user feedback
    button.style.transform = "translateX(5px)";
    setTimeout(() => {
        button.style.transform = "translateX(-5px)";
    }, 100);
    setTimeout(() => {
        button.style.transform = "translateX(5px)";
    }, 200);
    setTimeout(() => {
        button.style.transform = "translateX(0)";
    }, 300);

    // Highlight empty required fields
    const requiredFields = ['animalType', 'animalWeight'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value || (fieldId === 'animalWeight' && parseFloat(field.value) <= 0)) {
            field.style.borderColor = '#ef4444';
            setTimeout(() => {
                field.style.borderColor = '#e5e7eb';
            }, 2000);
        }
    });
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Format number with commas for readability
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    return num.toLocaleString();
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ========== RESPONSIVE DESIGN HELPERS ==========

/**
 * Handle responsive design adjustments
 */
function handleResponsiveDesign() {
    const isMobile = window.innerWidth <= 768;

    // Adjust calculator layout for mobile
    const calculatorCard = document.querySelector('.calculator-card');
    if (calculatorCard) {
        if (isMobile) {
            calculatorCard.style.padding = '20px';
        } else {
            calculatorCard.style.padding = '40px';
        }
    }
}

// Initialize responsive design handling
window.addEventListener('resize', handleResponsiveDesign);
window.addEventListener('load', handleResponsiveDesign);