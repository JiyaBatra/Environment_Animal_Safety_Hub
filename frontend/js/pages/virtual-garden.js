/**
 * Virtual Garden Game System
 * Gamified environmental education through tree planting simulation
 */

class VirtualGarden {
  constructor() {
    this.points = parseInt(localStorage.getItem('vg_points')) || 100; // Start with 100 points
    this.trees = JSON.parse(localStorage.getItem('vg_trees')) || [];
    this.level = parseInt(localStorage.getItem('vg_level')) || 1;
    this.achievements = JSON.parse(localStorage.getItem('vg_achievements')) || this.getDefaultAchievements();
    this.treeCost = 10;
    this.waterBonus = 2; // hours saved per water
    this.harvestReward = 15;
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
    this.startGrowthTimers();
    this.checkAchievements();
  }

  bindEvents() {
    const plantBtn = document.getElementById('plant-tree-btn');
    if (plantBtn) {
      plantBtn.addEventListener('click', () => this.plantTree());
    }
  }

  plantTree() {
    if (this.points < this.treeCost) {
      this.showNotification('Not enough points! Complete quizzes to earn more.', 'error');
      return;
    }

    this.points -= this.treeCost;
    const tree = {
      id: Date.now(),
      stage: 'seed',
      plantedAt: Date.now(),
      wateredAt: Date.now(),
      growthTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      watered: false
    };

    this.trees.push(tree);
    this.saveData();
    this.render();
    this.checkAchievements();
    this.showNotification('Tree planted! Water it to help it grow faster.', 'success');
  }

  waterTree(treeId) {
    const tree = this.trees.find(t => t.id === treeId);
    if (!tree || tree.stage === 'mature') return;

    tree.watered = true;
    tree.wateredAt = Date.now();
    tree.growthTime -= this.waterBonus * 60 * 60 * 1000; // Reduce growth time by bonus hours

    this.saveData();
    this.render();
    this.showNotification('Tree watered! Growth accelerated.', 'success');
  }

  harvestTree(treeId) {
    const treeIndex = this.trees.findIndex(t => t.id === treeId);
    if (treeIndex === -1) return;

    const tree = this.trees[treeIndex];
    if (tree.stage !== 'mature') return;

    this.points += this.harvestReward;
    this.trees.splice(treeIndex, 1);

    // Level up logic
    const treesPlanted = parseInt(localStorage.getItem('vg_trees_planted') || '0') + 1;
    localStorage.setItem('vg_trees_planted', treesPlanted);
    const newLevel = Math.floor(treesPlanted / 5) + 1;

    if (newLevel > this.level) {
      this.level = newLevel;
      this.showNotification(`Level up! You reached level ${this.level}!`, 'success');
    }

    this.saveData();
    this.render();
    this.checkAchievements();
    this.showNotification(`Harvested! +${this.harvestReward} points`, 'success');
  }

  updateTreeStages() {
    const now = Date.now();
    this.trees.forEach(tree => {
      const elapsed = now - tree.plantedAt;
      const adjustedGrowthTime = tree.growthTime - (tree.watered ? this.waterBonus * 60 * 60 * 1000 : 0);

      if (elapsed < adjustedGrowthTime * 0.25) {
        tree.stage = 'seed';
      } else if (elapsed < adjustedGrowthTime * 0.5) {
        tree.stage = 'sprout';
      } else if (elapsed < adjustedGrowthTime) {
        tree.stage = 'growing';
      } else {
        tree.stage = 'mature';
      }
    });
    this.saveData();
  }

  startGrowthTimers() {
    this.updateTreeStages();
    setInterval(() => {
      this.updateTreeStages();
      this.render();
    }, 60000); // Update every minute
  }

  render() {
    this.updateStats();
    this.renderTrees();
    this.renderAchievements();
  }

  updateStats() {
    document.getElementById('total-points').textContent = this.points;
    document.getElementById('trees-planted').textContent = this.trees.length;
    document.getElementById('level').textContent = this.level;

    const treesPlanted = parseInt(localStorage.getItem('vg_trees_planted') || '0');
    const progressPercent = ((treesPlanted % 5) / 5) * 100;
    document.getElementById('level-progress').style.width = `${progressPercent}%`;
    document.getElementById('progress-percent').textContent = `${Math.round(progressPercent)}%`;
    document.getElementById('current-level').textContent = this.level;

    const plantBtn = document.getElementById('plant-tree-btn');
    if (plantBtn) {
      plantBtn.disabled = this.points < this.treeCost;
      plantBtn.textContent = `Plant Tree (${this.treeCost} Points)`;
    }
  }

  renderTrees() {
    const gardenPlot = document.getElementById('garden-plot');
    if (!gardenPlot) return;

    gardenPlot.innerHTML = '';

    if (this.trees.length === 0) {
      gardenPlot.innerHTML = `
        <div class="empty-garden">
          <i class="fa-solid fa-seedling" style="font-size: 4rem;color: var(--secondary-color);margin-bottom: 1rem;"></i>
          <p>Your garden is empty. Plant your first tree!</p>
        </div>
      `;
      return;
    }

    this.trees.forEach(tree => {
      const treeElement = this.createTreeElement(tree);
      gardenPlot.appendChild(treeElement);
    });
  }

  createTreeElement(tree) {
    const div = document.createElement('div');
    div.className = `tree ${tree.stage}`;

    const stageNames = {
      seed: 'Seed',
      sprout: 'Sprout',
      growing: 'Growing',
      mature: 'Mature'
    };

    const timeLeft = this.getTimeLeft(tree);
    const canWater = tree.stage !== 'mature' && !tree.watered;
    const canHarvest = tree.stage === 'mature';

    div.innerHTML = `
      <div class="tree-icon">
        <i class="fa-solid fa-${this.getTreeIcon(tree.stage)}"></i>
      </div>
      <div class="tree-info">
        <div class="tree-stage">${stageNames[tree.stage]}</div>
        ${timeLeft ? `<div class="tree-timer">${timeLeft}</div>` : ''}
      </div>
      <div class="tree-actions">
        ${canWater ? `<button class="btn-water" onclick="garden.waterTree(${tree.id})">
          <i class="fa-solid fa-tint"></i> Water
        </button>` : ''}
        ${canHarvest ? `<button class="btn-harvest" onclick="garden.harvestTree(${tree.id})">
          <i class="fa-solid fa-scissors"></i> Harvest
        </button>` : ''}
      </div>
    `;

    return div;
  }

  getTreeIcon(stage) {
    const icons = {
      seed: 'seedling',
      sprout: 'seedling',
      growing: 'tree',
      mature: 'tree'
    };
    return icons[stage] || 'seedling';
  }

  getTimeLeft(tree) {
    if (tree.stage === 'mature') return null;

    const now = Date.now();
    const elapsed = now - tree.plantedAt;
    const adjustedGrowthTime = tree.growthTime - (tree.watered ? this.waterBonus * 60 * 60 * 1000 : 0);
    const remaining = adjustedGrowthTime - elapsed;

    if (remaining <= 0) return null;

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    return `${hours}h ${minutes}m`;
  }

  renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    grid.innerHTML = '';

    this.achievements.forEach(achievement => {
      const div = document.createElement('div');
      div.className = `achievement ${achievement.unlocked ? 'unlocked' : ''}`;
      div.innerHTML = `
        <div class="achievement-icon">
          <i class="fa-solid fa-${achievement.icon}"></i>
        </div>
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-desc">${achievement.description}</div>
        ${!achievement.unlocked ? `<div class="achievement-progress">${achievement.progress}</div>` : ''}
      `;
      grid.appendChild(div);
    });
  }

  checkAchievements() {
    const treesPlanted = parseInt(localStorage.getItem('vg_trees_planted') || '0');

    // First Tree
    if (treesPlanted >= 1 && !this.achievements[0].unlocked) {
      this.achievements[0].unlocked = true;
      this.showNotification('Achievement unlocked: First Tree!', 'success');
    }

    // Forest Guardian
    if (treesPlanted >= 10 && !this.achievements[1].unlocked) {
      this.achievements[1].unlocked = true;
      this.showNotification('Achievement unlocked: Forest Guardian!', 'success');
    }

    // Water Master
    const treesWatered = this.trees.filter(t => t.watered).length;
    if (treesWatered >= 5 && !this.achievements[2].unlocked) {
      this.achievements[2].unlocked = true;
      this.showNotification('Achievement unlocked: Water Master!', 'success');
    }

    // Harvester
    if (treesPlanted >= 25 && !this.achievements[3].unlocked) {
      this.achievements[3].unlocked = true;
      this.showNotification('Achievement unlocked: Master Harvester!', 'success');
    }

    // Update progress
    this.achievements[0].progress = `${Math.min(treesPlanted, 1)}/1`;
    this.achievements[1].progress = `${Math.min(treesPlanted, 10)}/10`;
    this.achievements[2].progress = `${Math.min(treesWatered, 5)}/5`;
    this.achievements[3].progress = `${Math.min(treesPlanted, 25)}/25`;

    this.saveData();
    this.renderAchievements();
  }

  getDefaultAchievements() {
    return [
      {
        id: 'first-tree',
        title: 'First Tree',
        description: 'Plant your first tree',
        icon: 'seedling',
        unlocked: false,
        progress: '0/1'
      },
      {
        id: 'forest-guardian',
        title: 'Forest Guardian',
        description: 'Plant 10 trees',
        icon: 'trees',
        unlocked: false,
        progress: '0/10'
      },
      {
        id: 'water-master',
        title: 'Water Master',
        description: 'Water 5 trees',
        icon: 'tint',
        unlocked: false,
        progress: '0/5'
      },
      {
        id: 'master-harvester',
        title: 'Master Harvester',
        description: 'Harvest 25 trees',
        icon: 'scissors',
        unlocked: false,
        progress: '0/25'
      }
    ];
  }

  saveData() {
    localStorage.setItem('vg_points', this.points);
    localStorage.setItem('vg_trees', JSON.stringify(this.trees));
    localStorage.setItem('vg_level', this.level);
    localStorage.setItem('vg_achievements', JSON.stringify(this.achievements));
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      ${message}
    `;

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--warning-color)',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      zIndex: '1000',
      fontWeight: '600',
      animation: 'slideIn 0.3s ease'
    });

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }

  .empty-garden {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: var(--text-color);
    opacity: 0.7;
  }
`;
document.head.appendChild(style);

// Initialize the garden when DOM is loaded
let garden;
document.addEventListener('DOMContentLoaded', () => {
  garden = new VirtualGarden();
  window.garden = garden; // Make garden available globally for button clicks
});