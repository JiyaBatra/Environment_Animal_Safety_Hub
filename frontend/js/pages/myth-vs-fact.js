
    // ===== THEME MANAGEMENT =====
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('ecolife-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('ecolife-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('ecolife-theme', 'dark');
        }
    });

    // ===== FLIP CARD FUNCTIONALITY =====
    let revealedCount = 0;
    const revealedCards = new Set();
    const revealedCountElement = document.getElementById('revealedCount');
    
    function flipCard(card) {
        const wasFlipped = card.classList.contains('flipped');
        card.classList.toggle('flipped');
        
        // Update counter if flipping to reveal fact (not hiding)
        if (!wasFlipped) {
            // Generate a unique ID for this card based on its content
            const cardId = card.querySelector('.myth-card p').textContent;
            
            if (!revealedCards.has(cardId)) {
                revealedCards.add(cardId);
                revealedCount++;
                updateCounter();
                
                // Add celebration for reaching certain milestones
                if (revealedCount === 3) {
                    showCelebration("Great start! 🌱");
                } else if (revealedCount === 6) {
                    showCelebration("Halfway there! 🌍");
                } else if (revealedCount === 9) {
                    showCelebration("All myths revealed! 🎉");
                }
            }
        }
    }
    
    function updateCounter() {
        revealedCountElement.textContent = revealedCount;
        
        // Add animation to counter
        revealedCountElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            revealedCountElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    function showCelebration(message) {
        // Create celebration element
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary);
            color: white;
            padding: 20px 40px;
            border-radius: var(--radius);
            box-shadow: var(--shadow-hover);
            z-index: 1000;
            animation: fadeInOut 2s ease;
            font-weight: 600;
            text-align: center;
        `;
        
        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                40% { transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
        
        celebration.textContent = message;
        document.body.appendChild(celebration);
        
        // Remove after animation
        setTimeout(() => {
            celebration.remove();
            style.remove();
        }, 2000);
    }
    
    // ===== KEYBOARD NAVIGATION =====
    document.addEventListener('keydown', (e) => {
        // Space bar to flip focused card
        if (e.code === 'Space' && document.activeElement.closest('.myth-card')) {
            e.preventDefault();
            flipCard(document.activeElement.closest('.myth-card'));
        }
        
        // Arrow keys to navigate between cards
        if (e.code.startsWith('Arrow')) {
            const cards = Array.from(document.querySelectorAll('.myth-card'));
            const currentIndex = cards.indexOf(document.activeElement);
            
            if (currentIndex > -1) {
                let nextIndex;
                if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % cards.length;
                } else {
                    nextIndex = (currentIndex - 1 + cards.length) % cards.length;
                }
                
                cards[nextIndex].focus();
                cards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });
    
    // ===== TOUCH SUPPORT FOR MOBILE =====
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const cards = document.querySelectorAll('.myth-card');
            cards.forEach(card => {
                if (card.classList.contains('flipped') && diff > 0) {
                    // Swipe left to flip back
                    setTimeout(() => card.classList.remove('flipped'), 100);
                } else if (!card.classList.contains('flipped') && diff < 0) {
                    // Swipe right to flip
                    setTimeout(() => flipCard(card), 100);
                }
            });
        }
    }
    
    // ===== PRINT FUNCTIONALITY =====
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print"></i>';
    printBtn.title = 'Print Myths & Facts';
    printBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99;
        box-shadow: var(--shadow);
        transition: var(--transition);
    `;
    
    printBtn.addEventListener('mouseenter', () => {
        printBtn.style.transform = 'scale(1.1)';
    });
    
    printBtn.addEventListener('mouseleave', () => {
        printBtn.style.transform = 'scale(1)';
    });
    
    printBtn.addEventListener('click', () => {
        // Flip all cards to show facts before printing
        document.querySelectorAll('.myth-card').forEach(card => {
            card.classList.add('flipped');
        });
        
        setTimeout(() => {
            window.print();
            
            // Flip back after printing
            setTimeout(() => {
                document.querySelectorAll('.myth-card').forEach(card => {
                    card.classList.remove('flipped');
                });
            }, 1000);
        }, 500);
    });
    
    document.body.appendChild(printBtn);
    
    // ===== INITIALIZATION =====
    console.log('EcoLife Myth vs Fact page loaded');
    console.log('Total cards:', document.querySelectorAll('.myth-card').length);
    console.log('Theme:', document.documentElement.getAttribute('data-theme') || 'light');
    
    // Make cards focusable for keyboard navigation
    document.querySelectorAll('.myth-card').forEach(card => {
        card.setAttribute('tabindex', '0');
    });


    /* ============================================
   HERO ANIMATIONS & INTERACTIVITY
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mouse Parallax Effect
    const heroSection = document.getElementById('heroSection');
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroSection && heroBg) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // Move background slightly opposite to mouse
            heroBg.style.transform = `translate(-${x * 20}px, -${y * 20}px) scale(1.1)`;
        });
        
        // Reset on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            heroBg.style.transform = `translate(0, 0) scale(1.1)`;
        });
    }

    // 2. Falling Leaves Particle System
    const leafContainer = document.getElementById('leaf-container');
    
    function createLeaf() {
        if (!leafContainer) return;
        
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        
        // Random starting position (0 to 100% width)
        leaf.style.left = Math.random() * 100 + '%';
        
        // Random size variation
        const size = Math.random() * 15 + 15; // 15px to 30px
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size}px`;
        
        // Random animation duration (falling speed)
        const duration = Math.random() * 5 + 5; // 5s to 10s
        leaf.style.animationDuration = `${duration}s`;
        
        // Random delay
        leaf.style.animationDelay = Math.random() * 5 + 's';
        
        leafContainer.appendChild(leaf);
        
        // Remove leaf after animation ends to prevent DOM overload
        setTimeout(() => {
            leaf.remove();
        }, duration * 1000);
    }

    // Generate leaves periodically
    if (leafContainer) {
        // Create initial batch
        for(let i=0; i<5; i++) createLeaf();
        
        // Create new leaf every 800ms
        setInterval(createLeaf, 800);
    }
});

/* ============================================
   CARD INTERACTION ENHANCEMENTS
   ============================================ */

// Function to trigger confetti (Add this to your script)
function fireConfetti(element) {
    const count = 50;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 1000
    };

    // If you don't have a confetti library, we create simple CSS particles
    const rect = element.getBoundingClientRect();
    const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };

    for(let i=0; i<30; i++) {
        createParticle(center.x, center.y);
    }
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    document.body.appendChild(particle);

    // Random colors (Green theme)
    const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
    `;

    // Random velocity
    const velocityX = (Math.random() - 0.5) * 10;
    const velocityY = (Math.random() - 0.5) * 10 - 5; // Upward bias

    let opacity = 1;
    let posY = y;
    let posX = x;

    const animate = () => {
        if(opacity <= 0) {
            particle.remove();
            return;
        }

        posX += velocityX;
        posY += velocityY + 2; // Gravity
        opacity -= 0.02;

        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;
        particle.style.transform = `scale(${opacity})`;

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

