// Permafrost Thermokarst Expansion Interactive Dashboard

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
    // Wetland Formation Charts
    initializeWetlandCharts();

    // Habitat Restructuring Charts
    initializeHabitatCharts();

    // Carbon Dynamics Charts
    initializeCarbonCharts();

    // Regional Analysis Chart
    initializeRegionalChart();
}

function initializeWetlandCharts() {
    // Wetland Expansion Chart
    const wetlandExpansionCtx = document.getElementById('wetland-expansion-chart').getContext('2d');
    charts.wetlandExpansion = new Chart(wetlandExpansionCtx, {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Wetland Area (km²)',
                data: [1850, 1920, 2010, 2120, 2250, 2380, 2520, 2670, 2830, 2450],
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'New Ponds Formed',
                data: [120, 145, 168, 192, 218, 245, 275, 308, 342, 1234],
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
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
                        text: 'Wetland Area (km²)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'New Ponds'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });

    // Wetland Development Stages Chart
    const wetlandStagesCtx = document.getElementById('wetland-stages-chart').getContext('2d');
    charts.wetlandStages = new Chart(wetlandStagesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Initial Collapse', 'Wetland Maturation', 'Long-term Evolution'],
            datasets: [{
                data: [35, 45, 20],
                backgroundColor: [
                    '#ff9800',
                    '#4caf50',
                    '#2196f3'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
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

function initializeHabitatCharts() {
    // Vegetation Community Shifts Chart
    const vegetationShiftCtx = document.getElementById('vegetation-shift-chart').getContext('2d');
    charts.vegetationShift = new Chart(vegetationShiftCtx, {
        type: 'bar',
        data: {
            labels: ['Tundra', 'Shrub Tundra', 'Wetland', 'Forest'],
            datasets: [{
                label: 'Current Distribution (%)',
                data: [25, 35, 30, 10],
                backgroundColor: [
                    '#8d6e63',
                    '#4caf50',
                    '#2196f3',
                    '#9c27b0'
                ]
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
                        text: 'Percentage (%)'
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

    // Wildlife Habitat Changes Chart
    const wildlifeHabitatCtx = document.getElementById('wildlife-habitat-chart').getContext('2d');
    charts.wildlifeHabitat = new Chart(wildlifeHabitatCtx, {
        type: 'radar',
        data: {
            labels: ['Waterfowl', 'Shorebirds', 'Caribou', 'Polar Bears', 'Arctic Fox', 'Lemmings'],
            datasets: [{
                label: 'Habitat Suitability Change',
                data: [85, 75, -40, -60, 20, 15],
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                pointBackgroundColor: '#f44336'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    min: -100,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function initializeCarbonCharts() {
    // Greenhouse Gas Fluxes Chart
    const ghgFluxCtx = document.getElementById('ghg-flux-chart').getContext('2d');
    charts.ghgFlux = new Chart(ghgFluxCtx, {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'CO₂ Flux (g C m⁻² day⁻¹)',
                data: [0.8, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.1],
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                tension: 0.4
            }, {
                label: 'CH₄ Flux (mg CH₄ m⁻² day⁻¹)',
                data: [25, 28, 32, 35, 38, 42, 45, 48, 52, 35],
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
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
                        text: 'CO₂ Flux'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'CH₄ Flux'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });

    // Carbon Balance Chart
    const carbonBalanceCtx = document.getElementById('carbon-balance-chart').getContext('2d');
    charts.carbonBalance = new Chart(carbonBalanceCtx, {
        type: 'bar',
        data: {
            labels: ['Permafrost Thaw', 'Wetland Sequestration', 'Net Balance'],
            datasets: [{
                label: 'Carbon Flux (Pg C year⁻¹)',
                data: [2.8, -1.6, -1.2],
                backgroundColor: [
                    '#f44336',
                    '#4caf50',
                    '#ff9800'
                ]
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
                        text: 'Carbon Flux (Pg C year⁻¹)'
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

function initializeRegionalChart() {
    const regionalComparisonCtx = document.getElementById('regional-comparison-chart').getContext('2d');
    charts.regionalComparison = new Chart(regionalComparisonCtx, {
        type: 'horizontalBar',
        data: {
            labels: ['Western Siberia', 'Yukon Territory', 'Mackenzie Delta', 'Laptev Sea Coast', 'Canadian Arctic Islands'],
            datasets: [{
                label: 'Thermokarst Expansion (%)',
                data: [91, 85, 72, 68, 45],
                backgroundColor: [
                    '#f44336',
                    '#ff9800',
                    '#ffeb3b',
                    '#4caf50',
                    '#2196f3'
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
                    max: 100,
                    title: {
                        display: true,
                        text: 'Expansion (%)'
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

function initializeControls() {
    // Wetland Formation Controls
    document.getElementById('update-wetland-data').addEventListener('click', updateWetlandData);

    // Habitat Restructuring Controls
    document.getElementById('update-habitat-data').addEventListener('click', updateHabitatData);

    // Carbon Dynamics Controls
    document.getElementById('update-carbon-data').addEventListener('click', updateCarbonData);

    // Region and time range selectors
    document.getElementById('region-select').addEventListener('change', updateRegionData);
    document.getElementById('time-range').addEventListener('change', updateTimeRangeData);
    document.getElementById('habitat-type').addEventListener('change', updateHabitatType);
    document.getElementById('species-focus').addEventListener('change', updateSpeciesFocus);
    document.getElementById('carbon-component').addEventListener('change', updateCarbonComponent);
    document.getElementById('depth-profile').addEventListener('change', updateDepthProfile);
}

function loadInitialData() {
    // Simulate loading initial data
    updateMetrics();
    animateProgressBars();
}

function updateWetlandData() {
    const button = document.getElementById('update-wetland-data');
    button.classList.add('loading');
    button.textContent = 'Updating...';

    // Simulate API call
    setTimeout(() => {
        // Update wetland expansion data
        const newData = generateRandomData(10, 2400, 2500);
        charts.wetlandExpansion.data.datasets[0].data = newData;
        charts.wetlandExpansion.update();

        // Update wetland stages data
        const stagesData = generateRandomData(3, 20, 50);
        charts.wetlandStages.data.datasets[0].data = stagesData;
        charts.wetlandStages.update();

        updateMetrics();
        button.classList.remove('loading');
        button.textContent = 'Update Data';
    }, 1500);
}

function updateHabitatData() {
    const button = document.getElementById('update-habitat-data');
    button.classList.add('loading');
    button.textContent = 'Analyzing...';

    setTimeout(() => {
        // Update vegetation shift data
        const vegetationData = generateRandomData(4, 15, 40);
        charts.vegetationShift.data.datasets[0].data = vegetationData;
        charts.vegetationShift.update();

        // Update wildlife habitat data
        const wildlifeData = generateRandomData(6, -60, 85);
        charts.wildlifeHabitat.data.datasets[0].data = wildlifeData;
        charts.wildlifeHabitat.update();

        animateProgressBars();
        button.classList.remove('loading');
        button.textContent = 'Update Analysis';
    }, 1500);
}

function updateCarbonData() {
    const button = document.getElementById('update-carbon-data');
    button.classList.add('loading');
    button.textContent = 'Calculating...';

    setTimeout(() => {
        // Update GHG flux data
        const co2Data = generateRandomData(10, 2.0, 2.5);
        const ch4Data = generateRandomData(10, 30, 55);
        charts.ghgFlux.data.datasets[0].data = co2Data;
        charts.ghgFlux.data.datasets[1].data = ch4Data;
        charts.ghgFlux.update();

        // Update carbon balance data
        const balanceData = [2.8 + Math.random(), -1.6 + Math.random() * 0.4, -1.2 + Math.random() * 0.6];
        charts.carbonBalance.data.datasets[0].data = balanceData;
        charts.carbonBalance.update();

        updateCarbonMetrics();
        button.classList.remove('loading');
        button.textContent = 'Update Flux Data';
    }, 1500);
}

function updateRegionData() {
    const region = document.getElementById('region-select').value;
    // Update charts based on selected region
    console.log('Updating data for region:', region);
    // In a real implementation, this would fetch region-specific data
}

function updateTimeRangeData() {
    const timeRange = document.getElementById('time-range').value;
    // Update charts based on selected time range
    console.log('Updating data for time range:', timeRange);
    // In a real implementation, this would adjust data range
}

function updateHabitatType() {
    const habitatType = document.getElementById('habitat-type').value;
    // Update habitat charts based on type
    console.log('Updating habitat data for type:', habitatType);
}

function updateSpeciesFocus() {
    const speciesFocus = document.getElementById('species-focus').value;
    // Update wildlife charts based on species focus
    console.log('Updating species focus:', speciesFocus);
}

function updateCarbonComponent() {
    const component = document.getElementById('carbon-component').value;
    // Update carbon charts based on component
    console.log('Updating carbon component:', component);
}

function updateDepthProfile() {
    const depth = document.getElementById('depth-profile').value;
    // Update carbon charts based on depth profile
    console.log('Updating depth profile:', depth);
}

function updateMetrics() {
    // Update wetland metrics
    document.getElementById('total-wetland-area').textContent = (2400 + Math.random() * 100).toFixed(0) + ' km²';
    document.getElementById('new-ponds-formed').textContent = (1200 + Math.random() * 100).toFixed(0);
}

function updateCarbonMetrics() {
    // Update carbon metrics
    document.getElementById('co2-release').textContent = (2.0 + Math.random() * 0.3).toFixed(1) + ' Pg C';
    document.getElementById('ch4-emissions').textContent = (30 + Math.random() * 10).toFixed(0) + ' Tg CH₄';
    document.getElementById('net-balance').textContent = (-1.0 + Math.random() * 0.4).toFixed(1) + ' Pg C';
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const targetWidth = bar.style.width || '65%';
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

// Export data functionality (for future enhancement)
function exportChartData(chartId) {
    const chart = charts[chartId];
    if (chart) {
        const data = chart.data;
        const csv = data.labels.join(',') + '\n' +
            data.datasets[0].data.join(',');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = chartId + '_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Performance monitoring
let lastUpdate = Date.now();
function monitorPerformance() {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdate;
    if (timeSinceLastUpdate > 5000) { // Log if updates take too long
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