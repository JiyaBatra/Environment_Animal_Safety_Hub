/**
 * Animal Communication Quiz
 *
 * An interactive educational quiz designed to teach about animal communication
 * and signal interpretation for better human-animal coexistence.
 *
 * Quiz Features:
 * - 10 carefully crafted questions on animal communication
 * - Multiple-choice questions with immediate feedback
 * - Progress tracking and scoring
 * - Educational explanations for each answer
 * - Responsive design with animations
 *
 * Educational Topics Covered:
 * - Vocal communication signals
 * - Body language interpretation
 * - Warning and distress signals
 * - Safety guidelines for wildlife interaction
 * - Pet communication understanding
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== ANIMATION INITIALIZATION =====
AOS.init({ duration: 800, once: true });

// ===== QUIZ DATA =====
const quizData = [
    {
        question: "What does a dog's wagging tail usually indicate?",
        options: ["Aggression", "Happiness or excitement", "Fear", "Hunger"],
        correct: "B",
        explanation: "A wagging tail in dogs typically indicates happiness, excitement, or friendliness. However, the speed and position can provide more specific information about their mood."
    },
    {
        question: "Which of these is NOT a type of animal communication?",
        options: ["Vocal signals", "Body language", "Chemical signals", "Text messaging"],
        correct: "D",
        explanation: "Animals communicate through vocalizations, body language, chemical signals (scent marking), and visual displays, but they don't use text messaging."
    },
    {
        question: "What does it mean when a cat's ears are flattened backward?",
        options: ["Happiness", "Fear or aggression", "Playfulness", "Sleepiness"],
        correct: "B",
        explanation: "Flattened ears in cats usually indicate fear, anxiety, or aggression. It's a clear warning signal to give them space."
    },
    {
        question: "Which animal uses scent marking as a primary communication method?",
        options: ["Birds", "Fish", "Dogs", "Butterflies"],
        correct: "C",
        explanation: "Dogs use urine marking to communicate territory boundaries, reproductive status, and leave messages for other dogs."
    },
    {
        question: "What does a bear's 'humped' back posture indicate?",
        options: ["Playfulness", "Fear", "Aggression", "Hunger"],
        correct: "C",
        explanation: "A bear with a humped back is showing aggression and preparing to charge. This is a clear warning to back away slowly."
    },
    {
        question: "Which of these is a distress signal in many animals?",
        options: ["Pacing in circles", "Lying down comfortably", "Eating normally", "Grooming themselves"],
        correct: "A",
        explanation: "Pacing or repetitive movements often indicate distress, anxiety, or physical discomfort in many animal species."
    },
    {
        question: "What does a wolf's howl primarily communicate?",
        options: ["Hunger", "Territory marking and pack coordination", "Fear", "Sleepiness"],
        correct: "B",
        explanation: "Wolves howl to communicate with pack members, mark territory, and coordinate group activities."
    },
    {
        question: "Which body language indicates submission in dogs?",
        options: ["Direct staring", "Raised hackles", "Tucked tail and lowered body", "Bared teeth"],
        correct: "C",
        explanation: "A tucked tail and lowered body posture in dogs indicates submission or fear, not aggression."
    },
    {
        question: "What should you do if you see an animal with its hackles raised?",
        options: ["Approach to pet it", "Try to feed it", "Give it plenty of space", "Make loud noises"],
        correct: "C",
        explanation: "Raised hackles (fur along the back) indicate agitation, fear, or aggression. Always give the animal space in this situation."
    },
    {
        question: "Which animal communication method involves pheromones?",
        options: ["Vocal calls", "Body postures", "Scent marking", "Visual displays"],
        correct: "C",
        explanation: "Chemical signals like pheromones are used in scent marking to communicate reproductive status, territory, and alarm signals."
    }
];

// ===== QUIZ STATE =====
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// ===== DOM ELEMENTS =====
const questionText = document.getElementById('questionText');
const options = document.querySelectorAll('.option');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progressFill = document.getElementById('progressFill');
const currentQuestionSpan = document.getElementById('currentQuestion');
const feedbackSection = document.getElementById('feedbackSection');
const feedbackTitle = document.getElementById('feedbackTitle');
const feedbackText = document.getElementById('feedbackText');
const resultsSection = document.getElementById('resultsSection');
const finalScore = document.getElementById('finalScore');
const scoreMessage = document.getElementById('scoreMessage');

// ===== QUIZ FUNCTIONS =====
function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    options.forEach((option, index) => {
        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
        option.querySelector('.option-text').textContent = currentQuestion.options[index];
        option.className = 'option'; // Reset classes
        option.style.pointerEvents = 'auto'; // Re-enable clicking
    });

    selectedAnswer = null;
    feedbackSection.style.display = 'none';
    updateProgress();
    updateNavigation();
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressFill.style.width = `${progress}%`;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
}

function updateNavigation() {
    prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    nextBtn.textContent = currentQuestionIndex === quizData.length - 1 ? 'Finish' : 'Next';
}

function selectOption(optionElement) {
    if (selectedAnswer) return; // Prevent multiple selections

    selectedAnswer = optionElement.dataset.option;
    options.forEach(option => option.classList.remove('selected'));
    optionElement.classList.add('selected');

    checkAnswer();
}

function checkAnswer() {
    const currentQuestion = quizData[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;

    if (isCorrect) {
        score++;
        feedbackTitle.textContent = 'Correct! 🎉';
        feedbackTitle.style.color = '#2A9D8F';
    } else {
        feedbackTitle.textContent = 'Not quite right 😅';
        feedbackTitle.style.color = '#E76F51';
    }

    feedbackText.textContent = currentQuestion.explanation;
    feedbackSection.style.display = 'block';

    // Highlight correct and incorrect answers
    options.forEach(option => {
        const optionLetter = option.dataset.option;
        if (optionLetter === currentQuestion.correct) {
            option.classList.add('correct');
        } else if (optionLetter === selectedAnswer && !isCorrect) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none'; // Disable further clicking
    });
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function showResults() {
    document.querySelector('.quiz-card').style.display = 'none';
    resultsSection.style.display = 'block';

    finalScore.textContent = score;

    let message = '';
    if (score >= 9) {
        message = 'Excellent! You\'re an animal communication expert! 🏆';
    } else if (score >= 7) {
        message = 'Great job! You have good knowledge of animal signals! 🌟';
    } else if (score >= 5) {
        message = 'Good effort! Keep learning about animal communication! 📚';
    } else {
        message = 'Keep studying animal behavior - there\'s so much to learn! 🎓';
    }

    scoreMessage.textContent = message;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;

    document.querySelector('.quiz-card').style.display = 'block';
    resultsSection.style.display = 'none';

    loadQuestion();
}

function shareOnWhatsApp() {
    const text = `I scored ${score}/10 on the Animal Communication Quiz! 🐾 Test your knowledge: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
}

// ===== EVENT LISTENERS =====
options.forEach(option => {
    option.addEventListener('click', () => selectOption(option));
});

nextBtn.addEventListener('click', nextQuestion);
prevBtn.addEventListener('click', previousQuestion);

// ===== INITIALIZE QUIZ =====
document.addEventListener('DOMContentLoaded', loadQuestion);