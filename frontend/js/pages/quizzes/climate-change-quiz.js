/**
 * Climate Change Awareness Quiz
 *
 * An interactive educational quiz designed to teach children and adults about
 * climate change, global warming, and environmental conservation. Features
 * multiple-choice questions, timed challenges, and comprehensive review system.
 *
 * Quiz Features:
 * - 15 carefully crafted questions on climate change topics
 * - Random selection of 10 questions per quiz session
 * - Customizable time limits (5, 10, 15 minutes)
 * - Real-time scoring and progress tracking
 * - Detailed answer review with explanations
 * - Performance-based remarks and encouragement
 * - Dark/light theme toggle with localStorage persistence
 *
 * Educational Topics Covered:
 * - Definition and causes of climate change
 * - Greenhouse gases and global warming
 * - Human impact on environment
 * - Renewable energy and sustainable practices
 * - Conservation actions for individuals
 * - Environmental effects and solutions
 *
 * Technical Features:
 * - AOS (Animate On Scroll) integration for smooth animations
 * - Theme persistence using localStorage
 * - Responsive design with visual feedback
 * - Timer system with color-coded warnings
 * - Answer validation and scoring system
 * - Review mode with correct/incorrect highlighting
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== ANIMATION INITIALIZATION =====
/**
 * Initialize AOS (Animate On Scroll) library for smooth page animations
 */
AOS.init({ duration: 800, once: true });

// ===== THEME MANAGEMENT =====
/**
 * Theme toggle functionality with localStorage persistence
 * Allows users to switch between dark and light themes
 */
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme preference
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-theme');
}

// Theme toggle event handler
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-theme');
  localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
});

// ===== QUIZ QUESTION DATABASE =====
/**
 * Comprehensive database of climate change quiz questions
 * Each question contains the question text, multiple choice options, and correct answer index
 * @typedef {Object} QuizQuestion
 * @property {string} q - Question text
 * @property {string[]} o - Array of four multiple choice options
 * @property {number} a - Index of correct answer (0-3)
 */
const allQuestions = [
  {
    q: "What is climate change?",
    o: ["Daily weather", "Long-term temperature change", "Rain only", "Wind only"],
    a: 1
  },
  {
    q: "Main cause of global warming?",
    o: ["Trees", "Greenhouse gases", "Oxygen", "Clouds"],
    a: 1
  },
  {
    q: "Which gas traps heat?",
    o: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"],
    a: 1
  },
  {
    q: "Which activity harms climate?",
    o: ["Planting trees", "Burning fossil fuels", "Recycling", "Saving water"],
    a: 1
  },
  {
    q: "How can kids help climate?",
    o: ["Waste energy", "Plant trees", "Burn trash", "Use plastic"],
    a: 1
  },
  {
    q: "Effect of global warming?",
    o: ["Ice melts", "More forests", "No change", "Less sunlight"],
    a: 0
  },
  {
    q: "Eco-friendly transport?",
    o: ["Car", "Plane", "Cycle", "Bike with fuel"],
    a: 2
  },
  {
    q: "Saving electricity helps?",
    o: ["More heat", "Less pollution", "More waste", "Nothing"],
    a: 1
  },
  {
    q: "Which is renewable energy?",
    o: ["Coal", "Solar", "Oil", "Gas"],
    a: 1
  },
  {
    q: "Plastic waste causes?",
    o: ["Clean ocean", "Pollution", "More fish", "Cold water"],
    a: 1
  },
  {
    q: "Planting trees helps because?",
    o: ["Decoration", "Absorb CO₂", "Make noise", "Waste land"],
    a: 1
  },
  {
    q: "Climate change affects?",
    o: ["Only animals", "Only humans", "Everyone", "Nobody"],
    a: 2
  },
  {
    q: "Which saves water?",
    o: ["Fix leaks", "Leave taps open", "Waste water", "Ignore"],
    a: 0
  },
  {
    q: "Best habit?",
    o: ["Reuse items", "Throw trash", "Burn waste", "Ignore pollution"],
    a: 0
  },
  {
    q: "Earth is getting?",
    o: ["Colder", "Warmer", "Same", "Frozen"],
    a: 1
  }
];

// ===== QUIZ STATE MANAGEMENT =====
/**
 * Core quiz state variables tracking current session progress
 * @typedef {Object} QuizState
 * @property {QuizQuestion[]} quiz - Array of 10 randomly selected questions for current session
 * @property {number} index - Current question index (0-9)
 * @property {number} score - Number of correct answers
 * @property {number} seconds - Remaining time in seconds
 * @property {number|null} timer - Timer interval reference
 * @property {number[]} userAnswers - Array storing user's selected answer indices
 */
let quiz = [];           // Current quiz questions (10 random questions)
let index = 0;          // Current question index
let score = 0;          // Correct answers count
let seconds = 0;        // Remaining time
let timer = null;       // Timer interval reference
let userAnswers = [];   // User's selected answers
let selectedTime = 300; // Default 5 minutes

// ===== PROGRESS PERSISTENCE =====
const PROGRESS_KEY = 'climateChangeQuizProgress';

/**
 * Save current quiz progress to localStorage
 */
function saveProgress() {
  const progress = {
    currentIndex: index,
    userAnswers: userAnswers,
    score: score,
    remainingTime: seconds,
    selectedQuestions: quiz,
    selectedTime: selectedTime,
    timestamp: Date.now(),
    quizId: 'climate-change-quiz'
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
    userAnswers = progress.userAnswers || [];
    score = progress.score || 0;
    seconds = progress.remainingTime || 300;
    quiz = progress.selectedQuestions || [];
    selectedTime = progress.selectedTime || 300;
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
/**
 * All interactive DOM elements organized by screen/functionality
 */
const timeSelect = document.getElementById('timeSelect');
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const reviewScreen = document.getElementById('reviewScreen');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const remarkEl = document.getElementById('remark');
const reviewList = document.getElementById('reviewList');
const qNumber = document.getElementById('q-number');

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
 * Start the quiz by selecting random questions and initializing the session
 */
function startQuiz() {
  // Clear any existing progress when starting new quiz
  clearProgress();

  // Select 10 random questions from the database
  quiz = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);

  // Set timer based on user selection
  selectedTime = parseInt(timeSelect.value);
  seconds = selectedTime;

  // Reset quiz state
  index = 0;
  score = 0;
  userAnswers = new Array(quiz.length).fill(null);

  // Transition to quiz screen
  startScreen.style.display = "none";
  quizScreen.style.display = "block";

  // Load first question and start timer
  loadQuestion();
  startTimer();
}

// ===== TIMER MANAGEMENT =====
/**
 * Start the countdown timer for the quiz session
 */
function startTimer() {
  updateTime();
  timer = setInterval(() => {
    seconds--;
    updateTime();
    if (seconds <= 0) {
      clearInterval(timer);
      showResult();
    }
  }, 1000);
}

/**
 * Update the timer display with formatted time and visual alerts
 */
function updateTime() {
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  timeEl.textContent = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;

  // Visual alert for low time remaining
  if (seconds < 10) {
    timeEl.parentElement.style.color = "#FF5252";
  }
}

// ===== QUESTION DISPLAY =====
/**
 * Load and display the current question with answer options
 */
function loadQuestion() {
  let currentQuestion = quiz[index];

  // Update progress metrics
  const progressText = document.querySelector('.progress-metrics span:first-child');
  if (progressText) {
    const timeSpent = selectedTime - seconds;
    progressText.textContent = `Time Spent: ${timeSpent}s`;
  }

  const questionsCompleted = document.querySelector('.progress-metrics span:last-child');
  if (questionsCompleted) {
    questionsCompleted.textContent = `Completed: ${index + 1}/${quiz.length}`;
  }

  // Update progress bar
  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    const progressPercent = ((index + 1) / quiz.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }

  // Update question number and text
  qNumber.textContent = index + 1;
  questionEl.textContent = currentQuestion.q;

  // Clear previous options and create new ones
  optionsEl.innerHTML = "";
  currentQuestion.o.forEach((option, optionIndex) => {
    let optionButton = document.createElement("div");
    optionButton.className = "option";
    optionButton.textContent = option;
    optionButton.onclick = () => selectOption(optionButton, optionIndex);

    // Restore previous selection if navigating back
    if (userAnswers[index] === optionIndex) {
      optionButton.classList.add("selected");
    }

    optionsEl.appendChild(optionButton);
  });
}

// ===== ANSWER SELECTION =====
/**
 * Handle user selection of an answer option
 * @param {HTMLElement} element - The clicked option element
 * @param {number} optionIndex - Index of the selected option (0-3)
 */
function selectOption(element, optionIndex) {
  // Remove previous selection highlight
  document.querySelectorAll(".option").forEach(option => option.classList.remove("selected"));

  // Highlight selected option
  element.classList.add("selected");

  // Store user's answer
  userAnswers[index] = optionIndex;

  // Save progress after each answer selection
  saveProgress();
}

// ===== QUESTION NAVIGATION =====
/**
 * Advance to the next question or show results if quiz is complete
 */
function nextQuestion() {
  // Check if user has selected an answer
  if (userAnswers[index] == null) {
    // Shake animation for next button to indicate missing answer
    const nextBtn = document.querySelector('.next-btn');
    nextBtn.style.transform = "translateX(5px)";
    setTimeout(() => nextBtn.style.transform = "translateX(0)", 100);
    return;
  }

  // Check answer and update score
  if (userAnswers[index] === quiz[index].a) {
    score++;
  }

  // Save progress after moving to next question
  saveProgress();

  // Move to next question or show results
  index++;
  if (index < quiz.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

// ===== QUIZ RESUME FUNCTIONALITY =====
/**
 * Resume a previously saved quiz session
 */
function resumeSavedQuiz() {
  if (loadProgress()) {
    // Transition to quiz screen
    startScreen.style.display = "none";
    quizScreen.style.display = "block";

    // Load current question and resume timer
    loadQuestion();
    startTimer();
  }
}

/**
 * Pause the current quiz session
 */
function pauseQuiz() {
  // Stop the timer
  clearInterval(timer);
  timer = null;

  // Save progress
  saveProgress();

  // Show resume button and hide pause button
  const pauseBtn = document.getElementById('pauseBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  if (pauseBtn) pauseBtn.style.display = 'none';
  if (resumeBtn) resumeBtn.style.display = 'inline-block';

  alert("Quiz paused! Click resume to continue.");
}

/**
 * Resume the current quiz session
 */
function resumeCurrentQuiz() {
  // Hide resume button and show pause button
  const pauseBtn = document.getElementById('pauseBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) resumeBtn.style.display = 'none';
  if (pauseBtn) pauseBtn.style.display = 'inline-block';

  // Restart timer
  startTimer();
}

// ===== RESULTS DISPLAY =====
/**
 * Display quiz results with score and performance-based remarks
 */
function showResult() {
  // Stop timer and clear saved progress
  clearInterval(timer);
  clearProgress();

  // Transition to results screen
  quizScreen.style.display = "none";
  resultScreen.style.display = "block";

  // Display score
  scoreEl.textContent = `${score}/${quiz.length}`;

  // Calculate performance percentage and show appropriate remark
  let percentage = (score / quiz.length) * 100;
  if (percentage >= 80) {
    remarkEl.textContent = "🌟 Climate Hero! Amazing!";
  } else if (percentage >= 50) {
    remarkEl.textContent = "👍 Good Job! Keep learning!";
  } else {
    remarkEl.textContent = "🌱 Don't give up! Try again!";
  }
}

// ===== ANSWER REVIEW =====
/**
 * Display detailed review of all questions with correct/incorrect answers
 */
function showReview() {
  // Transition to review screen
  resultScreen.style.display = "none";
  reviewScreen.style.display = "block";

  // Clear previous review content
  reviewList.innerHTML = "";

  // Generate review cards for each question
  quiz.forEach((question, questionIndex) => {
    let userAnswer = userAnswers[questionIndex];
    let isCorrect = userAnswer === question.a;
    let userAnswerText = question.o[userAnswer] || "No Answer";
    let correctAnswerText = question.o[question.a];

    // Create review card with color-coded border
    reviewList.innerHTML += `
      <div class="review-card" style="border-left-color: ${isCorrect ? 'var(--primary)' : 'var(--danger)'}">
        <p><strong>Q${questionIndex + 1}:</strong> ${question.q}</p>
        <p>Your Answer: <span class="${isCorrect ? 'correct' : 'wrong'}">${userAnswerText}</span></p>
        ${!isCorrect ? `<p>Correct Answer: <span class="correct">${correctAnswerText}</span></p>` : ''}
      </div>
    `;
  });
}