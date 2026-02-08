// Urban Waste Sites as Novel Wildlife Habitats Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initializeScrollAnimations();
    initializeHabitatSimulator();
    initializeVulnerabilityAnalyzer();
    initializeContaminationCascade();
    initializeMitigationExplorer();
    initializeModalSystem();
    initializeCaseStudies();
    initializeReportForm();
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

// Habitat Simulator
function initializeHabitatSimulator() {
    const wasteAge = document.getElementById('waste-age');
    const wasteComposition = document.getElementById('waste-composition');
    const urbanProximity = document.getElementById('urban-proximity');
    const season = document.getElementById('season');

    const wasteAgeValue = document.getElementById('waste-age-value');
    const urbanProximityValue = document.getElementById('urban-proximity-value');

    // Colonization bars
    const gullsBar = document.getElementById('gulls-bar');
    const rodentsBar = document.getElementById('rodents-bar');
    const foxesBar = document.getElementById('foxes-bar');
    const insectsBar = document.getElementById('insects-bar');

    // Values
    const gullsValue = document.getElementById('gulls-value');
    const rodentsValue = document.getElementById('rodents-value');
    const foxesValue = document.getElementById('foxes-value');
    const insectsValue = document.getElementById('insects-value');

    // Risk bars
    const contaminationRisk = document.getElementById('contamination-risk');
    const diseaseRisk = document.getElementById('disease-risk');
    const instabilityRisk = document.getElementById('instability-risk');

    // Risk values
    const contaminationValue = document.getElementById('contamination-value');
    const diseaseValue = document.getElementById('disease-value');
    const instabilityValue = document.getElementById('instability-value');

    // Species colonization data by waste type
    const colonizationData = {
        'mixed': {
            gulls: { base: 0.75, ageFactor: 0.02, urbanFactor: 0.03, seasonalFactor: { spring: 1.2, summer: 1.0, fall: 0.9, winter: 0.8 } },
            rodents: { base: 0.85, ageFactor: 0.03, urbanFactor: 0.04, seasonalFactor: { spring: 0.9, summer: 1.1, fall: 1.0, winter: 0.8 } },
            foxes: { base: 0.65, ageFactor: 0.025, urbanFactor: 0.02, seasonalFactor: { spring: 0.8, summer: 1.0, fall: 1.2, winter: 1.1 } },
            insects: { base: 0.90, ageFactor: 0.04, urbanFactor: 0.01, seasonalFactor: { spring: 1.1, summer: 1.3, fall: 0.9, winter: 0.6 } }
        },
        'organic': {
            gulls: { base: 0.80, ageFactor: 0.025, urbanFactor: 0.025, seasonalFactor: { spring: 1.3, summer: 1.1, fall: 0.8, winter: 0.7 } },
            rodents: { base: 0.80, ageFactor: 0.02, urbanFactor: 0.03, seasonalFactor: { spring: 0.8, summer: 1.2, fall: 1.1, winter: 0.9 } },
            foxes: { base: 0.70, ageFactor: 0.03, urbanFactor: 0.015, seasonalFactor: { spring: 0.9, summer: 1.1, fall: 1.3, winter: 1.0 } },
            insects: { base: 0.95, ageFactor: 0.05, urbanFactor: 0.005, seasonalFactor: { spring: 1.2, summer: 1.4, fall: 0.8, winter: 0.5 } }
        },
        'industrial': {
            gulls: { base: 0.60, ageFactor: 0.015, urbanFactor: 0.04, seasonalFactor: { spring: 1.0, summer: 0.9, fall: 1.1, winter: 0.9 } },
            rodents: { base: 0.75, ageFactor: 0.025, urbanFactor: 0.05, seasonalFactor: { spring: 0.9, summer: 1.0, fall: 1.2, winter: 1.0 } },
            foxes: { base: 0.55, ageFactor: 0.02, urbanFactor: 0.03, seasonalFactor: { spring: 0.8, summer: 0.9, fall: 1.1, winter: 1.2 } },
            insects: { base: 0.70, ageFactor: 0.03, urbanFactor: 0.02, seasonalFactor: { spring: 1.0, summer: 1.1, fall: 0.9, winter: 0.7 } }
        },
        'hazardous': {
            gulls: { base: 0.40, ageFactor: 0.01, urbanFactor: 0.02, seasonalFactor: { spring: 0.8, summer: 0.7, fall: 0.9, winter: 1.0 } },
            rodents: { base: 0.60, ageFactor: 0.015, urbanFactor: 0.03, seasonalFactor: { spring: 0.8, summer: 0.9, fall: 1.1, winter: 1.0 } },
            foxes: { base: 0.35, ageFactor: 0.01, urbanFactor: 0.025, seasonalFactor: { spring: 0.7, summer: 0.8, fall: 1.0, winter: 1.1 } },
            insects: { base: 0.50, ageFactor: 0.02, urbanFactor: 0.015, seasonalFactor: { spring: 0.9, summer: 1.0, fall: 0.8, winter: 0.6 } }
        }
    };

    function updateHabitatSimulation() {
        const age = parseFloat(wasteAge.value);
        const composition = wasteComposition.value;
        const proximity = parseFloat(urbanProximity.value);
        const currentSeason = season.value;

        wasteAgeValue.textContent = `${age} years`;
        urbanProximityValue.textContent = `${proximity} km`;

        const species = ['gulls', 'rodents', 'foxes', 'insects'];
        const colonizationRates = {};
        let totalRisk = 0;

        species.forEach(specie => {
            const data = colonizationData[composition][specie];
            let rate = data.base;

            // Age factor (older sites have more established populations)
            rate += data.ageFactor * Math.log(age + 1);

            // Urban proximity factor (closer to urban areas = more colonization)
            rate += data.urbanFactor * (10 - proximity) / 10;

            // Seasonal factor
            rate *= data.seasonalFactor[currentSeason];

            // Clamp between 0 and 1
            rate = Math.max(0, Math.min(1, rate));
            colonizationRates[specie] = rate;
            totalRisk += rate;
        });

        // Update colonization displays
        updateColonizationDisplay(colonizationRates);

        // Calculate and update risk assessments
        const avgColonization = Object.values(colonizationRates).reduce((sum, rate) => sum + rate, 0) / species.length;
        updateRiskAssessment(avgColonization, composition, age);
    }

    function updateColonizationDisplay(rates) {
        const displays = [
            { bar: gullsBar, value: gullsValue, rate: rates.gulls },
            { bar: rodentsBar, value: rodentsValue, rate: rates.rodents },
            { bar: foxesBar, value: foxesValue, rate: rates.foxes },
            { bar: insectsBar, value: insectsValue, rate: rates.insects }
        ];

        displays.forEach(display => {
            const percentage = Math.round(display.rate * 100);
            display.bar.style.width = `${percentage}%`;
            display.value.textContent = `${percentage}%`;
        });
    }

    function updateRiskAssessment(avgColonization, composition, age) {
        // Contamination risk increases with age and certain waste types
        let contaminationRiskLevel = avgColonization * 0.6;
        if (composition === 'hazardous') contaminationRiskLevel += 0.3;
        if (composition === 'industrial') contaminationRiskLevel += 0.2;
        contaminationRiskLevel += age / 100; // Older sites have more accumulated contaminants

        // Disease risk increases with population density
        let diseaseRiskLevel = avgColonization * 0.8;
        diseaseRiskLevel += (10 - parseFloat(urbanProximity.value)) / 50; // Closer to urban = more disease vectors

        // Population instability increases with high colonization rates
        let instabilityRiskLevel = avgColonization * 0.7;
        if (avgColonization > 0.8) instabilityRiskLevel += 0.2; // Boom-bust cycles

        // Update displays
        updateRiskBar(contaminationRisk, contaminationRiskLevel, contaminationValue);
        updateRiskBar(diseaseRisk, diseaseRiskLevel, diseaseValue);
        updateRiskBar(instabilityRisk, instabilityRiskLevel, instabilityValue);
    }

    function updateRiskBar(bar, level, valueElement) {
        const percentage = Math.min(100, Math.round(level * 100));
        bar.style.width = `${percentage}%`;

        let riskText = 'Low';
        if (percentage > 70) riskText = 'Critical';
        else if (percentage > 50) riskText = 'High';
        else if (percentage > 30) riskText = 'Medium';

        valueElement.textContent = riskText;
    }

    // Event listeners
    wasteAge.addEventListener('input', updateHabitatSimulation);
    wasteComposition.addEventListener('change', updateHabitatSimulation);
    urbanProximity.addEventListener('input', updateHabitatSimulation);
    season.addEventListener('change', updateHabitatSimulation);

    // Initialize with default values
    updateHabitatSimulation();
}

// Species Vulnerability Analyzer
function initializeVulnerabilityAnalyzer() {
    const speciesType = document.getElementById('species-type');
    const lifeHistory = document.getElementById('life-history');
    const mobility = document.getElementById('mobility');
    const dietSpecialization = document.getElementById('diet-specialization');

    const mobilityValue = document.getElementById('mobility-value');
    const dietSpecializationValue = document.getElementById('diet-specialization-value');

    const trapSusceptibility = document.getElementById('trap-susceptibility');
    const recoveryPotential = document.getElementById('recovery-potential');
    const populationImpact = document.getElementById('population-impact');

    const susceptibilityScore = document.getElementById('susceptibility-score');
    const recoveryScore = document.getElementById('recovery-score');
    const impactScore = document.getElementById('impact-score');

    const vulnerabilityAnalysis = document.getElementById('vulnerability-analysis');
    const conservationRecommendations = document.getElementById('conservation-recommendations');

    // Vulnerability data by species characteristics
    const vulnerabilityData = {
        birds: {
            baseSusceptibility: 0.7,
            baseRecovery: 0.6,
            baseImpact: 0.5,
            lifeHistoryModifiers: {
                'r-strategist': { susceptibility: 1.2, recovery: 0.8, impact: 1.1 },
                'k-strategist': { susceptibility: 0.8, recovery: 1.2, impact: 0.7 },
                'opportunist': { susceptibility: 1.0, recovery: 0.9, impact: 0.9 }
            }
        },
        mammals: {
            baseSusceptibility: 0.8,
            baseRecovery: 0.7,
            baseImpact: 0.6,
            lifeHistoryModifiers: {
                'r-strategist': { susceptibility: 1.1, recovery: 0.9, impact: 1.0 },
                'k-strategist': { susceptibility: 0.9, recovery: 1.1, impact: 0.8 },
                'opportunist': { susceptibility: 1.0, recovery: 0.8, impact: 0.9 }
            }
        },
        reptiles: {
            baseSusceptibility: 0.5,
            baseRecovery: 0.4,
            baseImpact: 0.7,
            lifeHistoryModifiers: {
                'r-strategist': { susceptibility: 0.9, recovery: 0.6, impact: 1.2 },
                'k-strategist': { susceptibility: 0.7, recovery: 0.8, impact: 0.9 },
                'opportunist': { susceptibility: 0.8, recovery: 0.5, impact: 1.0 }
            }
        },
        invertebrates: {
            baseSusceptibility: 0.9,
            baseRecovery: 0.8,
            baseImpact: 0.4,
            lifeHistoryModifiers: {
                'r-strategist': { susceptibility: 1.3, recovery: 0.7, impact: 0.8 },
                'k-strategist': { susceptibility: 0.8, recovery: 1.0, impact: 0.6 },
                'opportunist': { susceptibility: 1.1, recovery: 0.9, impact: 0.7 }
            }
        }
    };

    function updateVulnerabilityAnalysis() {
        const species = speciesType.value;
        const history = lifeHistory.value;
        const mob = parseFloat(mobility.value) / 10;
        const diet = parseFloat(dietSpecialization.value) / 10;

        mobilityValue.textContent = `High (${Math.round(mob * 10)}/10)`;
        dietSpecializationValue.textContent = diet < 0.3 ? 'Generalist' : diet > 0.7 ? 'Specialist' : 'Intermediate';

        const data = vulnerabilityData[species];
        const modifiers = data.lifeHistoryModifiers[history];

        // Calculate vulnerability scores
        let susceptibility = data.baseSusceptibility * modifiers.susceptibility;
        let recovery = data.baseRecovery * modifiers.recovery;
        let impact = data.baseImpact * modifiers.impact;

        // Adjust for mobility (higher mobility = lower susceptibility, higher recovery)
        susceptibility *= (1 - mob * 0.3);
        recovery *= (1 + mob * 0.4);

        // Adjust for diet specialization (more specialized = higher susceptibility)
        susceptibility *= (1 + diet * 0.4);
        recovery *= (1 - diet * 0.3);

        // Normalize scores
        susceptibility = Math.max(0, Math.min(1, susceptibility));
        recovery = Math.max(0, Math.min(1, recovery));
        impact = Math.max(0, Math.min(1, impact));

        // Update displays
        updateVulnerabilityGauge(trapSusceptibility, susceptibility, susceptibilityScore);
        updateVulnerabilityGauge(recoveryPotential, recovery, recoveryScore);
        updateVulnerabilityGauge(populationImpact, impact, impactScore);

        // Update analysis text and recommendations
        updateAnalysisText(susceptibility, recovery, impact, species, history, mob, diet);
    }

    function updateVulnerabilityGauge(gauge, value, scoreElement) {
        const percentage = Math.round(value * 100);
        gauge.style.width = `${percentage}%`;

        let scoreText = 'Low';
        if (percentage > 70) scoreText = 'High';
        else if (percentage > 40) scoreText = 'Medium';

        scoreElement.textContent = scoreText;
    }

    function updateAnalysisText(susceptibility, recovery, impact, species, history, mobility, diet) {
        let analysis = '';

        if (susceptibility > 0.7) {
            analysis = `This ${species} species shows high susceptibility to ecological traps due to its ${history.toLowerCase()} life history strategy. `;
        } else if (susceptibility > 0.4) {
            analysis = `This ${species} species has moderate vulnerability to waste site colonization. `;
        } else {
            analysis = `This ${species} species demonstrates relatively low susceptibility to ecological traps. `;
        }

        if (recovery > 0.6) {
            analysis += 'It has good recovery potential if waste site conditions change. ';
        } else {
            analysis += 'Recovery from ecological trap effects may be challenging. ';
        }

        if (impact > 0.6) {
            analysis += 'Population-level impacts could be significant if colonization rates remain high.';
        } else {
            analysis += 'Population-level effects are likely to be manageable with appropriate interventions.';
        }

        vulnerabilityAnalysis.textContent = analysis;

        // Update recommendations
        const recommendations = generateRecommendations(susceptibility, recovery, impact, species);
        conservationRecommendations.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
    }

    function generateRecommendations(susceptibility, recovery, impact, species) {
        const recommendations = [];

        if (susceptibility > 0.6) {
            recommendations.push('Implement waste site barriers to reduce species access');
            recommendations.push('Monitor population trends at waste sites regularly');
        }

        if (recovery < 0.5) {
            recommendations.push('Create alternative habitats away from contamination sources');
            recommendations.push('Develop species-specific recovery programs');
        }

        if (impact > 0.6) {
            recommendations.push('Establish population monitoring and intervention protocols');
            recommendations.push('Coordinate with wildlife management authorities');
        }

        recommendations.push('Conduct regular environmental impact assessments');
        recommendations.push('Educate local communities about ecological trap risks');

        return recommendations;
    }

    // Event listeners
    speciesType.addEventListener('change', updateVulnerabilityAnalysis);
    lifeHistory.addEventListener('change', updateVulnerabilityAnalysis);
    mobility.addEventListener('input', updateVulnerabilityAnalysis);
    dietSpecialization.addEventListener('input', updateVulnerabilityAnalysis);

    // Initialize with default values
    updateVulnerabilityAnalysis();
}

// Contamination Cascade Visualizer
function initializeContaminationCascade() {
    const contaminantType = document.getElementById('contaminant-type');
    const bioaccumulationFactor = document.getElementById('bioaccumulation-factor');
    const foodWebComplexity = document.getElementById('food-web-complexity');

    const bafValue = document.getElementById('baf-value');
    const complexityValue = document.getElementById('complexity-value');

    const level1Concentration = document.getElementById('level1-concentration');
    const level2Concentration = document.getElementById('level2-concentration');
    const level3Concentration = document.getElementById('level3-concentration');
    const level4Concentration = document.getElementById('level4-concentration');

    const magnificationFactor = document.getElementById('magnification-factor');
    const cascadeRisk = document.getElementById('cascade-risk');
    const affectedSpecies = document.getElementById('affected-species');

    // Contaminant properties
    const contaminantData = {
        'heavy-metals': {
            baseConcentration: 1.0,
            bioaccumulationRate: 2.0,
            persistence: 0.9,
            toxicity: 0.8
        },
        'pops': {
            baseConcentration: 0.5,
            bioaccumulationRate: 5.0,
            persistence: 0.95,
            toxicity: 0.9
        },
        'plastics': {
            baseConcentration: 2.0,
            bioaccumulationRate: 1.5,
            persistence: 0.8,
            toxicity: 0.6
        },
        'pathogens': {
            baseConcentration: 10.0,
            bioaccumulationRate: 1.0,
            persistence: 0.3,
            toxicity: 0.7
        }
    };

    function updateContaminationCascade() {
        const contaminant = contaminantType.value;
        const baf = parseFloat(bioaccumulationFactor.value);
        const complexity = parseFloat(foodWebComplexity.value);

        bafValue.textContent = `${baf}x`;
        complexityValue.textContent = `Medium (${complexity}/5)`;

        const data = contaminantData[contaminant];
        const baseConc = data.baseConcentration;

        // Calculate concentrations at each trophic level
        const concentrations = [baseConc];
        let currentConc = baseConc;

        for (let i = 1; i < 4; i++) {
            // Bioaccumulation with complexity modifier
            const complexityModifier = 1 + (complexity - 3) * 0.1;
            currentConc *= data.bioaccumulationRate * (baf / 10) * complexityModifier;
            concentrations.push(currentConc);
        }

        // Update concentration displays
        updateConcentrationDisplays(concentrations);

        // Calculate overall metrics
        const totalMagnification = concentrations[3] / concentrations[0];
        const riskLevel = calculateRiskLevel(totalMagnification, data.toxicity, complexity);
        const affectedPercentage = Math.min(100, Math.round(totalMagnification * 10));

        // Update metrics
        magnificationFactor.textContent = `${Math.round(totalMagnification)}x`;
        cascadeRisk.textContent = riskLevel;
        cascadeRisk.className = `metric-value risk-${riskLevel.toLowerCase()}`;
        affectedSpecies.textContent = `${affectedPercentage}%`;
    }

    function updateConcentrationDisplays(concentrations) {
        const displays = [level1Concentration, level2Concentration, level3Concentration, level4Concentration];
        const units = ['ppm', 'ppm', 'ppm', 'ppm'];

        displays.forEach((display, index) => {
            const conc = concentrations[index];
            let formattedConc;

            if (contaminantType.value === 'pathogens') {
                formattedConc = `${Math.round(conc)} CFU/g`;
            } else if (conc >= 1000) {
                formattedConc = `${(conc / 1000).toFixed(1)} ppm`;
            } else if (conc >= 1) {
                formattedConc = `${conc.toFixed(1)} ppm`;
            } else {
                formattedConc = `${(conc * 1000).toFixed(0)} ppb`;
            }

            display.textContent = formattedConc;
        });
    }

    function calculateRiskLevel(magnification, toxicity, complexity) {
        const riskScore = magnification * toxicity * (complexity / 5);

        if (riskScore > 50) return 'Critical';
        if (riskScore > 20) return 'High';
        if (riskScore > 10) return 'Medium';
        return 'Low';
    }

    // Event listeners
    contaminantType.addEventListener('change', updateContaminationCascade);
    bioaccumulationFactor.addEventListener('input', updateContaminationCascade);
    foodWebComplexity.addEventListener('input', updateContaminationCascade);

    // Initialize with default values
    updateContaminationCascade();
}

// Mitigation Strategy Explorer
function initializeMitigationExplorer() {
    const strategyFocus = document.getElementById('strategy-focus');
    const budgetRange = document.getElementById('budget-range');
    const timeline = document.getElementById('timeline');

    const budgetValue = document.getElementById('budget-value');
    const strategyList = document.getElementById('strategy-list');

    const attractionReduction = document.getElementById('attraction-reduction');
    const contaminationDecrease = document.getElementById('contamination-decrease');
    const costEffectiveness = document.getElementById('cost-effectiveness');

    const attractionValue = document.getElementById('attraction-value');
    const contaminationDecreaseValue = document.getElementById('contamination-decrease-value');
    const costValue = document.getElementById('cost-value');

    // Mitigation strategies database
    const mitigationStrategies = {
        'waste-management': {
            short: [
                { name: 'Daily Waste Compaction', cost: 50000, effectiveness: { attraction: 0.6, contamination: 0.4 }, description: 'Reduce accessible waste volume through compaction' },
                { name: 'Perimeter Fencing', cost: 30000, effectiveness: { attraction: 0.8, contamination: 0.2 }, description: 'Prevent wildlife access to waste areas' }
            ],
            medium: [
                { name: 'Automated Waste Sorting', cost: 200000, effectiveness: { attraction: 0.7, contamination: 0.8 }, description: 'Separate organic waste to reduce food availability' },
                { name: 'Leachate Management System', cost: 150000, effectiveness: { attraction: 0.3, contamination: 0.9 }, description: 'Control groundwater contamination' }
            ],
            long: [
                { name: 'Waste-to-Energy Conversion', cost: 2000000, effectiveness: { attraction: 0.9, contamination: 0.95 }, description: 'Convert waste to energy, eliminating landfill use' },
                { name: 'Zero-Waste Processing Facility', cost: 5000000, effectiveness: { attraction: 1.0, contamination: 1.0 }, description: 'Complete waste processing with no landfill disposal' }
            ]
        },
        'habitat-creation': {
            short: [
                { name: 'Adjacent Habitat Restoration', cost: 25000, effectiveness: { attraction: 0.5, contamination: 0.1 }, description: 'Create natural habitats near waste sites' }
            ],
            medium: [
                { name: 'Urban Wildlife Corridors', cost: 100000, effectiveness: { attraction: 0.7, contamination: 0.2 }, description: 'Connect habitats through urban areas' },
                { name: 'Species-Specific Feeding Stations', cost: 15000, effectiveness: { attraction: 0.8, contamination: 0.3 }, description: 'Provide alternative food sources' }
            ],
            long: [
                { name: 'Urban Nature Reserve Network', cost: 1000000, effectiveness: { attraction: 0.9, contamination: 0.4 }, description: 'Create comprehensive urban wildlife network' }
            ]
        },
        'monitoring': {
            short: [
                { name: 'Wildlife Population Monitoring', cost: 20000, effectiveness: { attraction: 0.2, contamination: 0.3 }, description: 'Track species populations at waste sites' }
            ],
            medium: [
                { name: 'Automated Camera Network', cost: 50000, effectiveness: { attraction: 0.1, contamination: 0.4 }, description: 'Continuous wildlife monitoring' },
                { name: 'Contaminant Sampling Program', cost: 30000, effectiveness: { attraction: 0.1, contamination: 0.7 }, description: 'Regular environmental sampling' }
            ],
            long: [
                { name: 'Integrated Monitoring System', cost: 200000, effectiveness: { attraction: 0.3, contamination: 0.8 }, description: 'Comprehensive ecological monitoring platform' }
            ]
        },
        'policy': {
            short: [
                { name: 'Community Education Program', cost: 15000, effectiveness: { attraction: 0.4, contamination: 0.2 }, description: 'Educate public about ecological traps' }
            ],
            medium: [
                { name: 'Regulatory Compliance Monitoring', cost: 50000, effectiveness: { attraction: 0.3, contamination: 0.6 }, description: 'Ensure waste management standards' },
                { name: 'Stakeholder Coordination Framework', cost: 25000, effectiveness: { attraction: 0.5, contamination: 0.4 }, description: 'Coordinate between agencies and communities' }
            ],
            long: [
                { name: 'National Waste Management Policy', cost: 500000, effectiveness: { attraction: 0.8, contamination: 0.9 }, description: 'Comprehensive national waste policy reform' }
            ]
        }
    };

    function updateMitigationStrategies() {
        const focus = strategyFocus.value;
        const budget = parseFloat(budgetRange.value);
        const timeFrame = timeline.value;

        budgetValue.textContent = `$${budget.toLocaleString()}`;

        const availableStrategies = mitigationStrategies[focus][timeFrame];
        const affordableStrategies = availableStrategies.filter(strategy => strategy.cost <= budget);

        // Display strategies
        displayStrategies(affordableStrategies);

        // Calculate overall effectiveness
        if (affordableStrategies.length > 0) {
            const avgAttraction = affordableStrategies.reduce((sum, s) => sum + s.effectiveness.attraction, 0) / affordableStrategies.length;
            const avgContamination = affordableStrategies.reduce((sum, s) => sum + s.effectiveness.contamination, 0) / affordableStrategies.length;

            updateEffectivenessDisplay(avgAttraction, avgContamination, budget, affordableStrategies);
        } else {
            // No affordable strategies
            strategyList.innerHTML = '<p>No strategies available within budget. Consider increasing budget or changing timeline.</p>';
            updateEffectivenessDisplay(0, 0, budget, []);
        }
    }

    function displayStrategies(strategies) {
        if (strategies.length === 0) {
            strategyList.innerHTML = '<p>No strategies available within selected parameters.</p>';
            return;
        }

        const strategyHTML = strategies.map(strategy => `
            <div class="strategy-item">
                <h4>${strategy.name}</h4>
                <p>${strategy.description}</p>
                <small>Cost: $${strategy.cost.toLocaleString()} | Effectiveness: Attraction ${Math.round(strategy.effectiveness.attraction * 100)}%, Contamination ${Math.round(strategy.effectiveness.contamination * 100)}%</small>
            </div>
        `).join('');

        strategyList.innerHTML = strategyHTML;
    }

    function updateEffectivenessDisplay(attractionEffect, contaminationEffect, budget, strategies) {
        const attractionPercent = Math.round(attractionEffect * 100);
        const contaminationPercent = Math.round(contaminationEffect * 100);

        attractionReduction.style.width = `${attractionPercent}%`;
        contaminationDecrease.style.width = `${contaminationPercent}%`;

        attractionValue.textContent = `${attractionPercent}%`;
        contaminationDecreaseValue.textContent = `${contaminationPercent}%`;

        // Calculate cost effectiveness (higher budget with fewer strategies = less cost effective)
        let costEffectivenessScore = 0;
        if (strategies.length > 0) {
            const totalCost = strategies.reduce((sum, s) => sum + s.cost, 0);
            const avgEffectiveness = (attractionEffect + contaminationEffect) / 2;
            costEffectivenessScore = (avgEffectiveness * 1000000) / (totalCost + 1); // Normalize
            costEffectivenessScore = Math.min(1, costEffectivenessScore);
        }

        const costPercent = Math.round(costEffectivenessScore * 100);
        costEffectiveness.style.width = `${costPercent}%`;
        costValue.textContent = costPercent > 70 ? 'High' : costPercent > 40 ? 'Medium' : 'Low';
    }

    // Event listeners
    strategyFocus.addEventListener('change', updateMitigationStrategies);
    budgetRange.addEventListener('input', updateMitigationStrategies);
    timeline.addEventListener('change', updateMitigationStrategies);

    // Initialize with default values
    updateMitigationStrategies();
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
            console.log('Opening case study:', studyId);
        });
    });
}

// Report Form
function initializeReportForm() {
    const reportForm = document.getElementById('waste-site-report');

    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(reportForm);
        const reportData = Object.fromEntries(formData);

        // In a real implementation, this would send data to a server
        console.log('Waste site report submitted:', reportData);

        // Show success message
        alert('Thank you for your report! We will review your submission and follow up if needed.');

        // Reset form
        reportForm.reset();

        // Close modal
        const modal = reportForm.closest('.modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
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
window.UrbanWasteHabitats = {
    initializeHabitatSimulator,
    initializeVulnerabilityAnalyzer,
    initializeContaminationCascade,
    initializeMitigationExplorer
};