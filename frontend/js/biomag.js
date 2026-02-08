    // Simple interactivity
    document.addEventListener('DOMContentLoaded', function() {
      // Animate toxin levels on scroll
      const toxinLevels = document.querySelectorAll('.toxin-level');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.transform = 'scale(1.1)';
            setTimeout(() => {
              entry.target.style.transform = 'scale(1)';
            }, 300);
          }
        });
      }, { threshold: 0.5 });
      
      toxinLevels.forEach(level => observer.observe(level));
      
      // Add click effects to cards
      const cards = document.querySelectorAll('.stat-card, .toxin-card, .step-card');
      cards.forEach(card => {
        card.addEventListener('click', function() {
          this.style.transform = 'scale(0.98)';
          setTimeout(() => {
            this.style.transform = '';
          }, 150);
        });
      });
    });