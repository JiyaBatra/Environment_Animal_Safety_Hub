// Urban Subterranean Heat Islands - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initTemperatureSimulator();
  initRootGrowthCalculator();
  initMicrobialAnalyzer();
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

// Temperature Impact Simulator
function initTemperatureSimulator() {
  const densitySlider = document.getElementById('infrastructure-density');
  const pipeTempSlider = document.getElementById('pipe-temperature');
  const depthSlider = document.getElementById('soil-depth');
  const seasonSelect = document.getElementById('season-select');

  const densityValue = document.getElementById('density-value');
  const pipeTempValue = document.getElementById('pipe-temp-value');
  const depthValue = document.getElementById('depth-value');

  const soilTemp = document.getElementById('soil-temp');
  const tempChange = document.getElementById('temp-change');
  const rootStress = document.getElementById('root-stress');
  const stressIndicator = document.getElementById('stress-indicator');
  const microbialActivity = document.getElementById('microbial-activity');
  const activityChange = document.getElementById('activity-change');

  if (!densitySlider) return;

  function updateSimulator() {
    const density = parseFloat(densitySlider.value);
    const pipeTemp = parseFloat(pipeTempSlider.value);
    const depth = parseFloat(depthSlider.value);
    const season = seasonSelect.value;

    // Update display values
    densityValue.textContent = density + '%';
    pipeTempValue.textContent = pipeTemp + '°C';
    depthValue.textContent = depth + 'm';

    // Calculate soil temperature impact
    const baseTemp = getSeasonalBaseTemp(season);
    const heatImpact = calculateHeatImpact(density, pipeTemp, depth);
    const finalTemp = baseTemp + heatImpact;

    // Update metrics
    soilTemp.textContent = finalTemp.toFixed(1) + '°C';
    tempChange.textContent = '+' + heatImpact.toFixed(1) + '°C vs natural';

    // Calculate root stress
    const stressLevel = calculateRootStress(finalTemp);
    rootStress.textContent = stressLevel.level;
    rootStress.style.color = stressLevel.color;
    stressIndicator.textContent = stressLevel.reduction + '% growth reduction';

    // Calculate microbial activity
    const microbialLevel = calculateMicrobialActivity(finalTemp);
    microbialActivity.textContent = microbialLevel.level;
    microbialActivity.style.color = microbialLevel.color;
    activityChange.textContent = microbialLevel.change + '% decline';

    // Update visualization
    updateTemperatureProfile(density, pipeTemp, depth, season);
  }

  // Event listeners
  densitySlider.addEventListener('input', updateSimulator);
  pipeTempSlider.addEventListener('input', updateSimulator);
  depthSlider.addEventListener('input', updateSimulator);
  seasonSelect.addEventListener('change', updateSimulator);

  // Initial update
  updateSimulator();
}

function getSeasonalBaseTemp(season) {
  const temps = {
    'summer': 25,
    'winter': 5,
    'spring': 15,
    'fall': 10
  };
  return temps[season] || 15;
}

function calculateHeatImpact(density, pipeTemp, depth) {
  // Simplified heat transfer model
  const conductivity = 0.5; // W/m·K (typical soil)
  const distance = Math.max(depth, 0.5);
  const densityFactor = density / 100;

  return (pipeTemp - 15) * densityFactor * Math.exp(-distance * 0.5);
}

function calculateRootStress(temp) {
  if (temp < 15) return { level: 'Low', color: '#228B22', reduction: 10 };
  if (temp < 25) return { level: 'Moderate', color: '#FF8C00', reduction: 25 };
  if (temp < 30) return { level: 'High', color: '#DC143C', reduction: 50 };
  return { level: 'Severe', color: '#8B0000', reduction: 75 };
}

function calculateMicrobialActivity(temp) {
  const optimalTemp = 25;
  const decline = Math.abs(temp - optimalTemp) * 2;
  const activity = Math.max(0, 100 - decline);

  if (activity > 70) return { level: 'High', color: '#228B22', change: (100 - activity).toFixed(0) };
  if (activity > 40) return { level: 'Moderate', color: '#FF8C00', change: (100 - activity).toFixed(0) };
  return { level: 'Low', color: '#DC143C', change: (100 - activity).toFixed(0) };
}

function updateTemperatureProfile(density, pipeTemp, depth, season) {
  const canvas = document.getElementById('temperature-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw temperature gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#DC143C'); // Hot at top (infrastructure)
  gradient.addColorStop(0.3, '#FF8C00'); // Warm
  gradient.addColorStop(0.7, '#228B22'); // Cool
  gradient.addColorStop(1, '#4682B4'); // Cold at bottom

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw heat plume
  const plumeWidth = Math.min(width * 0.8, density * 2);
  const plumeGradient = ctx.createRadialGradient(width/2, 20, 0, width/2, 20, plumeWidth);
  plumeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  plumeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = plumeGradient;
  ctx.beginPath();
  ctx.ellipse(width/2, 20, plumeWidth, plumeWidth * 0.3, 0, 0, 2 * Math.PI);
  ctx.fill();

  // Draw depth marker
  const depthY = (depth / 3) * height;
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, depthY);
  ctx.lineTo(width, depthY);
  ctx.stroke();

  // Depth label
  ctx.fillStyle = '#FFF';
  ctx.font = '12px Arial';
  ctx.fillText(`Analysis Depth: ${depth}m`, 10, depthY - 5);
}

// Root Growth Calculator
function initRootGrowthCalculator() {
  const plantSelect = document.getElementById('plant-species');
  const ambientTemp = document.getElementById('ambient-temp');
  const soilMoisture = document.getElementById('soil-moisture');
  const heatSourceDistance = document.getElementById('heat-source-distance');

  const rootLengthBar = document.getElementById('root-length-bar');
  const rootDensityBar = document.getElementById('root-density-bar');
  const mycorrhizalBar = document.getElementById('mycorrhizal-bar');

  const rootLengthValue = document.getElementById('root-length-value');
  const rootDensityValue = document.getElementById('root-density-value');
  const mycorrhizalValue = document.getElementById('mycorrhizal-value');

  const recommendationsList = document.getElementById('recommendations-list');

  if (!plantSelect) return;

  function updateCalculator() {
    const species = plantSelect.value;
    const temp = parseFloat(ambientTemp.value);
    const moisture = parseFloat(soilMoisture.value);
    const distance = parseFloat(heatSourceDistance.value);

    // Calculate heat impact
    const heatImpact = Math.max(0, 30 - temp) * (1 / Math.max(distance, 0.5));

    // Species-specific calculations
    const speciesData = getSpeciesData(species);
    const rootLength = Math.max(0, speciesData.maxRootLength * (1 - heatImpact * 0.02));
    const rootDensity = Math.max(0, 100 * (1 - heatImpact * 0.015));
    const mycorrhizal = Math.max(0, 100 * (1 - heatImpact * 0.025));

    // Update progress bars
    rootLengthBar.style.width = (rootLength / speciesData.maxRootLength * 100) + '%';
    rootDensityBar.style.width = rootDensity + '%';
    mycorrhizalBar.style.width = mycorrhizal + '%';

    // Update values
    rootLengthValue.textContent = Math.round(rootLength / speciesData.maxRootLength * 100) + '% of optimal';
    rootDensityValue.textContent = Math.round(rootDensity) + '% of optimal';
    mycorrhizalValue.textContent = Math.round(mycorrhizal) + '% of optimal';

    // Update recommendations
    updateRecommendations(heatImpact, distance, moisture);

    // Update growth chart
    updateGrowthChart(rootLength, rootDensity, mycorrhizal);
  }

  // Event listeners
  plantSelect.addEventListener('change', updateCalculator);
  ambientTemp.addEventListener('input', updateCalculator);
  soilMoisture.addEventListener('input', updateCalculator);
  heatSourceDistance.addEventListener('input', updateCalculator);

  // Initial update
  updateCalculator();
}

function getSpeciesData(species) {
  const data = {
    'oak': { maxRootLength: 500, name: 'Oak Tree' },
    'maple': { maxRootLength: 400, name: 'Maple Tree' },
    'pine': { maxRootLength: 300, name: 'Pine Tree' },
    'birch': { maxRootLength: 350, name: 'Birch Tree' },
    'grass': { maxRootLength: 50, name: 'Urban Grass' },
    'shrub': { maxRootLength: 100, name: 'Ornamental Shrub' }
  };
  return data[species] || data['oak'];
}

function updateRecommendations(heatImpact, distance, moisture) {
  const recommendations = [];

  if (heatImpact > 20) {
    recommendations.push('Consider thermal insulation around utility lines');
  }
  if (distance < 2) {
    recommendations.push('Implement soil cooling systems for valuable trees');
  }
  if (moisture < 40) {
    recommendations.push('Increase irrigation to mitigate heat stress');
  }
  if (heatImpact > 10) {
    recommendations.push('Select heat-tolerant plant species');
  }
  if (recommendations.length === 0) {
    recommendations.push('Current conditions are favorable for root growth');
  }

  const listElement = document.getElementById('recommendations-list');
  listElement.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
}

function updateGrowthChart(rootLength, rootDensity, mycorrhizal) {
  const canvas = document.getElementById('growth-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw background grid
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const y = (i / 10) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw growth curves
  const dataPoints = [
    { label: 'Root Length', value: rootLength / 500, color: '#DC143C' },
    { label: 'Root Density', value: rootDensity / 100, color: '#FF8C00' },
    { label: 'Mycorrhizal', value: mycorrhizal / 100, color: '#228B22' }
  ];

  dataPoints.forEach((point, index) => {
    const x = (index + 1) * (width / 4);
    const y = height - (point.value * height * 0.8);

    // Draw bar
    ctx.fillStyle = point.color;
    ctx.fillRect(x - 15, y, 30, height - y);

    // Draw label
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(point.label, x, height + 15);
  });
}

// Microbial Activity Analyzer
function initMicrobialAnalyzer() {
  // Initialize with default values
  updateMicrobeChart();
  updateActivityGauge(65);
}

function updateMicrobeChart() {
  const canvas = document.getElementById('microbe-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 20;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Microbial composition data (percentages affected by heat)
  const microbes = [
    { name: 'Bacteria', percentage: 35, color: '#FF6B6B' },
    { name: 'Fungi', percentage: 25, color: '#4ECDC4' },
    { name: 'Archaea', percentage: 20, color: '#45B7D1' },
    { name: 'Protozoa', percentage: 20, color: '#96CEB4' }
  ];

  let startAngle = -Math.PI / 2;

  microbes.forEach(microbe => {
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
    ctx.fillText(`${microbe.percentage}%`, labelX, labelY);

    startAngle += sliceAngle;
  });
}

function updateActivityGauge(percentage) {
  const canvas = document.getElementById('activity-gauge-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 10;
  ctx.stroke();

  // Draw activity arc
  const angle = (percentage / 100) * 2 * Math.PI - Math.PI / 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, angle);
  ctx.strokeStyle = percentage > 50 ? '#228B22' : percentage > 25 ? '#FF8C00' : '#DC143C';
  ctx.lineWidth = 10;
  ctx.stroke();

  // Update percentage display
  document.getElementById('activity-percentage').textContent = percentage + '%';
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
window.UrbanHeatIslands = {
  updateTemperatureProfile,
  updateGrowthChart,
  updateMicrobeChart,
  updateActivityGauge
};