// Waste Items Database
const wasteDatabase = {
    recycle: [
        { icon: '🥤' },
        { icon: '🫙' },
        { icon: '📰' },
        { icon: '📦' },
        { icon: '🥫' },
    ],
    compost: [
        { icon: '🍎' },
        { icon: '🍌' },
        { icon: '🍂' },
        { icon: '🥕' },
        { icon: '🌽' },
    ],
    trash: [
        { icon: '🍬' },
        { icon: '🥡' },
        { icon: '🔋' },
        { icon: '👕' },
        { icon: '🧻' },
    ]
};

// Game State
const game = {
    score: 0,
    timeLeft: 60,
    isPlaying: false,
    totalAttempts: 0,
    correctAttempts: 0,
    currentCombo: 0,
    spawnRate: 1500,
};

// DOM Elements
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const accuracyDisplay = document.getElementById('accuracy');
const startBtn = document.getElementById('startGameBtn');
const modal = document.getElementById('gameOverModal');
const finalScoreEl = document.getElementById('finalScore');
const finalScoreText = document.getElementById('finalScoreText');
const bins = document.querySelectorAll('.bin');
const pointSound = document.getElementById('pointSound');

let gameTimerInterval;
let spawnInterval;
let activeTouchItem = null;

// Start Button Event Listener
startBtn.addEventListener('click', function(e) {
    e.preventDefault();
    initializeGame();
});

function initializeGame() {
    if (game.isPlaying) return;

    game.isPlaying = true;
    game.score = 0;
    game.timeLeft = 60;
    game.totalAttempts = 0;
    game.correctAttempts = 0;
    game.currentCombo = 0;

    scoreDisplay.innerText = '0';
    timerDisplay.innerText = '60s';
    accuracyDisplay.innerText = '--';
    
    gameArea.innerHTML = '';
    gameArea.classList.add('active');
    startBtn.style.display = 'none';
    modal.style.display = 'none';

    startGameTimer();
    spawnWasteItem();
    spawnInterval = setInterval(spawnWasteItem, game.spawnRate);
}

function startGameTimer() {
    gameTimerInterval = setInterval(() => {
        game.timeLeft--;
        timerDisplay.innerText = game.timeLeft + 's';

        if (game.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function spawnWasteItem() {
    if (!game.isPlaying) return;

    const categories = ['recycle', 'compost', 'trash'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const itemData = wasteDatabase[category][Math.floor(Math.random() * wasteDatabase[category].length)];

    const itemEl = document.createElement('div');
    itemEl.classList.add('waste-item');
    itemEl.innerText = itemData.icon;
    itemEl.setAttribute('draggable', true);
    itemEl.dataset.category = category;

    const maxLeft = Math.max(gameArea.clientWidth - 60, 0);
    itemEl.style.left = Math.random() * maxLeft + 'px';
    itemEl.style.top = '-60px';

    itemEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('category', category);
        itemEl.classList.add('dragging');
    });

    itemEl.addEventListener('dragend', () => {
        itemEl.classList.remove('dragging');
    });

    itemEl.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!game.isPlaying) return;
        activeTouchItem = itemEl;
        itemEl.classList.add('dragging');
    });

    itemEl.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!activeTouchItem) return;
        const touch = e.touches[0];
        const rect = gameArea.getBoundingClientRect();
        const x = touch.clientX - rect.left - 30;
        const y = touch.clientY - rect.top - 30;
        itemEl.style.left = Math.max(0, Math.min(x, rect.width - 60)) + 'px';
        itemEl.style.top = Math.max(0, Math.min(y, rect.height - 60)) + 'px';
    });

    itemEl.addEventListener('touchend', (e) => {
        if (!activeTouchItem) return;
        const touch = e.changedTouches[0];
        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const bin = elemBelow ? elemBelow.closest('.bin') : null;
        if (bin) {
            checkAnswer(bin, category, itemEl);
        } else {
            itemEl.classList.remove('dragging');
        }
        activeTouchItem = null;
    });

    gameArea.appendChild(itemEl);
    animateFall(itemEl);
}

function animateFall(itemEl) {
    let position = -60;
    const fallSpeed = 2 + Math.random() * 2;
    let isRemoved = false;

    const fallInterval = setInterval(() => {
        if (!game.isPlaying) {
            clearInterval(fallInterval);
            return;
        }

        if (!itemEl.classList.contains('dragging')) {
            position += fallSpeed;
            itemEl.style.top = position + 'px';
        }

        if (position > gameArea.clientHeight) {
            clearInterval(fallInterval);
            if (!isRemoved && gameArea.contains(itemEl)) {
                isRemoved = true;
                game.totalAttempts++;
                game.score = Math.max(0, game.score - 3);
                game.currentCombo = 0;
                updateDisplay();
                itemEl.remove();
            }
        }
    }, 30);

    itemEl.dataset.interval = fallInterval;
}

bins.forEach(bin => {
    bin.addEventListener('dragover', (e) => {
        e.preventDefault();
        bin.classList.add('hovered');
    });

    bin.addEventListener('dragleave', () => {
        bin.classList.remove('hovered');
    });

    bin.addEventListener('drop', (e) => {
        e.preventDefault();
        bin.classList.remove('hovered');

        const itemCategory = e.dataTransfer.getData('category');
        const draggedItem = document.querySelector('.waste-item.dragging');

        if (draggedItem) {
            checkAnswer(bin, itemCategory, draggedItem);
        }
    });
});

function checkAnswer(bin, itemCategory, itemEl) {
    const binType = bin.dataset.type;
    game.totalAttempts++;

    const isCorrect = itemCategory === binType;

    if (isCorrect) {
        const points = 10 + (game.currentCombo * 5);
        game.score += points;
        game.correctAttempts++;
        game.currentCombo++;
        showFeedback(itemEl, `+${points}`, 'correct');
    } else {
        game.score = Math.max(0, game.score - 5);
        game.currentCombo = 0;
        showFeedback(itemEl, '-5', 'incorrect');
    }

    if (pointSound) {
        pointSound.currentTime = 0; 
        pointSound.play();
    }

    updateDisplay();
    
    const interval = itemEl.dataset.interval;
    if (interval) clearInterval(parseInt(interval));
    itemEl.remove();
}

function showFeedback(element, text, type) {
    const feedback = document.createElement('div');
    feedback.classList.add('feedback', type);
    feedback.innerText = text;

    const rect = element.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();

    feedback.style.left = (rect.left - gameRect.left + 20) + 'px';
    feedback.style.top = (rect.top - gameRect.top + 20) + 'px';

    gameArea.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
}

function updateDisplay() {
    scoreDisplay.innerText = game.score;
    
    if (game.totalAttempts > 0) {
        const accuracy = Math.round((game.correctAttempts / game.totalAttempts) * 100);
        accuracyDisplay.innerText = accuracy + '%';
    } else {
        accuracyDisplay.innerText = '--';
    }
}

function endGame() {
    game.isPlaying = false;
    clearInterval(gameTimerInterval);
    clearInterval(spawnInterval);
    gameArea.classList.remove('active');

    document.querySelectorAll('.waste-item').forEach(el => {
        const interval = el.dataset.interval;
        if (interval) clearInterval(parseInt(interval));
        el.remove();
    });

    finalScoreEl.innerText = game.score;
    finalScoreText.innerText = game.score;
    modal.style.display = 'flex';

    startBtn.style.display = 'block';
}

// Back Button Functionality
document.getElementById('backBtn').addEventListener('click', () => {
    if (game.isPlaying) {
        // Simple and effective browser confirmation
        const quit = confirm("Do you want to quit the game? Your current score will be lost!");
        if (quit) {
            window.location.href = "../index.html"; // Home page ka sahi path
        }
    } else {
        window.location.href = "../index.html";
    }
});