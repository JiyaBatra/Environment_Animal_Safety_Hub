/**
 * Waste Management Quiz - Environmental Education Assessment
 *
 * An interactive quiz focused on proper waste disposal, recycling practices,
 * and environmental awareness. Designed to educate users about waste segregation,
 * recycling, and sustainable waste management practices.
 *
 * Quiz Features:
 * - 10 carefully crafted questions about waste management
 * - 3-minute timer for focused learning
 * - FontAwesome trash icons for visual appeal
 * - Immediate feedback on answer selection
 * - Performance-based feedback and scoring
 * - Educational content about proper waste disposal
 *
 * Educational Topics Covered:
 * - Wet vs dry waste segregation
 * - Recyclable materials identification
 * - Hazardous waste handling
 * - Waste reduction strategies
 * - Composting and organic waste management
 * - Environmental impact of improper waste disposal
 * - Battery and electronic waste disposal
 * - Plastic pollution awareness
 * - Kitchen waste management
 * - Sustainable waste practices
 *
 * Technical Features:
 * - FontAwesome icons integration
 * - Color-coded answer feedback
 * - Timer system with automatic submission
 * - Responsive design with accessibility
 * - Immediate visual feedback on selections
 * - Performance-based encouragement messages
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== QUIZ QUESTION DATABASE =====
/**
 * Database of 10 waste management quiz questions
 * Each question contains the question text, multiple choice options, and correct answer index
 * @typedef {Object} WasteQuizQuestion
 * @property {string} q - Question text about waste management
 * @property {string[]} o - Array of four multiple choice options
 * @property {number} a - Index of correct answer (0-3)
 */
const questions = [
  {
    q: "Where should vegetable peels go?",
    o: ["Dry Waste", "Wet Waste", "Plastic", "Glass"],
    a: 1
  },
  {
    q: "Which item is recyclable?",
    o: ["Food waste", "Plastic bottle", "Used tissue", "Leaves"],
    a: 1
  },
  {
    q: "Where does broken glass go?",
    o: ["Wet", "Dry", "Hazardous", "Plastic"],
    a: 2
  },
  {
    q: "Best way to reduce waste?",
    o: ["Burn it", "Reuse items", "Throw away", "Ignore"],
    a: 1
  },
  {
    q: "Which bin for paper?",
    o: ["Wet", "Dry", "Hazardous", "Medical"],
    a: 1
  },
  {
    q: "Plastic bags harm because?",
    o: ["They dissolve", "They pollute", "They help soil", "They vanish"],
    a: 1
  },
  {
    q: "What is composting?",
    o: ["Burning waste", "Recycling plastic", "Turning waste to manure", "Dumping trash"],
    a: 2
  },
  {
    q: "Used batteries go to?",
    o: ["Wet", "Dry", "Hazardous", "Recycle bin"],
    a: 2
  },
  {
    q: "Which helps environment?",
    o: ["Littering", "Segregation", "Burning trash", "Plastic use"],
    a: 1
  },
  {
    q: "Wet waste mainly comes from?",
    o: ["Kitchen", "Bathroom", "Road", "Factory"],
    a: 0
  }
];

// ===== QUIZ STATE MANAGEMENT =====
/**
 * Core quiz state variables tracking current session progress
 * @typedef {Object} WasteQuizState
 * @property {number} index - Current question index (0-9)
 * @property {number} score - Number of correct answers
 * @property {number} time - Remaining time in seconds (3 minutes = 180 seconds)
 * @property {number|null} timer - Timer interval reference
 * @property {number[]} answers - Array storing user's selected answer indices
 */
let index = 0;         // Current question index
let score = 0;         // Correct answers count
let time = 180;        // 3 minutes in seconds
let timer = null;      // Timer interval reference
let answers = [];      // User's selected answers

// ===== PROGRESS PERSISTENCE =====
/**
 * localStorage key for saving waste management quiz progress
 * @type {string}
 */
const PROGRESS_KEY = 'wasteManagementQuizProgress';

/**
 * Save current quiz progress to localStorage
 */
function saveProgress() {
  const progress = {
    currentIndex: index,
    answers: answers,
    score: score,
    remainingTime: time,
    timestamp: Date.now(),
    quizId: 'waste-management-quiz'
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
    time = progress.remainingTime || 180;
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
 * All interactive DOM elements used in the waste management quiz
 */
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const question = document.getElementById('question');
const options = document.getElementById('options');
const remark = document.getElementById('remark');

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

// Call initialization
initializeQuiz();

/**
 * Start the waste management quiz session
 * Initializes quiz state and transitions to quiz screen
 */
function startQuiz() {
  // Clear any existing progress when starting new quiz
  clearProgress();

  // Reset quiz state
  index = 0;
  score = 0;
  time = 180;
  answers = new Array(questions.length).fill(null);

  // Transition screens
  startScreen.style.display = "none";
  quizScreen.style.display = "block";

  // Load first question and start timer
  loadQuestion();
  startTimer();
}

// ===== TIMER MANAGEMENT =====
/**
 * Start the countdown timer for the quiz session (3 minutes)
 */
function startTimer() {
  updateTime();
  timer = setInterval(() => {
    time--;
    updateTime();
    if (time <= 0) {
      clearInterval(timer);
      showResult();
    }
  }, 1000);
}

/**
 * Update the timer display with formatted time
 */
function updateTime() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  document.getElementById("time").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// ===== QUESTION DISPLAY =====
/**
 * Load and display the current question with trash icon options
 */
function loadQuestion() {
  let currentQuestion = questions[index];

  // Update progress text
  const progressText = document.querySelector('.progress-metrics span:first-child');
  if (progressText) {
    const timeSpent = 180 - time; // Total time minus remaining time
    progressText.textContent = `Time Spent: ${timeSpent}s`;
  }

  // Update questions completed
  const questionsCompleted = document.querySelector('.progress-metrics span:last-child');
  if (questionsCompleted) {
    questionsCompleted.textContent = `Completed: ${index + 1}/10`;
  }

  // Update progress bar
  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    const progressPercent = ((index + 1) / questions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }

  // Display question with numbering
  question.textContent = `Q${index + 1}. ${currentQuestion.q}`;

  // Clear previous options and create new ones
  options.innerHTML = "";

  // Create option elements with FontAwesome trash icons
  currentQuestion.o.forEach((optionText, optionIndex) => {
    let optionDiv = document.createElement("div");
    optionDiv.className = "option";

    // Add trash icon and option text
    optionDiv.innerHTML = `<i class="fa-solid fa-trash"></i> ${optionText}`;

    // Click handler for option selection
    optionDiv.onclick = () => selectOption(optionDiv, optionIndex);

    // Restore previous selection if navigating back
    if (answers[index] === optionIndex) {
      optionDiv.classList.add("selected");
    }

    options.appendChild(optionDiv);
  });
}

// ===== ANSWER SELECTION =====
/**
 * Handle user selection of an answer option
 * @param {HTMLElement} element - The clicked option div
 * @param {number} optionIndex - Index of the selected option (0-3)
 */
function selectOption(element, optionIndex) {
  // Remove previous selection highlighting
  document.querySelectorAll(".option").forEach(option => option.classList.remove("selected"));

  // Highlight selected option
  element.classList.add("selected");

  // Store user's answer
  answers[index] = optionIndex;

  // Store correctness data for validation
  element.dataset.correct = (optionIndex === questions[index].a).toString();

  // Save progress after each answer selection
  saveProgress();
}

// ===== QUESTION NAVIGATION =====
/**
 * Advance to the next question or show results if quiz is complete
 */
function nextQuestion() {
  let selectedOption = document.querySelector(".option.selected");

  // Require answer selection with friendly alert
  if (!selectedOption) {
    alert("Please select an option 😊");
    return;
  }

  // Update score if answer was correct
  if (selectedOption.dataset.correct === "true") {
    score++;
  }

  // Save progress after moving to next question
  saveProgress();

  // Move to next question or show results
  index++;
  if (index < questions.length) {
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
  document.getElementById('pauseBtn').style.display = 'none';
  document.getElementById('resumeBtn').style.display = 'inline-block';

  // Optional: Show a pause message
  alert("Quiz paused! Click resume to continue.");
}

/**
 * Resume the current quiz session
 */
function resumeCurrentQuiz() {
  // Hide resume button and show pause button
  document.getElementById('resumeBtn').style.display = 'none';
  document.getElementById('pauseBtn').style.display = 'inline-block';

  // Restart timer
  startTimer();
}

// ===== RESULTS DISPLAY =====
/**
 * Display quiz results with score and performance-based feedback
 */
function showResult() {
  // Stop timer and clear saved progress
  clearInterval(timer);
  clearProgress();

  // Transition to results screen
  quizScreen.style.display = "none";
  resultScreen.style.display = "block";

  // Display final score
  document.getElementById("score").textContent = `${score}/${questions.length}`;

  // Show performance-based remark with emojis
  if (score >= 8) {
    remark.textContent = "🌟 Waste Warrior!";
  } else if (score >= 5) {
    remark.textContent = "👍 Good Effort!";
  } else {
    remark.textContent = "🌱 Keep Learning!";
  }
}
