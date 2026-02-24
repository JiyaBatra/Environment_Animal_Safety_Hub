/**
 * Carbon Footprint Calculator
 * Interactive calculator with multi-step wizard and Chart.js visualizations
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===================================
    // Configuration & State
    // ===================================
    const state = {
        currentStep: 1,
        totalSteps: 4,
        selections: {
            transport: { mode: null, distance: 20, flights: null },
            diet: { type: null, source: null, waste: null },
            energy: { electricity: null, renewable: null, hvac: null },
            shopping: { clothing: null, electronics: null, recycling: null }
        },
        emissions: {
            transport: 0,
            diet: 0,
            energy: 0,
            shopping: 0,
            total: 0
        }
    };

    // DOM Elements
    const elements = {
        startBtn: document.getElementById('startCalculator'),
        calculatorSection: document.getElementById('calculatorSection'),
        progressFill: document.getElementById('progressFill'),
        stepIndicators: document.querySelectorAll('.step-indicator'),
        wizardSteps: document.querySelectorAll('.wizard-step'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        calculateBtn: document.getElementById('calculateBtn'),
        resultsSection: document.getElementById('resultsSection'),
        // Sliders
        commuteSlider: document.getElementById('commuteDistance'),
        commuteValue: document.getElementById('commuteValue'),
        // Emission displays
        transportEmission: document.getElementById('transportEmission'),
        dietEmission: document.getElementById('dietEmission'),
        energyEmission: document.getElementById('energyEmission'),
        shoppingEmission: document.getElementById('shoppingEmission')
    };

    // ===================================
    // Initialization
    // ===================================
    function init() {
        setupEventListeners();
        animateHeroStats();
        setupOptionCards();
        setupSliders();
    }

    // ===================================
    // Event Listeners
    // ===================================
    function setupEventListeners() {
        // Start calculator button
        if (elements.startBtn) {
            elements.startBtn.addEventListener('click', () => {
                elements.calculatorSection.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Navigation buttons
        elements.prevBtn.addEventListener('click', () => navigateStep(-1));
        elements.nextBtn.addEventListener('click', () => navigateStep(1));
        elements.calculateBtn.addEventListener('click', calculateResults);

        // Retake button
        document.getElementById('retakeCalculator')?.addEventListener('click', () => {
            resetCalculator();
            elements.calculatorSection.scrollIntoView({ behavior: 'smooth' });
        });

        // Share button
        document.getElementById('shareResults')?.addEventListener('click', shareResults);
        
        // Download button
        document.getElementById('downloadReport')?.addEventListener('click', downloadReport);
    }

    // ===================================
    // Option Cards Setup
    // ===================================
    function setupOptionCards() {
        // Transport Mode
        setupOptionGroup('transportMode', (value, emission) => {
            state.selections.transport.mode = value;
            state.selections.transport.modeEmission = parseFloat(emission);
            updateTransportEmission();
        });

        // Flight Hours
        setupOptionGroup('flightHours', (value, emission) => {
            state.selections.transport.flights = value;
            state.selections.transport.flightEmission = parseFloat(emission);
            updateTransportEmission();
        });

        // Diet Type
        setupOptionGroup('dietType', (value, emission) => {
            state.selections.diet.type = value;
            state.selections.diet.typeEmission = parseFloat(emission);
            updateDietEmission();
        });

        // Food Source
        setupOptionGroup('foodSource', (value, emission) => {
            state.selections.diet.source = value;
            state.selections.diet.sourceMultiplier = parseFloat(emission);
            updateDietEmission();
        });

        // Food Waste
        setupOptionGroup('foodWaste', (value, emission) => {
            state.selections.diet.waste = value;
            state.selections.diet.wasteMultiplier = parseFloat(emission);
            updateDietEmission();
        });

        // Electricity Usage
        setupOptionGroup('electricityUsage', (value, emission) => {
            state.selections.energy.electricity = value;
            state.selections.energy.electricityEmission = parseFloat(emission);
            updateEnergyEmission();
        });

        // Renewable Energy
        setupOptionGroup('renewableEnergy', (value, emission) => {
            state.selections.energy.renewable = value;
            state.selections.energy.renewableMultiplier = parseFloat(emission);
            updateEnergyEmission();
        });

        // HVAC Usage
        setupOptionGroup('hvacUsage', (value, emission) => {
            state.selections.energy.hvac = value;
            state.selections.energy.hvacEmission = parseFloat(emission);
            updateEnergyEmission();
        });

        // Clothing Habits
        setupOptionGroup('clothingHabits', (value, emission) => {
            state.selections.shopping.clothing = value;
            state.selections.shopping.clothingEmission = parseFloat(emission);
            updateShoppingEmission();
        });

        // Electronics Habits
        setupOptionGroup('electronicsHabits', (value, emission) => {
            state.selections.shopping.electronics = value;
            state.selections.shopping.electronicsEmission = parseFloat(emission);
            updateShoppingEmission();
        });

        // Recycling Habits
        setupOptionGroup('recyclingHabits', (value, emission) => {
            state.selections.shopping.recycling = value;
            state.selections.shopping.recyclingMultiplier = parseFloat(emission);
            updateShoppingEmission();
        });
    }

    function setupOptionGroup(groupId, callback) {
        const container = document.getElementById(groupId);
        if (!container) return;

        const cards = container.querySelectorAll('.option-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected from all cards in group
                cards.forEach(c => c.classList.remove('selected'));
                // Add selected to clicked card
                card.classList.add('selected');
                // Call callback with value and emission
                callback(card.dataset.value, card.dataset.emission);
            });
        });
    }

    // ===================================
    // Sliders Setup
    // ===================================
    function setupSliders() {
        if (elements.commuteSlider) {
            elements.commuteSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                elements.commuteValue.textContent = value;
                state.selections.transport.distance = parseInt(value);
                updateTransportEmission();
            });
        }
    }

    // ===================================
    // Emission Calculations
    // ===================================
    function updateTransportEmission() {
        const { modeEmission = 0, distance = 20, flightEmission = 0 } = state.selections.transport;
        
        // Calculate daily commute emissions (per day * 250 working days)
        const dailyEmission = modeEmission * (distance / 20); // Normalize to 20km base
        const annualCommuteEmission = dailyEmission * 250;
        
        // Add flight emissions
        const total = Math.round(annualCommuteEmission + flightEmission);
        state.emissions.transport = total;
        
        if (elements.transportEmission) {
            animateNumber(elements.transportEmission, total);
        }
    }

    function updateDietEmission() {
        const { typeEmission = 0, sourceMultiplier = 1, wasteMultiplier = 1 } = state.selections.diet;
        const total = Math.round(typeEmission * sourceMultiplier * wasteMultiplier);
        state.emissions.diet = total;
        
        if (elements.dietEmission) {
            animateNumber(elements.dietEmission, total);
        }
    }

    function updateEnergyEmission() {
        const { electricityEmission = 0, renewableMultiplier = 1, hvacEmission = 0 } = state.selections.energy;
        const total = Math.round((electricityEmission * renewableMultiplier) + hvacEmission);
        state.emissions.energy = total;
        
        if (elements.energyEmission) {
            animateNumber(elements.energyEmission, total);
        }
    }

    function updateShoppingEmission() {
        const { clothingEmission = 0, electronicsEmission = 0, recyclingMultiplier = 1 } = state.selections.shopping;
        const total = Math.round((clothingEmission + electronicsEmission) * recyclingMultiplier);
        state.emissions.shopping = total;
        
        if (elements.shoppingEmission) {
            animateNumber(elements.shoppingEmission, total);
        }
    }

    // ===================================
    // Step Navigation
    // ===================================
    function navigateStep(direction) {
        const newStep = state.currentStep + direction;
        
        if (newStep < 1 || newStep > state.totalSteps) return;
        
        // Hide current step
        elements.wizardSteps[state.currentStep - 1].classList.remove('active');
        elements.stepIndicators[state.currentStep - 1].classList.remove('active');
        
        if (direction > 0) {
            elements.stepIndicators[state.currentStep - 1].classList.add('completed');
        } else {
            elements.stepIndicators[state.currentStep].classList.remove('completed');
        }
        
        // Update state
        state.currentStep = newStep;
        
        // Show new step
        elements.wizardSteps[newStep - 1].classList.add('active');
        elements.stepIndicators[newStep - 1].classList.add('active');
        
        // Update progress bar
        const progress = (newStep / state.totalSteps) * 100;
        elements.progressFill.style.width = `${progress}%`;
        
        // Update button visibility
        elements.prevBtn.disabled = newStep === 1;
        
        if (newStep === state.totalSteps) {
            elements.nextBtn.style.display = 'none';
            elements.calculateBtn.style.display = 'flex';
        } else {
            elements.nextBtn.style.display = 'flex';
            elements.calculateBtn.style.display = 'none';
        }
        
        // Scroll to top of calculator
        elements.calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }

    // ===================================
    // Calculate & Display Results
    // ===================================
    function calculateResults() {
        // Calculate total emissions
        state.emissions.total = 
            state.emissions.transport + 
            state.emissions.diet + 
            state.emissions.energy + 
            state.emissions.shopping;
        
        // Show results section
        elements.resultsSection.style.display = 'block';
        elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Animate and display results
        setTimeout(() => {
            displayResults();
            renderCharts();
            generateTips();
        }, 500);
    }

    function displayResults() {
        const total = state.emissions.total;
        
        // Animate total score
        const scoreDisplay = document.getElementById('totalScoreDisplay');
        animateNumber(scoreDisplay, total);
        
        // Update comparison bar
        const userBar = document.getElementById('userComparisonBar');
        const userFootprint = document.getElementById('userFootprintValue');
        const percentage = Math.min((total / 4700) * 100, 100);
        
        setTimeout(() => {
            userBar.style.width = `${percentage}%`;
            userFootprint.textContent = `${total.toLocaleString()} kg`;
        }, 500);
        
        // Update score circle
        updateScoreCircle(total);
        
        // Update rating
        updateRating(total);
        
        // Calculate savings
        calculateSavings(total);
    }

    function updateScoreCircle(total) {
        const scoreProgress = document.getElementById('scoreProgress');
        const maxEmission = 6000; // Reference max emission
        const percentage = Math.min(total / maxEmission, 1);
        const circumference = 2 * Math.PI * 85;
        const offset = circumference * (1 - percentage);
        
        setTimeout(() => {
            scoreProgress.style.strokeDashoffset = offset;
        }, 300);
    }

    function updateRating(total) {
        const ratingContainer = document.getElementById('scoreRating');
        const resultTitle = document.getElementById('resultTitle');
        const resultDescription = document.getElementById('resultDescription');
        
        let rating = { emoji: '🌱', text: 'Eco Champion', color: '#10b981' };
        let title = 'Outstanding! You\'re an Eco Champion!';
        let desc = 'Your carbon footprint is well below the global average. Keep up the excellent work and continue inspiring others!';
        
        if (total > 4000) {
            rating = { emoji: '🔴', text: 'High Impact', color: '#ef4444' };
            title = 'Room for Improvement';
            desc = 'Your carbon footprint is above average, but don\'t worry! Small changes can make a big difference. Check out our personalized recommendations below.';
        } else if (total > 3000) {
            rating = { emoji: '🟠', text: 'Moderate Impact', color: '#f59e0b' };
            title = 'You\'re Making Progress';
            desc = 'Your footprint is close to the global average. You\'re on the right track! See our tips to reduce it further.';
        } else if (total > 2000) {
            rating = { emoji: '🟡', text: 'Good Progress', color: '#eab308' };
            title = 'Good Job! You\'re Below Average';
            desc = 'Your carbon footprint is below the global average. With a few more changes, you could be an Eco Champion!';
        } else if (total > 1500) {
            rating = { emoji: '🟢', text: 'Low Impact', color: '#22c55e' };
            title = 'Excellent! Low Carbon Lifestyle';
            desc = 'You\'re doing great! Your lifestyle choices are having a positive impact on the environment.';
        }
        
        ratingContainer.innerHTML = `
            <span class="rating-emoji">${rating.emoji}</span>
            <span class="rating-text" style="color: ${rating.color}">${rating.text}</span>
        `;
        
        resultTitle.textContent = title;
        resultDescription.textContent = desc;
    }

    function calculateSavings(total) {
        // Calculate potential savings (assume 30% reduction possible)
        const potentialReduction = Math.round(total * 0.3);
        const treeEquivalent = Math.round(potentialReduction / 21); // 21kg CO2 per tree per year
        const moneySaved = Math.round(potentialReduction * 0.05); // Approximate money savings
        
        animateNumber(document.getElementById('co2Savings'), potentialReduction);
        animateNumber(document.getElementById('treeSavings'), treeEquivalent);
        document.getElementById('moneySavings').textContent = `$${moneySaved}`;
    }

    // ===================================
    // Charts
    // ===================================
    function renderCharts() {
        renderBreakdownChart();
        renderCategoryChart();
    }

    function renderBreakdownChart() {
        const ctx = document.getElementById('breakdownChart');
        if (!ctx) return;

        const data = {
            labels: ['Transportation', 'Diet', 'Energy', 'Shopping'],
            datasets: [{
                data: [
                    state.emissions.transport,
                    state.emissions.diet,
                    state.emissions.energy,
                    state.emissions.shopping
                ],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#8b5cf6'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                family: 'Poppins',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.raw / total) * 100);
                                return `${context.label}: ${context.raw.toLocaleString()} kg CO₂ (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '65%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    function renderCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        const globalAverages = {
            transport: 2000,
            diet: 2500,
            energy: 1500,
            shopping: 700
        };

        const data = {
            labels: ['Transport', 'Diet', 'Energy', 'Shopping'],
            datasets: [
                {
                    label: 'Your Emissions',
                    data: [
                        state.emissions.transport,
                        state.emissions.diet,
                        state.emissions.energy,
                        state.emissions.shopping
                    ],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderRadius: 8
                },
                {
                    label: 'Global Average',
                    data: [
                        globalAverages.transport,
                        globalAverages.diet,
                        globalAverages.energy,
                        globalAverages.shopping
                    ],
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderRadius: 8
                }
            ]
        };

        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Poppins',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toLocaleString()} kg CO₂`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'kg CO₂/year',
                            font: {
                                family: 'Poppins'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // ===================================
    // Personalized Tips
    // ===================================
    function generateTips() {
        const tipsGrid = document.getElementById('tipsGrid');
        if (!tipsGrid) return;

        const tips = [];

        // Transport tips
        if (state.selections.transport.mode === 'car' || state.selections.transport.modeEmission > 3) {
            tips.push({
                icon: '🚌',
                title: 'Switch to Public Transit',
                description: 'Using public transport twice a week can significantly reduce your footprint.',
                savings: 'Save up to 400 kg CO₂/year'
            });
        }
        
        if (state.selections.transport.flightEmission > 1000) {
            tips.push({
                icon: '✈️',
                title: 'Reduce Air Travel',
                description: 'Consider video calls for business meetings or choose train travel for shorter distances.',
                savings: 'Save up to 1,500 kg CO₂/year'
            });
        }

        // Diet tips
        if (state.selections.diet.typeEmission > 2500) {
            tips.push({
                icon: '🥗',
                title: 'Try Meatless Mondays',
                description: 'Reducing meat consumption just 2 days a week can make a big difference.',
                savings: 'Save up to 600 kg CO₂/year'
            });
        }

        if (state.selections.diet.wasteMultiplier > 1) {
            tips.push({
                icon: '🍽️',
                title: 'Reduce Food Waste',
                description: 'Plan meals ahead and use leftovers creatively to minimize waste.',
                savings: 'Save up to 300 kg CO₂/year'
            });
        }

        // Energy tips
        if (state.selections.energy.renewableMultiplier >= 1) {
            tips.push({
                icon: '☀️',
                title: 'Go Solar',
                description: 'Consider installing solar panels or switching to a renewable energy provider.',
                savings: 'Save up to 1,000 kg CO₂/year'
            });
        }

        if (state.selections.energy.hvacEmission > 800) {
            tips.push({
                icon: '🌡️',
                title: 'Optimize HVAC Usage',
                description: 'Use a programmable thermostat and improve home insulation.',
                savings: 'Save up to 500 kg CO₂/year'
            });
        }

        // Shopping tips
        if (state.selections.shopping.clothingEmission > 300) {
            tips.push({
                icon: '👕',
                title: 'Choose Sustainable Fashion',
                description: 'Buy fewer, higher-quality items and consider second-hand options.',
                savings: 'Save up to 400 kg CO₂/year'
            });
        }

        if (state.selections.shopping.recyclingMultiplier >= 1) {
            tips.push({
                icon: '♻️',
                title: 'Start Composting',
                description: 'Composting food scraps reduces methane from landfills.',
                savings: 'Save up to 200 kg CO₂/year'
            });
        }

        // Default tips if none generated
        if (tips.length === 0) {
            tips.push({
                icon: '🌟',
                title: 'Keep It Up!',
                description: 'You\'re already making great choices. Share your knowledge with others!',
                savings: 'Inspire others to go green'
            });
        }

        // Render tips
        tipsGrid.innerHTML = tips.map(tip => `
            <div class="tip-card">
                <div class="tip-icon">${tip.icon}</div>
                <div class="tip-content">
                    <h4>${tip.title}</h4>
                    <p>${tip.description}</p>
                    <div class="tip-savings">${tip.savings}</div>
                </div>
            </div>
        `).join('');
    }

    // ===================================
    // Utility Functions
    // ===================================
    function animateNumber(element, target, duration = 1000) {
        if (!element) return;
        
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current).toLocaleString();
            }
        }, 16);
    }

    function animateHeroStats() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    animateNumber(entry.target, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }

    function resetCalculator() {
        state.currentStep = 1;
        state.emissions = { transport: 0, diet: 0, energy: 0, shopping: 0, total: 0 };
        
        // Reset all selected options
        document.querySelectorAll('.option-card.selected').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Reset slider
        if (elements.commuteSlider) {
            elements.commuteSlider.value = 20;
            elements.commuteValue.textContent = '20';
        }
        
        // Reset step indicators
        elements.stepIndicators.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === 0) step.classList.add('active');
        });
        
        // Reset wizard steps
        elements.wizardSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === 0) step.classList.add('active');
        });
        
        // Reset progress
        elements.progressFill.style.width = '25%';
        
        // Reset buttons
        elements.prevBtn.disabled = true;
        elements.nextBtn.style.display = 'flex';
        elements.calculateBtn.style.display = 'none';
        
        // Reset emission displays
        ['transportEmission', 'dietEmission', 'energyEmission', 'shoppingEmission'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '0';
        });
        
        // Hide results
        elements.resultsSection.style.display = 'none';
    }

    function shareResults() {
        const text = `🌍 I just calculated my carbon footprint: ${state.emissions.total.toLocaleString()} kg CO₂/year using EcoLife's Carbon Calculator! Check yours at: `;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Carbon Footprint Results',
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text + window.location.href).then(() => {
                alert('Results copied to clipboard!');
            }).catch(console.error);
        }
    }

    function downloadReport() {
        // Create a simple text report (in a real app, you'd use a PDF library)
        const report = `
╔══════════════════════════════════════════════════════════════╗
║           CARBON FOOTPRINT REPORT - EcoLife                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Total Annual Carbon Footprint: ${state.emissions.total.toLocaleString().padStart(6)} kg CO₂           ║
║                                                              ║
║  Breakdown:                                                  ║
║  ─────────────────────────────────────────────              ║
║  🚗 Transportation: ${state.emissions.transport.toLocaleString().padStart(6)} kg CO₂                   ║
║  🍽️ Diet & Food:    ${state.emissions.diet.toLocaleString().padStart(6)} kg CO₂                   ║
║  ⚡ Home Energy:    ${state.emissions.energy.toLocaleString().padStart(6)} kg CO₂                   ║
║  🛍️ Shopping:       ${state.emissions.shopping.toLocaleString().padStart(6)} kg CO₂                   ║
║                                                              ║
║  Comparison:                                                 ║
║  ─────────────────────────────────────────────              ║
║  Global Average: 4,700 kg CO₂/year                          ║
║  Sustainable Target: 2,000 kg CO₂/year                      ║
║                                                              ║
║  Generated by EcoLife Carbon Calculator                     ║
║  Date: ${new Date().toLocaleDateString()}                                           ║
╚══════════════════════════════════════════════════════════════╝
        `;
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'carbon-footprint-report.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Initialize the calculator
    init();
});
