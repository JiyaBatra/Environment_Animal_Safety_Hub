/**
 * Water Conservation Quiz
 *
 * An interactive quiz focused on water conservation practices and awareness.
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
    {q: "What is the most effective way to reduce water usage at home?", o: ["Leave the tap running", "Turn off tap", "Use more water", "Wash hands again"], a: 1},
    {q: "When is the best time to water plants?", o: ["Afternoon", "Midnight", "Early morning", "Anytime"], a: 2},
    {q: "Which uses less water?", o: ["Running hose", "Bucket of water", "Daily car wash", "Overflow tank"], a: 1},
    {q: "Why should we save water?", o: ["Water is unlimited", "Water is expensive only", "Fresh water is limited", "It looks good"], a: 2}
  ],
  timeLimit: 120, // 2 minutes
  progressKey: 'water-conservation-quiz',
  iconClass: 'fa-solid fa-tint',
  elements: {
    startScreen: document.getElementById('readyScreen'),
    quizScreen: document.getElementById('quizScreen'),
    resultScreen: document.getElementById('quizScreen'), // Reuse quiz screen for results
    questionEl: document.getElementById('question'),
    optionsEl: document.getElementById('options'),
    timeEl: null, // No timer display
    scoreEl: document.getElementById('score'),
    remarkEl: document.getElementById('feedback')
  }
};

// Create quiz instance
const waterConservationQuiz = new BaseQuiz(quizConfig);

// Override loadQuestion to handle custom option buttons
waterConservationQuiz.loadQuestion = function() {
  // Call parent method
  BaseQuiz.prototype.loadQuestion.call(this);

  // Custom styling for option buttons
  const optionButtons = document.querySelectorAll('.option-btn');
  optionButtons.forEach(button => {
    button.style.backgroundColor = "#e8f5e9";
    button.disabled = false;
  });
};

// Override selectOption to handle custom feedback
waterConservationQuiz.selectOption = function(element, optionIndex) {
  // Call parent method
  BaseQuiz.prototype.selectOption.call(this, element, optionIndex);

  // Custom feedback and styling
  const feedbackEl = document.getElementById('feedback');
  const nextBtn = document.getElementById('nextBtn');
  const optionButtons = document.querySelectorAll('.option-btn');

  optionButtons.forEach(b => b.disabled = true);

  if (element.dataset.correct === "true") {
    element.style.background = "#a5d6a7";
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.style.color = "green";
  } else {
    element.style.background = "#ef9a9a";
    feedbackEl.textContent = "❌ Not quite right";
    feedbackEl.style.color = "red";
  }

  if (nextBtn) nextBtn.disabled = false;
};

// Override showResult for custom completion display
waterConservationQuiz.showResult = function() {
  // Call parent method
  BaseQuiz.prototype.showResult.call(this);

  // Custom completion display
  const questionEl = document.getElementById('question');
  const optionsEl = document.querySelector('.options');
  const nextBtn = document.getElementById('nextBtn');
  const feedbackEl = document.getElementById('feedback');

  questionEl.textContent = "🎉 Quiz Completed!";
  if (optionsEl) optionsEl.style.display = "none";
  if (nextBtn) nextBtn.style.display = "none";
  feedbackEl.textContent = `Final score ${this.score}/${this.questions.length}`;
  feedbackEl.style.color = "#2e7d32";
};

// Override startQuiz to handle screen transitions
waterConservationQuiz.startQuiz = function() {
  // Custom screen transition
  const readyScreen = document.getElementById('readyScreen');
  const quizScreen = document.getElementById('quizScreen');

  if (readyScreen) readyScreen.classList.add('hidden');
  if (quizScreen) quizScreen.classList.remove('hidden');

  // Call parent method
  BaseQuiz.prototype.startQuiz.call(this);
};

// Initialize quiz on page load
waterConservationQuiz.initializeQuiz();

// Global functions for HTML onclick handlers
window.startQuiz = () => waterConservationQuiz.startQuiz();
window.resumeQuiz = () => waterConservationQuiz.resumeQuiz();
window.nextQuestion = () => waterConservationQuiz.nextQuestion();
