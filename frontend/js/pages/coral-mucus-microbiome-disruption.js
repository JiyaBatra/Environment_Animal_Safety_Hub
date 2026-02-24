// Coral Mucus Microbiome Disruption - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initPollutionSimulator();
  initCoralHealthCalculator();
  initMicrobiomeAnalyzer();
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
  const sections = document.querySelectorAll('.overview-section, .interactive-section, .calculator-section, .analyzer-section, .sources-section, .mitigation-section, .modals-section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Scroll progress indicator
  window.addEventListener('scroll', updateScrollProgress);
}

function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById('scrollProgress').style.width = scrollPercent + '%';
}

// Pollution Impact Simulator
function initPollutionSimulator() {
  const nutrientSlider = document.getElementById('nutrient-pollution');
  const chemicalSlider = document.getElementById('chemical-pollution');
  const sedimentSlider = document.getElementById('sediment-pollution');
  const tempSlider = document.getElementById('temperature-stress');

  const nutrientValue = document.getElementById('nutrient-value');
  const chemicalValue = document.getElementById('chemical-value');
  const sedimentValue = document.getElementById('sediment-value');
  const tempValue = document.getElementById('temp-value');

  const diversityIndex = document.getElementById('diversity-index');
  const diversityChange = document.getElementById('diversity-change');
  const pathogenLevel = document.getElementById('pathogen-level');
  const pathogenChange = document.getElementById('pathogen-change');
  const immuneStatus = document.getElementById('immune-status');
  const immuneChange = document.getElementById('immune-change');

  if (!nutrientSlider) return;

  function updateSimulator() {
    const nutrients = parseFloat(nutrientSlider.value);
    const chemicals = parseFloat(chemicalSlider.value);
    const sediments = parseFloat(sedimentSlider.value);
    const temperature = parseFloat(tempSlider.value);

    // Update display values
    nutrientValue.textContent = nutrients + ' μM';
    chemicalValue.textContent = chemicals + ' ppm';
    sedimentValue.textContent = sediments + ' mg/L';
    tempValue.textContent = temperature + '°C';

    // Calculate pollution impact
    const totalPollution = nutrients * 0.1 + chemicals * 0.2 + sediments * 0.05 + Math.max(0, temperature - 26) * 0.3;

    // Calculate microbiome diversity
    const diversity = Math.max(0, 3.5 - totalPollution * 0.1);
    const diversityLevel = diversity > 2.5 ? 'High' : diversity > 1.5 ? 'Moderate' : 'Low';
    diversityIndex.textContent = diversityLevel;
    diversityIndex.style.color = diversity > 2.5 ? '#228B22' : diversity > 1.5 ? '#FF8C00' : '#DC143C';
    diversityChange.textContent = 'Shannon Index: ' + diversity.toFixed(1);

    // Calculate pathogen load
    const pathogenLoad = Math.min(100, totalPollution * 5);
    const pathogenLevelText = pathogenLoad < 20 ? 'Low' : pathogenLoad < 50 ? 'Moderate' : 'High';
    pathogenLevel.textContent = pathogenLevelText;
    pathogenLevel.style.color = pathogenLoad < 20 ? '#228B22' : pathogenLoad < 50 ? '#FF8C00' : '#DC143C';
    pathogenChange.textContent = Math.round(pathogenLoad) + '% of community';

    // Calculate immune response
    const immuneEffectiveness = Math.max(0, 100 - totalPollution * 2);
    const immuneLevel = immuneEffectiveness > 70 ? 'Active' : immuneEffectiveness > 40 ? 'Compromised' : 'Suppressed';
    immuneStatus.textContent = immuneLevel;
    immuneStatus.style.color = immuneEffectiveness > 70 ? '#228B22' : immuneEffectiveness > 40 ? '#FF8C00' : '#DC143C';
    immuneChange.textContent = Math.round(immuneEffectiveness) + '% effectiveness';

    // Update microbiome composition visualization
    updateMicrobiomeComposition(totalPollution);
  }

  // Event listeners
  nutrientSlider.addEventListener('input', updateSimulator);
  chemicalSlider.addEventListener('input', updateSimulator);
  sedimentSlider.addEventListener('input', updateSimulator);
  tempSlider.addEventListener('input', updateSimulator);

  // Initial update
  updateSimulator();
}

function updateMicrobiomeComposition(pollutionLevel) {
  const canvas = document.getElementById('microbiome-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 20;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate microbial composition based on pollution
  const beneficial = Math.max(5, 60 - pollutionLevel * 2);
  const pathogens = Math.min(80, 5 + pollutionLevel * 3);
  const opportunists = Math.min(60, 10 + pollutionLevel * 1.5);
  const others = 100 - beneficial - pathogens - opportunists;

  const microbes = [
    { name: 'Beneficial', percentage: beneficial, color: '#228B22' },
    { name: 'Pathogens', percentage: pathogens, color: '#DC143C' },
    { name: 'Opportunists', percentage: opportunists, color: '#FF8C00' },
    { name: 'Others', percentage: others, color: '#9370DB' }
  ];

  let startAngle = -Math.PI / 2;

  microbes.forEach(microbe => {
    if (microbe.percentage <= 0) return;

    const sliceAngle = (microbe.percentage / 100) * 2 * Math.PI;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = microbe.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    const labelAngle = startAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(microbe.percentage)}%`, labelX, labelY);

    startAngle += sliceAngle;
  });
}

// Coral Health Calculator
function initCoralHealthCalculator() {
  const coralSelect = document.getElementById('coral-species');
  const exposureInput = document.getElementById('pollution-exposure');
  const disruptionInput = document.getElementById('microbiome-disruption');
  const qualityInput = document.getElementById('water-quality');

  const healthBar = document.getElementById('health-bar');
  const healthValue = document.getElementById('health-value');
  const resistanceBar = document.getElementById('resistance-bar');
  const resistanceValue = document.getElementById('resistance-value');
  const recoveryBar = document.getElementById('recovery-bar');
  const recoveryValue = document.getElementById('recovery-value');

  const recommendationsList = document.getElementById('health-recommendations');

  if (!coralSelect) return;

  function updateCalculator() {
    const species = coralSelect.value;
    const exposure = parseFloat(exposureInput.value);
    const disruption = parseFloat(disruptionInput.value);
    const quality = parseFloat(qualityInput.value);

    // Species-specific calculations
    const speciesData = getCoralSpeciesData(species);

    // Calculate overall health
    const baseHealth = speciesData.resilience;
    const exposureImpact = Math.min(50, exposure / 7.3); // 365 days = 50% max impact
    const disruptionImpact = disruption * 0.3;
    const qualityImpact = (100 - quality) * 0.2;

    const totalImpact = exposureImpact + disruptionImpact + qualityImpact;
    const overallHealth = Math.max(0, baseHealth - totalImpact);

    // Update health indicators
    const healthPercent = Math.round(overallHealth);
    healthBar.style.width = healthPercent + '%';
    healthValue.textContent = healthPercent + '% - ' + getHealthStatus(healthPercent);

    // Disease resistance
    const resistance = Math.max(0, speciesData.resistance - totalImpact * 0.8);
    const resistancePercent = Math.round(resistance);
    resistanceBar.style.width = resistancePercent + '%';
    resistanceValue.textContent = resistancePercent + '% - ' + getResistanceStatus(resistancePercent);

    // Recovery potential
    const recovery = Math.max(0, speciesData.recovery - totalImpact * 0.5);
    const recoveryPercent = Math.round(recovery);
    recoveryBar.style.width = recoveryPercent + '%';
    recoveryValue.textContent = recoveryPercent + '% - ' + getRecoveryStatus(recoveryPercent);

    // Update recommendations
    updateHealthRecommendations(exposure, disruption, quality);

    // Update risk assessment
    updateDiseaseRisks(overallHealth, species);
  }

  // Event listeners
  coralSelect.addEventListener('change', updateCalculator);
  exposureInput.addEventListener('input', updateCalculator);
  disruptionInput.addEventListener('input', updateCalculator);
  qualityInput.addEventListener('input', updateCalculator);

  // Initial update
  updateCalculator();
}

function getCoralSpeciesData(species) {
  const data = {
    'acropora': { resilience: 85, resistance: 75, recovery: 80 },
    'porites': { resilience: 95, resistance: 90, recovery: 70 },
    'pocillopora': { resilience: 75, resistance: 70, recovery: 85 },
    'montipora': { resilience: 80, resistance: 80, recovery: 75 },
    'staghorn': { resilience: 70, resistance: 65, recovery: 90 },
    'brain': { resilience: 90, resistance: 85, recovery: 65 }
  };
  return data[species] || data['acropora'];
}

function getHealthStatus(percent) {
  if (percent > 75) return 'Excellent';
  if (percent > 50) return 'Good';
  if (percent > 25) return 'Fair';
  return 'Poor';
}

function getResistanceStatus(percent) {
  if (percent > 70) return 'Strong';
  if (percent > 40) return 'Moderate';
  if (percent > 20) return 'Weak';
  return 'Very Weak';
}

function getRecoveryStatus(percent) {
  if (percent > 75) return 'High';
  if (percent > 50) return 'Moderate';
  if (percent > 25) return 'Low';
  return 'Very Low';
}

function updateHealthRecommendations(exposure, disruption, quality) {
  const recommendations = [];

  if (exposure > 60) {
    recommendations.push('Immediate reduction of pollution exposure required');
  }
  if (disruption > 40) {
    recommendations.push('Consider microbiome restoration treatments');
  }
  if (quality < 60) {
    recommendations.push('Improve water quality through filtration systems');
  }
  if (exposure > 30) {
    recommendations.push('Monitor coral health weekly for disease signs');
  }
  if (recommendations.length === 0) {
    recommendations.push('Current conditions are favorable for coral health');
  }

  const listElement = document.getElementById('health-recommendations');
  listElement.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
}

function updateDiseaseRisks(health, species) {
  const baseRisks = {
    'acropora': { wbd: 60, bbd: 30, bleaching: 40 },
    'porites': { wbd: 20, bbd: 50, bleaching: 30 },
    'pocillopora': { wbd: 70, bbd: 25, bleaching: 50 },
    'montipora': { wbd: 40, bbd: 35, bleaching: 35 },
    'staghorn': { wbd: 80, bbd: 20, bleaching: 45 },
    'brain': { wbd: 25, bbd: 60, bleaching: 25 }
  };

  const speciesRisks = baseRisks[species] || baseRisks['acropora'];
  const healthFactor = (100 - health) / 100;

  // Update risk bars
  const diseases = [
    { id: 'wbd', name: 'White Band Disease', baseRisk: speciesRisks.wbd },
    { id: 'bbd', name: 'Black Band Disease', baseRisk: speciesRisks.bbd },
    { id: 'bleaching', name: 'Coral Bleaching', baseRisk: speciesRisks.bleaching }
  ];

  diseases.forEach(disease => {
    const risk = Math.min(100, disease.baseRisk + (healthFactor * 50));
    const bar = document.querySelector(`[data-disease="${disease.id}"] .risk-fill`);
    const value = document.querySelector(`[data-disease="${disease.id}"] .risk-value`);

    if (bar && value) {
      bar.style.width = risk + '%';
      value.textContent = Math.round(risk) + '%';

      // Update color based on risk level
      if (risk > 60) {
        bar.className = 'risk-fill high-risk';
      } else if (risk > 30) {
        bar.className = 'risk-fill medium-risk';
      } else {
        bar.className = 'risk-fill low-risk';
      }
    }
  });
}

// Microbiome Dynamics Analyzer
function initMicrobiomeAnalyzer() {
  const playPauseBtn = document.getElementById('play-pause');
  const timeSlider = document.getElementById('time-slider');
  const timeDisplay = document.getElementById('time-display');

  let isPlaying = false;
  let animationId;

  if (!playPauseBtn) return;

  function updateTimeDisplay() {
    const day = parseInt(timeSlider.value);
    timeDisplay.textContent = 'Day ' + day;
    updateDynamicsVisualization(day);
  }

  function togglePlayback() {
    isPlaying = !isPlaying;

    if (isPlaying) {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      startAnimation();
    } else {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Play';
      stopAnimation();
    }
  }

  function startAnimation() {
    let currentDay = parseInt(timeSlider.value);

    function animate() {
      currentDay += 1;
      if (currentDay > 365) currentDay = 0;

      timeSlider.value = currentDay;
      updateTimeDisplay();

      if (isPlaying) {
        animationId = setTimeout(animate, 100); // 100ms delay for smooth animation
      }
    }

    animate();
  }

  function stopAnimation() {
    if (animationId) {
      clearTimeout(animationId);
      animationId = null;
    }
  }

  // Event listeners
  playPauseBtn.addEventListener('click', togglePlayback);
  timeSlider.addEventListener('input', () => {
    stopAnimation();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Play';
    updateTimeDisplay();
  });

  // Initial update
  updateTimeDisplay();
}

function updateDynamicsVisualization(day) {
  // Update community structure chart
  updateCommunityStructure(day);

  // Update functional changes
  updateFunctionalChanges(day);
}

function updateCommunityStructure(day) {
  const canvas = document.getElementById('structure-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Simulate community change over time
  const pollutionIncrease = Math.sin(day / 365 * 2 * Math.PI) * 30 + 30; // Seasonal variation
  const beneficial = Math.max(10, 70 - pollutionIncrease * 0.5);
  const pathogens = Math.min(70, 5 + pollutionIncrease * 0.8);
  const opportunists = Math.min(50, 10 + pollutionIncrease * 0.3);
  const others = 100 - beneficial - pathogens - opportunists;

  // Draw bar chart
  const barWidth = width / 4 - 10;
  const data = [beneficial, pathogens, opportunists, others];
  const colors = ['#228B22', '#DC143C', '#FF8C00', '#9370DB'];
  const labels = ['Beneficial', 'Pathogens', 'Opportunists', 'Others'];

  data.forEach((value, index) => {
    const x = index * (barWidth + 10) + 5;
    const barHeight = (value / 100) * (height - 40);

    // Draw bar
    ctx.fillStyle = colors[index];
    ctx.fillRect(x, height - barHeight - 20, barWidth, barHeight);

    // Draw label
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(labels[index], x + barWidth / 2, height - 5);
    ctx.fillText(Math.round(value) + '%', x + barWidth / 2, height - barHeight - 25);
  });
}

function updateFunctionalChanges(day) {
  // Simulate functional changes over time
  const pollutionCycle = Math.sin(day / 365 * 2 * Math.PI) * 0.5 + 0.5;
  const pollutionLevel = pollutionCycle * 100;

  const functions = [
    { id: 'defense', base: 80, factor: -0.6 },
    { id: 'cycling', base: 70, factor: 0.3 },
    { id: 'stability', base: 85, factor: -0.8 },
    { id: 'antibiotics', base: 90, factor: -1.0 }
  ];

  functions.forEach(func => {
    const change = func.base + (func.factor * pollutionLevel);
    const percentage = Math.max(0, Math.min(100, change));
    const bar = document.querySelector(`[data-function="${func.id}"] .function-fill`);
    const value = document.querySelector(`[data-function="${func.id}"] .function-value`);

    if (bar && value) {
      bar.style.width = percentage + '%';

      const changeValue = func.factor * pollutionLevel;
      const sign = changeValue >= 0 ? '+' : '';
      value.textContent = sign + Math.round(changeValue) + '%';

      // Update color based on change
      if (changeValue < -20) {
        bar.className = 'function-fill negative';
      } else {
        bar.className = 'function-fill positive';
      }
    }
  });
}

// Modal Functionality
function initModals() {
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const modals = document.querySelectorAll('.modal');
  const modalCloses = document.querySelectorAll('.modal-close');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.dataset.modal + '-modal';
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloses.forEach(close => {
    close.addEventListener('click', () => {
      const modal = close.closest('.modal');
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

// Theme Toggle
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    }
  });
}

// Utility function for smooth animations
function animateValue(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = start + (end - start) * progress;
    element.textContent = Math.round(current) + '%';

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Export functions for potential external use
window.CoralMicrobiome = {
  updateMicrobiomeComposition,
  updateCommunityStructure,
  updateFunctionalChanges,
  updateDiseaseRisks
};