// Freshwater Thermal Inversion Simulator

class ThermalInversionSimulator {
    constructor() {
        this.canvas = document.getElementById('lakeCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Lake parameters
        this.lakeDepth = 20;
        this.season = 'fall';
        this.windSpeed = 10;
        this.nutrientLevel = 'mesotrophic';

        // Temperature profile data
        this.temperatureProfile = [];
        this.oxygenProfile = [];
        this.nutrientProfile = [];

        // Animation
        this.isAnimating = false;
        this.animationProgress = 0;

        this.initializeEventListeners();
        this.initializeProfiles();
        this.draw();
    }

    initializeEventListeners() {
        // Control inputs
        document.getElementById('season').addEventListener('change', (e) => {
            this.season = e.target.value;
            this.updateProfiles();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('lakeDepth').addEventListener('input', (e) => {
            this.lakeDepth = parseInt(e.target.value);
            document.getElementById('depthValue').textContent = this.lakeDepth;
            this.updateProfiles();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('windSpeed').addEventListener('input', (e) => {
            this.windSpeed = parseInt(e.target.value);
            document.getElementById('windValue').textContent = this.windSpeed;
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('nutrientLevel').addEventListener('change', (e) => {
            this.nutrientLevel = e.target.value;
            this.updateProfiles();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('simulateBtn').addEventListener('click', () => {
            this.simulateTurnover();
        });
    }

    initializeProfiles() {
        this.updateProfiles();
    }

    updateProfiles() {
        const depthPoints = 50;
        this.temperatureProfile = [];
        this.oxygenProfile = [];
        this.nutrientProfile = [];

        for (let i = 0; i < depthPoints; i++) {
            const depth = (i / depthPoints) * this.lakeDepth;
            const normalizedDepth = depth / this.lakeDepth;

            // Temperature profile based on season
            let temperature;
            switch (this.season) {
                case 'spring':
                    temperature = 25 - 20 * normalizedDepth; // Warming up
                    break;
                case 'summer':
                    temperature = 28 - 15 * normalizedDepth; // Strong stratification
                    break;
                case 'fall':
                    temperature = 15 - 10 * normalizedDepth; // Cooling down
                    break;
                case 'winter':
                    temperature = 4 - 2 * normalizedDepth; // Ice cover potential
                    break;
            }

            // Oxygen profile (decreases with depth)
            const oxygen = 12 * (1 - Math.pow(normalizedDepth, 2));

            // Nutrient profile based on nutrient level
            let nutrientBase;
            switch (this.nutrientLevel) {
                case 'oligotrophic': nutrientBase = 5; break;
                case 'mesotrophic': nutrientBase = 15; break;
                case 'eutrophic': nutrientBase = 30; break;
                case 'hypereutrophic': nutrientBase = 50; break;
            }
            const nutrient = nutrientBase * (0.5 + normalizedDepth);

            this.temperatureProfile.push(temperature);
            this.oxygenProfile.push(Math.max(0, oxygen));
            this.nutrientProfile.push(nutrient);
        }
    }

    updateMetrics() {
        // Calculate metrics based on current conditions
        const bottomOxygen = this.oxygenProfile[this.oxygenProfile.length - 1];
        const surfaceNutrient = this.nutrientProfile[0];
        const averageNutrient = this.nutrientProfile.reduce((a, b) => a + b, 0) / this.nutrientProfile.length;

        // Oxygen depletion (compared to surface)
        const oxygenDepletion = ((12 - bottomOxygen) / 12) * 100;

        // Nutrient release potential
        const nutrientRelease = surfaceNutrient + (this.windSpeed / 30) * averageNutrient;

        // Algal bloom risk
        let bloomRisk = 'Low';
        if (nutrientRelease > 25) bloomRisk = 'High';
        else if (nutrientRelease > 15) bloomRisk = 'Medium';

        // Fish stress index
        let fishStress = 'Low';
        if (bottomOxygen < 3) fishStress = 'High';
        else if (bottomOxygen < 5) fishStress = 'Medium';

        // Update display
        document.getElementById('oxygenLevel').textContent = bottomOxygen.toFixed(1) + ' mg/L';
        document.getElementById('nutrientRelease').textContent = nutrientRelease.toFixed(0) + ' μg/L';
        document.getElementById('bloomRisk').textContent = bloomRisk;
        document.getElementById('fishStress').textContent = fishStress;

        // Update indicators
        this.updateBloomIndicator(bloomRisk);
        this.updateStressIndicator(fishStress);
    }

    updateBloomIndicator(risk) {
        const indicator = document.getElementById('bloomIndicator');
        let percentage = 0.2;
        if (risk === 'Medium') percentage = 0.5;
        if (risk === 'High') percentage = 0.8;

        indicator.style.background = `linear-gradient(to right,
            #28a745 0%, #28a745 ${percentage * 33}%,
            #ffc107 ${percentage * 33}%, #ffc107 ${percentage * 66}%,
            #dc3545 ${percentage * 66}%, #dc3545 100%)`;
    }

    updateStressIndicator(stress) {
        const indicator = document.getElementById('stressIndicator');
        let percentage = 0.2;
        if (stress === 'Medium') percentage = 0.5;
        if (stress === 'High') percentage = 0.8;

        indicator.style.background = `linear-gradient(to right,
            #28a745 0%, #28a745 ${percentage * 33}%,
            #ffc107 ${percentage * 33}%, #ffc107 ${percentage * 66}%,
            #dc3545 ${percentage * 66}%, #dc3545 100%)`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw lake background
        this.drawLakeBackground();

        // Draw temperature profile
        this.drawTemperatureProfile();

        // Draw oxygen profile
        this.drawOxygenProfile();

        // Draw thermocline
        this.drawThermocline();

        // Draw lake bottom
        this.drawLakeBottom();
    }

    drawLakeBackground() {
        // Sky gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.3);
        skyGradient.addColorStop(0, '#87ceeb');
        skyGradient.addColorStop(1, '#e0f6ff');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.3);

        // Water surface
        this.ctx.fillStyle = '#4a90e2';
        this.ctx.fillRect(0, this.canvas.height * 0.3, this.canvas.width, this.canvas.height * 0.05);
    }

    drawTemperatureProfile() {
        const startX = 50;
        const profileWidth = 100;
        const profileHeight = this.canvas.height * 0.6;
        const startY = this.canvas.height * 0.35;

        this.ctx.strokeStyle = '#dc2626';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        this.temperatureProfile.forEach((temp, index) => {
            const x = startX + (index / this.temperatureProfile.length) * profileWidth;
            const y = startY + (30 - temp) / 30 * profileHeight; // Scale to show temperature range

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();

        // Temperature labels
        this.ctx.fillStyle = '#dc2626';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('Temperature (°C)', startX, startY - 10);
    }

    drawOxygenProfile() {
        const startX = 200;
        const profileWidth = 100;
        const profileHeight = this.canvas.height * 0.6;
        const startY = this.canvas.height * 0.35;

        this.ctx.strokeStyle = '#059669';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        this.oxygenProfile.forEach((oxygen, index) => {
            const x = startX + (index / this.oxygenProfile.length) * profileWidth;
            const y = startY + (12 - oxygen) / 12 * profileHeight;

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();

        // Oxygen labels
        this.ctx.fillStyle = '#059669';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('Oxygen (mg/L)', startX, startY - 10);
    }

    drawThermocline() {
        // Find thermocline (steepest temperature gradient)
        let maxGradient = 0;
        let thermoclineIndex = 10;

        for (let i = 1; i < this.temperatureProfile.length - 1; i++) {
            const gradient = Math.abs(this.temperatureProfile[i + 1] - this.temperatureProfile[i - 1]);
            if (gradient > maxGradient) {
                maxGradient = gradient;
                thermoclineIndex = i;
            }
        }

        const thermoclineDepth = (thermoclineIndex / this.temperatureProfile.length) * this.lakeDepth;
        const thermoclineY = this.canvas.height * 0.35 + (thermoclineDepth / this.lakeDepth) * (this.canvas.height * 0.6);

        // Draw thermocline line
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(50, thermoclineY);
        this.ctx.lineTo(350, thermoclineY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Thermocline label
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Thermocline (~${thermoclineDepth.toFixed(1)}m)`, 360, thermoclineY);
    }

    drawLakeBottom() {
        const bottomY = this.canvas.height * 0.95;
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(0, bottomY, this.canvas.width, this.canvas.height - bottomY);

        // Depth markers
        this.ctx.fillStyle = '#666';
        this.ctx.font = '10px Arial';
        for (let i = 0; i <= this.lakeDepth; i += 5) {
            const y = this.canvas.height * 0.35 + (i / this.lakeDepth) * (this.canvas.height * 0.6);
            this.ctx.fillText(`${i}m`, 10, y + 3);
        }
    }

    simulateTurnover() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.animationProgress = 0;

        const animate = () => {
            this.animationProgress += 0.02;

            if (this.animationProgress >= 1) {
                this.isAnimating = false;
                this.updateProfiles();
                this.updateMetrics();
                this.draw();
                return;
            }

            // Animate mixing
            this.animateMixing();
            this.draw();

            requestAnimationFrame(animate);
        };

        animate();
    }

    animateMixing() {
        // Create turbulent mixing effect
        const mixFactor = Math.sin(this.animationProgress * Math.PI) * 0.5;

        for (let i = 0; i < this.temperatureProfile.length; i++) {
            const randomMix = (Math.random() - 0.5) * mixFactor * 5;
            this.temperatureProfile[i] += randomMix;

            const oxygenMix = (Math.random() - 0.5) * mixFactor * 2;
            this.oxygenProfile[i] = Math.max(0, this.oxygenProfile[i] + oxygenMix);
        }
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new ThermalInversionSimulator();
});
<parameter name="filePath">c:\Users\Gupta\Downloads\Environment_Animal_Safety_Hub\frontend\js\freshwater-thermal-inversion.js