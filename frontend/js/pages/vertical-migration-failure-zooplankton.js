// Vertical Migration Failure in Zooplankton - Interactive Features

class MigrationSimulator {
    constructor() {
        this.surfaceTemp = 20;
        this.deepTemp = 8;
        this.oxygenGradient = 3;
        this.predatorDensity = 50;
        this.timeOfDay = 12; // 0-24 hours
        this.animationId = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSimulation();
        this.animateMigration();
    }

    setupEventListeners() {
        // Temperature sliders
        const surfaceSlider = document.getElementById('surface-temperature');
        const surfaceValue = document.getElementById('surface-temp-value');
        surfaceSlider.addEventListener('input', (e) => {
            this.surfaceTemp = parseFloat(e.target.value);
            surfaceValue.textContent = this.surfaceTemp.toFixed(1) + '°C';
            this.updateSimulation();
        });

        const deepSlider = document.getElementById('deep-temperature');
        const deepValue = document.getElementById('deep-temp-value');
        deepSlider.addEventListener('input', (e) => {
            this.deepTemp = parseFloat(e.target.value);
            deepValue.textContent = this.deepTemp.toFixed(1) + '°C';
            this.updateSimulation();
        });

        // Other parameter sliders
        const oxygenSlider = document.getElementById('oxygen-gradient');
        const oxygenValue = document.getElementById('oxygen-value');
        oxygenSlider.addEventListener('input', (e) => {
            this.oxygenGradient = parseFloat(e.target.value);
            oxygenValue.textContent = this.oxygenGradient.toFixed(1) + ' mg/L';
            this.updateSimulation();
        });

        const predatorSlider = document.getElementById('predator-density');
        const predatorValue = document.getElementById('predator-value');
        predatorSlider.addEventListener('input', (e) => {
            this.predatorDensity = parseInt(e.target.value);
            predatorValue.textContent = this.predatorDensity + '%';
            this.updateSimulation();
        });

        // Time slider
        const timeSlider = document.getElementById('time-slider');
        const timeDisplay = document.getElementById('time-display');
        const dayNightStatus = document.getElementById('day-night-status');
        timeSlider.addEventListener('input', (e) => {
            this.timeOfDay = parseInt(e.target.value);
            const hours = Math.floor(this.timeOfDay);
            const minutes = Math.floor((this.timeOfDay - hours) * 60);
            timeDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            const isDay = this.timeOfDay >= 6 && this.timeOfDay <= 18;
            dayNightStatus.textContent = isDay ? 'Day' : 'Night';
            dayNightStatus.parentElement.setAttribute('data-time', isDay ? 'day' : 'night');

            this.updateMigrationVisualization();
        });
    }

    updateSimulation() {
        // Calculate migration success based on environmental parameters
        const tempGradient = this.surfaceTemp - this.deepTemp;
        const migrationEfficiency = Math.max(0, Math.min(100,
            100 - (Math.abs(tempGradient - 12) * 3) - (this.predatorDensity * 0.5) + (this.oxygenGradient * 10)
        ));

        const predationRisk = this.calculatePredationRisk();
        const energyBalance = this.calculateEnergyBalance();

        // Update display values
        document.getElementById('migration-success').textContent = Math.round(migrationEfficiency) + '%';
        document.getElementById('predation-risk').textContent = predationRisk;
        document.getElementById('energy-balance').textContent = energyBalance;

        // Update charts
        this.updateCharts(migrationEfficiency, predationRisk, energyBalance);
    }

    calculatePredationRisk() {
        const baseRisk = this.predatorDensity * 0.7;
        const tempModifier = Math.max(0, (this.surfaceTemp - 15) * 2);
        const risk = Math.min(100, baseRisk + tempModifier);

        if (risk < 30) return 'Low';
        if (risk < 60) return 'Moderate';
        if (risk < 80) return 'High';
        return 'Critical';
    }

    calculateEnergyBalance() {
        const feedingTime = (this.timeOfDay >= 20 || this.timeOfDay <= 4) ? 1 : 0.3;
        const metabolicCost = 0.8 + (this.surfaceTemp - 15) * 0.05;
        const balance = (feedingTime * 2.5 - metabolicCost) * 100;

        return (balance > 0 ? '+' : '') + Math.round(balance) + '%';
    }

    updateCharts(success, risk, energy) {
        // Migration success chart
        const successCanvas = document.getElementById('migration-chart');
        const successCtx = successCanvas.getContext('2d');
        successCtx.clearRect(0, 0, successCanvas.width, successCanvas.height);

        const successPercent = success / 100;
        successCtx.fillStyle = successPercent > 0.5 ? '#4caf50' : '#ff9800';
        successCtx.fillRect(25, 140 - successPercent * 120, 50, successPercent * 120);

        // Predation risk chart (simplified bar)
        const riskCanvas = document.getElementById('predation-chart');
        const riskCtx = riskCanvas.getContext('2d');
        riskCtx.clearRect(0, 0, riskCanvas.width, riskCanvas.height);

        let riskValue = 0;
        if (risk === 'Low') riskValue = 0.3;
        else if (risk === 'Moderate') riskValue = 0.6;
        else if (risk === 'High') riskValue = 0.8;
        else riskValue = 1.0;

        riskCtx.fillStyle = '#f44336';
        riskCtx.fillRect(25, 140 - riskValue * 120, 50, riskValue * 120);

        // Energy balance chart
        const energyCanvas = document.getElementById('energy-chart');
        const energyCtx = energyCanvas.getContext('2d');
        energyCtx.clearRect(0, 0, energyCanvas.width, energyCanvas.height);

        const energyValue = parseInt(energy) / 100;
        const isPositive = energyValue > 0;
        energyCtx.fillStyle = isPositive ? '#4caf50' : '#f44336';
        const barHeight = Math.abs(energyValue) * 120;
        energyCtx.fillRect(25, 140 - (isPositive ? 0 : barHeight), 50, barHeight);
    }

    animateMigration() {
        const canvas = document.getElementById('ocean-profile-canvas');
        const ctx = canvas.getContext('2d');

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw temperature gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#e3f2fd'); // Surface (cooler)
            gradient.addColorStop(1, '#0d47a1'); // Deep (warmer)
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw temperature profile line
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let y = 0; y < canvas.height; y++) {
                const depth = (y / canvas.height) * 1000; // 0-1000m
                const temp = this.surfaceTemp + (this.deepTemp - this.surfaceTemp) * (depth / 1000);
                const x = 50 + (temp / 30) * 100; // Temperature visualization
                if (y === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw migrating zooplankton
            this.drawZooplankton(ctx, canvas);

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    drawZooplankton(ctx, canvas) {
        const timeOfDay = Date.now() / 10000 % 24; // Slow cycle
        const isNight = timeOfDay < 6 || timeOfDay > 18;
        const migrationDepth = isNight ? 50 : 300; // Surface at night, deep during day

        // Draw multiple zooplankton
        for (let i = 0; i < 8; i++) {
            const x = 200 + Math.sin(timeOfDay + i) * 150;
            const y = migrationDepth + Math.sin(timeOfDay * 2 + i) * 50;

            ctx.fillStyle = isNight ? '#81c784' : '#ffb74d';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();

            // Draw migration trail
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, isNight ? y + 100 : y - 100);
            ctx.stroke();
        }
    }

    updateMigrationVisualization() {
        const canvas = document.getElementById('migration-canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw ocean depth profile
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#e3f2fd'); // Surface
        gradient.addColorStop(0.3, '#42a5f5'); // Mid-depth
        gradient.addColorStop(1, '#0d47a1'); // Deep
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw depth labels
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText('Surface (0m)', 20, 30);
        ctx.fillText('Mid-depth (200m)', 20, canvas.height / 2);
        ctx.fillText('Deep (500m)', 20, canvas.height - 20);

        // Calculate migration position based on time
        const isDay = this.timeOfDay >= 6 && this.timeOfDay <= 18;
        const migrationProgress = isDay ?
            Math.max(0, (this.timeOfDay - 6) / 12) : // Day: deep
            Math.max(0, (this.timeOfDay < 6 ? this.timeOfDay + 18 : this.timeOfDay - 18) / 12); // Night: surface

        const currentDepth = isDay ? 200 + migrationProgress * 300 : 500 - migrationProgress * 450;

        // Draw migrating zooplankton population
        for (let i = 0; i < 20; i++) {
            const x = 150 + (i % 5) * 100 + Math.sin(this.timeOfDay + i) * 30;
            const y = currentDepth + Math.sin(this.timeOfDay * 2 + i) * 20;

            ctx.fillStyle = isDay ? '#ffb74d' : '#81c784';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Draw migration path indicator
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(100, 50);
        ctx.lineTo(100, canvas.height - 50);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

class TemperatureCalculator {
    constructor() {
        this.species = 'copepod';
        this.optimalTemp = 12;
        this.tempTolerance = 5;
        this.oxygenRequirement = 2;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCalculation();
    }

    setupEventListeners() {
        // Species selector
        document.getElementById('species-select').addEventListener('change', (e) => {
            this.species = e.target.value;
            this.setSpeciesDefaults();
            this.updateCalculation();
        });

        // Temperature inputs
        document.getElementById('optimal-temp').addEventListener('input', (e) => {
            this.optimalTemp = parseFloat(e.target.value);
            this.updateCalculation();
        });

        document.getElementById('temp-tolerance').addEventListener('input', (e) => {
            this.tempTolerance = parseFloat(e.target.value);
            this.updateCalculation();
        });

        document.getElementById('oxygen-requirement').addEventListener('input', (e) => {
            this.oxygenRequirement = parseFloat(e.target.value);
            this.updateCalculation();
        });

        // Calculate button
        document.getElementById('calculate-depth').addEventListener('click', () => {
            this.updateCalculation();
        });
    }

    setSpeciesDefaults() {
        const defaults = {
            copepod: { optimal: 12, tolerance: 5, oxygen: 2 },
            krill: { optimal: 2, tolerance: 3, oxygen: 1.5 },
            euphausiid: { optimal: 8, tolerance: 4, oxygen: 2.5 },
            chaetognath: { optimal: 15, tolerance: 6, oxygen: 3 }
        };

        const speciesData = defaults[this.species];
        this.optimalTemp = speciesData.optimal;
        this.tempTolerance = speciesData.tolerance;
        this.oxygenRequirement = speciesData.oxygen;

        document.getElementById('optimal-temp').value = this.optimalTemp;
        document.getElementById('temp-tolerance').value = this.tempTolerance;
        document.getElementById('oxygen-requirement').value = this.oxygenRequirement;
    }

    updateCalculation() {
        // Calculate optimal migration depth based on temperature and oxygen profiles
        const optimalDepth = this.calculateOptimalDepth();
        const depthRange = this.calculateDepthRange();

        // Update display
        document.getElementById('optimal-depth').textContent = optimalDepth + 'm';
        document.getElementById('depth-range').textContent = depthRange.min + '-' + depthRange.max + 'm';

        // Update thermal profile visualization
        this.updateThermalProfile();
    }

    calculateOptimalDepth() {
        // Simplified calculation based on temperature and oxygen gradients
        // In reality, this would use complex oceanographic models
        const tempFactor = Math.abs(15 - this.optimalTemp) * 10; // Temperature gradient effect
        const oxygenFactor = this.oxygenRequirement * 50; // Oxygen availability

        return Math.round(50 + tempFactor + oxygenFactor);
    }

    calculateDepthRange() {
        const optimal = this.calculateOptimalDepth();
        const range = this.tempTolerance * 20; // Tolerance affects depth range

        return {
            min: Math.max(0, optimal - range),
            max: optimal + range
        };
    }

    updateThermalProfile() {
        const canvas = document.getElementById('thermal-profile');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw temperature profile
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let depth = 0; depth <= 500; depth += 10) {
            const temp = 20 - (depth / 500) * 15; // Simplified temperature gradient
            const x = 50 + (temp / 25) * 200;
            const y = (depth / 500) * canvas.height;

            if (depth === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw optimal range zone
        const optimalDepth = this.calculateOptimalDepth();
        const range = this.calculateDepthRange();
        const y1 = (range.min / 500) * canvas.height;
        const y2 = (range.max / 500) * canvas.height;

        ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
        ctx.fillRect(50, y1, 200, y2 - y1);

        // Draw tolerance zones
        ctx.fillStyle = 'rgba(255, 152, 0, 0.2)';
        ctx.fillRect(50, 0, 200, y1);
        ctx.fillRect(50, y2, 200, canvas.height - y2);

        // Add depth labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText('0m', 20, 20);
        ctx.fillText('250m', 20, canvas.height / 2);
        ctx.fillText('500m', 20, canvas.height - 10);
    }
}

class PredatorAnalyzer {
    constructor() {
        this.scenario = 'normal';
        this.scenarios = {
            normal: {
                zooplankton: 100,
                fish: 80,
                jellyfish: 60,
                whales: 40
            },
            reduced: {
                zooplankton: 70,
                fish: 65,
                jellyfish: 75,
                whales: 30
            },
            failed: {
                zooplankton: 40,
                fish: 50,
                jellyfish: 90,
                whales: 20
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateScenario();
    }

    setupEventListeners() {
        // Scenario buttons
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.scenario = e.target.getAttribute('data-scenario');
                this.updateScenario();
            });
        });
    }

    updateScenario() {
        const data = this.scenarios[this.scenario];

        // Calculate metrics
        const mortalityRate = 100 - data.zooplankton;
        const predatorEfficiency = (100 - data.fish + 100 - data.whales) / 2;
        const cascadeImpact = this.calculateCascadeImpact(data);

        // Update display
        document.getElementById('zooplankton-mortality').textContent = mortalityRate + '%';
        document.getElementById('predator-success').textContent = Math.round(predatorEfficiency) + '%';
        document.getElementById('cascade-impact').textContent = cascadeImpact;

        // Update visualization
        this.updateDynamicsVisualization(data);
    }

    calculateCascadeImpact(data) {
        const biomassChange = (data.zooplankton + data.fish + data.whales) / 3;
        if (biomassChange > 80) return 'Minimal';
        if (biomassChange > 60) return 'Moderate';
        if (biomassChange > 40) return 'Severe';
        return 'Critical';
    }

    updateDynamicsVisualization(data) {
        const canvas = document.getElementById('dynamics-canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Define species positions and connections
        const species = [
            { name: 'Zooplankton', biomass: data.zooplankton, x: 200, y: 100, color: '#2196f3' },
            { name: 'Fish', biomass: data.fish, x: 400, y: 150, color: '#ff9800' },
            { name: 'Jellyfish', biomass: data.jellyfish, x: 300, y: 250, color: '#e91e63' },
            { name: 'Whales', biomass: data.whales, x: 500, y: 300, color: '#9c27b0' }
        ];

        // Draw connections (food web)
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(species[0].x, species[0].y);
        ctx.lineTo(species[1].x, species[1].y);
        ctx.moveTo(species[0].x, species[0].y);
        ctx.lineTo(species[2].x, species[2].y);
        ctx.moveTo(species[1].x, species[1].y);
        ctx.lineTo(species[3].x, species[3].y);
        ctx.stroke();

        // Draw species nodes
        species.forEach(spec => {
            const radius = 20 + (spec.biomass / 100) * 30;

            // Draw biomass circle
            ctx.fillStyle = spec.color;
            ctx.beginPath();
            ctx.arc(spec.x, spec.y, radius, 0, 2 * Math.PI);
            ctx.fill();

            // Draw biomass percentage
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(spec.biomass + '%', spec.x, spec.y + 4);

            // Draw species label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText(spec.name, spec.x, spec.y + radius + 20);
        });
    }
}

class CarbonExportAnalyzer {
    constructor() {
        this.migrationEfficiency = 75;
        this.zooplanktonBiomass = 100;
        this.fecalPelletRate = 25;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAnalysis();
    }

    setupEventListeners() {
        // Parameter sliders
        document.getElementById('migration-efficiency').addEventListener('input', (e) => {
            this.migrationEfficiency = parseInt(e.target.value);
            document.getElementById('efficiency-value').textContent = this.migrationEfficiency + '%';
            this.updateAnalysis();
        });

        document.getElementById('zooplankton-biomass').addEventListener('input', (e) => {
            this.zooplanktonBiomass = parseInt(e.target.value);
            document.getElementById('biomass-value').textContent = this.zooplanktonBiomass + ' g/m²';
            this.updateAnalysis();
        });

        document.getElementById('fecal-pellet-rate').addEventListener('input', (e) => {
            this.fecalPelletRate = parseInt(e.target.value);
            document.getElementById('pellet-value').textContent = this.fecalPelletRate + ' pellets/day';
            this.updateAnalysis();
        });
    }

    updateAnalysis() {
        // Calculate carbon export metrics
        const exportRate = this.calculateExportRate();
        const exportChange = this.calculateExportChange();
        const deepEnrichment = this.calculateDeepEnrichment();
        const enrichmentChange = this.calculateEnrichmentChange();
        const co2Impact = this.calculateCO2Impact();
        const co2Change = this.calculateCO2Change();

        // Update display
        document.getElementById('carbon-export-rate').textContent = exportRate.toFixed(1) + ' mgC/m²/day';
        this.updateChangeDisplay('export-change', exportChange);

        document.getElementById('deep-enrichment').textContent = deepEnrichment.toFixed(1) + ' μM';
        this.updateChangeDisplay('enrichment-change', enrichmentChange);

        document.getElementById('co2-impact').textContent = co2Impact.toFixed(2) + ' ppm/year';
        this.updateChangeDisplay('co2-change', co2Change);

        // Update biological pump visualization
        this.updatePumpVisualization();
    }

    calculateExportRate() {
        return (this.migrationEfficiency / 100) * (this.zooplanktonBiomass / 100) * this.fecalPelletRate * 1.8;
    }

    calculateExportChange() {
        const normalRate = 75 * 100 * 25 * 1.8 / 10000; // Baseline calculation
        const currentRate = this.calculateExportRate();
        return ((currentRate - normalRate) / normalRate) * 100;
    }

    calculateDeepEnrichment() {
        return this.calculateExportRate() * 2.5;
    }

    calculateEnrichmentChange() {
        const normalEnrichment = 75 * 100 * 25 * 1.8 * 2.5 / 10000;
        const currentEnrichment = this.calculateDeepEnrichment();
        return ((currentEnrichment - normalEnrichment) / normalEnrichment) * 100;
    }

    calculateCO2Impact() {
        return this.calculateExportRate() * 0.003;
    }

    calculateCO2Change() {
        const normalCO2 = 75 * 100 * 25 * 1.8 * 0.003 / 10000;
        const currentCO2 = this.calculateCO2Impact();
        return ((currentCO2 - normalCO2) / normalCO2) * 100;
    }

    updateChangeDisplay(elementId, change) {
        const element = document.getElementById(elementId);
        const isDecrease = change < 0;
        element.textContent = (isDecrease ? '' : '+') + change.toFixed(0) + '%';
        element.setAttribute('data-trend', isDecrease ? 'decrease' : 'increase');
    }

    updatePumpVisualization() {
        const canvas = document.getElementById('pump-canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw biological pump stages
        const stages = [
            { name: 'Surface Production', efficiency: this.zooplanktonBiomass / 100, y: 50, color: '#4caf50' },
            { name: 'Migration Transport', efficiency: this.migrationEfficiency / 100, y: 150, color: '#2196f3' },
            { name: 'Deep Export', efficiency: this.fecalPelletRate / 50, y: 250, color: '#ff9800' },
            { name: 'Sequestration', efficiency: 0.8, y: 350, color: '#9c27b0' }
        ];

        stages.forEach(stage => {
            const barWidth = stage.efficiency * 200;
            const x = (canvas.width - barWidth) / 2;

            // Draw efficiency bar
            ctx.fillStyle = stage.color;
            ctx.fillRect(x, stage.y - 15, barWidth, 30);

            // Draw efficiency percentage
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(Math.round(stage.efficiency * 100) + '%', canvas.width / 2, stage.y + 4);

            // Draw stage label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText(stage.name, canvas.width / 2, stage.y + 35);
        });

        // Draw connecting arrows
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        for (let i = 0; i < stages.length - 1; i++) {
            const y1 = stages[i].y + 20;
            const y2 = stages[i + 1].y - 20;

            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, y1);
            ctx.lineTo(canvas.width / 2, y2);
            ctx.stroke();

            // Arrow head
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 5, y2 - 5);
            ctx.lineTo(canvas.width / 2, y2);
            ctx.lineTo(canvas.width / 2 + 5, y2 - 5);
            ctx.stroke();
        }
    }
}

// Educational Modal System
class EducationalModal {
    constructor() {
        this.modal = document.getElementById('modal-overlay');
        this.modalBody = document.getElementById('modal-body');
        this.closeBtn = document.querySelector('.modal-close');

        this.init();
    }

    init() {
        this.closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.close();
        });
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Add click handlers for educational elements
        this.addEducationalHandlers();
    }

    addEducationalHandlers() {
        // Add click handlers to elements that should show educational content
        const educationalElements = document.querySelectorAll('[data-education]');
        educationalElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const topic = element.getAttribute('data-education');
                this.showEducation(topic);
            });
        });
    }

    showEducation(topic) {
        const content = this.getEducationalContent(topic);
        this.modalBody.innerHTML = content;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    getEducationalContent(topic) {
        const content = {
            'diel-migration': `
                <h2>Diel Vertical Migration</h2>
                <p>Diel vertical migration (DVM) is the daily movement of marine organisms between surface and deep waters. This behavior is crucial for:</p>
                <ul>
                    <li><strong>Predator Avoidance:</strong> Moving to deeper, darker waters during day to avoid visual predators</li>
                    <li><strong>Feeding:</strong> Returning to surface waters at night when phytoplankton are available</li>
                    <li><strong>Carbon Transport:</strong> Carrying carbon from surface to deep waters through fecal pellets</li>
                    <li><strong>Energy Conservation:</strong> Cooler deep waters reduce metabolic rates</li>
                </ul>
                <p>Zooplankton migrate hundreds of meters daily, making this one of the largest daily biomass movements on Earth.</p>
            `,
            'warming-impacts': `
                <h2>Warming Ocean Impacts</h2>
                <p>Ocean warming disrupts DVM through several mechanisms:</p>
                <ul>
                    <li><strong>Temperature Gradients:</strong> Reduced difference between surface and deep waters</li>
                    <li><strong>Oxygen Changes:</strong> Altered oxygen profiles affect metabolic costs</li>
                    <li><strong>Predator Dynamics:</strong> Changes in predator distribution and behavior</li>
                    <li><strong>Food Availability:</strong> Shifts in phytoplankton distribution and abundance</li>
                    <li><strong>Metabolic Costs:</strong> Higher temperatures increase energy requirements</li>
                </ul>
                <p>These changes can lead to migration failure, where zooplankton remain at suboptimal depths.</p>
            `,
            'biological-consequences': `
                <h2>Biological Consequences</h2>
                <p>Migration failure has cascading effects throughout marine ecosystems:</p>
                <ul>
                    <li><strong>Increased Mortality:</strong> Higher predation rates for surface-dwelling populations</li>
                    <li><strong>Reduced Reproduction:</strong> Energy deficits affect reproductive success</li>
                    <li><strong>Trophic Cascades:</strong> Changes propagate through food webs</li>
                    <li><strong>Carbon Cycle Disruption:</strong> Reduced biological pump efficiency</li>
                    <li><strong>Biodiversity Shifts:</strong> Species composition changes in response to new conditions</li>
                </ul>
                <p>These impacts threaten global ocean productivity and fisheries sustainability.</p>
            `
        };

        return content[topic] || '<h2>Content Not Found</h2><p>Educational content for this topic is not yet available.</p>';
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize simulators and analyzers
    new MigrationSimulator();
    new TemperatureCalculator();
    new PredatorAnalyzer();
    new CarbonExportAnalyzer();
    new EducationalModal();

    // Add data attributes for educational modals
    document.querySelectorAll('.impact-card h3').forEach(heading => {
        heading.setAttribute('data-education', 'biological-consequences');
        heading.style.cursor = 'pointer';
        heading.style.textDecoration = 'underline';
    });

    // Smooth scrolling for navigation
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
});