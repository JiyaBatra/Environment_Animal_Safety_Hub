// Ice-Dependent Algal Bloom Collapse - JavaScript

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

    // Region tabs
    const regionTabs = document.querySelectorAll('.region-tab');
    const regionContents = document.querySelectorAll('.region-content');

    regionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetRegion = this.getAttribute('data-region');

            // Remove active class from all region tabs
            regionTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all region contents
            regionContents.forEach(content => content.classList.remove('active'));
            // Show target region content
            document.getElementById(targetRegion + '-region').classList.add('active');
        });
    });

    // Initialize productivity chart
    const productivityCtx = document.getElementById('productivityChart');
    if (productivityCtx) {
        new Chart(productivityCtx, {
            type: 'line',
            data: {
                labels: ['1980', '1990', '2000', '2010', '2020', '2030'],
                datasets: [{
                    label: 'Arctic Ice Algae Productivity',
                    data: [100, 95, 85, 70, 55, 35],
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Antarctic Ice Algae Productivity',
                    data: [100, 98, 90, 75, 60, 40],
                    borderColor: '#42a5f5',
                    backgroundColor: 'rgba(66, 165, 245, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Ice Algae Productivity Trends (1980-2030)',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 110,
                        title: {
                            display: true,
                            text: 'Relative Productivity (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                }
            }
        });
    }

    // Initialize biomass chart for simulator
    const biomassCtx = document.getElementById('biomassChart');
    let biomassChart;

    if (biomassCtx) {
        biomassChart = new Chart(biomassCtx, {
            type: 'doughnut',
            data: {
                labels: ['Ice Diatoms', 'Phaeocystis', 'Other Algae', 'Detritus'],
                datasets: [{
                    data: [60, 20, 15, 5],
                    backgroundColor: [
                        '#1976d2',
                        '#42a5f5',
                        '#90caf9',
                        '#e3f2fd'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Simulator functionality
    const iceDurationSlider = document.getElementById('ice-duration');
    const iceThicknessSlider = document.getElementById('ice-thickness');
    const temperatureSlider = document.getElementById('temperature');
    const lightLevelSlider = document.getElementById('light-level');

    const iceDurationValue = document.getElementById('ice-duration-value');
    const iceThicknessValue = document.getElementById('ice-thickness-value');
    const temperatureValue = document.getElementById('temperature-value');
    const lightLevelValue = document.getElementById('light-level-value');

    const productivityFill = document.getElementById('productivity-fill');
    const productivityResult = document.getElementById('productivity-result');

    const krillFill = document.getElementById('krill-fill');
    const fishFill = document.getElementById('fish-fill');
    const mammalFill = document.getElementById('mammal-fill');

    // Update display values
    function updateDisplayValues() {
        iceDurationValue.textContent = iceDurationSlider.value;
        iceThicknessValue.textContent = iceThicknessSlider.value;
        temperatureValue.textContent = temperatureSlider.value;
        lightLevelValue.textContent = lightLevelSlider.value;
    }

    // Calculate productivity based on parameters
    function calculateProductivity() {
        const iceDuration = parseInt(iceDurationSlider.value);
        const iceThickness = parseInt(iceThicknessSlider.value);
        const temperature = parseFloat(temperatureSlider.value);
        const lightLevel = parseFloat(lightLevelSlider.value);

        // Base productivity calculation
        let productivity = 100;

        // Ice duration factor (optimal: 120-180 days)
        if (iceDuration < 120) {
            productivity *= (iceDuration / 120) * 0.8;
        } else if (iceDuration > 180) {
            productivity *= 1 - ((iceDuration - 180) / 120) * 0.2;
        }

        // Ice thickness factor (optimal: 100-200 cm)
        if (iceThickness < 100) {
            productivity *= (iceThickness / 100) * 0.7;
        } else if (iceThickness > 200) {
            productivity *= 1 - ((iceThickness - 200) / 200) * 0.3;
        }

        // Temperature factor (optimal: -1.8 to -0.5°C)
        if (temperature < -1.8 || temperature > -0.5) {
            productivity *= 0.6;
        }

        // Light level factor (optimal: 0.5-2.0)
        if (lightLevel < 0.5) {
            productivity *= (lightLevel / 0.5) * 0.5;
        } else if (lightLevel > 2.0) {
            productivity *= 1 - ((lightLevel - 2.0) / 3.0) * 0.4;
        }

        return Math.max(0, Math.min(100, productivity));
    }

    // Update simulator results
    function updateSimulator() {
        updateDisplayValues();

        const productivity = calculateProductivity();

        // Update productivity meter
        productivityFill.style.width = productivity + '%';
        productivityResult.textContent = Math.round(productivity) + '%';

        // Update biomass chart
        if (biomassChart) {
            const diatomFraction = Math.max(0.3, productivity / 100 * 0.6);
            const phaeocystisFraction = Math.max(0.1, productivity / 100 * 0.2);
            const otherFraction = Math.max(0.05, productivity / 100 * 0.15);
            const detritusFraction = 1 - diatomFraction - phaeocystisFraction - otherFraction;

            biomassChart.data.datasets[0].data = [
                diatomFraction * 100,
                phaeocystisFraction * 100,
                otherFraction * 100,
                detritusFraction * 100
            ];
            biomassChart.update();
        }

        // Update ecosystem impact indicators
        const krillImpact = Math.max(20, productivity * 0.8);
        const fishImpact = Math.max(15, productivity * 0.7);
        const mammalImpact = Math.max(10, productivity * 0.6);

        krillFill.style.width = krillImpact + '%';
        fishFill.style.width = fishImpact + '%';
        mammalFill.style.width = mammalImpact + '%';
    }

    // Add event listeners to sliders
    iceDurationSlider.addEventListener('input', updateSimulator);
    iceThicknessSlider.addEventListener('input', updateSimulator);
    temperatureSlider.addEventListener('input', updateSimulator);
    lightLevelSlider.addEventListener('input', updateSimulator);

    // Initialize simulator
    updateSimulator();

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

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.info-card, .science-card, .impact-card, .solution-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add loading animation for charts
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.style.opacity = '0';
        setTimeout(() => {
            container.style.transition = 'opacity 0.5s ease';
            container.style.opacity = '1';
        }, 500);
    });
});