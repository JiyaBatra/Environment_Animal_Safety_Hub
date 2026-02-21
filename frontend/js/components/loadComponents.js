(function() {
    'use strict';

    console.warn("loadComponents.js is deprecated. Please use component-loader.js instead.");

    if (!document.querySelector('script[src*="component-loader.js"]')) {
        const script = document.createElement('script');

        // Always load from root frontend folder
        script.src = '/frontend/js/components/component-loader.js';

        document.head.appendChild(script);
    }
})();