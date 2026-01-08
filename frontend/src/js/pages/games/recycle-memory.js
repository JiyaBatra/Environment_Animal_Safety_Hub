/**
 * ECO-MEMORY: EDUCATIONAL ENGINE
 * Features: Randomized Pools, 8-Match Cap, and Learning Facts
 */

const ecoData = [
    { emoji: '🌱', fact: "A single tree can absorb 48 pounds of CO2 per year!" },
    { emoji: '♻️', fact: "Recycling one aluminum can saves enough energy to run a TV for 3 hours." },
    { emoji: '🔋', fact: "Batteries contain heavy metals; always recycle them at special points!" },
    { emoji: '🌍', fact: "Earth's oceans provide 50% of our planet's oxygen." },
    { emoji: '🥤', fact: "Plastic takes up to 450 years to decompose in a landfill." },
    { emoji: '🌳', fact: "Forests are home to over 80% of terrestrial biodiversity." },
    { emoji: '📦', fact: "Recycling paper saves 70% less energy than making it from raw wood." },
    { emoji: '💡', fact: "LED bulbs use 75% less energy than traditional ones." },
    { emoji: '👕', fact: "It takes 2,700 liters of water to make just one cotton t-shirt." },
    { emoji: '🚲', fact: "Cycling instead of driving saves 150g of CO2 per kilometer." },
    { emoji: '💧', fact: "Only 1% of the world's water is fresh and accessible for us to drink." },
    { emoji: '🐝', fact: "Bees pollinate 1/3 of the food we eat every day!" },
    { emoji: '🐢', fact: "Sea turtles often mistake plastic bags for jellyfish food." },
    { emoji: '☀️', fact: "The sun provides more energy in one hour than the world uses in a year." },
    { emoji: '🐋', fact: "Blue whales can eat up to 4 tons of krill daily!" }
];

let flippedCards = [];
let matchedCount = 0;
let flips = 0;
let seconds = 0;
let timerInterval;
let isLocked = false;

function initGame() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    
    // Pick 8 random pairs from the larger pool of 15 for variety
    const selectedData = [...ecoData].sort(() => Math.random() - 0.5).slice(0, 8);
    const gameItems = [...selectedData, ...selectedData].sort(() => Math.random() - 0.5);

    gameItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back"></div>
                <div class="card-face card-front">${item.emoji}</div>
            </div>`;
        card.dataset.emoji = item.emoji;
        card.dataset.fact = item.fact;
        card.addEventListener('click', () => handleFlip(card));
        board.appendChild(card);
    });
}

function handleFlip(card) {
    if (isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (!timerInterval) startTimer();

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        flips++;
        document.getElementById('flips').textContent = flips;
        isLocked = true;
        checkMatch();
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.emoji === c2.dataset.emoji) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        document.getElementById('matchSound').play();
        
        // Show the Fun Fact
        document.getElementById('factText').textContent = c1.dataset.fact;
        
        matchedCount++;
        document.getElementById('matches').textContent = matchedCount;
        flippedCards = [];
        isLocked = false;
        if (matchedCount === 8) {
            setTimeout(endGame, 500);
        }
    } else {
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            flippedCards = [];
            isLocked = false;
        }, 800);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = seconds;
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);

    const modal = document.getElementById('gameOverModal');
    const finalTime = document.getElementById('finalTime');
    const finalFlips = document.getElementById('finalFlips'); // Ensure this ID exists in HTML

    if (finalTime) finalTime.textContent = seconds;
    if (finalFlips) finalFlips.textContent = flips;

    if (modal) {
        modal.classList.add('active');
    }
}

document.getElementById('resetBtn').addEventListener('click', () => location.reload());
document.getElementById('modalResetBtn').addEventListener('click', () => location.reload());

initGame();