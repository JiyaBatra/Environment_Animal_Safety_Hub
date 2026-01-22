/**
 * Water Conservation Quiz - Environmental Water Management Education
 *
 * An interactive quiz focused on water conservation practices,
 * sustainable water usage, and environmental water management.
 * Designed to educate users about the importance of water conservation.
 *
 * Quiz Features:
 * - 4 carefully crafted questions about water conservation
 * - Progress tracking with localStorage persistence
 * - Pause/resume functionality
 * - Immediate feedback on answer selection
 * - Performance-based feedback and scoring
 *
 * Educational Topics Covered:
 * - Effective water reduction methods
 * - Optimal plant watering times
 * - Water-efficient practices
 * - Importance of water conservation
 *
 * @author Environment Animal Safety Hub Team
 * @version 2.0.0 - Added Progress Tracking
 * @since 2024
 */

// ===== QUIZ QUESTION DATABASE =====
const questions = [
  {
    q: "What is the most effective way to reduce water usage at home?",
    o: ["Leave the tap running", "Turn off tap", "Use more water", "Wash hands again"],
    a: 1
  },
  {
    q: "When is the best time to water plants?",
    o: ["Afternoon", "Midnight", "Early morning", "Anytime"],
    a: 2
  },
  {
    q: "Which uses less water?",
    o: ["Running hose", "Bucket of water", "Daily car wash", "Overflow tank"],
    a: 1
  },
  {
    q: "Why should we save water?",
    o: ["Water is unlimited", "Water is expensive only", "Fresh water is limited", "It looks good"],
    a: 2
  }
];

// ===== QUIZ STATE MANAGEMENT =====
let index = 0;         // Current question index
let score = 0;         // Correct answers count
let answers = [];      // User's selected answers

// ===== PROGRESS PERSISTENCE =====
const PROGRESS_KEY = 'waterConservationQuizProgress';

/**
 * Save current quiz progress to localStorage
 */
function saveProgress() {
  const progress = {
    currentIndex: index,
    answers: answers,
    score: score,
    timestamp: Date.now(),
    quizId: 'water-conservation-quiz'
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

/**
 * Load saved quiz progress from localStorage
 * @returns {boolean} True if progress was loaded successfully
 */
function loadProgress() {
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (saved) {
    const progress = JSON.parse(saved);
    index = progress.currentIndex || 0;
    answers = progress.answers || [];
    score = progress.score || 0;
    return true;
  }
  return false;
}

/**
 * Clear saved quiz progress from localStorage
 */
function clearProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}

// ===== DOM ELEMENT REFERENCES =====
const readyScreen = document.getElementById("readyScreen");
const quizScreen = document.getElementById("quizScreen");
const questionEl = document.getElementById("question");
const optionsButtons = document.querySelectorAll(".option-btn");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const startBtn = document.getElementById("startQuizBtn");

// ===== QUIZ INITIALIZATION =====
/**
 * Initialize the quiz application on page load
 */
function initializeQuiz() {
  // Check for existing progress on page load
  if (loadProgress()) {
    const resumeSection = document.getElementById('resumeSection');
    if (resumeSection) {
      resumeSection.style.display = 'block';
    }
  }
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeQuiz);

/**
 * Start the water conservation quiz session
 */
function startQuiz() {
  // Clear any existing progress when starting new quiz
  clearProgress();

  // Reset quiz state
  index = 0;
  score = 0;
  answers = new Array(questions.length).fill(null);

  // Transition to quiz screen
  readyScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  // Load first question
  loadQuestion();
}

// ===== QUESTION DISPLAY =====
function loadQuestion() {
  feedbackEl.textContent = "";
  nextBtn.disabled = true;

  // Update progress metrics
  const progressText = document.querySelector('.progress-metrics span:first-child');
  if (progressText) {
    progressText.textContent = `Question: ${index + 1}/${questions.length}`;
  }

  const questionsCompleted = document.querySelector('.progress-metrics span:last-child');
  if (questionsCompleted) {
    questionsCompleted.textContent = `Score: ${score}`;
  }

  // Update progress bar
  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    const progressPercent = ((index + 1) / questions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }

  const currentQuestion = questions[index];
  questionEl.textContent = currentQuestion.q;

  optionsButtons.forEach((button, idx) => {
    button.textContent = currentQuestion.o[idx];
    button.disabled = false;
    button.style.backgroundColor = "#e8f5e9";

    // Restore previous selection if navigating back
    if (answers[index] === idx) {
      button.style.backgroundColor = "#a5d6a7";
      button.disabled = true;
      nextBtn.disabled = false;
    }
  });
}

// ===== ANSWER SELECTION =====
optionsButtons.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const correctIdx = questions[index].a;
    optionsButtons.forEach(b => b.disabled = true);

    // Store user's answer
    answers[index] = idx;

    if (idx === correctIdx) {
      score++;
      btn.style.background = "#a5d6a7";
      feedbackEl.textContent = "✅ Correct!";
      feedbackEl.style.color = "green";
    } else {
      btn.style.background = "#ef9a9a";
      feedbackEl.textContent = "❌ Not quite right";
      feedbackEl.style.color = "red";
    }

    scoreEl.textContent = score;
    nextBtn.disabled = false;

    // Save progress after each answer selection
    saveProgress();
  });
});

// ===== QUESTION NAVIGATION =====
nextBtn.addEventListener("click", () => {
  // Save progress after moving to next question
  saveProgress();

  index++;
  if (index < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

// ===== QUIZ RESUME FUNCTIONALITY =====
/**
 * Resume a previously saved quiz session
 */
function resumeSavedQuiz() {
  if (loadProgress()) {
    // Transition to quiz screen
    readyScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    // Load current question
    loadQuestion();
  }
}

// ===== RESULTS DISPLAY =====
function showResult() {
  // Clear saved progress
  clearProgress();

  questionEl.textContent = "🎉 Quiz Completed!";
  document.querySelector(".options").style.display = "none";
  nextBtn.style.display = "none";
  feedbackEl.textContent = `Final score ${score}/${questions.length}`;
  feedbackEl.style.color = "#2e7d32";

  // Show performance-based remark
  if (score >= 3) {
    feedbackEl.textContent += " - 🌟 Water Conservation Expert!";
  } else if (score >= 2) {
    feedbackEl.textContent += " - 👍 Good Job!";
  } else {
    feedbackEl.textContent += " - 💧 Keep Learning!";
  }
}

// ===== EVENT LISTENERS =====
startBtn.addEventListener("click", startQuiz);