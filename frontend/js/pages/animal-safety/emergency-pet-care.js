// JS for Emergency Pet Care page
// Initializes AOS and loads page components (navbar, footer, share modal, cursor)
(function () {
  'use strict';

  function init() {
    try {
      if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 100 });
      }

      if (typeof loadComponent === 'function') {
        loadComponent('navbar-container', 'components/navbar.html');
        loadComponent('footer-container', 'components/footer.html');
        loadComponent('share-modal-container', 'components/share-modal.html');
        loadComponent('cursor-container', 'components/cursor.html');
      } else {
        // Fallback loader using fetch when loadComponent is not available
        var load = function(id, url, initFn) {
          fetch(url)
            .then(function(response) {
              if (!response.ok) throw new Error('Failed to load ' + url);
              return response.text();
            })
            .then(function(data) {
              var el = document.getElementById(id);
              if (el) el.innerHTML = data;
              if (initFn && typeof window[initFn] === 'function') window[initFn]();
            })
            .catch(function(err) {
              console.error('Error loading ' + id + ':', err);
              var el = document.getElementById(id);
              if (el) el.innerHTML = '<div style="padding: 20px; background: #f8d7da; color: #721c24; text-align: center;">' + id + ' failed to load</div>';
            });
        };

        load('navbar-container', 'components/navbar.html', 'initNavbar');
        load('footer-container', 'components/footer.html', 'initFooter');
        load('share-modal-container', 'components/share-modal.html');
        load('cursor-container', 'components/cursor.html', 'loadCursor');
      }

      if (typeof loadCursor === 'function') {
        loadCursor();
      }

      console.log('Emergency pet care page scripts initialized');
    } catch (e) {
      console.error('Error initializing emergency-pet-care.js', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
