/**
 * Exotic Animals Care Guide and Legal Information System
 *
 * Interactive platform for learning about exotic animal care requirements,
 * legal considerations, and ethical ownership practices.
 *
 * Features:
 * - Interactive species care guide with tabbed interface
 * - Legal compliance information for exotic animal ownership
 * - Ethical considerations and conservation impact
 * - Getting started guide for new exotic pet owners
 * - AOS (Animate On Scroll) integration for smooth animations
 * - Responsive design with mobile optimization
 * - Comprehensive information on reptiles, birds, mammals, and amphibians
 *
 * Species Covered:
 * - Reptiles: Bearded Dragons, Ball Pythons, Red-Eared Sliders
 * - Birds: African Grey Parrots, Hawks & Falcons
 * - Small Mammals: Hedgehogs, Fruit Bats
 * - Amphibians: Poison Dart Frogs, Axolotls
 *
 * Legal Focus:
 * - Licensing requirements and permits
 * - Regulatory bodies and compliance
 * - Prohibited species information
 * - Financial obligations and costs
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 * @requires AOS (Animate On Scroll) library
 */

// ========== INITIALIZATION ==========

/**
 * Initialize the exotic animals page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeExoticAnimalsPage();
});

/**
 * Main initialization function for the exotic animals page
 */
function initializeExoticAnimalsPage() {
    // Initialize AOS animations
    initializeAOS();

    // Initialize tab functionality
    initializeSpeciesTabs();

    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling();

    // Initialize interactive elements
    initializeInteractiveElements();
}

// ========== ANIMATION INITIALIZATION ==========

/**
 * Initialize AOS (Animate On Scroll) library for smooth page animations
 */
function initializeAOS() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
}

// ========== SMOOTH SCROLLING ==========

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== SPECIES TABS FUNCTIONALITY ==========

/**
 * Initialize the species care guide tabs
 */
function initializeSpeciesTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSpecies = this.getAttribute('data-species');

            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetSpecies + '-panel');
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            // Trigger AOS refresh for new content
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        });
    });
}

// ========== INTERACTIVE ELEMENTS ==========

/**
 * Initialize interactive elements and enhancements
 */
function initializeInteractiveElements() {
    // Add hover effects to legal cards
    initializeCardHoverEffects();

    // Add click tracking for external links
    initializeExternalLinkTracking();

    // Initialize expandable content sections
    initializeExpandableContent();
}

/**
 * Initialize hover effects for cards
 */
function initializeCardHoverEffects() {
    const cards = document.querySelectorAll('.legal-card, .species-card, .step-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Initialize external link tracking and warnings
 */
function initializeExternalLinkTracking() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');

    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add visual feedback for external links
            this.style.color = '#8b5cf6';

            // Could add analytics tracking here
            console.log('External link clicked:', this.href);
        });
    });
}

/**
 * Initialize expandable content sections
 */
function initializeExpandableContent() {
    // Add expand/collapse functionality to care requirements
    const careSections = document.querySelectorAll('.care-requirements h4');

    careSections.forEach(header => {
        header.addEventListener('click', function() {
            const list = this.nextElementSibling;
            if (list && list.tagName === 'UL') {
                const isExpanded = list.style.display !== 'none';

                // Toggle visibility
                list.style.display = isExpanded ? 'none' : 'block';

                // Update header styling
                this.style.color = isExpanded ? '#1a1a2e' : '#8b5cf6';
                this.style.cursor = 'pointer';
            }
        });

        // Make headers appear clickable
        header.style.cursor = 'pointer';
        header.style.transition = 'color 0.3s ease';

        // Add hover effect
        header.addEventListener('mouseenter', function() {
            this.style.color = '#8b5cf6';
        });

        header.addEventListener('mouseleave', function() {
            this.style.color = '#1a1a2e';
        });
    });
}

// ========== LEGAL INFORMATION DATA ==========

/**
 * Legal requirements data for different regions
 * @type {Object<string, Object>}
 */
const legalRequirements = {
    us: {
        federal: {
            usfws: "U.S. Fish and Wildlife Service - Endangered species",
            usda: "USDA Animal and Plant Health Inspection Service",
            cdc: "Centers for Disease Control - Zoonotic diseases"
        },
        state: {
            permits: "State wildlife permits and licenses",
            inspections: "Regular facility inspections",
            reporting: "Disease and escape reporting requirements"
        }
    },
    international: {
        cites: "Convention on International Trade in Endangered Species",
        iucn: "International Union for Conservation of Nature",
        regional: "Regional wildlife protection agreements"
    }
};

/**
 * Prohibited species by category
 * @type {Object<string, Array<string>>}
 */
const prohibitedSpecies = {
    largeCarnivores: [
        "Lions", "Tigers", "Leopards", "Jaguars", "Cheetahs",
        "Bears", "Wolves", "Hyenas"
    ],
    primates: [
        "Gorillas", "Chimpanzees", "Orangutans", "Bonobos",
        " Gibbons", "Macaques", "Baboon species"
    ],
    venomousReptiles: [
        "Cobra species", "Mamba species", "Rattlesnakes",
        "Pit vipers", "Some monitor lizards"
    ],
    marineMammals: [
        "Dolphins", "Whales", "Manatees", "Sea lions"
    ]
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Format currency values for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show notification message to user
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });

    // Set background color based on type
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ========== RESPONSIVE DESIGN HELPERS ==========

/**
 * Handle responsive design adjustments
 */
function handleResponsiveDesign() {
    const isMobile = window.innerWidth <= 768;

    // Adjust tab layout for mobile
    const tabButtons = document.querySelector('.tab-buttons');
    if (tabButtons) {
        if (isMobile) {
            tabButtons.style.flexDirection = 'column';
            tabButtons.style.alignItems = 'stretch';
        } else {
            tabButtons.style.flexDirection = 'row';
            tabButtons.style.alignItems = 'center';
        }
    }

    // Adjust card layouts for mobile
    const grids = document.querySelectorAll('.legal-grid, .species-grid, .steps-grid');
    grids.forEach(grid => {
        if (isMobile) {
            grid.style.gridTemplateColumns = '1fr';
        } else {
            grid.style.gridTemplateColumns = '';
        }
    });
}

// Initialize responsive design handling
window.addEventListener('resize', handleResponsiveDesign);
window.addEventListener('load', handleResponsiveDesign);

// ========== SEARCH AND FILTER FUNCTIONALITY ==========

/**
 * Initialize search functionality for species information
 */
function initializeSearchFunctionality() {
    // Could add search input for filtering species
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search species...';
    searchInput.className = 'species-search';

    // Add search functionality here if needed
    // This could filter species cards based on search terms
}

// ========== EXPORT FUNCTIONALITY ==========

/**
 * Export care information as PDF (placeholder for future implementation)
 * @param {string} species - Species to export information for
 */
function exportCareGuide(species) {
    // Placeholder for PDF export functionality
    showNotification('PDF export feature coming soon!', 'info');
}

/**
 * Share species information on social media
 * @param {string} species - Species to share
 * @param {string} platform - Social media platform
 */
function shareSpeciesInfo(species, platform) {
    const url = window.location.href;
    const text = `Learn about caring for ${species} on EcoLife!`;

    let shareUrl = '';

    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// ========== ANALYTICS AND TRACKING ==========

/**
 * Track user interactions for analytics
 * @param {string} action - Action performed
 * @param {string} category - Category of action
 * @param {string} label - Additional label
 */
function trackInteraction(action, category, label) {
    // Placeholder for analytics tracking
    console.log(`Tracking: ${action} - ${category} - ${label}`);

    // Could integrate with Google Analytics, Mixpanel, etc.
    // Example: gtag('event', action, { event_category: category, event_label: label });
}