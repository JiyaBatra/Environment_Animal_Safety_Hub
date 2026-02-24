// Wildlife Reproductive Timing Compression - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initBreedingSimulator();
  initReproductiveCalculator();
  initPhenologicalAnalyzer();
  initPopulationModel();
  initModals();
  initThemeToggle();
});

// Scroll animations for sections
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all major sections
  const sections = document.querySelectorAll('.overview-section, .interactive-section, .calculator-section, .analyzer-section, .model-section, .modals-section');
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Breeding Season Simulator
function initBreedingSimulator() {
  const tempSlider = document.getElementById('temperature-slider');
  const precipSlider = document.getElementById('precipitation-slider');
  const tempValue = document.getElementById('temperature-value');
  const precipValue = document.getElementById('precipitation-value');
  const seasonLength = document.getElementById('season-length');
  const timingMismatch = document.getElementById('timing-mismatch');
  const reproductiveSuccess = document.getElementById('reproductive-success');
  const timelineContainer = document.getElementById('season-timeline');

  if (!tempSlider || !timelineContainer) return;

  function updateSimulator() {
    const tempIncrease = parseFloat(tempSlider.value);
    const precipChange = parseFloat(precipSlider.value);

    tempValue.textContent = tempIncrease.toFixed(1) + '°C';
    precipValue.textContent = precipChange + '%';

    // Calculate season compression effects
    const baseSeasonLength = 120; // days
    const tempCompression = tempIncrease * 8; // 8 days per °C
    const precipCompression = Math.abs(precipChange) * 0.3; // 0.3 days per % change
    const compressedLength = Math.max(30, baseSeasonLength - tempCompression - precipCompression);

    // Calculate timing mismatch
    const baseMismatch = 5; // days
    const tempMismatch = tempIncrease * 3;
    const precipMismatch = Math.abs(precipChange) * 0.1;
    const totalMismatch = baseMismatch + tempMismatch + precipMismatch;

    // Calculate reproductive success
    const baseSuccess = 90; // %
    const lengthPenalty = (baseSeasonLength - compressedLength) * 0.4;
    const mismatchPenalty = totalMismatch * 0.8;
    const success = Math.max(10, baseSuccess - lengthPenalty - mismatchPenalty);

    seasonLength.textContent = Math.round(compressedLength) + ' days';
    timingMismatch.textContent = Math.round(totalMismatch) + ' days';
    reproductiveSuccess.textContent = Math.round(success) + '%';

    // Draw timeline
    drawTimeline(timelineContainer, compressedLength, totalMismatch);
  }

  function drawTimeline(container, length, mismatch) {
    container.innerHTML = '';

    const totalDays = 365;
    const startDay = 60; // March 1st approx
    const resourceStart = startDay + 30; // Resource peak later
    const resourceLength = 60;

    // Historical season (green)
    const historicalLength = 120;
    const historicalBar = document.createElement('div');
    historicalBar.className = 'timeline-bar historical';
    historicalBar.style.left = (startDay / totalDays * 100) + '%';
    historicalBar.style.width = (historicalLength / totalDays * 100) + '%';
    historicalBar.title = 'Historical Breeding Season: ' + historicalLength + ' days';
    container.appendChild(historicalBar);

    // Current season (orange)
    const currentBar = document.createElement('div');
    currentBar.className = 'timeline-bar current';
    currentBar.style.left = ((startDay + mismatch) / totalDays * 100) + '%';
    currentBar.style.width = (length / totalDays * 100) + '%';
    currentBar.title = 'Current Breeding Season: ' + Math.round(length) + ' days';
    container.appendChild(currentBar);

    // Resource availability (red)
    const resourceBar = document.createElement('div');
    resourceBar.className = 'timeline-bar resource';
    resourceBar.style.left = (resourceStart / totalDays * 100) + '%';
    resourceBar.style.width = (resourceLength / totalDays * 100) + '%';
    resourceBar.title = 'Optimal Resource Period: ' + resourceLength + ' days';
    container.appendChild(resourceBar);

    // Add month labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
      const monthLabel = document.createElement('div');
      monthLabel.className = 'month-label';
      monthLabel.textContent = months[i];
      monthLabel.style.left = (i / 12 * 100) + '%';
      container.appendChild(monthLabel);
    }
  }

  tempSlider.addEventListener('input', updateSimulator);
  precipSlider.addEventListener('input', updateSimulator);

  updateSimulator(); // Initial draw
}

// Reproductive Success Calculator
function initReproductiveCalculator() {
  const speciesSelect = document.getElementById('species-select');
  const timingOffsetSlider = document.getElementById('timing-offset');
  const seasonLengthSlider = document.getElementById('season-length');
  const timingValue = document.getElementById('timing-offset-value');
  const seasonValue = document.getElementById('season-length-value');
  const calculateBtn = document.getElementById('calculate-btn');
  const offspringSurvival = document.getElementById('offspring-survival');
  const parentalInvestment = document.getElementById('parental-investment');
  const populationGrowth = document.getElementById('population-growth');
  const extinctionRisk = document.getElementById('extinction-risk');
  const successChartCanvas = document.getElementById('success-chart');

  if (!calculateBtn || !successChartCanvas) return;

  const ctx = successChartCanvas.getContext('2d');

  // Species data
  const speciesData = {
    'migratory-bird': { baseSurvival: 75, investment: 'High', growth: 0.05 },
    'large-mammal': { baseSurvival: 85, investment: 'Very High', growth: 0.02 },
    'small-mammal': { baseSurvival: 65, investment: 'Medium', growth: 0.08 },
    'amphibian': { baseSurvival: 55, investment: 'Low', growth: 0.12 },
    'reptile': { baseSurvival: 70, investment: 'Medium', growth: 0.04 }
  };

  function calculateSuccess() {
    const species = speciesSelect.value;
    const timingOffset = parseInt(timingOffsetSlider.value);
    const seasonLength = parseInt(seasonLengthSlider.value);
    const data = speciesData[species];

    // Calculate survival based on timing and season length
    const timingPenalty = Math.abs(timingOffset) * 0.8; // 0.8% per day off optimal
    const lengthBonus = Math.min(20, (seasonLength - 30) * 0.2); // Bonus for longer seasons
    const survival = Math.max(5, Math.min(95, data.baseSurvival - timingPenalty + lengthBonus));

    // Calculate population growth
    const growthRate = data.growth * (survival / data.baseSurvival);
    const growthPercent = (growthRate * 100).toFixed(1);

    // Determine extinction risk
    let risk = 'Low';
    if (survival < 40) risk = 'High';
    else if (survival < 60) risk = 'Medium-High';
    else if (survival < 75) risk = 'Medium';

    offspringSurvival.textContent = Math.round(survival) + '%';
    parentalInvestment.textContent = data.investment;
    populationGrowth.textContent = (growthRate >= 0 ? '+' : '') + growthPercent + '%';
    extinctionRisk.textContent = risk;

    // Draw success chart
    drawSuccessChart(ctx, survival, data.baseSurvival);
  }

  function drawSuccessChart(ctx, current, base) {
    ctx.clearRect(0, 0, successChartCanvas.width, successChartCanvas.height);

    const centerX = successChartCanvas.width / 2;
    const centerY = successChartCanvas.height / 2;
    const radius = 50;

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e9ecef';
    ctx.fill();

    // Base survival arc
    const baseAngle = (base / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + baseAngle);
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    // Current survival arc
    const currentAngle = (current / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + currentAngle);
    ctx.lineWidth = 15;
    ctx.strokeStyle = current > base ? '#4CAF50' : '#FF9800';
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Survival Rate', centerX, centerY - 8);
    ctx.fillText(current.toFixed(0) + '%', centerX, centerY + 8);
  }

  calculateBtn.addEventListener('click', calculateSuccess);
  speciesSelect.addEventListener('change', calculateSuccess);
  timingOffsetSlider.addEventListener('input', () => {
    timingValue.textContent = timingOffsetSlider.value + ' days';
    calculateSuccess();
  });
  seasonLengthSlider.addEventListener('input', () => {
    seasonValue.textContent = seasonLengthSlider.value + ' days';
    calculateSuccess();
  });

  calculateSuccess(); // Initial calculation
}

// Phenological Mismatch Analyzer
function initPhenologicalAnalyzer() {
  const breedingStartSlider = document.getElementById('breeding-start');
  const resourcePeakSlider = document.getElementById('resource-peak');
  const breedingDurationSlider = document.getElementById('breeding-duration');
  const resourceWindowSlider = document.getElementById('resource-window');
  const breedingStartValue = document.getElementById('breeding-start-value');
  const resourcePeakValue = document.getElementById('resource-peak-value');
  const breedingDurationValue = document.getElementById('breeding-duration-value');
  const resourceWindowValue = document.getElementById('resource-window-value');
  const overlapDuration = document.getElementById('overlap-duration');
  const mismatchSeverity = document.getElementById('mismatch-severity');
  const survivalImpact = document.getElementById('survival-impact');
  const phenologyCanvas = document.getElementById('phenology-canvas');

  if (!phenologyCanvas) return;

  const ctx = phenologyCanvas.getContext('2d');

  function updateAnalyzer() {
    const breedingStart = parseInt(breedingStartSlider.value);
    const resourcePeak = parseInt(resourcePeakSlider.value);
    const breedingDuration = parseInt(breedingDurationSlider.value);
    const resourceWindow = parseInt(resourceWindowSlider.value);

    breedingStartValue.textContent = breedingStart;
    resourcePeakValue.textContent = resourcePeak;
    breedingDurationValue.textContent = breedingDuration;
    resourceWindowValue.textContent = resourceWindow;

    // Calculate overlap
    const breedingEnd = breedingStart + breedingDuration;
    const resourceEnd = resourcePeak + resourceWindow;
    const overlapStart = Math.max(breedingStart, resourcePeak);
    const overlapEnd = Math.min(breedingEnd, resourceEnd);
    const overlap = Math.max(0, overlapEnd - overlapStart);

    // Calculate mismatch severity
    const totalMismatch = Math.abs(breedingStart - resourcePeak) + Math.abs(breedingEnd - resourceEnd);
    let severity = 'Low';
    if (totalMismatch > 60) severity = 'High';
    else if (totalMismatch > 30) severity = 'Moderate';

    // Calculate survival impact
    const baseSurvival = 80;
    const overlapBonus = overlap * 0.5;
    const mismatchPenalty = totalMismatch * 0.3;
    const survival = Math.max(10, Math.min(95, baseSurvival + overlapBonus - mismatchPenalty));
    const impact = ((survival - baseSurvival) / baseSurvival * 100).toFixed(0);

    overlapDuration.textContent = overlap + ' days';
    mismatchSeverity.textContent = severity;
    survivalImpact.textContent = (impact >= 0 ? '+' : '') + impact + '%';

    // Draw phenology chart
    drawPhenologyChart(ctx, breedingStart, breedingDuration, resourcePeak, resourceWindow);
  }

  function drawPhenologyChart(ctx, breedingStart, breedingDuration, resourcePeak, resourceWindow) {
    ctx.clearRect(0, 0, phenologyCanvas.width, phenologyCanvas.height);

    const width = phenologyCanvas.width;
    const height = phenologyCanvas.height;
    const padding = 60;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw breeding period (blue)
    const breedingX = padding + (breedingStart / 365) * plotWidth;
    const breedingWidth = (breedingDuration / 365) * plotWidth;
    ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
    ctx.fillRect(breedingX, padding + 20, breedingWidth, plotHeight - 40);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.strokeRect(breedingX, padding + 20, breedingWidth, plotHeight - 40);

    // Draw resource period (green)
    const resourceX = padding + (resourcePeak / 365) * plotWidth;
    const resourceWidth = (resourceWindow / 365) * plotWidth;
    ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    ctx.fillRect(resourceX, padding + 40, resourceWidth, plotHeight - 80);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.strokeRect(resourceX, padding + 40, resourceWidth, plotHeight - 80);

    // Draw overlap (yellow)
    const overlapStart = Math.max(breedingStart, resourcePeak);
    const overlapEnd = Math.min(breedingStart + breedingDuration, resourcePeak + resourceWindow);
    if (overlapEnd > overlapStart) {
      const overlapX = padding + (overlapStart / 365) * plotWidth;
      const overlapWidth = ((overlapEnd - overlapStart) / 365) * plotWidth;
      ctx.fillStyle = 'rgba(255, 193, 7, 0.5)';
      ctx.fillRect(overlapX, padding + 30, overlapWidth, plotHeight - 60);
    }

    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Breeding Period', breedingX + breedingWidth / 2, padding + 15);
    ctx.fillText('Resource Period', resourceX + resourceWidth / 2, height - padding + 15);
  }

  breedingStartSlider.addEventListener('input', updateAnalyzer);
  resourcePeakSlider.addEventListener('input', updateAnalyzer);
  breedingDurationSlider.addEventListener('input', updateAnalyzer);
  resourceWindowSlider.addEventListener('input', updateAnalyzer);

  updateAnalyzer(); // Initial update
}

// Population Impact Model
function initPopulationModel() {
  const compressionRateSlider = document.getElementById('compression-rate');
  const speciesResilienceSelect = document.getElementById('species-resilience');
  const habitatQualitySlider = document.getElementById('habitat-quality');
  const compressionValue = document.getElementById('compression-rate-value');
  const habitatValue = document.getElementById('habitat-quality-value');
  const populationCanvas = document.getElementById('population-canvas');
  const insightsList = document.getElementById('population-insights');

  if (!populationCanvas) return;

  const ctx = populationCanvas.getContext('2d');

  function updateModel() {
    const compressionRate = parseFloat(compressionRateSlider.value) / 100; // Convert to decimal
    const resilience = speciesResilienceSelect.value;
    const habitatQuality = parseFloat(habitatQualitySlider.value) / 100;

    compressionValue.textContent = compressionRateSlider.value + '%';
    habitatValue.textContent = habitatQualitySlider.value + '%';

    // Calculate population trajectory
    const populationData = calculatePopulationDynamics(compressionRate, resilience, habitatQuality);

    // Update insights
    updatePopulationInsights(populationData, compressionRate, resilience, habitatQuality);

    // Draw population chart
    drawPopulationChart(ctx, populationData);
  }

  function calculatePopulationDynamics(compressionRate, resilience, habitatQuality) {
    const data = [];
    let population = 100; // Starting population

    // Resilience factors
    const resilienceMultipliers = {
      'low': 0.7,
      'medium': 1.0,
      'high': 1.3
    };
    const resilienceFactor = resilienceMultipliers[resilience];

    for (let year = 0; year <= 50; year++) {
      // Complex model incorporating compression, resilience, and habitat
      const compressionEffect = 1 - (compressionRate * year * 0.02); // Cumulative compression effect
      const habitatEffect = habitatQuality;
      const resilienceEffect = resilienceFactor;

      const growthRate = 0.03 * compressionEffect * habitatEffect * resilienceEffect;
      const mortalityRate = 0.02 + (compressionRate * year * 0.005); // Increasing mortality

      population *= (1 + growthRate - mortalityRate);
      population = Math.max(0, population);

      data.push({ year, population });
    }

    return data;
  }

  function updatePopulationInsights(data, compressionRate, resilience, habitatQuality) {
    const finalPopulation = data[data.length - 1].population;
    const startPopulation = data[0].population;
    const percentChange = ((finalPopulation - startPopulation) / startPopulation * 100);

    const insights = [];

    if (finalPopulation < 50) {
      insights.push('Population at high risk of decline');
    } else if (finalPopulation < 80) {
      insights.push('Population showing moderate decline');
    } else {
      insights.push('Population relatively stable');
    }

    if (compressionRate > 0.1) {
      insights.push('High compression rate accelerating decline');
    }

    if (resilience === 'high') {
      insights.push('Species resilience buffering against changes');
    } else if (resilience === 'low') {
      insights.push('Low resilience increasing vulnerability');
    }

    if (habitatQuality > 0.7) {
      insights.push('Good habitat quality supporting population');
    } else if (habitatQuality < 0.4) {
      insights.push('Poor habitat quality limiting recovery');
    }

    insightsList.innerHTML = insights.map(insight => `<li>${insight}</li>`).join('');
  }

  function drawPopulationChart(ctx, data) {
    ctx.clearRect(0, 0, populationCanvas.width, populationCanvas.height);

    const width = populationCanvas.width;
    const height = populationCanvas.height;
    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * plotHeight / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw data line
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + (index / 50) * plotWidth;
      const y = height - padding - (point.population / 150) * plotHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#8B4513';
    data.forEach((point, index) => {
      if (index % 10 === 0) { // Every 10 years
        const x = padding + (index / 50) * plotWidth;
        const y = height - padding - (point.population / 150) * plotHeight;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  compressionRateSlider.addEventListener('input', updateModel);
  speciesResilienceSelect.addEventListener('change', updateModel);
  habitatQualitySlider.addEventListener('input', updateModel);

  updateModel(); // Initial update
}

// Modal Management
function initModals() {
  const modalButtons = document.querySelectorAll('.modal-btn');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close');

  modalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.dataset.modal + '-modal';
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'block';
      }
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.modal').style.display = 'none';
    });
  });

  // Close modal when clicking outside
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
}

// Theme Toggle
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  if (!themeToggle) return;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });
}

// Scroll Progress
document.addEventListener('scroll', () => {
  const scrollProgress = document.getElementById('scrollProgress');
  if (!scrollProgress) return;

  const scrollTop = window.pageYOffset;
  const docHeight = document.body.offsetHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;
});