// ========== HABITAT CONSERVATION PAGE JAVASCRIPT ==========

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    // Initialize all components
    initializeHeroStats();
    initializeStrategyCards();
    initializeHabitatCards();
    initializeSuccessStories();
    initializeActionCards();
    initializeScrollEffects();
    initializeCTAAnimations();
});

// ========== HERO STATS COUNTER ==========
function initializeHeroStats() {
    const statItems = document.querySelectorAll('.hero-stats .stat-item');

    statItems.forEach((item, index) => {
        const statNumber = item.querySelector('.stat-number');
        const targetValue = parseInt(statNumber.textContent.replace(/[^0-9]/g, ''));
        const suffix = statNumber.textContent.replace(/[0-9]/g, '');

        // Animate counter on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(statNumber, 0, targetValue, 2000, suffix);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(item);
    });
}

function animateCounter(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    const endTime = startTime + duration;

    function updateCounter(currentTime) {
        if (currentTime >= endTime) {
            element.textContent = end + suffix;
            return;
        }

        const progress = (currentTime - startTime) / duration;
        const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentValue = Math.floor(start + (end - start) * easeOutProgress);

        element.textContent = currentValue + suffix;

        requestAnimationFrame(updateCounter);
    }

    requestAnimationFrame(updateCounter);
}

// ========== STRATEGY CARDS INTERACTION ==========
function initializeStrategyCards() {
    const strategyCards = document.querySelectorAll('.strategy-card');

    strategyCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
        });

        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 150);
        });
    });
}

// ========== HABITAT CARDS INTERACTION ==========
function initializeHabitatCards() {
    const habitatCards = document.querySelectorAll('.habitat-card');

    habitatCards.forEach(card => {
        const image = card.querySelector('.habitat-image img');
        const overlay = card.querySelector('.habitat-overlay');

        card.addEventListener('mouseenter', function() {
            overlay.style.background = 'linear-gradient(transparent, rgba(34, 197, 94, 0.9))';
            overlay.style.transform = 'translateY(-5px)';
            overlay.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            overlay.style.background = 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))';
            overlay.style.transform = 'translateY(0)';
        });
    });
}

// ========== SUCCESS STORIES ANIMATION ==========
function initializeSuccessStories() {
    const successItems = document.querySelectorAll('.success-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 300);
            }
        });
    }, { threshold: 0.3 });

    successItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(item);
    });

    // Animate impact stats
    const impactStats = document.querySelectorAll('.impact-stats .stat-item');
    impactStats.forEach((stat, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        animateStatCounter(stat);
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(stat);
    });
}

function animateStatCounter(statElement) {
    const valueElement = statElement.querySelector('.stat-value');
    const targetValue = parseInt(valueElement.textContent.replace(/[^0-9]/g, ''));
    const suffix = valueElement.textContent.replace(/[0-9]/g, '');

    animateCounter(valueElement, 0, targetValue, 1500, suffix);
}

// ========== ACTION CARDS INTERACTION ==========
function initializeActionCards() {
    const actionCards = document.querySelectorAll('.action-card');

    actionCards.forEach(card => {
        const icon = card.querySelector('i');

        card.addEventListener('mouseenter', function() {
            icon.style.color = '#16a34a';
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            icon.style.color = '#22c55e';
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// ========== SCROLL EFFECTS ==========
function initializeScrollEffects() {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const scrolled = currentScrollY * 0.5;
            heroSection.style.transform = `translateY(${scrolled}px)`;
        }

        // Update scroll direction for potential future use
        lastScrollY = currentScrollY;
    });

    // Smooth scroll for anchor links
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
}

// ========== CTA ANIMATIONS ==========
function initializeCTAAnimations() {
    const ctaSection = document.querySelector('.cta-section');
    const ctaButtons = document.querySelectorAll('.cta-btn');

    if (ctaSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ctaSection.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
                    ctaSection.style.transition = 'background 1s ease';
                }
            });
        }, { threshold: 0.5 });

        observer.observe(ctaSection);
    }

    // Button hover effects
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('click', function() {
            // Add click ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ========== RIPPLE ANIMATION ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== PROGRESS BARS FOR STRATEGY CARDS ==========
function initializeProgressBars() {
    const strategyCards = document.querySelectorAll('.strategy-card');

    strategyCards.forEach(card => {
        const stats = card.querySelectorAll('.strategy-stats span');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stats.forEach((stat, index) => {
                        setTimeout(() => {
                            stat.style.opacity = '1';
                            stat.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';
            stat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        observer.observe(card);
    });
}

// ========== HABITAT STATUS INDICATORS ==========
function initializeHabitatStatus() {
    const habitatStatuses = document.querySelectorAll('.habitat-status');

    habitatStatuses.forEach(status => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    status.style.animation = 'pulse 2s infinite';
                }
            });
        }, { threshold: 0.5 });

        observer.observe(status);
    });
}

// ========== RESPONSIVE UTILITIES ==========
function handleResize() {
    const width = window.innerWidth;

    // Adjust animations based on screen size
    if (width < 768) {
        // Mobile optimizations
        document.querySelectorAll('.strategy-card, .habitat-card, .action-card').forEach(card => {
            card.style.transition = 'transform 0.2s ease';
        });
    } else {
        // Desktop optimizations
        document.querySelectorAll('.strategy-card, .habitat-card, .action-card').forEach(card => {
            card.style.transition = 'transform 0.3s ease';
        });
    }
}

// Initialize resize handler
window.addEventListener('resize', handleResize);
handleResize();

// ========== ACCESSIBILITY ENHANCEMENTS ==========
function initializeAccessibility() {
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea');

    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #22c55e';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });

    // Add ARIA labels where needed
    document.querySelectorAll('.strategy-card, .habitat-card, .action-card').forEach(card => {
        card.setAttribute('role', 'article');
        card.setAttribute('tabindex', '0');
    });
}

// Initialize accessibility features
initializeAccessibility();

// ========== ADDITIONAL ANIMATIONS ==========
function initializeAdditionalAnimations() {
    // Add pulse animation for critical habitats
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(pulseStyle);

    // Initialize progress bars and habitat status
    initializeProgressBars();
    initializeHabitatStatus();
}

// Initialize additional animations
initializeAdditionalAnimations();

// ========== PERFORMANCE OPTIMIZATION ==========
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    const debouncedScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Handle scroll optimizations here
        }, 16); // ~60fps
    };

    window.addEventListener('scroll', debouncedScroll);

    // Lazy load images if any
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize performance optimizations
optimizePerformance();