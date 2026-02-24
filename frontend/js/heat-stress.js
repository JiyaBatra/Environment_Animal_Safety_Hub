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

    // Heat ripple animations
    function createHeatRipples() {
      const container = document.querySelector('.heat-ripples-container');
      if (!container) return;
      
      container.innerHTML = '';
      
      // Create multiple ripples
      for (let i = 0; i < 5; i++) {
        const ripple = document.createElement('div');
        ripple.className = 'heat-ripple';
        
        const left = 20 + Math.random() * 60;
        const top = 20 + Math.random() * 60;
        const delay = Math.random() * 3;
        const size = 100 + Math.random() * 200;
        
        ripple.style.cssText = `
          left: ${left}%;
          top: ${top}%;
          width: ${size}px;
          height: ${size}px;
          animation-delay: ${delay}s;
          border-color: rgba(231, 76, 60, ${0.2 + Math.random() * 0.3});
        `;
        
        container.appendChild(ripple);
      }
    }

    // Update heat stress indicator
    function updateStressIndicator() {
      const stressLevels = ['Low', 'Moderate', 'High', 'Critical'];
      const stressColors = ['#27AE60', '#F39C12', '#E67E22', '#E74C3C'];
      const markerPositions = [10, 40, 70, 95];
      
      // Cycle through stress levels for demo
      const stressIndex = Math.floor(Date.now() / 4000) % 4;
      
      const stressText = document.getElementById('stressText');
      const stressMarker = document.getElementById('stressMarker');
      const indicator = document.getElementById('stressIndicator');
      
      stressText.textContent = stressLevels[stressIndex];
      stressMarker.style.left = `${markerPositions[stressIndex]}%`;
      indicator.style.borderColor = stressColors[stressIndex];
      stressText.style.color = stressColors[stressIndex];
    }

    // Show symptom detail
    function showSymptomDetail(symptom) {
      const details = {
        panting: {
          title: "Excessive Panting & Drooling",
          content: "First sign of heat stress. Animals pant to evaporate moisture from respiratory tract. Excessive drooling indicates inability to cool effectively.",
          action: "Move to shade, offer water, monitor closely"
        },
        confusion: {
          title: "Confusion & Disorientation",
          content: "Brain overheating affects neurological function. May see stumbling, lack of coordination, glazed eyes. Body temperature typically 40-42°C.",
          action: "Emergency cooling required - wet towels, fan, vet call"
        },
        collapse: {
          title: "Collapse & Seizures",
          content: "Critical stage - multiple organ systems failing. Seizures indicate brain damage. Immediate veterinary intervention required for survival.",
          action: "IMMEDIATE veterinary emergency - cool while transporting"
        }
      };
      
      const detail = details[symptom];
      const panel = document.createElement('div');
      panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(10, 30, 44, 0.95);
        padding: 40px;
        border-radius: 25px;
        z-index: 1000;
        border: 3px solid var(--heat-red);
        backdrop-filter: blur(20px);
        max-width: 500px;
        width: 90%;
        color: white;
      `;
      
      panel.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 3rem; margin-bottom: 15px;">⚠️</div>
          <h3 style="color: #FFEAA7; margin-bottom: 10px;">${detail.title}</h3>
        </div>
        
        <div style="background: rgba(231, 76, 60, 0.1); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
          <p>${detail.content}</p>
        </div>
        
        <div style="background: rgba(243, 156, 18, 0.1); padding: 20px; border-radius: 15px;">
          <h4 style="color: #FFEAA7; margin-bottom: 10px;"><i class="fas fa-first-aid"></i> Required Action</h4>
          <p>${detail.action}</p>
        </div>
        
        <button onclick="this.parentElement.remove()" style="
          margin-top: 30px;
          padding: 12px 30px;
          background: var(--heat-red);
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          width: 100%;
        ">
          Close & Continue Learning
        </button>
      `;
      
      document.body.appendChild(panel);
    }

    // Emergency response simulator
    function checkAnswer(button, correctness) {
      const feedback = document.getElementById('responseFeedback');
      const patient = document.getElementById('animalPatient');
      
      // Reset all buttons
      document.querySelectorAll('.treatment-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
      });
      
      if (correctness === 'correct') {
        button.classList.add('correct');
        feedback.innerHTML = `
          <div style="color: var(--safe-green); text-align: center;">
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h4 style="margin: 10px 0;">Correct! This is the proper first response.</h4>
            <p>Gradual cooling with towels (not ice) prevents shock. Offering water helps with dehydration. Immediate veterinary follow-up is still required.</p>
          </div>
        `;
        
        // Animate improvement
        document.getElementById('bodyTemp').textContent = '41.0°C';
        document.getElementById('heartRate').textContent = '160 bpm';
        document.getElementById('respRate').textContent = '60/min';
        patient.style.animation = 'none';
        setTimeout(() => {
          patient.style.animation = 'pulseDanger 3s ease-in-out infinite';
        }, 10);
      } else {
        button.classList.add('incorrect');
        feedback.innerHTML = `
          <div style="color: var(--heat-red); text-align: center;">
            <i class="fas fa-times-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h4 style="margin: 10px 0;">Incorrect - This could worsen the situation</h4>
            <p>Ice water can cause shock. Exercise increases heat production. Feeding requires digestion energy that generates more heat.</p>
          </div>
        `;
        
        // Animate worsening
        document.getElementById('bodyTemp').textContent = '43.0°C';
        document.getElementById('heartRate').textContent = '200 bpm';
        patient.style.animation = 'pulseDanger 1s ease-in-out infinite';
      }
      
      feedback.style.display = 'block';
    }

    // Take heat safety pledge
    function takeHeatSafetyPledge() {
      const counter = document.getElementById('pledgeCount');
      let count = parseInt(counter.textContent.replace(/,/g, ''));
      count++;
      counter.textContent = count.toLocaleString();
      
      const button = document.querySelector('button[onclick="takeHeatSafetyPledge()"]');
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Pledge Taken!';
      button.style.background = 'linear-gradient(135deg, #27AE60, #2ECC71)';
      button.disabled = true;
      
      // Create cooling effect animation
      for (let i = 0; i < 3; i++) {
        createCoolingEffect();
      }
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
        button.disabled = false;
      }, 2000);
    }

    // Create cooling effect animation
    function createCoolingEffect() {
      const effect = document.createElement('div');
      effect.innerHTML = '❄️';
      effect.style.cssText = `
        position: fixed;
        bottom: 50px;
        left: ${30 + Math.random() * 40}%;
        font-size: 2rem;
        z-index: 1000;
        animation: coolDown 3s ease-out forwards;
        pointer-events: none;
        filter: drop-shadow(2px 2px 4px rgba(52, 152, 219, 0.5));
      `;
      
      document.body.appendChild(effect);
      
      // Create animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes coolDown {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) scale(0.3);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Remove after animation
      setTimeout(() => effect.remove(), 3000);
    }

    // Interactive physiology diagram
    function setupPhysiologyInteractions() {
      const organs = document.querySelectorAll('.organ');
      organs.forEach(organ => {
        organ.addEventListener('click', function() {
          const title = this.getAttribute('title');
          if (!title) return;
          
          const [organName, description] = title.split(' - ');
          
          const tooltip = document.createElement('div');
          tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 100;
            max-width: 250px;
            border: 2px solid var(--heat-red);
            font-size: 0.9rem;
          `;
          tooltip.innerHTML = `
            <strong style="color: #FFEAA7;">${organName}</strong><br>
            <span>${description}</span>
          `;
          
          const rect = this.getBoundingClientRect();
          tooltip.style.top = `${rect.top - 120}px`;
          tooltip.style.left = `${rect.left}px`;
          
          document.body.appendChild(tooltip);
          
          // Remove on click anywhere
          setTimeout(() => {
            document.addEventListener('click', function removeTooltip() {
              tooltip.remove();
              document.removeEventListener('click', removeTooltip);
            });
          }, 100);
        });
      });
    }

    // Initialize everything
    document.addEventListener('DOMContentLoaded', function() {
      createHeatRipples();
      setupPhysiologyInteractions();
      
      // Update stress indicator every 4 seconds
      setInterval(updateStressIndicator, 4000);
      
      // Create new ripples periodically
      setInterval(createHeatRipples, 5000);
      
      // Make functions available globally
      window.showSymptomDetail = showSymptomDetail;
      window.checkAnswer = checkAnswer;
      window.takeHeatSafetyPledge = takeHeatSafetyPledge;
      
      // Add keypress to close panels with Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('div[style*="position: fixed"][style*="transform: translate(-50%, -50%)"]').forEach(panel => {
            panel.remove();
          });
        }
      });
    });