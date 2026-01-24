/**
 * Quiz Data Validation Utility
 *
 * Provides schema validation for quiz configuration data structures.
 * Ensures data integrity and prevents runtime errors from malformed quiz data.
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

class QuizValidator {
  /**
   * Validate a complete quiz configuration object
   * @param {Object} quizConfig - The quiz configuration to validate
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  static validateQuiz(quizConfig) {
    const errors = [];

    // Required fields
    const requiredFields = ['id', 'title', 'description', 'category', 'timeLimit', 'iconClass', 'questions', 'scoring'];
    requiredFields.forEach(field => {
      if (!quizConfig.hasOwnProperty(field)) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate id
    if (quizConfig.id && (typeof quizConfig.id !== 'string' || quizConfig.id.trim() === '')) {
      errors.push('id must be a non-empty string');
    }

    // Validate title
    if (quizConfig.title && (typeof quizConfig.title !== 'string' || quizConfig.title.trim() === '')) {
      errors.push('title must be a non-empty string');
    }

    // Validate description
    if (quizConfig.description && (typeof quizConfig.description !== 'string' || quizConfig.description.trim() === '')) {
      errors.push('description must be a non-empty string');
    }

    // Validate category
    if (quizConfig.category && (typeof quizConfig.category !== 'string' || quizConfig.category.trim() === '')) {
      errors.push('category must be a non-empty string');
    }

    // Validate timeLimit
    if (quizConfig.timeLimit && (typeof quizConfig.timeLimit !== 'number' || quizConfig.timeLimit <= 0)) {
      errors.push('timeLimit must be a positive number');
    }

    // Validate iconClass
    if (quizConfig.iconClass && (typeof quizConfig.iconClass !== 'string' || quizConfig.iconClass.trim() === '')) {
      errors.push('iconClass must be a non-empty string');
    }

    // Validate questions
    if (quizConfig.questions) {
      if (!Array.isArray(quizConfig.questions)) {
        errors.push('questions must be an array');
      } else if (quizConfig.questions.length === 0) {
        errors.push('questions array cannot be empty');
      } else {
        quizConfig.questions.forEach((question, index) => {
          const questionErrors = this.validateQuestion(question, index);
          errors.push(...questionErrors);
        });
      }
    }

    // Validate scoring
    if (quizConfig.scoring) {
      const scoringErrors = this.validateScoring(quizConfig.scoring);
      errors.push(...scoringErrors);
    }

    // Validate randomize if present
    if (quizConfig.randomize) {
      const randomizeErrors = this.validateRandomize(quizConfig.randomize, quizConfig.questions ? quizConfig.questions.length : 0);
      errors.push(...randomizeErrors);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate a single question object
   * @param {Object} question - The question to validate
   * @param {number} index - The index of the question in the array
   * @returns {Array} Array of error messages
   */
  static validateQuestion(question, index) {
    const errors = [];
    const prefix = `Question ${index + 1}: `;

    // Required fields
    if (!question.hasOwnProperty('q')) {
      errors.push(`${prefix}Missing required field: q`);
    }
    if (!question.hasOwnProperty('o')) {
      errors.push(`${prefix}Missing required field: o`);
    }
    if (!question.hasOwnProperty('a')) {
      errors.push(`${prefix}Missing required field: a`);
    }

    // Validate q (question text)
    if (question.q && (typeof question.q !== 'string' || question.q.trim() === '')) {
      errors.push(`${prefix}q must be a non-empty string`);
    }

    // Validate o (options array)
    if (question.o) {
      if (!Array.isArray(question.o)) {
        errors.push(`${prefix}o must be an array`);
      } else if (question.o.length < 2) {
        errors.push(`${prefix}o must have at least 2 options`);
      } else {
        question.o.forEach((option, optionIndex) => {
          if (typeof option !== 'string' || option.trim() === '') {
            errors.push(`${prefix}Option ${optionIndex + 1} must be a non-empty string`);
          }
        });
      }
    }

    // Validate a (answer index)
    if (question.a !== undefined) {
      if (typeof question.a !== 'number' || !Number.isInteger(question.a) || question.a < 0) {
        errors.push(`${prefix}a must be a non-negative integer`);
      } else if (question.o && question.a >= question.o.length) {
        errors.push(`${prefix}a (${question.a}) is out of bounds for options array (length: ${question.o.length})`);
      }
    }

    return errors;
  }

  /**
   * Validate scoring configuration
   * @param {Object} scoring - The scoring configuration to validate
   * @returns {Array} Array of error messages
   */
  static validateScoring(scoring) {
    const errors = [];

    // Required fields
    const requiredLevels = ['excellent', 'good', 'poor'];
    requiredLevels.forEach(level => {
      if (!scoring.hasOwnProperty(level)) {
        errors.push(`Missing required scoring level: ${level}`);
      } else {
        const levelConfig = scoring[level];
        if (typeof levelConfig !== 'object' || levelConfig === null) {
          errors.push(`${level} must be an object`);
        } else {
          if (!levelConfig.hasOwnProperty('remark')) {
            errors.push(`${level} missing required field: remark`);
          } else if (typeof levelConfig.remark !== 'string' || levelConfig.remark.trim() === '') {
            errors.push(`${level}.remark must be a non-empty string`);
          }

          if (level !== 'poor') {
            if (!levelConfig.hasOwnProperty('min')) {
              errors.push(`${level} missing required field: min`);
            } else if (typeof levelConfig.min !== 'number' || !Number.isInteger(levelConfig.min) || levelConfig.min < 0) {
              errors.push(`${level}.min must be a non-negative integer`);
            }
          }
        }
      }
    });

    return errors;
  }

  /**
   * Validate randomize configuration
   * @param {Object} randomize - The randomize configuration to validate
   * @param {number} totalQuestions - Total number of questions available
   * @returns {Array} Array of error messages
   */
  static validateRandomize(randomize, totalQuestions) {
    const errors = [];

    if (typeof randomize !== 'object' || randomize === null) {
      errors.push('randomize must be an object');
      return errors;
    }

    if (!randomize.hasOwnProperty('count')) {
      errors.push('randomize missing required field: count');
    } else if (typeof randomize.count !== 'number' || !Number.isInteger(randomize.count) || randomize.count <= 0) {
      errors.push('randomize.count must be a positive integer');
    } else if (randomize.count > totalQuestions) {
      errors.push(`randomize.count (${randomize.count}) cannot be greater than total questions (${totalQuestions})`);
    }

    return errors;
  }

  /**
   * Validate an entire quiz configuration file
   * @param {Object} configData - The parsed JSON configuration data
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  static validateConfigFile(configData) {
    const errors = [];

    if (!configData.hasOwnProperty('quizzes')) {
      errors.push('Missing required field: quizzes');
    } else if (!Array.isArray(configData.quizzes)) {
      errors.push('quizzes must be an array');
    } else if (configData.quizzes.length === 0) {
      errors.push('quizzes array cannot be empty');
    } else {
      configData.quizzes.forEach((quiz, index) => {
        const quizValidation = this.validateQuiz(quiz);
        if (!quizValidation.isValid) {
          errors.push(`Quiz ${index + 1} (${quiz.id || 'unknown'}):`);
          quizValidation.errors.forEach(error => {
            errors.push(`  ${error}`);
          });
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuizValidator;
}
