/**
 * Quiz Registry Class - Centralized Quiz Management
 *
 * Manages all available quizzes, loads configurations from JSON,
 * validates data, and provides access methods for quiz configurations.
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

class QuizRegistry {
  constructor() {
    this.quizzes = new Map();
    this.isLoaded = false;
    this.configPath = 'assets/data/quiz-config.json';
  }

  /**
   * Load quiz configurations from JSON file
   * @returns {Promise<boolean>} True if loaded successfully
   */
  async loadQuizzes() {
    try {
      const response = await fetch(this.configPath);
      if (!response.ok) {
        throw new Error(`Failed to load quiz config: ${response.status}`);
      }

      const configData = await response.json();

      // Validate the configuration
      const validation = QuizValidator.validateConfigFile(configData);
      if (!validation.isValid) {
        console.error('Quiz configuration validation failed:', validation.errors);
        throw new Error('Invalid quiz configuration');
      }

      // Store quizzes in map for quick access
      this.quizzes.clear();
      configData.quizzes.forEach(quiz => {
        this.quizzes.set(quiz.id, quiz);
      });

      this.isLoaded = true;
      console.log(`Loaded ${this.quizzes.size} quizzes successfully`);
      return true;

    } catch (error) {
      console.error('Error loading quiz configurations:', error);
      this.isLoaded = false;
      return false;
    }
  }

  /**
   * Get a quiz configuration by ID
   * @param {string} quizId - The ID of the quiz to retrieve
   * @returns {Object|null} The quiz configuration or null if not found
   */
  getQuiz(quizId) {
    if (!this.isLoaded) {
      console.warn('Quiz registry not loaded. Call loadQuizzes() first.');
      return null;
    }
    return this.quizzes.get(quizId) || null;
  }

  /**
   * Get all available quiz configurations
   * @returns {Array} Array of all quiz configurations
   */
  getAllQuizzes() {
    if (!this.isLoaded) {
      console.warn('Quiz registry not loaded. Call loadQuizzes() first.');
      return [];
    }
    return Array.from(this.quizzes.values());
  }

  /**
   * Get quizzes by category
   * @param {string} category - The category to filter by
   * @returns {Array} Array of quiz configurations in the specified category
   */
  getQuizzesByCategory(category) {
    if (!this.isLoaded) {
      console.warn('Quiz registry not loaded. Call loadQuizzes() first.');
      return [];
    }
    return Array.from(this.quizzes.values()).filter(quiz => quiz.category === category);
  }

  /**
   * Check if a quiz exists
   * @param {string} quizId - The ID of the quiz to check
   * @returns {boolean} True if the quiz exists
   */
  hasQuiz(quizId) {
    return this.quizzes.has(quizId);
  }

  /**
   * Get quiz IDs
   * @returns {Array} Array of all quiz IDs
   */
  getQuizIds() {
    return Array.from(this.quizzes.keys());
  }

  /**
   * Get the number of loaded quizzes
   * @returns {number} Number of quizzes
   */
  getQuizCount() {
    return this.quizzes.size;
  }

  /**
   * Process quiz configuration for use (handle randomization, etc.)
   * @param {Object} quizConfig - The raw quiz configuration
   * @returns {Object} Processed quiz configuration
   */
  processQuizConfig(quizConfig) {
    const processed = { ...quizConfig };

    // Handle randomization
    if (processed.randomize && processed.questions) {
      const shuffled = [...processed.questions].sort(() => 0.5 - Math.random());
      processed.questions = shuffled.slice(0, processed.randomize.count);
      delete processed.randomize; // Remove randomize config after processing
    }

    return processed;
  }

  /**
   * Get a processed quiz configuration ready for use
   * @param {string} quizId - The ID of the quiz to retrieve
   * @returns {Object|null} The processed quiz configuration or null if not found
   */
  getProcessedQuiz(quizId) {
    const rawConfig = this.getQuiz(quizId);
    if (!rawConfig) return null;

    return this.processQuizConfig(rawConfig);
  }

  /**
   * Reload quiz configurations
   * @returns {Promise<boolean>} True if reloaded successfully
   */
  async reload() {
    this.isLoaded = false;
    return await this.loadQuizzes();
  }
}

// Create a singleton instance
const quizRegistry = new QuizRegistry();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuizRegistry;
}
