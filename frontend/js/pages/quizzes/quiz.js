/**
 * Main Environmental Quiz - Comprehensive Interactive Assessment
 *
 * A feature-rich environmental quiz application with advanced UI features,
 * progress persistence, floating animations, and comprehensive question review.
 * Designed to educate users about environmental conservation through interactive testing.
 *
 * Quiz Features:
 * - 10 carefully crafted environmental questions with emojis
 * - Random question selection for varied experiences
 * - Customizable time limits with visual warnings
 * - Progress saving and resume functionality
 * - Floating background animations
 * - Parallax mouse effects
 * - Comprehensive answer review system
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Performance-based feedback and scoring
 *
 * Educational Topics Covered:
 * - Pollution reduction and environmental protection
 * - Renewable energy sources
 * - Waste recycling and resource conservation
 * - Endangered species awareness
 * - Water conservation practices
 * - Global warming and greenhouse gases
 * - Wildlife conservation
 * - Waste sorting and proper disposal
 * - Ocean pollution prevention
 * - Sustainable transportation
 *
 * Technical Features:
 * - localStorage for progress persistence
 * - CSS animations and transitions
 * - Mouse parallax effects
 * - Floating element animations
 * - Responsive design with accessibility
 * - Timer system with color-coded warnings
 * - Progress bar visualization
 * - Staggered animation effects
 * - Keyboard navigation support
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== QUIZ QUESTION DATABASE =====
/**
 * Database of 10 environmental quiz questions with emoji-enhanced options
 * Each question contains the question text, multiple choice options with emojis, and correct answer index
 * @typedef {Object} QuizQuestion
 * @property {string} q - Question text
 * @property {string[]} o - Array of four multiple choice options with emojis
 * @property {number} a - Index of correct answer (0-3)
 */
const questions = [
  {
    q: "What helps reduce pollution?",
    o: ["Planting trees 🌳", "Burning waste 🔥", "Cutting forests 🪓", "Throwing trash 🗑️"],
    a: 0
  },
  {
    q: "Which energy is renewable?",
    o: ["Coal ⛽", "Solar ☀️", "Oil 🚢", "Gas 💨"],
    a: 1
  },
  {
    q: "Why recycle waste?",
    o: ["Increase trash 🚯", "Save resources ♻️", "Pollute water 💧", "Waste money 💸"],
    a: 1
  },
  {
    q: "Which animal is endangered?",
    o: ["Dog 🐕", "Cat 🐈", "Tiger 🐅", "Cow 🐄"],
    a: 2
  },
  {
    q: "Best way to save water?",
    o: ["Leave taps open 🚰", "Fix leaks 🔧", "Waste water 🚿", "Ignore 🙄"],
    a: 1
  },
  {
    q: "What gas causes global warming?",
    o: ["Oxygen 🌬️", "Carbon dioxide 🌫️", "Nitrogen ✗", "Hydrogen 🎈"],
    a: 1
  },
  {
    q: "What protects wildlife?",
    o: ["Deforestation 🪵", "Conservation 🏞️", "Hunting 🔫", "Pollution 🏭"],
    a: 1
  },
  {
    q: "Which bin for plastic?",
    o: ["Green 🟢", "Blue 🔵", "Red 🔴", "Black ⛑️"],
    a: 1
  },
  {
    q: "What harms oceans?",
    o: ["Clean water 🌊", "Plastic waste 🗃️", "Fish 🐟", "Coral 🪸"],
    a: 1
  },
  {
    q: "Best transport to reduce pollution?",
    o: ["Car 🚗", "Bus 🚌", "Cycle 🚲", "Plane ✈️"],
    a: 2
  }
];

// ===== FLOATING BACKGROUND SYSTEM =====
/**
 * Create animated floating background elements for visual appeal
 * Generates random environmental icons that float across the screen
 */
function createFloatingElements() {
  const container = document.getElementById('floating-container');
  const icons = ['🌱', '🌿', '☁️', '☀️', '🦋', '🐝', '🍃'];

  // Create 15 floating elements
  for (let i = 0; i < 15; i++) {
    const span = document.createElement('span');
    span.className = 'floater';
    span.textContent = icons[Math.floor(Math.random() * icons.length)];

    // Random positioning and animation properties
    const left = Math.random() * 100;           // Random horizontal position
    const duration = Math.random() * 10 + 10;   // 10-20s animation duration
    const delay = Math.random() * 10;           // Random start delay
    const size = Math.random() * 2 + 1;         // 1-3rem font size

    // Apply CSS properties for animation
    span.style.left = `${left}%`;
    span.style.animationDuration = `${duration}s`;
    span.style.animationDelay = `-${delay}s`;
    span.style.fontSize = `${size}rem`;

    container.appendChild(span);
  }
}

// ===== QUIZ STATE MANAGEMENT =====
/**
 * Core quiz state variables tracking current session progress
 * @typedef {Object} QuizState
 * @property {QuizQuestion[]} quiz - Array of 10 randomly selected questions for current session
 * @property {number} index - Current question index (0-9)
 * @property {number} score - Number of correct answers
 * @property {number} seconds - Remaining time in seconds
 * @property {number|null} timer - Timer interval reference
 * @property {number[]} answers - Array storing user's selected answer indices
 */
let quiz = [];         // Current quiz questions (10 random questions)
let index = 0;         // Current question index
let score = 0;         // Correct answers count
let seconds = 0;       // Remaining time
let timer = null;      // Timer interval reference
let answers = [];      // User's selected answers

// ===== PROGRESS PERSISTENCE =====
/**
 * localStorage key for saving quiz progress
 * @type {string}
 */
const PROGRESS_KEY = 'quizProgress';

/**
 * Save current quiz progress to localStorage
 */
function saveProgress() {
  const progress = {
    currentIndex: index,
    answers: answers,
    score: score,
    remainingTime: seconds,
    timestamp: Date.now()
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
    seconds = progress.remainingTime || 0;
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
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const loadingScreen = document.getElementById('loadingScreen');
const resultScreen = document.getElementById('resultScreen');
const reviewScreen = document.getElementById('reviewScreen');
const timeEl = document.getElementById('time');
const progressEl = document.getElementById('progressText');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');

// ===== INITIALIZATION =====
/**
 * Initialize the quiz application on page load
 */
createFloatingElements();

// ===== QUIZ INITIALIZATION =====
/**
 * Start a new quiz session with random questions and timer
 */
function startQuiz() {
  const timeSelect = document.getElementById('timeSelect');

  // Select 10 random questions
  quiz = [...questions].sort(() => 0.5 - Math.random()).slice(0, 10);

  // Initialize quiz state
  seconds = parseInt(timeSelect.value);
  answers = new Array(quiz.length).fill(null);
  index = 0;
  score = 0;

  // Transition to quiz screen
  startScreen.style.display = "none";
  quizScreen.style.display = "block";
  quizScreen.classList.add('slide-up');

  // Load first question and start timer
  loadQuestion();
  startTimer();
}

// ===== QUIZ RESUME FUNCTIONALITY =====
/**
 * Resume a previously saved quiz session
 */
function resumeQuiz() {
  if (loadProgress()) {
    // Restore quiz state with same questions (simplified)
    quiz = [...questions].sort(() => 0.5 - Math.random()).slice(0, 10);

    // Transition to quiz screen
    startScreen.style.display = "none";
    quizScreen.style.display = "block";
    quizScreen.classList.add('slide-up');

    // Load current question and resume timer
    loadQuestion();
    startTimer();
  }
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
      showResult();
    }
  }, 1000);
}

/**
 * Update the timer display with formatted time and color warnings
 */
function updateTime() {
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  timeEl.textContent = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;

  // Color-coded time warnings
  if (seconds < 30) {
    timeEl.parentElement.style.color = 'red';
  } else {
    timeEl.parentElement.style.color = '#f57c00';
  }
}

// ===== QUESTION DISPLAY =====
/**
 * Load and display the current question with animated options
 */
function loadQuestion() {
  let currentQuestion = quiz[index];

  // Update progress text
  progressEl.textContent = `Question ${index + 1} of ${quiz.length}`;

  // Update progress bar
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressPercent = ((index + 1) / quiz.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }

  // Display question
  questionEl.textContent = currentQuestion.q;

  // Clear and create animated options
  optionsEl.innerHTML = "";
  currentQuestion.o.forEach((option, optionIndex) => {
    let optionButton = document.createElement("button");
    optionButton.className = "option";
    optionButton.textContent = option;
    optionButton.setAttribute("aria-label", `Option ${optionIndex + 1}: ${option}`);

    // Staggered pop-in animation
    optionButton.style.animation = `popIn 0.5s ease backwards ${optionIndex * 0.1}s`;

    // Click handler
    optionButton.onclick = () => selectOption(optionButton, optionIndex);

    // Keyboard accessibility
    optionButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(optionButton, optionIndex);
      }
    });

    // Restore previous selection if navigating back
    if (answers[index] === optionIndex) {
      optionButton.classList.add("selected");
    }

    optionsEl.appendChild(optionButton);
  });
}

// ===== ANSWER SELECTION =====
/**
 * Handle user selection of an answer option
 * @param {HTMLElement} element - The clicked option button
 * @param {number} optionIndex - Index of the selected option (0-3)
 */
function selectOption(element, optionIndex) {
  // Remove previous selection
  document.querySelectorAll(".option").forEach(option => option.classList.remove("selected"));

  // Highlight selected option
  element.classList.add("selected");
  element.setAttribute("aria-pressed", "true");

  // Store user's answer
  answers[index] = optionIndex;
}

// ===== QUESTION NAVIGATION =====
/**
 * Advance to the next question or show results if quiz is complete
 */
function nextQuestion() {
  // Check if answer was selected
  if (answers[index] == null) {
    // Shake animation for feedback
    const nextBtn = document.querySelector('.nextBtn');
    nextBtn.classList.add('shake-it');
    setTimeout(() => nextBtn.classList.remove('shake-it'), 300);
    return;
  }

  // Check answer and update score
  if (answers[index] === quiz[index].a) {
    score++;
  }

  // Move to next question or show results
  index++;
  if (index < quiz.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

// ===== RESULTS DISPLAY =====
/**
 * Display quiz results with loading animation and performance feedback
 */
function showResult() {
  // Stop timer and clear saved progress
  clearInterval(timer);
  clearProgress();

  // Transition screens with loading animation
  quizScreen.style.display = "none";
  loadingScreen.style.display = "block";
  loadingScreen.classList.add('slide-up');

  // Simulate processing time
  setTimeout(() => {
    loadingScreen.style.display = "none";
    resultScreen.style.display = "block";
    resultScreen.classList.add('slide-up');

    // Display final score
    document.getElementById('finalScore').textContent = score;

    // Show performance-based remark
    const remarkEl = document.getElementById('remark');
    if (score >= 8) {
      remarkEl.textContent = "🌟 Amazing! You're an Eco Hero!";
    } else if (score >= 5) {
      remarkEl.textContent = "👍 Good Job! Keep it green!";
    } else {
      remarkEl.textContent = "🌱 Nice try! Learn more & play again!";
    }
  }, 2000); // 2 second loading time
}

// ===== ANSWER REVIEW =====
/**
 * Display detailed review of all questions with correct/incorrect answers
 */
function showReview() {
  // Transition to review screen
  resultScreen.style.display = "none";
  reviewScreen.style.display = "block";

  const reviewList = document.getElementById('reviewList');
  reviewList.innerHTML = "";

  // Generate review items for each question
  quiz.forEach((question, questionIndex) => {
    let reviewItem = document.createElement("div");
    const isCorrect = answers[questionIndex] === question.a;

    reviewItem.className = `review-item ${isCorrect ? 'correct-ans' : 'wrong-ans'}`;
    reviewItem.style.animationDelay = `${questionIndex * 0.1}s`; // Staggered animation

    reviewItem.innerHTML = `
      <strong>Q${questionIndex + 1}: ${question.q}</strong><br>
      <div style="margin-top:5px;font-size:0.9rem">
        Your Answer: <span>${question.o[answers[questionIndex]] || "Skipped 🚫"}</span> ${isCorrect ? '✅' : '❌'}<br>
        ${!isCorrect ? `Correct Answer: <b>${question.o[question.a]}</b>` : ''}
      </div>
    `;

    reviewList.appendChild(reviewItem);
  });
}

// ===== PARALLAX EFFECTS =====
/**
 * Mouse parallax effect for hero section background layers
 * Creates depth illusion by moving background elements based on mouse position
 */
document.addEventListener('mousemove', (e) => {
  const hero = document.getElementById('heroScene');
  const layers = document.querySelectorAll('.scene-layer');

  // Calculate mouse position relative to screen center
  const x = (window.innerWidth - e.pageX * 2) / 100;
  const y = (window.innerHeight - e.pageY * 2) / 100;

  // Apply parallax movement to background layers
  layers.forEach((layer, index) => {
    const speed = (index + 1) * 0.5; // Different speeds for depth effect
    const xOffset = x * speed;
    const yOffset = y * speed;

    // Apply transform to create parallax effect
    if (layer.classList.contains('hills-back') || layer.classList.contains('hills-front')) {
      layer.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px)`;
    }
  });
});