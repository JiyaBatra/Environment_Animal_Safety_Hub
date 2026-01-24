/**
 * Community Channel Management
 *
 * Handles channel feed display, channel viewing, creation, and search functionality
 * for the community channels section.
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

(function() {
    'use strict';

    /**
     * Sample channel feeds data
     * @type {Object<string, Array<string>>}
     */
    const channelFeeds = {
        "Tree Lovers": [
            "🌳 How to grow trees in small spaces?",
            "🌱 Best native trees for your region",
            "🌲 Community tree plantation drive this weekend",
            "🍃 Importance of urban forests"
        ],
        "Save Pollinators": [
            "🐝 How to attract bees to your garden",
            "🌼 Best flowers for pollinators",
            "🚫 Why pesticides are killing pollinators",
            "🌸 Pollinator-friendly balcony plants"
        ],
        "Solar Energy": [
            "☀️ Is solar worth installing at home?",
            "🔋 Battery storage explained",
            "🏠 Rooftop solar tips",
            "⚡ Government subsidies for solar"
        ]
    };

    const channelFeedSection = document.querySelector('.channel-feed');

    /**
     * Handles channel viewing through event delegation
     */
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-channel-btn')) {
            const channelName = e.target
                .closest('.my-channel')
                .querySelector('span')
                .textContent
                .replace(/^[^\w]+/, '') // remove emoji
                .trim();
            renderChannelFeed(channelName);
        }
    });

    /**
     * Renders the feed for a specific channel
     * @param {string} channelName - Name of the channel to display
     */
    function renderChannelFeed(channelName) {
        const feeds = channelFeeds[channelName] || [];
        channelFeedSection.innerHTML = `
            <h2 class="channel-title">${channelName}</h2>
            ${feeds.length ? feeds
                .map(feed => `
                    <div class="notification-card">
                        <p>${feed}</p>
                        <div class="card-actions">
                            <i class="fa-regular fa-thumbs-up icon-btn"></i>
                            <i class="fa-regular fa-comment icon-btn"></i>
                        </div>
                    </div>
                `)
                .join('') : '<p>No posts yet in this channel.</p>'
            }
        `;
    }

    /**
     * Handles like button toggling
     */
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-thumbs-up')) {
            e.target.classList.toggle('active');
        }
    });

    /**
     * Initializes channel creation modal functionality
     */
    function initChannelCreation() {
        const createBtn = document.querySelector('.create-channel-btn');
        const modal = document.getElementById('createChannelModal');
        const closeModal = document.querySelector('.close-modal');

        createBtn?.addEventListener('click', () => {
            modal.classList.add('show');
        });

        closeModal?.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    /**
     * Initializes channel search functionality
     */
    function initChannelSearch() {
        const searchInput = document.querySelector('.top-bar .input');
        const channelCards = document.querySelectorAll('.channel-card');

        searchInput?.addEventListener('input', () => {
            const searchValue = searchInput.value.toLowerCase().trim();
            channelCards.forEach(card => {
                const channelName = card.querySelector('h4').textContent.toLowerCase();
                if (channelName.includes(searchValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    /**
     * Initializes all channel functionality when DOM is loaded
     */
    function initChannelSystem() {
        initChannelCreation();
        initChannelSearch();
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', initChannelSystem);

})();