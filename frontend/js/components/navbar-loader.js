/**
 * Navbar Loader
 * Loads the common navbar component into all pages
 */

document.addEventListener("DOMContentLoaded", function () {
    loadNavbar();
});

async function loadNavbar() {
    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) return;

    // Determine prefix based on current path depth
    let prefix = '';
    const path = window.location.pathname;
    
    if (path.includes('/pages/')) {
        const pathParts = path.split('/');
        const pagesIndex = pathParts.indexOf('pages');
        // If we are deeper than /pages/page.html (e.g. /pages/blogs/post.html)
        if (pagesIndex !== -1 && pagesIndex < pathParts.length - 2) {
            prefix = '../../';
        } else {
            prefix = '../';
        }
    }

    // Ensure FontAwesome is available for icons
    if (!document.querySelector('link[href*="font-awesome"]') && !document.querySelector('link[href*="all.min.css"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    const navbarPath = prefix + 'components/navbar.html';

    // Load theme-toggle.js if not already present
    if (!window.initThemeToggle && !document.querySelector('script[src*="theme-toggle.js"]')) {
        const themeScript = document.createElement('script');
        themeScript.src = prefix + 'js/global/theme-toggle.js';
        themeScript.onload = () => {
            if (typeof initThemeToggle === 'function') initThemeToggle();
        };
        document.head.appendChild(themeScript);
    } else if (typeof initThemeToggle === 'function') {
        initThemeToggle();
    }

    try {
        const response = await fetch(navbarPath);
        if (!response.ok) throw new Error('Failed to load navbar');
        const html = await response.text();
        navbarContainer.innerHTML = html;

        // Check Login State
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        navbarContainer.setAttribute('data-logged-in', isLoggedIn);

        // Hide Login/Signup button if already on that page
        if (!isLoggedIn) {
            const currentPage = window.location.pathname.toLowerCase();
            if (currentPage.includes('login.html')) {
                const navLoginBtn = navbarContainer.querySelector('.btn-login');
                if (navLoginBtn) navLoginBtn.style.display = 'none';
            } else if (currentPage.includes('signup.html')) {
                const navSignupBtn = navbarContainer.querySelector('.btn-signup');
                if (navSignupBtn) navSignupBtn.style.display = 'none';
            }
        }

        // Initialize navbar core logic
        initNavbarLogic(isLoggedIn);
        
        // Re-init theme toggle if navbar was just injected
        if (typeof initThemeToggle === 'function') {
            initThemeToggle();
        }
        
        // Update paths for sub-pages
        updateNavbarPaths(prefix);
        
        // Check for active link
        highlightActiveLink();

    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

function initNavbarLogic(isLoggedIn) {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar ? navbar.classList.add('scrolled') : null;
        } else {
            navbar ? navbar.classList.remove('scrolled') : null;
        }
    });

    // Profile Dropdown & Logout
    if (isLoggedIn) {
        const profileMenu = document.getElementById('profileMenu');
        const profileDropdown = document.querySelector('.profile-dropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (profileMenu && profileDropdown) {
            profileMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                profileDropdown.classList.remove('active');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userName');
                window.location.reload();
            });
        }
    }
}

function updateNavbarPaths(prefix) {
    if (!prefix) return; // Already at root

    const container = document.getElementById("navbar-container");
    const links = container.querySelectorAll('a');
    const images = container.querySelectorAll('img');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            link.setAttribute('href', prefix + href);
        }
    });

    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http')) {
            img.setAttribute('src', prefix + src);
        }
    });
}

function highlightActiveLink() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && path.endsWith(href.replace('../', '').replace('../../', ''))) {
            link.classList.add('active');
        }
    });
}
