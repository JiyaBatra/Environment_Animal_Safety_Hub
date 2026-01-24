/**
 * Navbar Loader Module (Deprecated)
 *
 * This module is deprecated. Use component-loader.js instead.
 * Automatically loads component-loader.js if not already present.
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @deprecated Use component-loader.js instead
 * @since 2024
 */

(function() {
    'use strict';

    console.warn("navbar-loader.js is deprecated. Please use component-loader.js instead.");

    if (!document.querySelector('script[src*="component-loader.js"]')) {
        const script = document.createElement('script');
        // Simple prefix logic for fallback
        let prefix = window.location.pathname.includes('/pages/') ?
            (window.location.pathname.split('pages')[1].split('/').length > 2 ? '../../' : '../') : '';
        script.src = prefix + 'js/components/component-loader.js';
        document.head.appendChild(script);
    }
})();