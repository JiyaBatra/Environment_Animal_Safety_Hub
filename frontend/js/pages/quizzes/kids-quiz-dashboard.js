/**
 * Kids Quiz Dashboard - Interactive Quiz Selection Interface
 *
 * A dynamic dashboard system for children to browse and select from various
 * environmental quizzes. Features category-based filtering to help kids
 * find quizzes that match their interests and learning level.
 *
 * Dashboard Features:
 * - Category-based quiz filtering (All, Animals, Environment, etc.)
 * - Interactive filter buttons with active state management
 * - Smooth card display/hide animations
 * - Responsive design for different screen sizes
 * - Visual feedback for user interactions
 *
 * Quiz Categories:
 * - All: Display all available quizzes
 * - Animals: Wildlife and animal conservation quizzes
 * - Environment: General environmental awareness
 * - Recycling: Waste management and recycling education
 * - Climate: Climate change and global warming topics
 * - Water: Water conservation and ocean protection
 * - Energy: Renewable energy and conservation
 *
 * Technical Features:
 * - Event-driven filter system
 * - CSS class manipulation for active states
 * - Dataset attribute filtering
 * - Smooth transitions and animations
 * - Accessible button interactions
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== DOM ELEMENT REFERENCES =====
/**
 * Interactive elements for the quiz dashboard
 * @type {NodeListOf<HTMLElement>}
 */
const filterBtns = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

// ===== FILTER SYSTEM =====
/**
 * Initialize the quiz filtering system
 * Sets up event listeners for filter buttons to show/hide quiz cards by category
 */
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active class from all filter buttons
    filterBtns.forEach(b => b.classList.remove("active"));

    // Add active class to clicked button
    btn.classList.add("active");

    // Get the filter category from button's data attribute
    const filter = btn.dataset.filter;

    // Show/hide cards based on selected filter
    cards.forEach(card => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.style.display = shouldShow ? "block" : "none";
    });
  });
});