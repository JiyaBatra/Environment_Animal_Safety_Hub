// Sand Mining-Induced Riverbed Incision Simulator

class RiverIncisionSimulator {
    constructor() {
        this.canvas = document.getElementById('riverCanvas');
        this.ctx = this.canvas.getContext('2d');

        // River parameters
        this.riverType = 'large';
        this.miningIntensity = 50;
        this.miningDuration = 10;
        this.seasonalFlow = 'normal';

        // River profile data
        this.originalProfile = [];
        this.incisedProfile = [];
        this.sedimentParticles = [];
        this.habitatZones = [];

        this.initializeEventListeners();
        this.initializeProfiles();
        this.draw();
    }

    initializeEventListeners() {
        // Control inputs
        document.getElementById('riverType').addEventListener('change', (e) => {
            this.riverType = e.target.value;
            this.updateProfiles();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('miningIntensity').addEventListener('input', (e) => {
            this.miningIntensity = parseInt(e.target.value);
            document.getElementById('intensityValue').textContent = this.miningIntensity + '%';
            this.updateProfiles();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('miningDuration').addEventListener('input', (e) => {
            this.miningDuration = parseInt(e.target.value);
            document.getElementById('durationValue').textContent = this.miningDuration;
            this.updateProfiles();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('seasonalFlow').addEventListener('change', (e) => {
            this.seasonalFlow = e.target.value;
            this.updateProfiles();
            this.updateMetrics();
            this.draw();
        });

        document.getElementById('simulateBtn').addEventListener('click', () => {
            this.runSimulation();
        });
    }

    initializeProfiles() {
        this.updateProfiles();
    }

    updateProfiles() {
        const profilePoints = 100;
        this.originalProfile = [];
        this.incisedProfile = [];
        this.habitatZones = [];

        // Base parameters based on river type
        let baseDepth = 0, baseWidth = 0, incisionRate = 0;
        switch (this.riverType) {
            case 'large':
                baseDepth = 5; baseWidth = 100; incisionRate = 0.1;
                break;
            case 'medium':
                baseDepth = 3; baseWidth = 50; incisionRate = 0.15;
                break;
            case 'small':
                baseDepth = 2; baseWidth = 20; incisionRate = 0.2;
                break;
        }

        // Flow factor
        let flowFactor = 1;
        switch (this.seasonalFlow) {
            case 'high': flowFactor = 1.5; break;
            case 'low': flowFactor = 0.7; break;
        }

        // Calculate incision
        const totalIncision = this.miningIntensity / 100 * this.miningDuration * incisionRate * flowFactor;
        const channelWidening = totalIncision * 2; // Incision often leads to proportional widening

        for (let i = 0; i < profilePoints; i++) {
            const x = (i / profilePoints) * this.canvas.width;
            const centerX = this.canvas.width / 2;

            // Original river profile (parabolic cross-section)
            const distanceFromCenter = Math.abs(x - centerX);
            const originalDepth = baseDepth * (1 - (distanceFromCenter / (baseWidth / 2)) ** 2);
            const originalY = this.canvas.height - 50 - originalDepth * 10;

            // Incised profile
            const incisedDepth = Math.max(0, originalDepth - totalIncision);
            const incisedY = this.canvas.height - 50 - incisedDepth * 10;

            // Widened channel
            const widenedWidth = baseWidth + channelWidening;
            const widenedDistance = Math.abs(x - centerX);
            const widenedDepth = incisedDepth * (1 - (widenedDistance / (widenedWidth / 2)) ** 2);
            const finalY = this.canvas.height - 50 - widenedDepth * 10;

            this.originalProfile.push({ x, y: originalY });
            this.incisedProfile.push({ x, y: finalY });

            // Habitat zones (pools and riffles)
            if (i % 20 === 0) {
                const habitatType = Math.random() > 0.5 ? 'pool' : 'riffle';
                this.habitatZones.push({
                    x,
                    y: finalY,
                    type: habitatType,
                    affected: totalIncision > 1
                });
            }
        }

        // Initialize sediment particles
        this.sedimentParticles = [];
        for (let i = 0; i < 50; i++) {
            this.sedimentParticles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height - 30 + Math.random() * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 1,
                size: Math.random() * 3 + 1,
                life: Math.random() * 100
            });
        }
    }

    updateMetrics() {
        // Calculate incision depth
        const maxOriginalDepth = Math.max(...this.originalProfile.map(p => this.canvas.height - 50 - p.y)) / 10;
        const maxIncisedDepth = Math.max(...this.incisedProfile.map(p => this.canvas.height - 50 - p.y)) / 10;
        const incisionDepth = maxOriginalDepth - maxIncisedDepth;

        // Calculate channel widening
        const originalWidth = this.calculateChannelWidth(this.originalProfile);
        const incisedWidth = this.calculateChannelWidth(this.incisedProfile);
        const channelWidening = incisedWidth - originalWidth;

        // Calculate habitat loss
        const affectedHabitats = this.habitatZones.filter(h => h.affected).length;
        const habitatLossPercent = (affectedHabitats / this.habitatZones.length) * 100;

        // Biodiversity impact
        let biodiversityImpact = 'Low';
        if (habitatLossPercent > 70) biodiversityImpact = 'High';
        else if (habitatLossPercent > 40) biodiversityImpact = 'Medium';

        // Update display
        document.getElementById('incisionDepth').textContent = incisionDepth.toFixed(1) + ' m';
        document.getElementById('channelWidth').textContent = channelWidening.toFixed(1) + ' m';
        document.getElementById('habitatLoss').textContent = habitatLossPercent.toFixed(0) + '%';
        document.getElementById('biodiversityImpact').textContent = biodiversityImpact;

        // Update indicators
        this.updateHabitatIndicator(habitatLossPercent);
        this.updateBiodiversityIndicator(biodiversityImpact);
    }

    calculateChannelWidth(profile) {
        const waterLevel = this.canvas.height - 50;
        let leftEdge = 0, rightEdge = this.canvas.width;

        for (let i = 0; i < profile.length; i++) {
            if (profile[i].y < waterLevel) {
                leftEdge = profile[i].x;
                break;
            }
        }

        for (let i = profile.length - 1; i >= 0; i--) {
            if (profile[i].y < waterLevel) {
                rightEdge = profile[i].x;
                break;
            }
        }

        return rightEdge - leftEdge;
    }

    updateHabitatIndicator(lossPercent) {
        const indicator = document.getElementById('habitatIndicator');
        const percentage = Math.min(100, lossPercent);
        indicator.style.background = `linear-gradient(to right,
            #28a745 0%, #28a745 ${percentage * 0.33}%,
            #ffc107 ${percentage * 0.33}%, #ffc107 ${percentage * 0.66}%,
            #dc3545 ${percentage * 0.66}%, #dc3545 100%)`;
    }

    updateBiodiversityIndicator(impact) {
        const indicator = document.getElementById('biodiversityIndicator');
        let percentage = 0.2;
        if (impact === 'Medium') percentage = 0.5;
        if (impact === 'High') percentage = 0.8;

        indicator.style.background = `linear-gradient(to right,
            #28a745 0%, #28a745 ${percentage * 33}%,
            #ffc107 ${percentage * 33}%, #ffc107 ${percentage * 66}%,
            #dc3545 ${percentage * 66}%, #dc3545 100%)`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sky and landscape
        this.drawBackground();

        // Draw original river profile
        this.drawRiverProfile(this.originalProfile, 'rgba(16, 185, 129, 0.3)', 2);

        // Draw incised river profile
        this.drawRiverProfile(this.incisedProfile, 'rgba(220, 38, 38, 0.8)', 3);

        // Draw water surface
        this.drawWaterSurface();

        // Draw habitat zones
        this.drawHabitatZones();

        // Draw sediment particles
        this.drawSedimentParticles();

        // Draw mining indicators
        this.drawMiningIndicators();
    }

    drawBackground() {
        // Sky gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.6);
        skyGradient.addColorStop(0, '#87ceeb');
        skyGradient.addColorStop(1, '#e0f6ff');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.6);

        // Hills/landscape
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillRect(0, this.canvas.height * 0.6, this.canvas.width, this.canvas.height * 0.4);

        // River banks
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 30);
    }

    drawRiverProfile(profile, color, lineWidth) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();

        profile.forEach((point, index) => {
            if (index === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        });

        this.ctx.stroke();
    }

    drawWaterSurface() {
        const waterLevel = this.canvas.height - 50;
        this.ctx.fillStyle = 'rgba(14, 165, 233, 0.6)';
        this.ctx.fillRect(0, waterLevel, this.canvas.width, 50);

        // Water flow lines
        this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
        this.ctx.lineWidth = 1;
        for (let y = waterLevel + 10; y < this.canvas.height - 10; y += 15) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            for (let x = 0; x < this.canvas.width; x += 20) {
                this.ctx.lineTo(x, y + Math.sin(x * 0.1) * 2);
            }
            this.ctx.stroke();
        }
    }

    drawHabitatZones() {
        this.habitatZones.forEach(zone => {
            const color = zone.affected ? 'rgba(220, 38, 38, 0.7)' : 'rgba(16, 185, 129, 0.7)';
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(zone.x, zone.y - 10, 8, 0, Math.PI * 2);
            this.ctx.fill();

            // Habitat type indicator
            this.ctx.fillStyle = zone.affected ? '#dc2626' : '#10b981';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(zone.type, zone.x - 15, zone.y - 20);
        });
    }

    drawSedimentParticles() {
        this.sedimentParticles.forEach(particle => {
            this.ctx.fillStyle = 'rgba(217, 119, 6, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawMiningIndicators() {
        // Mining activity indicators
        const miningSites = Math.floor(this.miningIntensity / 20) + 1;
        for (let i = 0; i < miningSites; i++) {
            const x = (this.canvas.width / (miningSites + 1)) * (i + 1);
            const y = this.canvas.height - 40;

            // Mining equipment
            this.ctx.fillStyle = '#666666';
            this.ctx.fillRect(x - 10, y - 15, 20, 10);

            // Conveyor or dredge
            this.ctx.strokeStyle = '#333333';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - 15);
            this.ctx.lineTo(x, y - 25);
            this.ctx.stroke();
        }
    }

    runSimulation() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        let progress = 0;

        const animate = () => {
            progress += 0.02;

            if (progress >= 1) {
                this.isAnimating = false;
                return;
            }

            // Animate incision process
            this.animateIncision(progress);
            this.updateSedimentParticles();
            this.draw();

            requestAnimationFrame(animate);
        };

        animate();
    }

    animateIncision(progress) {
        // Gradually show the incision effect
        const targetIncision = this.miningIntensity / 100 * this.miningDuration * 0.1;
        const currentIncision = targetIncision * progress;

        // Update profile based on progress
        for (let i = 0; i < this.incisedProfile.length; i++) {
            const originalY = this.originalProfile[i].y;
            const targetY = originalY + currentIncision * 10; // Scale for visualization
            this.incisedProfile[i].y = originalY + (targetY - originalY) * progress;
        }
    }

    updateSedimentParticles() {
        this.sedimentParticles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Gravity

            // Reset particles that go off screen
            if (particle.y > this.canvas.height || particle.x < 0 || particle.x > this.canvas.width) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = this.canvas.height - 30 + Math.random() * 20;
                particle.vx = (Math.random() - 0.5) * 2;
                particle.vy = -Math.random() * 1;
            }

            particle.life--;
        });
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new RiverIncisionSimulator();
});
<parameter name="filePath">c:\Users\Gupta\Downloads\Environment_Animal_Safety_Hub\frontend\js\sand-mining-incision.js