/**
 * Water Conservation Quiz
 *
 * An interactive quiz focused on water conservation practices and awareness.
 *
 * Uses QuizLoader for unified loading and initialization.
 *
 * @author Environment Animal Safety Hub Team
 * @version 3.0.0
 * @since 2024
 */

const readyScreen = document.getElementById("readyScreen");
const quizScreen = document.getElementById("quizScreen");
const startBtn = document.getElementById("startQuizBtn");

const questionEl = document.getElementById("question");
const optionBtns = document.querySelectorAll(".option-btn");
const feedback = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

let currentQuestion = 0;
let score = 0;
let answered = false;

const quizData = [
{
    question: "Which action saves the most water at home?",
    options: [
        "Leaving taps open",
        "Fixing leaking pipes",
        "Washing cars daily",
        "Using long showers"
    ],
    answer: 1
},
{
    question: "Which irrigation method saves water?",
    options: [
        "Flood irrigation",
        "Drip irrigation",
        "Overwatering plants",
        "Using hose pipes continuously"
    ],
    answer: 1
},
{
    question: "Turning off the tap while brushing helps to:",
    options: [
        "Waste water",
        "Save water",
        "Increase pressure",
        "Clean pipes"
    ],
    answer: 1
},
{
    question: "Rainwater harvesting is used to:",
    options: [
        "Store rainwater for reuse",
        "Increase water pollution",
        "Block drainage",
        "Waste natural resources"
    ],
    answer: 0
},
{
    question: "Which habit helps conserve water daily?",
    options: [
        "Taking shorter showers",
        "Running half-load washing machines",
        "Ignoring leaks",
        "Keeping taps open"
    ],
    answer: 0
}
];

startBtn.addEventListener("click", () => {
    readyScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    loadQuestion();
});

function loadQuestion() {
    answered = false;
    feedback.textContent = "";
    nextBtn.style.display = "none";

    const q = quizData[currentQuestion];
    questionEl.textContent = q.question;

    optionBtns.forEach((btn, index) => {
        btn.style.display = "block";
        btn.textContent = q.options[index];
        btn.style.background = "";
        btn.disabled = false;
    });
}

optionBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        if (answered) return;

        answered = true;
        const correctIndex = quizData[currentQuestion].answer;

        optionBtns.forEach(b => b.disabled = true);

        if (index === correctIndex) {
            btn.style.background = "#22c55e";
            feedback.textContent = "Correct! 🌿";
            score++;
            scoreEl.textContent = score;
        } else {
            btn.style.background = "#ef4444";
            optionBtns[correctIndex].style.background = "#22c55e";
            feedback.textContent = "Wrong! 💧";
        }

        nextBtn.style.display = "inline-block";
    });
});

nextBtn.addEventListener("click", () => {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    questionEl.textContent = "Quiz Completed!";
    feedback.textContent = `Your Score: ${score} / ${quizData.length}`;

    optionBtns.forEach(btn => btn.style.display = "none");
    nextBtn.style.display = "none";
}