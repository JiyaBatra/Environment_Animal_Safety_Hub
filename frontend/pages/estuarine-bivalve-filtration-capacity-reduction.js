// Estuarine Bivalve Filtration Capacity Reduction - Interactive Dashboard

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
    // Filtration capacity chart
    const filtrationCtx = document.getElementById('filtrationChart').getContext('2d');
    new Chart(filtrationCtx, {
        type: 'line',
        data: {
            labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
            datasets: [{
                label: 'Filtration Capacity (L/day per bivalve)',
                data: [45, 42, 38, 35, 32, 28, 25, 22],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Water Clarity (Secchi depth, m)',
                data: [3.2, 3.0, 2.8, 2.6, 2.4, 2.2, 2.0, 1.8],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
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
                        text: 'Filtration Capacity (L/day)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Water Clarity (m)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Estuarine Bivalve Filtration Capacity vs Water Clarity Trends'
                }
            }
        }
    });
}

// Initialize analysis charts
function initAnalysisCharts() {
    // Water clarity analysis chart
    const clarityCtx = document.getElementById('clarityChart').getContext('2d');
    new Chart(clarityCtx, {
        type: 'bar',
        data: {
            labels: ['Ocean Acidification', 'Salinity Changes', 'Pollutants', 'Temperature', 'Habitat Loss'],
            datasets: [{
                label: 'Impact on Water Clarity (%)',
                data: [28, 22, 18, 15, 17],
                backgroundColor: [
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(155, 89, 182, 0.8)',
                    'rgba(241, 196, 15, 0.8)',
                    'rgba(46, 204, 113, 0.8)'
                ],
                borderColor: [
                    '#e74c3c',
                    '#3498db',
                    '#9b59b6',
                    '#f1c40f',
                    '#2ecc71'
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
                        text: 'Impact Percentage (%)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Factors Contributing to Water Clarity Decline'
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