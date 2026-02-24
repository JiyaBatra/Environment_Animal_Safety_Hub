// Alpine Stream Glacier Melt Dependency Loss - Interactive Dashboard

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
    // Glacier melt dependency chart
    const glacierMeltCtx = document.getElementById('glacierMeltChart').getContext('2d');
    new Chart(glacierMeltCtx, {
        type: 'line',
        data: {
            labels: ['1980', '1990', '2000', '2010', '2020', '2030'],
            datasets: [{
                label: 'Glacier Melt Contribution (%)',
                data: [85, 78, 68, 55, 42, 28],
                borderColor: '#2980b9',
                backgroundColor: 'rgba(41, 128, 185, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Stream Temperature (°C)',
                data: [4.2, 4.8, 5.5, 6.2, 7.0, 7.8],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
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
                        text: 'Glacier Contribution (%)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Stream Temperature (°C)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Alpine Stream Glacier Melt Dependency and Temperature Trends'
                }
            }
        }
    });
}

// Initialize analysis charts
function initAnalysisCharts() {
    // Hydrological regime transformation chart
    const hydrologicalRegimeCtx = document.getElementById('hydrologicalRegimeChart').getContext('2d');
    new Chart(hydrologicalRegimeCtx, {
        type: 'bar',
        data: {
            labels: ['Glacier Retreat', 'Precipitation Shift', 'Evapotranspiration', 'Permafrost Loss', 'Snowpack Decline'],
            datasets: [{
                label: 'Contribution to Hydrological Transformation (%)',
                data: [38, 24, 18, 12, 8],
                backgroundColor: [
                    'rgba(41, 128, 185, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(149, 165, 166, 0.8)',
                    'rgba(44, 62, 80, 0.8)',
                    'rgba(127, 140, 141, 0.8)'
                ],
                borderColor: [
                    '#2980b9',
                    '#3498db',
                    '#95a5a6',
                    '#2c3e50',
                    '#7f8c8d'
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
                    text: 'Factors Contributing to Hydrological Regime Transformation'
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