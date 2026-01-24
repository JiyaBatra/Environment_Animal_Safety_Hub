/**
 * Kids Learning Zone - Environmental Education
 *
 * Interactive learning platform for children featuring environmental education through
 * engaging games, facts, videos, and achievement systems. Designed to teach kids
 * about environmental conservation in a fun and interactive way.
 *
 * Features:
 * - Educational video reels with progress tracking
 * - Interactive flip cards with environmental facts
 * - Random fact generator with animations
 * - Achievement badge system
 * - Quest completion with rewards
 * - Touch and keyboard navigation
 * - Progress persistence (in-memory)
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ========== CONSTANTS & DATA ==========

/**
 * Array of educational environmental facts for random display
 * @type {string[]}
 */
const facts = [
    "Trees help clean the air we breathe! 🌳",
    "Plastic can take 400 years to decompose! 😮",
    "Saving water helps save lives! 💧",
    "Animals feel pain just like humans! 🐾",
    "Recycling saves energy and resources! ♻️",
    "Planting trees helps fight climate change! 🌍",
    "One tree can absorb 48 pounds of CO2 per year! 🌲",
    "Solar panels can last for 25-30 years! ☀️",
    "A single aluminum can saves enough energy to power a TV for 3 hours! 📺",
    "The ocean produces over 50% of Earth's oxygen! 🌊",
    "Bees pollinate 70% of crops that humans eat! 🐝",
    "Glass takes 1 million years to decompose! 🥛"
];

// ========== PROGRESS TRACKING ==========

/**
 * In-memory progress tracking for user achievements
 * @type {Object}
 */
const progress = {
    reelsWatched: 0,
    cardsFlipped: 0,
    questComplete: false,
    badges: {
        badge1: false, // Reel Explorer
        badge2: false, // Fact Flipper
        badge3: false  // Junior Ranger
    }
};

// ========== REELS STATE ==========

/**
 * Current reel index for video navigation
 * @type {number}
 */
let currentReelIndex = 0;

/**
 * Total number of educational video reels
 * @type {number}
 */
const totalReels = 5;

// ========== INITIALIZATION ==========

/**
 * Initialize the kids learning zone when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Main initialization function for the kids learning app
 */
function initializeApp() {
    setupFlipCards();
    setupFactGenerator();
    setupQuestSidebar();
    initializeReels();
    updateAllDisplays();
    console.log('🌱 Kids Learning Zone initialized! Happy learning! 🌍');
}

// ========== NAVIGATION FUNCTIONS ==========

/**
 * Smooth scroll to a specific section
 * @param {string} sectionId - ID of the section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ========== REELS FUNCTIONALITY ==========

/**
 * Initialize the video reels system
 */
function initializeReels() {
    const reels = document.querySelectorAll('.reel-card');
    if (reels.length > 0) {
        reels[0].classList.add('active');
        updateReelCounter();
    }
}

/**
 * Scroll through video reels
 * @param {string} direction - 'up' or 'down'
 */
function scrollReels(direction) {
    const reels = document.querySelectorAll('.reel-card');
    const currentReel = reels[currentReelIndex];

    currentReel.classList.remove('active');

    if (direction === 'down') {
        currentReel.classList.add('prev');
        currentReelIndex = (currentReelIndex + 1) % totalReels;
    } else {
        currentReelIndex = (currentReelIndex - 1 + totalReels) % totalReels;
    }

    const nextReel = reels[currentReelIndex];
    nextReel.classList.remove('prev');
    nextReel.classList.add('active');

    // Remove prev class from all other reels
    reels.forEach((reel, index) => {
        if (index !== currentReelIndex) {
            setTimeout(() => reel.classList.remove('prev'), 500);
        }
    });

    updateReelCounter();
}

/**
 * Update the reel counter display
 */
function updateReelCounter() {
    const counter = document.getElementById('reelCounter');
    if (counter) {
        counter.textContent = `${currentReelIndex + 1}/${totalReels}`;
    }
}

/**
 * Mark a reel as watched and update progress
 * @param {number} index - Index of the watched reel
 */
function markReelWatched(index) {
    const reels = document.querySelectorAll('.reel-card');
    const reel = reels[index];

    if (reel.getAttribute('data-watched') === 'true') return;

    reel.setAttribute('data-watched', 'true');
    reel.classList.add('watched');
    progress.reelsWatched++;
    showNotification('✅ Reel watched! Keep exploring! 🎥');
    updateAllDisplays();
    checkBadges();
    checkQuest();
}

// Enable keyboard navigation for reels
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        scrollReels('down');
    } else if (e.key === 'ArrowUp') {
        scrollReels('up');
    }
});

// Enable touch swipe for mobile
let touchStartY = 0;
let touchEndY = 0;

document.querySelector('.reels-container')?.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.querySelector('.reels-container')?.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

/**
 * Handle touch swipe gestures
 */
function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            scrollReels('down');
        } else {
            scrollReels('up');
        }
    }
}

// ========== FLIP CARDS FUNCTIONALITY ==========

/**
 * Set up event listeners for flip cards
 */
function setupFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            handleFlipClick(card);
        });
    });
}

/**
 * Handle flip card click events
 * @param {HTMLElement} card - The clicked flip card element
 */
function handleFlipClick(card) {
    const isFlipped = card.getAttribute('data-flipped') === 'true';

    if (!isFlipped) {
        card.classList.add('flipped');
        card.setAttribute('data-flipped', 'true');
        
        // NEW: Get position for confetti
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        triggerConfetti(centerX, centerY); // Boom! 🎉

        progress.cardsFlipped++;
        updateAllDisplays();
        checkBadges();
        checkQuest();
    } else {
        card.classList.remove('flipped');
        card.setAttribute('data-flipped', 'false');
    }
}

// ========== FACT GENERATOR ==========

/**
 * Set up the random fact generator
 */
function setupFactGenerator() {
    const factBtn = document.getElementById('factBtn');
    const factText = document.getElementById('factText');

    factBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * facts.length);
        const newFact = facts[randomIndex];

        // Animate fact change
        factText.style.opacity = '0';
        factText.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            factText.textContent = newFact;
            factText.style.opacity = '1';
            factText.style.transform = 'translateY(0)';
        }, 300);
    });
}

// ========== QUEST SIDEBAR ==========

/**
 * Set up the quest sidebar with delayed activation
 */
function setupQuestSidebar() {
    setTimeout(() => {
        document.getElementById('questSidebar').classList.add('active');
    }, 1000);
}

/**
 * Toggle quest sidebar visibility
 */
function toggleQuest() {
    const sidebar = document.getElementById('questSidebar');
    sidebar.classList.toggle('active');
}

/**
 * Update all progress displays
 */
function updateAllDisplays() {
    updateBadgeCount();
    updateQuestProgress();
    updateQuestPoints();
}

/**
 * Update quest progress bars and counters
 */
function updateQuestProgress() {
    const videoProgress = document.getElementById('videoProgress');
    const cardProgress = document.getElementById('cardProgress');
    const videoBar = document.getElementById('videoBar');
    const cardBar = document.getElementById('cardBar');

    if (videoProgress) videoProgress.textContent = `${Math.min(progress.reelsWatched, 2)}/2`;
    if (cardProgress) cardProgress.textContent = `${Math.min(progress.cardsFlipped, 3)}/3`;
    if (videoBar) videoBar.style.width = `${(Math.min(progress.reelsWatched, 2) / 2) * 100}%`;
    if (cardBar) cardBar.style.width = `${(Math.min(progress.cardsFlipped, 3) / 3) * 100}%`;
}

/**
 * Update quest points display
 */
function updateQuestPoints() {
    const questPoints = document.getElementById('questPoints');
    const totalPoints = Math.min(progress.reelsWatched, 2) + Math.min(progress.cardsFlipped, 3);
    if (questPoints) questPoints.textContent = `${totalPoints}/5`;
}

/**
 * Check if quest completion conditions are met
 */
function checkQuest() {
    if (progress.reelsWatched >= 2 && progress.cardsFlipped >= 3 && !progress.questComplete) {
        progress.questComplete = true;
        showQuestComplete();
        unlockBadge('badge3');
    }
}

/**
 * Show quest completion celebration
 */
function showQuestComplete() {
    const reward = document.getElementById('questReward');
    if (reward) {
        reward.style.display = 'block';
        launchConfetti();
    }
}

// ========== BADGE SYSTEM ==========

/**
 * Check if any badges should be unlocked
 */
function checkBadges() {
    if (progress.reelsWatched >= 2 && !progress.badges.badge1) {
        unlockBadge('badge1');
    }
    if (progress.cardsFlipped >= 3 && !progress.badges.badge2) {
        unlockBadge('badge2');
    }
}

/**
 * Unlock a specific badge
 * @param {string} badgeId - ID of the badge to unlock
 */
function unlockBadge(badgeId) {
    progress.badges[badgeId] = true;
    const badgeElement = document.getElementById(badgeId);

    if (badgeElement) {
        badgeElement.classList.remove('locked');
        badgeElement.classList.add('unlocked');
        showBadgeNotification(badgeId);
    }

    updateBadgeCount();
}

/**
 * Update the badge count display
 */
function updateBadgeCount() {
    const totalBadges = Object.values(progress.badges).filter(val => val === true).length;
    const badgeCountElement = document.getElementById('badgeCount');
    if (badgeCountElement) {
        badgeCountElement.textContent = totalBadges;
    }
}

// ========== NOTIFICATIONS ==========

/**
 * Show a general notification message
 * @param {string} message - Message to display
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

/**
 * Show badge unlock notification
 * @param {string} badgeId - ID of the unlocked badge
 */
function showBadgeNotification(badgeId) {
    const badgeNames = {
        badge1: 'Reel Explorer 🎬',
        badge2: 'Fact Flipper 🤸',
        badge3: 'Junior Ranger 🏆'
    };

    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="font-size: 2rem;margin-bottom: 10px;">🎖️</div>
        <strong style="font-size: 1.3rem;">Badge Unlocked!</strong><br>
        <span style="font-size: 1.1rem;">${badgeNames[badgeId]}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ffa726, #ff6f00);
        color: white;
        padding: 35px 45px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        z-index: 3000;
        text-align: center;
        animation: badgePop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'badgeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== CONFETTI EFFECT ==========

/**
 * Launch confetti celebration effect
 */
function launchConfetti() {
    const colors = ['#4caf50', '#81c784', '#ffa726', '#ff6f00', '#2e7d32'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 30);
    }
}

/**
 * Create a single confetti piece
 * @param {string} color - Color of the confetti piece
 */
function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        top: -10px;
        left: ${Math.random() * 100}vw;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${color};
        transform: rotate(${Math.random() * 360}deg);
        z-index: 4000;
        animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
    `;

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
}

// ========== CSS ANIMATIONS ==========

// Add dynamic CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    @keyframes badgePop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }

    @keyframes badgeOut {
        from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        to { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    }

    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(${Math.random() * 720}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== SMOOTH SCROLL ==========

// Add smooth scrolling to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== SCROLL ANIMATIONS ==========

// Intersection Observer for scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe learning sections for animations
document.querySelectorAll('.learning-modules, .flip-cards-section, .enviro-reels, .badges-section, .fun-fact-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

/**
 * Initialize the interactive hero section effects
 */
function initializeHeroEffects() {
    const hero = document.getElementById('hero');
    
    // Only enable parallax on non-touch devices
    if (window.matchMedia("(hover: hover)").matches) {
        hero.addEventListener('mousemove', (e) => {
            const elements = document.querySelectorAll('.floating-icon');
            const content = document.querySelector('.hero-content');
            
            // Calculate mouse position relative to center of screen
            const mouseX = (window.innerWidth / 2 - e.clientX) / 50;
            const mouseY = (window.innerHeight / 2 - e.clientY) / 50;

            // Move decorative elements
            elements.forEach(el => {
                const speed = el.getAttribute('data-speed');
                const x = mouseX * speed;
                const y = mouseY * speed;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });

            // Subtle movement for main content (opposite direction)
            if (content) {
                content.style.transform = `translate(${-mouseX * 0.5}px, ${-mouseY * 0.5}px)`;
            }
        });
    }
}




// Function to handle button clicks for scrolling
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId) || document.querySelector('.' + sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        console.warn('Section not found:', sectionId);
    }
}

/* ========== EFFECTS ========== */

/**
 * Creates a confetti explosion effect
 * @param {HTMLElement} element - The element to explode confetti from (optional)
 */
function triggerConfetti(x, y) {
    const colors = ['#ffeb3b', '#4caf50', '#2196f3', '#f44336', '#9c27b0'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random properties
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = x || Math.random() * window.innerWidth;
        const top = y || window.innerHeight / 2;
        
        confetti.style.position = 'fixed';
        confetti.style.left = left + 'px';
        confetti.style.top = top + 'px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = bg;
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);

        // Animate
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 4;
        const tx = Math.cos(angle) * velocity * 100;
        const ty = Math.sin(angle) * velocity * 100;

        const animation = confetti.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        });

        animation.onfinish = () => confetti.remove();
    }
}


