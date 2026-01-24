/**
 * Video Tutorials Page JavaScript
 *
 * Interactive video tutorial system with filtering, modal playback, and accessibility features.
 * Displays educational videos about animal safety, environment, and plant care.
 *
 * Features:
 * - Dynamic video card generation from data
 * - Category-based filtering system
 * - Modal video player with YouTube embed
 * - Transcript toggle functionality
 * - Keyboard navigation support
 * - Loading animations for thumbnails
 * - Responsive design with accessibility
 *
 * Video Categories:
 * - animal-safety: Wildlife handling, first aid, safe feeding
 * - environment: Waste management, recycling, conservation
 * - plant-care: Gardening, indoor plants, sustainable practices
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 * @requires videoTutorialsData (from video-tutorials-data.js)
 */

// ===== INITIALIZATION =====
/**
 * Initialize video tutorials page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeVideoTutorials();
});

// ===== MAIN INITIALIZATION FUNCTION =====
/**
 * Initialize all video tutorial functionality
 * Sets up video cards, filters, modal, and accessibility features
 */
function initializeVideoTutorials() {
    // Video data is loaded from video-tutorials-data.js
    const videoData = videoTutorialsData;

    // Generate video cards from data
    generateVideoCards(videoData);

    // Initialize filter functionality
    initializeFilters();

    // Initialize video modal functionality
    initializeVideoModal(videoData);
}

// ===== VIDEO CARD GENERATION =====
/**
 * Generate video cards dynamically from video data
 * Creates responsive card layout with thumbnails and metadata
 * @param {Object} videoData - Video tutorial data object
 */
function generateVideoCards(videoData) {
    const videoGrid = document.getElementById('video-grid');
    videoGrid.innerHTML = '';

    // Generate card for each video
    Object.keys(videoData).forEach(videoId => {
        const video = videoData[videoId];
        const videoCard = document.createElement('article');
        videoCard.className = 'video-card';
        videoCard.setAttribute('data-category', video.category);

        // Create card HTML structure
        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title} Tutorial Thumbnail" loading="lazy">
                <div class="play-overlay">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-content">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
                <div class="video-meta">
                    <span class="category-tag ${video.category}">${getCategoryDisplayName(video.category)}</span>
                    <span class="video-date">Jan 2026</span>
                </div>
                <button class="watch-btn" data-video-id="${videoId}" aria-label="Watch ${video.title} tutorial">
                    <i class="fas fa-play"></i> Watch Tutorial
                </button>
            </div>
        `;

        videoGrid.appendChild(videoCard);
    });
}

// ===== CATEGORY NAME MAPPING =====
/**
 * Get display-friendly category name from category key
 * @param {string} category - Category key (animal-safety, environment, plant-care)
 * @returns {string} Display name for the category
 */
function getCategoryDisplayName(category) {
    const categoryNames = {
        'animal-safety': 'Animal Safety',
        'environment': 'Environment',
        'plant-care': 'Plant Care'
    };
    return categoryNames[category] || category;
}

// ===== FILTER SYSTEM =====
/**
 * Initialize video filtering functionality
 * Sets up filter buttons and video card filtering logic
 */
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoCards = document.querySelectorAll('.video-card');

    filterButtons.forEach(button => {
        // Click event for filtering
        button.addEventListener('click', function() {
            // Update active button state
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // Filter videos based on category
            const category = this.getAttribute('data-category');
            filterVideos(videoCards, category);
        });

        // Keyboard support for accessibility
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ===== VIDEO FILTERING =====
/**
 * Filter video cards based on selected category
 * Uses CSS transitions for smooth show/hide animations
 * @param {NodeList} videoCards - All video card elements
 * @param {string} category - Category to filter by ('all' shows all videos)
 */
function filterVideos(videoCards, category) {
    videoCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            // Show card with animation
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        } else {
            // Hide card with animation
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300); // Match CSS transition duration
        }
    });
}

// ===== VIDEO MODAL SYSTEM =====
/**
 * Initialize video modal functionality
 * Sets up modal open/close, video embedding, and transcript features
 * @param {Object} videoData - Video tutorial data object
 */
function initializeVideoModal(videoData) {
    // Modal elements
    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const videoPlayer = document.getElementById('videoPlayer');
    const transcriptBtn = document.getElementById('transcriptBtn');
    const transcriptContent = document.getElementById('transcript-content');
    const transcriptText = document.getElementById('transcript-text');
    const modalClose = document.querySelector('.modal-close');

    let currentVideo = null;

    // Watch button event listeners
    document.querySelectorAll('.watch-btn').forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            openVideoModal(videoId);
        });
    });

    // Modal close events
    modalClose.addEventListener('click', closeVideoModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    // Keyboard navigation
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });

    // Transcript toggle functionality
    transcriptBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        transcriptContent.setAttribute('aria-hidden', isExpanded);

        if (!isExpanded) {
            transcriptContent.style.display = 'block';
        } else {
            transcriptContent.style.display = 'none';
        }
    });

    /**
     * Open video modal with selected video
     * @param {string} videoId - ID of the video to play
     */
    function openVideoModal(videoId) {
        currentVideo = videoData[videoId];
        if (!currentVideo) return;

        // Update modal content
        modalTitle.textContent = currentVideo.title;
        modalDescription.textContent = currentVideo.description;
        transcriptText.textContent = currentVideo.transcript;

        // Load video embed
        videoPlayer.innerHTML = `<iframe src="${currentVideo.embedUrl}?rel=0&modestbranding=1" title="${currentVideo.title}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;

        // Reset transcript state
        transcriptBtn.setAttribute('aria-expanded', 'false');
        transcriptContent.setAttribute('aria-hidden', 'true');
        transcriptContent.style.display = 'none';

        // Show modal
        modal.classList.add('active');
        modalClose.focus();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close video modal and clean up
     */
    function closeVideoModal() {
        modal.classList.remove('active');
        videoPlayer.innerHTML = '';

        // Restore body scroll
        document.body.style.overflow = 'auto';

        // Return focus to triggering button
        const triggerBtn = document.querySelector(`[data-video-id="${Object.keys(videoData).find(key => videoData[key] === currentVideo)}"]`);
        if (triggerBtn) {
            triggerBtn.focus();
        }
    }
}

// ===== LOADING ANIMATIONS =====
/**
 * Add loading animation for video thumbnails
 * Fades in images once they load for better UX
 */
const videoThumbnails = document.querySelectorAll('.video-thumbnail img');
videoThumbnails.forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });

    // Set initial state for fade-in animation
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
});