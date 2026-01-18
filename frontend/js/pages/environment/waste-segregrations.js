/**
 * Waste Segregation Game
 *
 * Interactive educational game teaching proper waste sorting and disposal.
 * Players drag waste items to the correct bins (wet, dry, hazardous) to learn
 * environmental responsibility and waste management.
 *
 * Features:
 * - 8 different waste items with visual icons
 * - Three waste categories: wet, dry, and hazardous
 * - Drag-and-drop gameplay with visual feedback
 * - Scoring system with success animations
 * - Educational messages explaining correct disposal
 * - Responsive design with hover effects
 * - FontAwesome icons for visual representation
 *
 * Educational Value:
 * - Teaches proper waste segregation
 * - Raises awareness about environmental impact
 * - Promotes sustainable waste management practices
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ========== WASTE DATA ==========

/**
 * Collection of waste items with their properties
 * Each item has a name, waste type, and FontAwesome icon
 * @type {Array<Object>}
 */
const wasteItems = [
    {name: "Banana Peel", type: "wet", icon: "fa-carrot"}, // representing food
    {name: "Newspaper", type: "dry", icon: "fa-newspaper"},
    {name: "Battery", type: "hazard", icon: "fa-battery-full"},
    {name: "Plastic Bottle", type: "dry", icon: "fa-bottle-water"},
    {name: "Apple Core", type: "wet", icon: "fa-apple-whole"},
    {name: "Coke Can", type: "dry", icon: "fa-can-food"}, // using can icon
    {name: "Old Medicine", type: "hazard", icon: "fa-pills"},
    {name: "Cardboard Box", type: "dry", icon: "fa-box-open"}
];

// ========== GAME STATE ==========

/**
 * Current player score
 * @type {number}
 */
let score = 0;

/**
 * Currently selected waste item
 * @type {Object|null}
 */
let currentItem = null;

// ========== DOM ELEMENTS ==========

/**
 * Draggable waste item element
 * @type {HTMLElement}
 */
const draggable = document.getElementById('draggable-item');

/**
 * Collection of bin elements (wet, dry, hazard)
 * @type {NodeList}
 */
const bins = document.querySelectorAll('.bin');

/**
 * Score display element
 * @type {HTMLElement}
 */
const scoreDisplay = document.getElementById('score');

/**
 * Game message display element
 * @type {HTMLElement}
 */
const messageDisplay = document.getElementById('game-message');

/**
 * Restart/Next button element
 * @type {HTMLElement}
 */
const restartBtn = document.getElementById('restart-btn');

// ========== GAME INITIALIZATION ==========

/**
 * Initialize and start a new game round
 * Resets UI state and selects a random waste item
 */
function startGame() {
    // Hide restart button and reset message
    restartBtn.style.display = 'none';
    messageDisplay.textContent = "Drag the item to the correct bin!";
    messageDisplay.className = "";

    // Select random waste item
    const randomIndex = Math.floor(Math.random() * wasteItems.length);
    currentItem = wasteItems[randomIndex];

    // Update draggable item UI
    draggable.querySelector('span').textContent = currentItem.name;
    draggable.querySelector('i').className = `fa-solid ${currentItem.icon}`;
    draggable.setAttribute('draggable', 'true');
    draggable.style.opacity = "1";
    draggable.style.cursor = "grab";
}

// ========== DRAG AND DROP EVENTS ==========

// Draggable item events
draggable.addEventListener('dragstart', (e) => {
    // Store waste type in drag data
    e.dataTransfer.setData('text/plain', currentItem.type);

    // Temporarily hide element during drag
    setTimeout(() => draggable.style.display = "none", 0);
});

draggable.addEventListener('dragend', () => {
    // Show element again after drag ends
    draggable.style.display = "flex";
});

// Bin events for each waste bin
bins.forEach(bin => {
    // Allow dropping on bin
    bin.addEventListener('dragover', (e) => {
        e.preventDefault();
        bin.classList.add('drag-over');
    });

    // Remove hover effect when leaving bin
    bin.addEventListener('dragleave', () => {
        bin.classList.remove('drag-over');
    });

    // Handle item drop on bin
    bin.addEventListener('drop', (e) => {
        e.preventDefault();
        bin.classList.remove('drag-over');

        const selectedBinType = bin.getAttribute('data-type');
        checkAnswer(selectedBinType);
    });
});

// ========== GAME LOGIC ==========

/**
 * Check if the selected bin is correct for the current waste item
 * @param {string} selectedBinType - The type of bin selected (wet/dry/hazard)
 */
function checkAnswer(selectedBinType) {
    if (selectedBinType === currentItem.type) {
        // Correct answer
        score += 10;
        scoreDisplay.textContent = score;
        messageDisplay.textContent = `✅ Correct! ${currentItem.name} goes in ${selectedBinType} waste.`;
        messageDisplay.className = "success";

        // Disable further dragging
        draggable.setAttribute('draggable', 'false');
        draggable.style.cursor = "default";
        draggable.style.opacity = "0.5";

        // Play success animation
        playSuccessAnimation();
    } else {
        // Incorrect answer
        messageDisplay.textContent = `❌ Oops! ${currentItem.name} is ${currentItem.type} waste.`;
        messageDisplay.className = "error";
    }

    // Show next button for new round
    restartBtn.style.display = "inline-block";
}

/**
 * Play visual success animation for correct answers
 */
function playSuccessAnimation() {
    // Scale up score display briefly
    scoreDisplay.style.transform = "scale(1.5)";
    setTimeout(() => {
        scoreDisplay.style.transform = "scale(1)";
    }, 200);
}

// ========== INITIALIZATION ==========

// Start the game when page loads
startGame();