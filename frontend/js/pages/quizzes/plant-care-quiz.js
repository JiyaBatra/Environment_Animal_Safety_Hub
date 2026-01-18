/**
 * Plant Care Quiz - Gardening and Plant Maintenance Education
 *
 * An educational quiz designed to teach children and adults about proper
 * plant care, gardening practices, and the science behind plant growth.
 * Features questions about watering, sunlight, soil, and plant health.
 *
 * Quiz Features:
 * - 10 carefully crafted questions on plant care and gardening
 * - Random selection of 7 questions per quiz session
 * - Customizable time limits for completion
 * - Real-time scoring and progress tracking
 * - Performance-based feedback and encouragement
 *
 * Educational Topics Covered:
 * - Proper watering techniques and frequency
 * - Photosynthesis and sunlight requirements
 * - Soil quality and plant growth
 * - Overwatering prevention and plant health
 * - Optimal watering times
 * - Fertilizer and nutrient management
 * - Indoor plant care requirements
 * - Plant maintenance and pruning
 * - Environmental benefits of plants
 * - Sustainable gardening habits
 *
 * Technical Features:
 * - Randomized question selection for variety
 * - Timer system with automatic submission
 * - Answer validation and scoring system
 * - Visual feedback for selected options
 * - Performance-based encouragement messages
 * - Responsive question navigation
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== QUIZ QUESTION DATABASE =====
/**
 * Database of 10 plant care and gardening questions
 * Each question contains the question text, multiple choice options, and correct answer index
 * @typedef {Object} QuizQuestion
 * @property {string} q - Question text
 * @property {string[]} o - Array of four multiple choice options
 * @property {number} a - Index of correct answer (0-3)
 */
const questions = [
  {
    q: "How often should plants be watered?",
    o: ["Every hour", "Only when soil is dry", "Never", "Once a year"],
    a: 1
  },
  {
    q: "Why do plants need sunlight?",
    o: ["For decoration", "For photosynthesis", "For water", "For insects"],
    a: 1
  },
  {
    q: "Which is best for plant growth?",
    o: ["Plastic soil", "Healthy soil", "Dry sand", "Rocks"],
    a: 1
  },
  {
    q: "Overwatering plants can?",
    o: ["Help growth", "Kill plants", "Make leaves shiny", "Increase sunlight"],
    a: 1
  },
  {
    q: "Best time to water plants?",
    o: ["Afternoon", "Morning or evening", "Midnight", "Anytime"],
    a: 1
  },
  {
    q: "What helps plants grow strong?",
    o: ["Trash", "Fertilizer", "Plastic", "Smoke"],
    a: 1
  },
  {
    q: "Indoor plants need?",
    o: ["Direct sunlight always", "Proper light & water", "No care", "Only shade"],
    a: 1
  },
  {
    q: "Why remove dry leaves?",
    o: ["Looks bad", "Helps plant grow", "Hurts plant", "Attracts bugs"],
    a: 1
  },
  {
    q: "Plants help environment by?",
    o: ["Making noise", "Producing oxygen", "Using plastic", "Creating waste"],
    a: 1
  },
  {
    q: "Which is good plant habit?",
    o: ["Overwatering", "Ignoring", "Regular care", "Breaking stems"],
    a: 2
  }
];

// ===== QUIZ STATE MANAGEMENT =====
/**
 * Core quiz state variables tracking current session progress
 * @typedef {Object} QuizState
 * @property {QuizQuestion[]} quiz - Array of 7 randomly selected questions for current session
 * @property {number} index - Current question index (0-6)
 * @property {number} score - Number of correct answers
 * @property {number|null} timer - Timer interval reference
 * @property {number} seconds - Remaining time in seconds
 */
let quiz = [];         // Current quiz questions (7 random questions)
let index = 0;         // Current question index
let score = 0;         // Correct answers count
let timer = null;      // Timer interval reference
let seconds = 0;       // Remaining time

// ===== QUIZ INITIALIZATION =====
/**
 * Start the quiz by selecting random questions and initializing the session
 */
function startQuiz() {
  // Select 7 random questions from the database
  quiz = [...questions].sort(() => 0.5 - Math.random()).slice(0, 7);

  // Set timer based on user selection
  seconds = parseInt(timeSelect.value);

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
 * Update the timer display with formatted time
 */
function updateTime() {
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  time.textContent = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// ===== QUESTION DISPLAY =====
/**
 * Load and display the current question with answer options
 */
function loadQuestion() {
  let currentQuestion = quiz[index];

  // Update question text with number
  question.textContent = `Q${index + 1}. ${currentQuestion.q}`;

  // Clear previous options and create new ones
  options.innerHTML = "";
  currentQuestion.o.forEach((option, optionIndex) => {
    let optionDiv = document.createElement("div");
    optionDiv.className = "option";
    optionDiv.textContent = option;
    optionDiv.onclick = () => selectOption(optionDiv, optionIndex);
    options.appendChild(optionDiv);
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

  // Store correctness data for validation
  element.dataset.correct = (optionIndex === quiz[index].a).toString();
}

// ===== QUESTION NAVIGATION =====
/**
 * Advance to the next question or show results if quiz is complete
 */
function nextQuestion() {
  let selectedOption = document.querySelector(".option.selected");

  // Check if user has selected an answer
  if (!selectedOption) {
    alert("Please select an option 🌱");
    return;
  }

  // Check answer and update score
  if (selectedOption.dataset.correct === "true") {
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
 * Display quiz results with score and performance-based remarks
 */
function showResult() {
  // Stop timer
  clearInterval(timer);

  // Transition to results screen
  quizScreen.style.display = "none";
  resultScreen.style.display = "block";

  // Display score
  score.textContent = `${score}/${quiz.length}`;

  // Show performance-based remark
  if (score >= 6) {
    remark.textContent = "🌟 Plant Care Pro!";
  } else if (score >= 4) {
    remark.textContent = "👍 Good Job!";
  } else {
    remark.textContent = "🌱 Keep Learning!";
  }
}