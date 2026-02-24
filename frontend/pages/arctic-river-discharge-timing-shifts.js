// Arctic River Discharge Timing Shifts - JavaScript

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
            type: 'bar',
            data: {
                labels: ['Primary Productivity', 'Fisheries', 'Coastal Erosion', 'Biodiversity'],
                datasets: [{
                    label: 'Impact Severity (%)',
                    data: [75, 60, 45, 55],
                    backgroundColor: [
                        '#1976D2',
                        '#42A5F5',
                        '#90CAF9',
                        '#BBDEFB'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed.y + '%';
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
            const text = stat.textContent;
            if (text.includes('weeks')) {
                animateValue(stat, 0, 3, 1000, ' weeks');
            } else if (text.includes('%')) {
                const target = parseFloat(text.replace('%', ''));
                animateValue(stat, 0, target, 1000, '%');
            } else if (text.includes('major')) {
                animateValue(stat, 0, 8, 1000, ' major');
            }
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
    const cards = document.querySelectorAll('.cause-card, .consequence-card, .impact-item');
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

    // Add interactive river list
    const riverList = document.querySelector('.sidebar-card ul');
    if (riverList) {
        const rivers = riverList.querySelectorAll('li');
        rivers.forEach(river => {
            river.addEventListener('click', function() {
                // Remove active class from all rivers
                rivers.forEach(r => r.classList.remove('active'));
                // Add active class to clicked river
                this.classList.add('active');

                // Here you could load specific data for the selected river
                console.log('Selected river:', this.textContent);
            });
        });
    }

    console.log('Arctic River Discharge Timing Shifts page initialized');
});