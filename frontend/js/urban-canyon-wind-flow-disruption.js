// Urban Canyon Wind Flow Disruption Simulation

class UrbanCanyonSimulator {
    constructor() {
        this.canvas = document.getElementById('canyonCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Simulation parameters
        this.buildingHeight = 40;
        this.canyonWidth = 20;
        this.windSpeed = 15;
        this.windDirection = 'west';

        // Canvas dimensions
        this.canvasWidth = 800;
        this.canvasHeight = 400;

        // Scale factors
        this.scaleX = this.canvasWidth / 100; // 100m wide view
        this.scaleY = this.canvasHeight / 60; // 60m high view

        // Particles for visualization
        this.windParticles = [];
        this.seedParticles = [];
        this.insectParticles = [];

        this.initializeEventListeners();
        this.initializeParticles();
        this.draw();
    }

    initializeEventListeners() {
        // Control inputs
        document.getElementById('buildingHeight').addEventListener('input', (e) => {
            this.buildingHeight = parseInt(e.target.value);
            document.getElementById('heightValue').textContent = this.buildingHeight;
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('canyonWidth').addEventListener('input', (e) => {
            this.canyonWidth = parseInt(e.target.value);
            document.getElementById('widthValue').textContent = this.canyonWidth;
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('windSpeed').addEventListener('input', (e) => {
            this.windSpeed = parseInt(e.target.value);
            document.getElementById('windValue').textContent = this.windSpeed;
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('windDirection').addEventListener('change', (e) => {
            this.windDirection = e.target.value;
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('simulateBtn').addEventListener('click', () => {
            this.runSimulation();
        });
    }

    initializeParticles() {
        // Initialize wind particles
        for (let i = 0; i < 50; i++) {
            this.windParticles.push({
                x: Math.random() * this.canvasWidth,
                y: Math.random() * this.canvasHeight,
                vx: 0,
                vy: 0,
                life: Math.random() * 100
            });
        }

        // Initialize seed particles
        for (let i = 0; i < 20; i++) {
            this.seedParticles.push({
                x: this.canvasWidth / 2 + (Math.random() - 0.5) * 50,
                y: this.canvasHeight - 50,
                vx: 0,
                vy: 0,
                life: Math.random() * 200
            });
        }

        // Initialize insect particles
        for (let i = 0; i < 15; i++) {
            this.insectParticles.push({
                x: Math.random() * this.canvasWidth,
                y: Math.random() * this.canvasHeight,
                vx: 0,
                vy: 0,
                life: Math.random() * 150
            });
        }
    }

    updateMetrics() {
        // Calculate metrics based on parameters
        const aspectRatio = this.buildingHeight / this.canyonWidth;
        const windReduction = Math.max(0.1, 1 - aspectRatio * 0.02);
        const seedDispersion = Math.max(10, 100 * windReduction * (this.windSpeed / 15));
        const insectRange = Math.max(20, 200 * windReduction * (this.windSpeed / 15));

        // Update display
        document.getElementById('seedDistance').textContent = Math.round(seedDispersion) + ' m';
        document.getElementById('insectRange').textContent = Math.round(insectRange) + ' m';
        document.getElementById('canyonWindSpeed').textContent = Math.round(this.windSpeed * windReduction) + ' km/h';

        // Calculate changes (compared to open field)
        const seedChange = ((seedDispersion - 100) / 100) * 100;
        const insectChange = ((insectRange - 200) / 200) * 100;
        const windChange = ((windReduction - 1) * 100);

        this.updateChangeIndicator('seedChange', seedChange);
        this.updateChangeIndicator('insectChange', insectChange);
        this.updateChangeIndicator('windChange', windChange);

        // Biodiversity impact
        const impactScore = Math.abs(seedChange) + Math.abs(insectChange) + Math.abs(windChange);
        let impactLevel = 'Low';
        if (impactScore > 100) impactLevel = 'High';
        else if (impactScore > 50) impactLevel = 'Medium';

        document.getElementById('biodiversityImpact').textContent = impactLevel;
        this.updateImpactIndicator(impactScore);
    }

    updateChangeIndicator(elementId, change) {
        const element = document.getElementById(elementId);
        element.textContent = (change > 0 ? '+' : '') + Math.round(change) + '%';
        element.className = 'metric-change ' +
            (change > 5 ? 'positive' : change < -5 ? 'negative' : 'neutral');
    }

    updateImpactIndicator(score) {
        const indicator = document.getElementById('impactIndicator');
        const percentage = Math.min(100, (score / 150) * 100);
        indicator.style.background = `linear-gradient(to right,
            #28a745 0%, #28a745 ${percentage * 0.33}%,
            #ffc107 ${percentage * 0.33}%, #ffc107 ${percentage * 0.66}%,
            #dc3545 ${percentage * 0.66}%, #dc3545 100%)`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(1, '#ffffff');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw buildings
        this.drawBuildings();

        // Draw wind flow
        this.drawWindFlow();

        // Draw particles
        this.drawParticles();
    }

    drawBuildings() {
        const buildingWidth = 30;
        const leftBuildingX = this.canvasWidth / 2 - this.canyonWidth * 2;
        const rightBuildingX = this.canvasWidth / 2 + this.canyonWidth * 2;

        // Left building
        this.ctx.fillStyle = '#666666';
        this.ctx.fillRect(leftBuildingX, this.canvasHeight - this.buildingHeight * 3, buildingWidth, this.buildingHeight * 3);

        // Right building
        this.ctx.fillRect(rightBuildingX, this.canvasHeight - this.buildingHeight * 3, buildingWidth, this.buildingHeight * 3);

        // Windows
        this.ctx.fillStyle = '#ffff99';
        for (let i = 0; i < this.buildingHeight / 5; i++) {
            // Left building windows
            this.ctx.fillRect(leftBuildingX + 5, this.canvasHeight - (i + 1) * 15, 8, 10);
            this.ctx.fillRect(leftBuildingX + 17, this.canvasHeight - (i + 1) * 15, 8, 10);

            // Right building windows
            this.ctx.fillRect(rightBuildingX + 5, this.canvasHeight - (i + 1) * 15, 8, 10);
            this.ctx.fillRect(rightBuildingX + 17, this.canvasHeight - (i + 1) * 15, 8, 10);
        }
    }

    drawWindFlow() {
        const aspectRatio = this.buildingHeight / this.canyonWidth;
        const canyonCenter = this.canvasWidth / 2;
        const canyonTop = this.canvasHeight - this.buildingHeight * 3;

        // Draw wind flow lines
        this.ctx.strokeStyle = 'rgba(74, 144, 226, 0.6)';
        this.ctx.lineWidth = 2;

        // Calculate wind direction vector
        let windX = 0, windY = 0;
        switch (this.windDirection) {
            case 'north': windY = -1; break;
            case 'south': windY = 1; break;
            case 'east': windX = 1; break;
            case 'west': windX = -1; break;
        }

        // Draw wind flow in canyon
        for (let y = canyonTop + 20; y < this.canvasHeight - 20; y += 30) {
            this.ctx.beginPath();
            let x = canyonCenter;

            // Wind speed varies with height and canyon geometry
            const heightFactor = (this.canvasHeight - y) / this.canvasHeight;
            const canyonFactor = Math.max(0.3, 1 - aspectRatio * 0.1);
            const speed = this.windSpeed * heightFactor * canyonFactor * 0.1;

            for (let i = 0; i < 20; i++) {
                this.ctx.lineTo(x, y);
                x += windX * speed + (Math.random() - 0.5) * 2;
                y += windY * speed + (Math.random() - 0.5) * 2;
            }
            this.ctx.stroke();
        }
    }

    drawParticles() {
        // Draw wind particles
        this.windParticles.forEach(particle => {
            this.ctx.fillStyle = 'rgba(74, 144, 226, 0.7)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw seed particles
        this.seedParticles.forEach(particle => {
            this.ctx.fillStyle = 'rgba(218, 165, 32, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw insect particles
        this.insectParticles.forEach(particle => {
            this.ctx.fillStyle = 'rgba(50, 205, 50, 0.8)';
            this.ctx.fillRect(particle.x - 2, particle.y - 1, 4, 2);
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
        const aspectRatio = this.buildingHeight / this.canyonWidth;
        const canyonFactor = Math.max(0.3, 1 - aspectRatio * 0.1);

        // Update wind particles
        this.windParticles.forEach(particle => {
            let vx = 0, vy = 0;
            switch (this.windDirection) {
                case 'north': vy = -0.5; break;
                case 'south': vy = 0.5; break;
                case 'east': vx = 0.5; break;
                case 'west': vx = -0.5; break;
            }

            particle.vx = vx * this.windSpeed * 0.1 * canyonFactor;
            particle.vy = vy * this.windSpeed * 0.1 * canyonFactor;

            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around
            if (particle.x < 0) particle.x = this.canvasWidth;
            if (particle.x > this.canvasWidth) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvasHeight;
            if (particle.y > this.canvasHeight) particle.y = 0;

            particle.life--;
            if (particle.life < 0) {
                particle.life = 100;
                particle.x = Math.random() * this.canvasWidth;
                particle.y = Math.random() * this.canvasHeight;
            }
        });

        // Update seed particles (more affected by canyon)
        this.seedParticles.forEach(particle => {
            const dispersion = canyonFactor * 0.3;
            particle.vx += (Math.random() - 0.5) * dispersion;
            particle.vy -= Math.random() * 0.2; // Gravity

            particle.x += particle.vx;
            particle.y += particle.vy;

            // Reset if out of bounds
            if (particle.y > this.canvasHeight || particle.x < 0 || particle.x > this.canvasWidth) {
                particle.x = this.canvasWidth / 2 + (Math.random() - 0.5) * 50;
                particle.y = this.canvasHeight - 50;
                particle.vx = 0;
                particle.vy = 0;
            }

            particle.life--;
        });

        // Update insect particles
        this.insectParticles.forEach(particle => {
            const movement = canyonFactor * 0.5;
            particle.vx += (Math.random() - 0.5) * movement;
            particle.vy += (Math.random() - 0.5) * movement;

            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off buildings
            const leftBuilding = this.canvasWidth / 2 - this.canyonWidth * 2;
            const rightBuilding = this.canvasWidth / 2 + this.canyonWidth * 2 + 30;

            if (particle.x < leftBuilding + 30 && particle.x > leftBuilding) {
                particle.vx = Math.abs(particle.vx);
            }
            if (particle.x > rightBuilding - 30 && particle.x < rightBuilding) {
                particle.vx = -Math.abs(particle.vx);
            }

            // Wrap vertically
            if (particle.y < 0) particle.y = this.canvasHeight;
            if (particle.y > this.canvasHeight) particle.y = 0;

            particle.life--;
        });
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new UrbanCanyonSimulator();
});