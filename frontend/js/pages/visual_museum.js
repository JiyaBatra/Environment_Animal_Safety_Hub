/**
 * ===========================================
 * VISUAL MUSEUM - Environment Animal Safety Hub
 * ===========================================
 *
 * Interactive visual museum showcasing environmental and animal exhibits
 * Features virtual galleries, interactive exhibits, and educational content
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @license MIT
 */

// ===========================================
// CONFIGURATION & CONSTANTS
// ===========================================

/**
 * Museum Exhibit Configuration
 * Contains all exhibit data, categories, and interactive elements
 * @type {Object}
 */
const MUSEUM_CONFIG = {
  categories: {
    animals: {
      name: "Animal Kingdom",
      icon: "🐾",
      description: "Explore diverse wildlife and their habitats"
    },
    environment: {
      name: "Environmental Impact",
      icon: "🌍",
      description: "Understand human impact on our planet"
    },
    conservation: {
      name: "Conservation Stories",
      icon: "🛡️",
      description: "Success stories in wildlife protection"
    },
    climate: {
      name: "Climate Change",
      icon: "🌡️",
      description: "Visualize climate patterns and effects"
    }
  },

  exhibits: [
    {
      id: "elephant-sanctuary",
      category: "animals",
      title: "Elephant Sanctuary",
      description: "Learn about the largest land animals and their social behavior",
      image: "../assets/images/animals/elephant.jpg",
      facts: [
        "Elephants can recognize themselves in mirrors",
        "They have excellent memory and never forget",
        "African elephants are the largest land mammals"
      ],
      interactive: true
    },
    {
      id: "coral-reefs",
      category: "environment",
      title: "Coral Reef Ecosystem",
      description: "Explore the underwater world and marine biodiversity",
      image: "../assets/images/environment/coral.jpg",
      facts: [
        "Coral reefs cover less than 1% of ocean floor",
        "They support 25% of marine species",
        "Reefs are dying due to ocean acidification"
      ],
      interactive: true
    },
    {
      id: "arctic-wildlife",
      category: "climate",
      title: "Arctic Wildlife",
      description: "See how climate change affects polar ecosystems",
      image: "../assets/images/climate/arctic.jpg",
      facts: [
        "Polar bears are excellent swimmers",
        "Arctic ice is melting at alarming rates",
        "Penguins are adapted to extreme cold"
      ],
      interactive: true
    },
    {
      id: "rainforest-conservation",
      category: "conservation",
      title: "Rainforest Heroes",
      description: "Stories of successful conservation efforts",
      image: "../assets/images/conservation/rainforest.jpg",
      facts: [
        "Amazon rainforest produces 20% of world's oxygen",
        "Over 390 billion trees worldwide",
        "Deforestation threatens countless species"
      ],
      interactive: true
    }
  ]
};

/**
 * Animation and Interaction Settings
 * Configuration for visual effects and user interactions
 * @type {Object}
 */
const ANIMATION_SETTINGS = {
  transitionDuration: 500,
  zoomScale: 1.5,
  rotationSpeed: 2,
  particleCount: 30,
  autoPlayInterval: 5000
};

// ===========================================
// MAIN INITIALIZATION
// ===========================================

/**
 * Main museum initialization function
 * Called when DOM content is loaded
 * Sets up all museum features and interactive elements
 */
document.addEventListener("DOMContentLoaded", function() {
  // Core museum features
  initMuseumNavigation();
  initExhibitGallery();
  initInteractiveExhibits();
  initVirtualTour();

  // Visual enhancements
  initParticleSystem();
  initBackgroundAnimations();

  // User interaction features
  initSearchFunctionality();
  initFavoritesSystem();
  initProgressTracking();

  // Accessibility and performance
  initAccessibilityFeatures();
  initLazyLoading();
});

/**
 * Initialize additional museum features
 * Called after main initialization for performance optimization
 */
function initAdditionalFeatures() {
  // Advanced features
  initARIntegration();
  initAudioGuides();
  initSocialSharing();

  // Analytics and feedback
  initUserAnalytics();
  initFeedbackSystem();
}

// ===========================================
// MUSEUM NAVIGATION SYSTEM
// ===========================================

/**
 * Initialize museum navigation system
 * Sets up category filtering and navigation controls
 */
function initMuseumNavigation() {
  const categoryButtons = document.querySelectorAll('.museum-category-btn');
  const exhibitGrid = document.getElementById('exhibitGrid');

  if (!categoryButtons.length || !exhibitGrid) return;

  /**
   * Filter exhibits by category
   * @param {string} category - Category to filter by (all, animals, environment, etc.)
   */
  function filterExhibits(category) {
    const exhibits = document.querySelectorAll('.exhibit-card');

    exhibits.forEach(exhibit => {
      if (category === 'all' || exhibit.dataset.category === category) {
        exhibit.style.display = 'block';
        exhibit.classList.add('fade-in');
      } else {
        exhibit.style.display = 'none';
        exhibit.classList.remove('fade-in');
      }
    });
  }

  // Category button event listeners
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active state
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter exhibits
      const category = this.dataset.category;
      filterExhibits(category);

      // Update URL hash for bookmarking
      window.location.hash = category;
    });
  });

  // Handle URL hash on page load
  const initialCategory = window.location.hash.substring(1) || 'all';
  const initialButton = document.querySelector(`[data-category="${initialCategory}"]`);
  if (initialButton) {
    initialButton.click();
  }
}

/**
 * Initialize exhibit gallery with masonry layout
 * Creates responsive grid layout for exhibit cards
 */
function initExhibitGallery() {
  const exhibitGrid = document.getElementById('exhibitGrid');
  if (!exhibitGrid) return;

  // Create exhibit cards
  MUSEUM_CONFIG.exhibits.forEach(exhibit => {
    const exhibitCard = createExhibitCard(exhibit);
    exhibitGrid.appendChild(exhibitCard);
  });

  // Initialize masonry layout if available
  if (typeof Masonry !== 'undefined') {
    new Masonry(exhibitGrid, {
      itemSelector: '.exhibit-card',
      columnWidth: '.exhibit-card',
      percentPosition: true,
      gutter: 20
    });
  }
}

/**
 * Create exhibit card element
 * @param {Object} exhibit - Exhibit configuration object
 * @returns {HTMLElement} Exhibit card element
 */
function createExhibitCard(exhibit) {
  const card = document.createElement('div');
  card.className = 'exhibit-card';
  card.dataset.category = exhibit.category;
  card.dataset.id = exhibit.id;

  card.innerHTML = `
    <div class="exhibit-image">
      <img src="${exhibit.image}" alt="${exhibit.title}" loading="lazy">
      <div class="exhibit-overlay">
        <div class="exhibit-actions">
          <button class="btn-explore" data-exhibit="${exhibit.id}">
            <i class="fas fa-eye"></i> Explore
          </button>
          <button class="btn-favorite" data-exhibit="${exhibit.id}">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="exhibit-content">
      <h3 class="exhibit-title">${exhibit.title}</h3>
      <p class="exhibit-description">${exhibit.description}</p>
      <div class="exhibit-meta">
        <span class="category-badge ${exhibit.category}">
          ${MUSEUM_CONFIG.categories[exhibit.category].icon}
          ${MUSEUM_CONFIG.categories[exhibit.category].name}
        </span>
        ${exhibit.interactive ? '<span class="interactive-badge">Interactive</span>' : ''}
      </div>
    </div>
  `;

  // Add event listeners
  const exploreBtn = card.querySelector('.btn-explore');
  const favoriteBtn = card.querySelector('.btn-favorite');

  exploreBtn.addEventListener('click', () => openExhibitModal(exhibit));
  favoriteBtn.addEventListener('click', () => toggleFavorite(exhibit.id));

  return card;
}

// ===========================================
// INTERACTIVE EXHIBITS SYSTEM
// ===========================================

/**
 * Initialize interactive exhibit features
 * Sets up modal dialogs and interactive elements
 */
function initInteractiveExhibits() {
  const exhibitModal = document.getElementById('exhibitModal');
  if (!exhibitModal) return;

  // Close modal functionality
  const closeBtn = exhibitModal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeExhibitModal);
  }

  // Close on overlay click
  exhibitModal.addEventListener('click', function(e) {
    if (e.target === exhibitModal) {
      closeExhibitModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && exhibitModal.classList.contains('active')) {
      closeExhibitModal();
    }
  });
}

/**
 * Open exhibit modal with detailed information
 * @param {Object} exhibit - Exhibit configuration object
 */
function openExhibitModal(exhibit) {
  const modal = document.getElementById('exhibitModal');
  const modalContent = modal.querySelector('.modal-content');

  modalContent.innerHTML = `
    <div class="modal-header">
      <h2>${exhibit.title}</h2>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <div class="exhibit-detail-image">
        <img src="${exhibit.image}" alt="${exhibit.title}">
      </div>
      <div class="exhibit-detail-content">
        <p class="exhibit-description">${exhibit.description}</p>
        <div class="exhibit-facts">
          <h4>Did you know?</h4>
          <ul>
            ${exhibit.facts.map(fact => `<li>${fact}</li>`).join('')}
          </ul>
        </div>
        ${exhibit.interactive ? `
          <div class="interactive-section">
            <h4>Interactive Experience</h4>
            <div class="interactive-controls">
              <button class="btn-zoom" onclick="zoomExhibit('${exhibit.id}')">
                <i class="fas fa-search-plus"></i> Zoom In
              </button>
              <button class="btn-rotate" onclick="rotateExhibit('${exhibit.id}')">
                <i class="fas fa-sync-alt"></i> Rotate
              </button>
              <button class="btn-info" onclick="showExhibitInfo('${exhibit.id}')">
                <i class="fas fa-info-circle"></i> More Info
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Re-attach close event listener
  const newCloseBtn = modalContent.querySelector('.modal-close');
  if (newCloseBtn) {
    newCloseBtn.addEventListener('click', closeExhibitModal);
  }
}

/**
 * Close exhibit modal
 */
function closeExhibitModal() {
  const modal = document.getElementById('exhibitModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ===========================================
// VIRTUAL TOUR SYSTEM
// ===========================================

/**
 * Initialize virtual tour functionality
 * Sets up 360-degree views and navigation
 */
function initVirtualTour() {
  const tourContainer = document.getElementById('virtualTour');
  if (!tourContainer) return;

  // Initialize tour controls
  initTourControls();
  initTourNavigation();
}

/**
 * Initialize tour control buttons
 * Sets up play, pause, and navigation controls
 */
function initTourControls() {
  const playBtn = document.getElementById('tourPlay');
  const pauseBtn = document.getElementById('tourPause');
  const prevBtn = document.getElementById('tourPrev');
  const nextBtn = document.getElementById('tourNext');

  let isPlaying = false;
  let currentExhibit = 0;

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = true;
      startAutoTour();
      updateTourControls();
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPlaying = false;
      stopAutoTour();
      updateTourControls();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigateTour('prev'));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateTour('next'));
  }

  /**
   * Update tour control button states
   */
  function updateTourControls() {
    if (playBtn) playBtn.style.display = isPlaying ? 'none' : 'inline-block';
    if (pauseBtn) pauseBtn.style.display = isPlaying ? 'inline-block' : 'none';
  }

  /**
   * Start automatic tour progression
   */
  function startAutoTour() {
    // Implementation for automatic tour
  }

  /**
   * Stop automatic tour progression
   */
  function stopAutoTour() {
    // Implementation for stopping tour
  }

  /**
   * Navigate to previous or next exhibit
   * @param {string} direction - Direction to navigate ('prev' or 'next')
   */
  function navigateTour(direction) {
    const exhibits = MUSEUM_CONFIG.exhibits;
    if (direction === 'next') {
      currentExhibit = (currentExhibit + 1) % exhibits.length;
    } else {
      currentExhibit = (currentExhibit - 1 + exhibits.length) % exhibits.length;
    }

    showExhibitInTour(exhibits[currentExhibit]);
  }
}

/**
 * Show exhibit in virtual tour
 * @param {Object} exhibit - Exhibit to display in tour
 */
function showExhibitInTour(exhibit) {
  const tourDisplay = document.getElementById('tourDisplay');
  if (!tourDisplay) return;

  tourDisplay.innerHTML = `
    <div class="tour-exhibit">
      <img src="${exhibit.image}" alt="${exhibit.title}" class="tour-image">
      <div class="tour-info">
        <h3>${exhibit.title}</h3>
        <p>${exhibit.description}</p>
      </div>
    </div>
  `;
}

/**
 * Initialize tour navigation indicators
 * Sets up progress dots and navigation
 */
function initTourNavigation() {
  const tourNav = document.getElementById('tourNavigation');
  if (!tourNav) return;

  // Create navigation dots
  MUSEUM_CONFIG.exhibits.forEach((exhibit, index) => {
    const dot = document.createElement('div');
    dot.className = 'tour-dot';
    dot.dataset.index = index;
    dot.addEventListener('click', () => showExhibitInTour(exhibit));
    tourNav.appendChild(dot);
  });

  // Set first dot as active
  const firstDot = tourNav.querySelector('.tour-dot');
  if (firstDot) firstDot.classList.add('active');
}

// ===========================================
// VISUAL EFFECTS & ANIMATIONS
// ===========================================

/**
 * Initialize particle system for background effects
 * Creates floating particles for visual enhancement
 */
function initParticleSystem() {
  const particleContainer = document.getElementById('museumParticles');
  if (!particleContainer) return;

  for (let i = 0; i < ANIMATION_SETTINGS.particleCount; i++) {
    createMuseumParticle(particleContainer);
  }
}

/**
 * Create individual particle for museum background
 * @param {HTMLElement} container - Container element for particles
 */
function createMuseumParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'museum-particle';

  const size = Math.random() * 4 + 2;
  const left = Math.random() * 100;
  const delay = Math.random() * 10;
  const duration = Math.random() * 20 + 15;

  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    left: ${left}%;
    bottom: -10px;
    animation: floatUp ${duration}s linear ${delay}s infinite;
    pointer-events: none;
  `;

  container.appendChild(particle);
}

/**
 * Initialize background animations
 * Sets up subtle animations for museum atmosphere
 */
function initBackgroundAnimations() {
  // Add CSS animations for background elements
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatUp {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      90% {
        opacity: 0.6;
      }
      100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }

    .exhibit-card {
      transition: all 0.3s ease;
    }

    .exhibit-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .fade-in {
      animation: fadeIn 0.5s ease forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// ===========================================
// SEARCH & FILTERING SYSTEM
// ===========================================

/**
 * Initialize search functionality
 * Sets up exhibit search and filtering
 */
function initSearchFunctionality() {
  const searchInput = document.getElementById('museumSearch');
  if (!searchInput) return;

  /**
   * Filter exhibits based on search query
   * @param {string} query - Search query string
   */
  function searchExhibits(query) {
    const exhibits = document.querySelectorAll('.exhibit-card');
    const lowerQuery = query.toLowerCase();

    exhibits.forEach(exhibit => {
      const title = exhibit.querySelector('.exhibit-title').textContent.toLowerCase();
      const description = exhibit.querySelector('.exhibit-description').textContent.toLowerCase();

      if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
        exhibit.style.display = 'block';
        exhibit.classList.add('fade-in');
      } else {
        exhibit.style.display = 'none';
        exhibit.classList.remove('fade-in');
      }
    });
  }

  // Debounced search
  let searchTimeout;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchExhibits(this.value);
    }, 300);
  });
}

// ===========================================
// FAVORITES SYSTEM
// ===========================================

/**
 * Initialize favorites system
 * Allows users to save favorite exhibits
 */
function initFavoritesSystem() {
  const favorites = JSON.parse(localStorage.getItem('museumFavorites') || '[]');

  /**
   * Toggle favorite status for an exhibit
   * @param {string} exhibitId - ID of the exhibit to toggle
   */
  window.toggleFavorite = function(exhibitId) {
    const index = favorites.indexOf(exhibitId);
    const button = document.querySelector(`[data-exhibit="${exhibitId}"].btn-favorite`);
    const icon = button.querySelector('i');

    if (index > -1) {
      favorites.splice(index, 1);
      icon.className = 'far fa-heart';
      showNotification('Removed from favorites', 'info');
    } else {
      favorites.push(exhibitId);
      icon.className = 'fas fa-heart';
      showNotification('Added to favorites', 'success');
    }

    localStorage.setItem('museumFavorites', JSON.stringify(favorites));
  }

  // Update favorite buttons on load
  favorites.forEach(exhibitId => {
    const button = document.querySelector(`[data-exhibit="${exhibitId}"].btn-favorite i`);
    if (button) {
      button.className = 'fas fa-heart';
    }
  });
}

// ===========================================
// PROGRESS TRACKING SYSTEM
// ===========================================

/**
 * Initialize progress tracking
 * Tracks user engagement and exhibit visits
 */
function initProgressTracking() {
  const progress = JSON.parse(localStorage.getItem('museumProgress') || '{}');

  /**
   * Mark exhibit as visited
   * @param {string} exhibitId - ID of the visited exhibit
   */
  window.markExhibitVisited = function(exhibitId) {
    progress[exhibitId] = {
      visited: true,
      timestamp: new Date().toISOString(),
      interactions: (progress[exhibitId]?.interactions || 0) + 1
    };

    localStorage.setItem('museumProgress', JSON.stringify(progress));
    updateProgressDisplay();
  }

  /**
   * Update progress display in UI
   */
  function updateProgressDisplay() {
    const visitedCount = Object.values(progress).filter(p => p.visited).length;
    const totalCount = MUSEUM_CONFIG.exhibits.length;
    const percentage = Math.round((visitedCount / totalCount) * 100);

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${visitedCount}/${totalCount} exhibits explored`;
  }

  // Initial progress update
  updateProgressDisplay();
}

// ===========================================
// ACCESSIBILITY FEATURES
// ===========================================

/**
 * Initialize accessibility features
 * Sets up keyboard navigation and screen reader support
 */
function initAccessibilityFeatures() {
  // Keyboard navigation for exhibit cards
  const exhibitCards = document.querySelectorAll('.exhibit-card');
  exhibitCards.forEach(card => {
    card.setAttribute('tabindex', '0');

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const exploreBtn = this.querySelector('.btn-explore');
        if (exploreBtn) exploreBtn.click();
      }
    });
  });

  // High contrast mode toggle
  const contrastToggle = document.getElementById('contrastToggle');
  if (contrastToggle) {
    contrastToggle.addEventListener('click', function() {
      document.body.classList.toggle('high-contrast');
      localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
    });

    // Restore high contrast preference
    if (localStorage.getItem('highContrast') === 'true') {
      document.body.classList.add('high-contrast');
    }
  }
}

// ===========================================
// PERFORMANCE OPTIMIZATIONS
// ===========================================

/**
 * Initialize lazy loading for images
 * Loads images as they come into viewport
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length || !('IntersectionObserver' in window)) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// ===========================================
// ADVANCED FEATURES (Optional)
// ===========================================

/**
 * Initialize AR integration (if supported)
 * Sets up augmented reality features for exhibits
 */
function initARIntegration() {
  // Check for AR support
  if ('xr' in navigator) {
    // WebXR supported
    const arButton = document.getElementById('arButton');
    if (arButton) {
      arButton.style.display = 'block';
      arButton.addEventListener('click', startARExperience);
    }
  }
}

/**
 * Start AR experience for current exhibit
 */
function startARExperience() {
  // Implementation for AR experience
  showNotification('AR experience starting...', 'info');
}

/**
 * Initialize audio guide system
 * Provides narrated tours and exhibit information
 */
function initAudioGuides() {
  const audioToggle = document.getElementById('audioGuideToggle');
  if (!audioToggle) return;

  let currentAudio = null;

  audioToggle.addEventListener('click', function() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
      this.innerHTML = '<i class="fas fa-volume-up"></i> Audio Guide';
    } else {
      // Start audio guide
      this.innerHTML = '<i class="fas fa-volume-mute"></i> Stop Audio';
      // Implementation for audio playback
    }
  });
}

/**
 * Initialize social sharing features
 * Allows users to share exhibits on social media
 */
function initSocialSharing() {
  /**
   * Share exhibit on social media
   * @param {string} platform - Social media platform (facebook, twitter, etc.)
   * @param {string} exhibitId - ID of exhibit to share
   */
  window.shareExhibit = function(platform, exhibitId) {
    const exhibit = MUSEUM_CONFIG.exhibits.find(e => e.id === exhibitId);
    if (!exhibit) return;

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this amazing exhibit: ${exhibit.title}`);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }
}

// ===========================================
// ANALYTICS & FEEDBACK SYSTEM
// ===========================================

/**
 * Initialize user analytics tracking
 * Tracks user behavior and engagement metrics
 */
function initUserAnalytics() {
  // Track exhibit views
  document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-explore')) {
      const exhibitId = e.target.closest('.btn-explore').dataset.exhibit;
      trackEvent('exhibit_view', { exhibit_id: exhibitId });
    }
  });

  /**
   * Track user events
   * @param {string} eventName - Name of the event
   * @param {Object} data - Event data
   */
  function trackEvent(eventName, data) {
    // Implementation for analytics tracking
    console.log('Analytics:', eventName, data);
  }
}

/**
 * Initialize feedback system
 * Allows users to provide feedback on exhibits
 */
function initFeedbackSystem() {
  const feedbackButtons = document.querySelectorAll('.feedback-btn');

  feedbackButtons.forEach(button => {
    button.addEventListener('click', function() {
      const rating = this.dataset.rating;
      const exhibitId = this.closest('.exhibit-modal')?.dataset.exhibit;

      submitFeedback(exhibitId, rating);
      showNotification('Thank you for your feedback!', 'success');
    });
  });

  /**
   * Submit user feedback
   * @param {string} exhibitId - ID of the exhibit
   * @param {string} rating - User rating (1-5)
   */
  function submitFeedback(exhibitId, rating) {
    // Implementation for feedback submission
    console.log('Feedback submitted:', { exhibitId, rating });
  }
}

// ===========================================
// INTERACTIVE EXHIBIT CONTROLS
// ===========================================

/**
 * Zoom into exhibit image
 * @param {string} exhibitId - ID of exhibit to zoom
 */
window.zoomExhibit = function(exhibitId) {
  const image = document.querySelector(`.exhibit-detail-image img`);
  if (!image) return;

  image.style.transform = image.style.transform === `scale(${ANIMATION_SETTINGS.zoomScale})`
    ? 'scale(1)'
    : `scale(${ANIMATION_SETTINGS.zoomScale})`;
}

/**
 * Rotate exhibit view
 * @param {string} exhibitId - ID of exhibit to rotate
 */
window.rotateExhibit = function(exhibitId) {
  const image = document.querySelector(`.exhibit-detail-image img`);
  if (!image) return;

  const currentRotation = image.dataset.rotation || 0;
  const newRotation = (parseInt(currentRotation) + 90) % 360;

  image.style.transform = `rotate(${newRotation}deg)`;
  image.dataset.rotation = newRotation;
}

/**
 * Show additional exhibit information
 * @param {string} exhibitId - ID of exhibit to show info for
 */
window.showExhibitInfo = function(exhibitId) {
  const exhibit = MUSEUM_CONFIG.exhibits.find(e => e.id === exhibitId);
  if (!exhibit) return;

  const infoModal = document.createElement('div');
  infoModal.className = 'info-modal';
  infoModal.innerHTML = `
    <div class="info-modal-content">
      <h3>Additional Information</h3>
      <div class="info-content">
        <h4>Scientific Facts</h4>
        <ul>
          ${exhibit.facts.map(fact => `<li>${fact}</li>`).join('')}
        </ul>
        <h4>Conservation Status</h4>
        <p>Learn more about conservation efforts for this species.</p>
        <h4>Related Exhibits</h4>
        <p>Explore similar exhibits in our museum.</p>
      </div>
      <button onclick="this.closest('.info-modal').remove()">Close</button>
    </div>
  `;

  document.body.appendChild(infoModal);
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
  // Use existing notification system if available
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
    return;
  }

  // Fallback notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background: ${type === 'success' ? '#4caf50' : '#2196f3'};
    color: white;
    border-radius: 5px;
    z-index: 1000;
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ===========================================
// CONSOLE LOGO & DEBUGGING
// ===========================================

// Display museum branding in console
console.log(
  "%c🏛️ Visual Museum - Environment Animal Safety Hub 🐾",
  "font-size: 18px;font-weight: bold;color: #2e7d32;text-shadow: 2px 2px 4px rgba(0,0,0,0.1);"
);

console.log(
  "%cExplore the wonders of nature through interactive exhibits",
  "font-size: 12px;color: #666;"
);

// ===========================================
// END OF VISUAL_MUSEUM.JS
// ===========================================