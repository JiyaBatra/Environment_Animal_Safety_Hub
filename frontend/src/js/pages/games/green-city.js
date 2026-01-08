// ===== GAME STATE =====
const gameState = {
    screen: 'intro',
    difficulty: 'medium',
    budget: 400,
    maxBudget: 400,
    energy: 0,
    carbon: 0,
    grid: [], // 5x5 2D array of tile objects
    selectedTile: null,
    tileCounts: {
        solar: 0,
        wind: 0,
        factory: 0,
        forest: 0,
        water: 0,
        park: 0
    }
};

// ===== TILE DEFINITIONS WITH ADJACENCY BONUSES =====
const tileTypes = {
    solar: {
        icon: '☀️',
        name: 'Solar Panel',
        cost: 50,
        baseEnergy: 15,
        baseCarbon: 2,
        adjacencyBonus: {
            water: { energyMultiplier: 1.2, description: '+20% energy near water' }
        }
    },
    wind: {
        icon: '💨',
        name: 'Wind Turbine',
        cost: 70,
        baseEnergy: 20,
        baseCarbon: 3,
        adjacencyBonus: {
            park: { energyMultiplier: 1.15, description: '+15% energy near parks' }
        }
    },
    factory: {
        icon: '🏭',
        name: 'Factory',
        cost: 60,
        baseEnergy: 40,
        baseCarbon: 30,
        adjacencyBonus: {
            forest: { carbonMultiplier: 0.9, description: '-10% carbon near forests' }
        }
    },
    forest: {
        icon: '🌳',
        name: 'Forest',
        cost: 40,
        baseEnergy: 0,
        baseCarbon: -15,
        adjacencyBonus: {}
    },
    water: {
        icon: '💧',
        name: 'Water Body',
        cost: 30,
        baseEnergy: 0,
        baseCarbon: -8,
        adjacencyBonus: {}
    },
    park: {
        icon: '🏞️',
        name: 'City Park',
        cost: 25,
        baseEnergy: 0,
        baseCarbon: -5,
        adjacencyBonus: {}
    }
};

// Difficulty settings
const difficultySettings = {
    easy: { budget: 500, carbonThreshold: 100, label: '🌱 Easy' },
    medium: { budget: 400, carbonThreshold: 80, label: '🏙️ Medium' },
    hard: { budget: 300, carbonThreshold: 50, label: '🌍 Hard' }
};

// ===== DOM ELEMENTS =====
const screens = {
    intro: document.getElementById('introScreen'),
    game: document.getElementById('gameScreen'),
    victory: document.getElementById('victoryScreen'),
    gameOver: document.getElementById('gameOverScreen')
};

const elements = {
    // Intro screen
    difficultyButtons: document.querySelectorAll('.btn-difficulty'),
    instructionsBtn: document.getElementById('instructionsBtn'),
    instructionsModal: document.getElementById('instructionsModal'),
    closeModal: document.querySelector('.close'),
    
    // Game screen
    backBtn: document.getElementById('backBtn'),
    resetBtn: document.getElementById('resetBtn'),
    difficultyBadge: document.getElementById('difficultyBadge'),
    
    // Meters
    energyValue: document.getElementById('energyValue'),
    energyFill: document.getElementById('energyFill'),
    carbonValue: document.getElementById('carbonValue'),
    carbonFill: document.getElementById('carbonFill'),
    budgetValue: document.getElementById('budgetValue'),
    budgetFill: document.getElementById('budgetFill'),
    
    // Grid
    cityGrid: document.getElementById('cityGrid'),
    selectedTile: document.getElementById('selectedTile'),
    gridUtil: document.getElementById('gridUtil'),
    
    // Tile shop
    tileItems: document.querySelectorAll('.tile-item'),
    
    // Analytics
    solarCount: document.getElementById('solarCount'),
    windCount: document.getElementById('windCount'),
    factoryCount: document.getElementById('factoryCount'),
    forestCount: document.getElementById('forestCount'),
    balanceMeter: document.getElementById('balanceMeter'),
    balanceText: document.getElementById('balanceText'),
    ecoRating: document.getElementById('ecoRating'),
    ratingDesc: document.getElementById('ratingDesc'),
    
    // Result screens
    finalEnergy: document.getElementById('finalEnergy'),
    finalCarbon: document.getElementById('finalCarbon'),
    finalBudget: document.getElementById('finalBudget'),
    finalRating: document.getElementById('finalRating'),
    gameOverEnergy: document.getElementById('gameOverEnergy'),
    gameOverCarbon: document.getElementById('gameOverCarbon'),
    gameOverBudget: document.getElementById('gameOverBudget'),
    gameOverReason: document.getElementById('gameOverReason'),
    
    // Buttons
    playAgainVictory: document.getElementById('playAgainVictory'),
    mainMenuVictory: document.getElementById('mainMenuVictory'),
    playAgainGameOver: document.getElementById('playAgainGameOver'),
    mainMenuGameOver: document.getElementById('mainMenuGameOver')
};

// ===== INITIALIZATION =====
function init() {
    setupEventListeners();
    initializeGrid();
}

function setupEventListeners() {
    // Difficulty selection
    elements.difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            gameState.difficulty = btn.dataset.difficulty;
            startGame();
        });
    });
    
    // Instructions modal
    elements.instructionsBtn.addEventListener('click', () => {
        elements.instructionsModal.classList.add('active');
    });
    
    elements.closeModal.addEventListener('click', () => {
        elements.instructionsModal.classList.remove('active');
    });
    
    elements.instructionsModal.addEventListener('click', (e) => {
        if (e.target === elements.instructionsModal) {
            elements.instructionsModal.classList.remove('active');
        }
    });
    
    // Navigation
    elements.backBtn.addEventListener('click', () => {
        window.location.href = './kids-zone.html';
    });
    
    elements.resetBtn.addEventListener('click', () => {
        startGame();
    });
    
    // Tile selection
    elements.tileItems.forEach(item => {
        item.addEventListener('click', () => {
            elements.tileItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            gameState.selectedTile = item.dataset.type;
            elements.selectedTile.textContent = tileTypes[gameState.selectedTile].name;
        });
    });
    
    // Result screen buttons
    elements.playAgainVictory.addEventListener('click', () => startGame());
    elements.mainMenuVictory.addEventListener('click', () => switchScreen('intro'));
    elements.playAgainGameOver.addEventListener('click', () => startGame());
    elements.mainMenuGameOver.addEventListener('click', () => switchScreen('intro'));
}

// ===== SCREEN MANAGEMENT =====
function switchScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
    gameState.screen = screenName;
}

// ===== GRID INITIALIZATION =====
function initializeGrid() {
    // Create 5x5 2D array of empty tile objects
    gameState.grid = [];
    for (let r = 0; r < 5; r++) {
        gameState.grid[r] = [];
        for (let c = 0; c < 5; c++) {
            gameState.grid[r][c] = {
                type: null,
                energy: 0,
                carbon: 0,
                hasBonus: false
            };
        }
    }
    
    // Create grid cells in DOM
    elements.cityGrid.innerHTML = '';
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => handleCellClick(r, c));
            elements.cityGrid.appendChild(cell);
        }
    }
}

// ===== GAME START =====
function startGame() {
    // Apply difficulty settings
    const settings = difficultySettings[gameState.difficulty];
    gameState.budget = settings.budget;
    gameState.maxBudget = settings.budget;
    gameState.energy = 0;
    gameState.carbon = 0;
    gameState.selectedTile = null;
    gameState.tileCounts = {
        solar: 0,
        wind: 0,
        factory: 0,
        forest: 0,
        water: 0,
        park: 0
    };
    
    // Reset grid
    initializeGrid();
    
    // Reset tile selection
    elements.tileItems.forEach(item => item.classList.remove('selected'));
    elements.selectedTile.textContent = 'None';
    
    // Update UI
    elements.difficultyBadge.textContent = settings.label;
    updateUI();
    
    switchScreen('game');
}

// ===== TILE PLACEMENT ENGINE =====
function handleCellClick(row, col) {
    const cell = gameState.grid[row][col];
    
    // Check if cell is already filled
    if (cell.type !== null) {
        console.log('Cell already occupied');
        return;
    }
    
    // Check if tile is selected
    if (!gameState.selectedTile) {
        console.log('No tile selected');
        return;
    }
    
    const tileType = tileTypes[gameState.selectedTile];
    
    // Check budget
    if (gameState.budget < tileType.cost) {
        console.log('Insufficient budget');
        return;
    }
    
    // Place tile
    placeTile(row, col, gameState.selectedTile);
}

function placeTile(row, col, type) {
    const tile = tileTypes[type];
    
    // Deduct cost
    gameState.budget -= tile.cost;
    
    // Calculate base values
    let energy = tile.baseEnergy;
    let carbon = tile.baseCarbon;
    let hasBonus = false;
    
    // Check adjacency bonuses (8 surrounding cells)
    const adjacentCells = getAdjacentCells(row, col);
    
    for (const [adjRow, adjCol] of adjacentCells) {
        const adjCell = gameState.grid[adjRow][adjCol];
        
        if (adjCell.type !== null) {
            // Check if current tile has bonus for adjacent tile
            if (tile.adjacencyBonus[adjCell.type]) {
                const bonus = tile.adjacencyBonus[adjCell.type];
                if (bonus.energyMultiplier) {
                    energy *= bonus.energyMultiplier;
                    hasBonus = true;
                }
                if (bonus.carbonMultiplier) {
                    carbon *= bonus.carbonMultiplier;
                    hasBonus = true;
                }
            }
            
            // Check if adjacent tile has bonus for current tile
            const adjTileType = tileTypes[adjCell.type];
            if (adjTileType.adjacencyBonus[type]) {
                // Recalculate adjacent cell's values
                recalculateCell(adjRow, adjCol);
            }
        }
    }
    
    // Update grid cell
    gameState.grid[row][col] = {
        type: type,
        energy: Math.round(energy),
        carbon: Math.round(carbon),
        hasBonus: hasBonus
    };
    
    // Update tile counts
    gameState.tileCounts[type]++;
    
    // Update totals
    recalculateTotals();
    
    // Update DOM
    renderGrid();
    updateUI();
    
    // Check game conditions
    checkGameConditions();
}

// ===== ADJACENCY SYSTEM =====
function getAdjacentCells(row, col) {
    const adjacent = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5) {
            adjacent.push([newRow, newCol]);
        }
    }
    
    return adjacent;
}

function recalculateCell(row, col) {
    const cell = gameState.grid[row][col];
    
    if (cell.type === null) return;
    
    const tile = tileTypes[cell.type];
    let energy = tile.baseEnergy;
    let carbon = tile.baseCarbon;
    let hasBonus = false;
    
    // Check all adjacent cells for bonuses
    const adjacentCells = getAdjacentCells(row, col);
    
    for (const [adjRow, adjCol] of adjacentCells) {
        const adjCell = gameState.grid[adjRow][adjCol];
        
        if (adjCell.type !== null && tile.adjacencyBonus[adjCell.type]) {
            const bonus = tile.adjacencyBonus[adjCell.type];
            if (bonus.energyMultiplier) {
                energy *= bonus.energyMultiplier;
                hasBonus = true;
            }
            if (bonus.carbonMultiplier) {
                carbon *= bonus.carbonMultiplier;
                hasBonus = true;
            }
        }
    }
    
    cell.energy = Math.round(energy);
    cell.carbon = Math.round(carbon);
    cell.hasBonus = hasBonus;
}

function recalculateTotals() {
    gameState.energy = 0;
    gameState.carbon = 0;
    
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = gameState.grid[r][c];
            if (cell.type !== null) {
                gameState.energy += cell.energy;
                gameState.carbon += cell.carbon;
            }
        }
    }
    
    // Ensure carbon doesn't go below 0
    gameState.carbon = Math.max(0, gameState.carbon);
}

// ===== RENDERING =====
function renderGrid() {
    const cells = elements.cityGrid.querySelectorAll('.grid-cell');
    
    let index = 0;
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = gameState.grid[r][c];
            const domCell = cells[index];
            
            if (cell.type !== null) {
                domCell.textContent = tileTypes[cell.type].icon;
                domCell.classList.add('filled');
                
                if (cell.hasBonus) {
                    domCell.classList.add('bonus');
                } else {
                    domCell.classList.remove('bonus');
                }
            } else {
                domCell.textContent = '';
                domCell.classList.remove('filled', 'bonus');
            }
            
            index++;
        }
    }
}

// ===== UI UPDATES =====
function updateUI() {
    // Energy meter
    const energyPercent = Math.min(100, (gameState.energy / 100) * 100);
    elements.energyFill.style.width = energyPercent + '%';
    elements.energyValue.textContent = `${gameState.energy} / 100`;
    
    // Carbon meter
    const carbonPercent = Math.min(100, gameState.carbon);
    elements.carbonFill.style.width = carbonPercent + '%';
    elements.carbonValue.textContent = `${gameState.carbon} / 100`;
    
    // Budget meter
    const budgetPercent = (gameState.budget / gameState.maxBudget) * 100;
    elements.budgetFill.style.width = budgetPercent + '%';
    elements.budgetValue.textContent = gameState.budget;
    
    // Tile counts
    elements.solarCount.textContent = gameState.tileCounts.solar;
    elements.windCount.textContent = gameState.tileCounts.wind;
    elements.factoryCount.textContent = gameState.tileCounts.factory;
    elements.forestCount.textContent = gameState.tileCounts.forest;
    
    // Grid utilization
    const filled = Object.values(gameState.tileCounts).reduce((a, b) => a + b, 0);
    elements.gridUtil.textContent = `${filled} / 25`;
    
    // Balance score
    const balance = calculateBalance();
    elements.balanceMeter.style.width = balance + '%';
    elements.balanceText.textContent = `${balance}% Sustainable`;
    
    // Eco rating
    const rating = calculateRating();
    elements.ecoRating.textContent = rating.grade;
    elements.ratingDesc.textContent = rating.description;
}

// ===== BALANCE CALCULATION =====
function calculateBalance() {
    if (gameState.energy === 0) return 0;
    
    // Calculate sustainability: high energy, low carbon = high balance
    const energyScore = Math.min(100, gameState.energy);
    const carbonPenalty = gameState.carbon;
    
    const balance = Math.max(0, energyScore - carbonPenalty);
    
    return Math.round(balance);
}

// ===== RATING SYSTEM =====
function calculateRating() {
    const settings = difficultySettings[gameState.difficulty];
    
    if (gameState.energy < 100) {
        return {
            grade: '-',
            description: 'Reach 100 energy to get rated'
        };
    }
    
    // S Rank: E ≥ 100, C ≤ 20, Budget > 50
    if (gameState.carbon <= 20 && gameState.budget > 50) {
        return {
            grade: 'S',
            description: 'Legendary Eco-Planner! 🌟'
        };
    }
    
    // A Rank: E ≥ 100, C ≤ 50
    if (gameState.carbon <= 50) {
        return {
            grade: 'A',
            description: 'Excellent Sustainability! ⭐'
        };
    }
    
    // B Rank: E ≥ 100, C ≤ 80
    if (gameState.carbon <= 80) {
        return {
            grade: 'B',
            description: 'Good Balance Achieved'
        };
    }
    
    // C Rank: E ≥ 100, C > 80
    return {
        grade: 'C',
        description: 'Needs Improvement'
    };
}

// ===== GAME CONDITIONS =====
function checkGameConditions() {
    const settings = difficultySettings[gameState.difficulty];
    
    // Win condition: Energy ≥ 100, Carbon ≤ threshold
    if (gameState.energy >= 100 && gameState.carbon <= settings.carbonThreshold) {
        endGame('victory');
        return;
    }
    
    // Lose condition 1: Carbon overload
    if (gameState.carbon >= 100) {
        endGame('gameOver', 'Carbon levels reached critical mass! The city is uninhabitable.');
        return;
    }
    
    // Lose condition 2: Bankruptcy (can't afford cheapest tile)
    const cheapestTile = Math.min(...Object.values(tileTypes).map(t => t.cost));
    if (gameState.budget < cheapestTile && gameState.energy < 100) {
        endGame('gameOver', 'Economic stagnation! You ran out of budget before reaching the energy goal.');
        return;
    }
}

// ===== GAME END =====
function endGame(result, reason = '') {
    const rating = calculateRating();
    
    if (result === 'victory') {
        elements.finalEnergy.textContent = gameState.energy;
        elements.finalCarbon.textContent = gameState.carbon;
        elements.finalBudget.textContent = gameState.budget;
        elements.finalRating.textContent = rating.grade;
        
        switchScreen('victory');
    } else {
        elements.gameOverEnergy.textContent = gameState.energy;
        elements.gameOverCarbon.textContent = gameState.carbon;
        elements.gameOverBudget.textContent = gameState.maxBudget - gameState.budget;
        elements.gameOverReason.textContent = reason;
        
        switchScreen('gameOver');
    }
}

// ===== INITIALIZE ON LOAD =====
window.addEventListener('load', init);