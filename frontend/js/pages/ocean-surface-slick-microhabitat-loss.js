// Ocean Surface Slick Microhabitat Loss - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initSlickSimulator();
  initCommunityCards();
  initHoverEffects();
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
  const sections = document.querySelectorAll('.overview-section, .section');
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Slick Loss Impact Simulator
function initSlickSimulator() {
  const pollutionSlider = document.getElementById('pollution-slider');
  const climateSlider = document.getElementById('climate-slider');
  const pollutionValue = document.getElementById('pollution-value');
  const climateValue = document.getElementById('climate-value');
  const slickLayer = document.getElementById('slick-layer');
  const neustonIcons = document.getElementById('neuston-icons');
  const slickFill = document.getElementById('slick-fill');
  const diversityFill = document.getElementById('diversity-fill');
  const foodwebFill = document.getElementById('foodweb-fill');
  const slickText = document.getElementById('slick-text');
  const diversityText = document.getElementById('diversity-text');
  const foodwebText = document.getElementById('foodweb-text');

  // Impact calculation functions
  const getPollutionLevel = (value) => {
    if (value < 20) return 'Low';
    if (value < 40) return 'Moderate';
    if (value < 60) return 'High';
    if (value < 80) return 'Severe';
    return 'Critical';
  };

  const getClimateLevel = (value) => {
    if (value < 20) return 'Low';
    if (value < 40) return 'Moderate';
    if (value < 60) return 'High';
    if (value < 80) return 'Severe';
    return 'Critical';
  };

  const calculateImpacts = (pollution, climate) => {
    // Combined impact (pollution has stronger effect on slicks)
    const totalImpact = Math.min((pollution * 0.7 + climate * 0.3), 100);

    // Slick coverage: decreases with pollution and climate change
    const slickCoverage = Math.max(100 - totalImpact * 1.2, 0);

    // Neustonic diversity: affected by slick loss
    const diversityLoss = totalImpact * 0.8;
    const diversity = Math.max(100 - diversityLoss, 0);

    // Food web health: affected by both diversity and slick coverage
    const foodwebHealth = Math.max((slickCoverage + diversity) / 2, 0);

    return { slickCoverage, diversity, foodwebHealth };
  };

  const updateVisualization = () => {
    const pollution = parseInt(pollutionSlider.value);
    const climate = parseInt(climateSlider.value);

    // Update labels
    pollutionValue.textContent = getPollutionLevel(pollution);
    climateValue.textContent = getClimateLevel(climate);

    // Calculate impacts
    const impacts = calculateImpacts(pollution, climate);

    // Update slick layer opacity and height
    const slickOpacity = impacts.slickCoverage / 100;
    slickLayer.style.opacity = slickOpacity;
    slickLayer.style.height = (slickOpacity * 100) + '%';

    // Update neuston visibility
    const neustonOpacity = impacts.diversity / 100;
    neustonIcons.style.opacity = neustonOpacity;

    // Update metric bars
    animateProgress(slickFill, impacts.slickCoverage);
    animateProgress(diversityFill, impacts.diversity);
    animateProgress(foodwebFill, impacts.foodwebHealth);

    // Update metric text
    slickText.textContent = Math.round(impacts.slickCoverage) + '% remaining';
    diversityText.textContent = getDiversityLevel(impacts.diversity);
    foodwebText.textContent = getFoodwebLevel(impacts.foodwebHealth);
  };

  const getDiversityLevel = (value) => {
    if (value > 80) return 'High diversity';
    if (value > 60) return 'Moderate diversity';
    if (value > 40) return 'Low diversity';
    if (value > 20) return 'Very low diversity';
    return 'Critical loss';
  };

  const getFoodwebLevel = (value) => {
    if (value > 80) return 'Stable food web';
    if (value > 60) return 'Stressed food web';
    if (value > 40) return 'Disrupted food web';
    if (value > 20) return 'Severely disrupted';
    return 'Collapsed food web';
  };

  // Event listeners
  pollutionSlider.addEventListener('input', updateVisualization);
  climateSlider.addEventListener('change', updateVisualization);
  climateSlider.addEventListener('input', updateVisualization);

  // Initial update
  updateVisualization();
}

// Animate progress bar
function animateProgress(element, targetWidth) {
  element.style.width = '0%';
  setTimeout(() => {
    element.style.width = targetWidth + '%';
  }, 100);
}

// Community and mechanism cards hover effects
function initCommunityCards() {
  const cards = document.querySelectorAll('.community-card, .mechanism-card, .strategy-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
      this.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });
  });
}

// General hover effects
function initHoverEffects() {
  // Add hover effects to section headers
  const headers = document.querySelectorAll('h2, h3');
  headers.forEach(header => {
    header.addEventListener('mouseenter', function() {
      this.style.color = 'var(--primary-color)';
    });

    header.addEventListener('mouseleave', function() {
      this.style.color = '';
    });
  });

  // Add hover effects to sliders
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach(slider => {
    slider.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });

    slider.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // Add click effects to metrics
  const metrics = document.querySelectorAll('.metric');
  metrics.forEach(metric => {
    metric.addEventListener('click', function() {
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

// Scroll progress indicator
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  });
}