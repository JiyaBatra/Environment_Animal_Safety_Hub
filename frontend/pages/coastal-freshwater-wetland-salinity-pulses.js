// Coastal Freshwater Wetland Salinity Pulses - Interactive Dashboard

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
    } else if (tabName === 'impacts') {
        initImpactsChart();
    } else if (tabName === 'monitoring') {
        initMonitoringCharts();
    }
}

// Initialize overview charts
function initOverviewCharts() {
    // Salinity pulse chart
    const salinityCtx = document.getElementById('salinityChart').getContext('2d');
    new Chart(salinityCtx, {
        type: 'line',
        data: {
            labels: ['Pre-storm', 'Storm Peak', 'Post-storm', 'Recovery'],
            datasets: [{
                label: 'Salinity (ppt)',
                data: [0.3, 8.5, 2.1, 0.4],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Typical Salinity Pulse During Storm Event'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Salinity (parts per thousand)'
                    }
                }
            }
        }
    });
}

// Initialize impacts chart
function initImpactsChart() {
    const impactsCtx = document.getElementById('impactsChart').getContext('2d');
    new Chart(impactsCtx, {
        type: 'bar',
        data: {
            labels: ['Low Pulse (2-3 ppt)', 'Medium Pulse (5-7 ppt)', 'High Pulse (10+ ppt)'],
            datasets: [{
                label: 'Recovery Time (weeks)',
                data: [2, 8, 24],
                backgroundColor: [
                    'rgba(39, 174, 96, 0.8)',
                    'rgba(243, 156, 18, 0.8)',
                    'rgba(231, 76, 60, 0.8)'
                ],
                borderColor: [
                    '#27ae60',
                    '#f39c12',
                    '#e74c3c'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Recovery Time vs. Salinity Pulse Intensity'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Recovery Time (weeks)'
                    }
                }
            }
        }
    });
}

// Initialize monitoring charts
function initMonitoringCharts() {
    // Real-time salinity chart
    const realtimeCtx = document.getElementById('realtimeChart').getContext('2d');
    const realtimeChart = new Chart(realtimeCtx, {
        type: 'line',
        data: {
            labels: generateTimeLabels(24),
            datasets: [{
                label: 'Salinity (ppt)',
                data: generateRandomData(24, 0.2, 1.5),
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Real-time Salinity Monitoring'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Salinity (ppt)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time (hours ago)'
                    }
                }
            }
        }
    });

    // Pulse frequency chart
    const pulseCtx = document.getElementById('pulseFrequencyChart').getContext('2d');
    new Chart(pulseCtx, {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Pulse Events',
                data: [12, 15, 18, 22, 25, 28, 32, 35, 38, 42],
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Annual Salinity Pulse Frequency Trends'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Events'
                    }
                }
            }
        }
    });

    // Update button functionality
    document.getElementById('updateBtn').addEventListener('click', function() {
        updateMonitoringData(realtimeChart);
    });
}

// Generate time labels for charts
function generateTimeLabels(hours) {
    const labels = [];
    for (let i = hours; i >= 0; i--) {
        labels.push(`${i}h ago`);
    }
    return labels;
}

// Generate random data for simulation
function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.random() * (max - min) + min);
    }
    return data;
}

// Update monitoring data
function updateMonitoringData(chart) {
    const location = document.getElementById('locationSelect').value;
    const timeRange = document.getElementById('timeRange').value;

    let dataPoints, min, max;

    switch (timeRange) {
        case '24h':
            dataPoints = 24;
            min = 0.1;
            max = 2.0;
            break;
        case '7d':
            dataPoints = 7;
            min = 0.05;
            max = 1.8;
            break;
        case '30d':
            dataPoints = 30;
            min = 0.02;
            max = 1.5;
            break;
    }

    // Adjust ranges based on location
    if (location === 'gulf') {
        min *= 1.2;
        max *= 1.3;
    } else if (location === 'atlantic') {
        min *= 0.9;
        max *= 1.1;
    }

    chart.data.labels = generateTimeLabels(dataPoints);
    chart.data.datasets[0].data = generateRandomData(dataPoints, min, max);
    chart.update();

    // Update alerts based on location
    updateAlerts(location);
}

// Update alerts based on location
function updateAlerts(location) {
    const alertsContainer = document.getElementById('alertsContainer');
    const alerts = {
        gulf: [
            { type: 'warning', title: 'High Salinity Alert', message: 'Gulf Coast sites reporting salinity > 3.0 ppt', time: '2 hours ago' },
            { type: 'info', title: 'Storm Watch', message: 'Tropical storm approaching - monitor salinity levels', time: '4 hours ago' }
        ],
        atlantic: [
            { type: 'success', title: 'Normal Conditions', message: 'All Atlantic sites within normal salinity ranges', time: '1 hour ago' }
        ],
        pacific: [
            { type: 'warning', title: 'Rising Trends', message: 'Pacific Northwest showing gradual salinity increase', time: '6 hours ago' }
        ]
    };

    const locationAlerts = alerts[location] || [];
    alertsContainer.innerHTML = locationAlerts.map(alert => `
        <div class="alert ${alert.type}">
            <span class="alert-icon">${getAlertIcon(alert.type)}</span>
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.message}</p>
                <small>${alert.time}</small>
            </div>
        </div>
    `).join('');
}

// Get alert icon based on type
function getAlertIcon(type) {
    switch (type) {
        case 'warning': return '⚠️';
        case 'success': return '✅';
        case 'info': return 'ℹ️';
        default: return '📢';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check URL hash and show appropriate tab
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showTab(hash);
    } else {
        initOverviewCharts();
    }

    // Add smooth scrolling to nav links
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading animation to update button
    const updateBtn = document.getElementById('updateBtn');
    updateBtn.addEventListener('click', function() {
        this.textContent = 'Updating...';
        this.disabled = true;

        setTimeout(() => {
            this.textContent = 'Update Data';
            this.disabled = false;
        }, 1000);
    });
});

// Handle browser back/forward buttons
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showTab(hash);
    }
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click effects to solution cards
    document.querySelectorAll('.solution-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});