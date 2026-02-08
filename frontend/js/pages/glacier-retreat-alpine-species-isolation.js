// Glacier Retreat and Alpine Species Isolation - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initEvidenceCards();
  initMechanismCards();
  initImplicationCards();
  initStrategyCards();
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

// Interactive evidence cards
function initEvidenceCards() {
  const evidenceCards = document.querySelectorAll('.evidence-card');

  evidenceCards.forEach((card, index) => {
    // Add click to expand functionality
    card.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });

    // Add staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;
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

// Interactive implication cards
function initImplicationCards() {
  const implicationCards = document.querySelectorAll('.implication-card');

  implicationCards.forEach((card, index) => {
    // Add click to expand functionality
    card.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });

    // Add staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Interactive strategy cards
function initStrategyCards() {
  const strategyCards = document.querySelectorAll('.strategy-card');

  strategyCards.forEach((card, index) => {
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
  const cards = document.querySelectorAll('.evidence-card, .mechanism-card, .implication-card, .strategy-card');

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

// Add CSS for expanded state
const style = document.createElement('style');
style.textContent = `
  .evidence-card.expanded,
  .mechanism-card.expanded,
  .implication-card.expanded,
  .strategy-card.expanded {
    transform: scale(1.05);
    z-index: 10;
  }

  .evidence-card.expanded p,
  .mechanism-card.expanded p,
  .implication-card.expanded p,
  .strategy-card.expanded p {
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
`;
document.head.appendChild(style);

// Smooth scrolling for anchor links (if any)
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

// Add interactive glacier retreat visualization (conceptual)
function initGlacierVisualization() {
  // This could be expanded with canvas or SVG for glacier retreat animation
  console.log('Glacier visualization initialized');
}

// Initialize glacier visualization
initGlacierVisualization();