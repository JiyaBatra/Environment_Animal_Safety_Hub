// Freshwater Algal Toxin Bioaccumulation Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    setupTabSystem();
    setupAnimations();
    setupInteractiveElements();
    setupScrollEffects();
    initializeToxinParticles();
}

// Tab System for Mechanisms Section
function setupTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Hide all tab contents
            tabContents.forEach(content => content.style.display = 'none');

            // Show corresponding tab content
            const tabId = button.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.style.display = 'block';
                // Trigger animation
                targetContent.style.animation = 'none';
                setTimeout(() => {
                    targetContent.style.animation = 'fadeIn 0.5s ease-out';
                }, 10);
            }
        });
    });

    // Set default active tab
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
}

// Setup Animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.overview-card, .species-card, .solution-card, .case-study-card').forEach(card => {
        observer.observe(card);
    });
}

// Interactive Elements
function setupInteractiveElements() {
    // Toxin accumulation demonstration
    setupToxinAccumulationDemo();

    // Bloom risk calculator
    setupBloomRiskCalculator();

    // Species impact hover effects
    setupSpeciesHoverEffects();
}

function setupToxinAccumulationDemo() {
    const demo = document.querySelector('.accumulation-demo');
    if (!demo) return;

    const levels = demo.querySelectorAll('.chain-level');
    let currentLevel = 0;

    function animateAccumulation() {
        if (currentLevel < levels.length) {
            const level = levels[currentLevel];
            level.classList.add('active');

            // Animate concentration increase
            const concentration = level.querySelector('.concentration-level');
            if (concentration) {
                const multiplier = Math.pow(10, currentLevel + 1);
                concentration.textContent = `${multiplier}x concentration`;
                concentration.style.color = getConcentrationColor(multiplier);
            }

            currentLevel++;
            setTimeout(animateAccumulation, 1500);
        }
    }

    // Start animation when demo comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateAccumulation();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(demo);
}

function getConcentrationColor(multiplier) {
    if (multiplier < 10) return '#4ade80';
    if (multiplier < 100) return '#f97316';
    return '#ef4444';
}

function setupBloomRiskCalculator() {
    const calculator = document.querySelector('.bloom-calculator');
    if (!calculator) return;

    const inputs = calculator.querySelectorAll('input[type="range"]');
    const result = calculator.querySelector('.risk-result');

    function calculateRisk() {
        let riskScore = 0;
        inputs.forEach(input => {
            riskScore += parseInt(input.value);
        });

        const riskLevel = getRiskLevel(riskScore);
        result.innerHTML = `
            <div class="risk-level ${riskLevel.class}">
                <h4>Risk Level: ${riskLevel.text}</h4>
                <p>${riskLevel.description}</p>
            </div>
        `;
    }

    inputs.forEach(input => {
        input.addEventListener('input', calculateRisk);
    });

    calculateRisk(); // Initial calculation
}

function getRiskLevel(score) {
    if (score < 30) return { text: 'Low', class: 'low-risk', description: 'Minimal bloom risk. Monitor water quality.' };
    if (score < 60) return { text: 'Moderate', class: 'moderate-risk', description: 'Potential for occasional blooms. Implement monitoring.' };
    if (score < 90) return { text: 'High', class: 'high-risk', description: 'Significant bloom risk. Take preventive measures.' };
    return { text: 'Critical', class: 'critical-risk', description: 'High probability of toxic blooms. Immediate action required.' };
}

function setupSpeciesHoverEffects() {
    const speciesCards = document.querySelectorAll('.species-card');

    speciesCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Scroll Effects
function setupScrollEffects() {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Parallax effect for hero section
        const hero = document.querySelector('.freshwater-hero');
        if (hero) {
            const speed = 0.5;
            hero.style.transform = `translateY(${currentScrollY * speed}px)`;
        }

        // Update toxin particles based on scroll
        updateToxinParticles(currentScrollY);

        lastScrollY = currentScrollY;
    });
}

// Toxin Particles System
function initializeToxinParticles() {
    const container = document.querySelector('.toxin-particles');
    if (!container) return;

    // Create toxin particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'toxin-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        container.appendChild(particle);
    }
}

function updateToxinParticles(scrollY) {
    const particles = document.querySelectorAll('.toxin-particle');
    particles.forEach((particle, index) => {
        const speed = (index % 3 + 1) * 0.1;
        particle.style.transform = `translateY(${scrollY * speed}px)`;
    });
}

// Statistics Counter Animation
function animateStatistics() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// Trigger statistics animation when section comes into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStatistics();
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Bloom Warning System
function setupBloomWarnings() {
    const warnings = document.querySelectorAll('.bloom-warning');

    warnings.forEach(warning => {
        setInterval(() => {
            warning.classList.toggle('pulse');
        }, 3000);
    });
}

// Interactive Case Studies
function setupCaseStudyInteractions() {
    const caseStudies = document.querySelectorAll('.case-study-card');

    caseStudies.forEach(study => {
        const toggleBtn = study.querySelector('.case-study-toggle');
        const details = study.querySelector('.case-study-details');

        if (toggleBtn && details) {
            toggleBtn.addEventListener('click', () => {
                const isExpanded = details.style.display === 'block';
                details.style.display = isExpanded ? 'none' : 'block';
                toggleBtn.textContent = isExpanded ? 'Show Details' : 'Hide Details';
            });
        }
    });
}

// Environmental Impact Calculator
function setupImpactCalculator() {
    const calculator = document.querySelector('.impact-calculator');
    if (!calculator) return;

    const inputs = calculator.querySelectorAll('input');
    const result = calculator.querySelector('.calculator-result');

    function calculateImpact() {
        const values = {};
        inputs.forEach(input => {
            values[input.name] = parseFloat(input.value) || 0;
        });

        // Simple impact calculation (placeholder logic)
        const bloomRisk = (values.temperature * 0.3) + (values.nutrients * 0.4) + (values.flow * 0.3);
        const toxinConcentration = bloomRisk * values.duration * 10;

        result.innerHTML = `
            <h4>Estimated Impact</h4>
            <p>Bloom Risk: ${bloomRisk.toFixed(1)}/10</p>
            <p>Potential Toxin Concentration: ${toxinConcentration.toFixed(0)} μg/L</p>
            <p class="impact-level ${getImpactLevel(bloomRisk)}">
                ${getImpactDescription(bloomRisk)}
            </p>
        `;
    }

    inputs.forEach(input => {
        input.addEventListener('input', calculateImpact);
    });

    calculateImpact(); // Initial calculation
}

function getImpactLevel(risk) {
    if (risk < 3) return 'low-impact';
    if (risk < 6) return 'moderate-impact';
    return 'high-impact';
}

function getImpactDescription(risk) {
    if (risk < 3) return 'Low risk - Monitor water quality';
    if (risk < 6) return 'Moderate risk - Implement monitoring program';
    return 'High risk - Immediate intervention required';
}

// Initialize all interactive features
document.addEventListener('DOMContentLoaded', function() {
    setupTabSystem();
    setupAnimations();
    setupInteractiveElements();
    setupScrollEffects();
    initializeToxinParticles();
    setupBloomWarnings();
    setupCaseStudyInteractions();
    setupImpactCalculator();
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('scroll', debounce(() => {
    setupScrollEffects();
}, 16));

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Tab navigation for interactive elements
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to monitoring service
});

// Loading states
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Export functions for potential use in other scripts
window.FreshwaterToxinsPage = {
    setupTabSystem,
    setupAnimations,
    setupInteractiveElements,
    animateStatistics
};