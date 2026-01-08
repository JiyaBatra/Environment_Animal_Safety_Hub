const treesContainer = document.querySelector('.trees');
const leavesContainer = document.querySelector('.leaves');
const result = document.querySelector('.result');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const gameOverSound = document.getElementById('game-over-sound');
const timerEl = document.getElementById('timer');

// List of trees and their emoji leaves
const treesData = [
  {name: "Oak", emoji: "🌳"},
  {name: "Maple", emoji: "🍁"},
  {name: "Palm", emoji: "🌴"},
  {name: "Pine", emoji: "🌲"},
  {name: "Cherry", emoji: "🌸"},
  {name: "Baobab", emoji: "🪵"},
  {name: "Coconut", emoji: "🥥"},
  {name: "Willow", emoji: "🌿"},
  {name: "Fir", emoji: "🎄"},
  {name: "Mango", emoji: "🥭"},
  {name: "Apple", emoji: "🍎"},
  {name: "Banana", emoji: "🍌"},
  {name: "Birch", emoji: "🌳"},
  {name: "Cedar", emoji: "🌲"},
  {name: "Elm", emoji: "🌿"},
  {name: "Holly", emoji: "🎄"},
  {name: "Spruce", emoji: "🎄"},
  {name: "Ash", emoji: "🌿"},
  {name: "Beech", emoji: "🌳"},
  {name: "Chestnut", emoji: "🌰"},
  {name: "Fig", emoji: "🌱"},
  {name: "Ginkgo", emoji: "🍃"},
  {name: "Hazel", emoji: "🌰"},
  {name: "Linden", emoji: "🌿"},
  {name: "Magnolia", emoji: "🌼"},
  {name: "Olive", emoji: "🫒"},
  {name: "Pear", emoji: "🍐"},
  {name: "Plum", emoji: "🍑"},
  {name: "Walnut", emoji: "🌰"},
  {name: "Redwood", emoji: "🌲"},
  {name: "Sequoia", emoji: "🌲"},
  {name: "Dogwood", emoji: "🌸"},
  {name: "Jacaranda", emoji: "💜"},
  {name: "Banyan", emoji: "🌳"},
  {name: "Teak", emoji: "🪵"},
  {name: "Acacia", emoji: "🌿"},
  {name: "Eucalyptus", emoji: "🌿"},
  {name: "Kapok", emoji: "🌳"},
  {name: "Date Palm", emoji: "🌴"},
  {name: "Cypress", emoji: "🌲"},
  {name: "Aspen", emoji: "🍃"},
  {name: "Sycamore", emoji: "🌿"},
];

// Game state
let currentTrees = [];
let currentLeaves = [];
let draggedLeaf = null;
let timer;
let timeLeft = 90;

// Initialize game
function initGame() {
  result.textContent = "";
  treesContainer.innerHTML = "";
  leavesContainer.innerHTML = "";
  clearInterval(timer);
  timeLeft = 90; 
  startTimer();

  currentTrees = shuffleArray(treesData).slice(0, 5);
  currentLeaves = shuffleArray([...currentTrees]);

  // Render tree cards
  currentTrees.forEach(tree => {
    const div = document.createElement('div');
    div.classList.add('tree');
    div.setAttribute('data-tree', tree.name);
    div.textContent = tree.name;
    div.addEventListener('dragover', dragOver);
    div.addEventListener('drop', dropLeaf);
    treesContainer.appendChild(div);
  });

  // Render leaves
  currentLeaves.forEach(leaf => {
    const div = document.createElement('div');
    div.classList.add('leaf');
    div.setAttribute('draggable', true);
    div.setAttribute('data-tree', leaf.name);
    div.textContent = leaf.emoji;
    div.addEventListener('dragstart', dragStart);
    leavesContainer.appendChild(div);
  });
}

// Timer
function startTimer() {
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGameTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `⏰ ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function dragStart(e) {
  draggedLeaf = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dropLeaf(e) {
  const tree = e.target;
  const treeName = tree.getAttribute('data-tree');
  const leafName = draggedLeaf.getAttribute('data-tree');

  if(treeName === leafName) {
    tree.classList.add('correct');
    correctSound.play();
    createCelebration(tree);
    createCelebration(draggedLeaf);
    draggedLeaf.remove();
    checkGameCompletion();
  } else {
    tree.classList.add('incorrect');
    wrongSound.play();
    setTimeout(() => tree.classList.remove('incorrect'), 800);
  }
}

// Check if all leaves matched
function checkGameCompletion() {
  if(document.querySelectorAll('.leaf').length === 0) {
    clearInterval(timer);
    treesContainer.innerHTML = "";
    leavesContainer.innerHTML = "";
    result.innerHTML = `
      🎉 Congratulations! You matched all the trees! <br>
      <div class = "btn-group">
        <button class="reset-btn" onclick="initGame()">Play Again</button>
        <button class="exit-btn" onclick="exitGame()">Exit</button>
      </div>
    `;
    correctSound.play();
  }
}

// End game on timeout
function endGameTimeout() {
  treesContainer.innerHTML = "";
  leavesContainer.innerHTML = "";
  result.innerHTML = `
    ⏰ Time's up! Don't worry, you can try again! <br>
    <div class = "btn-group">
        <button class="reset-btn" onclick="initGame()">Play Again</button>
        <button class="exit-btn" onclick="exitGame()">Exit</button>
    </div>
  `;
  gameOverSound.play();
}

// Glitter/Celebration Effect
function createCelebration(element) {
  const emojis = ["🎉", "✨", "🌟", "💚", "🍀"];
  for (let i = 0; i < 5; i++) {
    const span = document.createElement('span');
    span.classList.add('celebration');
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const rect = element.getBoundingClientRect();
    span.style.left = rect.left + window.scrollX + Math.random() * rect.width + "px";
    span.style.top = rect.top + window.scrollY + Math.random() * rect.height + "px";

    document.body.appendChild(span);

    setTimeout(() => {
      span.remove();
    }, 1000);
  }
}

// Exit game function
function exitGame() {
  history.back();
}


// Utility: shuffle array randomly
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Initialize game on load
initGame();
