// BVOC Decline in Degraded Forests Simulator

class BVOCSimulator {
    constructor() {
        this.canvas = document.getElementById('atmosphereCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Forest parameters
        this.forestType = 'tropical';
        this.degradationLevel = 30;
        this.climateScenario = 'current';
        this.timeOfDay = 'noon';

        // Atmospheric components
        this.bvocParticles = [];
        this.ozoneParticles = [];
        this.aerosolParticles = [];
        this.cloudParticles = [];

        this.initializeEventListeners();
        this.initializeParticles();
        this.draw();
    }

    initializeEventListeners() {
        // Control inputs
        document.getElementById('forestType').addEventListener('change', (e) => {
            this.forestType = e.target.value;
            this.updateEmissions();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('degradationLevel').addEventListener('input', (e) => {
            this.degradationLevel = parseInt(e.target.value);
            document.getElementById('degradationValue').textContent = this.degradationLevel + '%';
            this.updateEmissions();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('climateScenario').addEventListener('change', (e) => {
            this.climateScenario = e.target.value;
            this.updateEmissions();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('timeOfDay').addEventListener('change', (e) => {
            this.timeOfDay = e.target.value;
            this.updateEmissions();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('simulateBtn').addEventListener('click', () => {
            this.runSimulation();
        });
    }

    initializeParticles() {
        // Initialize BVOC particles
        for (let i = 0; i < 30; i++) {
            this.bvocParticles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height - 50 + Math.random() * 50,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 1,
                life: Math.random() * 100,
                size: Math.random() * 3 + 1
            });
        }

        // Initialize ozone particles
        for (let i = 0; i < 20; i++) {
            this.ozoneParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.7,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                life: Math.random() * 80,
                size: Math.random() * 2 + 1
            });
        }

        // Initialize aerosol particles
        for (let i = 0; i < 25; i++) {
            this.aerosolParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -Math.random() * 0.5,
                life: Math.random() * 120,
                size: Math.random() * 1.5 + 0.5
            });
        }

        // Initialize cloud particles
        for (let i = 0; i < 15; i++) {
            this.cloudParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.4,
                vx: (Math.random() - 0.5) * 0.3,
                vy: 0,
                life: Math.random() * 200,
                size: Math.random() * 8 + 4
            });
        }
    }

    updateEmissions() {
        // Calculate emission rates based on parameters
        let baseEmission = 0;
        switch (this.forestType) {
            case 'tropical': baseEmission = 100; break;
            case 'temperate': baseEmission = 75; break;
            case 'boreal': baseEmission = 50; break;
            case 'mediterranean': baseEmission = 60; break;
        }

        // Apply degradation factor
        const degradationFactor = (100 - this.degradationLevel) / 100;

        // Apply climate scenario
        let climateFactor = 1;
        switch (this.climateScenario) {
            case 'warming': climateFactor = 0.8; break;
            case 'drought': climateFactor = 0.6; break;
            case 'extreme': climateFactor = 0.4; break;
        }

        // Apply time of day
        let timeFactor = 1;
        switch (this.timeOfDay) {
            case 'morning': timeFactor = 0.7; break;
            case 'noon': timeFactor = 1.0; break;
            case 'afternoon': timeFactor = 0.9; break;
            case 'night': timeFactor = 0.3; break;
        }

        this.currentEmission = baseEmission * degradationFactor * climateFactor * timeFactor;
        this.ozoneProduction = this.currentEmission * 0.3 * (this.climateScenario === 'warming' ? 1.2 : 1.0);
        this.aerosolFormation = this.currentEmission * 0.2;
        this.cloudFormation = this.aerosolFormation * 0.15;
    }

    updateMetrics() {
        // Update display values
        document.getElementById('bvocRate').textContent = Math.round(this.currentEmission) + ' μg/m²/h';
        document.getElementById('ozoneProduction').textContent = Math.round(this.ozoneProduction * 10) / 10 + ' ppb/h';
        document.getElementById('aerosolFormation').textContent = Math.round(this.aerosolFormation * 10) / 10 + ' μg/m³';

        // Calculate changes (compared to pristine forest)
        let pristineEmission = 0;
        switch (this.forestType) {
            case 'tropical': pristineEmission = 100; break;
            case 'temperate': pristineEmission = 75; break;
            case 'boreal': pristineEmission = 50; break;
            case 'mediterranean': pristineEmission = 60; break;
        }

        const bvocChange = ((this.currentEmission - pristineEmission) / pristineEmission) * 100;
        const ozoneChange = ((this.ozoneProduction - (pristineEmission * 0.3)) / (pristineEmission * 0.3)) * 100;
        const aerosolChange = ((this.aerosolFormation - (pristineEmission * 0.2)) / (pristineEmission * 0.2)) * 100;

        this.updateChangeIndicator('bvocChange', bvocChange);
        this.updateChangeIndicator('ozoneChange', ozoneChange);
        this.updateChangeIndicator('aerosolChange', aerosolChange);

        // Climate feedback assessment
        const feedbackScore = Math.abs(bvocChange) + Math.abs(ozoneChange) + Math.abs(aerosolChange);
        let feedbackLevel = 'Neutral';
        if (feedbackScore > 150) feedbackLevel = 'Strong Warming';
        else if (feedbackScore > 100) feedbackLevel = 'Moderate Warming';
        else if (feedbackScore > 50) feedbackLevel = 'Weak Warming';

        document.getElementById('climateFeedback').textContent = feedbackLevel;
        this.updateFeedbackIndicator(feedbackScore);
    }

    updateChangeIndicator(elementId, change) {
        const element = document.getElementById(elementId);
        element.textContent = (change > 0 ? '+' : '') + Math.round(change) + '%';
        element.className = 'metric-change ' +
            (change > 5 ? 'positive' : change < -5 ? 'negative' : 'neutral');
    }

    updateFeedbackIndicator(score) {
        const indicator = document.getElementById('feedbackIndicator');
        const percentage = Math.min(100, (score / 200) * 100);
        indicator.style.background = `linear-gradient(to right,
            #28a745 0%, #28a745 ${percentage * 0.33}%,
            #ffc107 ${percentage * 0.33}%, #ffc107 ${percentage * 0.66}%,
            #dc3545 ${percentage * 0.66}%, #dc3545 100%)`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sky gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        skyGradient.addColorStop(0, '#87ceeb');
        skyGradient.addColorStop(0.7, '#ffffff');
        skyGradient.addColorStop(1, '#f0f8ff');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw forest canopy
        this.drawForest();

        // Draw atmospheric components
        this.drawParticles();

        // Draw atmospheric layers
        this.drawAtmosphericLayers();
    }

    drawForest() {
        const canopyHeight = 80;
        const canopyY = this.canvas.height - canopyHeight;

        // Forest canopy
        this.ctx.fillStyle = '#059669';
        this.ctx.fillRect(0, canopyY, this.canvas.width, canopyHeight);

        // Individual trees (simplified)
        this.ctx.fillStyle = '#10b981';
        for (let i = 0; i < this.canvas.width; i += 40) {
            const treeHeight = 60 + Math.random() * 20;
            this.ctx.fillRect(i, canopyY - treeHeight + 20, 8, treeHeight);
        }

        // Ground
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
    }

    drawAtmosphericLayers() {
        // Draw concentration gradients
        this.ctx.globalAlpha = 0.3;

        // BVOC emission layer (near ground)
        const bvocGradient = this.ctx.createLinearGradient(0, this.canvas.height - 100, 0, this.canvas.height - 200);
        bvocGradient.addColorStop(0, 'rgba(5, 150, 105, 0.4)');
        bvocGradient.addColorStop(1, 'rgba(5, 150, 105, 0)');
        this.ctx.fillStyle = bvocGradient;
        this.ctx.fillRect(0, this.canvas.height - 200, this.canvas.width, 100);

        // Ozone layer (mid-atmosphere)
        const ozoneGradient = this.ctx.createLinearGradient(0, this.canvas.height - 250, 0, this.canvas.height - 350);
        ozoneGradient.addColorStop(0, 'rgba(220, 38, 38, 0.3)');
        ozoneGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
        this.ctx.fillStyle = ozoneGradient;
        this.ctx.fillRect(0, this.canvas.height - 350, this.canvas.width, 100);

        // Aerosol layer (upper atmosphere)
        const aerosolGradient = this.ctx.createLinearGradient(0, this.canvas.height - 400, 0, this.canvas.height - 500);
        aerosolGradient.addColorStop(0, 'rgba(124, 58, 237, 0.2)');
        aerosolGradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
        this.ctx.fillStyle = aerosolGradient;
        this.ctx.fillRect(0, this.canvas.height - 500, this.canvas.width, 100);

        this.ctx.globalAlpha = 1;
    }

    drawParticles() {
        // Draw BVOC particles
        this.bvocParticles.forEach(particle => {
            this.ctx.fillStyle = 'rgba(5, 150, 105, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw ozone particles
        this.ozoneParticles.forEach(particle => {
            this.ctx.fillStyle = 'rgba(220, 38, 38, 0.7)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw aerosol particles
        this.aerosolParticles.forEach(particle => {
            this.ctx.fillStyle = 'rgba(124, 58, 237, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw cloud particles
        this.cloudParticles.forEach(particle => {
            this.ctx.fillStyle = 'rgba(107, 114, 128, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    runSimulation() {
        // Animate particles for simulation
        const animate = () => {
            this.updateParticles();
            this.draw();

            if (this.animationRunning) {
                requestAnimationFrame(animate);
            }
        };

        this.animationRunning = true;
        animate();

        // Stop after 5 seconds
        setTimeout(() => {
            this.animationRunning = false;
        }, 5000);
    }

    updateParticles() {
        // Update BVOC particles (emitted from forest)
        this.bvocParticles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Gravity

            // Reset if out of bounds
            if (particle.y > this.canvas.height || particle.x < 0 || particle.x > this.canvas.width) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = this.canvas.height - 50 + Math.random() * 50;
                particle.vx = (Math.random() - 0.5) * 2;
                particle.vy = -Math.random() * 3 - 1;
            }

            particle.life--;
        });

        // Update ozone particles (formed from BVOC reactions)
        this.ozoneParticles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Brownian motion
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;

            // Wrap around
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            particle.life--;
        });

        // Update aerosol particles
        this.aerosolParticles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Slow upward movement
            particle.vy -= 0.02;

            // Reset if too high
            if (particle.y < 0) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = this.canvas.height - 100 + Math.random() * 100;
                particle.vx = (Math.random() - 0.5) * 0.5;
                particle.vy = -Math.random() * 0.5;
            }

            particle.life--;
        });

        // Update cloud particles
        this.cloudParticles.forEach(particle => {
            particle.x += particle.vx;

            // Slow horizontal movement
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;

            particle.life--;
        });
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new BVOCSimulator();
});</content>
<parameter name="filePath">c:\Users\Gupta\Downloads\Environment_Animal_Safety_Hub\frontend\js\bvoc-decline.js