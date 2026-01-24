/**
 * Waste Sorting Challenge - Environmental Recycling Game
 *
 * An interactive game where players sort falling waste items into correct
 * recycling bins (Recycle, Compost, Trash) using drag-and-drop mechanics.
 * Features scoring system, combo multipliers, accuracy tracking, and time pressure.
 *
 * Game Mechanics:
 * - Falling waste items with random spawn timing
 * - Three recycling categories: Recycle, Compost, Trash
 * - Drag-and-drop interface with touch support
 * - Scoring system with combo multipliers for consecutive correct sorts
 * - Accuracy percentage tracking
 * - 60-second time limit with falling item penalty system
 * - Visual feedback for correct/incorrect placements
 *
 * Educational Value:
 * - Teaches proper waste sorting and recycling practices
 * - Demonstrates environmental impact of correct disposal
 * - Builds awareness of different waste categories
 * - Encourages sustainable waste management habits
 * - Shows consequences of improper waste disposal
 *
 * Technical Features:
 * - HTML5 Drag and Drop API with touch event fallbacks
 * - Real-time animation system for falling items
 * - Combo scoring system with multiplier bonuses
 * - Responsive design with mobile touch controls
 * - Audio feedback for user interactions
 * - Game state management with timer and statistics
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== WASTE ITEMS DATABASE =====
/**
 * Comprehensive database of waste items organized by disposal category
 * Each category contains items with emoji icons for visual representation
 * @typedef {Object} WasteDatabase
 * @property {Array.<{icon: string}>} recycle - Items that can be recycled (paper, plastic, metal, etc.)
 * @property {Array.<{icon: string}>} compost - Organic items that can be composted
 * @property {Array.<{icon: string}>} trash - Items that go to landfill
 */
const wasteDatabase = {
  recycle: [
    { icon: '🗃️' },  // Box (cardboard)
    { icon: '📰' },   // Newspaper
    { icon: '📖' },   // Book
    { icon: '🗞️' },   // Newspaper roll
    { icon: '🥫' }    // Can
  ],
  compost: [
    { icon: '🍎' },   // Apple
    { icon: '🥕' },   // Carrot
    { icon: '🥔' },   // Potato
    { icon: '🥕' },   // Banana peel
    { icon: '🌽' }    // Corn
  ],
  trash: [
    { icon: '🍬' },   // Candy wrapper
    { icon: '🥤' },   // Plastic cup
    { icon: '🔋' },   // Battery
    { icon: '👕' },   // Old clothing
    { icon: '🧽' }    // Sponge
  ]
};

// ===== GAME STATE MANAGEMENT =====
/**
 * Core game state variables tracking player progress and game status
 * @typedef {Object} WasteGameState
 * @property {number} score - Current player score
 * @property {number} timeLeft - Seconds remaining in game
 * @property {boolean} isPlaying - Whether game is currently active
 * @property {number} totalAttempts - Total waste items processed
 * @property {number} correctAttempts - Number of correct sorts
 * @property {number} currentCombo - Current consecutive correct streak
 * @property {number} spawnRate - Milliseconds between item spawns
 */
const game = {
  score: 0,           // Current player score
  timeLeft: 60,       // Game duration in seconds
  isPlaying: false,   // Game active status
  totalAttempts: 0,   // Total items processed
  correctAttempts: 0, // Correctly sorted items
  currentCombo: 0,    // Consecutive correct streak
  spawnRate: 1500     // Item spawn interval (ms)
};

// ===== DOM ELEMENT REFERENCES =====
/**
 * All interactive DOM elements organized by functionality
 */
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const accuracyDisplay = document.getElementById('accuracy');
const startBtn = document.getElementById('startGameBtn');
const modal = document.getElementById('gameOverModal');
const finalScoreEl = document.getElementById('finalScore');
const finalScoreText = document.getElementById('finalScoreText');
const bins = document.querySelectorAll('.bin');
const pointSound = document.getElementById('pointSound');

// ===== GAME TIMERS AND INTERVALS =====
/**
 * Timer and interval references for game loop management
 * @type {Object}
 */
let gameTimerInterval;    // Main game timer (counts down from 60)
let spawnInterval;        // Waste item spawn timer
let activeTouchItem = null; // Currently touched item for mobile

// ===== GAME INITIALIZATION =====
/**
 * Set up event listeners and prepare game for play
 */
startBtn.addEventListener('click', function(e) {
  e.preventDefault();
  initializeGame();
});

/**
 * Initialize and start a new game session
 * Resets all game state and begins gameplay
 */
function initializeGame() {
  if (game.isPlaying) return;

  // Reset game state
  game.isPlaying = true;
  game.score = 0;
  game.timeLeft = 60;
  game.totalAttempts = 0;
  game.correctAttempts = 0;
  game.currentCombo = 0;

  // Reset UI displays
  scoreDisplay.innerText = '0';
  timerDisplay.innerText = '60s';
  accuracyDisplay.innerText = '--';

  // Clear game area
  gameArea.innerHTML = '';
  gameArea.classList.add('active');

  // Hide/show UI elements
  startBtn.style.display = 'none';
  modal.style.display = 'none';

  // Start game systems
  startGameTimer();
  spawnWasteItem();
  spawnInterval = setInterval(spawnWasteItem, game.spawnRate);
}

// ===== TIMER MANAGEMENT =====
/**
 * Start the main game timer that counts down from 60 seconds
 */
function startGameTimer() {
  gameTimerInterval = setInterval(() => {
    game.timeLeft--;
    timerDisplay.innerText = game.timeLeft + 's';

    if (game.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// ===== WASTE ITEM SPAWNING =====
/**
 * Create and spawn a new waste item that falls from the top of the game area
 */
function spawnWasteItem() {
  if (!game.isPlaying) return;

  // Select random category and item
  const categories = ['recycle', 'compost', 'trash'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const itemData = wasteDatabase[category][Math.floor(Math.random() * wasteDatabase[category].length)];

  // Create waste item element
  const itemEl = document.createElement('div');
  itemEl.classList.add('waste-item');
  itemEl.innerText = itemData.icon;
  itemEl.setAttribute('draggable', true);
  itemEl.dataset.category = category;

  // Position randomly at top
  const maxLeft = Math.max(gameArea.clientWidth - 60, 0);
  itemEl.style.left = Math.random() * maxLeft + 'px';
  itemEl.style.top = '-60px';

  // ===== DESKTOP DRAG AND DROP =====
  itemEl.addEventListener('dragstart', (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('category', category);
    itemEl.classList.add('dragging');
  });

  itemEl.addEventListener('dragend', () => {
    itemEl.classList.remove('dragging');
  });

  // ===== MOBILE TOUCH CONTROLS =====
  itemEl.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!game.isPlaying) return;
    activeTouchItem = itemEl;
    itemEl.classList.add('dragging');
  });

  itemEl.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!activeTouchItem) return;

    const touch = e.touches[0];
    const rect = gameArea.getBoundingClientRect();
    const x = touch.clientX - rect.left - 30;
    const y = touch.clientY - rect.top - 30;

    // Constrain to game area bounds
    itemEl.style.left = Math.max(0, Math.min(x, rect.width - 60)) + 'px';
    itemEl.style.top = Math.max(0, Math.min(y, rect.height - 60)) + 'px';
  });

  itemEl.addEventListener('touchend', (e) => {
    if (!activeTouchItem) return;

    const touch = e.changedTouches[0];
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const bin = elemBelow ? elemBelow.closest('.bin') : null;

    if (bin) {
      checkAnswer(bin, category, itemEl);
    } else {
      itemEl.classList.remove('dragging');
    }

    activeTouchItem = null;
  });

  // Add to game area and start falling animation
  gameArea.appendChild(itemEl);
  animateFall(itemEl);
}

// ===== FALLING ANIMATION =====
/**
 * Animate the waste item falling down the screen
 * @param {HTMLElement} itemEl - The waste item element to animate
 */
function animateFall(itemEl) {
  let position = -60;
  const fallSpeed = 2 + Math.random() * 2; // Random speed variation
  let isRemoved = false;

  const fallInterval = setInterval(() => {
    if (!game.isPlaying) {
      clearInterval(fallInterval);
      return;
    }

    // Only move if not being dragged
    if (!itemEl.classList.contains('dragging')) {
      position += fallSpeed;
      itemEl.style.top = position + 'px';
    }

    // Remove if falls off screen
    if (position > gameArea.clientHeight) {
      clearInterval(fallInterval);
      if (!isRemoved && gameArea.contains(itemEl)) {
        isRemoved = true;
        game.totalAttempts++;
        game.score = Math.max(0, game.score - 3); // Penalty for missed items
        game.currentCombo = 0;
        updateDisplay();
        itemEl.remove();
      }
    }
  }, 30);

  // Store interval reference for cleanup
  itemEl.dataset.interval = fallInterval;
}

// ===== BIN INTERACTION SETUP =====
/**
 * Set up drag-and-drop event handlers for recycling bins
 */
bins.forEach(bin => {
  // Desktop drag events
  bin.addEventListener('dragover', (e) => {
    e.preventDefault();
    bin.classList.add('hovered');
  });

  bin.addEventListener('dragleave', () => {
    bin.classList.remove('hovered');
  });

  bin.addEventListener('drop', (e) => {
    e.preventDefault();
    bin.classList.remove('hovered');

    const itemCategory = e.dataTransfer.getData('category');
    const draggedItem = document.querySelector('.waste-item.dragging');

    if (draggedItem) {
      checkAnswer(bin, itemCategory, draggedItem);
    }
  });
});

// ===== ANSWER VALIDATION =====
/**
 * Check if waste item was placed in correct bin and update score
 * @param {HTMLElement} bin - The bin element where item was dropped
 * @param {string} itemCategory - The correct category for the item
 * @param {HTMLElement} itemEl - The waste item element
 */
function checkAnswer(bin, itemCategory, itemEl) {
  const binType = bin.dataset.type;
  game.totalAttempts++;

  const isCorrect = itemCategory === binType;

  if (isCorrect) {
    // Correct placement - award points with combo bonus
    const points = 10 + (game.currentCombo * 5);
    game.score += points;
    game.correctAttempts++;
    game.currentCombo++;
    showFeedback(itemEl, `+${points}`, 'correct');
  } else {
    // Incorrect placement - penalty
    game.score = Math.max(0, game.score - 5);
    game.currentCombo = 0;
    showFeedback(itemEl, '-5', 'incorrect');
  }

  // Play sound feedback
  if (pointSound) {
    pointSound.currentTime = 0;
    pointSound.play();
  }

  // Update displays and remove item
  updateDisplay();
  const interval = itemEl.dataset.interval;
  if (interval) clearInterval(parseInt(interval));
  itemEl.remove();
}

// ===== VISUAL FEEDBACK =====
/**
 * Display floating feedback text for scoring actions
 * @param {HTMLElement} element - Element to position feedback near
 * @param {string} text - Feedback text to display
 * @param {string} type - Feedback type ('correct' or 'incorrect')
 */
function showFeedback(element, text, type) {
  const feedback = document.createElement('div');
  feedback.classList.add('feedback', type);
  feedback.innerText = text;

  // Position relative to item
  const rect = element.getBoundingClientRect();
  const gameRect = gameArea.getBoundingClientRect();
  feedback.style.left = (rect.left - gameRect.left + 20) + 'px';
  feedback.style.top = (rect.top - gameRect.top + 20) + 'px';

  gameArea.appendChild(feedback);

  // Auto-remove after animation
  setTimeout(() => feedback.remove(), 1000);
}

// ===== UI UPDATES =====
/**
 * Update all game display elements with current state
 */
function updateDisplay() {
  scoreDisplay.innerText = game.score;

  // Calculate and display accuracy
  if (game.totalAttempts > 0) {
    const accuracy = Math.round((game.correctAttempts / game.totalAttempts) * 100);
    accuracyDisplay.innerText = accuracy + '%';
  } else {
    accuracyDisplay.innerText = '--';
  }
}

// ===== GAME COMPLETION =====
/**
 * End the current game session and display final results
 */
function endGame() {
  game.isPlaying = false;

  // Stop all timers and intervals
  clearInterval(gameTimerInterval);
  clearInterval(spawnInterval);

  // Clean up game area
  gameArea.classList.remove('active');
  document.querySelectorAll('.waste-item').forEach(el => {
    const interval = el.dataset.interval;
    if (interval) clearInterval(parseInt(interval));
    el.remove();
  });

  // Show final results
  finalScoreEl.innerText = game.score;
  finalScoreText.innerText = game.score;
  modal.style.display = 'flex';
  startBtn.style.display = 'block';
}

// ===== NAVIGATION =====
/**
 * Handle back button with game quit confirmation
 */
document.getElementById('backBtn').addEventListener('click', () => {
  if (game.isPlaying) {
    // Confirm quit with score loss warning
    const quit = confirm("Do you want to quit the game? Your current score will be lost!");
    if (quit) {
      window.location.href = "../../index.html";
    }
  } else {
    window.location.href = "../../index.html";
  }
});