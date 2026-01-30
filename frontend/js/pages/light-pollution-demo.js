// Light Pollution Demo - Nocturnal Predator-Prey Dynamics JavaScript

class Animal {
    constructor(type, area) {
        this.type = type;
        this.area = area;
        this.element = document.createElement('div');
        this.element.className = `animal ${type}`;
        this.area.appendChild(this.element);
        this.reset();
    }

    reset() {
        this.x = Math.random() * (this.area.clientWidth - 20);
        this.y = Math.random() * (this.area.clientHeight - 20);
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x <= 0 || this.x >= this.area.clientWidth - 20) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(this.x, this.area.clientWidth - 20));
        }
        if (this.y <= 0 || this.y >= this.area.clientHeight - 20) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(this.y, this.area.clientHeight - 20));
        }

        this.updatePosition();
    }

    getDistance(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

class Simulation {
    constructor() {
        this.area = document.getElementById('simulationArea');
        this.lightOverlay = document.getElementById('lightOverlay');
        this.lightIntensity = 0;
        this.predators = [];
        this.prey = [];
        this.encounters = 0;
        this.huntingSuccess = 0;
        this.preySurvival = 0;

        this.setupControls();
        this.createAnimals();
        this.animate();
    }

    setupControls() {
        const lightSlider = document.getElementById('lightIntensity');
        const lightValue = document.getElementById('lightValue');
        const predatorSlider = document.getElementById('predatorCount');
        const predatorValue = document.getElementById('predatorValue');
        const preySlider = document.getElementById('preyCount');
        const preyValue = document.getElementById('preyValue');

        lightSlider.addEventListener('input', (e) => {
            this.lightIntensity = parseInt(e.target.value);
            lightValue.textContent = this.lightIntensity + '%';
            this.updateLight();
            this.updateStats();
        });

        predatorSlider.addEventListener('input', (e) => {
            predatorValue.textContent = e.target.value;
            this.setPredatorCount(parseInt(e.target.value));
        });

        preySlider.addEventListener('input', (e) => {
            preyValue.textContent = e.target.value;
            this.setPreyCount(parseInt(e.target.value));
        });
    }

    updateLight() {
        this.lightOverlay.style.opacity = this.lightIntensity / 100;
    }

    createAnimals() {
        this.setPredatorCount(3);
        this.setPreyCount(10);
    }

    setPredatorCount(count) {
        while (this.predators.length > count) {
            const predator = this.predators.pop();
            predator.element.remove();
        }
        while (this.predators.length < count) {
            this.predators.push(new Animal('predator', this.area));
        }
    }

    setPreyCount(count) {
        while (this.prey.length > count) {
            const prey = this.prey.pop();
            prey.element.remove();
        }
        while (this.prey.length < count) {
            this.prey.push(new Animal('prey', this.area));
        }
    }

    animate() {
        // Move animals
        [...this.predators, ...this.prey].forEach(animal => animal.move());

        // Check for encounters
        this.checkEncounters();

        // Update stats periodically
        if (Math.random() < 0.02) { // 2% chance per frame
            this.updateStats();
        }

        requestAnimationFrame(() => this.animate());
    }

    checkEncounters() {
        this.predators.forEach(predator => {
            this.prey.forEach(prey => {
                if (predator.getDistance(prey) < 30) {
                    this.encounters++;

                    // Light affects hunting success
                    const baseSuccess = 0.3; // 30% base success in darkness
                    const lightPenalty = (this.lightIntensity / 100) * 0.4; // Up to 40% penalty
                    const success = Math.random() < (baseSuccess - lightPenalty);

                    if (success) {
                        this.huntingSuccess++;
                        prey.reset(); // Prey escapes/caught
                    }
                }
            });
        });
    }

    updateStats() {
        const totalEncounters = Math.max(this.encounters, 1);
        const successRate = (this.huntingSuccess / totalEncounters) * 100;
        const survivalRate = 100 - successRate;

        document.getElementById('huntingSuccess').textContent = Math.round(successRate) + '%';
        document.getElementById('preySurvival').textContent = Math.round(survivalRate) + '%';
        document.getElementById('encounters').textContent = Math.round(this.encounters / 60); // Per minute assuming 60fps

        // Reset counters periodically
        if (this.encounters > 1000) {
            this.encounters = 0;
            this.huntingSuccess = 0;
        }
    }
}

// Initialize simulation when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Simulation();
});