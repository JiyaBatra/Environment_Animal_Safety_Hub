/**
 * Sustainable Gardening Quiz
 *
 * An interactive quiz focused on sustainable gardening practices and environmental awareness.
 * Features randomized questions and customizable time limits.
 *
 * Now extends BaseQuiz for unified progress tracking.
 *
 * @author Environment Animal Safety Hub Team
 * @version 2.0.0
 * @since 2024
 */

// Full question database
const fullQuestions = [
 {q:"What is composting?",o:["Throwing away food waste","Turning organic waste into fertilizer","Burning leaves","Using chemical fertilizers"],a:1},
 {q:"Why use native plants in gardening?",o:["They are cheaper","They require less water and attract local wildlife","They grow faster","They need more pesticides"],a:1},
 {q:"What is water conservation in gardening?",o:["Watering plants every hour","Using drip irrigation and mulching","Letting plants dry out","Using sprinklers all day"],a:1},
 {q:"How can you control pests without chemicals?",o:["Use ladybugs and neem oil","Spray more water","Remove affected plants","Ignore them"],a:0},
 {q:"What is mulching?",o:["Cutting plants short","Covering soil with organic material to retain moisture","Adding sand to soil","Using plastic sheets"],a:1},
 {q:"Why is biodiversity important in gardens?",o:["Makes garden look messy","Attracts beneficial insects and pollinators","Requires more work","Costs more money"],a:1},
 {q:"What is rainwater harvesting?",o:["Buying bottled water","Collecting rainwater for garden use","Using tap water only","Letting rain run off"],a:1},
 {q:"How to reduce garden waste?",o:["Throw everything away","Compost and reuse materials","Buy new tools every year","Use more chemicals"],a:1},
 {q:"What are companion plants?",o:["Plants that grow alone","Plants that help each other grow and repel pests","Plants that compete for space","Plants that need same soil"],a:1},
 {q:"Why avoid synthetic fertilizers?",o:["They are expensive","They can harm soil and water quality","They make plants grow too fast","They attract more pests"],a:1}
];

// Randomize and select 7 questions for the quiz
const questions = [...fullQuestions].sort(() => 0.5 - Math.random()).slice(0, 7);

// Quiz configuration
const quizConfig = {
  questions: questions,
  timeLimit: 180, // 3 minutes default
  progressKey: 'sustainable-gardening-quiz',
  iconClass: 'fa-solid fa-seedling',
  elements: {
    startScreen: document.getElementById('startScreen'),
    quizScreen: document.getElementById('quizScreen'),
    resultScreen: document.getElementById('resultScreen'),
    questionEl: document.getElementById('question'),
    optionsEl: document.getElementById('options'),
    timeEl: document.getElementById('time'),
    scoreEl: document.getElementById('score'),
    remarkEl: document.getElementById('remark')
  }
};

// Create quiz instance
const sustainableGardeningQuiz = new BaseQuiz(quizConfig);

// Override startQuiz to handle time selection
sustainableGardeningQuiz.startQuiz = function() {
  // Check for custom time selection
  const timeSelect = document.getElementById('timeSelect');
  if (timeSelect) {
    this.timeLimit = parseInt(timeSelect.value);
  }

  // Call parent method
  BaseQuiz.prototype.startQuiz.call(this);
};

// Override showResult for custom remarks
sustainableGardeningQuiz.showResult = function() {
  // Call parent method
  BaseQuiz.prototype.showResult.call(this);

  // Custom remarks for sustainable gardening
  let remark = "";
  if (this.score >= 6) {
    remark = "🌟 Sustainable Gardening Expert!";
  } else if (this.score >= 4) {
    remark = "👍 Good Job!";
  } else {
    remark = "🌱 Keep Learning!";
  }

  if (this.config.elements.remarkEl) {
    this.config.elements.remarkEl.textContent = remark;
  }
};

// Initialize quiz on page load
sustainableGardeningQuiz.initializeQuiz();

// Global functions for HTML onclick handlers
window.startQuiz = () => sustainableGardeningQuiz.startQuiz();
window.resumeQuiz = () => sustainableGardeningQuiz.resumeQuiz();
window.nextQuestion = () => sustainableGardeningQuiz.nextQuestion();
