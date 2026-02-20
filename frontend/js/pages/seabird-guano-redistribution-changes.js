// Seabird Guano Redistribution Changes - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initNestingSimulator();
  initNutrientCalculator();
  initEcosystemModel();
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
  const sections = document.querySelectorAll('.overview-section, .interactive-section, .calculator-section, .analyzer-section, .case-studies-section, .modals-section');
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

// Nesting Site Shift Simulator
function initNestingSimulator() {
  const populationSlider = document.getElementById('population-change');
  const shiftSlider = document.getElementById('nesting-shift');
  const speciesSelect = document.getElementById('species-select');
  const timeSelect = document.getElementById('time-period');

  const populationValue = document.getElementById('population-value');
  const shiftValue = document.getElementById('shift-value');

  const nitrogenTotal = document.getElementById('nitrogen-total');
  const nitrogenChange = document.getElementById('nitrogen-change');
  const phosphorusTotal = document.getElementById('phosphorus-total');
  const phosphorusChange = document.getElementById('phosphorus-change');
  const vegetationImpact = document.getElementById('vegetation-impact');
  const vegetationChange = document.getElementById('vegetation-change');

  if (!populationSlider) return;

  function updateSimulator() {
    const populationChange = parseFloat(populationSlider.value);
    const shiftDistance = parseFloat(shiftSlider.value);
    const species = speciesSelect.value;
    const timePeriod = timeSelect.value;

    // Update display values
    populationValue.textContent = populationChange + '%';
    shiftValue.textContent = shiftDistance + ' km';

    // Calculate nutrient impacts
    const speciesData = getSpeciesData(species);
    const timeMultiplier = getTimeMultiplier(timePeriod);

    const baseNitrogen = speciesData.baseNitrogen * timeMultiplier;
    const basePhosphorus = speciesData.basePhosphorus * timeMultiplier;

    const populationFactor = 1 + (populationChange / 100);
    const shiftFactor = Math.max(0.1, 1 - Math.abs(shiftDistance) * 0.02);

    const finalNitrogen = baseNitrogen * populationFactor * shiftFactor;
    const finalPhosphorus = basePhosphorus * populationFactor * shiftFactor;

    const nitrogenPercentChange = ((finalNitrogen - baseNitrogen) / baseNitrogen * 100);
    const phosphorusPercentChange = ((finalPhosphorus - basePhosphorus) / basePhosphorus * 100);

    // Update metrics
    nitrogenTotal.textContent = finalNitrogen.toFixed(0) + ' kg/ha';
    nitrogenChange.textContent = (nitrogenPercentChange >= 0 ? '+' : '') + nitrogenPercentChange.toFixed(0) + '% vs baseline';

    phosphorusTotal.textContent = finalPhosphorus.toFixed(0) + ' kg/ha';
    phosphorusChange.textContent = (phosphorusPercentChange >= 0 ? '+' : '') + phosphorusPercentChange.toFixed(0) + '% vs baseline';

    // Determine vegetation impact
    const totalChange = Math.abs(nitrogenPercentChange) + Math.abs(phosphorusPercentChange);
    if (totalChange < 20) {
      vegetationImpact.textContent = 'Stable';
      vegetationImpact.style.color = '#228B22';
      vegetationChange.textContent = 'Minimal change in vegetation';
    } else if (totalChange < 50) {
      vegetationImpact.textContent = 'Moderate';
      vegetationImpact.style.color = '#FF8C00';
      vegetationChange.textContent = 'Noticeable vegetation shifts';
    } else {
      vegetationImpact.textContent = 'Severe';
      vegetationImpact.style.color = '#DC143C';
      vegetationChange.textContent = 'Major ecosystem disruption';
    }

    // Update visualization
    updateIslandMap(populationChange, shiftDistance, species);
  }

  // Event listeners
  populationSlider.addEventListener('input', updateSimulator);
  shiftSlider.addEventListener('input', updateSimulator);
  speciesSelect.addEventListener('change', updateSimulator);
  timeSelect.addEventListener('change', updateSimulator);

  // Initial update
  updateSimulator();
}

function getSpeciesData(species) {
  const data = {
    'albatross': { baseNitrogen: 1250, basePhosphorus: 180 },
    'penguin': { baseNitrogen: 980, basePhosphorus: 140 },
    'tern': { baseNitrogen: 750, basePhosphorus: 110 },
    'booby': { baseNitrogen: 890, basePhosphorus: 130 },
    'petrel': { baseNitrogen: 650, basePhosphorus: 95 }
  };
  return data[species] || data['albatross'];
}

function getTimeMultiplier(timePeriod) {
  const multipliers = {
    'current': 1.0,
    '2050': 0.85,
    '2100': 0.7
  };
  return multipliers[timePeriod] || 1.0;
}

function updateIslandMap(populationChange, shiftDistance, species) {
  const canvas = document.getElementById('island-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw island base (simplified oval)
  ctx.fillStyle = '#F4A460';
  ctx.beginPath();
  ctx.ellipse(width/2, height/2, width * 0.4, height * 0.3, 0, 0, 2 * Math.PI);
  ctx.fill();

  // Calculate nutrient zones based on parameters
  const populationFactor = Math.max(0, 1 + populationChange / 100);
  const shiftFactor = Math.abs(shiftDistance) / 50; // Normalize shift

  // Create nutrient gradient
  const nutrientZones = [
    { x: width * 0.3, y: height * 0.4, radius: 40 * populationFactor, intensity: Math.max(0.1, 1 - shiftFactor) },
    { x: width * 0.7, y: height * 0.6, radius: 35 * populationFactor, intensity: Math.max(0.1, 1 - shiftFactor * 0.8) },
    { x: width * 0.5, y: height * 0.3, radius: 30 * populationFactor, intensity: Math.max(0.1, 1 - shiftFactor * 1.2) }
  ];

  // Draw nutrient zones
  nutrientZones.forEach(zone => {
    const gradient = ctx.createRadialGradient(zone.x, zone.y, 0, zone.x, zone.y, zone.radius);
    const intensity = zone.intensity;

    if (intensity > 0.7) {
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 165, 0, 0.3)');
    } else if (intensity > 0.4) {
      gradient.addColorStop(0, 'rgba(144, 238, 144, 0.8)');
      gradient.addColorStop(1, 'rgba(50, 205, 50, 0.3)');
    } else if (intensity > 0.2) {
      gradient.addColorStop(0, 'rgba(240, 230, 140, 0.8)');
      gradient.addColorStop(1, 'rgba(218, 165, 32, 0.3)');
    } else {
      gradient.addColorStop(0, 'rgba(211, 211, 211, 0.8)');
      gradient.addColorStop(1, 'rgba(169, 169, 169, 0.3)');
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Draw seabird icons
  ctx.fillStyle = '#2E8B57';
  ctx.font = '20px Arial';
  nutrientZones.forEach((zone, index) => {
    if (zone.intensity > 0.3) {
      ctx.fillText('🐦', zone.x - 10, zone.y + 5);
    }
  });
}

// Nutrient Cycle Impact Calculator
function initNutrientCalculator() {
  const islandSize = document.getElementById('island-size');
  const soilType = document.getElementById('soil-type');
  const rainfall = document.getElementById('rainfall');
  const breedingPairs = document.getElementById('breeding-pairs');
  const breedingSeason = document.getElementById('breeding-season');
  const guanoEfficiency = document.getElementById('guano-efficiency');

  const nitrogenBar = document.getElementById('nitrogen-bar');
  const phosphorusBar = document.getElementById('phosphorus-bar');
  const productivityBar = document.getElementById('productivity-bar');

  const nitrogenLevel = document.getElementById('nitrogen-level');
  const phosphorusLevel = document.getElementById('phosphorus-level');
  const productivityLevel = document.getElementById('productivity-level');

  const impactsList = document.getElementById('impacts-list');

  if (!islandSize) return;

  function updateCalculator() {
    const size = parseFloat(islandSize.value);
    const soil = soilType.value;
    const rain = parseFloat(rainfall.value);
    const pairs = parseFloat(breedingPairs.value);
    const season = parseFloat(breedingSeason.value);
    const efficiency = parseFloat(guanoEfficiency.value) / 100;

    // Calculate nutrient inputs
    const soilData = getSoilData(soil);
    const rainfallFactor = Math.min(2, rain / 1000); // Normalize rainfall effect

    const annualGuano = pairs * season * 0.5 * efficiency; // kg per breeding pair per season
    const nitrogenInput = annualGuano * 0.16; // 16% nitrogen in guano
    const phosphorusInput = annualGuano * 0.023; // 2.3% phosphorus in guano

    // Calculate soil retention and availability
    const nitrogenRetention = soilData.nitrogenRetention * rainfallFactor;
    const phosphorusRetention = soilData.phosphorusRetention * rainfallFactor;

    const availableNitrogen = (nitrogenInput / size) * nitrogenRetention;
    const availablePhosphorus = (phosphorusInput / size) * phosphorusRetention;

    // Calculate productivity (simplified model)
    const nitrogenLimit = Math.min(100, (availableNitrogen / 50) * 100);
    const phosphorusLimit = Math.min(100, (availablePhosphorus / 7) * 100);
    const productivity = Math.min(nitrogenLimit, phosphorusLimit);

    // Update progress bars
    nitrogenBar.style.width = Math.min(100, (availableNitrogen / 100) * 100) + '%';
    phosphorusBar.style.width = Math.min(100, (availablePhosphorus / 15) * 100) + '%';
    productivityBar.style.width = productivity + '%';

    // Update levels
    nitrogenLevel.textContent = Math.round(Math.min(100, (availableNitrogen / 100) * 100)) + '% of optimal';
    phosphorusLevel.textContent = Math.round(Math.min(100, (availablePhosphorus / 15) * 100)) + '% of optimal';
    productivityLevel.textContent = Math.round(productivity) + '% of potential';

    // Update impacts
    updateImpacts(availableNitrogen, availablePhosphorus, productivity);

    // Update cycle chart
    updateCycleChart(availableNitrogen, availablePhosphorus, productivity);
  }

  // Event listeners
  [islandSize, rainfall, breedingPairs, breedingSeason, guanoEfficiency].forEach(input => {
    input.addEventListener('input', updateCalculator);
  });
  soilType.addEventListener('change', updateCalculator);

  // Initial update
  updateCalculator();
}

function getSoilData(soil) {
  const data = {
    'sandy': { nitrogenRetention: 0.6, phosphorusRetention: 0.7 },
    'clay': { nitrogenRetention: 0.8, phosphorusRetention: 0.9 },
    'loam': { nitrogenRetention: 0.9, phosphorusRetention: 0.8 },
    'volcanic': { nitrogenRetention: 0.85, phosphorusRetention: 0.75 }
  };
  return data[soil] || data['loam'];
}

function updateImpacts(nitrogen, phosphorus, productivity) {
  const impacts = [];

  if (nitrogen < 30) {
    impacts.push('Reduced vegetation cover in former nesting areas');
  }
  if (phosphorus < 5) {
    impacts.push('Increased soil erosion and nutrient leaching');
  }
  if (productivity < 60) {
    impacts.push('Changes in plant species composition');
  }
  if (nitrogen < 20 || phosphorus < 3) {
    impacts.push('Impacts on dependent wildlife populations');
  }
  if (impacts.length === 0) {
    impacts.push('Ecosystem maintaining nutrient balance');
  }

  const listElement = document.getElementById('impacts-list');
  listElement.innerHTML = impacts.map(impact => `<li>${impact}</li>`).join('');
}

function updateCycleChart(nitrogen, phosphorus, productivity) {
  const canvas = document.getElementById('cycle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw cycle diagram
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.3;

  // Draw nutrient cycle rings
  const nutrients = [
    { name: 'Nitrogen', value: Math.min(100, nitrogen / 2), color: '#FFD700' },
    { name: 'Phosphorus', value: Math.min(100, phosphorus * 6), color: '#FFA500' },
    { name: 'Productivity', value: productivity, color: '#32CD32' }
  ];

  nutrients.forEach((nutrient, index) => {
    const angle = (index * 2 * Math.PI) / nutrients.length - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius * 0.5;
    const y = centerY + Math.sin(angle) * radius * 0.5;

    // Draw arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (0.3 + index * 0.2), angle - 0.3, angle + 0.3);
    ctx.strokeStyle = nutrient.color;
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw value indicator
    const valueRadius = radius * (0.3 + index * 0.2) * (nutrient.value / 100);
    ctx.beginPath();
    ctx.arc(centerX, centerY, valueRadius, angle - 0.3, angle + 0.3);
    ctx.strokeStyle = nutrient.color;
    ctx.lineWidth = 12;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${nutrient.name}: ${Math.round(nutrient.value)}%`, x, y + 40);
  });
}

// Island Ecosystem Model
function initEcosystemModel() {
  // Initialize component statuses
  updateComponentStatuses(0, 0);

  // Set up component click handlers
  const components = document.querySelectorAll('.component-card');
  components.forEach(component => {
    component.addEventListener('click', () => {
      const componentType = component.dataset.component;
      showComponentDetails(componentType);
    });
  });

  // Initialize network visualization
  updateNetworkVisualization();
}

function updateComponentStatuses(nitrogenChange, phosphorusChange) {
  const components = ['vegetation', 'soil', 'invertebrates', 'birds'];

  components.forEach(component => {
    const statusElement = document.getElementById(`${component}-status`);
    const totalChange = Math.abs(nitrogenChange) + Math.abs(phosphorusChange);

    if (totalChange < 30) {
      statusElement.textContent = 'Stable';
      statusElement.className = 'component-status';
    } else if (totalChange < 70) {
      statusElement.textContent = 'Stressed';
      statusElement.className = 'component-status stressed';
    } else {
      statusElement.textContent = 'Critical';
      statusElement.className = 'component-status critical';
    }
  });
}

function showComponentDetails(componentType) {
  const details = {
    vegetation: 'Plant growth directly depends on nutrient availability. Reduced guano inputs lead to lower biomass and changes in species composition.',
    soil: 'Soil microbes drive nutrient cycling. Changes in nutrient inputs alter microbial community structure and decomposition rates.',
    invertebrates: 'Decomposers and pollinators depend on plant productivity. Nutrient limitation cascades through invertebrate populations.',
    birds: 'Land birds rely on vegetation for food and habitat. Seabird population changes indirectly affect terrestrial bird communities.'
  };

  alert(`${componentType.charAt(0).toUpperCase() + componentType.slice(1)}: ${details[componentType]}`);
}

function updateNetworkVisualization() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Define nodes
  const nodes = [
    { x: width * 0.2, y: height * 0.3, label: 'Seabirds', color: '#2E8B57' },
    { x: width * 0.8, y: height * 0.3, label: 'Guano', color: '#DAA520' },
    { x: width * 0.5, y: height * 0.5, label: 'Soil', color: '#8B4513' },
    { x: width * 0.3, y: height * 0.7, label: 'Plants', color: '#228B22' },
    { x: width * 0.7, y: height * 0.7, label: 'Animals', color: '#4682B4' }
  ];

  // Draw connections
  const connections = [
    [0, 1, 'strong'], // Seabirds -> Guano
    [1, 2, 'strong'], // Guano -> Soil
    [2, 3, 'moderate'], // Soil -> Plants
    [3, 4, 'moderate'], // Plants -> Animals
    [4, 0, 'weak'] // Animals -> Seabirds (feedback)
  ];

  connections.forEach(([from, to, strength]) => {
    const fromNode = nodes[from];
    const toNode = nodes[to];

    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);

    switch (strength) {
      case 'strong':
        ctx.strokeStyle = '#2E8B57';
        ctx.lineWidth = 4;
        break;
      case 'moderate':
        ctx.strokeStyle = '#FF8C00';
        ctx.lineWidth = 3;
        break;
      case 'weak':
        ctx.strokeStyle = '#A9A9A9';
        ctx.lineWidth = 2;
        break;
    }
    ctx.stroke();

    // Arrow head
    const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
    const arrowLength = 10;
    ctx.beginPath();
    ctx.moveTo(toNode.x, toNode.y);
    ctx.lineTo(
      toNode.x - arrowLength * Math.cos(angle - Math.PI / 6),
      toNode.y - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toNode.x, toNode.y);
    ctx.lineTo(
      toNode.x - arrowLength * Math.cos(angle + Math.PI / 6),
      toNode.y - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  });

  // Draw nodes
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(node.label, node.x, node.y + 3);
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
window.SeabirdGuano = {
  updateIslandMap,
  updateCycleChart,
  updateNetworkVisualization
};