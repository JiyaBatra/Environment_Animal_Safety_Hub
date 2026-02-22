// Desert Biological Soil Crust Degradation - JavaScript

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

    // Initialize function chart
    const functionCtx = document.getElementById('functionChart');
    if (functionCtx) {
        new Chart(functionCtx, {
            type: 'radar',
            data: {
                labels: ['Nitrogen Fixation', 'Carbon Sequestration', 'Soil Stability', 'Water Retention', 'Biodiversity'],
                datasets: [{
                    label: 'Healthy Biocrust',
                    data: [100, 100, 100, 100, 100],
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    pointBackgroundColor: '#4caf50',
                    pointBorderColor: '#4caf50',
                    pointRadius: 6
                }, {
                    label: 'Degraded Biocrust',
                    data: [30, 40, 25, 35, 20],
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    pointBackgroundColor: '#f44336',
                    pointBorderColor: '#f44336',
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Biocrust Function Comparison',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
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
                }
            }
        });
    }

    // Simulator functionality
    const disturbanceSlider = document.getElementById('disturbance-level');
    const recoverySlider = document.getElementById('recovery-time');
    const precipitationSlider = document.getElementById('precipitation');
    const grazingSelect = document.getElementById('grazing-pressure');

    const disturbanceValue = document.getElementById('disturbance-level-value');
    const recoveryValue = document.getElementById('recovery-time-value');
    const precipitationValue = document.getElementById('precipitation-value');

    const nitrogenFill = document.getElementById('nitrogen-fill');
    const carbonFill = document.getElementById('carbon-fill');
    const nitrogenResult = document.getElementById('nitrogen-result');
    const carbonResult = document.getElementById('carbon-result');

    const erosionFill = document.getElementById('erosion-fill');
    const waterFill = document.getElementById('water-fill');
    const biodiversityFill = document.getElementById('biodiversity-fill');

    // Update display values
    function updateDisplayValues() {
        disturbanceValue.textContent = disturbanceSlider.value;
        recoveryValue.textContent = recoverySlider.value;
        precipitationValue.textContent = precipitationSlider.value;
    }

    // Calculate nitrogen fixation based on parameters
    function calculateNitrogenFixation() {
        const disturbance = parseInt(disturbanceSlider.value);
        const recovery = parseInt(recoverySlider.value);
        const precipitation = parseInt(precipitationSlider.value);
        const grazing = grazingSelect.value;

        // Base nitrogen fixation
        let nitrogen = 100;

        // Disturbance impact (higher disturbance = lower fixation)
        nitrogen -= disturbance * 0.8;

        // Recovery factor (more time = higher recovery)
        const recoveryFactor = Math.min(recovery / 50, 1);
        nitrogen += (100 - nitrogen) * recoveryFactor * 0.6;

        // Precipitation factor (optimal: 100-200mm)
        if (precipitation < 100) {
            nitrogen *= (precipitation / 100) * 0.8;
        } else if (precipitation > 200) {
            nitrogen *= 1 - ((precipitation - 200) / 200) * 0.3;
        }

        // Grazing impact
        switch (grazing) {
            case 'light':
                nitrogen *= 0.85;
                break;
            case 'moderate':
                nitrogen *= 0.7;
                break;
            case 'heavy':
                nitrogen *= 0.4;
                break;
        }

        return Math.max(0, Math.min(100, nitrogen));
    }

    // Calculate carbon sequestration
    function calculateCarbonSequestration() {
        const disturbance = parseInt(disturbanceSlider.value);
        const recovery = parseInt(recoverySlider.value);
        const precipitation = parseInt(precipitationSlider.value);
        const grazing = grazingSelect.value;

        // Base carbon sequestration
        let carbon = 100;

        // Disturbance impact
        carbon -= disturbance * 0.7;

        // Recovery factor
        const recoveryFactor = Math.min(recovery / 40, 1);
        carbon += (100 - carbon) * recoveryFactor * 0.5;

        // Precipitation factor (optimal: 150-250mm)
        if (precipitation < 150) {
            carbon *= (precipitation / 150) * 0.9;
        } else if (precipitation > 250) {
            carbon *= 1 - ((precipitation - 250) / 150) * 0.2;
        }

        // Grazing impact
        switch (grazing) {
            case 'light':
                carbon *= 0.9;
                break;
            case 'moderate':
                carbon *= 0.75;
                break;
            case 'heavy':
                carbon *= 0.5;
                break;
        }

        return Math.max(0, Math.min(100, carbon));
    }

    // Update simulator results
    function updateSimulator() {
        updateDisplayValues();

        const nitrogen = calculateNitrogenFixation();
        const carbon = calculateCarbonSequestration();

        // Update fixation meters
        nitrogenFill.style.width = nitrogen + '%';
        carbonFill.style.width = carbon + '%';
        nitrogenResult.textContent = Math.round(nitrogen) + '%';
        carbonResult.textContent = Math.round(carbon) + '%';

        // Update stability indicators
        const erosion = Math.max(10, 100 - (parseInt(disturbanceSlider.value) * 0.6) + (parseInt(recoverySlider.value) * 0.4));
        const water = Math.max(15, 100 - (parseInt(disturbanceSlider.value) * 0.5) + (parseInt(recoverySlider.value) * 0.3));
        const biodiversity = Math.max(5, 100 - (parseInt(disturbanceSlider.value) * 0.8) + (parseInt(recoverySlider.value) * 0.5));

        erosionFill.style.width = erosion + '%';
        waterFill.style.width = water + '%';
        biodiversityFill.style.width = biodiversity + '%';
    }

    // Add event listeners
    disturbanceSlider.addEventListener('input', updateSimulator);
    recoverySlider.addEventListener('input', updateSimulator);
    precipitationSlider.addEventListener('input', updateSimulator);
    grazingSelect.addEventListener('change', updateSimulator);

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

    // Add interactive tooltips for crust types
    const crustTypeItems = document.querySelectorAll('.crust-types li');
    crustTypeItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.background = 'rgba(245, 124, 0, 0.1)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'transparent';
        });
    });

    // Add dynamic color changes for meters based on values
    function updateMeterColors() {
        const nitrogenValue = parseInt(nitrogenResult.textContent);
        const carbonValue = parseInt(carbonResult.textContent);

        // Nitrogen meter color
        if (nitrogenValue > 70) {
            nitrogenFill.style.background = 'linear-gradient(90deg, #4caf50, #81c784)';
        } else if (nitrogenValue > 40) {
            nitrogenFill.style.background = 'linear-gradient(90deg, #ff9800, #ffb74d)';
        } else {
            nitrogenFill.style.background = 'linear-gradient(90deg, #f44336, #ef5350)';
        }

        // Carbon meter color
        if (carbonValue > 70) {
            carbonFill.style.background = 'linear-gradient(90deg, #2196f3, #64b5f6)';
        } else if (carbonValue > 40) {
            carbonFill.style.background = 'linear-gradient(90deg, #ff9800, #ffb74d)';
        } else {
            carbonFill.style.background = 'linear-gradient(90deg, #f44336, #ef5350)';
        }
    }

    // Update colors when simulator changes
    const originalUpdateSimulator = updateSimulator;
    updateSimulator = function() {
        originalUpdateSimulator();
        updateMeterColors();
    };

    // Initialize colors
    updateMeterColors();
});