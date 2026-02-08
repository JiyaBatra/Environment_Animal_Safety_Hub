// Urban Stress Evolution Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initializeScrollAnimations();
    initializePollutionTimeline();
    initializeHearingChart();
    initializeSpeciesInteractions();
    initializeEvolutionAnimations();
});

// Scroll animations for content sections
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Pollution evolution timeline chart
function initializePollutionTimeline() {
    const ctx = document.getElementById('pollutionTimeline');
    if (!ctx) return;

    const timelineData = {
        labels: ['Pre-1900', '1950s', '1980s', '2000s', '2020s'],
        datasets: [{
            label: 'Heavy Metals Evolution',
            data: [0, 2, 5, 8, 9],
            borderColor: '#e53e3e',
            backgroundColor: 'rgba(229, 62, 62, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Pesticide Resistance',
            data: [0, 1, 4, 7, 10],
            borderColor: '#38a169',
            backgroundColor: 'rgba(56, 161, 105, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Air Pollution Adaptation',
            data: [0, 0, 2, 5, 7],
            borderColor: '#3182ce',
            backgroundColor: 'rgba(49, 130, 206, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    const config = {
        type: 'line',
        data: timelineData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Urban Pollution Evolution Timeline',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Evolutionary Response Level'
                    },
                    max: 10
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time Period'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    };

    new Chart(ctx, config);
}

// Hearing sensitivity chart for urban vs rural frogs
function initializeHearingChart() {
    const ctx = document.getElementById('hearingChart');
    if (!ctx) return;

    const hearingData = {
        labels: ['0.1kHz', '0.5kHz', '1kHz', '2kHz', '5kHz', '10kHz'],
        datasets: [{
            label: 'Rural Frogs',
            data: [20, 40, 60, 80, 60, 30],
            borderColor: '#68d391',
            backgroundColor: 'rgba(104, 211, 145, 0.2)',
            tension: 0.4
        }, {
            label: 'Urban Frogs',
            data: [15, 35, 55, 75, 85, 70],
            borderColor: '#3182ce',
            backgroundColor: 'rgba(49, 130, 206, 0.2)',
            tension: 0.4
        }]
    };

    const config = {
        type: 'radar',
        data: hearingData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Hearing Sensitivity: Urban vs Rural Frogs',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    };

    new Chart(ctx, config);
}

// Species card interactions
function initializeSpeciesInteractions() {
    const speciesCards = document.querySelectorAll('.case-card');

    speciesCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        card.addEventListener('click', function() {
            const speciesName = this.querySelector('h3').textContent;
            showSpeciesEvolutionDetails(speciesName);
        });
    });
}

// Show detailed evolution information for species
function showSpeciesEvolutionDetails(speciesName) {
    const speciesData = {
        'Urban Fox': {
            scientific: 'Vulpes vulpes',
            keyAdaptations: ['Reduced neophobia', 'Earlier breeding', 'Bolder foraging'],
            generations: '3-5',
            mechanisms: 'Standing genetic variation',
            implications: 'Reduced predation avoidance, urban expansion'
        },
        'City Birds': {
            scientific: 'Various passerines',
            keyAdaptations: ['Higher song frequency', 'Larger body size', 'Omnivorous diet'],
            generations: '10-15',
            mechanisms: 'Frequency-dependent selection',
            implications: 'Improved communication in noise, dietary flexibility'
        },
        'Urban Rodents': {
            scientific: 'Rattus norvegicus, Mus musculus',
            keyAdaptations: ['Reduced stress response', 'Altered foraging', 'Higher densities'],
            generations: '5-8',
            mechanisms: 'Epigenetic changes',
            implications: 'Population booms, disease transmission'
        }
    };

    const data = speciesData[speciesName];
    if (!data) return;

    const details = `
        Scientific Name: ${data.scientific}
        Key Adaptations: ${data.keyAdaptations.join(', ')}
        Generations for Change: ${data.generations}
        Genetic Mechanisms: ${data.mechanisms}
        Conservation Implications: ${data.implications}
    `;

    alert(`${speciesName} Evolution Details:\n\n${details}`);
}

// Animate evolution indicators on scroll
function initializeEvolutionAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateEvolutionIndicator(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.indicator-fill').forEach(indicator => {
        observer.observe(indicator);
    });
}

function animateEvolutionIndicator(indicator) {
    const targetWidth = indicator.style.width;
    indicator.style.width = '0%';

    setTimeout(() => {
        indicator.style.transition = 'width 1.5s ease-in-out';
        indicator.style.width = targetWidth;
    }, 200);
}

// Sound wave animation
function initializeSoundWaveAnimation() {
    const waves = document.querySelectorAll('.wave');

    waves.forEach((wave, index) => {
        wave.style.animationDelay = `${index * 0.2}s`;
    });
}

// Communication method hover effects
function initializeCommunicationMethods() {
    const methods = document.querySelectorAll('.method');

    methods.forEach(method => {
        method.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.background = '#edf2f7';
        });

        method.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = '#f7fafc';
        });
    });
}

// Light cycle animation
function initializeLightCycle() {
    const ruralSun = document.querySelector('.sun-position.rural');
    const urbanSun = document.querySelector('.sun-position.urban');

    // Animate sun positions to show diurnal shift
    function animateSuns() {
        const time = Date.now() * 0.001;
        const ruralOffset = Math.sin(time) * 20;
        const urbanOffset = Math.sin(time + Math.PI/4) * 20; // Phase shift for urban delay

        ruralSun.style.left = `${30 + ruralOffset}px`;
        urbanSun.style.left = `${60 + urbanOffset}px`;

        requestAnimationFrame(animateSuns);
    }

    animateSuns();
}

// Breeding season animation
function initializeBreedingAnimation() {
    const seasons = document.querySelectorAll('.season');

    seasons.forEach((season, index) => {
        season.addEventListener('mouseenter', function() {
            // Highlight extended breeding in urban environments
            if (index >= 2) { // Fall and Winter
                this.style.background = '#c53030';
                this.style.transform = 'scale(1.05)';
            }
        });

        season.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.transform = 'scale(1)';
        });
    });
}

// Mechanism cards interaction
function initializeMechanismCards() {
    const mechanisms = document.querySelectorAll('.mechanism');

    mechanisms.forEach(mechanism => {
        mechanism.addEventListener('mouseenter', function() {
            this.style.background = '#edf2f7';
            this.style.transform = 'translateY(-5px)';
        });

        mechanism.addEventListener('mouseleave', function() {
            this.style.background = '#f7fafc';
            this.style.transform = 'translateY(0)';
        });

        mechanism.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            showMechanismDetails(title);
        });
    });
}

function showMechanismDetails(title) {
    const mechanismInfo = {
        'Standing Variation': {
            description: 'Natural genetic diversity provides raw material for selection',
            example: 'Pre-existing alleles for boldness in fox populations',
            timeframe: 'Rapid (1-5 generations)'
        },
        'De Novo Mutations': {
            description: 'New genetic variants arise in response to urban pressures',
            example: 'Mutations affecting melatonin regulation in birds',
            timeframe: 'Variable (multiple generations)'
        },
        'Epigenetic Changes': {
            description: 'Environmentally induced modifications passed to offspring',
            example: 'DNA methylation changes in stress response genes',
            timeframe: 'Transgenerational'
        }
    };

    const info = mechanismInfo[title];
    if (!info) return;

    alert(`${title}:\n\n${info.description}\n\nExample: ${info.example}\n\nTimeframe: ${info.timeframe}`);
}

// Strategy cards hover effects
function initializeStrategyCards() {
    const strategyCards = document.querySelectorAll('.strategy-card');

    strategyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize all animations and interactions
initializeSoundWaveAnimation();
initializeCommunicationMethods();
initializeLightCycle();
initializeBreedingAnimation();
initializeMechanismCards();
initializeStrategyCards();

// Add loading animation for charts
function addLoadingAnimation() {
    const charts = document.querySelectorAll('canvas');
    charts.forEach(chart => {
        chart.style.opacity = '0';
        setTimeout(() => {
            chart.style.transition = 'opacity 1s ease-in-out';
            chart.style.opacity = '1';
        }, 500);
    });
}

// Call loading animation after page load
addLoadingAnimation();