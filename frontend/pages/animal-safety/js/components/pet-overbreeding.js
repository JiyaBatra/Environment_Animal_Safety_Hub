
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });

    
//  <!-- Theme Toggle Script -->

    (function() {
      console.log('=== THEME TOGGLE SCRIPT LOADED ===');
      
      // Get theme from localStorage or default to light
      const getCurrentTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
      };
      
      // Apply theme to document
      const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
          if (theme === 'dark') {
            themeToggle.classList.add('dark-active');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
          } else {
            themeToggle.classList.remove('dark-active');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
          }
        }
        console.log('Theme applied:', theme);
      };
      
      // Toggle theme
      const toggleTheme = () => {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        console.log('Theme toggled to:', newTheme);
      };
      
      // Initialize theme on page load
      const initTheme = () => {
        const theme = getCurrentTheme();
        applyTheme(theme);
      };
      
      // Scroll progress
      const updateScrollProgress = () => {
        const scrollProgress = document.getElementById('scrollProgress');
        if (scrollProgress) {
          const scrollTop = window.pageYOffset;
          const docHeight = document.body.scrollHeight - window.innerHeight;
          const scrollPercent = (scrollTop / docHeight) * 100;
          scrollProgress.style.width = scrollPercent + '%';
        }
      };
      
      // Counter animation
      const animateCounters = () => {
        const counters = document.querySelectorAll('.hero-stat-number');
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'));
          const increment = target / 100;
          let current = 0;
          
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };
          
          updateCounter();
        });
      };
      
      // Event listeners
      document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        animateCounters();
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
          themeToggle.addEventListener('click', toggleTheme);
        }
        
        window.addEventListener('scroll', updateScrollProgress);
      });
      
      // Expose functions globally
      window.toggleTheme = toggleTheme;
      window.applyTheme = applyTheme;
      
      console.log('=== THEME TOGGLE SCRIPT LOADED ===');
      
    })();
    