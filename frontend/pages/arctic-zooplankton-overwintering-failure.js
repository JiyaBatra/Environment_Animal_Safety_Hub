// Arctic Zooplankton Overwintering Failure - Interactive Dashboard

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
    }
}

// Initialize overview charts
function initOverviewCharts() {
    // Zooplankton overwintering success chart
    const zooplanktonSurvivalCtx = document.getElementById('zooplanktonSurvivalChart').getContext('2d');
    new Chart(zooplanktonSurvivalCtx, {
        type: 'line',
        data: {
            labels: ['1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2025'],
            datasets: [{
                label: 'Overwintering Success Rate (%)',
                data: [92, 88, 82, 75, 68, 58, 45, 38, 28, 22],
                borderColor: '#5dade2',
                backgroundColor: 'rgba(93, 173, 226, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Arctic Sea Ice Extent (million km²)',
                data: [7.8, 7.2, 6.8, 6.2, 5.8, 5.2, 4.6, 4.1, 3.8, 3.2],
                borderColor: '#1e3a5f',
                backgroundColor: 'rgba(30, 58, 95, 0.1)',
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
                        text: 'Overwintering Success Rate (%)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Sea Ice Extent (million km²)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Arctic Zooplankton Overwintering Success and Sea Ice Trends'
                }
            }
        }
    });
}

// Initialize analysis charts
function initAnalysisCharts() {
    // Survival threshold shifts chart
    const survivalThresholdCtx = document.getElementById('survivalThresholdChart').getContext('2d');
    new Chart(survivalThresholdCtx, {
        type: 'bar',
        data: {
            labels: ['Sea Ice Loss', 'Ocean Warming', 'Stratification Changes', 'Lipid Deficiency', 'Predator Pressure'],
            datasets: [{
                label: 'Contribution to Survival Threshold Shifts (%)',
                data: [35, 28, 18, 12, 7],
                backgroundColor: [
                    'rgba(93, 173, 226, 0.8)',
                    'rgba(74, 144, 226, 0.8)',
                    'rgba(133, 193, 233, 0.8)',
                    'rgba(30, 58, 95, 0.8)',
                    'rgba(52, 73, 94, 0.8)'
                ],
                borderColor: [
                    '#5dade2',
                    '#4a90e2',
                    '#85c1e9',
                    '#1e3a5f',
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
                    text: 'Factors Contributing to Survival Threshold Shifts'
                },
                legend: {
                    display: false
                }
            }
        }
    });
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