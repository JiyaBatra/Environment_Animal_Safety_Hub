// Desert Biological Soil Crust Degradation Dashboard JavaScript

class DesertBiocrustDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.charts = {};
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupCharts();
        this.loadData();
        this.setupEventListeners();
        this.animateStats();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });
    }

    switchSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;
        this.updateCharts();
    }

    setupCharts() {
        this.setupRegionalHealthChart();
        this.setupCarbonFixationChart();
        this.setupNitrogenFixationChart();
    }

    setupRegionalHealthChart() {
        const ctx = document.getElementById('regional-health-chart');
        if (!ctx) return;

        this.charts.regionalHealth = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mojave', 'Colorado Plateau', 'Chihuahuan', 'Negev', 'Arabian', 'Great Victoria', 'Sahara-Sahel'],
                datasets: [{
                    label: 'Biocrust Health Index (%)',
                    data: [35, 42, 28, 38, 25, 45, 22],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(201, 203, 207, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(201, 203, 207, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
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

    setupCarbonFixationChart() {
        const ctx = document.getElementById('carbon-fixation-chart');
        if (!ctx) return;

        this.charts.carbonFixation = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2000', '2005', '2010', '2015', '2020', '2025'],
                datasets: [{
                    label: 'Carbon Fixation Rate (g C/m²/day)',
                    data: [3.2, 2.9, 2.6, 2.3, 2.1, 1.8],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Degraded Areas Rate',
                    data: [0.8, 1.1, 1.4, 1.6, 1.8, 2.0],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    setupNitrogenFixationChart() {
        const ctx = document.getElementById('nitrogen-fixation-chart');
        if (!ctx) return;

        this.charts.nitrogenFixation = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2000', '2005', '2010', '2015', '2020', '2025'],
                datasets: [{
                    label: 'Nitrogen Fixation Rate (kg N/ha/year)',
                    data: [2.8, 2.5, 2.2, 1.9, 1.7, 1.4],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Recovery Potential',
                    data: [1.2, 1.4, 1.6, 1.8, 2.0, 2.2],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateCharts() {
        // Update charts based on current section and timeframe selections
        const carbonTimeframe = document.getElementById('carbon-timeframe');
        const nitrogenTimeframe = document.getElementById('nitrogen-timeframe');

        if (carbonTimeframe) {
            carbonTimeframe.addEventListener('change', () => {
                this.updateCarbonChart(carbonTimeframe.value);
            });
        }

        if (nitrogenTimeframe) {
            nitrogenTimeframe.addEventListener('change', () => {
                this.updateNitrogenChart(nitrogenTimeframe.value);
            });
        }
    }

    updateCarbonChart(timeframe) {
        const data = {
            annual: [3.2, 2.9, 2.6, 2.3, 2.1, 1.8],
            seasonal: [4.1, 3.8, 3.2, 2.9, 2.6, 2.2],
            decadal: [3.5, 3.1, 2.8, 2.4, 2.0, 1.6]
        };

        this.charts.carbonFixation.data.datasets[0].data = data[timeframe];
        this.charts.carbonFixation.update();
    }

    updateNitrogenChart(timeframe) {
        const data = {
            annual: [2.8, 2.5, 2.2, 1.9, 1.7, 1.4],
            seasonal: [3.5, 3.1, 2.7, 2.3, 1.9, 1.5],
            decadal: [3.0, 2.6, 2.2, 1.8, 1.4, 1.0]
        };

        this.charts.nitrogenFixation.data.datasets[0].data = data[timeframe];
        this.charts.nitrogenFixation.update();
    }

    loadData() {
        // Simulate loading real-time data
        this.simulateDataUpdates();
    }

    simulateDataUpdates() {
        setInterval(() => {
            // Update stats with slight variations
            this.updateStatValues();
        }, 5000);
    }

    updateStatValues() {
        const elements = {
            'global-coverage': ['12M km²', '11.9M km²', '12.1M km²'],
            'carbon-loss': ['1.5 Pg C', '1.48 Pg C', '1.52 Pg C'],
            'nitrogen-loss': ['15 Tg N/year', '14.8 Tg N/year', '15.2 Tg N/year'],
            'degraded-area': ['3.2M km²', '3.18M km²', '3.22M km²']
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const values = elements[id];
                element.textContent = values[Math.floor(Math.random() * values.length)];
            }
        });
    }

    animateStats() {
        // Animate progress bars and impact bars on page load
        setTimeout(() => {
            document.querySelectorAll('.progress-bar, .impact-bar').forEach(bar => {
                bar.style.width = bar.style.width || '0%';
            });
        }, 500);
    }

    setupEventListeners() {
        // Add any additional event listeners here
        document.addEventListener('DOMContentLoaded', () => {
            this.animateStats();
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DesertBiocrustDashboard();
});