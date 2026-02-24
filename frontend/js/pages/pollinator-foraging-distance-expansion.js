// Pollinator Foraging Distance Expansion - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initFragmentationSimulator();
  initEnergeticCalculator();
  initPopulationModel();
  initConnectivityAnalyzer();
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
  const sections = document.querySelectorAll('.overview-section, .interactive-section, .calculator-section, .model-section, .analyzer-section, .modals-section');
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Fragmentation Impact Simulator
function initFragmentationSimulator() {
  const slider = document.getElementById('fragmentation-slider');
  const valueDisplay = document.getElementById('fragmentation-value');
  const avgDistance = document.getElementById('avg-distance');
  const energyCost = document.getElementById('energy-cost');
  const populationImpact = document.getElementById('population-impact');
  const canvas = document.getElementById('landscape-canvas');

  if (!slider || !canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 400;

  function updateSimulator() {
    const fragmentation = parseInt(slider.value);
    valueDisplay.textContent = fragmentation + '%';

    // Update results based on fragmentation level
    const distance = 1.0 + (fragmentation / 100) * 2.0; // 1-3 km
    const energy = 25 + (fragmentation / 100) * 35; // 25-60%
    let impact = 'Low decline';

    if (fragmentation < 30) {
      impact = 'Low decline';
    } else if (fragmentation < 60) {
      impact = 'Moderate decline';
    } else {
      impact = 'Severe decline';
    }

    avgDistance.textContent = distance.toFixed(1) + ' km';
    energyCost.textContent = energy.toFixed(0) + '% increase';
    populationImpact.textContent = impact;

    // Draw landscape
    drawLandscape(ctx, fragmentation);
  }

  function drawLandscape(ctx, fragmentation) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw habitat patches
    const patchCount = Math.max(1, 10 - Math.floor(fragmentation / 10));
    const patchSize = Math.max(20, 60 - fragmentation);

    for (let i = 0; i < patchCount; i++) {
      const x = Math.random() * (canvas.width - patchSize);
      const y = Math.random() * (canvas.height - patchSize);

      ctx.fillStyle = '#228B22';
      ctx.fillRect(x, y, patchSize, patchSize);

      // Draw flowers
      for (let j = 0; j < 5; j++) {
        const fx = x + Math.random() * patchSize;
        const fy = y + Math.random() * patchSize;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw pollinators
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = '#FF69B4';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  slider.addEventListener('input', updateSimulator);
  updateSimulator(); // Initial draw
}

// Energetic Cost Calculator
function initEnergeticCalculator() {
  const speciesSelect = document.getElementById('species-select');
  const distanceInput = document.getElementById('distance-input');
  const calculateBtn = document.getElementById('calculate-btn');
  const flightEnergy = document.getElementById('flight-energy');
  const dailyBudget = document.getElementById('daily-budget');
  const percentageUsed = document.getElementById('percentage-used');
  const energyChartCanvas = document.getElementById('energy-chart');

  if (!calculateBtn || !energyChartCanvas) return;

  const ctx = energyChartCanvas.getContext('2d');

  // Species data (energy costs in Joules per km)
  const speciesData = {
    'bumblebee': { name: 'Bumblebee', costPerKm: 0.5, dailyBudget: 10 },
    'honeybee': { name: 'Honeybee', costPerKm: 0.3, dailyBudget: 8 },
    'solitary-bee': { name: 'Solitary Bee', costPerKm: 0.7, dailyBudget: 12 },
    'butterfly': { name: 'Butterfly', costPerKm: 0.4, dailyBudget: 6 },
    'hawk-moth': { name: 'Hawk Moth', costPerKm: 0.6, dailyBudget: 15 }
  };

  function calculateEnergy() {
    const species = speciesSelect.value;
    const distance = parseFloat(distanceInput.value);
    const data = speciesData[species];

    const energyUsed = data.costPerKm * distance;
    const percentage = (energyUsed / data.dailyBudget) * 100;

    flightEnergy.textContent = energyUsed.toFixed(1) + ' J';
    dailyBudget.textContent = data.dailyBudget + ' J';
    percentageUsed.textContent = percentage.toFixed(1) + '%';

    // Draw energy chart
    drawEnergyChart(ctx, energyUsed, data.dailyBudget);
  }

  function drawEnergyChart(ctx, used, total) {
    ctx.clearRect(0, 0, energyChartCanvas.width, energyChartCanvas.height);

    const centerX = energyChartCanvas.width / 2;
    const centerY = energyChartCanvas.height / 2;
    const radius = 60;

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e9ecef';
    ctx.fill();

    // Used energy arc
    const usedAngle = (used / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + usedAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#27ae60';
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Energy Used', centerX, centerY - 10);
    ctx.fillText(used.toFixed(1) + ' J', centerX, centerY + 10);
  }

  calculateBtn.addEventListener('click', calculateEnergy);
  speciesSelect.addEventListener('change', calculateEnergy);
  distanceInput.addEventListener('input', calculateEnergy);

  calculateEnergy(); // Initial calculation
}

// Population Dynamics Model
function initPopulationModel() {
  const habitatSizeSlider = document.getElementById('habitat-size');
  const isolationSlider = document.getElementById('isolation-distance');
  const nectarSlider = document.getElementById('nectar-availability');
  const habitatValue = document.getElementById('habitat-size-value');
  const isolationValue = document.getElementById('isolation-distance-value');
  const nectarValue = document.getElementById('nectar-availability-value');
  const populationChartCanvas = document.getElementById('population-chart');
  const insightsList = document.getElementById('insights-list');

  if (!populationChartCanvas) return;

  const ctx = populationChartCanvas.getContext('2d');

  function updateModel() {
    const habitatSize = parseFloat(habitatSizeSlider.value);
    const isolation = parseFloat(isolationSlider.value);
    const nectar = parseFloat(nectarSlider.value);

    habitatValue.textContent = habitatSize + ' ha';
    isolationValue.textContent = isolation + ' km';
    nectarValue.textContent = nectar + '%';

    // Calculate population trajectory
    const populationData = calculatePopulationDynamics(habitatSize, isolation, nectar);

    // Update insights
    updateInsights(habitatSize, isolation, nectar);

    // Draw population chart
    drawPopulationChart(ctx, populationData);
  }

  function calculatePopulationDynamics(habitatSize, isolation, nectar) {
    const data = [];
    let population = 100; // Starting population

    for (let year = 0; year <= 20; year++) {
      // Simple model: population affected by habitat size, isolation, and nectar
      const habitatFactor = Math.log(habitatSize + 1) / Math.log(11); // 0-1 scale
      const isolationFactor = Math.max(0, 1 - isolation / 5); // 0-1 scale
      const nectarFactor = nectar / 100; // 0-1 scale

      const growthRate = 0.05 * habitatFactor * isolationFactor * nectarFactor;
      const declineRate = 0.02 * (1 - habitatFactor) + 0.01 * isolation / 5;

      population *= (1 + growthRate - declineRate);
      population = Math.max(0, population);

      data.push({ year, population });
    }

    return data;
  }

  function updateInsights(habitatSize, isolation, nectar) {
    const insights = [];

    if (habitatSize < 5) {
      insights.push('Small habitat patches increase extinction risk');
    }
    if (isolation > 2) {
      insights.push('High isolation reduces population connectivity');
    }
    if (nectar < 30) {
      insights.push('Low nectar availability limits population growth');
    }
    if (habitatSize >= 5 && isolation <= 2 && nectar >= 50) {
      insights.push('Optimal conditions support stable populations');
    }

    insightsList.innerHTML = insights.map(insight => `<li>${insight}</li>`).join('');
  }

  function drawPopulationChart(ctx, data) {
    ctx.clearRect(0, 0, populationChartCanvas.width, populationChartCanvas.height);

    const width = populationChartCanvas.width;
    const height = populationChartCanvas.height;
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
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + (index / 20) * plotWidth;
      const y = height - padding - (point.population / 150) * plotHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#27ae60';
    data.forEach((point, index) => {
      if (index % 4 === 0) { // Every 4 years
        const x = padding + (index / 20) * plotWidth;
        const y = height - padding - (point.population / 150) * plotHeight;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  habitatSizeSlider.addEventListener('input', updateModel);
  isolationSlider.addEventListener('input', updateModel);
  nectarSlider.addEventListener('input', updateModel);

  updateModel(); // Initial update
}

// Habitat Connectivity Analyzer
function initConnectivityAnalyzer() {
  const drawBtn = document.getElementById('draw-patch-btn');
  const clearBtn = document.getElementById('clear-canvas-btn');
  const analyzeBtn = document.getElementById('analyze-connectivity-btn');
  const canvas = document.getElementById('connectivity-canvas');
  const connectivityIndex = document.getElementById('connectivity-index');
  const isolatedPatches = document.getElementById('isolated-patches');
  const priorityCorridors = document.getElementById('priority-corridors');
  const recommendationsList = document.getElementById('recommendations-list');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 400;

  let patches = [];
  let isDrawing = false;
  let currentPatch = null;

  // Clear canvas initially
  ctx.fillStyle = '#f0f8f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBtn.addEventListener('click', () => {
    isDrawing = !isDrawing;
    drawBtn.textContent = isDrawing ? 'Stop Drawing' : 'Draw Habitat Patch';
    canvas.style.cursor = isDrawing ? 'crosshair' : 'default';
  });

  clearBtn.addEventListener('click', () => {
    patches = [];
    ctx.fillStyle = '#f0f8f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateConnectivityResults(0, 0, 0);
  });

  analyzeBtn.addEventListener('click', analyzeConnectivity);

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);

  function startDrawing(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentPatch = { x, y, width: 0, height: 0 };
  }

  function draw(e) {
    if (!isDrawing || !currentPatch) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentPatch.width = x - currentPatch.x;
    currentPatch.height = y - currentPatch.y;

    redrawCanvas();
  }

  function stopDrawing() {
    if (!isDrawing || !currentPatch) return;

    if (Math.abs(currentPatch.width) > 10 && Math.abs(currentPatch.height) > 10) {
      patches.push({
        x: Math.min(currentPatch.x, currentPatch.x + currentPatch.width),
        y: Math.min(currentPatch.y, currentPatch.y + currentPatch.height),
        width: Math.abs(currentPatch.width),
        height: Math.abs(currentPatch.height)
      });
    }

    currentPatch = null;
    redrawCanvas();
  }

  function redrawCanvas() {
    ctx.fillStyle = '#f0f8f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw existing patches
    ctx.fillStyle = '#228B22';
    patches.forEach(patch => {
      ctx.fillRect(patch.x, patch.y, patch.width, patch.height);
    });

    // Draw current patch being drawn
    if (currentPatch) {
      ctx.strokeStyle = '#228B22';
      ctx.lineWidth = 2;
      ctx.strokeRect(currentPatch.x, currentPatch.y, currentPatch.width, currentPatch.height);
    }
  }

  function analyzeConnectivity() {
    if (patches.length === 0) {
      updateConnectivityResults(0, 0, 0);
      return;
    }

    // Simple connectivity analysis
    let totalArea = 0;
    let isolatedCount = 0;
    let connections = 0;

    patches.forEach(patch => {
      totalArea += patch.width * patch.height;
    });

    // Check for isolated patches (simple distance-based)
    patches.forEach((patch, index) => {
      let isIsolated = true;
      patches.forEach((otherPatch, otherIndex) => {
        if (index !== otherIndex) {
          const distance = Math.sqrt(
            Math.pow((patch.x + patch.width/2) - (otherPatch.x + otherPatch.width/2), 2) +
            Math.pow((patch.y + patch.height/2) - (otherPatch.y + otherPatch.height/2), 2)
          );
          if (distance < 100) { // Within 100px connection distance
            isIsolated = false;
            connections++;
          }
        }
      });
      if (isIsolated) isolatedCount++;
    });

    const connectivity = Math.max(0, 1 - isolatedCount / patches.length);
    const priorityCount = Math.floor(isolatedCount / 2);

    updateConnectivityResults(connectivity.toFixed(2), isolatedCount, priorityCount);
  }

  function updateConnectivityResults(connectivity, isolated, priority) {
    connectivityIndex.textContent = connectivity;
    isolatedPatches.textContent = isolated;
    priorityCorridors.textContent = priority;

    const recommendations = [];
    if (isolated > 0) {
      recommendations.push('Create wildlife corridors between isolated patches');
    }
    if (connectivity < 0.5) {
      recommendations.push('Plant pollinator-friendly hedgerows');
    }
    recommendations.push('Restore native vegetation in buffer zones');
    recommendations.push('Implement landscape connectivity planning');

    recommendationsList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
  }
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