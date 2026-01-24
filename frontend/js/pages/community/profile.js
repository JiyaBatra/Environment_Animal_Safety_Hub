/**
 * Profile Page Tab Management
 *
 * Handles tab switching functionality for the user profile page,
 * allowing navigation between different profile sections.
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

(function() {
    'use strict';

    /**
     * Initializes tab functionality for the profile page
     */
    function initProfileTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;

                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Hide all tab panes
                tabPanes.forEach(pane => pane.style.display = 'none');

                // Show selected tab
                document.getElementById(target).style.display = 'block';
            });
        });
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', initProfileTabs);

})();