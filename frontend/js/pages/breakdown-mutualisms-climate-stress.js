// Breakdown of Mutualisms Under Climate Stress - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initMutualismCards();
  initDriverCards();
  initSolutionCards();
  initCaseStudyCards();
  initHoverEffects();
  initStressMeter();
  initMutualismScene();
  initStatCounters();
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

// Interactive mutualism cards
function initMutualismCards() {
  const mutualismCards = document.querySelectorAll('.mutualism-card');

  mutualismCards.forEach((card, index) => {
    // Add click to expand functionality
    card.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });

    // Add staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Interactive driver cards
function initDriverCards() {
  const driverCards = document.querySelectorAll('.driver-card');

  driverCards.forEach((card, index) => {
    // Add click to expand functionality
    card.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });

    // Add staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Interactive solution cards
function initSolutionCards() {
  const solutionCards = document.querySelectorAll('.solution-card');

  solutionCards.forEach((card, index) => {
    // Add click to expand functionality
    card.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });

    // Add staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Interactive case study cards
function initCaseStudyCards() {
  const caseStudyCards = document.querySelectorAll('.case-study-card');

  caseStudyCards.forEach((card, index) => {
    // Add click to expand functionality
    card.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });

    // Add staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Hover effects for better interactivity
function initHoverEffects() {
  const cards = document.querySelectorAll('.mutualism-card, .driver-card, .solution-card, .case-study-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
      this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
    });
  });
}

// Stress meter animation
function initStressMeter() {
  const meterFill = document.querySelector('.meter-fill');
  const meterValue = document.querySelector('.meter-value');

  if (meterFill && meterValue) {
    // Animate meter fill on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate to 65% fill (representing current mutualism breakdown level)
          setTimeout(() => {
            meterFill.style.width = '65%';
            animateCounter(meterValue, 0, 65, 2000);
          }, 500);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(meterFill.parentElement);
  }
}

// Mutualism scene animations
function initMutualismScene() {
  const pollinators = document.querySelector('.pollinators');
  const climateStress = document.querySelector('.climate-stress');
  const fungiNetwork = document.querySelector('.fungi-network');

  if (pollinators) {
    // Enhanced pollinator movement
    setInterval(() => {
      const randomY = Math.random() * 20 - 10;
      pollinators.style.transform = `translate(${Math.random() * 60 - 30}px, ${randomY}px) rotate(${Math.random() * 20 - 10}deg)`;
    }, 4000);
  }

  if (climateStress) {
    // Dynamic heat wave effect
    setInterval(() => {
      const intensity = 0.6 + Math.random() * 0.4;
      climateStress.style.opacity = intensity;
      climateStress.style.transform = `scale(${1 + Math.random() * 0.3}) rotate(${Math.random() * 10 - 5}deg)`;
    }, 2500);
  }

  if (fungiNetwork) {
    // Subtle fungi network animation
    setInterval(() => {
      fungiNetwork.style.backgroundPosition = `${Math.random() * 20 - 10}px 0, 0 ${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px -${Math.random() * 10}px, -${Math.random() * 10}px 0px`;
    }, 6000);
  }
}

// Animated counters for statistics
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target;
        const text = statNumber.textContent;
        const unit = text.replace(/[0-9]/g, '');
        const targetValue = parseInt(text.replace(/[^0-9]/g, ''));
        animateCounter(statNumber, 0, targetValue, 2000, unit);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

// Counter animation function
function animateCounter(element, start, end, duration, unit = '') {
  const startTime = performance.now();
  const endTime = startTime + duration;

  function updateCounter(currentTime) {
    if (currentTime < endTime) {
      const progress = (currentTime - startTime) / duration;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const currentValue = Math.floor(start + (end - start) * easeProgress);

      element.textContent = currentValue + unit;

      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = end + unit;
    }
  }

  requestAnimationFrame(updateCounter);
}

// Add CSS for expanded state and animations
const style = document.createElement('style');
style.textContent = `
  .mutualism-card.expanded,
  .driver-card.expanded,
  .solution-card.expanded,
  .case-study-card.expanded {
    transform: scale(1.05);
    z-index: 10;
  }

  .mutualism-card.expanded ul,
  .driver-card.expanded ul,
  .solution-card.expanded ul,
  .case-study-card.expanded p {
    max-height: none;
    overflow: visible;
  }

  .animate-in {
    animation: slideInUp 0.6s ease-out forwards;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .highlight-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .stress-meter:hover .meter-fill {
    background: linear-gradient(90deg, #32cd32 0%, #ff8c00 50%, #dc143c 100%);
  }

  .mutualism-scene {
    animation: sceneGlow 5s ease-in-out infinite alternate;
  }

  @keyframes sceneGlow {
    from { filter: brightness(1) contrast(1); }
    to { filter: brightness(1.1) contrast(1.05); }
  }

  .plant-system {
    animation: plantPulse 4s ease-in-out infinite alternate;
  }

  @keyframes plantPulse {
    from { filter: hue-rotate(0deg); }
    to { filter: hue-rotate(10deg); }
  }

  .climate-stress {
    animation: stressPulse 2s ease-in-out infinite;
  }

  @keyframes stressPulse {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
    50% { transform: scale(1.1) rotate(2deg); opacity: 0.9; }
  }
`;
document.head.appendChild(style);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add loading animation for images (if any in future)
function initImageLoading() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Initialize image loading
initImageLoading();

// Mutualism phenology simulation (conceptual)
function initPhenologySimulation() {
  // This could be expanded with canvas for phenology timing visualization
  console.log('Phenology simulation initialized');
}

// Initialize phenology simulation
initPhenologySimulation();