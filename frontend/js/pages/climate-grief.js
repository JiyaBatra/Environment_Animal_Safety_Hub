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

    // Create falling teardrops
    function createTeardrops() {
      const container = document.querySelector('.teardrops-container');
      if (!container) return;
      
      // Clear existing teardrops
      container.innerHTML = '';
      
      // Create 20 teardrops
      for (let i = 0; i < 20; i++) {
        const teardrop = document.createElement('div');
        teardrop.className = 'teardrop';
        
        // Random properties
        const left = Math.random() * 100;
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        const size = 8 + Math.random() * 12;
        
        teardrop.style.cssText = `
          left: ${left}%;
          width: ${size}px;
          height: ${size * 1.5}px;
          animation-duration: ${duration}s;
          animation-delay: ${delay}s;
        `;
        
        container.appendChild(teardrop);
      }
    }

    // Scroll animations for habitat cards
    function animateOnScroll() {
      const cards = document.querySelectorAll('.habitat-card');
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Add staggered animation
            const delay = Array.from(cards).indexOf(entry.target) * 200;
            entry.target.style.transitionDelay = `${delay}ms`;
          }
        });
      }, observerOptions);

      cards.forEach(card => observer.observe(card));
    }

    // Candle lighting functionality
    function lightCandle() {
      const candleDisplay = document.getElementById('candleDisplay');
      candleDisplay.style.display = 'block';
      
      // Create flicker animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `;
      document.head.appendChild(style);
      
      // Show message
      setTimeout(() => {
        const messages = [
          "Your candle joins thousands of others in remembrance.",
          "Each candle represents a commitment to protect what remains.",
          "The light of awareness can drive out the darkness of indifference.",
          "We remember so we may act differently."
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
          margin-top: 15px;
          padding: 15px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          font-style: italic;
          color: #FFEAA7;
        `;
        messageDiv.textContent = randomMessage;
        
        candleDisplay.appendChild(messageDiv);
      }, 1000);
      
      // Update global candle count (simulated)
      const candleCount = localStorage.getItem('climateCandles') || 0;
      localStorage.setItem('climateCandles', parseInt(candleCount) + 1);
      
      // Show total candles
      setTimeout(() => {
        const totalDiv = document.createElement('div');
        totalDiv.style.cssText = `
          margin-top: 10px;
          font-size: 0.9rem;
          color: #BDC3C7;
        `;
        totalDiv.innerHTML = `<i class="fas fa-fire"></i> ${parseInt(candleCount) + 1} candles lit today`;
        candleDisplay.appendChild(totalDiv);
      }, 2000);
    }

    // Journal functionality
    function saveJournalEntry() {
      const textarea = document.querySelector('.journal-textarea');
      const messageDiv = document.getElementById('journalMessage');
      
      if (textarea.value.trim() === '') {
        messageDiv.textContent = "Please write something first.";
        messageDiv.style.background = '#FFEAA7';
        messageDiv.style.color = '#2C3E50';
      } else {
        messageDiv.textContent = "Entry saved. Your feelings matter. ❤️";
        messageDiv.style.background = '#D1F2EB';
        messageDiv.style.color = '#27AE60';
        
        // In a real app, this would save to a database
        const entries = JSON.parse(localStorage.getItem('climateJournal') || '[]');
        entries.push({
          text: textarea.value,
          date: new Date().toISOString()
        });
        localStorage.setItem('climateJournal', JSON.stringify(entries));
        
        // Clear textarea
        textarea.value = '';
      }
      
      messageDiv.style.display = 'block';
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 3000);
    }

    function shareJournalEntry() {
      const textarea = document.querySelector('.journal-textarea');
      const messageDiv = document.getElementById('journalMessage');
      
      if (textarea.value.trim() === '') {
        messageDiv.textContent = "Write something meaningful to share.";
        messageDiv.style.background = '#FFEAA7';
        messageDiv.style.color = '#2C3E50';
      } else {
        messageDiv.innerHTML = `
          <i class="fas fa-share-alt"></i> Share this thought with others feeling climate grief:<br><br>
          <div style="background: white; padding: 15px; border-radius: 10px; margin: 10px 0; color: #2C3E50;">
            "${textarea.value.substring(0, 100)}${textarea.value.length > 100 ? '...' : ''}"
          </div>
          <button onclick="navigator.clipboard.writeText('Climate grief thought: ' + encodeURIComponent('${textarea.value.substring(0, 200)}...'))" style="
            padding: 8px 20px;
            background: var(--grief-blue);
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            margin-top: 10px;
          ">
            <i class="fas fa-copy"></i> Copy to Share
          </button>
        `;
        messageDiv.style.background = '#E8F4FC';
        messageDiv.style.color = '#2C3E50';
      }
      
      messageDiv.style.display = 'block';
    }

    // Pledge functionality
    function takePledge() {
      const pledgeCount = document.getElementById('pledgeNumber');
      let count = parseInt(pledgeCount.textContent.replace(/,/g, ''));
      count++;
      pledgeCount.textContent = count.toLocaleString();
      
      // Show confirmation
      const button = document.querySelector('button[onclick="takePledge()"]');
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Pledge Taken!';
      button.style.background = '#FFEAA7';
      button.style.color = '#2C3E50';
      button.disabled = true;
      
      // Create floating hearts
      for (let i = 0; i < 5; i++) {
        createFloatingHeart();
      }
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
        button.style.color = '';
        button.disabled = false;
      }, 2000);
    }

    function createFloatingHeart() {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.cssText = `
        position: fixed;
        bottom: 50px;
        left: ${50 + Math.random() * 50}%;
        font-size: 2rem;
        z-index: 1000;
        animation: floatUp 2s ease-out forwards;
        pointer-events: none;
      `;
      
      document.body.appendChild(heart);
      
      // Create animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Remove after animation
      setTimeout(() => heart.remove(), 2000);
    }

    // Interactive animal stories
    document.addEventListener('DOMContentLoaded', function() {
      createTeardrops();
      animateOnScroll();
      
      // Update teardrops periodically
      setInterval(createTeardrops, 15000);
      
      // Add click effects to habitat cards
      const cards = document.querySelectorAll('.habitat-card');
      cards.forEach(card => {
        card.addEventListener('click', function() {
          const animal = this.querySelector('.animal-focus').textContent;
          const habitat = this.querySelector('.habitat-title').textContent;
          
          // Create a ripple effect
          const ripple = document.createElement('div');
          ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(93, 173, 226, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
          `;
          
          // Add animation
          const rippleStyle = document.createElement('style');
          rippleStyle.textContent = `
            @keyframes ripple {
              to {
                transform: scale(4);
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(rippleStyle);
          
          this.appendChild(ripple);
          
          // Remove ripple after animation
          setTimeout(() => ripple.remove(), 600);
          
          // Show animal sound (simulated)
          const sounds = {
            'Polar Bears': '🐻‍❄️ The sound of ice cracking...',
            'Orangutans': '🦧 A mournful call echoing through empty forests...',
            'Whales': '🐋 A whale song changing frequency...'
          };
          
          for (const [key, sound] of Object.entries(sounds)) {
            if (animal.includes(key)) {
              showSoundNotification(sound);
              break;
            }
          }
        });
      });
      
      // Add hover effects to memorial cards
      const memorialCards = document.querySelectorAll('.memorial-card');
      memorialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
          const extinctLabel = this.querySelector('.extinct-label');
          if (extinctLabel) {
            extinctLabel.style.transform = 'scale(1.1)';
            extinctLabel.style.transition = 'transform 0.3s ease';
          }
        });
        
        card.addEventListener('mouseleave', function() {
          const extinctLabel = this.querySelector('.extinct-label');
          if (extinctLabel) {
            extinctLabel.style.transform = 'scale(1)';
          }
        });
      });
    });

    function showSoundNotification(message) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(44, 62, 80, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1000;
        border-left: 4px solid var(--grief-blue);
        animation: slideIn 0.3s ease;
        max-width: 300px;
      `;
      
      notification.innerHTML = `
        <i class="fas fa-volume-up" style="margin-right: 10px;"></i>
        ${message}
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
      
      // Add animation styles if not present
      if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Make functions available globally
    window.lightCandle = lightCandle;
    window.saveJournalEntry = saveJournalEntry;
    window.shareJournalEntry = shareJournalEntry;
    window.takePledge = takePledge;