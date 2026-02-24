/**
 * Glacier Meltwater Turbidity and Fish Spawning Analysis
 * Issue #2457: Interactive sediment interference study
 */

// Global variables for analysis
let turbidityChart;
let temperatureChart;
let currentTurbidity = 50;
let currentTemperature = 8;
let currentFlowRate = 25;

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeControls();
    initializeCharts();
    updateAnalysis();
});

// Initialize interactive controls
function initializeControls() {
    // Turbidity slider
    const turbiditySlider = document.getElementById('turbidity-slider');
    const turbidityValue = document.getElementById('turbidity-value');

    turbiditySlider.addEventListener('input', function() {
        currentTurbidity = parseInt(this.value);
        turbidityValue.textContent = currentTurbidity + ' NTU';
        updateAnalysis();
    });

    // Temperature slider
    const temperatureSlider = document.getElementById('temperature-slider');
    const temperatureValue = document.getElementById('temperature-value');

    temperatureSlider.addEventListener('input', function() {
        currentTemperature = parseFloat(this.value);
        temperatureValue.textContent = currentTemperature + '°C';
        updateAnalysis();
    });

    // Flow rate slider
    const flowRateSlider = document.getElementById('flow-rate-slider');
    const flowRateValue = document.getElementById('flow-rate-value');

    flowRateSlider.addEventListener('input', function() {
        currentFlowRate = parseInt(this.value);
        flowRateValue.textContent = currentFlowRate + ' m³/s';
        updateAnalysis();
    });
}

// Initialize Chart.js charts
function initializeCharts() {
    // Turbidity vs Egg Survival Chart
    const turbidityCtx = document.getElementById('turbidityChart').getContext('2d');
    turbidityChart = new Chart(turbidityCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 51}, (_, i) => i * 10), // 0 to 500 NTU
            datasets: [{
                label: 'Egg Survival Rate (%)',
                data: calculateSurvivalRates(),
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Hatching Success (%)',
                data: calculateHatchingRates(),
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Turbidity (NTU)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Success Rate (%)'
                    },
                    min: 0,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });

    // Temperature Interaction Chart
    const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(temperatureCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Survival Rate vs Temperature',
                data: generateTemperatureData(),
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                borderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Water Temperature (°C)'
                    },
                    min: 0,
                    max: 20
                },
                y: {
                    title: {
                        display: true,
                        text: 'Egg Survival Rate (%)'
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

// Calculate egg survival rates based on turbidity
function calculateSurvivalRates() {
    const rates = [];
    for (let turbidity = 0; turbidity <= 500; turbidity += 10) {
        // Model: Survival = 95 * exp(-0.005 * turbidity) with temperature adjustment
        const baseSurvival = 95 * Math.exp(-0.005 * turbidity);
        const tempAdjustment = 1 - (Math.abs(currentTemperature - 8) * 0.01);
        const survival = Math.max(0, baseSurvival * tempAdjustment);
        rates.push(Math.round(survival));
    }
    return rates;
}

// Calculate hatching success rates
function calculateHatchingRates() {
    const rates = [];
    for (let turbidity = 0; turbidity <= 500; turbidity += 10) {
        // Hatching is more sensitive to turbidity
        const baseHatching = 90 * Math.exp(-0.007 * turbidity);
        const tempAdjustment = 1 - (Math.abs(currentTemperature - 10) * 0.008);
        const hatching = Math.max(0, baseHatching * tempAdjustment);
        rates.push(Math.round(hatching));
    }
    return rates;
}

// Generate temperature interaction data
function generateTemperatureData() {
    const data = [];
    for (let temp = 0; temp <= 20; temp += 1) {
        // Complex interaction between temperature and turbidity
        const turbidityEffect = Math.exp(-0.003 * currentTurbidity);
        const tempEffect = 1 - Math.pow((temp - 12) / 12, 2); // Optimal at 12°C
        const survival = 85 * turbidityEffect * tempEffect;
        data.push({
            x: temp,
            y: Math.max(0, Math.round(survival))
        });
    }
    return data;
}

// Update analysis results based on current parameters
function updateAnalysis() {
    // Calculate survival rate
    const survivalRate = calculateSurvivalRate();
    const hatchingRate = calculateHatchingRate();
    const larvalRate = calculateLarvalRate();

    // Update display values
    document.getElementById('survival-rate').textContent = survivalRate + '%';
    document.getElementById('hatching-rate').textContent = hatchingRate + '%';
    document.getElementById('larval-rate').textContent = larvalRate + '%';

    // Update trend indicators
    updateTrends(survivalRate, hatchingRate, larvalRate);

    // Update charts
    updateCharts();
}

// Calculate current survival rate
function calculateSurvivalRate() {
    // Complex model incorporating turbidity, temperature, and flow
    const turbidityEffect = Math.exp(-0.004 * currentTurbidity);
    const tempEffect = 1 - Math.abs(currentTemperature - 8) * 0.015;
    const flowEffect = 1 - Math.abs(currentFlowRate - 30) * 0.005;

    const survival = 92 * turbidityEffect * tempEffect * flowEffect;
    return Math.max(0, Math.round(survival));
}

// Calculate hatching rate
function calculateHatchingRate() {
    const turbidityEffect = Math.exp(-0.006 * currentTurbidity);
    const tempEffect = 1 - Math.abs(currentTemperature - 10) * 0.012;
    const flowEffect = 1 - Math.abs(currentFlowRate - 25) * 0.003;

    const hatching = 85 * turbidityEffect * tempEffect * flowEffect;
    return Math.max(0, Math.round(hatching));
}

// Calculate larval viability
function calculateLarvalRate() {
    const turbidityEffect = Math.exp(-0.008 * currentTurbidity);
    const tempEffect = 1 - Math.abs(currentTemperature - 12) * 0.02;
    const flowEffect = 1 - Math.abs(currentFlowRate - 20) * 0.004;

    const larval = 70 * turbidityEffect * tempEffect * flowEffect;
    return Math.max(0, Math.round(larval));
}

// Update trend indicators
function updateTrends(survival, hatching, larval) {
    const survivalTrend = document.getElementById('survival-trend');
    const hatchingTrend = document.getElementById('hatching-trend');
    const larvalTrend = document.getElementById('larval-trend');

    // Update survival trend
    if (survival > 80) {
        survivalTrend.textContent = '↗ Low risk';
        survivalTrend.style.background = '#d4edda';
        survivalTrend.style.color = '#155724';
    } else if (survival > 60) {
        survivalTrend.textContent = '→ Moderate risk';
        survivalTrend.style.background = '#fff3cd';
        survivalTrend.style.color = '#856404';
    } else {
        survivalTrend.textContent = '↗ High risk';
        survivalTrend.style.background = '#f8d7da';
        survivalTrend.style.color = '#721c24';
    }

    // Update hatching trend
    if (hatching > 75) {
        hatchingTrend.textContent = '↗ Good success';
        hatchingTrend.style.background = '#d4edda';
        hatchingTrend.style.color = '#155724';
    } else if (hatching > 50) {
        hatchingTrend.textContent = '→ Reduced success';
        hatchingTrend.style.background = '#fff3cd';
        hatchingTrend.style.color = '#856404';
    } else {
        hatchingTrend.textContent = '↗ Poor success';
        hatchingTrend.style.background = '#f8d7da';
        hatchingTrend.style.color = '#721c24';
    }

    // Update larval trend
    if (larval > 60) {
        larvalTrend.textContent = '↗ Good viability';
        larvalTrend.style.background = '#d4edda';
        larvalTrend.style.color = '#155724';
    } else if (larval > 40) {
        larvalTrend.textContent = '→ Moderate viability';
        larvalTrend.style.background = '#fff3cd';
        larvalTrend.style.color = '#856404';
    } else {
        larvalTrend.textContent = '↘ Poor viability';
        larvalTrend.style.background = '#f8d7da';
        larvalTrend.style.color = '#721c24';
    }
}

// Update charts with new data
function updateCharts() {
    if (turbidityChart) {
        turbidityChart.data.datasets[0].data = calculateSurvivalRates();
        turbidityChart.data.datasets[1].data = calculateHatchingRates();
        turbidityChart.update();
    }

    if (temperatureChart) {
        temperatureChart.data.datasets[0].data = generateTemperatureData();
        temperatureChart.update();
    }
}

// Download dataset function
function downloadDataset(filename) {
    // Simulate download - in real implementation, this would fetch actual data
    alert(`Downloading ${filename}...\n\nThis feature would download real research data in a production environment.`);

    // For demonstration, create a simple CSV
    if (filename.includes('.csv')) {
        const csvContent = generateSampleCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Generate sample CSV data for demonstration
function generateSampleCSV() {
    let csv = 'Turbidity_NTU,Temperature_C,Flow_Rate_m3_s,Egg_Survival_Percent,Hatching_Success_Percent,Larval_Viability_Percent\n';

    for (let turbidity = 0; turbidity <= 200; turbidity += 20) {
        for (let temp = 5; temp <= 15; temp += 2) {
            const flow = 25;
            const survival = 92 * Math.exp(-0.004 * turbidity) * (1 - Math.abs(temp - 8) * 0.015);
            const hatching = 85 * Math.exp(-0.006 * turbidity) * (1 - Math.abs(temp - 10) * 0.012);
            const larval = 70 * Math.exp(-0.008 * turbidity) * (1 - Math.abs(temp - 12) * 0.02);

            csv += `${turbidity},${temp},${flow},${Math.round(survival)},${Math.round(hatching)},${Math.round(larval)}\n`;
        }
    }

    return csv;
}

// Add keyboard shortcuts for quick testing
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        // Reset to default values
        document.getElementById('turbidity-slider').value = 50;
        document.getElementById('temperature-slider').value = 8;
        document.getElementById('flow-rate-slider').value = 25;

        // Trigger input events
        document.getElementById('turbidity-slider').dispatchEvent(new Event('input'));
        document.getElementById('temperature-slider').dispatchEvent(new Event('input'));
        document.getElementById('flow-rate-slider').dispatchEvent(new Event('input'));
    }
});

// Export functions for potential use in other scripts
window.GlacierAnalysis = {
    calculateSurvivalRate,
    calculateHatchingRate,
    calculateLarvalRate,
    updateAnalysis
};