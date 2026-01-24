/**
 * Blog Like Manager
 *
 * Handles like functionality for blog posts with localStorage persistence
 * and visual feedback animations.
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

class BlogLikeManager {
    /**
     * Creates a new BlogLikeManager instance
     */
    constructor() {
        this.init();
    }

    /**
     * Initializes the like manager by setting up all like buttons
     */
    init() {
        this.likeButtons = document.querySelectorAll('.like-button');
        this.likeButtons.forEach(button => {
            this.setupButton(button);
        });
    }

    /**
     * Sets up event listeners and state for a single like button
     * @param {HTMLElement} button - The like button element
     */
    setupButton(button) {
        const blogId = this.getBlogId();
        const storageKey = `blog_like_${blogId}`;
        const counter = button.querySelector('.like-counter');

        // Load initial count from localStorage
        let currentCount = parseInt(localStorage.getItem(storageKey)) || 0;
        counter.textContent = currentCount;

        // Check if user already liked this blog
        const hasLiked = localStorage.getItem(`blog_liked_${blogId}`) === 'true';
        if (hasLiked) {
            button.classList.add('liked');
        }

        button.addEventListener('click', () => {
            if (!hasLiked) {
                currentCount++;
                counter.textContent = currentCount;
                localStorage.setItem(storageKey, currentCount);
                localStorage.setItem(`blog_liked_${blogId}`, 'true');
                button.classList.add('liked');

                // Add animation
                button.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }

    /**
     * Generates a unique blog ID based on the page title
     * @returns {string} Unique blog identifier
     */
    getBlogId() {
        // Use the page title or URL path as unique identifier
        const title = document.title.split(' | ')[0].toLowerCase().replace(/\s+/g, '-');
        return title;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogLikeManager();
});