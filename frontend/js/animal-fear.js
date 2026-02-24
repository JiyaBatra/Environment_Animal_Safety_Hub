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

    // Global state
    let currentPerspective = 'human';
    let currentZone = null;
    let currentAnimal = 'dog';

    // Perception data for each location
    const perceptionData = {
      road: {
        name: "BUSY ROAD",
        icon: "fas fa-road",
        human: {
          sound: { value: "75 dB", level: 75, description: "Traffic noise, horns" },
          smell: { value: "Moderate", level: 60, description: "Exhaust fumes, occasional food" },
          threat: { value: "Low", level: 30, description: "Rules provide safety" },
          stress: { value: "Low", level: 20, description: "Familiar environment" }
        },
        animal: {
          sound: { value: "110 dB", level: 90, description: "Painful roar like jet engine" },
          smell: { value: "Extreme", level: 95, description: "Overpowering chemical cocktail" },
          threat: { value: "Extreme", level: 95, description: "Unpredictable fast-moving death" },
          stress: { value: "Severe", level: 90, description: "Constant fight-or-flight" }
        },
        reactions: [
          { icon: "fas fa-running", text: "Panic running across" },
          { icon: "fas fa-car-crash", text: "Vehicle collision risk" },
          { icon: "fas fa-deaf", text: "Temporary hearing loss" },
          { icon: "fas fa-heart", text: "Heart rate doubles" }
        ]
      },
      market: {
        name: "MARKET",
        icon: "fas fa-shopping-cart",
        human: {
          sound: { value: "70 dB", level: 70, description: "Crowd chatter, vendors" },
          smell: { value: "Varied", level: 50, description: "Food, spices, people" },
          threat: { value: "Very Low", level: 10, description: "Social space" },
          stress: { value: "Low", level: 30, description: "Some crowding" }
        },
        animal: {
          sound: { value: "90 dB", level: 80, description: "Overwhelming chaotic noise" },
          smell: { value: "Overload", level: 85, description: "Thousands of conflicting scents" },
          threat: { value: "High", level: 70, description: "Trapped with predators" },
          stress: { value: "High", level: 75, description: "No escape routes" }
        },
        reactions: [
          { icon: "fas fa-hide", text: "Hide under stalls" },
          { icon: "fas fa-search", text: "Desperate food search" },
          { icon: "fas fa-fight", text: "Aggressive defense" },
          { icon: "fas fa-escape", text: "Attempt escape" }
        ]
      },
      school: {
        name: "SCHOOL",
        icon: "fas fa-school",
        human: {
          sound: { value: "65 dB", level: 65, description: "Children playing, bells" },
          smell: { value: "Mild", level: 40, description: "Chalk, food, cleaning" },
          threat: { value: "None", level: 5, description: "Safe learning space" },
          stress: { value: "Low", level: 25, description: "Routine environment" }
        },
        animal: {
          sound: { value: "85 dB", level: 75, description: "High-pitched unpredictable screams" },
          smell: { value: "Intense", level: 70, description: "Fear pheromones, chemicals" },
          threat: { value: "Medium", level: 60, description: "Curious unpredictable beings" },
          stress: { value: "Medium", level: 65, description: "No safe hiding spots" }
        },
        reactions: [
          { icon: "fas fa-climb", text: "Climb fences/walls" },
          { icon: "fas fa-dig", text: "Dig to escape" },
          { icon: "fas fa-freeze", text: "Freeze in place" },
          { icon: "fas fa-nest", text: "Abandon nests" }
        ]
      },
      festival: {
        name: "FESTIVAL",
        icon: "fas fa-music",
        human: {
          sound: { value: "85 dB", level: 85, description: "Music, celebration" },
          smell: { value: "Festive", level: 55, description: "Food, smoke, perfume" },
          threat: { value: "Low", level: 20, description: "Controlled fun" },
          stress: { value: "Medium", level: 50, description: "Crowds but enjoyable" }
        },
        animal: {
          sound: { value: "120+ dB", level: 98, description: "Earth-shaking explosions" },
          smell: { value: "Toxic", level: 90, description: "Fireworks chemicals, alcohol" },
          threat: { value: "Extreme", level: 95, description: "Apocalypse simulation" },
          stress: { value: "Severe", level: 95, description: "Complete sensory overload" }
        },
        reactions: [
          { icon: "fas fa-panic", text: "Complete panic" },
          { icon: "fas fa-injured", text: "Self-injury attempts" },
          { icon: "fas fa-lost", text: "Get lost permanently" },
          { icon: "fas fa-shock", text: "Traumatic shock" }
        ]
      },
      park: {
        name: "CITY PARK",
        icon: "fas fa-tree",
        human: {
          sound: { value: "55 dB", level: 55, description: "Birds, gentle activity" },
          smell: { value: "Natural", level: 45, description: "Grass, trees, flowers" },
          threat: { value: "None", level: 5, description: "Relaxation space" },
          stress: { value: "Very Low", level: 15, description: "Peaceful retreat" }
        },
        animal: {
          sound: { value: "75 dB", level: 65, description: "Constant human intrusion" },
          smell: { value: "Contaminated", level: 60, description: "Dog urine, trash, pesticides" },
          threat: { value: "Medium", level: 50, description: "Predators on leashes" },
          stress: { value: "Medium", level: 55, description: "No true wilderness" }
        },
        reactions: [
          { icon: "fas fa-night", text: "Become nocturnal" },
          { icon: "fas fa-camouflage", text: "Perfect camouflage" },
          { icon: "fas fa-burrow", text: "Create deep burrows" },
          { icon: "fas fa-avoid", text: "Avoid open areas" }
        ]
      },
      residential: {
        name: "RESIDENTIAL AREA",
        icon: "fas fa-home",
        human: {
          sound: { value: "50 dB", level: 50, description: "Quiet neighborhood" },
          smell: { value: "Homey", level: 35, description: "Cooking, gardens" },
          threat: { value: "None", level: 0, description: "Safe home" },
          stress: { value: "Very Low", level: 10, description: "Comfort zone" }
        },
        animal: {
          sound: { value: "70 dB", level: 60, description: "Constant TV, appliances" },
          smell: { value: "Confusing", level: 65, description: "Cleaning chemicals, pets" },
          threat: { value: "High", level: 65, description: "Territory conflicts" },
          stress: { value: "High", level: 70, description: "No natural territory" }
        },
        reactions: [
          { icon: "fas fa-garbage", text: "Raid trash cans" },
          { icon: "fas fa-fight", text: "Fight over territory" },
          { icon: "fas fa-adapt", text: "Adapt unnatural diets" },
          { icon: "fas fa-sick", text: "Develop illnesses" }
        ]
      },
      industrial: {
        name: "INDUSTRIAL ZONE",
        icon: "fas fa-industry",
        human: {
          sound: { value: "80 dB", level: 80, description: "Machinery, work" },
          smell: { value: "Industrial", level: 70, description: "Chemicals, fuel" },
          threat: { value: "Medium", level: 40, description: "Safety protocols" },
          stress: { value: "Medium", level: 60, description: "Work environment" }
        },
        animal: {
          sound: { value: "100+ dB", level: 85, description: "Deafening constant vibration" },
          smell: { value: "Poisonous", level: 95, description: "Toxic chemical clouds" },
          threat: { value: "Extreme", level: 90, description: "Invisible deadly threats" },
          stress: { value: "Severe", level: 85, description: "Environmental poisoning" }
        },
        reactions: [
          { icon: "fas fa-death", text: "Slow poisoning" },
          { icon: "fas fa-mutate", text: "Genetic mutations" },
          { icon: "fas fa-abandon", text: "Abandon young" },
          { icon: "fas fa-migrate", text: "Forced migration" }
        ]
      }
    };

    // Animal perspective data
    const animalPerspectives = {
      dog: { name: "Dog", icon: "fas fa-dog", color: "#F39C12", hearing: "4x human", smell: "10,000x better" },
      cat: { name: "Cat", icon: "fas fa-cat", color: "#8E44AD", hearing: "3x human", smell: "14x better" },
      bird: { name: "Bird", icon: "fas fa-dove", color: "#3498DB", hearing: "Similar", smell: "Poor", vision: "UV capable" },
      deer: { name: "Deer", icon: "fas fa-deer", color: "#8B4513", hearing: "Excellent", smell: "Superior", vision: "300°" },
      rat: { name: "Rat", icon: "fas fa-rat", color: "#7F8C8D", hearing: "Ultrasound", smell: "Excellent", whiskers: "Vibration" }
    };

    // Set perspective (human or animal)
    function setPerspective(perspective) {
      currentPerspective = perspective;
      
      // Update toggle buttons
      document.querySelectorAll('.perspective-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`.${perspective}-btn`).classList.add('active');
      
      // Update perspective indicator
      const indicator = document.getElementById('perspectiveIndicator');
      if (perspective === 'animal') {
        indicator.innerHTML = '<i class="fas fa-paw"></i> Animal View';
        indicator.style.background = 'rgba(231, 76, 60, 0.3)';
        indicator.style.color = '#FF6B6B';
        indicator.style.borderColor = 'rgba(231, 76, 60, 0.5)';
      } else {
        indicator.innerHTML = '<i class="fas fa-user"></i> Human View';
        indicator.style.background = 'rgba(52, 152, 219, 0.3)';
        indicator.style.color = '#5DADE2';
        indicator.style.borderColor = 'rgba(52, 152, 219, 0.5)';
      }
      
      // Update map visuals
      updateMapVisuals();
      
      // Refresh current zone if open
      if (currentZone) {
        showPerception(currentZone);
      }
    }

    // Show perception for a specific zone
    function showPerception(zone) {
      currentZone = zone;
      const data = perceptionData[zone];
      const panel = document.getElementById('perceptionPanel');
      const perspective = currentPerspective === 'animal' ? data.animal : data.human;
      
      // Update panel content
      document.getElementById('panelTitle').textContent = data.name;
      document.getElementById('panelIcon').innerHTML = `<i class="${data.icon}"></i>`;
      document.getElementById('panelIcon').style.background = getZoneColor(zone);
      
      // Update metrics
      updateMetric('sound', perspective.sound);
      updateMetric('smell', perspective.smell);
      updateMetric('threat', perspective.threat);
      updateMetric('stress', perspective.stress);
      
      // Update reactions
      const reactionGrid = document.getElementById('reactionGrid');
      reactionGrid.innerHTML = '';
      data.reactions.forEach(reaction => {
        const div = document.createElement('div');
        div.className = 'reaction-item';
        div.innerHTML = `
          <div class="reaction-icon">
            <i class="${reaction.icon}"></i>
          </div>
          <span>${reaction.text}</span>
        `;
        reactionGrid.appendChild(div);
      });
      
      // Update animal guides
      updateAnimalGuides();
      
      // Show panel
      panel.style.display = 'block';
      
      // Add active class to zone
      document.querySelectorAll('.map-zone').forEach(z => z.classList.remove('active'));
      document.querySelector(`.${zone}-zone`).classList.add('active');
      
      // Create sound waves
      createSoundWaves(perspective.sound.level);
    }

    // Update a single metric
    function updateMetric(type, data) {
      document.getElementById(`${type}Value`).textContent = data.value;
      document.getElementById(`${type}Fill`).style.width = `${data.level}%`;
      
      // Set color based on level
      let color;
      if (data.level < 30) color = '#27AE60'; // Green
      else if (data.level < 60) color = '#F39C12'; // Yellow
      else if (data.level < 80) color = '#E67E22'; // Orange
      else color = '#E74C3C'; // Red
      
      document.getElementById(`${type}Fill`).style.background = `linear-gradient(90deg, ${color}, ${darkenColor(color, 20)})`;
    }

    // Get zone color
    function getZoneColor(zone) {
      const colors = {
        road: '#7F8C8D',
        market: '#F39C12',
        school: '#3498DB',
        festival: '#E74C3C',
        park: '#27AE60',
        residential: '#8E44AD',
        industrial: '#34495E'
      };
      return colors[zone];
    }

    // Darken a color
    function darkenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) - amt;
      const G = (num >> 8 & 0x00FF) - amt;
      const B = (num & 0x0000FF) - amt;
      return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // Close panel
    function closePanel() {
      document.getElementById('perceptionPanel').style.display = 'none';
      document.querySelectorAll('.map-zone').forEach(z => z.classList.remove('active'));
      currentZone = null;
    }

    // Create sound waves
    function createSoundWaves(level) {
      const container = document.getElementById('soundWaves');
      container.innerHTML = '';
      
      const zoneElement = document.querySelector(`.${currentZone}-zone`);
      if (!zoneElement) return;
      
      const rect = zoneElement.getBoundingClientRect();
      const mapRect = document.getElementById('mapCanvas').getBoundingClientRect();
      
      const centerX = rect.left + rect.width/2 - mapRect.left;
      const centerY = rect.top + rect.height/2 - mapRect.top;
      
      // Create waves based on sound level
      const waveCount = Math.floor(level / 20);
      const maxRadius = Math.min(mapRect.width, mapRect.height) * 0.4;
      
      for (let i = 0; i < waveCount; i++) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        wave.style.left = `${centerX}px`;
        wave.style.top = `${centerY}px`;
        wave.style.borderColor = `rgba(52, 152, 219, ${0.5 - i * 0.1})`;
        wave.style.animationDelay = `${i * 0.5}s`;
        wave.style.width = `${(i + 1) * 30}px`;
        wave.style.height = `${(i + 1) * 30}px`;
        container.appendChild(wave);
      }
    }

    // Update animal guides
    function updateAnimalGuides() {
      const container = document.getElementById('animalGuides');
      container.innerHTML = '';
      
      Object.entries(animalPerspectives).forEach(([key, animal]) => {
        const guide = document.createElement('div');
        guide.className = `animal-guide ${currentAnimal === key ? 'active' : ''}`;
        guide.onclick = () => setAnimalPerspective(key);
        
        guide.innerHTML = `
          <div class="animal-avatar" style="border-color: ${animal.color};">
            <i class="${animal.icon}"></i>
          </div>
          <div style="font-size: 0.8rem;">${animal.name}</div>
        `;
        
        container.appendChild(guide);
      });
    }

    // Set animal perspective
    function setAnimalPerspective(animal) {
      currentAnimal = animal;
      updateAnimalGuides();
      
      // Show animal-specific info
      const animalData = animalPerspectives[animal];
      showNotification(`${animalData.name} Perspective:<br>Hearing: ${animalData.hearing}, Smell: ${animalData.smell}`);
    }

    // Update map visuals based on perspective
    function updateMapVisuals() {
      const zones = document.querySelectorAll('.map-zone');
      zones.forEach(zone => {
        if (currentPerspective === 'animal') {
          // Add stress effects for animal view
          zone.style.filter = 'brightness(1.2) contrast(1.1)';
          zone.style.boxShadow = 'inset 0 0 20px rgba(231, 76, 60, 0.3)';
        } else {
          // Reset for human view
          zone.style.filter = 'none';
          zone.style.boxShadow = 'none';
        }
      });
    }

    // Show notification
    function showNotification(message) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(26, 37, 47, 0.95);
        color: white;
        padding: 20px;
        border-radius: 15px;
        z-index: 1000;
        border-left: 4px solid #F39C12;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      `;
      
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <i class="fas fa-paw" style="color: #F39C12; font-size: 1.2rem;"></i>
          <strong style="color: #AED6F1;">Animal Sense</strong>
        </div>
        <div>${message}</div>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
      
      // Add animation styles if not present
      if (!document.querySelector('#notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Take empathy pledge
    function takeEmpathyPledge() {
      const counter = document.getElementById('pledgeCount');
      let count = parseInt(counter.textContent.replace(/,/g, ''));
      count++;
      counter.textContent = count.toLocaleString();
      
      const button = document.querySelector('button[onclick="takeEmpathyPledge()"]');
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Pledge Taken!';
      button.style.background = '#27AE60';
      button.style.borderColor = '#27AE60';
      button.style.color = 'white';
      button.disabled = true;
      
      // Create floating paws
      for (let i = 0; i < 3; i++) {
        createFloatingPaw();
      }
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
        button.style.borderColor = '';
        button.style.color = '';
        button.disabled = false;
      }, 2000);
    }

    // Create floating paw animation
    function createFloatingPaw() {
      const paw = document.createElement('div');
      paw.innerHTML = '🐾';
      paw.style.cssText = `
        position: fixed;
        bottom: 50px;
        left: ${30 + Math.random() * 40}%;
        font-size: 2rem;
        z-index: 1000;
        animation: floatUpRotate 2s ease-out forwards;
        pointer-events: none;
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
      `;
      
      document.body.appendChild(paw);
      
      // Create animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes floatUpRotate {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) rotate(360deg) scale(0.5);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Remove after animation
      setTimeout(() => paw.remove(), 2000);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
      // Set initial perspective
      setPerspective('human');
      
      // Add click outside to close panel
      document.addEventListener('click', function(e) {
        const panel = document.getElementById('perceptionPanel');
        if (panel.style.display === 'block' && 
            !panel.contains(e.target) && 
            !e.target.closest('.map-zone')) {
          closePanel();
        }
      });
      
      // Add keypress to close panel with Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closePanel();
        }
      });
      
      // Initialize animal guides
      updateAnimalGuides();
      
      // Start with road perspective
      setTimeout(() => showPerception('road'), 1000);
    });

    // Make functions available globally
    window.setPerspective = setPerspective;
    window.showPerception = showPerception;
    window.closePanel = closePanel;
    window.setAnimalPerspective = setAnimalPerspective;
    window.takeEmpathyPledge = takeEmpathyPledge;
