    AOS.init({
      duration: 800,
      once: true
    });

    // Invasion counter
    let invasionCount = 1873;
    const invasionCounter = document.getElementById('invasionCounter');
    
    function updateInvasionCounter() {
      // Based on estimated 5,000 new introductions per year globally
      invasionCount += Math.random() * 0.05;
      invasionCounter.textContent = Math.floor(invasionCount);
    }
    setInterval(updateInvasionCounter, 1000);

    // Create invasion animation dots
    function createInvasionDots() {
      const container = document.getElementById('invasiveDots');
      const dotCount = 15;
      
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'invasive-dot';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const x = 150 + Math.cos(angle) * distance;
        const y = 150 + Math.sin(angle) * distance;
        
        dot.style.left = `${x - 10}px`;
        dot.style.top = `${y - 10}px`;
        dot.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(dot);
      }
    }

    // Region data
    const regionData = {
      'north-america': {
        title: 'North America',
        species: '7,000+ invasive species',
        impact: '$137 billion annual economic damage',
        examples: [
          'Emerald ash borer (destroyed 100M+ trees)',
          'Zebra mussel ($1B annual damage)',
          'Burmese python (90-99% mammal loss in Everglades)',
          'Kudzu vine (covers 7M acres)'
        ],
        control: 'Early detection networks, public reporting apps, eradication programs'
      },
      'europe': {
        title: 'Europe',
        species: '4,500+ invasive species',
        impact: '€12 billion annual economic damage',
        examples: [
          'Grey squirrel (displacing native red squirrels)',
          'Asian hornet (threatening honeybee populations)',
          'Japanese knotweed (damaging infrastructure)',
          'American mink (decimating water vole populations)'
        ],
        control: 'EU Regulation 1143/2014, rapid response systems, border controls'
      },
      'australia': {
        title: 'Australia',
        species: '3,200+ invasive species',
        impact: 'AUD$13.6 billion annual economic damage',
        examples: [
          'Cane toad (toxic to native predators)',
          'European rabbit (vegetation destruction)',
          'Feral cat (kills 2B native animals annually)',
          'Buffel grass (increases wildfire risk)'
        ],
        control: 'Biosecurity Act 2015, national feral cat taskforce, biological controls'
      },
      'africa': {
        title: 'Africa',
        species: '2,800+ invasive species',
        impact: '$65 billion annual economic damage',
        examples: [
          'Water hyacinth (chokes waterways)',
          'Prosopis juliflora (reduces grazing land)',
          'Fall armyworm (crop destruction)',
          'Lantana camara (displaces native plants)'
        ],
        control: 'African Union strategy, community-based management, biological control'
      },
      'asia': {
        title: 'Asia',
        species: '5,500+ invasive species',
        impact: '$105 billion annual economic damage',
        examples: [
          'Apple snail (rice crop destruction)',
          'Water lettuce (clogs irrigation systems)',
          'Common myna (competes with native birds)',
          'Mimosa pigra (forms impenetrable thickets)'
        ],
        control: 'ASEAN cooperation, early warning systems, integrated management'
      }
    };

    // Show region information
    function showRegionInfo(regionId) {
      const data = regionData[regionId];
      const infoDiv = document.getElementById('regionInfo');
      
      infoDiv.innerHTML = `
        <h4 style="color: #FFEAA7; margin-bottom: 15px;">${data.title} - Invasive Species Impact</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div style="padding: 15px; background: rgba(231, 76, 60, 0.1); border-radius: 8px;">
            <div style="font-size: 0.9rem; color: #BDC3C7;">Total Invasive Species</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #E74C3C;">${data.species}</div>
          </div>
          <div style="padding: 15px; background: rgba(231, 76, 60, 0.1); border-radius: 8px;">
            <div style="font-size: 0.9rem; color: #BDC3C7;">Annual Economic Damage</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #E67E22;">${data.impact}</div>
          </div>
        </div>
        
        <h5 style="color: #FFEAA7; margin-bottom: 10px;">Notable Invasive Species:</h5>
        <ul style="color: #D5DBDB; margin-bottom: 20px; padding-left: 20px;">
          ${data.examples.map(example => `<li>${example}</li>`).join('')}
        </ul>
        
        <h5 style="color: #FFEAA7; margin-bottom: 10px;">Control Strategies:</h5>
        <p style="color: #D5DBDB;">${data.control}</p>
        
        <button onclick="openRegionModal('${regionId}')" style="margin-top: 15px; padding: 10px 20px; background: var(--invasive-red); color: white; border: none; border-radius: 5px; cursor: pointer;">
          View Detailed Report
        </button>
      `;
      
      infoDiv.style.display = 'block';
    }

    // Open region modal
    function openRegionModal(regionId) {
      const data = regionData[regionId];
      const modal = document.getElementById('regionModal');
      const title = document.getElementById('modalRegionTitle');
      const body = document.getElementById('modalRegionBody');
      
      title.textContent = data.title;
      
      body.innerHTML = `
        <div style="margin-bottom: 30px;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
            <div style="padding: 20px; background: rgba(231, 76, 60, 0.1); border-radius: 10px;">
              <div style="font-size: 0.9rem; color: #BDC3C7;">Invasive Species Count</div>
              <div style="font-size: 2rem; font-weight: bold; color: #E74C3C;">${data.species.split('+')[0]}+</div>
            </div>
            <div style="padding: 20px; background: rgba(230, 126, 34, 0.1); border-radius: 10px;">
              <div style="font-size: 0.9rem; color: #BDC3C7;">Economic Impact</div>
              <div style="font-size: 1.5rem; font-weight: bold; color: #E67E22;">${data.impact}</div>
            </div>
          </div>
        </div>
        
        <h4 style="color: #FFEAA7; margin-bottom: 15px;"><i class="fas fa-exclamation-triangle"></i> Major Threats</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
          ${data.examples.map((example, index) => `
            <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid ${index % 2 === 0 ? '#E74C3C' : '#E67E22'};">
              <div style="font-weight: bold; color: #FFEAA7;">${example.split('(')[0]}</div>
              <div style="color: #D5DBDB; font-size: 0.9rem; margin-top: 5px;">${example.split('(')[1]?.replace(')', '') || 'Significant impact'}</div>
            </div>
          `).join('')}
        </div>
        
        <h4 style="color: #FFEAA7; margin-bottom: 15px;"><i class="fas fa-shield-alt"></i> Management Strategies</h4>
        <p style="color: #D5DBDB; margin-bottom: 25px;">${data.control}</p>
        
        <div style="padding: 20px; background: rgba(52, 152, 219, 0.1); border-radius: 10px;">
          <h5 style="color: #FFEAA7; margin-bottom: 10px;"><i class="fas fa-lightbulb"></i> How You Can Help</h5>
          <p style="color: #D5DBDB;">Report invasive species sightings through official channels, clean outdoor equipment, and choose native plants for landscaping.</p>
          <button onclick="closeRegionModal()" style="margin-top: 15px; padding: 10px 20px; background: var(--prevention-blue); color: white; border: none; border-radius: 5px; cursor: pointer;">
            Learn More About Prevention
          </button>
        </div>
      `;
      
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    // Close region modal
    function closeRegionModal() {
      const modal = document.getElementById('regionModal');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    // Quiz functionality
    function checkAnswer(button, correctness) {
      const feedback = document.getElementById('quizFeedback');
      const options = document.querySelectorAll('.quiz-option');
      
      // Reset all options
      options.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
      });
      
      if (correctness === 'correct') {
        button.classList.add('correct');
        feedback.innerHTML = `
          <div style="color: var(--control-green); text-align: center;">
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h4 style="margin: 10px 0;">Correct!</h4>
            <p>Human activities like international trade, travel, and the pet industry account for over 80% of invasive species introductions worldwide.</p>
          </div>
        `;
      } else {
        button.classList.add('incorrect');
        feedback.innerHTML = `
          <div style="color: var(--invasive-red); text-align: center;">
            <i class="fas fa-times-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h4 style="margin: 10px 0;">Not quite right</h4>
            <p>While climate change can help invasive species spread, the primary cause of introductions is human activity through trade, travel, and accidental or intentional releases.</p>
          </div>
        `;
      }
      
      feedback.style.display = 'block';
    }

    // Animate timeline on scroll
    function animateTimeline() {
      const items = document.querySelectorAll('.timeline-item');
      
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          setTimeout(() => {
            item.classList.add('visible');
          }, index * 200);
        }
      });
    }

    // Initialize everything
    function init() {
      createInvasionDots();
      
      // Add hover effects to map regions
      const regions = document.querySelectorAll('.map-region');
      regions.forEach(region => {
        region.addEventListener('mouseenter', () => {
          region.style.transform = 'scale(1.15)';
        });
        
        region.addEventListener('mouseleave', () => {
          region.style.transform = 'scale(1)';
        });
      });
      
      // Set up scroll listener for timeline
      window.addEventListener('scroll', animateTimeline);
      animateTimeline(); // Initial check
      
      // Close modal on outside click
      document.getElementById('regionModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('law-modal')) {
          closeRegionModal();
        }
      });
      
      // Close modal with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeRegionModal();
      });
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', init);