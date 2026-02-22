// Carbon Footprint Calculator Game Logic

// Import GameProgressManager from progress-manager.js
import GameProgressManager from '../components/progress-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const footprintDisplay = document.getElementById('footprint');
    const badgesEarnedDisplay = document.getElementById('badgesEarned');
    const levelDisplay = document.getElementById('level');
    const visualization = document.getElementById('visualization');
    const tree = document.getElementById('tree');
    const planet = document.getElementById('planet');
    const tipsSection = document.getElementById('tipsSection');
    const tipText = document.getElementById('tipText');
    const badgesSection = document.getElementById('badgesSection');
    const badgesContainer = document.getElementById('badges');
    const badgeModal = document.getElementById('badgeModal');
    const badgeText = document.getElementById('badgeText');
    const resumeSection = document.getElementById('resumeSection');
    const resumeBtn = document.getElementById('resumeBtn');
    const clearProgressBtn = document.getElementById('clearProgressBtn');

    let totalFootprint = 0;
    let badgesEarned = [];
    let currentLevel = 'Beginner';
    let gameState = {
        transportation: 0,
        food: 0,
        energy: 0,
        calculated: false
    };

    // Initialize GameProgressManager
    const progressManager = new GameProgressManager('carbon-footprint-calculator');

    // Check for saved progress on load
    checkSavedProgress();

    // Badge definitions
    const badges = [
        { name: 'Eco Starter', condition: (fp) => fp <= 5, description: 'Great start! Your footprint is low.' },
        { name: 'Green Traveler', condition: (fp) => fp <= 3, description: 'Excellent transportation choices!' },
        { name: 'Planet Protector', condition: (fp) => fp <= 1, description: 'You\'re a true planet protector!' }
    ];

    // Tips based on choices
    const tips = {
        transportation: {
            '0': 'Select a transportation method to see your impact!',
            '0.1': 'Walking is great for the environment!',
            '0.5': 'Biking reduces emissions significantly!',
            '2.4': 'Consider public transport or biking to lower your footprint.'
        },
        food: {
            '0': 'Choose a food option to learn about its impact!',
            '1': 'Vegan meals have the lowest carbon footprint!',
            '3': 'Vegetarian meals are better than meat-based ones.',
            '7': 'Meat production has a high environmental impact. Try plant-based alternatives!'
        },
        energy: {
            '0': 'Select an energy use level to see tips!',
            '0.5': 'Energy-efficient homes save the planet!',
            '2': 'Moderate energy use is good, but aim for efficiency.',
            '5': 'High energy use increases your footprint. Consider renewable sources!'
        }
    };

    // Function to check for saved progress
    function checkSavedProgress() {
        if (progressManager.canResumeGame()) {
            const savedProgress = progressManager.loadGameProgress();
            if (savedProgress && savedProgress.gameState) {
                showResumeOption(savedProgress);
            }
        }
    }

    // Show resume option if progress exists
    function showResumeOption(progress) {
        if (resumeSection) {
            resumeSection.style.display = 'block';
            const resumeInfo = document.getElementById('resumeInfo');
            if (resumeInfo) {
                resumeInfo.textContent = `Previous score: ${progress.score} | Badges: ${progress.badgesEarned ? progress.badgesEarned.length : 0}`;
            }
        }
    }

    // Resume game from saved progress
    function resumeGame() {
        const progress = progressManager.loadGameProgress();
        if (progress && progress.gameState) {
            // Restore game state
            gameState = progress.gameState;
            totalFootprint = progress.score;
            badgesEarned = progress.badgesEarned || [];
            currentLevel = progress.level || 'Beginner';

            // Restore form values
            const transportationSelect = document.getElementById('transportation');
            const foodSelect = document.getElementById('food');
            const energySelect = document.getElementById('energy');

            if (transportationSelect) transportationSelect.value = gameState.transportation;
            if (foodSelect) foodSelect.value = gameState.food;
            if (energySelect) energySelect.value = gameState.energy;

            // Update display
            footprintDisplay.textContent = totalFootprint.toFixed(1) + ' kg CO2';
            badgesEarnedDisplay.textContent = badgesEarned.length;
            levelDisplay.textContent = currentLevel;

            // Show previously earned badges
            if (badgesEarned.length > 0) {
                badgesSection.style.display = 'block';
                badgesContainer.innerHTML = '';
                badgesEarned.forEach(badgeName => {
                    const badgeElement = document.createElement('div');
                    badgeElement.className = 'badge';
                    badgeElement.textContent = badgeName;
                    badgesContainer.appendChild(badgeElement);
                });
            }

            // If previously calculated, show results
            if (gameState.calculated) {
                updateVisualization();
                showSections();
            }

            // Hide resume section
            if (resumeSection) {
                resumeSection.style.display = 'none';
            }
        }
    }

    // Clear saved progress
    function clearSavedProgress() {
        progressManager.clearGameProgress();
        if (resumeSection) {
            resumeSection.style.display = 'none';
        }
    }

    // Add event listeners for resume buttons
    if (resumeBtn) {
        resumeBtn.addEventListener('click', resumeGame);
    }
    if (clearProgressBtn) {
        clearProgressBtn.addEventListener('click', clearSavedProgress);
    }

    calculateBtn.addEventListener('click', calculateFootprint);

    function calculateFootprint() {
        const transportation = parseFloat(document.getElementById('transportation').value) || 0;
        const food = parseFloat(document.getElementById('food').value) || 0;
        const energy = parseFloat(document.getElementById('energy').value) || 0;

        // Validation
        if (transportation === 0 || food === 0 || energy === 0) {
            alert('Please select all options before calculating!');
            return;
        }

        // Update game state
        gameState.transportation = transportation;
        gameState.food = food;
        gameState.energy = energy;
        gameState.calculated = true;

        totalFootprint = transportation + food + energy;
        footprintDisplay.textContent = totalFootprint.toFixed(1) + ' kg CO2';

        updateVisualization();
        updateTips(transportation, food, energy);
        checkBadges();
        updateLevel();
        showSections();

        // Save progress
        saveProgress();

        // Hide resume section after calculation
        if (resumeSection) {
            resumeSection.style.display = 'none';
        }

        // Play sound
        document.getElementById('calculateSound').play();
    }

    // Save game progress
    function saveProgress() {
        const progressData = {
            score: totalFootprint,
            level: currentLevel,
            timeLeft: 0,
            gameState: gameState,
            badgesEarned: badgesEarned
        };
        progressManager.saveGameProgress(progressData);
    }

    function updateVisualization() {
        // Scale based on footprint: lower footprint = larger tree (better)
        const scale = Math.max(0.5, 2 - (totalFootprint / 5)); // Scale from 0.5 to 2
        tree.style.transform = `scale(${scale})`;

        // Show tree for low footprint, planet for high
        if (totalFootprint <= 3) {
            tree.style.display = 'block';
            planet.style.display = 'none';
            document.getElementById('visualizationText').textContent = 'Great job! Your tree is growing!';
        } else {
            tree.style.display = 'none';
            planet.style.display = 'block';
            document.getElementById('visualizationText').textContent = 'Your planet needs help. Try reducing your footprint!';
        }
    }

    function updateTips(transportation, food, energy) {
        const transKey = transportation.toString();
        const foodKey = food.toString();
        const energyKey = energy.toString();

        tipText.textContent = tips.transportation[transKey] + ' ' + tips.food[foodKey] + ' ' + tips.energy[energyKey];
    }

    function checkBadges() {
        badges.forEach(badge => {
            if (badge.condition(totalFootprint) && !badgesEarned.includes(badge.name)) {
                badgesEarned.push(badge.name);
                showBadgeModal(badge);
                addBadgeToDisplay(badge.name);
            }
        });
        badgesEarnedDisplay.textContent = badgesEarned.length;
    }

    function showBadgeModal(badge) {
        badgeText.textContent = `Congratulations! You earned the "${badge.name}" badge: ${badge.description}`;
        badgeModal.style.display = 'block';
        document.getElementById('badgeSound').play();
    }

    function addBadgeToDisplay(badgeName) {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge';
        badgeElement.textContent = badgeName;
        badgesContainer.appendChild(badgeElement);
    }

    function updateLevel() {
        if (badgesEarned.length >= 3) {
            currentLevel = 'Eco Champion';
        } else if (badgesEarned.length >= 2) {
            currentLevel = 'Green Guardian';
        } else if (badgesEarned.length >= 1) {
            currentLevel = 'Eco Learner';
        }
        levelDisplay.textContent = currentLevel;
    }

    function showSections() {
        tipsSection.style.display = 'block';
        if (badgesEarned.length > 0) {
            badgesSection.style.display = 'block';
        }
    }

    // Close modal
    document.querySelector('.btn-close').addEventListener('click', () => {
        badgeModal.style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', (event) => {
        if (event.target === badgeModal) {
            badgeModal.style.display = 'none';
        }
    });

    // Make closeModal function globally available
    window.closeModal = function() {
        badgeModal.style.display = 'none';
    };
});
