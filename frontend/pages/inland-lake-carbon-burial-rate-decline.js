// Inland Lake Carbon Burial Rate Decline - Interactive Dashboard

// Tab switching functionality
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');

    // Update URL hash
    window.location.hash = tabName;

    // Initialize charts for the active tab
    if (tabName === 'overview') {
        initOverviewCharts();
    } else if (tabName === 'analysis') {
        initAnalysisCharts();
    } else if (tabName === 'calculator') {
        initCalculator();
    }
}

// Initialize overview charts
function initOverviewCharts() {
    // Carbon burial rate decline chart
    const carbonBurialCtx = document.getElementById('carbonBurialChart').getContext('2d');
    new Chart(carbonBurialCtx, {
        type: 'line',
        data: {
            labels: ['1970', '1980', '1990', '2000', '2010', '2020', '2030'],
            datasets: [{
                label: 'Carbon Burial Rate (g C/m²/year)',
                data: [85, 78, 68, 55, 42, 28, 18],
                borderColor: '#5dade2',
                backgroundColor: 'rgba(93, 173, 226, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Lake Productivity Index',
                data: [1.2, 1.4, 1.8, 2.2, 2.8, 3.4, 4.1],
                borderColor: '#1b4f72',
                backgroundColor: 'rgba(27, 79, 114, 0.1)',
                tension: 0.4,
                fill: true,
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
                        text: 'Carbon Burial Rate (g C/m²/year)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Productivity Index'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Inland Lake Carbon Burial Rates and Productivity Trends'
                }
            }
        }
    });
}

// Initialize analysis charts
function initAnalysisCharts() {
    // Sequestration loss factors chart
    const sequestrationLossCtx = document.getElementById('sequestrationLossChart').getContext('2d');
    new Chart(sequestrationLossCtx, {
        type: 'bar',
        data: {
            labels: ['Eutrophication', 'Climate Change', 'Sediment Resuspension', 'Land Use Change', 'Hydrological Alteration'],
            datasets: [{
                label: 'Contribution to Sequestration Loss (%)',
                data: [38, 28, 18, 12, 4],
                backgroundColor: [
                    'rgba(93, 173, 226, 0.8)',
                    'rgba(46, 134, 193, 0.8)',
                    'rgba(133, 193, 233, 0.8)',
                    'rgba(27, 79, 114, 0.8)',
                    'rgba(52, 73, 94, 0.8)'
                ],
                borderColor: [
                    '#5dade2',
                    '#2e86c1',
                    '#85c1e9',
                    '#1b4f72',
                    '#34495e'
                ],
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
                        text: 'Contribution Percentage (%)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Factors Contributing to Long-term Sequestration Loss'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Initialize calculator
function initCalculator() {
    // Initialize calculator chart with default data
    const calculatorCtx = document.getElementById('calculatorChart').getContext('2d');
    window.calculatorChart = new Chart(calculatorCtx, {
        type: 'line',
        data: {
            labels: ['Current', '10 Years', '20 Years', '30 Years', '40 Years', '50 Years'],
            datasets: [{
                label: 'Carbon Burial Rate (g C/m²/year)',
                data: [45, 42, 38, 33, 27, 20],
                borderColor: '#5dade2',
                backgroundColor: 'rgba(93, 173, 226, 0.1)',
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
                    title: {
                        display: true,
                        text: 'Carbon Burial Rate (g C/m²/year)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Projected Carbon Burial Rate Decline'
                }
            }
        }
    });
}

// Calculate carbon burial rate
function calculateBurialRate() {
    // Get input values
    const lakeArea = parseFloat(document.getElementById('lakeArea').value);
    const waterDepth = parseFloat(document.getElementById('waterDepth').value);
    const productivity = parseFloat(document.getElementById('productivity').value);
    const sedimentation = parseFloat(document.getElementById('sedimentation').value);
    const eutrophication = parseFloat(document.getElementById('eutrophication').value);
    
    // Base burial rate calculation (simplified model)
    // Burial rate = f(productivity, sedimentation, eutrophication)
    const baseRate = (productivity * 0.1) + (sedimentation * 2) - (eutrophication * 20);
    const currentRate = Math.max(baseRate, 5); // Minimum 5 g C/m²/year
    
    // Projected decline over 50 years (simplified model)
    const declineRate = 0.015; // 1.5% annual decline
    const projectedRate = currentRate * Math.pow(1 - declineRate, 50);
    
    // Calculate loss percentage
    const lossPercentage = ((currentRate - projectedRate) / currentRate * 100).toFixed(1);
    
    // Calculate annual carbon sequestered (tons CO2)
    // Convert g C/m²/year to tons CO2/year
    // 1 g C = 3.67 g CO2, lake area in km² = lake area * 1e6 m²
    const annualSequestered = (currentRate * lakeArea * 1e6 * 3.67 / 1e9).toFixed(2);
    
    // Update results
    document.getElementById('currentRate').textContent = currentRate.toFixed(1) + ' g C/m²/year';
    document.getElementById('projectedRate').textContent = projectedRate.toFixed(1) + ' g C/m²/year';
    document.getElementById('lossPercentage').textContent = lossPercentage + '%';
    document.getElementById('annualSequestered').textContent = annualSequestered + ' tons CO₂/year';
    
    // Update chart
    const projectedData = [];
    for (let year = 0; year <= 50; year += 10) {
        projectedData.push(currentRate * Math.pow(1 - declineRate, year));
    }
    
    window.calculatorChart.data.datasets[0].data = projectedData;
    window.calculatorChart.update();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check URL hash for initial tab
    const hash = window.location.hash.substring(1);
    if (hash) {
        showTab(hash);
    } else {
        // Initialize overview charts by default
        initOverviewCharts();
    }

    // Handle browser back/forward
    window.addEventListener('hashchange', function() {
        const newHash = window.location.hash.substring(1);
        if (newHash) {
            showTab(newHash);
        }
    });
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add click effects to solution cards
    const solutionCards = document.querySelectorAll('.solution-card');
    solutionCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.backgroundColor = 'var(--light-bg)';
            setTimeout(() => {
                this.style.backgroundColor = 'white';
            }, 150);
        });
    });
});