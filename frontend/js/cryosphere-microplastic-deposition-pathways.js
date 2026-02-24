// Cryosphere Microplastic Deposition Pathways - JavaScript
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
    const cards = content.querySelectorAll('.science-card');

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

// Chart System
let depositionChart;

function initializeCharts() {
    const ctx = document.getElementById('depositionChart');
    if (!ctx) return;

    depositionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Microplastic Deposition (particles/L)',
                data: [45, 52, 49, 61, 55, 68, 72, 65, 58, 51, 47, 43],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Microplastic Deposition in Arctic Snow'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Particles per Liter'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Update Chart Function
function updateChart(viewType) {
    if (!depositionChart) return;

    let labels, data, title;

    switch(viewType) {
        case 'monthly':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            data = [45, 52, 49, 61, 55, 68, 72, 65, 58, 51, 47, 43];
            title = 'Monthly Microplastic Deposition in Arctic Snow';
            break;
        case 'seasonal':
            labels = ['Winter', 'Spring', 'Summer', 'Fall'];
            data = [47, 58, 68, 52];
            title = 'Seasonal Microplastic Deposition in Arctic Snow';
            break;
        case 'annual':
            labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
            data = [52, 55, 58, 61, 64, 67];
            title = 'Annual Microplastic Deposition Trends';
            break;
    }

    depositionChart.data.labels = labels;
    depositionChart.data.datasets[0].data = data;
    depositionChart.options.plugins.title.text = title;
    depositionChart.update();
}

// Animation System
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
    document.querySelectorAll('.science-card, .impact-card, .solution-card, .mechanism-card').forEach(card => {
        observer.observe(card);
    });
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

    // Add ARIA labels
    tabButtons.forEach(button => {
        const tabId = button.getAttribute('data-tab');
        const content = document.getElementById(tabId);
        button.setAttribute('aria-controls', tabId);
        content.setAttribute('aria-labelledby', button.id || `tab-${tabId}`);
    });
}

// Smooth Scrolling for Navigation
document.querySelectorAll('.nav-menu a[href^="#"]').forEach(anchor => {
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

// Particle Animation Effect (Optional)
function createParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
            ctx.fill();
        });
    }

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create initial particles
    for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
    }

    animate();
}

// Initialize particle effect on load (optional)
// createParticleEffect();

// Performance Monitoring
function monitorPerformance() {
    if ('performance' in window && 'getEntriesByType' in performance) {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.fetchStart;

            console.log(`Page load time: ${loadTime}ms`);

            // Send to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    value: Math.round(loadTime)
                });
            }
        });
    }
}

monitorPerformance();