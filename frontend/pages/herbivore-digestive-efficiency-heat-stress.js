// Herbivore Digestive Efficiency Under Heat Stress - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const contentSections = document.querySelectorAll('.content-section');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs
            navTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            // Show target content section
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Initialize impact chart
    const impactCtx = document.getElementById('impactChart');
    if (impactCtx) {
        new Chart(impactCtx, {
            type: 'doughnut',
            data: {
                labels: ['Population Declines', 'Trophic Cascades', 'Agricultural Losses', 'Other Impacts'],
                datasets: [{
                    data: [35, 25, 30, 10],
                    backgroundColor: [
                        '#FF5722',
                        '#FF8A65',
                        '#FFAB91',
                        '#FFCCBC'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Animate stats on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        observer.observe(statsSection);
    }

    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.textContent.replace('%', '').replace('°', ''));
            const suffix = stat.textContent.includes('%') ? '%' : stat.textContent.includes('°') ? '°C' : '';
            animateValue(stat, 0, target, 1000, suffix);
        });
    }

    function animateValue(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const endTime = startTime + duration;

        function update(currentTime) {
            if (currentTime >= endTime) {
                element.textContent = end + suffix;
                return;
            }

            const progress = (currentTime - startTime) / duration;
            const current = start + (end - start) * easeOutCubic(progress);
            element.textContent = Math.round(current * 10) / 10 + suffix;

            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Add hover effects to cards
    const cards = document.querySelectorAll('.mechanism-card, .mitigation-card, .impact-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    // Smooth scrolling for anchor links
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

    // Add loading animation for content sections
    contentSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Trigger animation when tab is activated
    function showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    // Override tab click to include animation
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Existing tab switching logic
            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            contentSections.forEach(section => {
                section.classList.remove('active');
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
            });

            document.getElementById(targetTab).classList.add('active');
            showSection(targetTab);
        });
    });

    // Show initial active section
    showSection('overview');

    // Add keyboard navigation for tabs
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeTab = document.querySelector('.nav-tab.active');
            const allTabs = Array.from(navTabs);
            const currentIndex = allTabs.indexOf(activeTab);

            let newIndex;
            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
            } else {
                newIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
            }

            allTabs[newIndex].click();
        }
    });

    console.log('Herbivore Digestive Efficiency page initialized');
});