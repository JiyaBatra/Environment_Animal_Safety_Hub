// Migratory Bird Fat Reserve Decline - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const contentSections = document.querySelectorAll('.content-section');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs
            navTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            // Show target content section
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Region tabs
    const regionTabs = document.querySelectorAll('.region-tab');
    const regionContents = document.querySelectorAll('.region-content');

    regionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetRegion = this.getAttribute('data-region');

            // Remove active class from all region tabs
            regionTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all region contents
            regionContents.forEach(content => content.classList.remove('active'));
            // Show target region content
            document.getElementById(targetRegion + '-region').classList.add('active');
        });
    });

    // Initialize charts
    let fatReserveChart, threatsChart, successChart;

    // Fat Reserve Chart
    const fatReserveCtx = document.getElementById('fatReserveChart');
    if (fatReserveCtx) {
        fatReserveChart = new Chart(fatReserveCtx, {
            type: 'line',
            data: {
                labels: ['Pre-migration', 'Early Migration', 'Mid Migration', 'Late Migration', 'Arrival'],
                datasets: [{
                    label: 'Fat Reserve Level (%)',
                    data: [45, 35, 25, 15, 10],
                    borderColor: 'rgba(44, 95, 45, 1)',
                    backgroundColor: 'rgba(44, 95, 45, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Minimum Threshold',
                    data: [20, 20, 20, 20, 20],
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 60
                    }
                }
            }
        });
    }

    // Threats Chart
    const threatsCtx = document.getElementById('threatsChart');
    if (threatsCtx) {
        threatsChart = new Chart(threatsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Habitat Loss', 'Food Scarcity', 'Climate Change', 'Disturbance', 'Pollution'],
                datasets: [{
                    data: [35, 28, 20, 12, 5],
                    backgroundColor: [
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(23, 162, 184, 0.8)',
                        'rgba(108, 117, 125, 0.8)',
                        'rgba(52, 58, 64, 0.8)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Success Chart
    const successCtx = document.getElementById('successChart');
    if (successCtx) {
        successChart = new Chart(successCtx, {
            type: 'bar',
            data: {
                labels: ['2000', '2005', '2010', '2015', '2020', '2025'],
                datasets: [{
                    label: 'Migration Success Rate (%)',
                    data: [85, 78, 72, 65, 58, 52],
                    backgroundColor: 'rgba(40, 167, 69, 0.6)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
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

    // Monitor controls functionality
    const speciesSelect = document.getElementById('species-select');
    const regionSelect = document.getElementById('region-select');
    const timeSelect = document.getElementById('time-select');

    const fatMeterFill = document.getElementById('fat-meter-fill');
    const fatPercentage = document.getElementById('fat-percentage');
    const fatStatus = document.getElementById('fat-status');

    const foodFill = document.getElementById('food-fill');
    const habitatFill = document.getElementById('habitat-fill');
    const disturbanceFill = document.getElementById('disturbance-fill');

    // Data for different combinations
    const monitorData = {
        shorebird: {
            atlantic: {
                current: { fat: 28, food: 35, habitat: 42, disturbance: 65 },
                historical: { fat: 42, food: 55, habitat: 68, disturbance: 45 },
                projected: { fat: 18, food: 25, habitat: 35, disturbance: 75 }
            },
            mississippi: {
                current: { fat: 35, food: 45, habitat: 52, disturbance: 55 },
                historical: { fat: 48, food: 65, habitat: 75, disturbance: 35 },
                projected: { fat: 22, food: 32, habitat: 42, disturbance: 68 }
            },
            pacific: {
                current: { fat: 32, food: 42, habitat: 48, disturbance: 58 },
                historical: { fat: 45, food: 62, habitat: 72, disturbance: 38 },
                projected: { fat: 20, food: 28, habitat: 38, disturbance: 72 }
            },
            europe: {
                current: { fat: 25, food: 32, habitat: 38, disturbance: 72 },
                historical: { fat: 40, food: 52, habitat: 65, disturbance: 42 },
                projected: { fat: 15, food: 22, habitat: 28, disturbance: 82 }
            }
        },
        waterfowl: {
            atlantic: {
                current: { fat: 38, food: 52, habitat: 58, disturbance: 45 },
                historical: { fat: 55, food: 72, habitat: 78, disturbance: 28 },
                projected: { fat: 28, food: 38, habitat: 48, disturbance: 58 }
            },
            mississippi: {
                current: { fat: 42, food: 58, habitat: 65, disturbance: 38 },
                historical: { fat: 62, food: 78, habitat: 85, disturbance: 22 },
                projected: { fat: 32, food: 45, habitat: 55, disturbance: 48 }
            },
            pacific: {
                current: { fat: 40, food: 55, habitat: 62, disturbance: 42 },
                historical: { fat: 58, food: 75, habitat: 82, disturbance: 25 },
                projected: { fat: 30, food: 42, habitat: 52, disturbance: 52 }
            },
            europe: {
                current: { fat: 35, food: 48, habitat: 55, disturbance: 52 },
                historical: { fat: 52, food: 68, habitat: 75, disturbance: 32 },
                projected: { fat: 25, food: 35, habitat: 45, disturbance: 65 }
            }
        },
        songbird: {
            atlantic: {
                current: { fat: 22, food: 28, habitat: 35, disturbance: 78 },
                historical: { fat: 38, food: 48, habitat: 55, disturbance: 52 },
                projected: { fat: 12, food: 18, habitat: 25, disturbance: 88 }
            },
            mississippi: {
                current: { fat: 25, food: 32, habitat: 42, disturbance: 72 },
                historical: { fat: 42, food: 55, habitat: 65, disturbance: 45 },
                projected: { fat: 15, food: 22, habitat: 32, disturbance: 82 }
            },
            pacific: {
                current: { fat: 24, food: 30, habitat: 38, disturbance: 75 },
                historical: { fat: 40, food: 52, habitat: 62, disturbance: 48 },
                projected: { fat: 14, food: 20, habitat: 28, disturbance: 85 }
            },
            europe: {
                current: { fat: 20, food: 25, habitat: 32, disturbance: 82 },
                historical: { fat: 35, food: 45, habitat: 55, disturbance: 55 },
                projected: { fat: 10, food: 15, habitat: 22, disturbance: 92 }
            }
        },
        raptor: {
            atlantic: {
                current: { fat: 30, food: 38, habitat: 45, disturbance: 62 },
                historical: { fat: 48, food: 58, habitat: 68, disturbance: 38 },
                projected: { fat: 20, food: 28, habitat: 35, disturbance: 75 }
            },
            mississippi: {
                current: { fat: 32, food: 42, habitat: 52, disturbance: 58 },
                historical: { fat: 50, food: 62, habitat: 72, disturbance: 32 },
                projected: { fat: 22, food: 32, habitat: 42, disturbance: 68 }
            },
            pacific: {
                current: { fat: 31, food: 40, habitat: 48, disturbance: 60 },
                historical: { fat: 49, food: 60, habitat: 70, disturbance: 35 },
                projected: { fat: 21, food: 30, habitat: 38, disturbance: 72 }
            },
            europe: {
                current: { fat: 28, food: 35, habitat: 42, disturbance: 68 },
                historical: { fat: 45, food: 55, habitat: 65, disturbance: 42 },
                projected: { fat: 18, food: 25, habitat: 32, disturbance: 78 }
            }
        }
    };

    function updateMonitor() {
        const species = speciesSelect.value;
        const region = regionSelect.value;
        const time = timeSelect.value;

        const data = monitorData[species][region][time];

        // Update fat meter
        fatMeterFill.style.width = data.fat + '%';
        fatPercentage.textContent = data.fat + '%';

        // Update status
        let status = 'Critical - Migration at risk';
        if (data.fat >= 40) status = 'Excellent - Optimal for migration';
        else if (data.fat >= 30) status = 'Good - Adequate for migration';
        else if (data.fat >= 20) status = 'Fair - Marginal for migration';
        else if (data.fat >= 10) status = 'Poor - High risk of failure';
        fatStatus.textContent = status;

        // Update indicators
        foodFill.style.width = data.food + '%';
        habitatFill.style.width = data.habitat + '%';
        disturbanceFill.style.width = data.disturbance + '%';

        // Update success chart
        const successData = {
            current: [58, 62, 55, 52, 48, 45],
            historical: [85, 82, 78, 75, 72, 68],
            projected: [45, 42, 38, 35, 32, 28]
        };

        successChart.data.datasets[0].data = successData[time];
        successChart.update();
    }

    // Add event listeners for monitor controls
    speciesSelect.addEventListener('change', updateMonitor);
    regionSelect.addEventListener('change', updateMonitor);
    timeSelect.addEventListener('change', updateMonitor);

    // Initialize monitor
    updateMonitor();

    // Animate species energy bars on scroll
    const speciesCards = document.querySelectorAll('.species-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target.querySelector('.energy-bar');
                const percentage = bar.nextElementSibling.textContent;
                const width = percentage.replace('%', '');
                bar.style.setProperty('--width', width + '%');
            }
        });
    });

    speciesCards.forEach(card => observer.observe(card));

    // Add smooth scrolling
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

    // Simulate real-time updates
    setInterval(() => {
        // Slight random variations in charts
        if (fatReserveChart) {
            fatReserveChart.data.datasets[0].data = fatReserveChart.data.datasets[0].data.map(val =>
                Math.max(5, Math.min(55, val + (Math.random() - 0.5) * 2))
            );
            fatReserveChart.update();
        }
    }, 10000);
});