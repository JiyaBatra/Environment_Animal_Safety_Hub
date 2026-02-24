// Hydropower Dams Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeHydropowerDamsPage();
});

function initializeHydropowerDamsPage() {
    // Initialize interactive elements
    setupMigrationSimulator();
    setupBiodiversityChart();
    setupScrollAnimations();
    setupNavigation();
    setupSmoothScrolling();
}

// Migration Impact Simulator
function setupMigrationSimulator() {
    const damSlider = document.getElementById('dam-slider');
    const damHeightDisplay = document.getElementById('dam-height');
    const migrationSuccess = document.getElementById('migration-success');
    const populationImpact = document.getElementById('population-impact');
    const canvas = document.getElementById('migration-canvas');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 150;

    let damHeight = 50;

    function updateSimulator() {
        damHeight = parseInt(damSlider.value);
        damHeightDisplay.textContent = damHeight + 'm';

        // Calculate migration success based on dam height
        // Higher dams = lower success rates
        const baseSuccess = 95;
        const heightPenalty = (damHeight / 200) * 60; // Max 60% penalty
        const successRate = Math.max(5, baseSuccess - heightPenalty);

        migrationSuccess.textContent = Math.round(successRate) + '%';

        // Determine population impact
        let impact;
        if (successRate > 80) impact = 'Low';
        else if (successRate > 60) impact = 'Medium';
        else if (successRate > 40) impact = 'High';
        else impact = 'Critical';

        populationImpact.textContent = impact;
        populationImpact.style.color = getImpactColor(impact);

        // Draw visualization
        drawMigrationVisualization(ctx, damHeight, successRate);
    }

    function getImpactColor(impact) {
        switch (impact) {
            case 'Low': return '#48bb78';
            case 'Medium': return '#ed8936';
            case 'High': return '#e53e3e';
            case 'Critical': return '#c53030';
            default: return '#6b7280';
        }
    }

    function drawMigrationVisualization(ctx, height, successRate) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw river
        ctx.fillStyle = '#63b3ed';
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

        // Draw dam
        const damX = canvas.width / 2 - 20;
        const damY = canvas.height - 40 - height * 0.8;
        ctx.fillStyle = '#718096';
        ctx.fillRect(damX, damY, 40, height * 0.8);

        // Draw fish attempting migration
        const fishCount = 8;
        for (let i = 0; i < fishCount; i++) {
            const x = 50 + (i * 40);
            const y = canvas.height - 60;

            // Only show successful fish
            if (Math.random() * 100 < successRate) {
                ctx.fillStyle = '#3182ce';
                ctx.beginPath();
                ctx.ellipse(x, y, 8, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                // Fish tail
                ctx.beginPath();
                ctx.moveTo(x - 8, y);
                ctx.lineTo(x - 12, y - 3);
                ctx.lineTo(x - 12, y + 3);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Draw blocked fish at dam
        ctx.fillStyle = '#e53e3e';
        for (let i = 0; i < Math.floor(fishCount * (1 - successRate/100)); i++) {
            const x = damX + 5 + (i * 8);
            const y = damY - 10;
            ctx.beginPath();
            ctx.ellipse(x, y, 6, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Event listener
    damSlider.addEventListener('input', updateSimulator);

    // Initial setup
    updateSimulator();
}

// Biodiversity Impact Chart
function setupBiodiversityChart() {
    const ctx = document.getElementById('biodiversity-chart');
    if (!ctx) return;

    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Fish Species', 'Aquatic Invertebrates', 'Riparian Vegetation', 'Amphibians', 'Waterfowl'],
            datasets: [{
                label: 'Pre-Dam Biodiversity',
                data: [85, 78, 82, 65, 70],
                backgroundColor: 'rgba(72, 187, 120, 0.2)',
                borderColor: 'rgba(72, 187, 120, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(72, 187, 120, 1)',
            }, {
                label: 'Post-Dam Biodiversity',
                data: [45, 52, 38, 35, 42],
                backgroundColor: 'rgba(229, 62, 62, 0.2)',
                borderColor: 'rgba(229, 62, 62, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(229, 62, 62, 1)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Biodiversity Impact Assessment',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

// Scroll Animations
function setupScrollAnimations() {
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

    // Observe all sections and cards
    document.querySelectorAll('.section, .content-card, .case-study-card, .solution-card').forEach(el => {
        observer.observe(el);
    });
}

// Navigation Highlighting
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
}

// Smooth Scrolling
function setupSmoothScrolling() {
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

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(30px);
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .nav-link.active {
        color: var(--hydro-accent);
    }

    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);