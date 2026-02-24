// Deep-Sea Biodiversity Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initializeScrollAnimations();
    initializeWarmingChart();
    initializeOxygenAnimation();
    initializeSpeciesCards();
    initializeImpactMeters();
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

// Interactive warming impact chart
function initializeWarmingChart() {
    const ctx = document.getElementById('warmingChart');
    if (!ctx) return;

    const warmingData = {
        labels: ['Surface Waters', '200-1000m', '1000-2000m', '2000-3000m', '3000-4000m'],
        datasets: [{
            label: 'Temperature Increase (°C)',
            data: [2.5, 1.8, 1.2, 0.8, 0.5],
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 2
        }]
    };

    const config = {
        type: 'bar',
        data: warmingData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Projected Temperature Increases by Depth (2100)',
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
                        text: 'Temperature Increase (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Ocean Depth'
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

// Oxygen bubble animation
function initializeOxygenAnimation() {
    const bubble = document.getElementById('oxygenBubble');
    if (!bubble) return;

    let oxygenLevel = 100;
    let decreasing = true;

    function animateOxygen() {
        if (decreasing) {
            oxygenLevel -= 0.5;
            if (oxygenLevel <= 20) {
                decreasing = false;
            }
        } else {
            oxygenLevel += 0.5;
            if (oxygenLevel >= 100) {
                decreasing = true;
            }
        }

        // Update bubble appearance based on oxygen level
        const scale = 0.5 + (oxygenLevel / 100) * 0.5;
        const opacity = 0.3 + (oxygenLevel / 100) * 0.7;

        bubble.style.transform = `scale(${scale})`;
        bubble.style.opacity = opacity;

        // Change color based on oxygen level
        if (oxygenLevel > 60) {
            bubble.style.background = 'rgba(104, 211, 145, 0.6)'; // Normal
        } else if (oxygenLevel > 30) {
            bubble.style.background = 'rgba(237, 137, 54, 0.6)'; // Low
        } else {
            bubble.style.background = 'rgba(229, 62, 62, 0.6)'; // Critical
        }

        requestAnimationFrame(animateOxygen);
    }

    animateOxygen();
}

// Species card interactions
function initializeSpeciesCards() {
    const speciesCards = document.querySelectorAll('.species-card');

    speciesCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add click interaction for more details
        card.addEventListener('click', function() {
            const speciesName = this.querySelector('h3').textContent;
            showSpeciesDetails(speciesName);
        });
    });
}

// Show detailed species information
function showSpeciesDetails(speciesName) {
    const speciesData = {
        'Cold-Water Corals': {
            scientific: 'Lophelia pertusa',
            depth: '200-1000m',
            threats: ['Ocean warming', 'Ocean acidification', 'Deep-sea mining'],
            lifespan: 'Up to 1000 years',
            growth: 'Millimeters per year'
        },
        'Deep-Sea Fish': {
            scientific: 'Hoplostethus atlanticus (Orange Roughy)',
            depth: '800-1800m',
            threats: ['Overfishing', 'Habitat destruction', 'Climate change'],
            lifespan: '100-150 years',
            growth: 'Slow maturation'
        },
        'Giant Tube Worms': {
            scientific: 'Riftia pachyptila',
            depth: '1500-3000m',
            threats: ['Hydrothermal vent mining', 'Ocean warming', 'Deoxygenation'],
            lifespan: '100-250 years',
            growth: 'Rapid when young'
        }
    };

    const data = speciesData[speciesName];
    if (!data) return;

    // Create modal or alert with details
    const details = `
        Scientific Name: ${data.scientific}
        Typical Depth: ${data.depth}
        Main Threats: ${data.threats.join(', ')}
        Lifespan: ${data.lifespan}
        Growth Rate: ${data.growth}
    `;

    alert(`${speciesName} Details:\n\n${details}`);
}

// Animate impact meters on scroll
function initializeImpactMeters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateMeter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.meter-fill').forEach(meter => {
        observer.observe(meter);
    });
}

function animateMeter(meter) {
    const targetWidth = meter.style.width;
    meter.style.width = '0%';

    setTimeout(() => {
        meter.style.transition = 'width 1.5s ease-in-out';
        meter.style.width = targetWidth;
    }, 200);
}

// Depth visualization interaction
function initializeDepthVisualization() {
    const depthLayers = document.querySelectorAll('.depth-layer');

    depthLayers.forEach(layer => {
        layer.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
        });

        layer.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });

        layer.addEventListener('click', function() {
            const depth = this.textContent;
            showDepthInfo(depth);
        });
    });
}

function showDepthInfo(depth) {
    const depthInfo = {
        'Surface (0-200m)': {
            temperature: 'Varies by region',
            light: 'Full sunlight',
            organisms: 'Phytoplankton, fish, marine mammals',
            threats: 'Pollution, overfishing, warming'
        },
        'Twilight (200-1000m)': {
            temperature: '4-10°C',
            light: 'Very dim',
            organisms: 'Deep-sea fish, squid, corals',
            threats: 'Deep-sea fishing, warming'
        },
        'Midnight (1000-4000m)': {
            temperature: '2-4°C',
            light: 'Complete darkness',
            organisms: 'Anglerfish, giant squid, chemosynthetic communities',
            threats: 'Mining, warming, deoxygenation'
        },
        'Abyss (4000-6000m)': {
            temperature: '1-3°C',
            light: 'Complete darkness',
            organisms: 'Sea cucumbers, amphipods, bacterial mats',
            threats: 'Mining, plastic pollution, warming'
        },
        'Hadal (6000-11000m)': {
            temperature: '1-2°C',
            light: 'Complete darkness',
            organisms: 'Specialized amphipods, bacteria',
            threats: 'Trench mining, warming, pressure changes'
        }
    };

    const info = depthInfo[depth];
    if (!info) return;

    const message = `
        ${depth}
        Temperature: ${info.temperature}
        Light Level: ${info.light}
        Key Organisms: ${info.organisms}
        Main Threats: ${info.threats}
    `;

    alert(message);
}

// Initialize depth visualization
initializeDepthVisualization();

// Add smooth scrolling for navigation links
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