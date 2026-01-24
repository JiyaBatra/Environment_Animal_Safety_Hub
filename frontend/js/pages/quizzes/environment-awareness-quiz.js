/**
 * Environment Awareness Quiz
 *
 * A comprehensive quiz designed to test and educate users about basic
 * environmental concepts, conservation practices, and ecological awareness.
 * Features 10 carefully crafted questions covering key environmental topics.
 *
 * Now extends BaseQuiz for unified progress tracking.
 *
 * @author Environment Animal Safety Hub Team
 * @version 2.0.0
 * @since 2024
 */

// Quiz configuration
const quizConfig = {
  questions: [
    {q: "Why should we plant trees?", o: ["Decoration", "More oxygen", "Noise", "Waste"], a: 1},
    {q: "Which gas causes global warming?", o: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"], a: 1},
    {q: "Best way to save water?", o: ["Leave taps open", "Fix leaks", "Waste water", "Ignore"], a: 1},
    {q: "Which helps reduce pollution?", o: ["Burning waste", "Planting trees", "Cutting forests", "Throwing trash"], a: 1},
    {q: "Which is eco-friendly transport?", o: ["Car", "Bike", "Cycle", "Plane"], a: 2},
    {q: "Why recycle waste?", o: ["Increase trash", "Save resources", "Pollute air", "Waste money"], a: 1},
    {q: "Which energy is renewable?", o: ["Coal", "Solar", "Oil", "Gas"], a: 1},
    {q: "What harms oceans the most?", o: ["Clean water", "Plastic waste", "Fish", "Sand"], a: 1},
    {q: "What should we do with lights?", o: ["Keep on", "Switch off", "Break", "Ignore"], a: 1},
    {q: "Clean environment means?", o: ["Healthy life", "More disease", "Dirty water", "Less oxygen"], a: 0}
  ],
  timeLimit: 120, // 2 minutes
  progressKey: 'environment-awareness-quiz',
  iconClass: 'fa-solid fa-leaf',
  elements: {
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
  }
};

// Create quiz instance
const environmentAwarenessQuiz = new BaseQuiz(quizConfig);

// Override loadQuestion to include custom progress metrics
environmentAwarenessQuiz.loadQuestion = function() {
  // Call parent method
  BaseQuiz.prototype.loadQuestion.call(this);

  // Update custom progress metrics
  if (this.config.elements.progressText) {
    const timeSpent = this.config.timeLimit - this.time;
    this.config.elements.progressText.textContent = `Time Spent: ${timeSpent}s`;
  }

  const questionsCompleted = document.querySelector('.progress-metrics span:last-child');
  if (questionsCompleted) {
    questionsCompleted.textContent = `Completed: ${this.index + 1}/${this.questions.length}`;
  }
};

// Override showResult for custom remarks
environmentAwarenessQuiz.showResult = function() {
  // Call parent method
  BaseQuiz.prototype.showResult.call(this);

  // Custom remarks for environment awareness
  let remark = "";
  if (this.score >= 8) {
    remark = "🌟 Eco Champion!";
  } else if (this.score >= 5) {
    remark = "👍 Good effort!";
  } else {
    remark = "🌱 Keep learning!";
  }

  if (this.config.elements.remarkEl) {
    this.config.elements.remarkEl.textContent = remark;
  }
};

// Initialize quiz on page load
environmentAwarenessQuiz.initializeQuiz();

// Global functions for HTML onclick handlers
window.startQuiz = () => environmentAwarenessQuiz.startQuiz();
window.resumeQuiz = () => environmentAwarenessQuiz.resumeQuiz();
window.nextQuestion = () => environmentAwarenessQuiz.nextQuestion();
