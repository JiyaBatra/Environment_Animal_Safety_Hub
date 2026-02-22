// Fish Gill Morphology Plasticity Limits Interactive Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initializeDashboard();
});

function initializeDashboard() {
    // Tab switching functionality
    initializeTabs();

    // Initialize charts
    initializeCharts();

    // Initialize controls
    initializeControls();

    // Load initial data
    loadInitialData();
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

let charts = {};

function initializeCharts() {
    // Thermal Limits Charts
    initializeThermalCharts();

    // Gill Plasticity Charts
    initializeGillCharts();

    // Species Comparison Chart
    initializeSpeciesChart();

    // Adaptation Monitoring Chart
    initializeMonitoringChart();
}

function initializeThermalCharts() {
    // Temperature Tolerance Ranges Chart
    const thermalToleranceCtx = document.getElementById('thermal-tolerance-chart').getContext('2d');
    charts.thermalTolerance = new Chart(thermalToleranceCtx, {
        type: 'bar',
        data: {
            labels: ['Atlantic Salmon', 'Rainbow Trout', 'Common Carp', 'Nile Tilapia', 'Atlantic Cod', 'Clownfish'],
            datasets: [{
                label: 'Optimal Range (°C)',
                data: [8, 12, 20, 25, 8, 26],
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: '#4caf50',
                borderWidth: 1
            }, {
                label: 'Critical Thermal Max (°C)',
                data: [25, 23, 32, 38, 18, 34],
                backgroundColor: 'rgba(244, 67, 54, 0.6)',
                borderColor: '#f44336',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Gill Damage vs Temperature Chart
    const gillDamageCtx = document.getElementById('gill-damage-chart').getContext('2d');
    charts.gillDamage = new Chart(gillDamageCtx, {
        type: 'line',
        data: {
            labels: ['15', '18', '21', '24', '27', '30', '33'],
            datasets: [{
                label: 'Lamellar Damage (%)',
                data: [0, 5, 15, 35, 65, 85, 95],
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Functional Impairment (%)',
                data: [0, 2, 8, 20, 45, 70, 90],
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Damage/Impairment (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

function initializeGillCharts() {
    // Gill Surface Area Changes Chart
    const gillSurfaceCtx = document.getElementById('gill-surface-chart').getContext('2d');
    charts.gillSurface = new Chart(gillSurfaceCtx, {
        type: 'line',
        data: {
            labels: ['18°C', '21°C', '24°C', '27°C', '30°C'],
            datasets: [{
                label: 'Surface Area (cm²/g)',
                data: [1.2, 1.4, 1.6, 1.8, 1.5],
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Lamellar Density (lamellae/mm)',
                data: [20, 22, 25, 28, 24],
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Surface Area'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Lamellar Density'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });

    // Plasticity Limits by Species Chart
    const plasticityLimitsCtx = document.getElementById('plasticity-limits-chart').getContext('2d');
    charts.plasticityLimits = new Chart(plasticityLimitsCtx, {
        type: 'radar',
        data: {
            labels: ['Thermal Range', 'Morphological Change', 'Physiological Capacity', 'Recovery Rate', 'Genetic Variation'],
            datasets: [{
                label: 'Atlantic Salmon',
                data: [25, 30, 20, 15, 10],
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                pointBackgroundColor: '#f44336'
            }, {
                label: 'Common Carp',
                data: [80, 75, 70, 65, 60],
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                pointBackgroundColor: '#4caf50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function initializeSpeciesChart() {
    const speciesComparisonCtx = document.getElementById('species-comparison-chart').getContext('2d');
    charts.speciesComparison = new Chart(speciesComparisonCtx, {
        type: 'horizontalBar',
        data: {
            labels: ['Atlantic Salmon', 'Rainbow Trout', 'Common Carp', 'Nile Tilapia', 'Atlantic Cod', 'Bluefin Tuna', 'Clownfish'],
            datasets: [{
                label: 'Thermal Tolerance Range (°C)',
                data: [17, 11, 12, 13, 10, 15, 8],
                backgroundColor: [
                    '#f44336',
                    '#ff9800',
                    '#4caf50',
                    '#2196f3',
                    '#9c27b0',
                    '#00bcd4',
                    '#ff5722'
                ]
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tolerance Range (°C)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function initializeMonitoringChart() {
    const monitoringCtx = document.getElementById('monitoring-chart').getContext('2d');
    charts.monitoring = new Chart(monitoringCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Water Temperature (°C)',
                data: [],
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                yAxisID: 'y'
            }, {
                label: 'Gill Ventilation Rate (breaths/min)',
                data: [],
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                yAxisID: 'y1'
            }, {
                label: 'Oxygen Uptake (%)',
                data: [],
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                yAxisID: 'y2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (minutes)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Ventilation Rate'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                },
                y2: {
                    type: 'linear',
                    display: false,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Oxygen Uptake (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            animation: {
                duration: 0 // Disable animation for real-time updates
            }
        }
    });
}

function initializeControls() {
    // Thermal Limits Controls
    document.getElementById('update-thermal-data').addEventListener('click', updateThermalData);

    // Gill Plasticity Controls
    document.getElementById('update-plasticity-data').addEventListener('click', updatePlasticityData);

    // Species selector checkboxes
    document.querySelectorAll('.species-list input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSpeciesComparison);
    });

    // Monitoring controls
    document.getElementById('start-monitoring').addEventListener('click', startMonitoring);

    // Select controls
    document.getElementById('water-type').addEventListener('change', updateWaterType);
    document.getElementById('thermal-metric').addEventListener('change', updateThermalMetric);
    document.getElementById('gill-structure').addEventListener('change', updateGillStructure);
    document.getElementById('plasticity-phase').addEventListener('change', updatePlasticityPhase);
}

function loadInitialData() {
    // Simulate loading initial data
    updateThermalIndicators();
    updateGillMetrics();
    animateProgressBars();
}

function updateThermalData() {
    const button = document.getElementById('update-thermal-data');
    button.classList.add('loading');
    button.textContent = 'Analyzing...';

    setTimeout(() => {
        // Update thermal tolerance data
        const toleranceData = generateRandomData(6, 15, 35);
        const maxData = generateRandomData(6, 18, 38);
        charts.thermalTolerance.data.datasets[0].data = toleranceData;
        charts.thermalTolerance.data.datasets[1].data = maxData;
        charts.thermalTolerance.update();

        // Update gill damage data
        const damageData = generateRandomData(7, 0, 95);
        const impairmentData = generateRandomData(7, 0, 90);
        charts.gillDamage.data.datasets[0].data = damageData;
        charts.gillDamage.data.datasets[1].data = impairmentData;
        charts.gillDamage.update();

        updateThermalIndicators();
        button.classList.remove('loading');
        button.textContent = 'Update Analysis';
    }, 1500);
}

function updatePlasticityData() {
    const button = document.getElementById('update-plasticity-data');
    button.classList.add('loading');
    button.textContent = 'Analyzing...';

    setTimeout(() => {
        // Update gill surface data
        const surfaceData = generateRandomData(5, 1.2, 1.8);
        const densityData = generateRandomData(5, 20, 28);
        charts.gillSurface.data.datasets[0].data = surfaceData;
        charts.gillSurface.data.datasets[1].data = densityData;
        charts.gillSurface.update();

        // Update plasticity limits data
        const salmonData = generateRandomData(5, 10, 30);
        const carpData = generateRandomData(5, 60, 80);
        charts.plasticityLimits.data.datasets[0].data = salmonData;
        charts.plasticityLimits.data.datasets[1].data = carpData;
        charts.plasticityLimits.update();

        updateGillMetrics();
        animateProgressBars();
        button.classList.remove('loading');
        button.textContent = 'Analyze Plasticity';
    }, 1500);
}

function updateSpeciesComparison() {
    const selectedSpecies = Array.from(document.querySelectorAll('.species-list input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    // Filter chart data based on selected species
    const allSpecies = ['salmon', 'trout', 'carp', 'tilapia', 'cod', 'tuna', 'clownfish'];
    const allLabels = ['Atlantic Salmon', 'Rainbow Trout', 'Common Carp', 'Nile Tilapia', 'Atlantic Cod', 'Bluefin Tuna', 'Clownfish'];
    const allData = [17, 11, 12, 13, 10, 15, 8];

    const filteredLabels = [];
    const filteredData = [];

    selectedSpecies.forEach(species => {
        const index = allSpecies.indexOf(species);
        if (index !== -1) {
            filteredLabels.push(allLabels[index]);
            filteredData.push(allData[index]);
        }
    });

    charts.speciesComparison.data.labels = filteredLabels;
    charts.speciesComparison.data.datasets[0].data = filteredData;
    charts.speciesComparison.update();
}

let monitoringInterval;
let monitoringTime = 0;
let monitoringData = {
    temperature: [],
    ventilation: [],
    oxygen: []
};

function startMonitoring() {
    const button = document.getElementById('start-monitoring');
    const species = document.getElementById('monitoring-species').value;
    const increment = parseInt(document.getElementById('temp-increment').value);

    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        button.textContent = 'Start Monitoring';
        monitoringInterval = null;
        return;
    }

    button.textContent = 'Stop Monitoring';
    monitoringTime = 0;
    monitoringData = {
        temperature: [],
        ventilation: [],
        oxygen: []
    };

    // Reset chart
    charts.monitoring.data.labels = [];
    charts.monitoring.data.datasets.forEach(dataset => {
        dataset.data = [];
    });
    charts.monitoring.update();

    // Start monitoring
    monitoringInterval = setInterval(() => {
        monitoringTime += 1;

        // Simulate temperature increase
        const baseTemp = 18;
        const currentTemp = Math.min(baseTemp + (monitoringTime * increment * 0.1), 32);

        // Simulate gill responses
        const ventilationRate = 25 + (currentTemp - baseTemp) * 2 + Math.random() * 5;
        const oxygenUptake = Math.max(95 - (currentTemp - baseTemp) * 3 + Math.random() * 5, 60);

        // Update data arrays
        monitoringData.temperature.push(currentTemp);
        monitoringData.ventilation.push(ventilationRate);
        monitoringData.oxygen.push(oxygenUptake);

        // Keep only last 20 data points
        if (monitoringData.temperature.length > 20) {
            monitoringData.temperature.shift();
            monitoringData.ventilation.shift();
            monitoringData.oxygen.shift();
        }

        // Update chart
        const timeLabels = Array.from({length: monitoringData.temperature.length}, (_, i) => i + 1);
        charts.monitoring.data.labels = timeLabels;
        charts.monitoring.data.datasets[0].data = monitoringData.temperature;
        charts.monitoring.data.datasets[1].data = monitoringData.ventilation;
        charts.monitoring.data.datasets[2].data = monitoringData.oxygen;
        charts.monitoring.update();

        // Update real-time metrics
        document.getElementById('monitor-temp').textContent = currentTemp.toFixed(1) + '°C';
        document.getElementById('ventilation-rate').textContent = ventilationRate.toFixed(0) + ' breaths/min';
        document.getElementById('oxygen-uptake').textContent = oxygenUptake.toFixed(0) + '%';

        // Update adaptation stages
        updateAdaptationStages(currentTemp);

        // Stop if critical temperature reached
        if (currentTemp >= 30) {
            clearInterval(monitoringInterval);
            button.textContent = 'Monitoring Complete';
            monitoringInterval = null;
        }
    }, 2000);
}

function updateAdaptationStages(temperature) {
    const stages = document.querySelectorAll('.stage');
    const baseTemp = 18;

    stages.forEach((stage, index) => {
        const fill = stage.querySelector('.stage-fill');
        let progress = 0;

        if (temperature >= baseTemp + (index * 2)) {
            if (index === stages.length - 1 && temperature >= baseTemp + 8) {
                progress = Math.min(100, (temperature - (baseTemp + 8)) * 25);
            } else {
                progress = 100;
            }
        }

        fill.style.width = progress + '%';

        if (progress > 0) {
            stage.classList.add('active');
        }
    });
}

function updateWaterType() {
    const waterType = document.getElementById('water-type').value;
    // Update charts based on water type
    console.log('Updating for water type:', waterType);
}

function updateThermalMetric() {
    const metric = document.getElementById('thermal-metric').value;
    // Update thermal charts based on metric
    console.log('Updating thermal metric:', metric);
}

function updateGillStructure() {
    const structure = document.getElementById('gill-structure').value;
    // Update gill charts based on structure
    console.log('Updating gill structure:', structure);
}

function updatePlasticityPhase() {
    const phase = document.getElementById('plasticity-phase').value;
    // Update plasticity charts based on phase
    console.log('Updating plasticity phase:', phase);
}

function updateThermalIndicators() {
    // Update temperature display
    const temp = 18 + Math.random() * 12;
    document.getElementById('current-temp').textContent = temp.toFixed(1) + '°C';

    const tempStatus = temp > 26 ? 'Critical' : temp > 22 ? 'Stressed' : 'Normal';
    document.getElementById('temp-status').textContent = tempStatus;

    const tempGauge = (temp - 15) / (35 - 15) * 100;
    document.getElementById('temp-gauge-fill').style.width = Math.min(tempGauge, 100) + '%';

    // Update gill health
    const healthScore = Math.max(10, 100 - (temp - 18) * 8);
    document.getElementById('gill-health-score').textContent = Math.round(healthScore) + '/100';

    const healthFill = document.getElementById('health-fill');
    healthFill.style.width = healthScore + '%';

    if (healthScore > 70) {
        healthFill.className = 'health-fill good';
    } else if (healthScore > 40) {
        healthFill.className = 'health-fill fair';
    } else {
        healthFill.className = 'health-fill poor';
    }

    // Update oxygen saturation
    const oxygen = Math.max(60, 95 - (temp - 18) * 2.5);
    document.getElementById('oxygen-saturation').textContent = Math.round(oxygen) + '%';
}

function updateGillMetrics() {
    // Update lamellar density
    document.getElementById('lamellar-density').textContent = (20 + Math.random() * 8).toFixed(1) + ' lamellae/mm';

    // Update surface area
    document.getElementById('surface-area-index').textContent = (1.2 + Math.random() * 0.8).toFixed(2) + ' m²/kg';

    // Update diffusion capacity
    const capacity = 85 + Math.random() * 15;
    document.getElementById('diffusion-capacity').textContent = Math.round(capacity) + '% efficiency';
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.stage-fill');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const targetWidth = bar.style.width || '0%';
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
        }, index * 200);
    });
}

function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.random() * (max - min) + min);
    }
    return data;
}

// Add smooth scrolling for navigation links
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

// Add loading animation to update buttons
document.querySelectorAll('.update-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('loading');
        const originalText = this.textContent;
        this.textContent = 'Updating...';

        // Remove loading state after animation
        setTimeout(() => {
            this.classList.remove('loading');
            this.textContent = originalText;
        }, 2000);
    });
});

// Initialize tooltips for better UX
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);

    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

function hideTooltip() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
}

// Performance monitoring
let lastUpdate = Date.now();
function monitorPerformance() {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdate;
    if (timeSinceLastUpdate > 5000) {
        console.log('Performance: Chart update took', timeSinceLastUpdate, 'ms');
    }
    lastUpdate = now;
}

// Add performance monitoring to chart updates
Object.keys(charts).forEach(chartKey => {
    const originalUpdate = charts[chartKey].update;
    charts[chartKey].update = function() {
        monitorPerformance();
        return originalUpdate.call(this);
    };
});