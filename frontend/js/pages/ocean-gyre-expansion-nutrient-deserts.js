// Ocean Gyre Expansion and Nutrient Deserts - Interactive Features

class OceanGyreSimulator {
    constructor() {
        this.temperatureIncrease = 1.5;
        this.windPatternChange = 15;
        this.stratificationStrength = 30;
        this.animationId = null;
        this.gyreRadius = 100;
        this.gyreCenterX = 200;
        this.gyreCenterY = 150;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateGyre();
        this.updateSimulator();
    }

    setupEventListeners() {
        // Temperature slider
        const tempSlider = document.getElementById('temperature-increase');
        const tempValue = document.getElementById('temp-value');
        tempSlider.addEventListener('input', (e) => {
            this.temperatureIncrease = parseFloat(e.target.value);
            tempValue.textContent = this.temperatureIncrease.toFixed(1) + '°C';
            this.updateSimulator();
        });

        // Wind pattern slider
        const windSlider = document.getElementById('wind-pattern-change');
        const windValue = document.getElementById('wind-value');
        windSlider.addEventListener('input', (e) => {
            this.windPatternChange = parseInt(e.target.value);
            windValue.textContent = this.windPatternChange + '%';
            this.updateSimulator();
        });

        // Stratification slider
        const stratSlider = document.getElementById('stratification-strength');
        const stratValue = document.getElementById('strat-value');
        stratSlider.addEventListener('input', (e) => {
            this.stratificationStrength = parseInt(e.target.value);
            stratValue.textContent = this.stratificationStrength + '%';
            this.updateSimulator();
        });
    }

    updateSimulator() {
        // Calculate gyre expansion based on climate parameters
        const expansionFactor = 1 + (this.temperatureIncrease * 0.15) +
                               (this.windPatternChange * 0.005) +
                               (this.stratificationStrength * 0.008);

        const gyreExpansion = ((expansionFactor - 1) * 100).toFixed(1);
        const desertCoverage = (expansionFactor * 1.2).toFixed(1);
        const productivityImpact = (-45 * expansionFactor).toFixed(0);

        // Update display values
        document.getElementById('gyre-expansion').textContent = `+${gyreExpansion}%`;
        document.getElementById('desert-coverage').textContent = `${desertCoverage}M km²`;
        document.getElementById('productivity-impact').textContent = `${productivityImpact}%`;

        // Update charts
        this.updateExpansionChart(expansionFactor);
        this.updateDesertChart(desertCoverage);
        this.updateProductivityChart(productivityImpact);
    }

    updateExpansionChart(expansionFactor) {
        const canvas = document.getElementById('expansion-chart');
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw baseline (current gyre size)
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(75, 100, 40, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw expanded gyre
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(75, 100, 40 * expansionFactor, 0, 2 * Math.PI);
        ctx.stroke();

        // Add labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Current', 75, 160);
        ctx.fillText('Expanded', 75, 175);
    }

    updateDesertChart(desertCoverage) {
        const canvas = document.getElementById('desert-chart');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw desert coverage bar
        const coveragePercent = Math.min(desertCoverage / 5, 1); // Max 5M km² for scale
        const barHeight = coveragePercent * 120;

        ctx.fillStyle = '#bf360c';
        ctx.fillRect(50, 140 - barHeight, 100, barHeight);

        // Add scale lines
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = 140 - (i / 5) * 120;
            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(160, y);
            ctx.stroke();

            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`${i}M`, 35, y + 3);
        }

        ctx.fillText('km²', 170, 75);
    }

    updateProductivityChart(productivityImpact) {
        const canvas = document.getElementById('productivity-chart');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw productivity decline bar (negative values)
        const declinePercent = Math.abs(productivityImpact) / 100;
        const barHeight = declinePercent * 120;

        ctx.fillStyle = '#f44336';
        ctx.fillRect(50, 140 - barHeight, 100, barHeight);

        // Add scale
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 100; i += 20) {
            const y = 140 - (i / 100) * 120;
            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(160, y);
            ctx.stroke();

            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`-${i}%`, 35, y + 3);
        }
    }

    animateGyre() {
        const canvas = document.getElementById('gyre-canvas');
        const ctx = canvas.getContext('2d');

        let angle = 0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw ocean background with nutrient gradients
            const gradient = ctx.createRadialGradient(200, 150, 0, 200, 150, 150);
            gradient.addColorStop(0, '#e8f4fd');
            gradient.addColorStop(0.5, '#4a90e2');
            gradient.addColorStop(1, '#1e3a5f');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw gyre circulation pattern
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;

            for (let r = 20; r < 140; r += 20) {
                ctx.beginPath();
                ctx.arc(200, 150, r, angle + r * 0.01, angle + r * 0.01 + Math.PI * 1.5);
                ctx.stroke();
            }

            // Draw nutrient desert center
            const desertRadius = 60;
            const desertGradient = ctx.createRadialGradient(200, 150, 0, 200, 150, desertRadius);
            desertGradient.addColorStop(0, 'rgba(191, 54, 12, 0.8)');
            desertGradient.addColorStop(1, 'rgba(191, 54, 12, 0.2)');
            ctx.fillStyle = desertGradient;
            ctx.beginPath();
            ctx.arc(200, 150, desertRadius, 0, 2 * Math.PI);
            ctx.fill();

            angle += 0.02;
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }
}

class NutrientCalculator {
    constructor() {
        this.nitrate = 15;
        this.phosphate = 1.2;
        this.silicate = 25;
        this.region = 'coastal';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCalculation();
    }

    setupEventListeners() {
        // Region selector
        document.getElementById('region-select').addEventListener('change', (e) => {
            this.region = e.target.value;
            this.updateCalculation();
        });

        // Nutrient inputs
        document.getElementById('nitrate-input').addEventListener('input', (e) => {
            this.nitrate = parseFloat(e.target.value);
            this.updateCalculation();
        });

        document.getElementById('phosphate-input').addEventListener('input', (e) => {
            this.phosphate = parseFloat(e.target.value);
            this.updateCalculation();
        });

        document.getElementById('silicate-input').addEventListener('input', (e) => {
            this.silicate = parseFloat(e.target.value);
            this.updateCalculation();
        });

        // Calculate button
        document.getElementById('calculate-nutrients').addEventListener('click', () => {
            this.updateCalculation();
        });
    }

    updateCalculation() {
        // Calculate primary productivity using Redfield ratio and nutrient limitations
        const nToP = this.nitrate / this.phosphate;
        const limitingFactor = Math.min(this.nitrate / 16, this.phosphate / 1, this.silicate / 15);

        // Base productivity modified by region and nutrients
        let baseProductivity = 2.8; // gC/m²/day

        switch (this.region) {
            case 'coastal':
                baseProductivity = 8.5;
                break;
            case 'gyre-center':
                baseProductivity = 0.8;
                break;
            case 'equatorial':
                baseProductivity = 4.2;
                break;
            case 'polar':
                baseProductivity = 1.5;
                break;
        }

        const productivity = baseProductivity * limitingFactor;
        const classification = this.getProductivityClass(productivity);

        // Update display
        document.getElementById('productivity-result').textContent = productivity.toFixed(1) + ' gC/m²/day';
        const classElement = document.getElementById('productivity-class');
        classElement.textContent = classification;
        classElement.setAttribute('data-class', classification.toLowerCase());

        // Update visualization
        this.updateNutrientVisualization();
    }

    getProductivityClass(productivity) {
        if (productivity < 1) return 'Oligotrophic';
        if (productivity < 5) return 'Mesotrophic';
        return 'Eutrophic';
    }

    updateNutrientVisualization() {
        const canvas = document.getElementById('nutrient-distribution');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw nutrient bars
        const nutrients = [
            { name: 'Nitrate', value: this.nitrate, max: 50, color: '#2196f3' },
            { name: 'Phosphate', value: this.phosphate, max: 5, color: '#4caf50' },
            { name: 'Silicate', value: this.silicate, max: 100, color: '#ff9800' }
        ];

        const barWidth = 60;
        const spacing = 80;
        const startX = 50;

        nutrients.forEach((nutrient, index) => {
            const x = startX + index * spacing;
            const barHeight = (nutrient.value / nutrient.max) * 200;

            // Draw bar
            ctx.fillStyle = nutrient.color;
            ctx.fillRect(x, 250 - barHeight, barWidth, barHeight);

            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(nutrient.name, x + barWidth/2, 270);
            ctx.fillText(nutrient.value.toFixed(1), x + barWidth/2, 285);
        });
    }
}

class ProductivityAnalyzer {
    constructor() {
        this.scenario = 'current';
        this.scenarios = {
            current: {
                phytoplankton: 100,
                zooplankton: 100,
                smallFish: 100,
                predators: 100,
                fisheries: 100
            },
            expanded: {
                phytoplankton: 60,
                zooplankton: 45,
                smallFish: 30,
                predators: 20,
                fisheries: 15
            },
            severe: {
                phytoplankton: 30,
                zooplankton: 20,
                smallFish: 10,
                predators: 5,
                fisheries: 3
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

        // Update metrics
        const biomassReduction = ((1 - data.phytoplankton / 100) * 100).toFixed(0);
        const fisheriesImpact = ((1 - data.fisheries / 100) * 28).toFixed(0); // $28B baseline
        const biodiversityLoss = Math.round((1 - data.predators / 100) * 340);

        document.getElementById('biomass-reduction').textContent = `-${biomassReduction}%`;
        document.getElementById('fisheries-impact').textContent = `-$${fisheriesImpact}B/year`;
        document.getElementById('biodiversity-loss').textContent = `${biodiversityLoss} species`;

        // Update food web visualization
        this.updateFoodWeb(data);
    }

    updateFoodWeb(data) {
        const canvas = document.getElementById('food-web-canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Define trophic levels
        const levels = [
            { name: 'Phytoplankton', biomass: data.phytoplankton, color: '#4caf50', y: 50 },
            { name: 'Zooplankton', biomass: data.zooplankton, color: '#2196f3', y: 150 },
            { name: 'Small Fish', biomass: data.smallFish, color: '#ff9800', y: 250 },
            { name: 'Predators', biomass: data.predators, color: '#f44336', y: 350 },
            { name: 'Fisheries', biomass: data.fisheries, color: '#9c27b0', y: 450 }
        ];

        // Draw connecting lines (food web)
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        for (let i = 0; i < levels.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(300, levels[i].y);
            ctx.lineTo(300, levels[i + 1].y);
            ctx.stroke();
        }

        // Draw biomass bars and circles
        levels.forEach(level => {
            const barWidth = (level.biomass / 100) * 200;
            const x = 300 - barWidth / 2;

            // Draw bar
            ctx.fillStyle = level.color;
            ctx.fillRect(x, level.y - 15, barWidth, 30);

            // Draw circle
            ctx.beginPath();
            ctx.arc(300, level.y, 20, 0, 2 * Math.PI);
            ctx.fill();

            // Draw percentage
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${level.biomass}%`, 300, level.y + 4);

            // Draw label
            ctx.fillStyle = '#333';
            ctx.textAlign = 'right';
            ctx.fillText(level.name, 270, level.y + 4);
        });
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
        this.closeBtn.addEventListener('click', () => this.close());
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
            'ocean-gyres': `
                <h2>Ocean Gyres Explained</h2>
                <p>Ocean gyres are large systems of circulating ocean currents formed by global wind patterns and the Earth's rotation. The major gyres are:</p>
                <ul>
                    <li><strong>North Atlantic Gyre</strong> - Includes the Gulf Stream</li>
                    <li><strong>South Atlantic Gyre</strong></li>
                    <li><strong>North Pacific Gyre</strong> - Largest, includes the "Great Pacific Garbage Patch"</li>
                    <li><strong>South Pacific Gyre</strong></li>
                    <li><strong>Indian Ocean Gyre</strong></li>
                </ul>
                <p>These gyres act like giant whirlpools, concentrating pollutants and creating stable, low-nutrient centers.</p>
            `,
            'oligotrophic-zones': `
                <h2>Oligotrophic Zones</h2>
                <p>Oligotrophic zones are areas of ocean with very low nutrient concentrations, leading to low primary productivity. Key characteristics:</p>
                <ul>
                    <li>Extremely clear, deep blue water</li>
                    <li>Very low concentrations of nitrates, phosphates, and silicates</li>
                    <li>Primary productivity < 1 gC/m²/day</li>
                    <li>Located in subtropical gyre centers</li>
                </ul>
                <p>These zones expand as climate change strengthens gyre circulation and increases ocean stratification.</p>
            `,
            'biological-consequences': `
                <h2>Biological Consequences</h2>
                <p>The expansion of nutrient deserts has cascading effects through marine food webs:</p>
                <ul>
                    <li><strong>Reduced Primary Production</strong> - Fewer phytoplankton</li>
                    <li><strong>Trophic Cascade</strong> - Declines in zooplankton, fish, and marine mammals</li>
                    <li><strong>Biodiversity Loss</strong> - Species dependent on productive waters disappear</li>
                    <li><strong>Fisheries Collapse</strong> - Commercial fish stocks decline dramatically</li>
                    <li><strong>Carbon Cycle Impact</strong> - Reduced oceanic CO₂ sequestration</li>
                </ul>
                <p>These changes threaten global food security and marine ecosystem stability.</p>
            `
        };

        return content[topic] || '<h2>Content Not Found</h2><p>Educational content for this topic is not yet available.</p>';
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize simulators and calculators
    new OceanGyreSimulator();
    new NutrientCalculator();
    new ProductivityAnalyzer();
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