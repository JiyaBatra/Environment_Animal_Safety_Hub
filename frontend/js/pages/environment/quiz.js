/**
 * Environmental Quiz Game
 *
 * Interactive quiz application for environmental education with timer,
 * scoring system, review functionality, and animated background elements.
 * Features floating environmental icons, parallax effects, and gamified learning.
 *
 * Features:
 * - 10 randomized questions from environmental knowledge base
 * - Timer-based gameplay with visual warnings
 * - Score tracking and performance remarks
 * - Answer review with correct/incorrect feedback
 * - Floating background animations
 * - Parallax mouse effects
 * - Responsive design with animations
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ========== QUIZ DATA ==========

/**
 * Environmental quiz questions with multiple choice options
 * Each question has a question (q), options array (o), and correct answer index (a)
 * @type {Array<Object>}
 */
const questions = [
    {
        q: "What helps reduce pollution?",
        o: ["Planting trees 🌳", "Burning waste 🔥", "Cutting forests 🪓", "Throwing trash 🗑️"],
        a: 0
    },
    {
        q: "Which energy is renewable?",
        o: ["Coal ⚫", "Solar ☀️", "Oil 🚗", "Gas 💨"],
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
        o: ["Oxygen 💨", "Carbon dioxide 🌫️", "Nitrogen ✗", "Hydrogen 🎈"],
        a: 1
    },
    {
        q: "What protects wildlife?",
        o: ["Deforestation 🪵", "Conservation 🏞️", "Hunting 🔫", "Pollution 🏭"],
        a: 1
    },
    {
        q: "Which bin for plastic?",
        o: ["Green 🟢", "Blue 🔵", "Red 🔴", "Black ⚫"],
        a: 1
    },
    {
        q: "What harms oceans?",
        o: ["Clean water 🌊", "Plastic waste 🗑️", "Fish 🐟", "Coral 🪸"],
        a: 1
    },
    {
        q: "Best transport to reduce pollution?",
        o: ["Car 🚗", "Bus 🚌", "Cycle 🚲", "Plane ✈️"],
        a: 2
    }
];

// ========== FLOATING BACKGROUND LOGIC ==========

/**
 * Create floating environmental icons in the background
 */
function createFloatingElements() {
    const container = document.getElementById('floating-container');
    const icons = ['🌱', '🌿', '☁️', '☀️', '🦋', '🐝', '🌺'];

    for (let i = 0; i < 15; i++) {
        const span = document.createElement('span');
        span.className = 'floater';
        span.textContent = icons[Math.floor(Math.random() * icons.length)];

        // Random positioning and animation properties
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10; // 10-20s
        const delay = Math.random() * 10;
        const size = Math.random() * 2 + 1; // 1-3rem

        span.style.left = `${left}%`;
        span.style.animationDuration = `${duration}s`;
        span.style.animationDelay = `-${delay}s`;
        span.style.fontSize = `${size}rem`;

        container.appendChild(span);
    }
}

// ========== GAME STATE ==========

/**
 * Current quiz questions (randomized subset)
 * @type {Array<Object>}
 */
let quiz = [];

/**
 * Current question index
 * @type {number}
 */
let index = 0;

/**
 * Player's current score
 * @type {number}
 */
let score = 0;

/**
 * Remaining time in seconds
 * @type {number}
 */
let seconds = 0;

/**
 * Timer interval reference
 * @type {number}
 */
let timer;

/**
 * Array to store player's answers
 * @type {Array<number|null>}
 */
let answers = [];

// ========== DOM ELEMENTS ==========

const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const reviewScreen = document.getElementById('reviewScreen');
const timeEl = document.getElementById('time');
const progressEl = document.getElementById('progressText');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');

// ========== INITIALIZATION ==========

// Initialize floating background elements
createFloatingElements();

// ========== QUIZ FUNCTIONS ==========

/**
 * Start the quiz with selected time limit
 */
function startQuiz() {
    const timeSelect = document.getElementById('timeSelect');

    // Randomize and select 10 questions
    quiz = [...questions].sort(() => 0.5 - Math.random()).slice(0, 10);
    seconds = parseInt(timeSelect.value);
    answers = new Array(quiz.length).fill(null);
    index = 0;
    score = 0;

    // Switch screens
    startScreen.style.display = "none";
    quizScreen.style.display = "block";

    // Add entrance animation
    quizScreen.classList.add('slide-up');

    loadQuestion();
    startTimer();
}

/**
 * Start the countdown timer
 */
function startTimer() {
    updateTime();
    timer = setInterval(() => {
        seconds--;
        updateTime();
        if (seconds <= 0) showResult();
    }, 1000);
}

/**
 * Update the timer display
 */
function updateTime() {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    timeEl.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;

    // Warning color when time is low
    if (seconds < 30) {
        timeEl.parentElement.style.color = 'red';
    } else {
        timeEl.parentElement.style.color = '#f57c00';
    }
}

/**
 * Load and display current question
 */
function loadQuestion() {
    let q = quiz[index];
    progressEl.textContent = `Question ${index + 1} of ${quiz.length}`;
    questionEl.textContent = q.q;

    // Clear and animate options
    optionsEl.innerHTML = "";

    q.o.forEach((opt, i) => {
        let div = document.createElement("div");
        div.className = "option";
        div.textContent = opt;
        div.style.animation = `popIn 0.5s ease backwards ${i * 0.1}s`; // Staggered animation

        div.onclick = () => selectOption(div, i);

        // Restore previous selection if navigating back
        if (answers[index] === i) div.classList.add("selected");

        optionsEl.appendChild(div);
    });
}

/**
 * Handle option selection
 * @param {HTMLElement} el - Selected option element
 * @param {number} i - Option index
 */
function selectOption(el, i) {
    document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    answers[index] = i;

    // Optional: Play a small click sound here
}

/**
 * Move to next question or show results
 */
function nextQuestion() {
    if (answers[index] == null) {
        // Shake animation for feedback
        const btn = document.querySelector('.nextBtn');
        btn.classList.add('shake-it');
        setTimeout(() => btn.classList.remove('shake-it'), 300);
        return;
    }

    // Check answer and update score
    if (answers[index] === quiz[index].a) score++;

    index++;

    if (index < quiz.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

/**
 * Display quiz results
 */
function showResult() {
    clearInterval(timer);
    quizScreen.style.display = "none";
    resultScreen.style.display = "block";
    resultScreen.classList.add('slide-up');

    document.getElementById('finalScore').textContent = score;

    const remarkEl = document.getElementById('remark');
    if (score >= 8) {
        remarkEl.textContent = "🌟 Amazing! You're an Eco Hero!";
    } else if (score >= 5) {
        remarkEl.textContent = "👍 Good Job! Keep it green!";
    } else {
        remarkEl.textContent = "🌱 Nice try! Learn more & play again!";
    }
}

/**
 * Show detailed answer review
 */
function showReview() {
    resultScreen.style.display = "none";
    reviewScreen.style.display = "block";

    const list = document.getElementById('reviewList');
    list.innerHTML = "";

    quiz.forEach((q, i) => {
        let div = document.createElement("div");
        const isCorrect = answers[i] === q.a;
        div.className = `review-item ${isCorrect ? 'correct-ans' : 'wrong-ans'}`;

        // Add stagger delay for animation
        div.style.animationDelay = `${i * 0.1}s`;

        div.innerHTML = `
            <strong>Q${i + 1}: ${q.q}</strong><br>
            <div style="margin-top:5px;font-size:0.9rem">
                Your Answer: <span>${q.o[answers[i]] || "Skipped 🚫"}</span> ${isCorrect ? '✅' : '❌'}<br>
                ${!isCorrect ? `Correct Answer: <b>${q.o[q.a]}</b>` : ''}
            </div>
        `;

        list.appendChild(div);
    });
}

// ========== PARALLAX EFFECT ==========

/**
 * Add parallax effect to hero section based on mouse movement
 */
document.addEventListener('mousemove', (e) => {
    const hero = document.getElementById('heroScene');
    const layers = document.querySelectorAll('.scene-layer');

    // Get mouse position relative to center of screen
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    // Move layers slightly for depth effect
    layers.forEach((layer, index) => {
        const speed = (index + 1) * 0.5; // Different speeds for depth
        const xOffset = x * speed;
        const yOffset = y * speed;

        // Apply transform to create parallax effect
        if (layer.classList.contains('hills-back') || layer.classList.contains('hills-front')) {
            layer.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px)`;
        }
    });
});