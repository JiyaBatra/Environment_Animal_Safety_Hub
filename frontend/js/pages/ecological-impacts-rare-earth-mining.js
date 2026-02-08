// Ecological Impacts of Rare Earth Mining - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initMechanismCards();
  initImpactCards();
  initSolutionCards();
  initCaseStudyCards();
  initHoverEffects();
  initImpactMeter();
  initMiningScene();
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

// Interactive mechanism cards
function initMechanismCards() {
  const mechanismCards = document.querySelectorAll('.mechanism-card');

  mechanismCards.forEach((card, index) => {
    // Add click to expand functionality
    card.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });

    // Add staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Interactive impact cards
function initImpactCards() {
  const impactCards = document.querySelectorAll('.impact-card');

  impactCards.forEach((card, index) => {
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
  const cards = document.querySelectorAll('.mechanism-card, .impact-card, .solution-card, .case-study-card');

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

// Impact meter animation
function initImpactMeter() {
  const meterFill = document.querySelector('.meter-fill');
  const meterValue = document.querySelector('.meter-value');

  if (meterFill && meterValue) {
    // Animate meter fill on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate to 85% fill (representing current ecosystem impact)
          setTimeout(() => {
            meterFill.style.width = '85%';
            animateCounter(meterValue, 0, 85, 2000);
          }, 500);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(meterFill.parentElement);
  }
}

// Mining scene animations
function initMiningScene() {
  const toxicCloud = document.querySelector('.toxic-cloud');
  const wastePiles = document.querySelector('.waste-piles');

  if (toxicCloud) {
    // Add more dynamic toxic cloud movement
    setInterval(() => {
      const randomX = Math.random() * 20 - 10;
      const randomY = Math.random() * 10 - 5;
      toxicCloud.style.transform = `translate(${randomX}px, ${randomY}px) scale(${1 + Math.random() * 0.2})`;
    }, 3000);
  }

  if (wastePiles) {
    // Add subtle waste pile animation
    setInterval(() => {
      wastePiles.style.backgroundPosition = `${Math.random() * 10}px 0, 0 ${Math.random() * 5}px, ${Math.random() * 5}px -${Math.random() * 5}px, -${Math.random() * 5}px 0px`;
    }, 5000);
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
  .mechanism-card.expanded,
  .impact-card.expanded,
  .solution-card.expanded,
  .case-study-card.expanded {
    transform: scale(1.05);
    z-index: 10;
  }

  .mechanism-card.expanded ul,
  .impact-card.expanded ul,
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

  .impact-meter:hover .meter-fill {
    background: linear-gradient(90deg, #e74c3c 0%, #f39c12 30%, #f1c40f 60%, #27ae60 100%);
  }

  .mining-scene {
    animation: scenePulse 4s ease-in-out infinite alternate;
  }

  @keyframes scenePulse {
    from { filter: brightness(1); }
    to { filter: brightness(1.1); }
  }

  .mine-pit {
    animation: pitGlow 3s ease-in-out infinite alternate;
  }

  @keyframes pitGlow {
    from { box-shadow: 0 0 20px rgba(139, 69, 19, 0.3); }
    to { box-shadow: 0 0 30px rgba(139, 69, 19, 0.6); }
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

// Mining pollution simulation (conceptual)
function initMiningPollution() {
  // This could be expanded with canvas for pollution spread animation
  console.log('Mining pollution simulation initialized');
}

// Initialize mining pollution
initMiningPollution();