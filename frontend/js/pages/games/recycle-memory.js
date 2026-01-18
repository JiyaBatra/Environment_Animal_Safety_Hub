/**
 * Eco Memory Card Game - Environmental Facts Matching
 *
 * An educational memory card game where players match pairs of environmental
 * facts and emojis to learn about sustainability and conservation. Features
 * timer, flip counter, and educational content integration.
 *
 * Game Mechanics:
 * - 16 cards (8 pairs) randomly selected from environmental fact database
 * - Card flipping mechanics with match validation
 * - Timer tracking game duration
 * - Flip counter for performance measurement
 * - Educational facts revealed on successful matches
 * - Victory modal with final statistics
 *
 * Educational Value:
 * - Environmental awareness through curated facts
 * - Memory skills development through pattern matching
 * - Conservation knowledge about trees, recycling, oceans, wildlife
 * - Understanding of ecological systems and human impact
 *
 * Technical Features:
 * - Randomized card selection and shuffling
 * - Game state management (locked during animations)
 * - Audio feedback for matches
 * - Responsive card layout with CSS transforms
 * - Modal victory screen with statistics
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== ENVIRONMENTAL EDUCATION DATABASE =====
/**
 * Comprehensive database of environmental facts with emojis
 * Each entry contains an emoji icon and educational fact
 * @typedef {Object} EcoFact
 * @property {string} emoji - Unicode emoji representing the environmental concept
 * @property {string} fact - Educational fact about environmental conservation
 */
const ecoData = [
  { emoji: '🌱', fact: "A single tree can absorb 48 pounds of CO2 per year!" },
  { emoji: '♻️', fact: "Recycling one aluminum can saves enough energy to run a TV for 3 hours." },
  { emoji: '🔋', fact: "Batteries contain heavy metals; always recycle them at special points!" },
  { emoji: '🌍', fact: "Earth's oceans provide 50% of our planet's oxygen." },
  { emoji: '🦄', fact: "Plastic takes up to 450 years to decompose in a landfill." },
  { emoji: '🌳', fact: "Forests are home to over 80% of terrestrial biodiversity." },
  { emoji: '📦', fact: "Recycling paper saves 70% less energy than making it from raw wood." },
  { emoji: '💡', fact: "LED bulbs use 75% less energy than traditional ones." },
  { emoji: '👕', fact: "It takes 2,700 liters of water to make just one cotton t-shirt." },
  { emoji: '🚲', fact: "Cycling instead of driving saves 150g of CO2 per kilometer." },
  { emoji: '💧', fact: "Only 1% of the world's water is fresh and accessible for us to drink." },
  { emoji: '🐝', fact: "Bees pollinate 1/3 of the food we eat every day!" },
  { emoji: '🐢', fact: "Sea turtles often mistake plastic bags for jellyfish food." },
  { emoji: '☀️', fact: "The sun provides more energy in one hour than the world uses in a year." },
  { emoji: '🐋', fact: "Blue whales can eat up to 4 tons of krill daily!" }
];

// ===== GAME STATE MANAGEMENT =====
/**
 * Core game state variables tracking player progress and game status
 * @typedef {Object} GameState
 * @property {HTMLDivElement[]} flippedCards - Currently flipped cards awaiting match check
 * @property {number} matchedCount - Number of successful matches (0-8)
 * @property {number} flips - Total number of card flips performed
 * @property {number} seconds - Game duration in seconds
 * @property {number|null} timerInterval - Timer interval ID for cleanup
 * @property {boolean} isLocked - Prevents interaction during animations
 */
let flippedCards = [];     // Cards currently flipped for matching
let matchedCount = 0;      // Number of matched pairs (0-8)
let flips = 0;            // Total card flips counter
let seconds = 0;          // Game timer in seconds
let timerInterval = null; // Timer interval reference
let isLocked = false;     // Lock state during animations

// ===== GAME INITIALIZATION =====
/**
 * Initialize the memory game by creating and shuffling cards
 * Selects 8 random facts from the database and creates matching pairs
 */
function initGame() {
  const board = document.getElementById('gameBoard');
  board.innerHTML = '';

  // Select 8 random facts from the database for variety
  const selectedData = [...ecoData]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  // Create pairs and shuffle the deck
  const gameItems = [...selectedData, ...selectedData]
    .sort(() => Math.random() - 0.5);

  // Generate card elements
  gameItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">${item.emoji}</div>
      </div>
    `;

    // Store data for matching logic
    card.dataset.emoji = item.emoji;
    card.dataset.fact = item.fact;

    // Add click handler
    card.addEventListener('click', () => handleFlip(card));

    board.appendChild(card);
  });
}

// ===== CARD INTERACTION =====
/**
 * Handle card flip interaction with validation and state management
 * @param {HTMLDivElement} card - The card element clicked by the player
 */
function handleFlip(card) {
  // Prevent interaction if game is locked or card is already flipped/matched
  if (isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }

  // Start timer on first flip
  if (!timerInterval) {
    startTimer();
  }

  // Flip the card
  card.classList.add('flipped');
  flippedCards.push(card);

  // Check for match when two cards are flipped
  if (flippedCards.length === 2) {
    flips++;
    document.getElementById('flips').textContent = flips;
    isLocked = true;
    checkMatch();
  }
}

// ===== MATCH VALIDATION =====
/**
 * Check if the two flipped cards form a valid match
 * Handles both successful matches and mismatches with appropriate feedback
 */
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.emoji === card2.dataset.emoji) {
    // Successful match
    card1.classList.add('matched');
    card2.classList.add('matched');

    // Play match sound
    document.getElementById('matchSound').play();

    // Display educational fact
    document.getElementById('factText').textContent = card1.dataset.fact;

    // Update match counter
    matchedCount++;
    document.getElementById('matches').textContent = matchedCount;

    // Reset flipped cards array
    flippedCards = [];
    isLocked = false;

    // Check for game completion
    if (matchedCount === 8) {
      setTimeout(endGame, 500);
    }
  } else {
    // No match - flip cards back after delay
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      isLocked = false;
    }, 800);
  }
}

// ===== TIMER MANAGEMENT =====
/**
 * Start the game timer that increments every second
 */
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById('timer').textContent = seconds;
  }, 1000);
}

// ===== GAME COMPLETION =====
/**
 * Handle game completion by stopping timer and showing victory modal
 */
function endGame() {
  // Stop the timer
  clearInterval(timerInterval);

  // Display victory modal with final statistics
  const modal = document.getElementById('gameOverModal');
  const finalTime = document.getElementById('finalTime');
  const finalFlips = document.getElementById('finalFlips');

  // Update modal content (with null checks for safety)
  if (finalTime) finalTime.textContent = seconds;
  if (finalFlips) finalFlips.textContent = flips;
  if (modal) modal.classList.add('active');
}

// ===== EVENT LISTENERS =====
/**
 * Set up game control event handlers
 */

// Reset button - Reload the page for new game
document.getElementById('resetBtn').addEventListener('click', () => location.reload());

// Modal reset button - Also reloads for new game
document.getElementById('modalResetBtn').addEventListener('click', () => location.reload());

// ===== GAME STARTUP =====
/**
 * Initialize the memory game on page load
 */
initGame();