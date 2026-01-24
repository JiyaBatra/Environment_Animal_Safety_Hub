/**
 * EcoLife Blog Page
 *
 * Interactive blog platform with dark mode toggle, category filtering,
 * newsletter subscription, and smooth scroll animations.
 *
 * Features:
 * - Dark/Light theme toggle with localStorage persistence
 * - Category-based blog post filtering
 * - Newsletter subscription with email validation
 * - Clickable blog cards with smooth navigation
 * - Scroll-triggered animations for blog cards
 * - Responsive design with mobile-friendly interactions
 * - Intersection Observer API for performance-optimized animations
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ========== INITIALIZATION ==========

/**
 * Initialize all blog page components when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initThemeToggle();
    initCategoryFiltering();
    initArticleSort();
    initNewsletterForm();
    initBlogCardInteractions();
    initScrollAnimations();
    sortBlogCards();

    console.log('EcoLife Blog Page Loaded');
});

// Shared sort preference across pages
let currentArticleSort = (window.SortControl && window.SortControl.getSortPreference()) || 'newest';

// ========== THEME TOGGLE SYSTEM ==========

/**
 * Initialize dark/light theme toggle functionality
 * Includes localStorage persistence and smooth transitions
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');

    if (!themeToggle || !themeIcon) return;

    // Check for saved theme preference on page load
    const savedTheme = localStorage.getItem('blogDarkMode');
    if (savedTheme === 'enabled') {
        enableDarkMode();
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', function () {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }

        // Add click animation feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
}

/**
 * Enable dark mode theme
 * Updates body class, icon, and localStorage
 */
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = 'fas fa-sun';
    }
    localStorage.setItem('blogDarkMode', 'enabled');
}

/**
 * Disable dark mode theme
 * Updates body class, icon, and localStorage
 */
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = 'fas fa-moon';
    }
    localStorage.setItem('blogDarkMode', 'disabled');
}

// ========== CATEGORY FILTERING ==========

/**
 * Initialize category filtering functionality
 * Sets up filter buttons and blog card filtering logic
 */
function initCategoryFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Update active button styling
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Get selected category and apply filtering
            const category = this.getAttribute('data-category');
            filterBlogCards(category, blogCards);
        });
    });
}

/**
 * Filter blog cards based on selected category
 * @param {string} category - Category to filter by ('all' or specific category)
 * @param {NodeList} blogCards - Collection of blog card elements
 */
function filterBlogCards(category, blogCards) {
    blogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
            // Add fade-in animation
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
    sortBlogCards();
}

/**
 * Initialize sort dropdown for articles
 */
function initArticleSort() {
    if (!window.SortControl) return;
    const container = document.getElementById('articles-sorter');
    if (!container) return;

    const dropdown = window.SortControl.createSortDropdown((value) => {
        currentArticleSort = value;
        sortBlogCards();
    });
    container.appendChild(dropdown);
}

/**
 * Apply sorting to visible blog cards
 */
function sortBlogCards() {
    if (!window.SortControl) return;
    const container = document.querySelector('main.container');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.blog-card'));
    const mapped = cards.map(card => ({
        el: card,
        title: card.dataset.sortTitle || card.querySelector('h3')?.textContent?.trim() || '',
        date: card.dataset.sortDate,
        popularity: Number(card.dataset.sortPopularity || 0)
    }));

    const sorted = window.SortControl.sortItems(mapped, currentArticleSort);
    sorted.forEach(({ el }) => container.appendChild(el));
}

// ========== NEWSLETTER SYSTEM ==========

/**
 * Initialize newsletter subscription form
 * Sets up form validation and submission handling
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (!newsletterForm) return;

    const emailInput = newsletterForm.querySelector('input');

    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput?.value?.trim();

        if (!email) {
            showNewsletterMessage('Please enter your email address.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNewsletterMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Success - simulate subscription
        showNewsletterMessage('Thank you for subscribing to the EcoLife newsletter!', 'success');
        emailInput.value = '';

        // Add success animation to form
        newsletterForm.style.transform = 'scale(1.02)';
        setTimeout(() => {
            newsletterForm.style.transform = '';
        }, 200);
    });
}

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Display newsletter subscription message
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showNewsletterMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create and display new message
    const messageEl = document.createElement('div');
    messageEl.className = `newsletter-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        ${type === 'success' ? 'background: #4caf50;' : 'background: #f44336;'}
    `;

    document.body.appendChild(messageEl);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (messageEl.parentElement) {
            messageEl.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, 4000);
}

// ========== BLOG CARD INTERACTIONS ==========

/**
 * Initialize blog card click interactions
 * Makes entire cards clickable and navigates to blog posts
 */
function initBlogCardInteractions() {
    const blogCards = document.querySelectorAll('.blog-card');

    blogCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Don't trigger if clicking on interactive elements
            if (e.target.closest('button') || e.target.closest('a')) {
                return;
            }

            const readMoreLink = this.querySelector('.read-more');
            if (readMoreLink) {
                const href = readMoreLink.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            }
        });

        // Add hover effect
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// ========== SCROLL ANIMATIONS ==========

/**
 * Initialize scroll-triggered animations
 * Uses Intersection Observer for performance-optimized animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply animation
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        observer.observe(card);
    });

    // Observe featured card if present
    const featuredCard = document.querySelector('.featured-card');
    if (featuredCard) {
        featuredCard.style.opacity = '0';
        featuredCard.style.transform = 'translateY(20px)';
        featuredCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(featuredCard);
    }
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Add CSS animations to document head
 * Ensures smooth animations are available
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// Add animation styles on load
document.addEventListener('DOMContentLoaded', addAnimationStyles);

// ========== CONSOLE LOGGING ==========

console.log(
    "%c📝 EcoLife Blog Platform",
    "font-size: 18px; font-weight: bold; color: #2e7d32;"
);

console.log(
    "%cSharing environmental insights and conservation stories! 🌱",
    "font-size: 14px; color: #666;"
);