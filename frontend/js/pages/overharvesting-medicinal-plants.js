// Overharvesting of Medicinal Plants Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initializeScrollAnimations();
    initializeHarvestSimulator();
    initializeNetworkVisualizer();
    initializeSoilMonitor();
    initializeWildlifeTracker();
    initializeModalSystem();
    initializeCaseStudies();
});

// Scroll animations for content sections
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });
}

// Harvest Impact Simulator
function initializeHarvestSimulator() {
    const plantSpecies = document.getElementById('plant-species');
    const harvestIntensity = document.getElementById('harvest-intensity');
    const harvestFrequency = document.getElementById('harvest-frequency');
    const simulationYears = document.getElementById('simulation-years');
    const runSimulation = document.getElementById('run-simulation');

    // Value displays
    const intensityValue = document.getElementById('intensity-value');
    const frequencyValue = document.getElementById('frequency-value');
    const yearsValue = document.getElementById('years-value');

    // Result elements
    const plantPopulationBar = document.getElementById('plant-population-bar');
    const pollinatorDiversityBar = document.getElementById('pollinator-diversity-bar');
    const soilHealthBar = document.getElementById('soil-health-bar');
    const wildlifeAbundanceBar = document.getElementById('wildlife-abundance-bar');

    const plantPopulationValue = document.getElementById('plant-population-value');
    const pollinatorDiversityValue = document.getElementById('pollinator-diversity-value');
    const soilHealthValue = document.getElementById('soil-health-value');
    const wildlifeAbundanceValue = document.getElementById('wildlife-abundance-value');

    // Plant species data
    const plantData = {
        'ginseng': {
            name: 'American Ginseng',
            resilience: 0.3, // Lower = more vulnerable
            pollinatorDependence: 0.7,
            soilAssociation: 0.8,
            wildlifeValue: 0.6
        },
        'echinacea': {
            name: 'Purple Coneflower',
            resilience: 0.5,
            pollinatorDependence: 0.9,
            soilAssociation: 0.6,
            wildlifeValue: 0.8
        },
        'goldenseal': {
            name: 'Goldenseal',
            resilience: 0.2,
            pollinatorDependence: 0.5,
            soilAssociation: 0.9,
            wildlifeValue: 0.4
        },
        'black-cohosh': {
            name: 'Black Cohosh',
            resilience: 0.4,
            pollinatorDependence: 0.6,
            soilAssociation: 0.7,
            wildlifeValue: 0.5
        },
        'bloodroot': {
            name: 'Bloodroot',
            resilience: 0.3,
            pollinatorDependence: 0.4,
            soilAssociation: 0.8,
            wildlifeValue: 0.3
        }
    };

    // Update value displays
    harvestIntensity.addEventListener('input', () => {
        intensityValue.textContent = harvestIntensity.value + '%';
    });

    harvestFrequency.addEventListener('input', () => {
        frequencyValue.textContent = harvestFrequency.value + ' years';
    });

    simulationYears.addEventListener('input', () => {
        yearsValue.textContent = simulationYears.value + ' years';
    });

    // Run simulation
    runSimulation.addEventListener('click', () => {
        const species = plantSpecies.value;
        const intensity = parseFloat(harvestIntensity.value) / 100;
        const frequency = parseFloat(harvestFrequency.value);
        const years = parseFloat(simulationYears.value);

        const data = plantData[species];
        const results = simulateHarvesting(data, intensity, frequency, years);

        updateSimulationResults(results);
        updateEcosystemChart(results, years);
    });

    function simulateHarvesting(plantData, intensity, frequency, years) {
        let plantPopulation = 1.0;
        let pollinatorDiversity = 1.0;
        let soilHealth = 1.0;
        let wildlifeAbundance = 1.0;

        const timeSteps = years * 12; // Monthly simulation
        const harvestEvents = Math.floor(timeSteps / (frequency * 12));

        for (let i = 0; i < timeSteps; i++) {
            const month = i % 12;
            const yearProgress = i / timeSteps;

            // Seasonal harvesting (typically fall)
            if (month >= 8 && month <= 10) { // September-November
                const harvestIndex = Math.floor(i / (frequency * 12));
                if (harvestIndex < harvestEvents) {
                    // Apply harvesting impact
                    const harvestImpact = intensity * (1 - plantData.resilience);
                    plantPopulation *= (1 - harvestImpact);

                    // Cascade effects
                    pollinatorDiversity *= (1 - harvestImpact * plantData.pollinatorDependence * 0.3);
                    soilHealth *= (1 - harvestImpact * plantData.soilAssociation * 0.2);
                    wildlifeAbundance *= (1 - harvestImpact * plantData.wildlifeValue * 0.25);
                }
            }

            // Natural recovery (spring/summer)
            if (month >= 2 && month <= 7) { // March-August
                const recoveryRate = 0.02; // 2% monthly recovery
                plantPopulation = Math.min(1.0, plantPopulation + recoveryRate);
                pollinatorDiversity = Math.min(1.0, pollinatorDiversity + recoveryRate * 0.8);
                soilHealth = Math.min(1.0, soilHealth + recoveryRate * 0.6);
                wildlifeAbundance = Math.min(1.0, wildlifeAbundance + recoveryRate * 0.7);
            }

            // Environmental stress
            const environmentalStress = 0.001; // 0.1% monthly stress
            plantPopulation *= (1 - environmentalStress);
            pollinatorDiversity *= (1 - environmentalStress * 1.2);
            soilHealth *= (1 - environmentalStress * 0.8);
            wildlifeAbundance *= (1 - environmentalStress * 1.1);
        }

        return {
            plantPopulation: Math.max(0, plantPopulation),
            pollinatorDiversity: Math.max(0, pollinatorDiversity),
            soilHealth: Math.max(0, soilHealth),
            wildlifeAbundance: Math.max(0, wildlifeAbundance)
        };
    }

    function updateSimulationResults(results) {
        const formatPercent = (value) => Math.round(value * 100) + '%';

        plantPopulationBar.style.width = formatPercent(results.plantPopulation);
        pollinatorDiversityBar.style.width = formatPercent(results.pollinatorDiversity);
        soilHealthBar.style.width = formatPercent(results.soilHealth);
        wildlifeAbundanceBar.style.width = formatPercent(results.wildlifeAbundance);

        plantPopulationValue.textContent = formatPercent(results.plantPopulation);
        pollinatorDiversityValue.textContent = formatPercent(results.pollinatorDiversity);
        soilHealthValue.textContent = formatPercent(results.soilHealth);
        wildlifeAbundanceValue.textContent = formatPercent(results.wildlifeAbundance);
    }

    function updateEcosystemChart(results, years) {
        const ctx = document.getElementById('ecosystem-trend-chart');
        if (!ctx) return;

        const labels = [];
        for (let i = 0; i <= years; i++) {
            labels.push(`Year ${i}`);
        }

        // Simple trend data (in a real implementation, this would track actual simulation steps)
        const plantData = Array.from({length: years + 1}, (_, i) =>
            Math.max(0.1, 1 - (i / years) * (1 - results.plantPopulation))
        );
        const pollinatorData = Array.from({length: years + 1}, (_, i) =>
            Math.max(0.1, 1 - (i / years) * (1 - results.pollinatorDiversity))
        );
        const soilData = Array.from({length: years + 1}, (_, i) =>
            Math.max(0.1, 1 - (i / years) * (1 - results.soilHealth))
        );
        const wildlifeData = Array.from({length: years + 1}, (_, i) =>
            Math.max(0.1, 1 - (i / years) * (1 - results.wildlifeAbundance))
        );

        if (window.ecosystemChart) {
            window.ecosystemChart.destroy();
        }

        window.ecosystemChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Plant Population',
                    data: plantData,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Pollinator Diversity',
                    data: pollinatorData,
                    borderColor: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Soil Health',
                    data: soilData,
                    borderColor: '#92400e',
                    backgroundColor: 'rgba(146, 64, 14, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Wildlife Abundance',
                    data: wildlifeData,
                    borderColor: '#ea580c',
                    backgroundColor: 'rgba(234, 88, 12, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Ecosystem Health Trends Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            callback: function(value) {
                                return Math.round(value * 100) + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Initialize with default values
    intensityValue.textContent = harvestIntensity.value + '%';
    frequencyValue.textContent = harvestFrequency.value + ' years';
    yearsValue.textContent = simulationYears.value + ' years';
}

// Pollinator Network Visualizer
function initializeNetworkVisualizer() {
    const networkPlant = document.getElementById('network-plant');
    const disruptionLevel = document.getElementById('disruption-level');
    const updateNetwork = document.getElementById('update-network');

    const connectedSpecies = document.getElementById('connected-species');
    const networkStability = document.getElementById('network-stability');
    const pollinationEfficiency = document.getElementById('pollination-efficiency');

    const disruptionValue = document.getElementById('disruption-value');

    // Network data for different plants
    const networkData = {
        'ginseng': {
            pollinators: ['bumblebees', 'honeybees', 'solitary_bees', 'flies', 'beetles'],
            connections: 12,
            baseStability: 85,
            baseEfficiency: 78
        },
        'echinacea': {
            pollinators: ['bumblebees', 'honeybees', 'butterflies', 'moths', 'flies', 'beetles', 'birds'],
            connections: 18,
            baseStability: 92,
            baseEfficiency: 88
        },
        'goldenseal': {
            pollinators: ['ants', 'flies', 'beetles', 'small_bees'],
            connections: 8,
            baseStability: 75,
            baseEfficiency: 65
        }
    };

    disruptionLevel.addEventListener('input', () => {
        disruptionValue.textContent = disruptionLevel.value + '%';
    });

    updateNetwork.addEventListener('click', () => {
        const plant = networkPlant.value;
        const disruption = parseFloat(disruptionLevel.value) / 100;

        const data = networkData[plant];
        const results = calculateNetworkImpact(data, disruption);

        updateNetworkDisplay(results);
        renderNetworkVisualization(plant, disruption);
    });

    function calculateNetworkImpact(data, disruption) {
        const remainingConnections = Math.max(1, data.connections * (1 - disruption));
        const stability = Math.max(10, data.baseStability * (1 - disruption * 1.5));
        const efficiency = Math.max(5, data.baseEfficiency * (1 - disruption * 1.2));

        return {
            connectedSpecies: Math.round(remainingConnections),
            stability: Math.round(stability),
            efficiency: Math.round(efficiency)
        };
    }

    function updateNetworkDisplay(results) {
        connectedSpecies.textContent = results.connectedSpecies;
        networkStability.textContent = results.stability + '%';
        pollinationEfficiency.textContent = results.efficiency + '%';
    }

    function renderNetworkVisualization(plant, disruption) {
        const canvas = document.getElementById('network-canvas');
        if (!canvas) return;

        // Clear previous content
        canvas.innerHTML = '';

        // Simple D3.js network visualization
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        const svg = d3.select('#network-canvas')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const data = networkData[plant];
        const nodes = [{id: plant, group: 'plant'}];
        const links = [];

        // Add pollinator nodes
        data.pollinators.forEach((pollinator, i) => {
            nodes.push({id: pollinator, group: 'pollinator'});
            if (Math.random() > disruption) {
                links.push({source: plant, target: pollinator});
            }
        });

        // Add some cross-connections between pollinators
        for (let i = 1; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() > 0.7 && Math.random() > disruption) {
                    links.push({source: nodes[i].id, target: nodes[j].id});
                }
            }
        }

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(60))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', '#7c3aed')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 2);

        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', d => d.group === 'plant' ? 12 : 8)
            .attr('fill', d => d.group === 'plant' ? '#059669' : '#fbbf24')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        node.append('title')
            .text(d => d.id);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        });
    }

    // Initialize with default values
    disruptionValue.textContent = disruptionLevel.value + '%';
}

// Soil Health Monitor
function initializeSoilMonitor() {
    const soilPlant = document.getElementById('soil-plant');
    const soilMoisture = document.getElementById('soil-moisture');
    const soilPh = document.getElementById('soil-ph');

    const plantCoverValue = document.getElementById('plant-cover-value');
    const moistureValue = document.getElementById('moisture-value');
    const phValue = document.getElementById('ph-value');

    const microbialDiversity = document.getElementById('microbial-diversity');
    const nutrientCycling = document.getElementById('nutrient-cycling');
    const soilStructure = document.getElementById('soil-structure');
    const erosionRisk = document.getElementById('erosion-risk');
    const erosionIndicator = document.getElementById('erosion-indicator');

    // Update value displays
    soilPlant.addEventListener('input', updateSoilHealth);
    soilMoisture.addEventListener('input', updateSoilHealth);
    soilPh.addEventListener('input', updateSoilHealth);

    function updateSoilHealth() {
        const plantCover = parseFloat(soilPlant.value) / 100;
        const moisture = parseFloat(soilMoisture.value) / 100;
        const ph = parseFloat(soilPh.value);

        plantCoverValue.textContent = soilPlant.value + '%';
        moistureValue.textContent = soilMoisture.value + '%';
        phValue.textContent = ph.toFixed(1);

        // Calculate soil health metrics
        const microbialDiv = calculateMicrobialDiversity(plantCover, moisture, ph);
        const nutrientCycle = calculateNutrientCycling(plantCover, moisture, ph);
        const soilStruct = calculateSoilStructure(plantCover, moisture, ph);
        const erosion = calculateErosionRisk(plantCover, moisture);

        updateSoilMetrics(microbialDiv, nutrientCycle, soilStruct, erosion);
    }

    function calculateMicrobialDiversity(plantCover, moisture, ph) {
        let diversity = plantCover * 0.6 + moisture * 0.3;
        // pH optimum around 6.0-7.0
        const phFactor = 1 - Math.abs(ph - 6.5) * 0.1;
        diversity *= Math.max(0.1, phFactor);
        return Math.min(1, diversity);
    }

    function calculateNutrientCycling(plantCover, moisture, ph) {
        let cycling = plantCover * 0.7 + moisture * 0.2;
        const phFactor = 1 - Math.abs(ph - 6.0) * 0.08;
        cycling *= Math.max(0.1, phFactor);
        return Math.min(1, cycling);
    }

    function calculateSoilStructure(plantCover, moisture, ph) {
        let structure = plantCover * 0.8 + moisture * 0.4;
        const phFactor = 1 - Math.abs(ph - 6.5) * 0.05;
        structure *= Math.max(0.2, phFactor);
        return Math.min(1, structure);
    }

    function calculateErosionRisk(plantCover, moisture) {
        // Higher plant cover = lower erosion risk
        // Higher moisture can increase erosion if plant cover is low
        const baseRisk = (1 - plantCover) * 0.8;
        const moistureFactor = moisture > 0.7 && plantCover < 0.5 ? 1.2 : 1.0;
        return Math.min(1, baseRisk * moistureFactor);
    }

    function updateSoilMetrics(microbial, nutrient, structure, erosion) {
        const formatPercent = (value) => Math.round(value * 100) + '%';

        microbialDiversity.textContent = formatPercent(microbial);
        document.getElementById('microbial-diversity-bar').style.width = formatPercent(microbial);

        nutrientCycling.textContent = formatPercent(nutrient);
        document.getElementById('nutrient-cycling-bar').style.width = formatPercent(nutrient);

        soilStructure.textContent = formatPercent(structure);
        document.getElementById('soil-structure-bar').style.width = formatPercent(structure);

        // Update erosion risk
        let riskLevel, color;
        if (erosion < 0.3) {
            riskLevel = 'Low';
            color = '#22c55e';
        } else if (erosion < 0.6) {
            riskLevel = 'Moderate';
            color = '#f59e0b';
        } else if (erosion < 0.8) {
            riskLevel = 'High';
            color = '#ea580c';
        } else {
            riskLevel = 'Critical';
            color = '#dc2626';
        }

        erosionRisk.textContent = riskLevel;
        erosionIndicator.style.background = color;
    }

    // Initialize with default values
    updateSoilHealth();
}

// Wildlife Population Tracker
function initializeWildlifeTracker() {
    const habitatType = document.getElementById('habitat-type');
    const fragmentation = document.getElementById('fragmentation');
    const monitoringYears = document.getElementById('monitoring-years');

    const fragmentationValue = document.getElementById('fragmentation-value');
    const monitoringValue = document.getElementById('monitoring-value');

    const beesTrend = document.getElementById('bees-trend');
    const butterfliesTrend = document.getElementById('butterflies-trend');
    const mammalsTrend = document.getElementById('mammals-trend');
    const birdsTrend = document.getElementById('birds-trend');

    const beesValue = document.getElementById('bees-value');
    const butterfliesValue = document.getElementById('butterflies-value');
    const mammalsValue = document.getElementById('mammals-value');
    const birdsValue = document.getElementById('birds-value');

    // Update value displays
    fragmentation.addEventListener('input', updateWildlifePopulations);
    monitoringYears.addEventListener('input', updateWildlifePopulations);
    habitatType.addEventListener('change', updateWildlifePopulations);

    function updateWildlifePopulations() {
        const habitat = habitatType.value;
        const fragLevel = parseFloat(fragmentation.value) / 100;
        const years = parseFloat(monitoringYears.value);

        fragmentationValue.textContent = fragmentation.value + '%';
        monitoringValue.textContent = years + ' years';

        const populations = calculateWildlifePopulations(habitat, fragLevel, years);
        updatePopulationDisplay(populations);
        updateFoodWebVisualization(habitat, fragLevel);
    }

    function calculateWildlifePopulations(habitat, fragmentation, years) {
        // Base population declines due to habitat fragmentation
        const baseDecline = fragmentation * 0.7; // 70% max decline
        const timeFactor = Math.min(1, years / 10); // Full effect after 10 years

        const habitatModifiers = {
            'forest': { bees: 0.8, butterflies: 0.9, mammals: 0.7, birds: 0.8 },
            'prairie': { bees: 0.9, butterflies: 0.95, mammals: 0.8, birds: 0.85 },
            'woodland': { bees: 0.85, butterflies: 0.8, mammals: 0.75, birds: 0.9 }
        };

        const modifiers = habitatModifiers[habitat];

        return {
            bees: Math.max(0.05, (1 - baseDecline * timeFactor) * modifiers.bees),
            butterflies: Math.max(0.05, (1 - baseDecline * timeFactor * 1.1) * modifiers.butterflies),
            mammals: Math.max(0.05, (1 - baseDecline * timeFactor * 0.8) * modifiers.mammals),
            birds: Math.max(0.05, (1 - baseDecline * timeFactor * 0.9) * modifiers.birds)
        };
    }

    function updatePopulationDisplay(populations) {
        const formatPercent = (value) => Math.round(value * 100) + '%';

        beesTrend.style.width = formatPercent(populations.bees);
        beesValue.textContent = formatPercent(populations.bees);

        butterfliesTrend.style.width = formatPercent(populations.butterflies);
        butterfliesValue.textContent = formatPercent(populations.butterflies);

        mammalsTrend.style.width = formatPercent(populations.mammals);
        mammalsValue.textContent = formatPercent(populations.mammals);

        birdsTrend.style.width = formatPercent(populations.birds);
        birdsValue.textContent = formatPercent(populations.birds);
    }

    function updateFoodWebVisualization(habitat, fragmentation) {
        const canvas = document.getElementById('food-web-canvas');
        if (!canvas) return;

        // Simple food web representation
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw simplified food web
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Plants in center
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Plants', centerX, centerY + 35);

        // Pollinators
        const pollinatorPositions = [
            {x: centerX - 80, y: centerY - 60, label: 'Bees'},
            {x: centerX + 80, y: centerY - 60, label: 'Butterflies'},
            {x: centerX - 80, y: centerY + 60, label: 'Other Insects'}
        ];

        ctx.fillStyle = '#fbbf24';
        pollinatorPositions.forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.fillText(pos.label, pos.x, pos.y + 30);
            ctx.fillStyle = '#fbbf24';
        });

        // Wildlife
        const wildlifePositions = [
            {x: centerX - 120, y: centerY, label: 'Mammals'},
            {x: centerX + 120, y: centerY, label: 'Birds'}
        ];

        ctx.fillStyle = '#ea580c';
        wildlifePositions.forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.fillText(pos.label, pos.x, pos.y + 30);
            ctx.fillStyle = '#ea580c';
        });

        // Draw connections (fade based on fragmentation)
        ctx.strokeStyle = `rgba(124, 58, 237, ${1 - fragmentation})`;
        ctx.lineWidth = 2;

        // Plant to pollinators
        pollinatorPositions.forEach(pos => {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        });

        // Pollinators to wildlife
        pollinatorPositions.forEach(pollinator => {
            wildlifePositions.forEach(wildlife => {
                ctx.beginPath();
                ctx.moveTo(pollinator.x, pollinator.y);
                ctx.lineTo(wildlife.x, wildlife.y);
                ctx.stroke();
            });
        });
    }

    // Initialize with default values
    updateWildlifePopulations();
}

// Modal System
function initializeModalSystem() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const closeButtons = document.querySelectorAll('.close');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// Case Studies
function initializeCaseStudies() {
    const caseStudyCards = document.querySelectorAll('.case-study-card');

    caseStudyCards.forEach(card => {
        card.addEventListener('click', () => {
            const studyId = card.dataset.modal;
            // Modal opening is handled by the modal system
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for potential use in other scripts
window.OverharvestingMedicinalPlants = {
    initializeHarvestSimulator,
    initializeNetworkVisualizer,
    initializeSoilMonitor,
    initializeWildlifeTracker
};