/**
 * Environment Awareness Quiz
 *
 * A comprehensive quiz designed to test and educate users about basic
 * environmental concepts, conservation practices, and ecological awareness.
 * Features 10 carefully crafted questions covering key environmental topics.
 *
 * Quiz Features:
 * - 10 multiple-choice questions on environmental awareness
 * - 2-minute time limit for completion
 * - Real-time scoring and progress tracking
 * - Performance-based feedback and remarks
 * - Visual answer selection with immediate feedback
 *
 * Educational Topics Covered:
 * - Tree planting and oxygen production
 * - Global warming and greenhouse gases
 * - Water conservation practices
 * - Pollution reduction strategies
 * - Eco-friendly transportation
 * - Recycling and resource conservation
 * - Renewable energy sources
 * - Ocean pollution and marine life
 * - Energy conservation habits
 * - Environmental health benefits
 *
 * Technical Features:
 * - Simple and intuitive user interface
 * - Timer system with automatic submission
 * - Answer validation and scoring system
 * - Visual feedback for selected options
 * - Performance-based encouragement messages
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== QUIZ QUESTION DATABASE =====
/**
 * Database of 10 environmental awareness questions
 * Each question contains the question text, multiple choice options, and correct answer index
 * @typedef {Object} QuizQuestion
 * @property {string} q - Question text
 * @property {string[]} o - Array of four multiple choice options
 * @property {number} a - Index of correct answer (0-3)
 */
const questions = [
  {
    q: "Why should we plant trees?",
    o: ["Decoration", "More oxygen", "Noise", "Waste"],
    a: 1
  },
  {
    q: "Which gas causes global warming?",
    o: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"],
    a: 1
  },
  {
    q: "Best way to save water?",
    o: ["Leave taps open", "Fix leaks", "Waste water", "Ignore"],
    a: 1
  },
  {
    q: "Which helps reduce pollution?",
    o: ["Burning waste", "Planting trees", "Cutting forests", "Throwing trash"],
    a: 1
  },
  {
    q: "Which is eco-friendly transport?",
    o: ["Car", "Bike", "Cycle", "Plane"],
    a: 2
  },
  {
    q: "Why recycle waste?",
    o: ["Increase trash", "Save resources", "Pollute air", "Waste money"],
    a: 1
  },
  {
    q: "Which energy is renewable?",
    o: ["Coal", "Solar", "Oil", "Gas"],
    a: 1
  },
  {
    q: "What harms oceans the most?",
    o: ["Clean water", "Plastic waste", "Fish", "Sand"],
    a: 1
  },
  {
    q: "What should we do with lights?",
    o: ["Keep on", "Switch off", "Break", "Ignore"],
    a: 1
  },
  {
    q: "Clean environment means?",
    o: ["Healthy life", "More disease", "Dirty water", "Less oxygen"],
    a: 0
  }
];

// ===== QUIZ STATE MANAGEMENT =====
/**
 * Core quiz state variables tracking current session progress
 * @typedef {Object} QuizState
 * @property {number} index - Current question index (0-9)
 * @property {number} score - Number of correct answers
 * @property {number} seconds - Remaining time in seconds (default: 120)
 * @property {number|null} timer - Timer interval reference
 */
let index = 0;          // Current question index
let score = 0;          // Correct answers count
let seconds = 120;      // 2-minute time limit
let timer = null;       // Timer interval reference

// ===== QUIZ INITIALIZATION =====
/**
 * Start the quiz by transitioning to quiz screen and loading first question
 */
function startQuiz() {
  // Transition screens
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
  let currentQuestion = questions[index];

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
  element.dataset.correct = (optionIndex === questions[index].a).toString();
}

// ===== QUESTION NAVIGATION =====
/**
 * Advance to the next question or show results if quiz is complete
 */
function nextQuestion() {
  let selectedOption = document.querySelector(".option.selected");

  // Check if user has selected an answer
  if (!selectedOption) {
    alert("Please select an option 😊");
    return;
  }

  // Check answer and update score
  if (selectedOption.dataset.correct === "true") {
    score++;
  }

  // Move to next question or show results
  index++;
  if (index < questions.length) {
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
  scoreEl.textContent = `${score}/${questions.length}`;

  // Show performance-based remark
  if (score >= 8) {
    remark.textContent = "🌟 Eco Champion!";
  } else if (score >= 5) {
    remark.textContent = "👍 Good effort!";
  } else {
    remark.textContent = "🌱 Keep learning!";
  }
}

// ===== DOM ELEMENT REFERENCES =====
/**
 * DOM element references for quiz interface
 */
const scoreEl = document.getElementById("score");