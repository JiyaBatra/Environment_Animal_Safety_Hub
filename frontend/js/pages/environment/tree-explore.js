/**
 * Tree Exploration Game
 *
 * Interactive drag-and-drop game for learning about different tree species.
 * Players match tree names with their corresponding leaf emojis within a time limit.
 * Features sound effects, celebration animations, and educational content.
 *
 * Features:
 * - 40+ different tree species with emoji representations
 * - Drag-and-drop matching gameplay
 * - 90-second timer with visual countdown
 * - Sound effects for correct/incorrect matches
 * - Celebration animations for successful matches
 * - Game completion detection and restart functionality
 * - Responsive design with visual feedback
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ========== DOM ELEMENTS ==========

/**
 * Container for tree name cards
 * @type {HTMLElement}
 */
const treesContainer = document.querySelector('.trees');

/**
 * Container for draggable leaf emojis
 * @type {HTMLElement}
 */
const leavesContainer = document.querySelector('.leaves');

/**
 * Result display area for game messages
 * @type {HTMLElement}
 */
const result = document.querySelector('.result');

/**
 * Audio element for correct match sound
 * @type {HTMLAudioElement}
 */
const correctSound = document.getElementById('correct-sound');

/**
 * Audio element for incorrect match sound
 * @type {HTMLAudioElement}
 */
const wrongSound = document.getElementById('wrong-sound');

/**
 * Audio element for game over sound
 * @type {HTMLAudioElement}
 */
const gameOverSound = document.getElementById('game-over-sound');

/**
 * Timer display element
 * @type {HTMLElement}
 */
const timerEl = document.getElementById('timer');

// ========== TREE DATA ==========

/**
 * Comprehensive list of tree species with their emoji representations
 * Each tree object contains name and emoji properties
 * @type {Array<Object>}
 */
const treesData = [
    {name: "Oak", emoji: "🌳"},
    {name: "Maple", emoji: "🍁"},
    {name: "Palm", emoji: "🌴"},
    {name: "Pine", emoji: "🌲"},
    {name: "Cherry", emoji: "🌸"},
    {name: "Baobab", emoji: "🫵"},
    {name: "Coconut", emoji: "🥥"},
    {name: "Willow", emoji: "🌿"},
    {name: "Fir", emoji: "🎄"},
    {name: "Mango", emoji: "🥭"},
    {name: "Apple", emoji: "🍎"},
    {name: "Banana", emoji: "🍌"},
    {name: "Birch", emoji: "🌳"},
    {name: "Cedar", emoji: "🌲"},
    {name: "Elm", emoji: "🌿"},
    {name: "Holly", emoji: "🎄"},
    {name: "Spruce", emoji: "🎄"},
    {name: "Ash", emoji: "🌿"},
    {name: "Beech", emoji: "🌳"},
    {name: "Chestnut", emoji: "🌰"},
    {name: "Fig", emoji: "🌱"},
    {name: "Ginkgo", emoji: "🍃"},
    {name: "Hazel", emoji: "🌰"},
    {name: "Linden", emoji: "🌿"},
    {name: "Magnolia", emoji: "🌼"},
    {name: "Olive", emoji: "🫒"},
    {name: "Pear", emoji: "🍐"},
    {name: "Plum", emoji: "🍑"},
    {name: "Walnut", emoji: "🌰"},
    {name: "Redwood", emoji: "🌲"},
    {name: "Sequoia", emoji: "🌲"},
    {name: "Dogwood", emoji: "🌸"},
    {name: "Jacaranda", emoji: "🌺"},
    {name: "Banyan", emoji: "🌳"},
    {name: "Teak", emoji: "🫵"},
    {name: "Acacia", emoji: "🌿"},
    {name: "Eucalyptus", emoji: "🌿"},
    {name: "Kapok", emoji: "🌳"},
    {name: "Date Palm", emoji: "🌴"},
    {name: "Cypress", emoji: "🌲"},
    {name: "Aspen", emoji: "🍃"},
    {name: "Sycamore", emoji: "🌿"}
];

// ========== GAME STATE ==========

/**
 * Currently selected trees for the game round
 * @type {Array<Object>}
 */
let currentTrees = [];

/**
 * Currently available leaves to drag (shuffled version of currentTrees)
 * @type {Array<Object>}
 */
let currentLeaves = [];

/**
 * Reference to the currently dragged leaf element
 * @type {HTMLElement|null}
 */
let draggedLeaf = null;

/**
 * Timer interval reference
 * @type {number}
 */
let timer;

/**
 * Remaining time in seconds (90 seconds total)
 * @type {number}
 */
let timeLeft = 90;

// ========== GAME INITIALIZATION ==========

/**
 * Initialize a new game round
 * Resets all game state, clears containers, and starts fresh
 */
function initGame() {
    // Clear result messages
    result.textContent = "";

    // Clear game containers
    treesContainer.innerHTML = "";
    leavesContainer.innerHTML = "";

    // Reset timer
    clearInterval(timer);
    timeLeft = 90;
    startTimer();

    // Select and shuffle 5 random trees
    currentTrees = shuffleArray(treesData).slice(0, 5);
    currentLeaves = shuffleArray([...currentTrees]);

    // Render tree name cards
    currentTrees.forEach(tree => {
        const div = document.createElement('div');
        div.classList.add('tree');
        div.setAttribute('data-tree', tree.name);
        div.textContent = tree.name;

        // Add drag event listeners
        div.addEventListener('dragover', dragOver);
        div.addEventListener('drop', dropLeaf);

        treesContainer.appendChild(div);
    });

    // Render draggable leaf emojis
    currentLeaves.forEach(leaf => {
        const div = document.createElement('div');
        div.classList.add('leaf');
        div.setAttribute('draggable', true);
        div.setAttribute('data-tree', leaf.name);
        div.textContent = leaf.emoji;

        // Add drag event listener
        div.addEventListener('dragstart', dragStart);

        leavesContainer.appendChild(div);
    });
}

// ========== TIMER FUNCTIONS ==========

/**
 * Start the game timer countdown
 */
function startTimer() {
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGameTimeout();
        }
    }, 1000);
}

/**
 * Update the timer display with formatted time
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.textContent = `⏰ ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// ========== DRAG AND DROP FUNCTIONS ==========

/**
 * Handle drag start event for leaf elements
 * @param {DragEvent} e - The drag event
 */
function dragStart(e) {
    draggedLeaf = e.target;
}

/**
 * Handle drag over event to allow dropping
 * @param {DragEvent} e - The drag event
 */
function dragOver(e) {
    e.preventDefault();
}

/**
 * Handle leaf drop on tree element
 * Checks if the match is correct and provides feedback
 * @param {DragEvent} e - The drop event
 */
function dropLeaf(e) {
    const tree = e.target;
    const treeName = tree.getAttribute('data-tree');
    const leafName = draggedLeaf.getAttribute('data-tree');

    if (treeName === leafName) {
        // Correct match
        tree.classList.add('correct');
        correctSound.play();
        createCelebration(tree);
        createCelebration(draggedLeaf);
        draggedLeaf.remove();
        checkGameCompletion();
    } else {
        // Incorrect match
        tree.classList.add('incorrect');
        wrongSound.play();
        setTimeout(() => tree.classList.remove('incorrect'), 800);
    }
}

// ========== GAME LOGIC ==========

/**
 * Check if all leaves have been matched successfully
 */
function checkGameCompletion() {
    if (document.querySelectorAll('.leaf').length === 0) {
        clearInterval(timer);
        treesContainer.innerHTML = "";
        leavesContainer.innerHTML = "";
        result.innerHTML = `
            🎉 Congratulations! You matched all the trees! <br>
            <div class="btn-group">
                <button class="reset-btn" onclick="initGame()">Play Again</button>
                <button class="exit-btn" onclick="exitGame()">Exit</button>
            </div>
        `;
        correctSound.play();
    }
}

/**
 * Handle game timeout when timer reaches zero
 */
function endGameTimeout() {
    treesContainer.innerHTML = "";
    leavesContainer.innerHTML = "";
    result.innerHTML = `
        ⏰ Time's up! Don't worry, you can try again! <br>
        <div class="btn-group">
            <button class="reset-btn" onclick="initGame()">Play Again</button>
            <button class="exit-btn" onclick="exitGame()">Exit</button>
        </div>
    `;
    gameOverSound.play();
}

// ========== CELEBRATION EFFECTS ==========

/**
 * Create celebration animation with random emojis
 * @param {HTMLElement} element - Element to celebrate around
 */
function createCelebration(element) {
    const emojis = ["🎉", "✨", "⭐", "💚", "🌱"];

    for (let i = 0; i < 5; i++) {
        const span = document.createElement('span');
        span.classList.add('celebration');
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // Position randomly around the element
        const rect = element.getBoundingClientRect();
        span.style.left = rect.left + window.scrollX + Math.random() * rect.width + "px";
        span.style.top = rect.top + window.scrollY + Math.random() * rect.height + "px";

        document.body.appendChild(span);

        // Remove after animation
        setTimeout(() => {
            span.remove();
        }, 1000);
    }
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Exit the game and return to previous page
 */
function exitGame() {
    history.back();
}

/**
 * Shuffle array elements randomly using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// ========== INITIALIZATION ==========

// Start the game when page loads
initGame();