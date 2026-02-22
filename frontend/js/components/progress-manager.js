/**
 * ProgressManager - Unified Progress Tracking System
 *
 * A centralized class for managing quiz progress persistence across all quiz types.
 * Provides consistent localStorage operations, data validation, and progress migration.
 *
 * Features:
 * - Standardized progress data structure
 * - Automatic data validation and error handling
 * - Consistent localStorage key naming
 * - Progress migration support for future updates
 * - Resume functionality with timestamp validation
 *
 * @class ProgressManager
 */
class ProgressManager {
  /**
   * Create a new ProgressManager instance
   * @param {string} quizId - Unique identifier for the quiz (e.g., 'animal-first-aid')
   */
  constructor(quizId) {
    this.quizId = quizId;
    this.storageKey = `quizProgress_${quizId}`;
    this.currentVersion = '1.0';
  }

  /**
   * Standardized progress data structure
   * @typedef {Object} QuizProgress
   * @property {string} quizId - Unique quiz identifier
   * @property {number} currentIndex - Current question index
   * @property {number[]} answers - Array of selected answer indices
   * @property {number} score - Current score
   * @property {number} remainingTime - Remaining time in seconds
   * @property {number} timestamp - Last save timestamp
   * @property {string} version - Progress data version
   * @property {QuizQuestion[]} quizQuestions - Array of quiz questions
   */

  /**
   * Save quiz progress to localStorage
   * @param {Object} progressData - Progress data to save
   * @param {number} progressData.currentIndex - Current question index
   * @param {number[]} progressData.answers - Array of selected answers
   * @param {number} progressData.score - Current score
   * @param {number} progressData.remainingTime - Remaining time in seconds
   * @param {QuizQuestion[]} progressData.quizQuestions - Array of quiz questions
   * @returns {boolean} True if save was successful
   */
  saveProgress(progressData) {
    try {
      const progress = {
        quizId: this.quizId,
        currentIndex: progressData.currentIndex || 0,
        answers: progressData.answers || [],
        score: progressData.score || 0,
        remainingTime: progressData.remainingTime || 0,
        quizQuestions: progressData.quizQuestions || [],
        timestamp: Date.now(),
        version: this.currentVersion
      };

      // Validate progress data
      if (!this.validateProgress(progress)) {
        console.error('Invalid progress data:', progress);
        return false;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  /**
   * Load saved quiz progress from localStorage
   * @returns {Object|null} Progress data if available and valid, null otherwise
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return null;

      const progress = JSON.parse(saved);

      // Validate loaded progress
      if (!this.validateProgress(progress)) {
        console.warn('Invalid saved progress, clearing:', progress);
        this.clearProgress();
        return null;
      }

      // Check if progress is for the correct quiz
      if (progress.quizId !== this.quizId) {
        console.warn('Progress quizId mismatch, clearing');
        this.clearProgress();
        return null;
      }

      return progress;
    } catch (error) {
      console.error('Error loading progress:', error);
      this.clearProgress();
      return null;
    }
  }

  /**
   * Clear saved progress from localStorage
   * @returns {boolean} True if clear was successful
   */
  clearProgress() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing progress:', error);
      return false;
    }
  }

  /**
   * Check if progress exists and is resumable
   * @param {number} maxAge - Maximum age in milliseconds (default: 24 hours)
   * @returns {boolean} True if progress can be resumed
   */
  canResume(maxAge = 24 * 60 * 60 * 1000) {
    const progress = this.loadProgress();
    if (!progress) return false;

    // Check if progress is too old
    const age = Date.now() - progress.timestamp;
    if (age > maxAge) {
      console.log('Progress too old, clearing');
      this.clearProgress();
      return false;
    }

    return true;
  }

  /**
   * Validate progress data structure
   * @param {Object} progress - Progress data to validate
   * @returns {boolean} True if progress is valid
   */
  validateProgress(progress) {
    if (!progress || typeof progress !== 'object') return false;

    // Required fields
    const requiredFields = ['quizId', 'currentIndex', 'answers', 'score', 'remainingTime', 'timestamp', 'version', 'quizQuestions'];
    for (const field of requiredFields) {
      if (!(field in progress)) return false;
    }

    // Type validation
    if (typeof progress.quizId !== 'string') return false;
    if (typeof progress.currentIndex !== 'number' || progress.currentIndex < 0) return false;
    if (!Array.isArray(progress.answers)) return false;
    if (typeof progress.score !== 'number' || progress.score < 0) return false;
    if (typeof progress.remainingTime !== 'number' || progress.remainingTime < 0) return false;
    if (typeof progress.timestamp !== 'number') return false;
    if (typeof progress.version !== 'string') return false;

    return true;
  }

  /**
   * Migrate progress data from old format to new format
   * @param {Object} oldProgress - Old progress data
   * @returns {Object} Migrated progress data
   */
  migrateProgress(oldProgress) {
    // Handle different old formats
    const migrated = {
      quizId: this.quizId,
      currentIndex: oldProgress.currentIndex || oldProgress.index || 0,
      answers: oldProgress.answers || [],
      score: oldProgress.score || 0,
      remainingTime: oldProgress.remainingTime || oldProgress.time || 0,
      timestamp: oldProgress.timestamp || Date.now(),
      version: this.currentVersion
    };

    return migrated;
  }
}

// Export for use in other files
export default ProgressManager;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProgressManager;
}

/**
 * GameProgressManager - Extended ProgressManager for Games
 * 
 * This extends the base ProgressManager with game-specific functionality.
 * Can be used interchangeably with ProgressManager for game progress tracking.
 * 
 * @class GameProgressManager
 */
class GameProgressManager extends ProgressManager {
  /**
   * Create a new GameProgressManager instance
   * @param {string} gameId - Unique identifier for the game (e.g., 'carbon-footprint-calculator')
   */
  constructor(gameId) {
    // Use 'game' prefix to differentiate from quiz progress
    super(`game_${gameId}`);
    this.gameId = gameId;
    this.storageKey = `gameProgress_${gameId}`;
  }

  /**
   * Standardized game progress data structure
   * @typedef {Object} GameProgress
   * @property {string} gameId - Unique game identifier
   * @property {number} score - Current score
   * @property {number} level - Current level
   * @property {number} timeLeft - Remaining time in seconds (for timed games)
   * @property {Object} gameState - Game-specific state data
   * @property {Array} badgesEarned - Array of earned badge names
   * @property {number} timestamp - Last save timestamp
   * @property {string} version - Progress data version
   */

  /**
   * Save game progress to localStorage
   * @param {Object} progressData - Game progress data to save
   * @returns {boolean} True if save was successful
   */
  saveGameProgress(progressData) {
    try {
      const progress = {
        gameId: this.gameId,
        score: progressData.score || 0,
        level: progressData.level || 1,
        timeLeft: progressData.timeLeft || 0,
        gameState: progressData.gameState || {},
        badgesEarned: progressData.badgesEarned || [],
        timestamp: Date.now(),
        version: this.currentVersion
      };

      // Validate progress data
      if (!this.validateGameProgress(progress)) {
        console.error('Invalid game progress data:', progress);
        return false;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving game progress:', error);
      return false;
    }
  }

  /**
   * Load saved game progress from localStorage
   * @returns {Object|null} Game progress data if available and valid, null otherwise
   */
  loadGameProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return null;

      const progress = JSON.parse(saved);

      // Validate loaded progress
      if (!this.validateGameProgress(progress)) {
        console.warn('Invalid saved game progress, clearing:', progress);
        this.clearGameProgress();
        return null;
      }

      // Check if progress is for the correct game
      if (progress.gameId !== this.gameId) {
        console.warn('Progress gameId mismatch, clearing');
        this.clearGameProgress();
        return null;
      }

      return progress;
    } catch (error) {
      console.error('Error loading game progress:', error);
      this.clearGameProgress();
      return null;
    }
  }

  /**
   * Clear saved game progress from localStorage
   * @returns {boolean} True if clear was successful
   */
  clearGameProgress() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing game progress:', error);
      return false;
    }
  }

  /**
   * Check if game progress exists and is resumable
   * @param {number} maxAge - Maximum age in milliseconds (default: 7 days for games)
   * @returns {boolean} True if game can be resumed
   */
  canResumeGame(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const progress = this.loadGameProgress();
    if (!progress) return false;

    // Check if progress is too old
    const age = Date.now() - progress.timestamp;
    if (age > maxAge) {
      console.log('Game progress too old, clearing');
      this.clearGameProgress();
      return false;
    }

    return true;
  }

  /**
   * Validate game progress data structure
   * @param {Object} progress - Game progress data to validate
   * @returns {boolean} True if progress is valid
   */
  validateGameProgress(progress) {
    if (!progress || typeof progress !== 'object') return false;

    // Required fields
    const requiredFields = ['gameId', 'score', 'level', 'timeLeft', 'gameState', 'badgesEarned', 'timestamp', 'version'];
    for (const field of requiredFields) {
      if (!(field in progress)) return false;
    }

    // Type validation
    if (typeof progress.gameId !== 'string') return false;
    if (typeof progress.score !== 'number' || progress.score < 0) return false;
    if (typeof progress.level !== 'number' || progress.level < 1) return false;
    if (typeof progress.timeLeft !== 'number' || progress.timeLeft < 0) return false;
    if (typeof progress.gameState !== 'object') return false;
    if (!Array.isArray(progress.badgesEarned)) return false;
    if (typeof progress.timestamp !== 'number') return false;
    if (typeof progress.version !== 'string') return false;

    return true;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameProgressManager;

/**
 * GameProgressManager - Extended ProgressManager for Games
 * 
 * This extends the base ProgressManager with game-specific functionality.
 * Can be used interchangeably with ProgressManager for game progress tracking.
 * 
 * @class GameProgressManager
 */
class GameProgressManager extends ProgressManager {
  /**
   * Create a new GameProgressManager instance
   * @param {string} gameId - Unique identifier for the game (e.g., 'carbon-footprint-calculator')
   */
  constructor(gameId) {
    // Use 'game' prefix to differentiate from quiz progress
    super(`game_${gameId}`);
    this.gameId = gameId;
    this.storageKey = `gameProgress_${gameId}`;
  }

  /**
   * Standardized game progress data structure
   * @typedef {Object} GameProgress
   * @property {string} gameId - Unique game identifier
   * @property {number} score - Current score
   * @property {number} level - Current level
   * @property {number} timeLeft - Remaining time in seconds (for timed games)
   * @property {Object} gameState - Game-specific state data
   * @property {Array} badgesEarned - Array of earned badge names
   * @property {number} timestamp - Last save timestamp
   * @property {string} version - Progress data version
   */

  /**
   * Save game progress to localStorage
   * @param {Object} progressData - Game progress data to save
   * @param {number} progressData.score - Current score
   * @param {number} progressData.level - Current level
   * @param {number} progressData.timeLeft - Remaining time in seconds
   * @param {Object} progressData.gameState - Game-specific state data
   * @param {Array} progressData.badgesEarned - Array of earned badges
   * @returns {boolean} True if save was successful
   */
  saveGameProgress(progressData) {
    try {
      const progress = {
        gameId: this.gameId,
        score: progressData.score || 0,
        level: progressData.level || 1,
        timeLeft: progressData.timeLeft || 0,
        gameState: progressData.gameState || {},
        badgesEarned: progressData.badgesEarned || [],
        timestamp: Date.now(),
        version: this.currentVersion
      };

      // Validate progress data
      if (!this.validateGameProgress(progress)) {
        console.error('Invalid game progress data:', progress);
        return false;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving game progress:', error);
      return false;
    }
  }

  /**
   * Load saved game progress from localStorage
   * @returns {Object|null} Game progress data if available and valid, null otherwise
   */
  loadGameProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return null;

      const progress = JSON.parse(saved);

      // Validate loaded progress
      if (!this.validateGameProgress(progress)) {
        console.warn('Invalid saved game progress, clearing:', progress);
        this.clearGameProgress();
        return null;
      }

      // Check if progress is for the correct game
      if (progress.gameId !== this.gameId) {
        console.warn('Progress gameId mismatch, clearing');
        this.clearGameProgress();
        return null;
      }

      return progress;
    } catch (error) {
      console.error('Error loading game progress:', error);
      this.clearGameProgress();
      return null;
    }
  }

  /**
   * Clear saved game progress from localStorage
   * @returns {boolean} True if clear was successful
   */
  clearGameProgress() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing game progress:', error);
      return false;
    }
  }

  /**
   * Check if game progress exists and is resumable
   * @param {number} maxAge - Maximum age in milliseconds (default: 7 days for games)
   * @returns {boolean} True if game can be resumed
   */
  canResumeGame(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const progress = this.loadGameProgress();
    if (!progress) return false;

    // Check if progress is too old
    const age = Date.now() - progress.timestamp;
    if (age > maxAge) {
      console.log('Game progress too old, clearing');
      this.clearGameProgress();
      return false;
    }

    return true;
  }

  /**
   * Validate game progress data structure
   * @param {Object} progress - Game progress data to validate
   * @returns {boolean} True if progress is valid
   */
  validateGameProgress(progress) {
    if (!progress || typeof progress !== 'object') return false;

    // Required fields
    const requiredFields = ['gameId', 'score', 'level', 'timeLeft', 'gameState', 'badgesEarned', 'timestamp', 'version'];
    for (const field of requiredFields) {
      if (!(field in progress)) return false;
    }

    // Type validation
    if (typeof progress.gameId !== 'string') return false;
    if (typeof progress.score !== 'number' || progress.score < 0) return false;
    if (typeof progress.level !== 'number' || progress.level < 1) return false;
    if (typeof progress.timeLeft !== 'number' || progress.timeLeft < 0) return false;
    if (typeof progress.gameState !== 'object') return false;
    if (!Array.isArray(progress.badgesEarned)) return false;
    if (typeof progress.timestamp !== 'number') return false;
    if (typeof progress.version !== 'string') return false;

    return true;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameProgressManager;
