/**
 * Ocean Cleanup Challenge - Marine Pollution Educational Game
 *
 * An interactive click-based game where players clean up ocean pollution while
 * avoiding harming marine life. Features progressive difficulty, power-ups,
 * scoring system, and environmental education through gameplay.
 *
 * Game Mechanics:
 * - Click to collect floating trash items
 * - Avoid clicking on sea creatures (fish, turtles, dolphins)
 * - Collect power-ups for bonuses
 * - Level progression based on cleanup count
 * - Lives system with accuracy tracking
 * - Real-time scoring and statistics
 *
 * Educational Value:
 * - Teaches about marine pollution types
 * - Demonstrates impact of plastic waste on ocean life
 * - Promotes environmental stewardship
 * - Shows consequences of pollution on ecosystems
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== OCEAN CLEANUP GAME CLASS =====
/**
 * Main game class managing all ocean cleanup game logic and state
 * @class OceanCleanupGame
 */
class OceanCleanupGame {
  /**
   * Initialize game state and DOM references
   * @constructor
   */
  constructor() {
    // ===== GAME STATE =====
    /** @type {number} Current player score */
    this.score = 0;
    /** @type {number} Remaining lives (hearts) */
    this.lives = 3;
    /** @type {number} Current game level */
    this.level = 1;
    /** @type {number} Total trash items cleaned */
    this.cleaned = 0;
    /** @type {boolean} Whether game is currently active */
    this.gameActive = false;
    /** @type {boolean} Whether game is paused */
    this.gamePaused = false;
    /** @type {number} Progress within current level (0-100) */
    this.levelProgress = 0;
    /** @type {number} Click accuracy percentage */
    this.accuracy = 0;
    /** @type {number} Total clicks made by player */
    this.totalClicks = 0;
    /** @type {number} Correct trash collection clicks */
    this.correctClicks = 0;

    // ===== GAME ELEMENTS ARRAYS =====
    /** @type {Array<HTMLElement>} Currently active trash items */
    this.trashItems = [];
    /** @type {Array<HTMLElement>} Currently active sea creatures */
    this.seaCreatures = [];
    /** @type {Array<HTMLElement>} Currently active power-ups */
    this.powerUps = [];
    /** @type {Array<Object>} Currently active power-up effects */
    this.activePowerUps = [];

    // ===== DOM ELEMENT REFERENCES =====
    /** @type {HTMLElement} Main game area container */
    this.gameArea = document.getElementById('oceanScene');
    /** @type {HTMLElement} Score display element */
    this.scoreElement = document.getElementById('score');
    /** @type {HTMLElement} Lives display element */
    this.livesElement = document.getElementById('lives');
    /** @type {HTMLElement} Level display element */
    this.levelElement = document.getElementById('level');
    /** @type {HTMLElement} Cleaned items counter */
    this.cleanedElement = document.getElementById('cleaned');
    /** @type {HTMLElement} Level progress bar */
    this.levelProgressElement = document.getElementById('levelProgress');
    /** @type {HTMLElement} Progress percentage text */
    this.progressPercentElement = document.getElementById('progressPercent');

    // ===== CONTROL BUTTONS =====
    /** @type {HTMLElement} Start game button */
    this.startBtn = document.getElementById('startBtn');
    /** @type {HTMLElement} Pause/resume button */
    this.pauseBtn = document.getElementById('pauseBtn');
    /** @type {HTMLElement} Reset game button */
    this.resetBtn = document.getElementById('resetBtn');

    // ===== MODAL ELEMENTS =====
    /** @type {HTMLElement} Game over modal */
    this.gameOverModal = document.getElementById('gameOverModal');
    /** @type {HTMLElement} Play again button */
    this.playAgainBtn = document.getElementById('playAgainBtn');
    /** @type {HTMLElement} Close modal button */
    this.closeModal = document.getElementById('closeModal');

    // Initialize the game
    this.init();
  }

  // ===== INITIALIZATION =====
  /**
   * Set up event listeners and create initial game elements
   */
  init() {
    this.bindEvents();
    this.createOceanElements();
    this.updateUI();
  }

  /**
   * Bind all event listeners for game controls and interactions
   */
  bindEvents() {
    this.startBtn.addEventListener('click', () => this.startGame());
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    this.resetBtn.addEventListener('click', () => this.resetGame());
    this.playAgainBtn.addEventListener('click', () => this.restartGame());
    this.closeModal.addEventListener('click', () => this.closeGameOverModal());

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Game area click handling
    this.gameArea.addEventListener('click', (e) => this.handleGameClick(e));
  }

  /**
   * Create decorative ocean elements (coral reefs, sea floor)
   */
  createOceanElements() {
    // Create coral reefs and sea floor decorations
    for (let i = 0; i < 5; i++) {
      const coral = document.createElement('div');
      coral.className = 'coral-reef';
      coral.style.left = `${10 + i * 18}%`;
      coral.style.bottom = `${20 + Math.random() * 30}px`;
      coral.style.transform = `scale(${0.8 + Math.random() * 0.4})`;
      this.gameArea.appendChild(coral);
    }
  }

  // ===== GAME CONTROL METHODS =====
  /**
   * Start the ocean cleanup mission
   */
  startGame() {
    if (this.gameActive) return;

    this.gameActive = true;
    this.gamePaused = false;
    this.startBtn.disabled = true;
    this.pauseBtn.disabled = false;
    this.resetBtn.disabled = false;

    this.spawnTrash();
    this.spawnSeaCreatures();
    this.gameLoop();

    this.showNotification('Ocean cleanup mission started!', 'success');
  }

  /**
   * Toggle game pause/resume state
   */
  togglePause() {
    if (!this.gameActive) return;

    this.gamePaused = !this.gamePaused;
    this.pauseBtn.innerHTML = this.gamePaused ?
      '<i class="fas fa-play"></i> Resume Game' :
      '<i class="fas fa-pause"></i> Pause Game';

    if (this.gamePaused) {
      this.showNotification('Game paused', 'info');
    } else {
      this.showNotification('Game resumed', 'info');
    }
  }

  /**
   * Reset game to initial state
   */
  resetGame() {
    this.gameActive = false;
    this.gamePaused = false;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.cleaned = 0;
    this.levelProgress = 0;
    this.totalClicks = 0;
    this.correctClicks = 0;

    this.clearGameElements();
    this.updateUI();

    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;
    this.resetBtn.disabled = true;

    this.showNotification('Game reset', 'info');
  }

  /**
   * Restart game after game over
   */
  restartGame() {
    this.closeGameOverModal();
    this.resetGame();
    setTimeout(() => this.startGame(), 500);
  }

  /**
   * Close the game over modal
   */
  closeGameOverModal() {
    this.gameOverModal.classList.remove('active');
  }

  // ===== GAME LOOP =====
  /**
   * Main game loop handling spawning, updates, and progression
   */
  gameLoop() {
    if (!this.gameActive || this.gamePaused) return;

    // Spawn new trash periodically (increases with level)
    if (Math.random() < 0.02 + (this.level * 0.005)) {
      this.spawnTrash();
    }

    // Spawn power-ups occasionally
    if (Math.random() < 0.005) {
      this.spawnPowerUp();
    }

    // Update all game elements
    this.updateTrashItems();
    this.updateSeaCreatures();
    this.updatePowerUps();

    // Check level progression
    this.checkLevelProgress();

    requestAnimationFrame(() => this.gameLoop());
  }

  // ===== SPAWNING METHODS =====
  /**
   * Spawn a new trash item at random position
   */
  spawnTrash() {
    const trashTypes = ['plastic', 'bottle', 'bag', 'can', 'wrapper'];
    const trashType = trashTypes[Math.floor(Math.random() * trashTypes.length)];

    const trash = document.createElement('div');
    trash.className = `trash-item ${trashType}`;
    trash.dataset.type = trashType;

    // Random position within game area
    const x = Math.random() * (this.gameArea.offsetWidth - 40);
    const y = Math.random() * (this.gameArea.offsetHeight - 140) + 20;
    trash.style.left = `${x}px`;
    trash.style.top = `${y}px`;

    // Add click handler
    trash.addEventListener('click', (e) => {
      e.stopPropagation();
      this.collectTrash(trash);
    });

    this.gameArea.appendChild(trash);
    this.trashItems.push(trash);
  }

  /**
   * Spawn a sea creature that swims across the screen
   */
  spawnSeaCreatures() {
    const creatureTypes = ['fish', 'turtle', 'dolphin'];
    const creatureType = creatureTypes[Math.floor(Math.random() * creatureTypes.length)];

    const creature = document.createElement('div');
    creature.className = `sea-creature ${creatureType}`;

    // Start from left or right randomly
    const startFromLeft = Math.random() > 0.5;
    creature.style.left = startFromLeft ? '-50px' : `${this.gameArea.offsetWidth}px`;
    creature.style.top = `${Math.random() * (this.gameArea.offsetHeight - 100) + 50}px`;

    // Set animation direction
    creature.style.animationDirection = startFromLeft ? 'normal' : 'reverse';

    this.gameArea.appendChild(creature);
    this.seaCreatures.push(creature);

    // Remove after animation completes
    setTimeout(() => {
      if (creature.parentNode) {
        creature.remove();
        this.seaCreatures = this.seaCreatures.filter(c => c !== creature);
      }
    }, 4000);
  }

  /**
   * Spawn a power-up item at random position
   */
  spawnPowerUp() {
    const powerUp = document.createElement('div');
    powerUp.className = 'power-up';

    const x = Math.random() * (this.gameArea.offsetWidth - 30);
    const y = Math.random() * (this.gameArea.offsetHeight - 130) + 20;
    powerUp.style.left = `${x}px`;
    powerUp.style.top = `${y}px`;

    powerUp.addEventListener('click', (e) => {
      e.stopPropagation();
      this.collectPowerUp(powerUp);
    });

    this.gameArea.appendChild(powerUp);
    this.powerUps.push(powerUp);
  }

  // ===== COLLECTION METHODS =====
  /**
   * Handle trash collection when clicked
   * @param {HTMLElement} trash - The trash element clicked
   */
  collectTrash(trash) {
    if (!this.gameActive || this.gamePaused) return;

    this.score += 10 * this.level;
    this.cleaned++;
    this.correctClicks++;
    this.totalClicks++;

    // Remove trash from DOM and array
    trash.remove();
    this.trashItems = this.trashItems.filter(t => t !== trash);

    this.updateUI();
    this.showFloatingText('+10', trash.style.left, trash.style.top, 'success');

    // Check for level up (every 15 items cleaned)
    if (this.cleaned % 15 === 0) {
      this.levelUp();
    }
  }

  /**
   * Handle power-up collection
   * @param {HTMLElement} powerUp - The power-up element clicked
   */
  collectPowerUp(powerUp) {
    if (!this.gameActive || this.gamePaused) return;

    const powerUpTypes = ['speed', 'points', 'shield'];
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

    this.activatePowerUp(type);
    powerUp.remove();
    this.powerUps = this.powerUps.filter(p => p !== powerUp);

    this.showFloatingText('Power Up!', powerUp.style.left, powerUp.style.top, 'power');
  }

  /**
   * Activate a collected power-up effect
   * @param {string} type - Type of power-up ('speed', 'points', 'shield')
   */
  activatePowerUp(type) {
    const powerUpElement = document.createElement('div');
    powerUpElement.className = 'power-up-item';
    powerUpElement.innerHTML = `<i class="fas fa-${
      type === 'speed' ? 'bolt' :
      type === 'points' ? 'star' : 'shield'
    }"></i> ${type}`;

    document.getElementById('activePowerUps').appendChild(powerUpElement);

    // Remove power-up effect after 10 seconds
    setTimeout(() => {
      if (powerUpElement.parentNode) {
        powerUpElement.remove();
      }
    }, 10000);
  }

  // ===== GAME INTERACTION =====
  /**
   * Handle clicks within the game area
   * @param {MouseEvent} e - Click event
   */
  handleGameClick(e) {
    if (!this.gameActive || this.gamePaused) return;

    this.totalClicks++;

    // Check if clicked on sea creature (penalty)
    const clickedCreature = e.target.closest('.sea-creature');
    if (clickedCreature) {
      this.loseLife();
      this.showFloatingText('-1 Life',
        e.clientX - this.gameArea.offsetLeft + 'px',
        e.clientY - this.gameArea.offsetTop + 'px',
        'error');
      return;
    }

    // Missed click (affects accuracy)
    this.updateUI();
  }

  /**
   * Handle life loss when clicking sea creatures
   */
  loseLife() {
    this.lives--;
    this.updateUI();

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.showNotification(`Lives remaining: ${this.lives}`, 'warning');
    }
  }

  // ===== LEVEL PROGRESSION =====
  /**
   * Handle level advancement
   */
  levelUp() {
    this.level++;
    this.showNotification(`Level ${this.level} reached!`, 'success');

    // Bonus points for leveling up
    this.score += 100 * this.level;
    this.updateUI();
  }

  /**
   * Update level progress based on cleaned items
   */
  checkLevelProgress() {
    const targetCleaned = this.level * 15;
    this.levelProgress = (this.cleaned % 15) / 15 * 100;
    this.updateUI();
  }

  // ===== ELEMENT UPDATES =====
  /**
   * Update trash items (remove expired ones)
   */
  updateTrashItems() {
    // Remove trash that has been on screen too long
    this.trashItems = this.trashItems.filter(trash => {
      if (trash.dataset.spawnTime && Date.now() - trash.dataset.spawnTime > 10000) {
        trash.remove();
        return false;
      }
      return true;
    });
  }

  /**
   * Update sea creatures (handled by CSS animations)
   */
  updateSeaCreatures() {
    // Sea creatures are handled by CSS animations
  }

  /**
   * Update power-ups (remove expired ones)
   */
  updatePowerUps() {
    // Remove expired power-ups
    this.powerUps = this.powerUps.filter(powerUp => {
      if (powerUp.dataset.spawnTime && Date.now() - powerUp.dataset.spawnTime > 8000) {
        powerUp.remove();
        return false;
      }
      return true;
    });
  }

  /**
   * Clear all game elements from DOM
   */
  clearGameElements() {
    this.trashItems.forEach(trash => trash.remove());
    this.seaCreatures.forEach(creature => creature.remove());
    this.powerUps.forEach(powerUp => powerUp.remove());

    this.trashItems = [];
    this.seaCreatures = [];
    this.powerUps = [];
  }

  // ===== UI MANAGEMENT =====
  /**
   * Update all UI elements to reflect current game state
   */
  updateUI() {
    this.scoreElement.textContent = this.score;
    this.livesElement.textContent = '❤️'.repeat(this.lives);
    this.levelElement.textContent = this.level;
    this.cleanedElement.textContent = this.cleaned;
    this.levelProgressElement.style.width = `${this.levelProgress}%`;
    this.progressPercentElement.textContent = `${Math.round(this.levelProgress)}%`;
    this.accuracy = this.totalClicks > 0 ?
      Math.round((this.correctClicks / this.totalClicks) * 100) : 0;
  }

  // ===== GAME END =====
  /**
   * Handle game over state
   */
  gameOver() {
    this.gameActive = false;
    this.showGameOverModal();
    this.showNotification('Mission complete!', 'success');
  }

  /**
   * Display game over modal with final statistics
   */
  showGameOverModal() {
    document.getElementById('finalScore').textContent = this.score;
    document.getElementById('finalCleaned').textContent = this.cleaned;
    document.getElementById('finalLevel').textContent = this.level;
    document.getElementById('finalAccuracy').textContent = `${this.accuracy}%`;

    let achievement = '';
    if (this.score >= 1000) {
      achievement = '🏆 Ocean Hero! You cleaned up a massive amount of pollution!';
    } else if (this.score >= 500) {
      achievement = '🐚 Cleanup Champion! Great job protecting marine life!';
    } else if (this.score >= 200) {
      achievement = '🐠 Marine Guardian! You made a positive impact!';
    } else {
      achievement = '🌱 Eco Warrior! Every cleanup counts!';
    }

    document.getElementById('achievementMessage').textContent = achievement;
    this.gameOverModal.classList.add('active');
  }

  // ===== THEME MANAGEMENT =====
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);

    const themeBtn = document.getElementById('themeToggle');
    themeBtn.innerHTML = newTheme === 'dark' ?
      '<i class="fas fa-sun"></i>' :
      '<i class="fas fa-moon"></i>';
  }

  // ===== VISUAL FEEDBACK =====
  /**
   * Show floating text feedback at specified position
   * @param {string} text - Text to display
   * @param {string} x - X position (CSS value)
   * @param {string} y - Y position (CSS value)
   * @param {string} type - Type of feedback ('success', 'error', 'power')
   */
  showFloatingText(text, x, y, type) {
    const floatingText = document.createElement('div');
    floatingText.className = `floating-text ${type}`;
    floatingText.textContent = text;
    floatingText.style.left = x;
    floatingText.style.top = y;

    this.gameArea.appendChild(floatingText);

    setTimeout(() => {
      if (floatingText.parentNode) {
        floatingText.remove();
      }
    }, 1000);
  }

  /**
   * Show notification message with icon and styling
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
   */
  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = ` <i class="fas fa-${
      type === 'success' ? 'check-circle' :
      type === 'error' ? 'exclamation-circle' :
      type === 'warning' ? 'exclamation-triangle' : 'info-circle'
    }"></i> ${message}`;

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? '#4caf50' :
                 type === 'error' ? '#f44336' :
                 type === 'warning' ? '#ff9800' : '#2196f3',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '25px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      zIndex: '1000',
      fontWeight: '600',
      maxWidth: '300px',
      wordWrap: 'break-word'
    });

    document.body.appendChild(notification);

    // Animate out after 2 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      notification.style.transition = 'all 0.5s ease';
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 2000);
  }
}

// ===== GAME INITIALIZATION =====
/**
 * Initialize the Ocean Cleanup Challenge when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  new OceanCleanupGame();
  console.log('Ocean Cleanup Challenge initialized!');
});