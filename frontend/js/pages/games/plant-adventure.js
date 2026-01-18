/**
 * Plant Adventure - Virtual Plant Growth Simulation Game
 *
 * An educational game where players nurture a plant from seed to mature tree
 * by managing essential resources: water, sunlight, and compost. Features
 * progressive growth stages, boost mechanics, and environmental learning.
 *
 * Game Mechanics:
 * - Plant lifecycle simulation (Seed → Sprout → Sapling → Mature Tree)
 * - Resource management system with visual progress bars
 * - Compost boost system for enhanced growth rates
 * - Growth threshold system based on resource levels
 * - Victory celebration with confetti animation
 * - Educational fun facts for each growth stage
 *
 * Educational Value:
 * - Teaches plant biology and growth requirements
 * - Demonstrates sustainable gardening practices
 * - Shows importance of balanced resource management
 * - Educates about environmental benefits of trees
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== GAME STATE MANAGEMENT =====
/**
 * Core game state variables tracking plant growth and resources
 * @typedef {Object} PlantGameState
 * @property {number} water - Water resource level (0-100%)
 * @property {number} sunlight - Sunlight resource level (0-100%)
 * @property {number} compost - Compost resource level (0-100%)
 * @property {number} currentStage - Current plant growth stage (0-3)
 * @property {boolean} isPlanted - Whether the seed has been planted
 * @property {boolean} compostBoostActive - Whether compost boost is active
 */
let water = 0; // Water resource (0-100%)
let sunlight = 0; // Sunlight resource (0-100%)
let compost = 0; // Compost multiplier (0-100%)
let currentStage = 0; // Plant stage (0: Seed, 1: Sprout, 2: Sapling, 3: Mature Tree)
let isPlanted = false; // Active status (true after "Plant Seed" clicked)
let compostBoostActive = false; // Track if compost boost is active

// ===== GROWTH STAGES CONFIGURATION =====
/**
 * Plant growth stages with requirements and visual representations
 * @typedef {Object} GrowthStage
 * @property {string} name - Stage name for display
 * @property {string} emoji - Unicode emoji representing the stage
 * @property {number} waterNeeded - Minimum water percentage required
 * @property {number} sunNeeded - Minimum sunlight percentage required
 * @property {string} description - Educational description of the stage
 */
const stages = [
  {
    name: 'Seed',
    emoji: '🌰',
    waterNeeded: 0,
    sunNeeded: 0,
    description: 'A tiny seed waiting to sprout'
  },
  {
    name: 'Sprout',
    emoji: '🌱',
    waterNeeded: 30,
    sunNeeded: 20,
    description: 'First leaves breaking through!'
  },
  {
    name: 'Sapling',
    emoji: '🌿',
    waterNeeded: 60,
    sunNeeded: 50,
    description: 'Growing stronger every day'
  },
  {
    name: 'Mature Tree',
    emoji: '🌳',
    waterNeeded: 100,
    sunNeeded: 100,
    description: 'A beautiful, fully grown tree!'
  }
];

// ===== EDUCATIONAL CONTENT =====
/**
 * Educational fun facts corresponding to each growth stage
 * @type {string[]}
 */
const funFacts = [
  "Seeds can remain dormant for years, waiting for the perfect conditions to grow!",
  "The first tiny leaves that sprout are called cotyledons - they feed the baby plant!",
  "A sapling can grow several feet in just one year with proper care and nutrients!",
  "One mature tree produces enough oxygen for 2-4 people every year! 🌍"
];

// ===== DOM ELEMENT REFERENCES =====
/**
 * All interactive DOM elements organized by functionality
 */
const plantSeedBtn = document.getElementById('plant-seed-btn');
const waterBtn = document.getElementById('water-btn');
const sunBtn = document.getElementById('sun-btn');
const compostBtn = document.getElementById('compost-btn');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('status-text');
const plantEmoji = document.getElementById('plant-emoji');
const stageName = document.getElementById('stage-name');
const growthContainer = document.getElementById('growth-container');
const stageRequirements = document.getElementById('stage-requirements');
const waterBar = document.getElementById('water-bar');
const sunBar = document.getElementById('sun-bar');
const compostBar = document.getElementById('compost-bar');
const waterValue = document.getElementById('water-value');
const sunValue = document.getElementById('sun-value');
const compostValue = document.getElementById('compost-value');
const growthBar = document.getElementById('growth-bar');
const totalGrowthValue = document.getElementById('total-growth');
const badgeContainer = document.getElementById('badge-container');
const boostInfo = document.getElementById('boost-info');
const funFactText = document.getElementById('fun-fact');
const confettiContainer = document.getElementById('confetti-container');

// ===== AUDIO FEEDBACK SYSTEM =====
/**
 * Sound effect system using console logging for game feedback
 * @param {string} type - Sound type ('water', 'sun', 'compost', 'grow', 'celebration')
 */
function playSound(type) {
  const sounds = {
    water: '💧 Splosh! Water added',
    sun: '☀️ Shine! Sunlight boosted',
    compost: '🌱 Boost! Growth multiplier active',
    grow: '🌿 Ding! Plant evolved to next stage',
    celebration: '🎉 YAY! Mature tree unlocked'
  };
  console.log(sounds[type]);
}

// ===== PHASE 1: GERMINATION (GAME INITIALIZATION) =====
/**
 * Start the plant growth adventure by planting the seed
 */
function startGame() {
  isPlanted = true;

  // Hide plant seed button
  plantSeedBtn.classList.add('hidden');

  // Show growth container
  growthContainer.classList.remove('hidden');

  // Update status text
  statusText.textContent = 'Growing... 🌱';

  // Enable resource buttons
  waterBtn.disabled = false;
  sunBtn.disabled = false;
  compostBtn.disabled = false;

  // Update plant to seed stage
  plantEmoji.textContent = stages[0].emoji;
  stageName.textContent = stages[0].name;

  // Update requirements
  updateStageRequirements();

  // Play sound
  playSound('grow');
}

// ===== PHASE 2: RESOURCE MANAGEMENT =====
/**
 * Add water to the plant (10% base, 12% with compost boost)
 */
function addWater() {
  if (!isPlanted || water >= 100) return;

  // Calculate increment (10% base + 20% if compost boost active)
  let increment = 10;
  if (compostBoostActive) {
    increment = 12; // 10% + 20% boost = 12%
  }

  water = Math.min(100, water + increment);
  playSound('water');
  updateUI();
  checkGrowthThreshold();
}

/**
 * Add sunlight to the plant (10% base, 12% with compost boost)
 */
function addSunlight() {
  if (!isPlanted || sunlight >= 100) return;

  // Calculate increment (10% base + 20% if compost boost active)
  let increment = 10;
  if (compostBoostActive) {
    increment = 12; // 10% + 20% boost = 12%
  }

  sunlight = Math.min(100, sunlight + increment);
  playSound('sun');
  updateUI();
  checkGrowthThreshold();
}

/**
 * Add compost to activate growth boost (activates at 50% compost)
 */
function addCompost() {
  if (!isPlanted || compost >= 100) return;

  compost = Math.min(100, compost + 10);

  // Activate boost when compost reaches 50%
  if (compost >= 50) {
    compostBoostActive = true;
    boostInfo.classList.remove('hidden');
  }

  playSound('compost');
  updateUI();
}

// ===== PHASE 3: GROWTH THRESHOLDS =====
/**
 * Check if plant has met requirements for next growth stage
 */
function checkGrowthThreshold() {
  let newStage = currentStage;

  // Check each stage transition
  if (water >= 100 && sunlight >= 100 && currentStage < 3) {
    // Stage 2 to 3: Full Tree
    newStage = 3;
  } else if (water >= 60 && sunlight >= 50 && currentStage < 2) {
    // Stage 1 to 2: Sapling
    newStage = 2;
  } else if (water >= 30 && sunlight >= 20 && currentStage < 1) {
    // Stage 0 to 1: Sprout
    newStage = 1;
  }

  // If stage changed, update plant
  if (newStage !== currentStage) {
    currentStage = newStage;
    updatePlantStage();

    // Check for victory
    if (currentStage === 3) {
      launchConfetti();
      badgeContainer.classList.remove('hidden');
      statusText.textContent = '🎉 Congratulations! 🎉';
      playSound('celebration');
    } else {
      playSound('grow');
    }
  }
}

// ===== PLANT VISUAL UPDATES =====
/**
 * Update plant appearance and information for new growth stage
 */
function updatePlantStage() {
  const stage = stages[currentStage];

  // Update emoji with animation
  plantEmoji.classList.remove('grow-animation');
  void plantEmoji.offsetWidth; // Trigger reflow
  plantEmoji.classList.add('grow-animation');
  plantEmoji.textContent = stage.emoji;

  // Update stage name
  stageName.textContent = stage.name;

  // Update fun fact
  funFactText.textContent = funFacts[currentStage];

  // Update requirements
  updateStageRequirements();
}

/**
 * Update the stage requirements display with next goal information
 */
function updateStageRequirements() {
  if (currentStage >= 3) {
    stageRequirements.textContent = '🌳 Fully Grown!';
    stageRequirements.style.background = 'rgba(74, 222, 128, 0.2)';
    stageRequirements.style.borderColor = 'rgba(74, 222, 128, 0.5)';
    stageRequirements.style.color = '#4ade80';
  } else {
    const nextStage = stages[currentStage + 1];
    stageRequirements.textContent = `Next: ${nextStage.name} - Need Water ≥${nextStage.waterNeeded}%, Sunlight ≥${nextStage.sunNeeded}%`;
    stageRequirements.style.background = 'rgba(251, 191, 36, 0.1)';
    stageRequirements.style.borderColor = 'rgba(251, 191, 36, 0.3)';
    stageRequirements.style.color = '#fbbf24';
  }
}

// ===== UI MANAGEMENT =====
/**
 * Update all UI elements to reflect current game state
 */
function updateUI() {
  // Update resource bars
  waterBar.style.width = water + '%';
  sunBar.style.width = sunlight + '%';
  compostBar.style.width = compost + '%';

  // Update resource values
  waterValue.textContent = water + '%';
  sunValue.textContent = sunlight + '%';
  compostValue.textContent = compost + '%';

  // Calculate overall growth (average of water and sunlight)
  const totalGrowth = Math.floor((water + sunlight) / 2);
  growthBar.style.width = totalGrowth + '%';
  totalGrowthValue.textContent = totalGrowth + '%';

  // Disable buttons at max
  waterBtn.disabled = water >= 100;
  sunBtn.disabled = sunlight >= 100;
  compostBtn.disabled = compost >= 100;
}

// ===== VICTORY CELEBRATION =====
/**
 * Launch confetti celebration animation for game completion
 */
function launchConfetti() {
  const confettiEmojis = ['🎉', '🌸', '🌺', '🌼', '⭐', '🌳', '🍃', '✨'];

  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confettiContainer.appendChild(confetti);

    // Remove after animation
    setTimeout(() => confetti.remove(), 3000);
  }

  // Clear confetti container
  setTimeout(() => {
    confettiContainer.innerHTML = '';
  }, 5000);
}

// ===== GAME RESET =====
/**
 * Reset the game to initial state for new playthrough
 */
function resetGame() {
  // Reset all variables
  water = 0;
  sunlight = 0;
  compost = 0;
  currentStage = 0;
  isPlanted = false;
  compostBoostActive = false;

  // Reset UI elements
  statusText.textContent = 'Ready to plant?';
  plantEmoji.textContent = '🪴';
  stageName.textContent = 'Soil';

  // Show plant seed button
  plantSeedBtn.classList.remove('hidden');

  // Hide growth container and badge
  growthContainer.classList.add('hidden');
  badgeContainer.classList.add('hidden');
  boostInfo.classList.add('hidden');

  // Reset progress bars
  waterBar.style.width = '0%';
  sunBar.style.width = '0%';
  compostBar.style.width = '0%';
  growthBar.style.width = '0%';

  // Reset values
  waterValue.textContent = '0%';
  sunValue.textContent = '0%';
  compostValue.textContent = '0%';
  totalGrowthValue.textContent = '0%';

  // Disable buttons
  waterBtn.disabled = true;
  sunBtn.disabled = true;
  compostBtn.disabled = true;

  // Reset fun fact
  funFactText.textContent = funFacts[0];
}

// ===== EVENT LISTENERS =====
/**
 * Set up all game event listeners
 */
plantSeedBtn.addEventListener('click', startGame);
waterBtn.addEventListener('click', addWater);
sunBtn.addEventListener('click', addSunlight);
compostBtn.addEventListener('click', addCompost);
resetBtn.addEventListener('click', resetGame);

// ===== GAME INITIALIZATION =====
/**
 * Initialize the plant adventure game on page load
 */
resetGame();