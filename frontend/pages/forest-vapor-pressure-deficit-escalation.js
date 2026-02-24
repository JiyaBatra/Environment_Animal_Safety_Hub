/**
 * Forest Vapor Pressure Deficit Escalation Analysis
 * Issue #2458: Interactive VPD stress simulator
 */

// Global variables for VPD analysis
let mortalityChart;
let speciesChart;
let currentTemperature = 25;
let currentHumidity = 60;
let currentSpecies = 'pine';

// Species tolerance data (VPD thresholds in kPa)
const speciesData = {
    pine: { name: 'Pine', threshold: 1.5, tolerance: 'Low' },
    oak: { name: 'Oak', threshold: 2.2, tolerance: 'Medium' },
    maple: { name: 'Maple', threshold: 2.8, tolerance: 'High' },
    fir: { name: 'Fir', threshold: 1.2, tolerance: 'Very Low' }
};

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeControls();
    initializeCharts();
    updateVPDAnalysis();
});

// Initialize interactive controls
function initializeControls() {
    // Temperature slider
    const temperatureSlider = document.getElementById('temperature-slider');
    const temperatureValue = document.getElementById('temperature-value');

    temperatureSlider.addEventListener('input', function() {
        currentTemperature = parseFloat(this.value);
        temperatureValue.textContent = currentTemperature + '°C';
        updateVPDAnalysis();
    });

    // Humidity slider
    const humiditySlider = document.getElementById('humidity-slider');
    const humidityValue = document.getElementById('humidity-value');

    humiditySlider.addEventListener('input', function() {
        currentHumidity = parseInt(this.value);
        humidityValue.textContent = currentHumidity + '%';
        updateVPDAnalysis();
    });

    // Species selector
    const speciesSelect = document.getElementById('species-select');
    speciesSelect.addEventListener('change', function() {
        currentSpecies = this.value;
        updateVPDAnalysis();
    });
}

// Initialize Chart.js charts
function initializeCharts() {
    // VPD vs Tree Mortality Chart
    const mortalityCtx = document.getElementById('mortalityChart').getContext('2d');
    mortalityChart = new Chart(mortalityCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 41}, (_, i) => (i * 0.1).toFixed(1)), // 0.0 to 4.0 kPa
            datasets: [{
                label: 'Tree Mortality Rate (%)',
                data: calculateMortalityRates(),
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
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
                        text: 'Vapor Pressure Deficit (kPa)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Mortality Rate (%)'
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

    // Species Tolerance Comparison Chart
    const speciesCtx = document.getElementById('speciesChart').getContext('2d');
    speciesChart = new Chart(speciesCtx, {
        type: 'bar',
        data: {
            labels: ['Pine', 'Oak', 'Maple', 'Fir'],
            datasets: [{
                label: 'VPD Tolerance Threshold (kPa)',
                data: [1.5, 2.2, 2.8, 1.2],
                backgroundColor: [
                    'rgba(220, 53, 69, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(40, 167, 69, 0.8)',
                    'rgba(0, 123, 255, 0.8)'
                ],
                borderColor: [
                    '#dc3545',
                    '#ffc107',
                    '#28a745',
                    '#007bff'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'VPD Threshold (kPa)'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Calculate VPD using Tetens equation approximation
function calculateVPD(temperature, humidity) {
    // Saturation vapor pressure (kPa) using simplified Tetens equation
    const es = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));

    // Actual vapor pressure
    const ea = es * (humidity / 100);

    // VPD = es - ea
    return es - ea;
}

// Calculate tree mortality rates based on VPD
function calculateMortalityRates() {
    const rates = [];
    for (let vpd = 0; vpd <= 4.0; vpd += 0.1) {
        // Logistic mortality function
        // Mortality = 100 / (1 + exp(-k * (VPD - threshold)))
        const k = 2.5; // Steepness parameter
        const threshold = 2.0; // VPD where mortality starts increasing rapidly
        const mortality = 100 / (1 + Math.exp(-k * (vpd - threshold)));
        rates.push(Math.round(mortality * 10) / 10);
    }
    return rates;
}

// Calculate stress level based on species tolerance
function calculateStressLevel(vpd, species) {
    const threshold = speciesData[species].threshold;
    if (vpd <= threshold) {
        return Math.max(0, (vpd / threshold) * 30); // Low stress up to 30%
    } else {
        // Exponential increase beyond threshold
        const excess = vpd - threshold;
        return 30 + (70 / (1 + Math.exp(-2 * excess)));
    }
}

// Calculate mortality risk
function calculateMortalityRisk(stressLevel) {
    // Mortality risk increases with stress level
    return Math.min(100, stressLevel * 0.8);
}

// Update VPD analysis results
function updateVPDAnalysis() {
    const vpd = calculateVPD(currentTemperature, currentHumidity);
    const stressLevel = calculateStressLevel(vpd, currentSpecies);
    const mortalityRisk = calculateMortalityRisk(stressLevel);

    // Update display values
    document.getElementById('vpd-value').textContent = vpd.toFixed(2);
    document.getElementById('stress-level').textContent = Math.round(stressLevel) + '%';
    document.getElementById('mortality-risk').textContent = Math.round(mortalityRisk) + '%';

    // Update status indicators
    updateVPDStatus(vpd);
    updateStressIndicator(stressLevel);
    updateMortalityTrend(mortalityRisk);

    // Update charts
    updateCharts();
}

// Update VPD status indicator
function updateVPDStatus(vpd) {
    const statusElement = document.getElementById('vpd-status');

    if (vpd < 1.0) {
        statusElement.textContent = 'Low Stress';
        statusElement.style.background = '#d4edda';
        statusElement.style.color = '#155724';
    } else if (vpd < 2.0) {
        statusElement.textContent = 'Moderate Stress';
        statusElement.style.background = '#fff3cd';
        statusElement.style.color = '#856404';
    } else if (vpd < 3.0) {
        statusElement.textContent = 'High Stress';
        statusElement.style.background = '#f8d7da';
        statusElement.style.color = '#721c24';
    } else {
        statusElement.textContent = 'Extreme Stress';
        statusElement.style.background = '#f5c6cb';
        statusElement.style.color = '#721c24';
    }
}

// Update stress indicator
function updateStressIndicator(stress) {
    const indicator = document.getElementById('stress-indicator');

    if (stress < 30) {
        indicator.textContent = 'Low Risk';
        indicator.style.background = '#d4edda';
        indicator.style.color = '#155724';
    } else if (stress < 60) {
        indicator.textContent = 'Medium Risk';
        indicator.style.background = '#fff3cd';
        indicator.style.color = '#856404';
    } else if (stress < 80) {
        indicator.textContent = 'High Risk';
        indicator.style.background = '#f8d7da';
        indicator.style.color = '#721c24';
    } else {
        indicator.textContent = 'Critical Risk';
        indicator.style.background = '#f5c6cb';
        indicator.style.color = '#721c24';
    }
}

// Update mortality trend
function updateMortalityTrend(risk) {
    const trend = document.getElementById('mortality-trend');

    if (risk < 20) {
        trend.textContent = 'Stable';
        trend.style.background = '#d4edda';
        trend.style.color = '#155724';
    } else if (risk < 40) {
        trend.textContent = 'Increasing';
        trend.style.background = '#fff3cd';
        trend.style.color = '#856404';
    } else if (risk < 70) {
        trend.textContent = 'Rapid Increase';
        trend.style.background = '#f8d7da';
        trend.style.color = '#721c24';
    } else {
        trend.textContent = 'Critical';
        trend.style.background = '#f5c6cb';
        trend.style.color = '#721c24';
    }
}

// Update charts with new data
function updateCharts() {
    if (mortalityChart) {
        mortalityChart.data.datasets[0].data = calculateMortalityRates();
        mortalityChart.update();
    }

    // Species chart is static, no need to update
}

// Analysis functions
function runVPDAnalysis() {
    const resultsDiv = document.getElementById('analysis-results');

    const analysis = `
        <h3>VPD Trend Analysis Results</h3>
        <p><strong>Current Conditions:</strong></p>
        <ul>
            <li>Temperature: ${currentTemperature}°C</li>
            <li>Humidity: ${currentHumidity}%</li>
            <li>VPD: ${calculateVPD(currentTemperature, currentHumidity).toFixed(2)} kPa</li>
            <li>Species: ${speciesData[currentSpecies].name}</li>
        </ul>
        <p><strong>Projected Impacts:</strong></p>
        <ul>
            <li>Stress Level: ${Math.round(calculateStressLevel(calculateVPD(currentTemperature, currentHumidity), currentSpecies))}%</li>
            <li>Mortality Risk: ${Math.round(calculateMortalityRisk(calculateStressLevel(calculateVPD(currentTemperature, currentHumidity), currentSpecies)))}%</li>
            <li>Time to Critical Stress: ${calculateTimeToCritical()} years</li>
        </ul>
        <p><strong>Recommendations:</strong></p>
        <ul>
            <li>${getRecommendations()}</li>
        </ul>
    `;

    resultsDiv.innerHTML = analysis;
}

function calculateTimeToCritical() {
    // Simplified projection based on current trends
    const currentVPD = calculateVPD(currentTemperature, currentHumidity);
    const threshold = speciesData[currentSpecies].threshold;

    if (currentVPD < threshold) {
        // Assuming 0.05 kPa/year increase
        const years = (threshold - currentVPD) / 0.05;
        return Math.round(years);
    } else {
        return 0; // Already at critical levels
    }
}

function getRecommendations() {
    const stress = calculateStressLevel(calculateVPD(currentTemperature, currentHumidity), currentSpecies);

    if (stress < 30) {
        return "Monitor conditions regularly. Current stress levels are manageable.";
    } else if (stress < 60) {
        return "Implement drought monitoring and consider supplemental irrigation for high-value trees.";
    } else if (stress < 80) {
        return "Urgent action required: Implement forest thinning, prescribed burns, and assisted migration programs.";
    } else {
        return "Critical situation: Immediate intervention needed including emergency irrigation and species replacement planning.";
    }
}

function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        temperature: currentTemperature,
        humidity: currentHumidity,
        vpd: calculateVPD(currentTemperature, currentHumidity),
        species: currentSpecies,
        stressLevel: calculateStressLevel(calculateVPD(currentTemperature, currentHumidity), currentSpecies),
        mortalityRisk: calculateMortalityRisk(calculateStressLevel(calculateVPD(currentTemperature, currentHumidity), currentSpecies))
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vpd-analysis-${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    alert('Forest health data exported successfully!');
}

function showPredictions() {
    const resultsDiv = document.getElementById('analysis-results');

    const predictions = `
        <h3>Future VPD Projections (2050)</h3>
        <p>Based on climate models and current trends:</p>
        <ul>
            <li><strong>Global Average VPD Increase:</strong> 15-25%</li>
            <li><strong>Temperature Rise:</strong> +2.0-3.5°C</li>
            <li><strong>Forest Mortality:</strong> 20-40% in vulnerable regions</li>
            <li><strong>Carbon Sequestration Loss:</strong> 2.5-5.0 Gt CO₂/year</li>
        </ul>
        <p><strong>Regional Hotspots:</strong></p>
        <ul>
            <li>Mediterranean Basin: 40% VPD increase</li>
            <li>Amazon Rainforest: 25% VPD increase</li>
            <li>Australian Forests: 35% VPD increase</li>
            <li>Boreal Forests: 20% VPD increase</li>
        </ul>
        <p><strong>Adaptation Timeline:</strong></p>
        <ul>
            <li>2025-2030: Early warning systems implementation</li>
            <li>2030-2040: Assisted migration programs</li>
            <li>2040-2050: Large-scale forest restoration</li>
            <li>2050+: Climate-resilient forest management</li>
        </ul>
    `;

    resultsDiv.innerHTML = predictions;
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        // Reset to default values
        document.getElementById('temperature-slider').value = 25;
        document.getElementById('humidity-slider').value = 60;
        document.getElementById('species-select').value = 'pine';

        // Trigger input events
        document.getElementById('temperature-slider').dispatchEvent(new Event('input'));
        document.getElementById('humidity-slider').dispatchEvent(new Event('input'));
        document.getElementById('species-select').dispatchEvent(new Event('change'));
    }
});

// Export functions for potential use in other scripts
window.VPDAnalysis = {
    calculateVPD,
    calculateStressLevel,
    calculateMortalityRisk,
    updateVPDAnalysis
};