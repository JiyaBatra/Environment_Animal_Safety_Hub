// Drought-Driven Tree Mortality and Fungal Outbreaks - JavaScript
// Interactive features for forest health crisis simulation

document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initDroughtSimulator();
    initFungalCalculator();
    initPathogenAnalyzer();
    initForestMonitoring();
    initModals();
    initThemeToggle();
});

// Scroll Animations
function initScrollAnimations() {
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

    // Observe all sections
    document.querySelectorAll('.interactive-section, .calculator-section, .analyzer-section, .monitoring-section, .mitigation-section').forEach(section => {
        observer.observe(section);
    });
}

// Drought Stress Simulator
function initDroughtSimulator() {
    const durationSlider = document.getElementById('drought-duration');
    const deficitSlider = document.getElementById('precipitation-deficit');
    const moistureSlider = document.getElementById('soil-moisture');
    const tempSlider = document.getElementById('temperature-increase');

    const durationValue = document.getElementById('duration-value');
    const deficitValue = document.getElementById('deficit-value');
    const moistureValue = document.getElementById('moisture-value');
    const tempValue = document.getElementById('temp-value');

    const canvas = document.getElementById('stress-canvas');
    const ctx = canvas.getContext('2d');

    // Update display values
    function updateValues() {
        durationValue.textContent = `${durationSlider.value} months`;
        deficitValue.textContent = `${deficitSlider.value}%`;
        moistureValue.textContent = `${moistureSlider.value}%`;
        tempValue.textContent = `+${tempSlider.value}°C`;
        updateStressVisualization();
        updateImpactMetrics();
    }

    // Event listeners
    durationSlider.addEventListener('input', updateValues);
    deficitSlider.addEventListener('input', updateValues);
    moistureSlider.addEventListener('input', updateValues);
    tempSlider.addEventListener('input', updateValues);

    // Initial update
    updateValues();

    function updateStressVisualization() {
        const duration = parseInt(durationSlider.value);
        const deficit = parseInt(deficitSlider.value);
        const moisture = parseInt(moistureSlider.value);
        const temp = parseInt(tempSlider.value);

        // Calculate stress levels
        const hydraulicStress = Math.min(100, (deficit * 0.8) + ((100 - moisture) * 0.6) + (temp * 2) + (duration * 1.5));
        const defenseCapacity = Math.max(0, 100 - hydraulicStress * 0.7);
        const fungalSusceptibility = Math.min(100, hydraulicStress * 0.8);

        // Update indicators
        document.getElementById('hydraulic-stress').textContent = getStressLevel(hydraulicStress);
        document.getElementById('defense-capacity').textContent = `${Math.round(defenseCapacity)}%`;
        document.getElementById('fungal-susceptibility').textContent = getSusceptibilityLevel(fungalSusceptibility);

        // Draw stress profile
        drawStressProfile(ctx, hydraulicStress, defenseCapacity, fungalSusceptibility);
    }

    function getStressLevel(stress) {
        if (stress < 30) return 'Low';
        if (stress < 60) return 'Moderate';
        if (stress < 80) return 'High';
        return 'Critical';
    }

    function getSusceptibilityLevel(susceptibility) {
        if (susceptibility < 30) return 'Low';
        if (susceptibility < 60) return 'Moderate';
        if (susceptibility < 80) return 'High';
        return 'Very High';
    }

    function drawStressProfile(ctx, hydraulic, defense, fungal) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 60;

        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#f8f9fa';
        ctx.fill();
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw stress arcs
        drawStressArc(ctx, centerX, centerY, radius, hydraulic, '#ff5722', 0);
        drawStressArc(ctx, centerX, centerY, radius * 0.7, defense, '#4caf50', 1);
        drawStressArc(ctx, centerX, centerY, radius * 0.4, fungal, '#c46210', 2);

        // Draw center
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#2d5a27';
        ctx.fill();
    }

    function drawStressArc(ctx, centerX, centerY, radius, value, color, layer) {
        const startAngle = (layer * Math.PI) / 3;
        const endAngle = startAngle + (value / 100) * (Math.PI / 3);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineWidth = 8;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    function updateImpactMetrics() {
        const duration = parseInt(durationSlider.value);
        const deficit = parseInt(deficitSlider.value);
        const moisture = parseInt(moistureSlider.value);
        const temp = parseInt(tempSlider.value);

        const totalStress = (deficit + (100 - moisture) + temp * 2 + duration) / 4;

        // Health status
        let healthStatus, healthChange, healthColor;
        if (totalStress < 30) {
            healthStatus = 'Healthy'; healthChange = '95% of normal function'; healthColor = '#4caf50';
        } else if (totalStress < 50) {
            healthStatus = 'Stressed'; healthChange = '75% of normal function'; healthColor = '#ff9800';
        } else if (totalStress < 70) {
            healthStatus = 'Severely Stressed'; healthChange = '50% of normal function'; healthColor = '#ff5722';
        } else {
            healthStatus = 'Critical'; healthChange = '25% of normal function'; healthColor = '#f44336';
        }

        document.getElementById('health-status').textContent = healthStatus;
        document.getElementById('health-status').style.color = healthColor;
        document.getElementById('health-change').textContent = healthChange;

        // Pathogen pressure
        const pathogenPressure = Math.min(100, totalStress * 0.8);
        let pathogenStatus, pathogenChange;
        if (pathogenPressure < 30) {
            pathogenStatus = 'Low'; pathogenChange = '1x normal levels';
        } else if (pathogenPressure < 60) {
            pathogenStatus = 'Elevated'; pathogenChange = '2x normal levels';
        } else if (pathogenPressure < 80) {
            pathogenStatus = 'High'; pathogenChange = '3x normal levels';
        } else {
            pathogenStatus = 'Critical'; pathogenChange = '5x normal levels';
        }

        document.getElementById('pathogen-pressure').textContent = pathogenStatus;
        document.getElementById('pathogen-change').textContent = pathogenChange;

        // Mortality risk
        const mortalityRisk = Math.min(100, totalStress * 0.6);
        let mortalityStatus, mortalityChange;
        if (mortalityRisk < 20) {
            mortalityStatus = 'Low'; mortalityChange = '5% probability';
        } else if (mortalityRisk < 40) {
            mortalityStatus = 'Moderate'; mortalityChange = '25% probability';
        } else if (mortalityRisk < 60) {
            mortalityStatus = 'High'; mortalityChange = '60% probability';
        } else {
            mortalityStatus = 'Very High'; mortalityChange = '85% probability';
        }

        document.getElementById('mortality-risk').textContent = mortalityStatus;
        document.getElementById('mortality-change').textContent = mortalityChange;
    }
}

// Fungal Outbreak Calculator
function initFungalCalculator() {
    const treeSelect = document.getElementById('tree-species');
    const durationInput = document.getElementById('stress-duration');
    const pathogenInput = document.getElementById('pathogen-load');
    const ageInput = document.getElementById('tree-age');

    function updateCalculator() {
        const species = treeSelect.value;
        const duration = parseInt(durationInput.value);
        const pathogenLoad = parseInt(pathogenInput.value);
        const age = parseInt(ageInput.value);

        updateInfectionProgress(species, duration, pathogenLoad, age);
        updateMortalityPrediction(species, duration, pathogenLoad, age);
        updateRecommendations(species, duration, pathogenLoad, age);
    }

    treeSelect.addEventListener('change', updateCalculator);
    durationInput.addEventListener('input', updateCalculator);
    pathogenInput.addEventListener('input', updateCalculator);
    ageInput.addEventListener('input', updateCalculator);

    updateCalculator();
}

function updateInfectionProgress(species, duration, pathogenLoad, age) {
    // Species susceptibility factors
    const speciesFactors = {
        pine: 1.2,
        oak: 0.8,
        spruce: 1.4,
        beech: 1.0,
        maple: 0.9,
        fir: 1.3
    };

    const susceptibility = speciesFactors[species] || 1.0;
    const ageFactor = Math.max(0.5, Math.min(2.0, age / 50)); // Age vulnerability
    const pathogenFactor = pathogenLoad / 5000;

    const infectionProgress = Math.min(5, Math.round((duration * susceptibility * ageFactor * pathogenFactor) / 2));

    // Update timeline
    for (let i = 1; i <= 5; i++) {
        const circle = document.getElementById(`stage-${i}`);
        if (i <= infectionProgress) {
            circle.classList.add('completed');
            circle.classList.remove('active');
        } else if (i === infectionProgress + 1) {
            circle.classList.add('active');
            circle.classList.remove('completed');
        } else {
            circle.classList.remove('active', 'completed');
        }
    }
}

function updateMortalityPrediction(species, duration, pathogenLoad, age) {
    const speciesFactors = {
        pine: 1.2,
        oak: 0.8,
        spruce: 1.4,
        beech: 1.0,
        maple: 0.9,
        fir: 1.3
    };

    const susceptibility = speciesFactors[species] || 1.0;
    const ageFactor = Math.max(0.5, Math.min(2.0, age / 50));
    const pathogenFactor = pathogenLoad / 5000;

    const riskScore = duration * susceptibility * ageFactor * pathogenFactor;
    const timeToDeath = Math.max(3, Math.round(24 - riskScore * 2)); // months
    const infectionRate = Math.round(riskScore * 0.5 * 100) / 100; // cm/day
    const survivalProb = Math.max(5, Math.round(100 - riskScore * 8)); // percentage

    document.getElementById('time-to-death').textContent = `${timeToDeath} months`;
    document.getElementById('infection-rate').textContent = `${infectionRate} cm/day`;
    document.getElementById('survival-prob').textContent = `${survivalProb}%`;

    // Update mortality chart
    const canvas = document.getElementById('mortality-canvas');
    const ctx = canvas.getContext('2d');
    drawMortalityChart(ctx, riskScore);
}

function drawMortalityChart(ctx, riskScore) {
    ctx.clearRect(0, 0, 300, 200);

    const months = [3, 6, 9, 12, 15, 18, 21, 24];
    const mortalityRates = months.map(month => {
        return Math.min(100, (month * riskScore) / 8);
    });

    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, 180);
    ctx.lineTo(280, 180);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const y = 180 - (i * 16);
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(280, y);
        ctx.stroke();
    }

    // Draw mortality curve
    ctx.strokeStyle = '#f44336';
    ctx.lineWidth = 3;
    ctx.beginPath();
    months.forEach((month, index) => {
        const x = 40 + (index * 30);
        const y = 180 - (mortalityRates[index] * 1.6);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#f44336';
    months.forEach((month, index) => {
        const x = 40 + (index * 30);
        const y = 180 - (mortalityRates[index] * 1.6);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function updateRecommendations(species, duration, pathogenLoad, age) {
    const recommendations = document.getElementById('fungal-recommendations');
    const riskScore = duration * (pathogenLoad / 5000) * Math.max(0.5, Math.min(2.0, age / 50));

    let recs = [];

    if (riskScore > 15) {
        recs.push('Immediate fungicide application required');
        recs.push('Sanitation cutting of infected trees');
        recs.push('Establish quarantine zones');
    } else if (riskScore > 10) {
        recs.push('Monitor for early infection symptoms');
        recs.push('Apply preventive fungicides');
        recs.push('Improve tree vigor through fertilization');
    } else if (riskScore > 5) {
        recs.push('Regular monitoring of tree health');
        recs.push('Preventive silvicultural treatments');
        recs.push('Maintain soil moisture levels');
    } else {
        recs.push('Continue routine forest health monitoring');
        recs.push('Implement drought-resistant species where appropriate');
        recs.push('Maintain biodiversity in forest stands');
    }

    recommendations.innerHTML = recs.map(rec => `<li>${rec}</li>`).join('');
}

// Pathogen Dynamics Analyzer
function initPathogenAnalyzer() {
    const pathogenCanvas = document.getElementById('pathogen-canvas');
    const ctx = pathogenCanvas.getContext('2d');

    drawPathogenComposition(ctx);

    // Outbreak gauge
    const gaugeCanvas = document.getElementById('outbreak-gauge-canvas');
    const gaugeCtx = gaugeCanvas.getContext('2d');
    drawOutbreakGauge(gaugeCtx, 75);
}

function drawPathogenComposition(ctx) {
    const data = [
        { label: 'Primary Pathogens', value: 35, color: '#c46210' },
        { label: 'Secondary Invaders', value: 25, color: '#8b2635' },
        { label: 'Saprophytic Fungi', value: 30, color: '#654321' },
        { label: 'Endophytic Fungi', value: 10, color: '#d4a574' }
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;

    data.forEach(item => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.arc(175, 125, 100, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(175, 125);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        currentAngle += sliceAngle;
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(175, 125, 40, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#2d5a27';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Pathogen', 175, 115);
    ctx.fillText('Composition', 175, 135);
}

function drawOutbreakGauge(ctx, percentage) {
    const centerX = 100;
    const centerY = 100;
    const radius = 80;

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.8, Math.PI * 2.2);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#e9ecef';
    ctx.stroke();

    // Progress arc
    const progressAngle = (percentage / 100) * (Math.PI * 1.4);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.8, Math.PI * 0.8 + progressAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = percentage > 70 ? '#f44336' : percentage > 40 ? '#ff9800' : '#4caf50';
    ctx.stroke();

    // Percentage text
    ctx.fillStyle = '#2d5a27';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${percentage}%`, centerX, centerY + 8);
}

// Forest Health Monitoring
function initForestMonitoring() {
    // Canopy health gauge
    const canopyCanvas = document.getElementById('canopy-canvas');
    const canopyCtx = canopyCanvas.getContext('2d');
    drawHealthGauge(canopyCtx, 68, '#4caf50');

    // Forest health map
    const mapCanvas = document.getElementById('forest-map-canvas');
    const mapCtx = mapCanvas.getContext('2d');
    drawForestMap(mapCtx);
}

function drawHealthGauge(ctx, percentage, color) {
    const centerX = 75;
    const centerY = 75;
    const radius = 60;

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#e9ecef';
    ctx.stroke();

    // Progress arc
    const progressAngle = (percentage / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + progressAngle);
    ctx.lineWidth = 12;
    ctx.strokeStyle = color;
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 12, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function drawForestMap(ctx) {
    const width = 400;
    const height = 300;

    // Create a simple forest pattern
    for (let x = 0; x < width; x += 20) {
        for (let y = 0; y < height; y += 20) {
            const health = Math.random();

            if (health > 0.8) {
                ctx.fillStyle = '#4caf50'; // Healthy
            } else if (health > 0.6) {
                ctx.fillStyle = '#ff9800'; // Stressed
            } else if (health > 0.4) {
                ctx.fillStyle = '#c46210'; // Infected
            } else {
                ctx.fillStyle = '#757575'; // Dead
            }

            ctx.fillRect(x, y, 18, 18);
        }
    }

    // Add some random infection clusters
    for (let i = 0; i < 5; i++) {
        const clusterX = Math.random() * width;
        const clusterY = Math.random() * height;
        const clusterSize = Math.random() * 40 + 20;

        ctx.beginPath();
        ctx.arc(clusterX, clusterY, clusterSize, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(196, 98, 16, 0.3)';
        ctx.fill();
    }
}

// Modal Management
function initModals() {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            const modal = document.getElementById(`${modalId}-modal`);
            modal.classList.add('show');
        });
    });

    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            close.closest('.modal').classList.remove('show');
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Scroll Progress
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Animation on scroll
const style = document.createElement('style');
style.textContent = `
    .interactive-section, .calculator-section, .analyzer-section, .monitoring-section, .mitigation-section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);