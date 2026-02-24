// Urban Pollinator Nesting Substrate Shortage - Interactive Dashboard

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
    // Pollinator decline chart
    const pollinatorDeclineCtx = document.getElementById('pollinatorDeclineChart').getContext('2d');
    new Chart(pollinatorDeclineCtx, {
        type: 'line',
        data: {
            labels: ['2000', '2005', '2010', '2015', '2020', '2025'],
            datasets: [{
                label: 'Urban Bee Populations (Index)',
                data: [100, 92, 78, 65, 48, 35],
                borderColor: '#e76f51',
                backgroundColor: 'rgba(231, 111, 81, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Available Nesting Sites (Count)',
                data: [850, 780, 620, 480, 320, 210],
                borderColor: '#2d5016',
                backgroundColor: 'rgba(45, 80, 22, 0.1)',
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
                        text: 'Bee Population Index'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Nesting Sites Available'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Urban Pollinator Populations and Nesting Habitat Trends'
                }
            }
        }
    });
}

// Initialize analysis charts
function initAnalysisCharts() {
    // Nesting habitat analysis chart
    const nestingHabitatCtx = document.getElementById('nestingHabitatChart').getContext('2d');
    new Chart(nestingHabitatCtx, {
        type: 'bar',
        data: {
            labels: ['Urban Development', 'Soil Compaction', 'Dead Wood Removal', 'Pesticide Use', 'Climate Change'],
            datasets: [{
                label: 'Impact on Nesting Substrate Availability (%)',
                data: [40, 28, 18, 10, 4],
                backgroundColor: [
                    'rgba(231, 111, 81, 0.8)',
                    'rgba(244, 162, 97, 0.8)',
                    'rgba(45, 80, 22, 0.8)',
                    'rgba(233, 196, 106, 0.8)',
                    'rgba(46, 204, 113, 0.8)'
                ],
                borderColor: [
                    '#e76f51',
                    '#f4a261',
                    '#2d5016',
                    '#e9c46a',
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
                    text: 'Factors Contributing to Nesting Substrate Shortage'
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