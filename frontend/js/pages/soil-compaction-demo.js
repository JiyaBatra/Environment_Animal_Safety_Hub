// Soil Compaction Demo - Heavy Machinery Impact on Conservation Areas JavaScript

class SoilParticle {
    constructor(layer, x, y, size) {
        this.layer = layer;
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.size = size;
        this.element = document.createElement('div');
        this.element.className = 'soil-particle';
        this.element.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${layer === 'topsoil' ? '#BC9864' : '#8B4513'};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            opacity: 0.7;
            transition: all 0.5s ease;
        `;
        layer.appendChild(this.element);
    }

    updateCompaction(compactionLevel) {
        // Particles get compressed and closer together
        const compression = compactionLevel * 0.3;
        const newX = this.originalX + (Math.random() - 0.5) * compression * 10;
        const newY = this.originalY + compression * 5;

        this.element.style.left = Math.max(0, Math.min(newX, this.layer.clientWidth - this.size)) + 'px';
        this.element.style.top = Math.max(0, Math.min(newY, this.layer.clientHeight - this.size)) + 'px';
        this.element.style.opacity = Math.max(0.3, 1 - compactionLevel * 0.4);
    }
}

class Root {
    constructor(layer, x, y, length, angle) {
        this.layer = layer;
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = angle;
        this.element = document.createElement('div');
        this.element.className = 'root';
        this.element.style.cssText = `
            position: absolute;
            width: ${length}px;
            height: 3px;
            background: #228B22;
            left: ${x}px;
            top: ${y}px;
            transform: rotate(${angle}deg);
            transform-origin: left center;
            opacity: 0.8;
            transition: all 0.5s ease;
        `;
        layer.appendChild(this.element);
    }

    updateCompaction(compactionLevel) {
        // Roots get stunted and less visible with compaction
        const growthReduction = compactionLevel * 0.6;
        this.element.style.width = Math.max(10, this.length * (1 - growthReduction)) + 'px';
        this.element.style.opacity = Math.max(0.2, 1 - growthReduction);
        this.element.style.transform = `rotate(${this.angle}deg) scaleY(${Math.max(0.3, 1 - growthReduction * 0.5)})`;
    }
}

class Invertebrate {
    constructor(layer, x, y, type) {
        this.layer = layer;
        this.x = x;
        this.y = y;
        this.type = type;
        this.element = document.createElement('div');
        this.element.className = 'invertebrate';
        this.element.textContent = type;
        this.element.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 16px;
            opacity: 0.8;
            transition: all 0.5s ease;
        `;
        layer.appendChild(this.element);
    }

    updateCompaction(compactionLevel) {
        // Invertebrates become less active and visible with compaction
        const populationReduction = compactionLevel * 0.7;
        this.element.style.opacity = Math.max(0.1, 1 - populationReduction);
        this.element.style.transform = `scale(${Math.max(0.3, 1 - populationReduction * 0.5)})`;
    }
}

class SoilCompactionSimulation {
    constructor() {
        this.topsoil = document.getElementById('topsoil');
        this.subsoil = document.getElementById('subsoil');
        this.machineryOverlay = document.getElementById('machineryOverlay');

        this.particles = [];
        this.roots = [];
        this.invertebrates = [];

        this.pressure = 0;
        this.moisture = 30;
        this.passes = 0;

        this.setupControls();
        this.initializeSoil();
        this.updateSimulation();
    }

    setupControls() {
        const pressureSlider = document.getElementById('machineryPressure');
        const pressureValue = document.getElementById('pressureValue');
        const moistureSlider = document.getElementById('soilMoisture');
        const moistureValue = document.getElementById('moistureValue');
        const passesSlider = document.getElementById('passes');
        const passesValue = document.getElementById('passesValue');

        pressureSlider.addEventListener('input', (e) => {
            this.pressure = parseInt(e.target.value);
            pressureValue.textContent = this.pressure + ' tons';
            this.updateMachineryVisibility();
            this.updateSimulation();
        });

        moistureSlider.addEventListener('input', (e) => {
            this.moisture = parseInt(e.target.value);
            moistureValue.textContent = this.moisture + '%';
            this.updateSimulation();
        });

        passesSlider.addEventListener('input', (e) => {
            this.passes = parseInt(e.target.value);
            passesValue.textContent = this.passes;
            this.updateSimulation();
        });
    }

    initializeSoil() {
        // Create soil particles
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.topsoil.clientWidth;
            const y = Math.random() * this.topsoil.clientHeight;
            const size = Math.random() * 8 + 4;
            this.particles.push(new SoilParticle(this.topsoil, x, y, size));
        }

        for (let i = 0; i < 30; i++) {
            const x = Math.random() * this.subsoil.clientWidth;
            const y = Math.random() * this.subsoil.clientHeight;
            const size = Math.random() * 6 + 3;
            this.particles.push(new SoilParticle(this.subsoil, x, y, size));
        }

        // Create roots
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * this.topsoil.clientWidth;
            const y = Math.random() * this.topsoil.clientHeight * 0.8;
            const length = Math.random() * 60 + 20;
            const angle = Math.random() * 180 - 90;
            this.roots.push(new Root(this.topsoil, x, y, length, angle));
        }

        for (let i = 0; i < 8; i++) {
            const x = Math.random() * this.subsoil.clientWidth;
            const y = Math.random() * this.subsoil.clientHeight * 0.6;
            const length = Math.random() * 40 + 15;
            const angle = Math.random() * 180 - 90;
            this.roots.push(new Root(this.subsoil, x, y, length, angle));
        }

        // Create invertebrates
        const invertTypes = ['🐛', '🪱', '🐞', '🦋', '🐌'];
        for (let i = 0; i < 12; i++) {
            const layer = Math.random() > 0.6 ? this.subsoil : this.topsoil;
            const x = Math.random() * layer.clientWidth;
            const y = Math.random() * layer.clientHeight;
            const type = invertTypes[Math.floor(Math.random() * invertTypes.length)];
            this.invertebrates.push(new Invertebrate(layer, x, y, type));
        }
    }

    updateMachineryVisibility() {
        this.machineryOverlay.style.opacity = this.pressure > 0 ? 0.8 : 0;
    }

    updateSimulation() {
        // Calculate overall compaction level (0-1)
        const pressureFactor = Math.min(this.pressure / 50, 1);
        const moistureFactor = Math.max(0, (this.moisture - 20) / 60); // Optimal moisture reduces compaction
        const passesFactor = Math.min(this.passes / 20, 1);

        const compactionLevel = (pressureFactor * 0.6 + passesFactor * 0.4) * (1 - moistureFactor * 0.3);

        // Update all elements
        this.particles.forEach(particle => particle.updateCompaction(compactionLevel));
        this.roots.forEach(root => root.updateCompaction(compactionLevel));
        this.invertebrates.forEach(invert => invert.updateCompaction(compactionLevel));

        // Update statistics
        this.updateStats(compactionLevel);
    }

    updateStats(compactionLevel) {
        // Soil porosity decreases with compaction
        const porosity = Math.max(5, 45 * (1 - compactionLevel * 0.8));
        document.getElementById('porosity').textContent = Math.round(porosity) + '%';

        // Root growth decreases with compaction
        const rootGrowth = Math.max(10, 95 * (1 - compactionLevel * 0.9));
        document.getElementById('rootGrowth').textContent = Math.round(rootGrowth) + '%';

        // Invertebrate population decreases with compaction
        const invertebrateCount = Math.max(5, 85 * (1 - compactionLevel * 0.85));
        document.getElementById('invertebrateCount').textContent = Math.round(invertebrateCount) + '%';

        // Water infiltration decreases with compaction
        const waterInfiltration = Math.max(10, 90 * (1 - compactionLevel * 0.8));
        document.getElementById('waterInfiltration').textContent = Math.round(waterInfiltration) + '%';
    }
}

// Initialize simulation when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SoilCompactionSimulation();
});