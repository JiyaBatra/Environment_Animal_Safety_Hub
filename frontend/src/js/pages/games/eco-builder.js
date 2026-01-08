// Game State
const gameState = {
    screen: 'intro',
    score: 0,
    bioStability: 100,
    threatLevel: 0,
    time: 0,
    entities: [],
    selectedAsset: null,
    gameLoop: null,
    isRunning: false,
    plantsCount: 0,
    herbivoresCount: 0,
    predatorsCount: 0,
    waterCount: 0
};

// Asset configurations
const assetConfig = {
    plant: { 
        cost: 10,
        icons: ['🌱', '🌿', '🌳', '🌲', '🌴', '🪴']
    },
    herbivore: { 
        cost: 20,
        icons: ['🐰', '🦌', '🐿️', '🦫']
    },
    predator: { 
        cost: 30,
        icons: ['🦊', '🐺', '🦅', '🐆']
    },
    water: { 
        cost: 15,
        icons: ['💧', '💦', '🌊']
    }
};

// DOM Elements
const screens = {
    intro: document.getElementById('introScreen'),
    game: document.getElementById('gameScreen'),
    gameOver: document.getElementById('gameOverScreen'),
    victory: document.getElementById('victoryScreen')
};

const elements = {
    startBtn: document.getElementById('startBtn'),
    instructionsBtn: document.getElementById('instructionsBtn'),
    instructionsModal: document.getElementById('instructionsModal'),
    closeModal: document.querySelector('.close'),
    backBtn: document.getElementById('backBtn'),
    resetBtn: document.getElementById('resetBtn'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    mainMenuBtn: document.getElementById('mainMenuBtn'),
    playAgainVictoryBtn: document.getElementById('playAgainVictoryBtn'),
    mainMenuVictoryBtn: document.getElementById('mainMenuVictoryBtn'),
    bioProgress: document.getElementById('bioProgress'),
    threatProgress: document.getElementById('threatProgress'),
    pointsProgress: document.getElementById('pointsProgress'),
    bioValue: document.getElementById('bioValue'),
    threatValue: document.getElementById('threatValue'),
    pointsValue: document.getElementById('pointsValue'),
    ecosystemStatus: document.getElementById('ecosystemStatus'),
    timeValue: document.getElementById('timeValue'),
    plantsCount: document.getElementById('plantsCount'),
    herbivoresCount: document.getElementById('herbivoresCount'),
    predatorsCount: document.getElementById('predatorsCount'),
    waterCount: document.getElementById('waterCount'),
    gameCanvas: document.getElementById('gameCanvas'),
    forestCanvas: document.getElementById('forestCanvas'),
    entitiesLayer: document.getElementById('entitiesLayer'),
    particlesLayer: document.getElementById('particlesLayer'),
    bioAssetsList: document.getElementById('bioAssetsList'),
    finalScore: document.getElementById('finalScore'),
    victoryScore: document.getElementById('victoryScore'),
    finalMessage: document.getElementById('finalMessage'),
    pointsReqValue: document.getElementById('pointsReqValue'),
    bioReqValue: document.getElementById('bioReqValue'),
    threatReqValue: document.getElementById('threatReqValue'),
    pointsStatus: document.getElementById('pointsStatus'),
    bioStatus: document.getElementById('bioStatus'),
    threatStatus: document.getElementById('threatStatus'),
    balanceFill: document.getElementById('balanceFill'),
    balanceText: document.getElementById('balanceText'),
    pointsReq: document.getElementById('pointsReq'),
    bioReq: document.getElementById('bioReq'),
    threatReq: document.getElementById('threatReq'),
    canvasHint: document.getElementById('canvasHint')
};

// Initialize
function init() {
    setupEventListeners();
    setupCanvas();
    drawForestBackground();
    console.log('Game initialized!');
}

// Event Listeners
function setupEventListeners() {
    // Button clicks
    elements.startBtn.addEventListener('click', () => {
        console.log('Start button clicked!');
        startGame();
    });
    
    elements.instructionsBtn.addEventListener('click', () => {
        console.log('Instructions button clicked!');
        elements.instructionsModal.classList.add('active');
    });
    
    elements.closeModal.addEventListener('click', () => {
        elements.instructionsModal.classList.remove('active');
    });
    
    elements.backBtn.addEventListener('click', () => {
        console.log('Back button clicked!');
        switchScreen('intro');
    });
    
    elements.resetBtn.addEventListener('click', () => {
        console.log('Reset button clicked!');
        resetGame();
    });
    
    elements.playAgainBtn.addEventListener('click', () => {
        console.log('Play again button clicked!');
        startGame();
    });
    
    elements.mainMenuBtn.addEventListener('click', () => {
        switchScreen('intro');
    });
    
    elements.playAgainVictoryBtn.addEventListener('click', () => {
        startGame();
    });
    
    elements.mainMenuVictoryBtn.addEventListener('click', () => {
        switchScreen('intro');
    });
    
    // Asset selection - THE KEY FIX!
    const assetItems = document.querySelectorAll('.asset-item');
    assetItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Asset clicked:', item.dataset.type);
            
            // Remove selection from all items
            assetItems.forEach(i => i.classList.remove('selected'));
            
            // Add selection to clicked item
            item.classList.add('selected');
            
            // Store selected asset
            gameState.selectedAsset = item.dataset.type;
            
            // Update canvas cursor
            elements.gameCanvas.classList.add('placing');
            
            // Show hint
            if (elements.canvasHint) {
                elements.canvasHint.textContent = `Click on canvas to place ${item.dataset.type} (Cost: ${item.dataset.cost} points)`;
                elements.canvasHint.classList.remove('hidden');
            }
            
            console.log('Selected asset:', gameState.selectedAsset);
        });
    });
    
    // Canvas click - THE MAIN FIX!
    elements.gameCanvas.addEventListener('click', (e) => {
        console.log('Canvas clicked!', {
            selectedAsset: gameState.selectedAsset,
            isRunning: gameState.isRunning,
            score: gameState.score
        });
        handleCanvasClick(e);
    });
    
    // Modal click outside
    elements.instructionsModal.addEventListener('click', (e) => {
        if (e.target === elements.instructionsModal) {
            elements.instructionsModal.classList.remove('active');
        }
    });
    
    console.log('Event listeners set up!');
}

// Screen Management
function switchScreen(screenName) {
    console.log('Switching to screen:', screenName);
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
    gameState.screen = screenName;
    
    if (screenName === 'intro') {
        stopGameLoop();
    }
}

// Canvas Setup
function setupCanvas() {
    const canvas = elements.forestCanvas;
    const container = elements.gameCanvas;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawForestBackground();
    });
}

// Draw Forest Background
function drawForestBackground() {
    const canvas = elements.forestCanvas;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a1628');
    gradient.addColorStop(0.5, '#1a3a52');
    gradient.addColorStop(1, '#2d5a3f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.4;
        const radius = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Ground
    ctx.fillStyle = 'rgba(45, 90, 63, 0.6)';
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2);
    
    // Grass
    ctx.strokeStyle = 'rgba(80, 150, 100, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 10) {
        const height = Math.random() * 30 + 10;
        ctx.beginPath();
        ctx.moveTo(i, canvas.height * 0.8);
        ctx.lineTo(i, canvas.height * 0.8 - height);
        ctx.stroke();
    }
    
    // Tree silhouettes
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const height = Math.random() * 150 + 100;
        ctx.fillStyle = 'rgba(20, 40, 30, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x - 30, canvas.height - height * 0.3);
        ctx.lineTo(x - 20, canvas.height - height * 0.6);
        ctx.lineTo(x - 30, canvas.height - height * 0.6);
        ctx.lineTo(x, canvas.height - height);
        ctx.lineTo(x + 30, canvas.height - height * 0.6);
        ctx.lineTo(x + 20, canvas.height - height * 0.6);
        ctx.lineTo(x + 30, canvas.height - height * 0.3);
        ctx.closePath();
        ctx.fill();
    }
}

// Start Game
function startGame() {
    console.log('Starting game...');
    
    gameState.score = 30;
    gameState.bioStability = 100;
    gameState.threatLevel = 0;
    gameState.time = 0;
    gameState.entities = [];
    gameState.selectedAsset = null;
    gameState.isRunning = true;
    gameState.plantsCount = 0;
    gameState.herbivoresCount = 0;
    gameState.predatorsCount = 0;
    gameState.waterCount = 0;
    
    elements.entitiesLayer.innerHTML = '';
    elements.particlesLayer.innerHTML = '';
    
    document.querySelectorAll('.asset-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    elements.gameCanvas.classList.remove('placing');
    
    switchScreen('game');
    updateUI();
    startGameLoop();
    
    console.log('Game started!');
}

// Reset Game
function resetGame() {
    stopGameLoop();
    startGame();
}

// Calculate Ecosystem Balance (0-100 scale)
function calculateEcosystemBalance() {
    const total = gameState.plantsCount + gameState.herbivoresCount + 
                  gameState.predatorsCount + gameState.waterCount;
    
    if (total === 0) return 0;
    
    const plantRatio = gameState.plantsCount / total;
    const herbivoreRatio = gameState.herbivoresCount / total;
    const predatorRatio = gameState.predatorsCount / total;
    const waterRatio = gameState.waterCount / total;
    
    const idealPlant = 0.4;
    const idealHerbivore = 0.3;
    const idealPredator = 0.2;
    const idealWater = 0.1;
    
    const deviation = 
        Math.abs(plantRatio - idealPlant) +
        Math.abs(herbivoreRatio - idealHerbivore) +
        Math.abs(predatorRatio - idealPredator) +
        Math.abs(waterRatio - idealWater);
    
    let balance = Math.max(0, 100 - (deviation * 50));
    
    if (total > 0 && gameState.plantsCount === total) {
        balance = Math.min(balance, 30);
    }
    if (total > 0 && gameState.herbivoresCount === total) {
        balance = Math.min(balance, 20);
    }
    if (total > 0 && gameState.predatorsCount === total) {
        balance = Math.min(balance, 15);
    }
    
    if (gameState.herbivoresCount > 0 && gameState.plantsCount === 0) {
        balance *= 0.3;
    }
    if (gameState.predatorsCount > 0 && gameState.herbivoresCount === 0) {
        balance *= 0.3;
    }
    
    const diversity = [
        gameState.plantsCount > 0 ? 1 : 0,
        gameState.herbivoresCount > 0 ? 1 : 0,
        gameState.predatorsCount > 0 ? 1 : 0,
        gameState.waterCount > 0 ? 1 : 0
    ].reduce((a, b) => a + b, 0);
    
    if (diversity >= 3) {
        balance = Math.min(100, balance * 1.3);
    } else if (diversity === 2) {
        balance = Math.min(100, balance * 1.1);
    }
    
    return Math.max(0, Math.min(100, balance));
}

// Game Loop
function startGameLoop() {
    gameState.gameLoop = setInterval(() => {
        if (!gameState.isRunning) return;
        
        gameState.time++;
        
        const balance = calculateEcosystemBalance();
        
        if (gameState.time % 10 === 0) {
            if (balance >= 50) {
                const pointsGain = Math.floor(balance / 10);
                gameState.score += pointsGain;
            }
        }
        
        if (balance >= 70) {
            gameState.bioStability = Math.min(100, gameState.bioStability + 0.2);
        } else if (balance >= 40) {
            gameState.bioStability = Math.max(0, gameState.bioStability - 0.05);
        } else {
            gameState.bioStability = Math.max(0, gameState.bioStability - 0.3);
        }
        
        if (balance >= 70) {
            gameState.threatLevel = Math.max(0, gameState.threatLevel - 0.2);
        } else if (balance >= 40) {
            gameState.threatLevel = Math.min(100, gameState.threatLevel + 0.05);
        } else {
            gameState.threatLevel = Math.min(100, gameState.threatLevel + 0.3);
        }
        
        gameState.entities.forEach(entity => {
            if (entity.type === 'herbivore' || entity.type === 'predator') {
                const entityEl = document.getElementById(entity.id);
                if (entityEl) {
                    const currentLeft = parseFloat(entityEl.style.left) || entity.x;
                    const currentTop = parseFloat(entityEl.style.top) || entity.y;
                    
                    const newLeft = currentLeft + (Math.random() - 0.5) * 0.8;
                    const newTop = currentTop + (Math.random() - 0.5) * 0.8;
                    
                    const boundedLeft = Math.max(5, Math.min(95, newLeft));
                    const boundedTop = Math.max(20, Math.min(90, newTop));
                    
                    entityEl.style.left = boundedLeft + '%';
                    entityEl.style.top = boundedTop + '%';
                }
            }
        });
        
        updateUI();
        checkGameConditions();
    }, 100);
}

function stopGameLoop() {
    if (gameState.gameLoop) {
        clearInterval(gameState.gameLoop);
        gameState.gameLoop = null;
    }
    gameState.isRunning = false;
}

// Handle Canvas Click - FIXED VERSION!
function handleCanvasClick(e) {
    console.log('handleCanvasClick called', {
        selectedAsset: gameState.selectedAsset,
        isRunning: gameState.isRunning,
        targetId: e.target.id,
        targetClass: e.target.className
    });
    
    // Don't place if clicking on an entity
    if (e.target.classList.contains('entity')) {
        console.log('Clicked on entity, ignoring');
        return;
    }
    
    // Check if asset is selected and game is running
    if (!gameState.selectedAsset) {
        console.log('No asset selected!');
        alert('Please select a bio-asset from the left sidebar first!');
        return;
    }
    
    if (!gameState.isRunning) {
        console.log('Game not running!');
        return;
    }
    
    const config = assetConfig[gameState.selectedAsset];
    
    // Check if enough points
    if (gameState.score < config.cost) {
        console.log('Not enough points!', gameState.score, '<', config.cost);
        alert(`Not enough points! You need ${config.cost} points but only have ${gameState.score}. Keep ecosystem balanced to earn more.`);
        return;
    }
    
    // Get click position relative to canvas
    const rect = elements.gameCanvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    console.log('Placing entity at:', x, y);
    
    // Deduct cost
    gameState.score -= config.cost;
    
    // Create entity
    const entity = {
        id: `entity-${Date.now()}-${Math.random()}`,
        type: gameState.selectedAsset,
        x: x,
        y: y,
        icon: config.icons[Math.floor(Math.random() * config.icons.length)]
    };
    
    gameState.entities.push(entity);
    
    // Update counts
    switch(gameState.selectedAsset) {
        case 'plant': gameState.plantsCount++; break;
        case 'herbivore': gameState.herbivoresCount++; break;
        case 'predator': gameState.predatorsCount++; break;
        case 'water': gameState.waterCount++; break;
    }
    
    console.log('Entity created:', entity);
    console.log('New counts:', {
        plants: gameState.plantsCount,
        herbivores: gameState.herbivoresCount,
        predators: gameState.predatorsCount,
        water: gameState.waterCount
    });
    
    createEntityElement(entity);
    createParticles(x, y);
    updateUI();
    
    // Hide hint after first placement
    if (elements.canvasHint && gameState.entities.length === 1) {
        setTimeout(() => {
            elements.canvasHint.classList.add('hidden');
        }, 2000);
    }
}

// Create Entity Element
function createEntityElement(entity) {
    const entityEl = document.createElement('div');
    entityEl.className = 'entity';
    entityEl.id = entity.id;
    entityEl.textContent = entity.icon;
    entityEl.style.left = entity.x + '%';
    entityEl.style.top = entity.y + '%';
    entityEl.style.animationDelay = Math.random() + 's';
    
    elements.entitiesLayer.appendChild(entityEl);
    console.log('Entity element created and added to DOM');
}

// Create Particles
function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.animationDelay = (i * 0.1) + 's';
        
        elements.particlesLayer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

// Update UI
function updateUI() {
    elements.bioProgress.style.width = gameState.bioStability + '%';
    elements.bioValue.textContent = Math.round(gameState.bioStability) + '%';
    
    elements.threatProgress.style.width = gameState.threatLevel + '%';
    elements.threatValue.textContent = Math.round(gameState.threatLevel) + '%';
    
    const pointsProgress = Math.min(100, (gameState.score / 500) * 100);
    elements.pointsProgress.style.width = pointsProgress + '%';
    elements.pointsValue.textContent = Math.round(gameState.score);
    
    elements.timeValue.textContent = Math.floor(gameState.time / 10) + 's';
    
    elements.plantsCount.textContent = gameState.plantsCount;
    elements.herbivoresCount.textContent = gameState.herbivoresCount;
    elements.predatorsCount.textContent = gameState.predatorsCount;
    elements.waterCount.textContent = gameState.waterCount;
    
    const balance = calculateEcosystemBalance();
    elements.balanceFill.style.width = balance + '%';
    elements.balanceText.textContent = Math.round(balance) + '% Balanced';
    
    let statusText = 'Ecosystem Empty';
    let stars = '⭐';
    
    if (balance >= 80) {
        statusText = 'Ecosystem Thriving';
        stars = '⭐⭐⭐';
    } else if (balance >= 60) {
        statusText = 'Ecosystem Balanced';
        stars = '⭐⭐';
    } else if (balance >= 40) {
        statusText = 'Ecosystem Struggling';
        stars = '⭐';
    } else if (balance >= 20) {
        statusText = 'Ecosystem Unstable';
        stars = '❌';
    } else if (gameState.entities.length > 0) {
        statusText = 'Ecosystem Collapsing';
        stars = '💀';
    }
    
    elements.ecosystemStatus.innerHTML = `
        <span class="status-number">${Math.round(balance)}</span>
        <span class="status-text">${statusText}</span>
        <span class="status-stars">${stars}</span>
    `;
    
    const pointsAchieved = gameState.score >= 500;
    const bioAchieved = gameState.bioStability >= 70;
    const threatAchieved = gameState.threatLevel <= 30;
    
    elements.pointsReqValue.textContent = `${Math.round(gameState.score)} / 500`;
    elements.pointsStatus.textContent = pointsAchieved ? '✅' : '❌';
    elements.pointsReq.className = pointsAchieved ? 'win-requirement achieved' : 'win-requirement';
    
    elements.bioReqValue.textContent = `${Math.round(gameState.bioStability)}% / 70%`;
    elements.bioStatus.textContent = bioAchieved ? '✅' : '❌';
    elements.bioReq.className = bioAchieved ? 'win-requirement achieved' : 'win-requirement';
    
    elements.threatReqValue.textContent = `${Math.round(gameState.threatLevel)}% / 30%`;
    elements.threatStatus.textContent = threatAchieved ? '✅' : '❌';
    elements.threatReq.className = threatAchieved ? 'win-requirement achieved' : 'win-requirement';
}

// Check Game Conditions
function checkGameConditions() {
    if (gameState.score >= 500 && 
        gameState.bioStability >= 70 && 
        gameState.threatLevel <= 30) {
        endGame('victory');
    }
    
    if (gameState.bioStability <= 0) {
        endGame('gameOver', 'Bio-stability collapsed to zero!');
    }
    
    if (gameState.threatLevel >= 100) {
        endGame('gameOver', 'Threat level exceeded critical point!');
    }
}

// End Game
function endGame(screenName, message = '') {
    stopGameLoop();
    
    if (screenName === 'victory') {
        elements.victoryScore.textContent = Math.round(gameState.score);
    } else {
        elements.finalScore.textContent = Math.round(gameState.score);
        if (message) {
            elements.finalMessage.textContent = message;
        }
    }
    
    setTimeout(() => {
        switchScreen(screenName);
    }, 500);
}

// Initialize on load
window.addEventListener('load', () => {
    console.log('Window loaded, initializing...');
    init();
});