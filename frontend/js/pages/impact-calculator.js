/**
 * Environmental Impact Calculator Page JavaScript
 *
 * Comprehensive environmental impact assessment tool with multi-step quiz,
 * scoring system, and personalized recommendations. Calculates carbon footprint
 * across transport, energy, diet, water, and waste categories.
 *
 * Features:
 * - Multi-step quiz navigation with progress tracking
 * - Dynamic scoring system with category breakdowns
 * - Interactive charts and visualizations
 * - Personalized recommendations based on results
 * - PDF export functionality
 * - Results sharing and saving capabilities
 * - Theme toggle with localStorage persistence
 * - Responsive design with accessibility features
 *
 * Scoring Categories:
 * - Transport: Walking, public transport, biking, driving, multiple vehicles
 * - Energy: Electricity usage and HVAC consumption
 * - Diet: Vegan, vegetarian, pescatarian, omnivore, meat-heavy
 * - Water: Shower duration and conservation practices
 * - Waste: Plastic usage and shopping habits
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 * @requires Chart.js (for data visualization)
 * @requires jsPDF (for PDF export)
 */

// ===== INITIALIZATION =====
/**
 * Initialize environmental impact calculator when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeImpactCalculator();
});

// ===== MAIN INITIALIZATION FUNCTION =====
/**
 * Initialize all impact calculator functionality
 * Sets up theme toggle, quiz navigation, and form handling
 */
function initializeImpactCalculator() {
    // Initialize theme toggle functionality
    initializeThemeToggle();

    // Initialize quiz navigation system
    initQuizNavigation();
}

// ===== THEME MANAGEMENT =====
/**
 * Initialize theme toggle functionality with localStorage persistence
 * Supports dark/light mode switching with system preference detection
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            // Switch to light theme
            body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ===== QUIZ NAVIGATION SYSTEM =====
/**
 * Initialize multi-step quiz navigation system
 * Handles step progression, validation, and progress tracking
 */
function initQuizNavigation() {
    // Initialize navigation variables
    let currentStep = 1;
    const totalSteps = 5;

    // Get navigation elements
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const currentStepEl = document.getElementById('currentStep');
    const formProgress = document.getElementById('formProgress');
    const steps = document.querySelectorAll('.step');
    const questionGroups = document.querySelectorAll('.question-group');

    // Initialize start calculator button
    const startCalculatorBtn = document.getElementById('startCalculatorBtn');
    if (startCalculatorBtn) {
        startCalculatorBtn.addEventListener('click', function() {
            document.getElementById('calculatorForm').scrollIntoView({behavior: 'smooth'});
        });
    }

    /**
     * Update progress bar and step indicators
     */
    function updateProgress() {
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        formProgress.style.width = `${progressPercentage}%`;
        currentStepEl.textContent = currentStep;

        // Update step indicators
        steps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Show/hide navigation buttons
        prevBtn.disabled = currentStep === 1;
        nextBtn.style.display = currentStep === totalSteps ? 'none' : 'flex';
        submitBtn.style.display = currentStep === totalSteps ? 'flex' : 'none';

        // Show current question group with animation
        questionGroups.forEach(group => {
            const groupStep = parseInt(group.getAttribute('data-step'));
            if (groupStep === currentStep) {
                group.style.display = 'block';
                setTimeout(() => {
                    group.style.opacity = '1';
                    group.style.transform = 'translateX(0)';
                }, 10);
            } else {
                group.style.display = 'none';
                group.style.opacity = '0';
                group.style.transform = 'translateX(20px)';
            }
        });
    }

    // Next button click handler
    nextBtn.addEventListener('click', function() {
        const currentGroup = document.querySelector(`.question-group[data-step="${currentStep}"]`);
        const selects = currentGroup.querySelectorAll('select[required]');
        let isValid = true;

        // Validate required fields
        selects.forEach(select => {
            if (!select.value) {
                isValid = false;
                select.style.borderColor = '#f44336';
                setTimeout(() => {
                    select.style.borderColor = '';
                }, 2000);
            }
        });

        if (isValid) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateProgress();
                document.getElementById('calculatorForm').scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        } else {
            alert('Please answer all questions before proceeding.');
        }
    });

    // Previous button click handler
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateProgress();
            document.getElementById('calculatorForm').scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    });

    // Form submission handler
    const impactForm = document.getElementById('impactForm');
    impactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateImpact();
    });

    // Initialize progress display
    updateProgress();

    // Initialize tooltips (handled by CSS)
    const helpElements = document.querySelectorAll('.question-help');
    helpElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = this.getAttribute('data-tooltip');
            // Tooltip display handled by CSS
        });
    });

    // Initialize form validation feedback
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            if (this.value) {
                this.style.borderColor = '#4caf50';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 1000);
            }
        });
    });
}

// ===== IMPACT CALCULATION =====
/**
 * Calculate environmental impact based on form responses
 * Implements comprehensive scoring system across all categories
 */
function calculateImpact() {
    const formData = new FormData(document.getElementById('impactForm'));
    const data = Object.fromEntries(formData);

    // Initialize scoring variables
    let totalScore = 0;
    const categoryScores = {
        transport: 0,
        energy: 0,
        diet: 0,
        water: 0,
        waste: 0
    };

    // Transport scoring (20 points max)
    const transportScores = {
        'walk': 5, 'public': 4, 'bike': 3, 'car': 2, 'multiple': 1
    };
    const distanceScores = {
        'low': 4, 'medium': 3, 'high': 2, 'very-high': 1
    };
    categoryScores.transport = transportScores[data.transport] + distanceScores[data.distance];
    totalScore += categoryScores.transport;

    // Energy scoring (20 points max)
    const electricityScores = {
        'low': 5, 'medium': 4, 'high': 3, 'very-high': 2
    };
    const hvacScores = {
        'none': 5, 'minimal': 4, 'moderate': 3, 'heavy': 2
    };
    categoryScores.energy = electricityScores[data.electricity] + hvacScores[data.hvac];
    totalScore += categoryScores.energy;

    // Diet scoring (20 points max)
    const dietScores = {
        'vegan': 5, 'vegetarian': 4, 'pescatarian': 3, 'omnivore': 2, 'meat-heavy': 1
    };
    const wasteScores = {
        'minimal': 5, 'some': 4, 'moderate': 3, 'high': 2
    };
    categoryScores.diet = dietScores[data.diet] + wasteScores[data['food-waste']];
    totalScore += categoryScores.diet;

    // Water scoring (20 points max)
    const showerScores = {
        'short': 5, 'medium': 4, 'long': 3, 'very-long': 2
    };
    const waterScores = {
        'excellent': 5, 'good': 4, 'average': 3, 'poor': 2
    };
    categoryScores.water = showerScores[data.shower] + waterScores[data['water-conservation']];
    totalScore += categoryScores.water;

    // Waste scoring (20 points max)
    const plasticScores = {
        'minimal': 5, 'low': 4, 'moderate': 3, 'high': 2
    };
    const shoppingScores = {
        'minimal': 5, 'conscious': 4, 'regular': 3, 'frequent': 2
    };
    categoryScores.waste = plasticScores[data.plastic] + shoppingScores[data.shopping];
    totalScore += categoryScores.waste;

    // Normalize to 100-point scale
    totalScore = Math.round((totalScore / 100) * 100);

    // Display results
    showResults(totalScore, categoryScores, data);
}

// ===== RESULTS DISPLAY =====
/**
 * Display impact calculation results with visualizations and recommendations
 * @param {number} totalScore - Overall environmental impact score (0-100)
 * @param {Object} categoryScores - Scores for each category
 * @param {Object} data - Original form data for recommendations
 */
function showResults(totalScore, categoryScores, data) {
    // Hide form, show results
    document.getElementById('calculatorForm').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('trackingSection').style.display = 'block';

    // Update total score display
    document.getElementById('totalScore').textContent = totalScore;

    // Determine score level and messaging
    let scoreLevel = '';
    let scoreMessage = '';
    let scoreColor = '';

    if (totalScore >= 80) {
        scoreLevel = 'Eco Warrior 🌿';
        scoreMessage = 'Excellent! You\'re living sustainably and setting a great example for others.';
        scoreColor = '#4caf50';
    } else if (totalScore >= 60) {
        scoreLevel = 'Eco Conscious 🌱';
        scoreMessage = 'Good job! You\'re making eco-friendly choices but there\'s room for improvement.';
        scoreColor = '#8bc34a';
    } else if (totalScore >= 40) {
        scoreLevel = 'Average Impact 📊';
        scoreMessage = 'You\'re aware of environmental issues but could adopt more sustainable practices.';
        scoreColor = '#ff9800';
    } else {
        scoreLevel = 'Needs Improvement 🚨';
        scoreMessage = 'Your environmental impact is high. Consider adopting more eco-friendly habits.';
        scoreColor = '#f44336';
    }

    document.getElementById('scoreLevel').textContent = scoreLevel;
    document.getElementById('scoreMessage').textContent = scoreMessage;
    document.getElementById('scoreLevel').style.color = scoreColor;

    // Update score circle visualization
    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.style.background = `conic-gradient(${scoreColor} ${totalScore * 3.6}deg, var(--border-color) 0deg)`;

    // Update user impact bar
    const userBar = document.getElementById('userBar');
    const userImpact = document.getElementById('userImpact');
    const co2Value = Math.round((100 - totalScore) * 25); // Convert score to CO2 estimate
    userBar.style.width = `${(co2Value / 3000) * 100}%`;
    userImpact.textContent = `${co2Value}kg CO₂/year`;

    // Create data visualizations
    createChart(categoryScores);
    createComparisonChart(totalScore, categoryScores);

    // Generate personalized recommendations
    generateRecommendations(data, totalScore);

    // Initialize action buttons
    document.getElementById('saveResultsBtn').addEventListener('click', () => exportToPDF(totalScore, categoryScores, data));
    document.getElementById('shareResultsBtn').addEventListener('click', shareResults);
    document.getElementById('retakeQuizBtn').addEventListener('click', retakeQuiz);

    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({behavior: 'smooth'});
}

// ===== DATA VISUALIZATION =====
/**
 * Create doughnut chart showing category breakdown
 * @param {Object} categoryScores - Scores for each environmental category
 */
function createChart(categoryScores) {
    const ctx = document.getElementById('breakdownChart').getContext('2d');

    // Destroy existing chart if it exists
    if (window.breakdownChart) {
        window.breakdownChart.destroy();
    }

    const colors = ['#2e7d32', '#4caf50', '#8bc34a', '#cddc39', '#ffc107'];

    window.breakdownChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Transport', 'Energy', 'Diet', 'Water', 'Waste'],
            datasets: [{
                data: [
                    categoryScores.transport * 5,
                    categoryScores.energy * 5,
                    categoryScores.diet * 5,
                    categoryScores.water * 5,
                    categoryScores.waste * 5
                ],
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'var(--text-primary)',
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// ===== RECOMMENDATIONS SYSTEM =====
/**
 * Generate personalized recommendations based on user responses
 * @param {Object} data - Form data containing user responses
 * @param {number} totalScore - Overall environmental impact score
 */
function generateRecommendations(data, totalScore) {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';

    const recommendations = [];

    // Transport recommendations
    if (data.transport === 'car' || data.transport === 'multiple') {
        recommendations.push({
            icon: '🚗',
            title: 'Use Public Transport',
            description: 'Switch to public transport or carpool to reduce emissions.'
        });
    }
    if (data.distance === 'high' || data.distance === 'very-high') {
        recommendations.push({
            icon: '🚲',
            title: 'Reduce Travel Distance',
            description: 'Combine errands and plan efficient routes to minimize travel.'
        });
    }

    // Energy recommendations
    if (data.electricity === 'high' || data.electricity === 'very-high') {
        recommendations.push({
            icon: '💡',
            title: 'Switch to LED Bulbs',
            description: 'Replace incandescent bulbs with energy-efficient LEDs.'
        });
    }
    if (data.hvac === 'heavy' || data.hvac === 'moderate') {
        recommendations.push({
            icon: '🌡️',
            title: 'Optimize AC/Heater Use',
            description: 'Use programmable thermostats and maintain optimal temperatures.'
        });
    }

    // Diet recommendations
    if (data.diet === 'meat-heavy' || data.diet === 'omnivore') {
        recommendations.push({
            icon: '🥩',
            title: 'Reduce Meat Consumption',
            description: 'Try meatless days or plant-based alternatives.'
        });
    }
    if (data['food-waste'] === 'high' || data['food-waste'] === 'moderate') {
        recommendations.push({
            icon: '♻️',
            title: 'Reduce Food Waste',
            description: 'Plan meals, store food properly, and compost organic waste.'
        });
    }

    // Water recommendations
    if (data.shower === 'long' || data.shower === 'very-long') {
        recommendations.push({
            icon: '🚿',
            title: 'Shorten Showers',
            description: 'Aim for 5-minute showers to save water.'
        });
    }
    if (data['water-conservation'] === 'poor' || data['water-conservation'] === 'average') {
        recommendations.push({
            icon: '💧',
            title: 'Install Water-Saving Fixtures',
            description: 'Use low-flow showerheads and faucet aerators.'
        });
    }

    // Waste recommendations
    if (data.plastic === 'high' || data.plastic === 'moderate') {
        recommendations.push({
            icon: '🛍️',
            title: 'Avoid Single-Use Plastics',
            description: 'Use reusable bags, bottles, and containers.'
        });
    }
    if (data.shopping === 'frequent' || data.shopping === 'regular') {
        recommendations.push({
            icon: '📦',
            title: 'Practice Conscious Consumption',
            description: 'Buy only what you need and choose quality over quantity.'
        });
    }

    // Add general recommendations based on score
    if (totalScore < 60) {
        recommendations.push({
            icon: '📚',
            title: 'Learn More About Sustainability',
            description: 'Educate yourself on environmental issues and solutions.'
        });
    }
    if (totalScore > 70) {
        recommendations.push({
            icon: '🌿',
            title: 'Share Your Knowledge',
            description: 'Inspire others by sharing your eco-friendly practices.'
        });
    }

    // Display recommendations (max 6)
    recommendations.slice(0, 6).forEach(rec => {
        const recItem = document.createElement('div');
        recItem.className = 'recommendation-item';
        recItem.innerHTML = `
            <div class="recommendation-icon">${rec.icon}</div>
            <div class="recommendation-content">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            </div>
        `;
        recommendationsList.appendChild(recItem);
    });
}

// ===== COMPARISON CHART =====
/**
 * Create bar chart comparing user scores with optimal scores
 * @param {number} totalScore - Overall environmental impact score
 * @param {Object} categoryScores - Scores for each category
 */
function createComparisonChart(totalScore, categoryScores) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');

    // Destroy existing chart if it exists
    if (window.comparisonChart) {
        window.comparisonChart.destroy();
    }

    const categories = ['Transport', 'Energy', 'Diet', 'Water', 'Waste'];
    const userScores = [
        categoryScores.transport * 10,
        categoryScores.energy * 10,
        categoryScores.diet * 10,
        categoryScores.water * 10,
        categoryScores.waste * 10
    ];
    const optimalScores = [100, 100, 100, 100, 100];

    window.comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Your Score',
                data: userScores,
                backgroundColor: 'rgba(46, 125, 50, 0.8)',
                borderColor: '#2e7d32',
                borderWidth: 2
            }, {
                label: 'Optimal Score',
                data: optimalScores,
                backgroundColor: 'rgba(76, 175, 80, 0.3)',
                borderColor: '#4caf50',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'var(--text-primary)',
                        padding: 15,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#2e7d32',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: 'var(--text-secondary)',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'var(--text-secondary)',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ===== PDF EXPORT =====
/**
 * Export results to PDF format with professional formatting
 * @param {number} totalScore - Overall environmental impact score
 * @param {Object} categoryScores - Scores for each category
 * @param {Object} data - Original form data
 */
async function exportToPDF(totalScore, categoryScores, data) {
    try {
        // Show loading state
        const btn = document.getElementById('saveResultsBtn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';
        btn.disabled = true;

        // Get jsPDF library
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // Set up colors
        const primaryColor = [46, 125, 50];
        const textColor = [33, 33, 33];
        const grayColor = [128, 128, 128];

        // Page dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;

        // Add header with background
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, pageWidth, 40, 'F');

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Environmental Impact Report', margin, 20);

        // Date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.text(`Generated on: ${date}`, margin, 30);

        // Overall Score Section
        let yPos = 55;
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Overall Impact Score', margin, yPos);
        yPos += 10;
        doc.setFontSize(36);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`${totalScore}/100`, margin, yPos);
        yPos += 8;
        doc.setFontSize(12);
        const scoreLevel = document.getElementById('scoreLevel').textContent;
        doc.text(scoreLevel, margin, yPos);

        // Category Breakdown Section
        yPos += 20;
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Category Breakdown', margin, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const categories = [
            { name: 'Transport', score: categoryScores.transport * 10, icon: '🚗' },
            { name: 'Energy', score: categoryScores.energy * 10, icon: '⚡' },
            { name: 'Diet', score: categoryScores.diet * 10, icon: '🍽️' },
            { name: 'Water', score: categoryScores.water * 10, icon: '💧' },
            { name: 'Waste', score: categoryScores.waste * 10, icon: '♻️' }
        ];

        categories.forEach((cat, index) => {
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text(`${cat.icon} ${cat.name}:`, margin, yPos);

            // Progress bar
            const barWidth = 100;
            const barHeight = 5;
            const barX = margin + 40;
            const barY = yPos - 3;

            // Background
            doc.setFillColor(230, 230, 230);
            doc.rect(barX, barY, barWidth, barHeight, 'F');

            // Fill
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(barX, barY, (cat.score / 100) * barWidth, barHeight, 'F');

            // Score text
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(`${cat.score}%`, barX + barWidth + 5, yPos);
            doc.setFont('helvetica', 'normal');
            yPos += 12;
        });

        // Recommendations Section
        yPos += 10;
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Personalized Recommendations', margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Get recommendations from the DOM
        const recElements = document.querySelectorAll('.recommendation-item');
        let recCount = 0;
        recElements.forEach((rec) => {
            if (recCount >= 6) return; // Limit to 6 recommendations

            const title = rec.querySelector('h4').textContent;
            const description = rec.querySelector('p').textContent;

            // Check if we need a new page
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFont('helvetica', 'bold');
            doc.text(`• ${title}`, margin + 5, yPos);
            yPos += 5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
            const lines = doc.splitTextToSize(description, pageWidth - margin * 2 - 10);
            doc.text(lines, margin + 7, yPos);
            yPos += lines.length * 5 + 8;
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            recCount++;
        });

        // Footer
        const footerY = pageHeight - 15;
        doc.setFontSize(8);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text('Generated by EcoLife Environmental Impact Calculator', pageWidth / 2, footerY, { align: 'center' });
        doc.text('https://ecolife.org', pageWidth / 2, footerY + 4, { align: 'center' });

        // Save the PDF
        doc.save(`Environmental-Impact-Report-${new Date().toISOString().split('T')[0]}.pdf`);

        // Reset button
        btn.innerHTML = originalHTML;
        btn.disabled = false;

        // Show success message
        alert('PDF exported successfully! 📄');

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');

        // Reset button
        const btn = document.getElementById('saveResultsBtn');
        btn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Export PDF';
        btn.disabled = false;
    }
}

// ===== RESULTS MANAGEMENT =====
/**
 * Save results to localStorage (placeholder for backend integration)
 */
function saveResults() {
    const totalScore = document.getElementById('totalScore').textContent;
    const scoreLevel = document.getElementById('scoreLevel').textContent;
    const date = new Date().toLocaleDateString();

    // In a real app, you would save to localStorage or backend
    const result = {
        date: date,
        score: totalScore,
        level: scoreLevel
    };

    alert(`Results saved for ${date}! Score: ${totalScore} - ${scoreLevel}`);
}

// ===== SHARING FUNCTIONALITY =====
/**
 * Share results using Web Share API or clipboard fallback
 */
function shareResults() {
    const totalScore = document.getElementById('totalScore').textContent;
    const scoreLevel = document.getElementById('scoreLevel').textContent;

    if (navigator.share) {
        navigator.share({
            title: 'My Environmental Impact Score',
            text: `I got ${totalScore}/100 (${scoreLevel}) on the EcoLife Environmental Impact Calculator! 🌱`,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const text = `My Environmental Impact Score: ${totalScore}/100 (${scoreLevel})\nTake the quiz at: ${window.location.href}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard! Share it with your friends.');
        }).catch(() => {
            alert('Could not copy to clipboard. Please manually share the results.');
        });
    }
}

// ===== QUIZ RESET =====
/**
 * Reset quiz to allow retaking with form clearing and state reset
 */
function retakeQuiz() {
    // Reset form
    document.getElementById('impactForm').reset();
    document.getElementById('calculatorForm').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('trackingSection').style.display = 'none';

    // Reset to step 1
    document.getElementById('currentStep').textContent = '1';
    document.getElementById('formProgress').style.width = '20%';

    // Reset steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.step[data-step="1"]').classList.add('active');

    // Reset question groups
    document.querySelectorAll('.question-group').forEach((group, index) => {
        if (index === 0) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });

    // Reset navigation buttons
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').style.display = 'flex';
    document.getElementById('submitBtn').style.display = 'none';

    // Scroll to form
    document.getElementById('calculatorForm').scrollIntoView({behavior: 'smooth'});

    // Reinitialize quiz
    initQuizNavigation();
}