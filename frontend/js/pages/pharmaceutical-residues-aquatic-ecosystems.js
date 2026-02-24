// Pharmaceutical Residues in Aquatic Ecosystems - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initEffectCards();
  initImplicationCards();
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

// Interactive effect cards
function initEffectCards() {
  const effectCards = document.querySelectorAll('.effect-card');

  effectCards.forEach((card, index) => {
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

// Hover effects for better interactivity
function initHoverEffects() {
  const cards = document.querySelectorAll('.effect-card, .implication-card');

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
  .effect-card.expanded,
  .implication-card.expanded {
    transform: scale(1.05);
    z-index: 10;
  }

  .effect-card.expanded p,
  .implication-card.expanded p {
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