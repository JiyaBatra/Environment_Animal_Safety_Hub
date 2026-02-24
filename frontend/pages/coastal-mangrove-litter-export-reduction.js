// Coastal Mangrove Litter Export Reduction - Interactive Dashboard

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
    // Mangrove litter export chart
    const mangroveLitterCtx = document.getElementById('mangroveLitterChart').getContext('2d');
    new Chart(mangroveLitterCtx, {
        type: 'line',
        data: {
            labels: ['1990', '1995', '2000', '2005', '2010', '2015', '2020', '2025'],
            datasets: [{
                label: 'Litter Export (tons/ha/year)',
                data: [12.5, 11.8, 10.2, 8.9, 7.2, 5.8, 4.1, 2.8],
                borderColor: '#40916c',
                backgroundColor: 'rgba(64, 145, 108, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Mangrove Coverage (million ha)',
                data: [18.2, 17.8, 16.9, 15.8, 14.2, 12.8, 11.3, 9.8],
                borderColor: '#1e3a2e',
                backgroundColor: 'rgba(30, 58, 46, 0.1)',
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
                        text: 'Litter Export (tons/ha/year)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Mangrove Coverage (million ha)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Coastal Mangrove Litter Export and Coverage Trends'
                }
            }
        }
    });
}

// Initialize analysis charts
function initAnalysisCharts() {
    // Detrital food web disruption chart
    const detritalFoodWebCtx = document.getElementById('detritalFoodWebChart').getContext('2d');
    new Chart(detritalFoodWebCtx, {
        type: 'bar',
        data: {
            labels: ['Deforestation', 'Sea Level Rise', 'Reduced Freshwater', 'Pollution', 'Climate Change'],
            datasets: [{
                label: 'Contribution to Detrital Food Web Disruption (%)',
                data: [42, 22, 16, 12, 8],
                backgroundColor: [
                    'rgba(64, 145, 108, 0.8)',
                    'rgba(45, 106, 79, 0.8)',
                    'rgba(116, 198, 157, 0.8)',
                    'rgba(82, 183, 136, 0.8)',
                    'rgba(30, 58, 46, 0.8)'
                ],
                borderColor: [
                    '#40916c',
                    '#2d6a4f',
                    '#74c69d',
                    '#52b788',
                    '#1e3a2e'
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
                    text: 'Factors Contributing to Detrital Food Web Disruption'
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