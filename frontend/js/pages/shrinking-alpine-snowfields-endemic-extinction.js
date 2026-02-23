// Shrinking Alpine Snowfields and Endemic Extinction - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initShrinkageSimulator();
  initTaxaCards();
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

// Snowfield Shrinkage Simulator
function initShrinkageSimulator() {
  const slider = document.getElementById('shrinkage-slider');
  const valueDisplay = document.getElementById('shrinkage-value');
  const rangeFill = document.getElementById('range-fill');
  const extinctionFill = document.getElementById('extinction-fill');
  const biodiversityFill = document.getElementById('biodiversity-fill');
  const rangeText = document.getElementById('range-text');
  const extinctionText = document.getElementById('extinction-text');
  const biodiversityText = document.getElementById('biodiversity-text');

  // Impact calculations based on shrinkage percentage
  const calculateImpacts = (percentage) => {
    // Range contraction: linear relationship
    const rangeContraction = Math.min(percentage * 1.2, 100);

    // Extinction risk: exponential increase
    const extinctionRisk = Math.min(Math.pow(percentage / 20, 2) * 25, 100);

    // Biodiversity loss: follows extinction risk with some lag
    const biodiversityLoss = Math.min(extinctionRisk * 0.8, 100);

    return { rangeContraction, extinctionRisk, biodiversityLoss };
  };

  // Get impact level and color
  const getImpactLevel = (percentage) => {
    if (percentage < 20) return { level: 'Low', color: '#4caf50' };
    if (percentage < 40) return { level: 'Moderate', color: '#ff9800' };
    if (percentage < 60) return { level: 'High', color: '#ff5722' };
    if (percentage < 80) return { level: 'Severe', color: '#f44336' };
    return { level: 'Critical', color: '#d32f2f' };
  };

  // Update display
  const updateDisplay = () => {
    const percentage = parseInt(slider.value);
    valueDisplay.textContent = percentage + '%';

    const impacts = calculateImpacts(percentage);

    // Update bars
    rangeFill.style.width = impacts.rangeContraction + '%';
    extinctionFill.style.width = impacts.extinctionRisk + '%';
    biodiversityFill.style.width = impacts.biodiversityLoss + '%';

    // Update colors based on severity
    const rangeLevel = getImpactLevel(impacts.rangeContraction);
    const extinctionLevel = getImpactLevel(impacts.extinctionRisk);
    const biodiversityLevel = getImpactLevel(impacts.biodiversityLoss);

    rangeFill.style.backgroundColor = rangeLevel.color;
    extinctionFill.style.backgroundColor = extinctionLevel.color;
    biodiversityFill.style.backgroundColor = biodiversityLevel.color;

    // Update text
    rangeText.textContent = Math.round(impacts.rangeContraction) + '% - ' + rangeLevel.level;
    extinctionText.textContent = Math.round(impacts.extinctionRisk) + '% - ' + extinctionLevel.level;
    biodiversityText.textContent = Math.round(impacts.biodiversityLoss) + '% - ' + biodiversityLevel.level;
  };

  // Event listener
  slider.addEventListener('input', updateDisplay);
  slider.addEventListener('change', updateDisplay);

  // Initial update
  updateDisplay();
}

// Taxa cards hover effects
function initTaxaCards() {
  const cards = document.querySelectorAll('.taxa-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
      this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
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

  // Add click effects to impact cards
  const impactCards = document.querySelectorAll('.impact-card');
  impactCards.forEach(card => {
    card.addEventListener('click', function() {
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