    // Load navbar and footer
    fetch('../components/navbar.html')
      .then(r => r.text())
      .then(html => {
        document.getElementById('navbar-container').innerHTML = html;
      });
    
    fetch('../components/footer.html')
      .then(r => r.text())
      .then(html => {
        document.getElementById('footer-container').innerHTML = html;
      });

    // Quiz functionality
    function checkAnswer(button, correctness) {
      const feedback = document.getElementById('quizFeedback');
      const options = document.querySelectorAll('.quiz-option');
      
      // Reset all options
      options.forEach(opt => {
        opt.style.background = '';
        opt.style.border = '';
      });
      
      if (correctness === 'correct') {
        button.style.background = 'rgba(39, 174, 96, 0.3)';
        button.style.border = '2px solid var(--communication-green)';
        feedback.innerHTML = `
          <div style="color: var(--communication-green);">
            <i class="fas fa-check-circle"></i> <strong>Correct!</strong> Dogs can hear ultrasonic frequencies above 20,000 Hz that humans cannot detect.
          </div>
        `;
      } else {
        button.style.background = 'rgba(231, 76, 60, 0.3)';
        button.style.border = '2px solid var(--infrared-red)';
        feedback.innerHTML = `
          <div style="color: var(--infrared-red);">
            <i class="fas fa-times-circle"></i> <strong>Try again!</strong> Dogs hear ultrasonic sounds above 20,000 Hz, while humans max out around 20,000 Hz.
          </div>
        `;
      }
      
      feedback.style.display = 'block';
    }

    // Add sound wave animations
    function createSoundWaves() {
      const container = document.querySelector('.animal-card.whale .viz-container');
      if (!container) return;
      
      // Clear and create new waves
      const waves = container.querySelectorAll('.sound-wave');
      waves.forEach(wave => {
        const randomDelay = Math.random() * 2;
        wave.style.animationDelay = `${randomDelay}s`;
      });
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', function() {
      createSoundWaves();
      
      // Make function available globally
      window.checkAnswer = checkAnswer;
    });