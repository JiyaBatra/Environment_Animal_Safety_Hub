/**
 * Climate Change Quiz
 *
 * An interactive quiz focused on climate change awareness and environmental impact.
 *
 * Uses QuizLoader for unified loading and initialization.
 *
 * @author Environment Animal Safety Hub Team
 * @version 3.0.0
 * @since 2024
 */

// DOM elements
const elements = {
  startScreen: document.getElementById('startScreen'),
  quizScreen: document.getElementById('quizScreen'),
  resultScreen: document.getElementById('resultScreen'),
  questionEl: document.getElementById('question'),
  optionsEl: document.getElementById('options'),
  timeEl: document.getElementById('time'),
  scoreEl: document.getElementById('score'),
  remarkEl: document.getElementById('remark'),
  progressText: document.querySelector('.progress-metrics span:first-child'),
  progressFill: document.getElementById('progressFill')
};

// Load quiz using QuizLoader
let climateChangeQuiz = null;

async function loadClimateChangeQuiz() {
  // Custom overrides for climate change specific behavior
  const customOverrides = {
    // Custom startQuiz to handle time selection
    startQuiz: function() {
      // Check for custom time selection
      const timeSelect = document.getElementById('timeSelect');
      if (timeSelect) {
        this.timeLimit = parseInt(timeSelect.value);
      }

      // Call parent method
      BaseQuiz.prototype.startQuiz.call(this);
    },

    // Custom showResult for climate change remarks
    showResult: function() {
      // Call parent method
      BaseQuiz.prototype.showResult.call(this);

      // Custom remarks for climate change
      let remark = "";
      if (this.score >= 8) {
        remark = "🌟 Climate Champion!";
      } else if (this.score >= 5) {
        remark = "👍 Good effort!";
      } else {
        remark = "🌱 Keep learning!";
      }

      if (this.config.elements.remarkEl) {
        this.config.elements.remarkEl.textContent = remark;
      }
    }
  };

  climateChangeQuiz = await QuizLoader.loadQuiz('climate-change', elements, customOverrides);
}

// Global functions for HTML onclick handlers
window.startQuiz = () => {
  if (climateChangeQuiz) climateChangeQuiz.startQuiz();
};
window.resumeQuiz = () => {
  if (climateChangeQuiz) climateChangeQuiz.resumeQuiz();
};
window.nextQuestion = () => {
  if (climateChangeQuiz) climateChangeQuiz.nextQuestion();
};

// Load quiz on page load
document.addEventListener('DOMContentLoaded', loadClimateChangeQuiz);
