// Arctic Freshwater Lens Formation and Plankton Collapse - JavaScript
// Interactive features for educational web interface

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initializeTabs();
    initializeCharts();
    initializeAnimations();
    initializeAccessibility();
});

// Tab System
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // Update URL hash for bookmarking
            window.location.hash = tabId;

            // Trigger animations for new content
            animateTabContent(tabId);
        });
    });

    // Handle initial tab from URL hash
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        const initialTab = document.querySelector(`[data-tab="${hash}"]`);
        if (initialTab) {
            initialTab.click();
        }
    }
}

// Tab Content Animations
function animateTabContent(tabId) {
    const content = document.getElementById(tabId);
    const cards = content.querySelectorAll('.science-card, .nutrient-card, .biology-card, .solution-card, .monitoring-card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Charts Initialization
function initializeCharts() {
    // Phytoplankton Decline Chart
    const ctx = document.getElementById('phytoplanktonChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Diatoms', 'Dinoflagellates', 'Coccolithophores', 'Cyanobacteria'],
                datasets: [{
                    label: 'Biomass Decline (%)',
                    data: [65, 30, 40, -20], // Negative for increase
                    backgroundColor: [
                        'rgba(220, 38, 38, 0.8)',
                        'rgba(234, 88, 12, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(16, 185, 129, 0.8)' // Green for increase
                    ],
                    borderColor: [
                        'rgba(220, 38, 38, 1)',
                        'rgba(234, 88, 12, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const sign = value > 0 ? 'decline' : 'increase';
                                return `${Math.abs(value)}% ${sign}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 70,
                        min: -30,
                        ticks: {
                            callback: function(value) {
                                return Math.abs(value) + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Add more charts as needed
    initializeProductivityChart();
    initializeCascadeChart();
}

// Productivity Over Time Chart
function initializeProductivityChart() {
    // This could be added to show historical productivity decline
    // For now, we'll keep it simple
}

// Cascade Effect Visualization
function initializeCascadeChart() {
    // Interactive cascade effect could be added here
}

// Animation Effects
function initializeAnimations() {
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

    // Observe all cards and sections
    document.querySelectorAll('.science-card, .impact-card, .cascade-level, .solution-card').forEach(card => {
        observer.observe(card);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.8s ease-out forwards;
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Accessibility Features
function initializeAccessibility() {
    // Keyboard navigation for tabs
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (index + 1) % tabButtons.length;
                tabButtons[nextIndex].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (index - 1 + tabButtons.length) % tabButtons.length;
                tabButtons[prevIndex].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // High contrast mode detection
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }

    // Reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
}

// Interactive Features
function addInteractiveFeatures() {
    // Hover effects for nutrient items
    document.querySelectorAll('.nutrient-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
            item.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = 'none';
        });
    });

    // Click effects for impact bars
    document.querySelectorAll('.impact-bar').forEach(bar => {
        bar.addEventListener('click', () => {
            const fill = bar.querySelector('.impact-fill');
            const currentWidth = fill.style.width;
            fill.style.width = currentWidth === '100%' ? '' : '100%';

            // Add pulse animation
            bar.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                bar.style.animation = '';
            }, 500);
        });
    });

    // Add CSS for pulse animation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }

        .high-contrast {
            --arctic-blue: #000000;
            --ice-blue: #0000FF;
            --threat-red: #FF0000;
            --plankton-green: #00FF00;
        }
    `;
    document.head.appendChild(pulseStyle);
}

// Initialize interactive features after a short delay
setTimeout(addInteractiveFeatures, 100);

// Smooth scrolling for navigation
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

// Performance monitoring (for development)
if ('performance' in window && 'mark' in performance) {
    performance.mark('page-load-start');
    window.addEventListener('load', () => {
        performance.mark('page-load-end');
        performance.measure('page-load', 'page-load-start', 'page-load-end');
        const measure = performance.getEntriesByName('page-load')[0];
        console.log(`Page load time: ${measure.duration}ms`);
    });
}