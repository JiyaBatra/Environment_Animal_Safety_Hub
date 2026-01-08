// ==========================================
// GAME STATE & CONFIGURATION
// ==========================================
const state = {
    distance: 0,           // 0% to 100%
    carbon: 100,           // 100% to 0%
    correct: 0,
    score: 0,
    currentQ: 0,
    isAnswering: false,
    questionsForGame: [],  // Selected 5 questions for current game
    questionThresholds: [20, 40, 60, 80, 100]  // Distance % when questions appear
};

// ==========================================
// EXPANDED QUESTION BANK (10 Questions)
// ==========================================
const questionBank = [
    {
        q: "Which transport is most eco-friendly?",
        opts: ["Private Car", "Bicycle", "Airplane", "Motorcycle"],
        ans: "Bicycle",
        reduce: 20
    },
    {
        q: "What should we do with lights when leaving a room?",
        opts: ["Leave them on", "Turn them off", "Dim them", "Doesn't matter"],
        ans: "Turn them off",
        reduce: 15
    },
    {
        q: "Which bag is best for the environment?",
        opts: ["Plastic Bag", "Reusable Cloth Bag", "Paper Bag", "Disposable Bag"],
        ans: "Reusable Cloth Bag",
        reduce: 18
    },
    {
        q: "Which energy source is renewable?",
        opts: ["Coal", "Solar Power", "Natural Gas", "Petroleum"],
        ans: "Solar Power",
        reduce: 25
    },
    {
        q: "What's the best way to save water?",
        opts: ["Long Bath", "Short Shower", "Leave Tap Running", "Wash Car Daily"],
        ans: "Short Shower",
        reduce: 22
    },
    {
        q: "Which food choice has the lowest carbon footprint?",
        opts: ["Beef", "Chicken", "Plant-based meal", "Lamb"],
        ans: "Plant-based meal",
        reduce: 20
    },
    {
        q: "What's the best way to reduce plastic waste?",
        opts: ["Recycle everything", "Use reusable containers", "Buy biodegradable plastic", "Burn plastic waste"],
        ans: "Use reusable containers",
        reduce: 18
    },
    {
        q: "Which appliance uses the most energy at home?",
        opts: ["LED Light bulb", "Air Conditioner", "Mobile charger", "Laptop"],
        ans: "Air Conditioner",
        reduce: 15
    },
    {
        q: "What's the most eco-friendly way to dispose of e-waste?",
        opts: ["Throw in trash", "Recycle at e-waste center", "Bury in backyard", "Burn it"],
        ans: "Recycle at e-waste center",
        reduce: 22
    },
    {
        q: "Which action saves the most trees?",
        opts: ["Use digital documents", "Recycle paper", "Plant one tree", "Use thicker paper"],
        ans: "Use digital documents",
        reduce: 20
    }
];

// ==========================================
// DOM ELEMENTS
// ==========================================
const el = {
    welcomeScreen: document.getElementById('welcomeScreen'),
    gameScreen: document.getElementById('gameScreen'),
    resultScreen: document.getElementById('resultScreen'),
    startBtn: document.getElementById('startBtn'),
    restartBtn: document.getElementById('restartBtn'),
    hero: document.getElementById('hero'),
    parallax: document.getElementById('parallax'),
    carbonFill: document.getElementById('carbonFill'),
    carbonValue: document.getElementById('carbonValue'),
    distanceValue: document.getElementById('distanceValue'),
    correctValue: document.getElementById('correctValue'),
    scoreValue: document.getElementById('scoreValue'),
    gameMsg: document.getElementById('gameMsg'),
    modal: document.getElementById('modal'),
    questionText: document.getElementById('questionText'),
    options: document.getElementById('options'),
    feedback: document.getElementById('feedback'),
    badgeEmoji: document.getElementById('badgeEmoji'),
    badgeTitle: document.getElementById('badgeTitle'),
    badgeDesc: document.getElementById('badgeDesc'),
    finalCarbon: document.getElementById('finalCarbon'),
    finalCorrect: document.getElementById('finalCorrect'),
    finalScore: document.getElementById('finalScore')
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Shuffle array and pick random 5 questions
function getRandomQuestions() {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
}

// Switch Screen
function switchScreen(screen) {
    el.welcomeScreen.classList.remove('active');
    el.gameScreen.classList.remove('active');
    el.resultScreen.classList.remove('active');
    
    if (screen === 'welcome') el.welcomeScreen.classList.add('active');
    if (screen === 'game') el.gameScreen.classList.add('active');
    if (screen === 'result') el.resultScreen.classList.add('active');
}

// Update Carbon Meter
function updateCarbon() {
    const percent = Math.max(0, Math.min(100, state.carbon));
    el.carbonFill.style.width = percent + '%';
    el.carbonValue.textContent = Math.round(percent) + '%';
    
    el.carbonFill.classList.remove('low', 'medium');
    if (percent <= 30) el.carbonFill.classList.add('low');
    else if (percent <= 60) el.carbonFill.classList.add('medium');
}

// Update Stats
function updateStats() {
    el.distanceValue.textContent = Math.round(state.distance) + '%';
    el.correctValue.textContent = state.correct;
    el.scoreValue.textContent = state.score;
}

// Move Hero (LEFT to RIGHT using transform)
function moveHero(dist) {
    state.distance = Math.min(100, state.distance + dist);
    
    // Calculate pixel position for LEFT to RIGHT movement
    const trackWidth = el.hero.parentElement.offsetWidth - 100; // Account for hero size
    const pixelPosition = (state.distance / 100) * trackWidth;
    
    // Move hero from left (0px) to right (trackWidth)
    el.hero.style.transform = `translateX(${pixelPosition}px)`;
    
    // Parallax effect - trees move slower (half speed) in opposite direction
    el.parallax.style.transform = `translateX(-${state.distance * 0.5}%)`;
    
    updateStats();
}

// Show Message
function showMsg(text, duration = 2000) {
    el.gameMsg.textContent = text;
    el.gameMsg.style.display = 'inline-block';
    setTimeout(() => {
        el.gameMsg.style.display = 'none';
    }, duration);
}

// ==========================================
// GAME LOGIC
// ==========================================

// Start Game - Reset Everything
function startGame() {
    // Reset state
    state.distance = 0;
    state.carbon = 100;
    state.correct = 0;
    state.score = 0;
    state.currentQ = 0;
    state.isAnswering = false;
    
    // Get 5 random questions for this game
    state.questionsForGame = getRandomQuestions();
    
    // Reset UI
    el.hero.style.transform = 'translateX(0)';
    el.hero.classList.remove('slowed');
    el.parallax.style.transform = 'translateX(0)';
    
    updateCarbon();
    updateStats();
    switchScreen('game');
    
    showMsg('🌍 Let\'s start your eco-journey!');
    setTimeout(() => runRace(), 2500);
}

// Run Race - Main Game Loop
function runRace() {
    if (state.distance >= 100) {
        endGame();
        return;
    }
    
    // Check if we've reached a question threshold
    const nextThreshold = state.questionThresholds[state.currentQ];
    
    if (state.distance >= nextThreshold && state.currentQ < state.questionsForGame.length && !state.isAnswering) {
        // Stop and show question
        showQuestion();
    } else if (state.distance < 100 && !state.isAnswering) {
        // Continue auto-moving
        setTimeout(() => {
            moveHero(1.5); // Smooth movement
            runRace();
        }, 80);
    }
}

// Show Question Modal
function showQuestion() {
    state.isAnswering = true;
    const q = state.questionsForGame[state.currentQ];
    
    el.questionText.textContent = q.q;
    el.options.innerHTML = '';
    el.feedback.classList.remove('active', 'correct', 'wrong');
    el.feedback.textContent = '';
    
    // Create option buttons
    q.opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => handleAnswer(opt, btn, q);
        el.options.appendChild(btn);
    });
    
    el.modal.classList.add('active');
}

// Handle Answer
function handleAnswer(selected, btnElement, question) {
    const correct = selected === question.ans;
    
    // Disable all buttons
    const allBtns = el.options.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (correct) {
        // CORRECT ANSWER
        btnElement.classList.add('correct');
        el.feedback.textContent = '✅ Excellent! You\'re helping the planet!';
        el.feedback.classList.add('active', 'correct');
        
        // Update score and stats
        state.correct++;
        state.score += 20; // +20 for correct
        state.carbon = Math.max(0, state.carbon - question.reduce); // Decrease carbon
        
        // Move hero forward after delay
        setTimeout(() => {
            const remainingDistance = state.questionThresholds[state.currentQ] - state.distance;
            moveHero(remainingDistance + 2); // Move to threshold + little extra
        }, 1200);
        
    } else {
        // WRONG ANSWER
        btnElement.classList.add('wrong');
        el.feedback.textContent = '❌ Oops! That increases your carbon footprint!';
        el.feedback.classList.add('active', 'wrong');
        
        // Update score and stats
        state.score = Math.max(0, state.score - 5); // -5 for wrong
        state.carbon = Math.min(100, state.carbon + 10); // Increase carbon
        
        // Apply "slowed" shake effect
        el.hero.classList.add('slowed');
        setTimeout(() => el.hero.classList.remove('slowed'), 800);
        
        // Move hero forward (smaller distance)
        setTimeout(() => {
            const remainingDistance = state.questionThresholds[state.currentQ] - state.distance;
            moveHero(Math.max(1, remainingDistance + 1)); // Move to threshold
        }, 1200);
    }
    
    updateCarbon();
    updateStats();
    
    // Close modal and continue
    setTimeout(() => {
        el.modal.classList.remove('active');
        state.currentQ++;
        state.isAnswering = false;
        
        // Continue race
        setTimeout(() => runRace(), 500);
    }, 2800);
}

// End Game - Show Results
function endGame() {
    // Calculate badge based on performance
    let badge = {
        emoji: '🌍',
        title: 'Eco Learner',
        desc: 'Keep learning about our planet!',
        color: '#4AB864'
    };
    
    const correctPercentage = (state.correct / state.questionsForGame.length) * 100;
    
    if (state.carbon <= 20 && correctPercentage >= 80) {
        badge = {
            emoji: '🏆',
            title: 'Earth Guardian',
            desc: 'You\'re a true eco-champion!',
            color: '#FFD700'
        };
    } else if (state.carbon <= 40 && correctPercentage >= 60) {
        badge = {
            emoji: '⭐',
            title: 'Eco Warrior',
            desc: 'You\'re making a real difference!',
            color: '#00FF87'
        };
    } else if (state.carbon <= 60 && correctPercentage >= 40) {
        badge = {
            emoji: '🌱',
            title: 'Nature Friend',
            desc: 'You care about the environment!',
            color: '#5FD68A'
        };
    }
    
    // Update result screen
    el.badgeEmoji.textContent = badge.emoji;
    el.badgeTitle.textContent = badge.title;
    el.badgeTitle.style.color = badge.color;
    el.badgeDesc.textContent = badge.desc;
    
    el.finalCarbon.textContent = Math.round(state.carbon) + '%';
    el.finalCorrect.textContent = state.correct + '/' + state.questionsForGame.length;
    el.finalScore.textContent = state.score;
    
    // Color code carbon score
    if (state.carbon <= 30) {
        el.finalCarbon.style.color = '#00FF87';
    } else if (state.carbon <= 60) {
        el.finalCarbon.style.color = '#FFD700';
    } else {
        el.finalCarbon.style.color = '#FF4D4D';
    }
    
    // Switch to result screen
    setTimeout(() => switchScreen('result'), 1000);
}

// ==========================================
// EVENT LISTENERS
// ==========================================
el.startBtn.addEventListener('click', startGame);

// Restart button - completely reset without page refresh
el.restartBtn.addEventListener('click', () => {
    // Reset all state
    state.distance = 0;
    state.carbon = 100;
    state.correct = 0;
    state.score = 0;
    state.currentQ = 0;
    state.isAnswering = false;
    state.questionsForGame = [];
    
    // Reset UI elements
    el.hero.style.transform = 'translateX(0)';
    el.hero.classList.remove('slowed');
    el.parallax.style.transform = 'translateX(0)';
    el.modal.classList.remove('active');
    
    updateCarbon();
    updateStats();
    
    // Go back to welcome screen
    switchScreen('welcome');
});

// Prevent modal close on backdrop click during question
el.modal.addEventListener('click', (e) => {
    if (e.target === el.modal || e.target.classList.contains('modal-bg')) {
        // Don't allow closing during active question
        if (state.isAnswering) {
            e.stopPropagation();
        }
    }
});

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    switchScreen('welcome');
    updateCarbon();
    updateStats();
    console.log('🌍 Eco-Runner Premium Game Loaded!');
    console.log(`📚 Question Bank: ${questionBank.length} questions available`);
});