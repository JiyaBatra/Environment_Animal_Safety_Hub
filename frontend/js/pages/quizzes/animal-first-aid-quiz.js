/**
 * Animal First Aid Quiz - Emergency Animal Care Assessment
 *
 * An interactive quiz focused on animal first aid, emergency care,
 * and proper response to animal injuries. Designed to educate users about
 * life-saving techniques for animals in distress.
 *
 * Quiz Features:
 * - 10 carefully crafted questions about animal first aid
 * - 3-minute timer for focused learning
 * - FontAwesome heart icons for visual appeal
 * - Progress tracking with localStorage persistence
 * - Pause/resume functionality
 * - Immediate feedback on answer selection
 * - Performance-based feedback and scoring
 *
 * Educational Topics Covered:
 * - Initial assessment of injured animals
 * - Snake bite treatment
 * - Poisoning signs and symptoms
 * - Wound care and bleeding control
 * - When to seek professional help
 * - Animal CPR basics
 * - Burn treatment
 * - Fracture management
 * - Choking recognition
 * - Wild animal safety protocols
 *
 * @author Environment Animal Safety Hub Team
 * @version 2.0.0 - Added Progress Tracking
 * @since 2024
 */

// ===== QUIZ QUESTION DATABASE =====
const questions = [
  {
    q: "What should you do first when you find an injured animal?",
    o: ["Pick it up immediately", "Approach slowly and assess", "Run away", "Call friends"],
    a: 1
  },
  {
    q: "How should you treat a snake bite on an animal?",
    o: ["Suck out the venom", "Apply ice and keep calm", "Cut the wound", "Give alcohol"],
    a: 1
  },
  {
    q: "What are signs of poisoning in animals?",
    o: ["Excessive drooling and vomiting", "Happy and playful", "Sleeping normally", "Eating well"],
    a: 0
  },
  {
    q: "How to stop bleeding from a wound?",
    o: ["Apply pressure with clean cloth", "Pour water on it", "Rub dirt in", "Leave it alone"],
    a: 0
  },
  {
    q: "When should you seek professional help for an injured animal?",
    o: ["Always, even for minor injuries", "Only if it's bleeding heavily", "Never, handle it yourself", "Only if it's a pet"],
    a: 0
  },
  {
    q: "What is the first step for animal CPR?",
    o: ["Check for breathing", "Start compressions", "Give mouth-to-mouth", "Call vet immediately"],
    a: 0
  },
  {
    q: "How to treat a burn on an animal?",
    o: ["Apply butter or oil", "Cool with water for 10-20 minutes", "Cover with bandage tightly", "Ignore it"],
    a: 1
  },
  {
    q: "What to do if an animal has a broken bone?",
    o: ["Move it to a safe place and immobilize", "Pick it up and carry", "Let it walk", "Apply heat"],
    a: 0
  },
  {
    q: "Signs that an animal is choking?",
    o: ["Coughing and pawing at mouth", "Sleeping peacefully", "Eating normally", "Running around"],
    a: 0
  },
  {
    q: "What NOT to do when helping an injured wild animal?",
    o: ["Feed it", "Handle it gently", "Keep distance if aggressive", "Call wildlife experts"],
    a: 0
  }
];

// ===== QUIZ STATE MANAGEMENT =====
let index = 0;         // Current question index
let score = 0;         // Correct answers count
let time = 180;        // 3 minutes in seconds
let timer = null;      // Timer interval reference
let answers = [];      // User's selected answers

// ===== PROGRESS PERSISTENCE =====
const PROGRESS_KEY = 'animalFirstAidQuizProgress';

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
    quizId: 'animal-first-aid-quiz'
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

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeQuiz);

/**
 * Start the animal first aid quiz session
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

function updateTime() {
  let m = Math.floor(time / 60);
  let s = time % 60;
  document.getElementById("time").textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
}

// ===== QUESTION DISPLAY =====
function loadQuestion() {
  let currentQuestion = questions[index];

  // Update progress metrics
  const progressText = document.querySelector('.progress-metrics span:first-child');
  if (progressText) {
    const timeSpent = 180 - time;
    progressText.textContent = `Time Spent: ${timeSpent}s`;
  }

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

  // Create option elements with FontAwesome heart icons
  currentQuestion.o.forEach((optionText, optionIndex) => {
    let optionDiv = document.createElement("div");
    optionDiv.className = "option";
    optionDiv.innerHTML = `<i class="fa-solid fa-heart"></i> ${optionText}`;
    optionDiv.onclick = () => selectOption(optionDiv, optionIndex);

    // Restore previous selection if navigating back
    if (answers[index] === optionIndex) {
      optionDiv.classList.add("selected");
    }

    options.appendChild(optionDiv);
  });
}

// ===== ANSWER SELECTION =====
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
function nextQuestion() {
  let selectedOption = document.querySelector(".option.selected");

  // Require answer selection
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
function showResult() {
  // Stop timer and clear saved progress
  clearInterval(timer);
  clearProgress();

  // Transition to results screen
  quizScreen.style.display = "none";
  resultScreen.style.display = "block";

  // Display final score
  document.getElementById("score").textContent = `${score} / ${questions.length}`;

  // Show performance-based remark with emojis
  if (score >= 8) {
    remark.textContent = "🌟 Animal Hero!";
  } else if (score >= 5) {
    remark.textContent = "👍 Good Effort!";
  } else {
    remark.textContent = "🐾 Keep Learning!";
  }
}
