const wasteItems = [
    { id: 'plastic-bottle', icon: '🥤', type: 'recycle' },
    { id: 'glass-jar', icon: '🫙', type: 'recycle' },
    { id: 'paper', icon: '📰', type: 'recycle' },
    { id: 'banana', icon: '🍌', type: 'compost' },
    { id: 'apple', icon: '🍎', type: 'compost' },
    { id: 'leaves', icon: '🍂', type: 'compost' },
    { id: 'chips', icon: '🥡', type: 'trash' },
    { id: 'battery', icon: '🔋', type: 'trash' }, // Special handling usually, but 'trash' for simple game
];

let score = 0;
let timeLeft = 60;
let gameInterval;
let spawnInterval;
let isPlaying = false;

const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const modal = document.getElementById('gameOverModal');
const finalScoreEl = document.getElementById('finalScore');
const bins = document.querySelectorAll('.bin');

document.getElementById('startGameBtn').addEventListener('click', startGame);

function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    score = 0;
    timeLeft = 60;
    scoreEl.innerText = score;
    timerEl.innerText = timeLeft + 's';
    modal.style.display = 'none';
    document.getElementById('startGameBtn').style.display = 'none';
    
    gameArea.innerHTML = ''; // Clear area

    // Timer
    gameInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft + 's';
        if (timeLeft <= 0) endGame();
    }, 1000);

    // Spawn items
    spawnItem();
    spawnInterval = setInterval(spawnItem, 2000); // New item every 2 seconds
}

function spawnItem() {
    if (!isPlaying) return;

    const itemData = wasteItems[Math.floor(Math.random() * wasteItems.length)];
    const item = document.createElement('div');
    item.classList.add('waste-item');
    item.innerText = itemData.icon;
    item.setAttribute('draggable', 'true');
    item.dataset.type = itemData.type;

    // Random horizontal position
    const maxLeft = gameArea.clientWidth - 60;
    item.style.left = Math.floor(Math.random() * maxLeft) + 'px';
    item.style.top = '0px';

    // Drag Events
    item.addEventListener('dragstart', dragStart);
    
    // Touch Events for Mobile
    item.addEventListener('touchstart', touchStart, {passive: false});
    item.addEventListener('touchmove', touchMove, {passive: false});
    item.addEventListener('touchend', touchEnd);

    gameArea.appendChild(item);

    // Falling Animation
    let top = 0;
    const fallInterval = setInterval(() => {
        if (!isPlaying) { clearInterval(fallInterval); return; }
        
        // Stop falling if being dragged
        if (!item.classList.contains('dragging')) {
            top += 2; // Speed
            item.style.top = top + 'px';
        }

        // Remove if hits bottom
        if (top > gameArea.clientHeight - 60) {
            clearInterval(fallInterval);
            if (gameArea.contains(item)) gameArea.removeChild(item);
        }
    }, 20);

    // Store interval on element to clear later if needed
    item.dataset.interval = fallInterval;
}

/* ===== DRAG & DROP LOGIC ===== */

function dragStart(e) {
    e.dataTransfer.setData('type', e.target.dataset.type);
    e.target.classList.add('dragging');
    setTimeout(() => (e.target.style.display = 'none'), 0); // Hide visual while dragging
}

// Bin Event Listeners
bins.forEach(bin => {
    bin.addEventListener('dragover', e => {
        e.preventDefault();
        bin.classList.add('hovered');
    });

    bin.addEventListener('dragleave', () => {
        bin.classList.remove('hovered');
    });

    bin.addEventListener('drop', e => {
        e.preventDefault();
        bin.classList.remove('hovered');
        const type = e.dataTransfer.getData('type');
        handleDrop(bin, type);
    });
});

function handleDrop(bin, itemType) {
    const binType = bin.dataset.type;
    const draggedItem = document.querySelector('.waste-item.dragging');
    
    if (draggedItem) {
        if (itemType === binType) {
            score += 10;
            showFeedback(bin, '+10', 'green');
        } else {
            score -= 5;
            showFeedback(bin, '-5', 'red');
        }
        scoreEl.innerText = score;
        draggedItem.remove(); // Remove item from DOM
    }
}

// Fallback if drop happens outside (item usually lost in this logic, which is fine)
gameArea.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    e.target.style.display = 'flex'; // Show again if missed
});

/* ===== TOUCH LOGIC (Mobile) ===== */
// Simplified touch logic for "drag" on mobile
let touchItem = null;

function touchStart(e) {
    e.preventDefault();
    touchItem = e.target;
    touchItem.classList.add('dragging');
}

function touchMove(e) {
    e.preventDefault();
    if (!touchItem) return;
    
    const touch = e.touches[0];
    const gameRect = gameArea.getBoundingClientRect();
    
    // Move item with finger
    touchItem.style.left = (touch.clientX - gameRect.left - 30) + 'px';
    touchItem.style.top = (touch.clientY - gameRect.top - 30) + 'px';
}

function touchEnd(e) {
    if (!touchItem) return;
    
    // Check if dropped on a bin
    const touch = e.changedTouches[0];
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const bin = elemBelow.closest('.bin');

    if (bin) {
        handleDrop(bin, touchItem.dataset.type);
    } else {
        touchItem.classList.remove('dragging');
    }
    touchItem = null;
}

function showFeedback(element, text, color) {
    const feedback = document.createElement('div');
    feedback.innerText = text;
    feedback.style.cssText = `
        position: absolute; 
        color: ${color}; 
        font-weight: bold; 
        font-size: 1.5rem; 
        pointer-events: none;
        animation: floatUp 1s ease-out;
    `;
    element.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    finalScoreEl.innerText = score;
    modal.style.display = 'flex';
}

// Add Float Animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes floatUp {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(-30px); opacity: 0; }
}`;
document.head.appendChild(style);