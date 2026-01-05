/* ===== ENVIRONMENTAL IMPACT CALCULATOR ===== */

// Impact calculation coefficients (kg CO2 equivalent per year)
const IMPACT_COEFFICIENTS = {
    transport: {
        walk: 0,
        public: 500,
        bike: 800,
        car: 2000,
        multiple: 4000
    },
    distance: {
        low: 1,
        medium: 1.5,
        high: 2.5,
        'very-high': 4
    },
    electricity: {
        low: 300,
        medium: 800,
        high: 1500,
        'very-high': 2500
    },
    hvac: {
        none: 0,
        minimal: 200,
        moderate: 600,
        heavy: 1200
    },
    diet: {
        vegan: 600,
        vegetarian: 900,
        pescatarian: 1200,
        omnivore: 1800,
        'meat-heavy': 2500
    },
    'food-waste': {
        minimal: 1,
        some: 1.2,
        moderate: 1.5,
        high: 2
    },
    shower: {
        short: 100,
        medium: 200,
        long: 350,
        'very-long': 500
    },
    'water-conservation': {
        excellent: 0.7,
        good: 0.9,
        average: 1.2,
        poor: 1.5
    },
    plastic: {
        minimal: 50,
        low: 150,
        moderate: 300,
        high: 500
    },
    shopping: {
        minimal: 200,
        conscious: 400,
        regular: 800,
        frequent: 1500
    }
};

// Recommendation database
const RECOMMENDATIONS = {
    transport: {
        high: {
            icon: 'fa-bicycle',
            title: 'Switch to Eco-Friendly Transport',
            description: 'Use public transport, cycling, or walking for short distances',
            impact: '-1,200 kg CO₂/year'
        },
        medium: {
            icon: 'fa-car-side',
            title: 'Optimize Your Commute',
            description: 'Carpool, combine trips, or work from home when possible',
            impact: '-600 kg CO₂/year'
        }
    },
    energy: {
        high: {
            icon: 'fa-lightbulb',
            title: 'Reduce Energy Consumption',
            description: 'Switch to LED bulbs, unplug devices, use energy-efficient appliances',
            impact: '-800 kg CO₂/year'
        },
        medium: {
            icon: 'fa-temperature-low',
            title: 'Optimize Heating & Cooling',
            description: 'Set AC to 24°C, use fans, improve insulation',
            impact: '-400 kg CO₂/year'
        }
    },
    diet: {
        high: {
            icon: 'fa-leaf',
            title: 'Adopt Plant-Based Meals',
            description: 'Try Meatless Mondays or reduce meat consumption by 50%',
            impact: '-900 kg CO₂/year'
        },
        medium: {
            icon: 'fa-utensils',
            title: 'Reduce Food Waste',
            description: 'Plan meals, store food properly, compost organic waste',
            impact: '-300 kg CO₂/year'
        }
    },
    water: {
        high: {
            icon: 'fa-shower',
            title: 'Conserve Water',
            description: 'Take shorter showers, fix leaks, install low-flow fixtures',
            impact: '-200 kg CO₂/year'
        }
    },
    waste: {
        high: {
            icon: 'fa-recycle',
            title: 'Reduce Plastic & Waste',
            description: 'Use reusable bags, bottles, and containers',
            impact: '-250 kg CO₂/year'
        }
    },
    consumption: {
        high: {
            icon: 'fa-shopping-bag',
            title: 'Practice Conscious Consumption',
            description: 'Buy only what you need, choose sustainable products',
            impact: '-600 kg CO₂/year'
        }
    }
};

// Global variables
let calculatorData = {};
let breakdownChart = null;
let progressChart = null;

// Initialize calculator when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
    loadSavedResults();
});

function initCalculator() {
    const form = document.getElementById('impactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Show tracking section if user has previous results
    const savedResults = getSavedResults();
    if (savedResults.length > 0) {
        document.getElementById('trackingSection').style.display = 'block';
        displayHistory(savedResults);
        createProgressChart(savedResults);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Show loading state
    showLoading();
    
    // Collect form data
    const formData = new FormData(e.target);
    calculatorData = Object.fromEntries(formData);
    
    // Calculate impact with delay for better UX
    setTimeout(() => {
        const results = calculateImpact(calculatorData);
        displayResults(results);
        hideLoading();
    }, 1500);
}

function calculateImpact(data) {
    let totalImpact = 0;
    let breakdown = {
        transport: 0,
        energy: 0,
        diet: 0,
        water: 0,
        waste: 0
    };
    
    // Transportation impact
    const transportBase = IMPACT_COEFFICIENTS.transport[data.transport] || 0;
    const distanceMultiplier = IMPACT_COEFFICIENTS.distance[data.distance] || 1;
    breakdown.transport = transportBase * distanceMultiplier;
    
    // Energy impact
    const electricityImpact = IMPACT_COEFFICIENTS.electricity[data.electricity] || 0;
    const hvacImpact = IMPACT_COEFFICIENTS.hvac[data.hvac] || 0;
    breakdown.energy = electricityImpact + hvacImpact;
    
    // Diet impact
    const dietBase = IMPACT_COEFFICIENTS.diet[data.diet] || 0;
    const wasteMultiplier = IMPACT_COEFFICIENTS['food-waste'][data['food-waste']] || 1;
    breakdown.diet = dietBase * wasteMultiplier;
    
    // Water impact
    const showerImpact = IMPACT_COEFFICIENTS.shower[data.shower] || 0;
    const conservationMultiplier = IMPACT_COEFFICIENTS['water-conservation'][data['water-conservation']] || 1;
    breakdown.water = showerImpact * conservationMultiplier;
    
    // Waste impact
    const plasticImpact = IMPACT_COEFFICIENTS.plastic[data.plastic] || 0;
    const shoppingImpact = IMPACT_COEFFICIENTS.shopping[data.shopping] || 0;
    breakdown.waste = plasticImpact + shoppingImpact;
    
    totalImpact = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
    
    return {
        total: Math.round(totalImpact),
        breakdown: breakdown,
        level: getImpactLevel(totalImpact),
        recommendations: generateRecommendations(data, breakdown)
    };
}

function getImpactLevel(impact) {
    if (impact < 1500) {
        return {
            level: 'Excellent',
            message: 'Your environmental impact is very low! Keep up the great work.',
            class: 'score-excellent',
            emoji: '🌱'
        };
    } else if (impact < 2500) {
        return {
            level: 'Good',
            message: 'You\'re doing well, but there\'s room for improvement.',
            class: 'score-good',
            emoji: '🌿'
        };
    } else if (impact < 4000) {
        return {
            level: 'Average',
            message: 'Your impact is average. Let\'s work on reducing it!',
            class: 'score-average',
            emoji: '⚠️'
        };
    } else {
        return {
            level: 'High',
            message: 'Your environmental impact is high. Time to take action!',
            class: 'score-poor',
            emoji: '🚨'
        };
    }
}

function generateRecommendations(data, breakdown) {
    const recommendations = [];
    
    // Transport recommendations
    if (breakdown.transport > 2000) {
        recommendations.push(RECOMMENDATIONS.transport.high);
    } else if (breakdown.transport > 1000) {
        recommendations.push(RECOMMENDATIONS.transport.medium);
    }
    
    // Energy recommendations
    if (breakdown.energy > 1500) {
        recommendations.push(RECOMMENDATIONS.energy.high);
    } else if (breakdown.energy > 800) {
        recommendations.push(RECOMMENDATIONS.energy.medium);
    }
    
    // Diet recommendations
    if (breakdown.diet > 2000) {
        recommendations.push(RECOMMENDATIONS.diet.high);
    } else if (breakdown.diet > 1200) {
        recommendations.push(RECOMMENDATIONS.diet.medium);
    }
    
    // Water recommendations
    if (breakdown.water > 300) {
        recommendations.push(RECOMMENDATIONS.water.high);
    }
    
    // Waste recommendations
    if (breakdown.waste > 600) {
        recommendations.push(RECOMMENDATIONS.waste.high);
    }
    
    // Consumption recommendations
    if (data.shopping === 'frequent' || data.shopping === 'regular') {
        recommendations.push(RECOMMENDATIONS.consumption.high);
    }
    
    return recommendations.slice(0, 5); // Limit to top 5 recommendations
}

function displayResults(results) {
    // Show results section
    document.getElementById('calculatorForm').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsSection').classList.add('fade-in');
    
    // Update score display
    updateScoreDisplay(results);
    
    // Create breakdown chart
    createBreakdownChart(results.breakdown);
    
    // Update comparison
    updateComparison(results.total);
    
    // Display recommendations
    displayRecommendations(results.recommendations);
    
    // Save results
    saveResult(results);
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function updateScoreDisplay(results) {
    const scoreElement = document.getElementById('totalScore');
    const levelElement = document.getElementById('scoreLevel');
    const messageElement = document.getElementById('scoreMessage');
    const circleElement = document.getElementById('scoreCircle');
    
    // Animate score counting
    animateCounter(scoreElement, 0, results.total, 2000);
    
    // Update level and message
    levelElement.textContent = `${results.level.emoji} ${results.level.level}`;
    levelElement.className = results.level.class;
    messageElement.textContent = results.level.message;
    
    // Update circle color based on score
    const percentage = Math.min((results.total / 5000) * 360, 360);
    circleElement.style.background = `conic-gradient(
        var(--primary-color) 0deg,
        var(--primary-light) ${percentage}deg,
        #e0e0e0 ${percentage}deg
    )`;
}

function createBreakdownChart(breakdown) {
    const ctx = document.getElementById('breakdownChart').getContext('2d');
    
    if (breakdownChart) {
        breakdownChart.destroy();
    }
    
    const data = {
        labels: ['Transport', 'Energy', 'Diet', 'Water', 'Waste'],
        datasets: [{
            data: [
                breakdown.transport,
                breakdown.energy,
                breakdown.diet,
                breakdown.water,
                breakdown.waste
            ],
            backgroundColor: [
                '#2e7d32',
                '#388e3c',
                '#4caf50',
                '#66bb6a',
                '#81c784'
            ],
            borderWidth: 0
        }]
    };
    
    breakdownChart = new Chart(ctx, {
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
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function updateComparison(userImpact) {
    const userBar = document.getElementById('userBar');
    const userImpactElement = document.getElementById('userImpact');
    const averageImpact = 2500;
    
    const userPercentage = Math.min((userImpact / 5000) * 100, 100);
    
    setTimeout(() => {
        userBar.style.width = `${userPercentage}%`;
        userImpactElement.textContent = `${userImpact.toLocaleString()} kg CO₂/year`;
    }, 500);
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendationsList');
    container.innerHTML = '';
    
    recommendations.forEach((rec, index) => {
        const item = document.createElement('div');
        item.className = 'recommendation-item slide-up';
        item.style.animationDelay = `${index * 0.1}s`;
        
        item.innerHTML = `
            <div class="recommendation-icon">
                <i class="fa-solid ${rec.icon}"></i>
            </div>
            <div class="recommendation-content">
                <h4>${rec.title} <span class="impact-value">${rec.impact}</span></h4>
                <p>${rec.description}</p>
            </div>
        `;
        
        container.appendChild(item);
    });
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function showLoading() {
    const form = document.getElementById('calculatorForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Calculating...';
    submitBtn.disabled = true;
}

function hideLoading() {
    // Loading is hidden when results are shown
}

// Data persistence functions
function saveResult(results) {
    const savedResults = getSavedResults();
    const newResult = {
        date: new Date().toISOString(),
        score: results.total,
        breakdown: results.breakdown,
        level: results.level.level
    };
    
    savedResults.push(newResult);
    
    // Keep only last 10 results
    if (savedResults.length > 10) {
        savedResults.shift();
    }
    
    localStorage.setItem('ecolife_impact_results', JSON.stringify(savedResults));
    
    // Update tracking section
    document.getElementById('trackingSection').style.display = 'block';
    displayHistory(savedResults);
    createProgressChart(savedResults);
}

function getSavedResults() {
    const saved = localStorage.getItem('ecolife_impact_results');
    return saved ? JSON.parse(saved) : [];
}

function loadSavedResults() {
    const savedResults = getSavedResults();
    if (savedResults.length > 0) {
        document.getElementById('trackingSection').style.display = 'block';
        displayHistory(savedResults);
        createProgressChart(savedResults);
    }
}

function displayHistory(results) {
    const container = document.getElementById('historyList');
    
    if (results.length === 0) {
        container.innerHTML = '<p>No previous results found. Take the quiz to start tracking!</p>';
        return;
    }
    
    container.innerHTML = '';
    
    results.slice(-5).reverse().forEach(result => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const date = new Date(result.date).toLocaleDateString();
        
        item.innerHTML = `
            <div class="history-date">${date}</div>
            <div class="history-score">${result.score} kg CO₂</div>
        `;
        
        container.appendChild(item);
    });
}

function createProgressChart(results) {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    if (progressChart) {
        progressChart.destroy();
    }
    
    const labels = results.slice(-6).map(result => 
        new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    
    const data = results.slice(-6).map(result => result.score);
    
    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Environmental Impact (kg CO₂)',
                data: data,
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kg CO₂ per year'
                    }
                }
            }
        }
    });
}

// Action button functions
function saveResults() {
    // Results are already saved automatically
    showNotification('Results saved successfully!', 'success');
}

function shareResults() {
    const results = calculatorData;
    const totalScore = document.getElementById('totalScore').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Environmental Impact Score',
            text: `I calculated my environmental impact and scored ${totalScore} kg CO₂/year! Calculate yours with EcoLife.`,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const shareText = `I calculated my environmental impact and scored ${totalScore} kg CO₂/year! Calculate yours at ${window.location.href}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Share link copied to clipboard!', 'success');
        });
    }
}

function retakeQuiz() {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('calculatorForm').style.display = 'block';
    
    // Reset form
    document.getElementById('impactForm').reset();
    
    // Reset button
    const submitBtn = document.querySelector('#impactForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fa-solid fa-calculator"></i> Calculate My Impact';
    submitBtn.disabled = false;
    
    // Scroll to form
    document.getElementById('calculatorForm').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Utility function for notifications (using existing system from main.js)
function showNotification(message, type = 'info') {
    // This function is defined in main.js
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message); // Fallback
    }
}

// Reveal animations on load
window.addEventListener('load', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.animationPlayState = 'running';
  });
});



// Scroll to calculator form when hero button is clicked
document.getElementById('startCalculatorBtn')?.addEventListener('click', () => {
  const formSection = document.querySelector('.calculator-section');
  if (formSection) {
    formSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});

document.getElementById("startCalculatorBtn")
  ?.addEventListener("click", () => {
    document
      .querySelector(".calculator-section")
      .scrollIntoView({ behavior: "smooth" });
  });

