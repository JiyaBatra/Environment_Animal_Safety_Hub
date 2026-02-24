// Coral Reef Soundscape Degradation - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initScrollAnimations();
  initStatCounters();
  initCardHoverEffects();
  initAudioControls();
  initFrequencyVisualizer();
  initCaseStudyAnimations();
});

// Scroll animations for sections
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all major sections
  const sections = document.querySelectorAll('.acoustic-section, .noise-section, .disruption-section, .interactive-section, .case-studies-section, .solutions-section, .cta-section');
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Animated counters for statistics
function initStatCounters() {
  const statCards = document.querySelectorAll('.stat-card h3');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const text = target.textContent;
        const isPercentage = text.includes('%');
        const isTimes = text.includes('x');
        const isHz = text.includes('Hz');
        const isHrs = text.includes('hrs');
        const isNumber = /^\d+$/.test(text.replace(/,/g, '').replace(/-/g, ''));

        if (isNumber || isPercentage || isTimes || isHz || isHrs) {
          animateCounter(target, text);
        }
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => {
    counterObserver.observe(card);
  });
}

// Counter animation function
function animateCounter(element, finalText) {
  if (element.hasAttribute('data-animated')) return;

  element.setAttribute('data-animated', 'true');

  // Extract number from text
  const numberMatch = finalText.match(/[\d,.-]+/);
  if (!numberMatch) return;

  const finalNumber = parseFloat(numberMatch[0].replace(/,/g, ''));
  const isPercentage = finalText.includes('%');
  const isTimes = finalText.includes('x');
  const isHz = finalText.includes('Hz');
  const isHrs = finalText.includes('hrs');

  let currentNumber = 0;
  const duration = 2000; // 2 seconds
  const steps = 60;
  const increment = finalNumber / steps;

  const timer = setInterval(() => {
    currentNumber += increment;
    if (currentNumber >= finalNumber) {
      currentNumber = finalNumber;
      clearInterval(timer);
    }

    let displayText = currentNumber.toFixed(finalNumber % 1 === 0 ? 0 : 1);
    if (finalNumber >= 1000) {
      displayText = Math.floor(currentNumber).toLocaleString();
    }

    if (isPercentage) displayText += '%';
    else if (isTimes) displayText += 'x';
    else if (isHz) displayText += 'Hz';
    else if (isHrs) displayText += ' hrs';

    element.textContent = displayText;
  }, duration / steps);
}

// Card hover effects
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.acoustic-card, .noise-source, .mechanism, .solution-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.02)';
      this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
    });
  });
}

// Audio controls functionality
function initAudioControls() {
  const healthyAudio = document.getElementById('healthyReefAudio');
  const degradedAudio = document.getElementById('degradedReefAudio');

  // Add loading states and error handling
  [healthyAudio, degradedAudio].forEach(audio => {
    audio.addEventListener('loadstart', function() {
      this.parentElement.classList.add('loading');
    });

    audio.addEventListener('canplay', function() {
      this.parentElement.classList.remove('loading');
    });

    audio.addEventListener('error', function() {
      this.parentElement.innerHTML += '<p style="color: #e74c3c; font-size: 0.9rem;">Audio sample not available</p>';
    });
  });

  // Pause other audio when one starts playing
  healthyAudio.addEventListener('play', () => {
    degradedAudio.pause();
  });

  degradedAudio.addEventListener('play', () => {
    healthyAudio.pause();
  });
}

// Frequency visualizer
function initFrequencyVisualizer() {
  const canvas = document.getElementById('frequencyCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const playHealthyBtn = document.getElementById('playHealthy');
  const playDegradedBtn = document.getElementById('playDegraded');
  const compareModeBtn = document.getElementById('compareMode');

  let isCompareMode = false;
  let animationId = null;
  let audioContext = null;
  let analyser = null;
  let dataArray = null;

  // Initialize Web Audio API
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
  }

  // Draw frequency bars
  function drawFrequencyBars() {
    if (!analyser || !dataArray) return;

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height;

      // Color based on frequency range
      let color;
      if (i < dataArray.length * 0.3) {
        color = '#3498db'; // Low frequencies (blue)
      } else if (i < dataArray.length * 0.7) {
        color = '#2ecc71'; // Mid frequencies (green)
      } else {
        color = '#e74c3c'; // High frequencies (red)
      }

      ctx.fillStyle = color;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }

    if (animationId) {
      animationId = requestAnimationFrame(drawFrequencyBars);
    }
  }

  // Simulate frequency data when no audio is playing
  function drawSimulatedData(type = 'healthy') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / 128) * 2.5;
    let x = 0;

    for (let i = 0; i < 128; i++) {
      let barHeight;

      if (type === 'healthy') {
        // Natural reef soundscape - more low frequency energy
        barHeight = Math.sin(i * 0.1) * 50 + Math.random() * 30 + 20;
      } else {
        // Degraded soundscape - more high frequency noise
        barHeight = Math.sin(i * 0.3) * 80 + Math.random() * 50 + 30;
      }

      let color;
      if (i < 40) {
        color = '#3498db'; // Low frequencies
      } else if (i < 80) {
        color = '#2ecc71'; // Mid frequencies
      } else {
        color = '#e74c3c'; // High frequencies
      }

      ctx.fillStyle = color;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  // Control buttons
  playHealthyBtn.addEventListener('click', () => {
    stopAnimation();
    drawSimulatedData('healthy');
    playHealthyBtn.style.background = '#27ae60';
    playDegradedBtn.style.background = '#3498db';
  });

  playDegradedBtn.addEventListener('click', () => {
    stopAnimation();
    drawSimulatedData('degraded');
    playDegradedBtn.style.background = '#e74c3c';
    playHealthyBtn.style.background = '#3498db';
  });

  compareModeBtn.addEventListener('click', () => {
    isCompareMode = !isCompareMode;
    if (isCompareMode) {
      compareModeBtn.textContent = 'Exit Compare';
      compareModeBtn.style.background = '#9b59b6';
      startComparison();
    } else {
      compareModeBtn.textContent = 'Compare Mode';
      compareModeBtn.style.background = '#3498db';
      stopAnimation();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  function startComparison() {
    let phase = 0;
    function animateComparison() {
      phase += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / 128) * 2.5;
      let x = 0;

      for (let i = 0; i < 128; i++) {
        // Alternate between healthy and degraded patterns
        const isHealthy = Math.sin(phase) > 0;
        let barHeight;

        if (isHealthy) {
          barHeight = Math.sin(i * 0.1) * 50 + Math.sin(phase * 2) * 20 + 20;
        } else {
          barHeight = Math.sin(i * 0.3) * 80 + Math.cos(phase * 3) * 30 + 30;
        }

        let color;
        if (i < 40) {
          color = isHealthy ? '#3498db' : '#8e44ad';
        } else if (i < 80) {
          color = isHealthy ? '#2ecc71' : '#e67e22';
        } else {
          color = isHealthy ? '#f39c12' : '#e74c3c';
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      if (isCompareMode) {
        animationId = requestAnimationFrame(animateComparison);
      }
    }
    animateComparison();
  }

  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // Initialize with healthy reef visualization
  drawSimulatedData('healthy');
}

// Case study animations
function initCaseStudyAnimations() {
  const caseStudies = document.querySelectorAll('.case-study');

  const caseObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('slide-in');
        }, index * 200);
      }
    });
  }, { threshold: 0.2 });

  caseStudies.forEach(study => {
    caseObserver.observe(study);
  });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .slide-in {
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .loading {
    opacity: 0.7;
    pointer-events: none;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

// Add responsive canvas handling
window.addEventListener('resize', function() {
  const canvas = document.getElementById('frequencyCanvas');
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 300;
  }
});</content>
<parameter name="filePath">c:\Users\Gupta\Downloads\Environment_Animal_Safety_Hub\frontend\js\pages\coral-reef-soundscape-degradation.js