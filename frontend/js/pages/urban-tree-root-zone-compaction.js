// Urban Tree Root Zone Compaction - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initCompactionAssessment();
  initImpactCards();
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

// Compaction Impact Assessment
function initCompactionAssessment() {
  const levelOptions = document.querySelectorAll('.level-option');
  const oxygenFill = document.getElementById('oxygen-fill');
  const rootFill = document.getElementById('root-fill');
  const longevityFill = document.getElementById('longevity-fill');
  const oxygenText = document.getElementById('oxygen-text');
  const rootText = document.getElementById('root-text');
  const longevityText = document.getElementById('longevity-text');

  // Impact data for different compaction levels
  const impactData = {
    low: {
      oxygen: 90,
      root: 95,
      longevity: 95,
      oxygenText: "Excellent oxygen levels",
      rootText: "Optimal root development",
      longevityText: "Full lifespan expected"
    },
    moderate: {
      oxygen: 70,
      root: 75,
      longevity: 80,
      oxygenText: "Reduced oxygen availability",
      rootText: "Limited root growth",
      longevityText: "Moderate lifespan reduction"
    },
    high: {
      oxygen: 40,
      root: 50,
      longevity: 60,
      oxygenText: "Severe oxygen limitation",
      rootText: "Significantly restricted growth",
      longevityText: "Major lifespan reduction"
    },
    severe: {
      oxygen: 15,
      root: 25,
      longevity: 30,
      oxygenText: "Critical oxygen deficiency",
      rootText: "Extreme growth inhibition",
      longevityText: "Severely reduced longevity"
    }
  };

  // Handle level selection
  levelOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove selected class from all options
      levelOptions.forEach(opt => opt.classList.remove('selected'));
      // Add selected class to clicked option
      this.classList.add('selected');

      const level = this.dataset.level;
      const data = impactData[level];

      // Update progress bars with animation
      animateProgress(oxygenFill, data.oxygen);
      animateProgress(rootFill, data.root);
      animateProgress(longevityFill, data.longevity);

      // Update text
      oxygenText.textContent = data.oxygenText;
      rootText.textContent = data.rootText;
      longevityText.textContent = data.longevityText;
    });
  });

  // Set default selection
  levelOptions[0].click();
}

// Animate progress bar
function animateProgress(element, targetWidth) {
  element.style.width = '0%';
  setTimeout(() => {
    element.style.width = targetWidth + '%';
  }, 100);
}

// Impact and strategy cards hover effects
function initImpactCards() {
  const cards = document.querySelectorAll('.impact-card, .strategy-card');

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

  // Add hover effects to level options
  const levelOptions = document.querySelectorAll('.level-option');
  levelOptions.forEach(option => {
    option.addEventListener('mouseenter', function() {
      if (!this.classList.contains('selected')) {
        this.style.borderColor = 'var(--secondary-color)';
      }
    });

    option.addEventListener('mouseleave', function() {
      if (!this.classList.contains('selected')) {
        this.style.borderColor = 'transparent';
      }
    });
  });

  // Add click effects to result cards
  const resultCards = document.querySelectorAll('.result-card');
  resultCards.forEach(card => {
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