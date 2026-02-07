// Water Footprint Calculator JavaScript

// ===== CONFIGURATION =====
const COST_PER_LITER = 0.002; // USD per liter (adjust based on local rates)
const DAILY_TARGET = 150; // Target liters per day per person
const NATIONAL_AVERAGE = 340; // Average liters per day per person

// ===== WATER USAGE RATES (LITERS) =====
const waterRates = {
  'shower': { rate: 9.5, unit: 'per minute', avgDuration: 10 },
  'toilet': { rate: 7.5, unit: 'per flush', avgDuration: 0 },
  'washing-machine': { rate: 50, unit: 'per load', avgDuration: 0 },
  'dishwasher': { rate: 18, unit: 'per cycle', avgDuration: 0 },
  'hand-wash-dishes': { rate: 8, unit: 'per minute', avgDuration: 15 },
  'garden': { rate: 17, unit: 'per minute', avgDuration: 20 },
  'car-wash': { rate: 175, unit: 'per wash', avgDuration: 0 },
  'drinking-cooking': { rate: 5, unit: 'per day', avgDuration: 0 },
  'brushing-teeth': { rate: 2, unit: 'per minute', avgDuration: 2 },
  'hand-wash': { rate: 1.5, unit: 'per minute', avgDuration: 1 },
  'other': { rate: 10, unit: 'per use', avgDuration: 0 }
};

// ===== DATA STORAGE =====
let waterData = JSON.parse(localStorage.getItem('waterFootprintData')) || [];
let dailyChart = null;
let activityChart = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  setupFormHandlers();
  setupActivityTypeChange();
  initializeCharts();
  updateDashboard();
  renderActivityList();
  detectWastage();
  updateSummary();
  updateComparison();
  setDefaultDate();
});

// ===== SET DEFAULT DATE =====
function setDefaultDate() {
  const dateInput = document.getElementById('usageDate');
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  dateInput.max = today;
}

// ===== AUTO-ADJUST DURATION BASED ON ACTIVITY =====
function setupActivityTypeChange() {
  const activityType = document.getElementById('activityType');
  const duration = document.getElementById('duration');
  
  activityType.addEventListener('change', function() {
    const selectedType = this.value;
    if (selectedType && waterRates[selectedType]) {
      const avgDuration = waterRates[selectedType].avgDuration;
      if (avgDuration > 0) {
        duration.value = avgDuration;
      } else {
        duration.value = '';
      }
      
      // Disable duration for activities that don't need it
      if (avgDuration === 0 && selectedType !== 'other') {
        duration.value = 1;
        duration.disabled = true;
      } else {
        duration.disabled = false;
      }
    }
  });
}

// ===== PAGE INITIALIZATION =====
function initializePage() {
  const dateInput = document.getElementById('usageDate');
  const today = new Date().toISOString().split('T')[0];
  dateInput.max = today;
}

// ===== FORM HANDLERS =====
function setupFormHandlers() {
  const form = document.getElementById('waterForm');
  form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const activityType = document.getElementById('activityType').value;
  const duration = parseFloat(document.getElementById('duration').value) || 1;
  const quantity = parseInt(document.getElementById('quantity').value);
  const usageDate = document.getElementById('usageDate').value;
  const notes = document.getElementById('notes').value;
  
  // Validate inputs
  if (!activityType || !usageDate) {
    showAlert('Please fill all required fields!', 'warning');
    return;
  }
  
  // Calculate water usage in liters
  const activityInfo = waterRates[activityType];
  let waterLiters = 0;
  
  if (activityInfo.avgDuration === 0 && activityType !== 'other') {
    // For activities like toilet, washing machine (fixed amount per use)
    waterLiters = activityInfo.rate * quantity;
  } else {
    // For activities with duration (shower, garden, etc.)
    waterLiters = activityInfo.rate * duration * quantity;
  }
  
  // Create activity entry
  const activity = {
    id: Date.now(),
    type: activityType,
    typeName: getActivityName(activityType),
    duration: duration,
    quantity: quantity,
    waterLiters: waterLiters,
    cost: waterLiters * COST_PER_LITER,
    date: usageDate,
    notes: notes,
    timestamp: Date.now()
  };
  
  // Add to data
  waterData.push(activity);
  saveData();
  
  // Update UI
  updateDashboard();
  renderActivityList();
  updateCharts();
  detectWastage();
  updateSummary();
  updateComparison();
  
  // Reset form
  document.getElementById('waterForm').reset();
  setDefaultDate();
  
  showAlert(`${activity.typeName} logged successfully! Water used: ${waterLiters.toFixed(1)} L`, 'success');
}

// ===== GET ACTIVITY NAME =====
function getActivityName(type) {
  const names = {
    'shower': 'Shower/Bath',
    'toilet': 'Toilet Flush',
    'washing-machine': 'Washing Machine',
    'dishwasher': 'Dishwasher',
    'hand-wash-dishes': 'Hand Washing Dishes',
    'garden': 'Garden Watering',
    'car-wash': 'Car Wash',
    'drinking-cooking': 'Drinking & Cooking',
    'brushing-teeth': 'Brushing Teeth',
    'hand-wash': 'Hand Washing',
    'other': 'Other Activity'
  };
  return names[type] || type;
}

// ===== RESET FORM =====
function resetForm() {
  document.getElementById('waterForm').reset();
  setDefaultDate();
  document.getElementById('duration').disabled = false;
}

// ===== DATA PERSISTENCE =====
function saveData() {
  localStorage.setItem('waterFootprintData', JSON.stringify(waterData));
}

// ===== UPDATE DASHBOARD STATS =====
function updateDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Today's usage
  const todayData = waterData.filter(a => a.date === today);
  const todayUsage = todayData.reduce((sum, a) => sum + a.waterLiters, 0);
  document.getElementById('todayUsage').textContent = todayUsage.toFixed(1);
  
  // Status badge
  const todayStatus = document.getElementById('todayStatus');
  if (todayUsage < 150) {
    todayStatus.textContent = 'Excellent';
    todayStatus.style.background = '#d1fae5';
    todayStatus.style.color = '#059669';
  } else if (todayUsage < 300) {
    todayStatus.textContent = 'Normal';
    todayStatus.style.background = '#e0f2fe';
    todayStatus.style.color = '#0284c7';
  } else {
    todayStatus.textContent = 'High';
    todayStatus.style.background = '#fee2e2';
    todayStatus.style.color = '#dc2626';
  }
  
  // Week usage
  const weekData = waterData.filter(a => a.date >= weekAgo);
  const weekUsage = weekData.reduce((sum, a) => sum + a.waterLiters, 0);
  document.getElementById('weekUsage').textContent = weekUsage.toFixed(1);
  
  // Week change
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const prevWeekData = waterData.filter(a => a.date >= twoWeeksAgo && a.date < weekAgo);
  const prevWeekUsage = prevWeekData.reduce((sum, a) => sum + a.waterLiters, 0);
  const weekChange = prevWeekUsage > 0 ? ((weekUsage - prevWeekUsage) / prevWeekUsage * 100) : 0;
  
  const weekChangeEl = document.getElementById('weekChange');
  weekChangeEl.textContent = `${weekChange > 0 ? '+' : ''}${weekChange.toFixed(1)}%`;
  weekChangeEl.style.background = weekChange > 0 ? '#fee2e2' : '#d1fae5';
  weekChangeEl.style.color = weekChange > 0 ? '#dc2626' : '#059669';
  
  // Month cost
  const monthData = waterData.filter(a => a.date >= monthAgo);
  const monthCost = monthData.reduce((sum, a) => sum + a.cost, 0);
  document.getElementById('waterCost').textContent = `$${monthCost.toFixed(2)}`;
  
  // Total water this month
  const monthWater = monthData.reduce((sum, a) => sum + a.waterLiters, 0);
  document.getElementById('totalWaterLiters').textContent = monthWater.toFixed(0);
  
  // Conservation score (0-100, based on daily average vs target)
  const daysInMonth = 30;
  const avgDailyUsage = monthWater / daysInMonth;
  const conservationScore = Math.max(0, Math.min(100, 100 - ((avgDailyUsage - DAILY_TARGET) / DAILY_TARGET * 50)));
  document.getElementById('conservationScore').textContent = conservationScore.toFixed(0);
  document.getElementById('scoreProgressBar').style.width = `${conservationScore}%`;
}

// ===== RENDER ACTIVITY LIST =====
function renderActivityList() {
  const listContainer = document.getElementById('activityList');
  
  if (waterData.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-droplet"></i>
        <p>No activities logged yet</p>
        <span>Start tracking your water consumption above!</span>
      </div>
    `;
    return;
  }
  
  // Sort by date (newest first)
  const sortedData = [...waterData].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  listContainer.innerHTML = sortedData.map(activity => `
    <div class="activity-item" data-id="${activity.id}" data-type="${activity.type}">
      <div class="activity-icon-box ${activity.type}">
        <i class="${getActivityIcon(activity.type)}"></i>
      </div>
      <div class="activity-details">
        <h4>${activity.typeName}</h4>
        <div class="activity-meta">
          <span><i class="fas fa-calendar"></i> ${formatDate(activity.date)}</span>
          ${activity.duration > 1 ? `<span><i class="fas fa-clock"></i> ${activity.duration} min</span>` : ''}
          ${activity.quantity > 1 ? `<span><i class="fas fa-hashtag"></i> ${activity.quantity}x</span>` : ''}
          ${activity.notes ? `<span><i class="fas fa-comment"></i> ${activity.notes}</span>` : ''}
        </div>
      </div>
      <div class="water-badge">
        ${activity.waterLiters.toFixed(1)} L
        <small>$${activity.cost.toFixed(2)}</small>
      </div>
      <div class="activity-actions">
        <button class="btn-icon btn-delete" onclick="deleteActivity(${activity.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// ===== GET ACTIVITY ICON =====
function getActivityIcon(type) {
  const icons = {
    'shower': 'fas fa-shower',
    'toilet': 'fas fa-toilet',
    'washing-machine': 'fas fa-tshirt',
    'dishwasher': 'fas fa-utensils',
    'hand-wash-dishes': 'fas fa-hands-wash',
    'garden': 'fas fa-seedling',
    'car-wash': 'fas fa-car',
    'drinking-cooking': 'fas fa-mug-hot',
    'brushing-teeth': 'fas fa-tooth',
    'hand-wash': 'fas fa-hand-sparkles',
    'other': 'fas fa-droplet'
  };
  return icons[type] || 'fas fa-droplet';
}

// ===== FORMAT DATE =====
function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (dateString === today.toISOString().split('T')[0]) {
    return 'Today';
  } else if (dateString === yesterday.toISOString().split('T')[0]) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

// ===== DELETE ACTIVITY =====
function deleteActivity(id) {
  if (confirm('Are you sure you want to delete this activity?')) {
    waterData = waterData.filter(a => a.id !== id);
    saveData();
    updateDashboard();
    renderActivityList();
    updateCharts();
    detectWastage();
    updateSummary();
    updateComparison();
    showAlert('Activity deleted', 'success');
  }
}

// ===== FILTER ACTIVITIES =====
function filterActivities() {
  const searchTerm = document.getElementById('searchActivity').value.toLowerCase();
  const filterType = document.getElementById('filterActivity').value;
  
  const items = document.querySelectorAll('.activity-item');
  
  items.forEach(item => {
    const type = item.getAttribute('data-type');
    const text = item.textContent.toLowerCase();
    
    const matchesSearch = text.includes(searchTerm);
    const matchesFilter = filterType === 'all' || type === filterType;
    
    if (matchesSearch && matchesFilter) {
      item.style.display = 'grid';
    } else {
      item.style.display = 'none';
    }
  });
}

// ===== INITIALIZE CHARTS =====
function initializeCharts() {
  createDailyChart();
  createActivityChart();
}

// ===== CREATE DAILY CHART =====
function createDailyChart() {
  const ctx = document.getElementById('dailyChart').getContext('2d');
  
  // Get last 7 days data
  const last7Days = getLast7Days();
  const dailyData = last7Days.map(date => {
    const dayData = waterData.filter(a => a.date === date);
    return dayData.reduce((sum, a) => sum + a.waterLiters, 0);
  });
  
  dailyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: last7Days.map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      datasets: [{
        label: 'Water Usage (L)',
        data: dailyData,
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(14, 165, 233, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(14, 165, 233, 1)',
          borderWidth: 2,
          callbacks: {
            label: function(context) {
              return `Water: ${context.parsed.y.toFixed(1)} L`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' L';
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// ===== CREATE ACTIVITY CHART =====
function createActivityChart() {
  const ctx = document.getElementById('activityChart').getContext('2d');
  
  // Aggregate data by activity type
  const activityTypes = {};
  waterData.forEach(activity => {
    if (!activityTypes[activity.typeName]) {
      activityTypes[activity.typeName] = 0;
    }
    activityTypes[activity.typeName] += activity.waterLiters;
  });
  
  const labels = Object.keys(activityTypes);
  const data = Object.values(activityTypes);
  
  const colors = [
    'rgba(14, 165, 233, 0.8)',
    'rgba(6, 182, 212, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(251, 191, 36, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(234, 88, 12, 0.8)'
  ];
  
  activityChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#fff',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleColor: '#fff',
          bodyColor: '#fff',
          borderWidth: 2,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value.toFixed(1)} L (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// ===== UPDATE CHARTS =====
function updateCharts() {
  if (dailyChart) {
    dailyChart.destroy();
  }
  if (activityChart) {
    activityChart.destroy();
  }
  createDailyChart();
  createActivityChart();
}

// ===== UPDATE CHART PERIOD =====
function updateChartPeriod(period) {
  // Update button states
  document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Recreate chart with new period
  if (dailyChart) {
    dailyChart.destroy();
  }
  
  const ctx = document.getElementById('dailyChart').getContext('2d');
  const days = period === 'week' ? 7 : 30;
  const lastNDays = getLastNDays(days);
  const dailyData = lastNDays.map(date => {
    const dayData = waterData.filter(a => a.date === date);
    return dayData.reduce((sum, a) => sum + a.waterLiters, 0);
  });
  
  dailyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: lastNDays.map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      datasets: [{
        label: 'Water Usage (L)',
        data: dailyData,
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(14, 165, 233, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          callbacks: {
            label: function(context) {
              return `Water: ${context.parsed.y.toFixed(1)} L`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' L';
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// ===== GET LAST N DAYS =====
function getLast7Days() {
  return getLastNDays(7);
}

function getLastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

// ===== DETECT WASTAGE =====
function detectWastage() {
  const wastageGrid = document.getElementById('wastageGrid');
  const wastageIssues = [];
  
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthData = waterData.filter(a => a.date >= monthAgo);
  
  // Group by activity type
  const byType = {};
  monthData.forEach(activity => {
    if (!byType[activity.type]) {
      byType[activity.type] = {
        typeName: activity.typeName,
        totalWater: 0,
        totalDuration: 0,
        count: 0
      };
    }
    byType[activity.type].totalWater += activity.waterLiters;
    byType[activity.type].totalDuration += activity.duration;
    byType[activity.type].count += 1;
  });
  
  // Detect issues
  Object.keys(byType).forEach(type => {
    const data = byType[type];
    const avgDuration = data.totalDuration / data.count;
    
    // Long showers (> 15 minutes)
    if (type === 'shower' && avgDuration > 15) {
      wastageIssues.push({
        type: 'shower',
        title: 'Long Showers Detected',
        severity: 'high',
        icon: 'fas fa-shower',
        description: `Your showers average ${avgDuration.toFixed(1)} minutes. Reducing to 5-10 minutes can save significant water.`,
        water: data.totalWater.toFixed(1),
        cost: (data.totalWater * COST_PER_LITER).toFixed(2),
        recommendation: 'Install a low-flow showerhead and use a timer. Turn off water while soaping.'
      });
    }
    
    // Excessive garden watering
    if (type === 'garden' && data.totalWater > 500) {
      wastageIssues.push({
        type: 'garden',
        title: 'High Garden Water Use',
        severity: 'medium',
        icon: 'fas fa-seedling',
        description: 'Garden watering is consuming more water than expected.',
        water: data.totalWater.toFixed(1),
        cost: (data.totalWater * COST_PER_LITER).toFixed(2),
        recommendation: 'Water early morning or evening. Use drip irrigation and collect rainwater.'
      });
    }
    
    // Frequent toilet flushing
    if (type === 'toilet' && data.count > 180) {
      wastageIssues.push({
        type: 'toilet',
        title: 'Frequent Toilet Usage',
        severity: 'low',
        icon: 'fas fa-toilet',
        description: `${data.count} flushes this month. Consider water-efficient options.`,
        water: data.totalWater.toFixed(1),
        cost: (data.totalWater * COST_PER_LITER).toFixed(2),
        recommendation: 'Install dual-flush toilet. Use half-flush when possible. Check for leaks.'
      });
    }
  });
  
  // Overall high consumption
  const totalMonthWater = monthData.reduce((sum, a) => sum + a.waterLiters, 0);
  const avgDailyWater = totalMonthWater / 30;
  
  if (avgDailyWater > NATIONAL_AVERAGE) {
    wastageIssues.push({
      type: 'overall',
      title: 'Above Average Consumption',
      severity: 'medium',
      icon: 'fas fa-exclamation-triangle',
      description: `Your daily average (${avgDailyWater.toFixed(1)} L) is above the national average (${NATIONAL_AVERAGE} L).`,
      water: totalMonthWater.toFixed(1),
      cost: (totalMonthWater * COST_PER_LITER).toFixed(2),
      recommendation: 'Review all activities. Fix leaks. Use water-efficient appliances.'
    });
  }
  
  // Render wastage cards
  if (wastageIssues.length === 0) {
    wastageGrid.innerHTML = `
      <div class="no-wastage">
        <div class="no-wastage-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>Excellent Work!</h3>
        <p>No significant water wastage detected. You're doing great!</p>
      </div>
    `;
  } else {
    wastageGrid.innerHTML = wastageIssues.map(issue => `
      <div class="wastage-card">
        <div class="wastage-header">
          <div class="wastage-icon">
            <i class="${issue.icon}"></i>
          </div>
          <div class="wastage-title">
            <h4>${issue.title}</h4>
            <span class="wastage-severity ${issue.severity}">${issue.severity.toUpperCase()}</span>
          </div>
        </div>
        <p class="wastage-description">${issue.description}</p>
        <div class="wastage-stats">
          <div class="wastage-stat">
            <div class="wastage-stat-value">${issue.water}</div>
            <div class="wastage-stat-label">Liters</div>
          </div>
          <div class="wastage-stat">
            <div class="wastage-stat-value">$${issue.cost}</div>
            <div class="wastage-stat-label">Cost impact</div>
          </div>
        </div>
        <div class="wastage-recommendation">
          <strong>Recommendation:</strong>
          <span>${issue.recommendation}</span>
        </div>
      </div>
    `).join('');
  }
}

// ===== UPDATE SUMMARY =====
function updateSummary() {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthData = waterData.filter(a => a.date >= monthAgo);
  
  // Total water
  const totalWater = monthData.reduce((sum, a) => sum + a.waterLiters, 0);
  document.getElementById('summaryTotalWater').textContent = `${totalWater.toFixed(1)} L`;
  
  // Total cost
  const totalCost = monthData.reduce((sum, a) => sum + a.cost, 0);
  document.getElementById('summaryTotalCost').textContent = `$${totalCost.toFixed(2)}`;
  
  // Water saved (compared to national average)
  const avgDaily = totalWater / 30;
  const potentialUsage = NATIONAL_AVERAGE * 30;
  const waterSaved = Math.max(0, potentialUsage - totalWater);
  document.getElementById('summaryWaterSaved').textContent = `${waterSaved.toFixed(1)} L`;
  
  // Calculate streak (days below target)
  let streak = 0;
  const last30Days = getLastNDays(30);
  for (let i = last30Days.length - 1; i >= 0; i--) {
    const dayData = waterData.filter(a => a.date === last30Days[i]);
    const dayTotal = dayData.reduce((sum, a) => sum + a.waterLiters, 0);
    if (dayTotal > 0 && dayTotal <= DAILY_TARGET) {
      streak++;
    } else if (dayTotal > DAILY_TARGET) {
      break;
    }
  }
  document.getElementById('summaryStreak').textContent = `${streak} days`;
}

// ===== UPDATE COMPARISON =====
function updateComparison() {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthData = waterData.filter(a => a.date >= monthAgo);
  
  const totalWater = monthData.reduce((sum, a) => sum + a.waterLiters, 0);
  const avgDaily = totalWater / 30;
  
  document.getElementById('yourAverage').textContent = `${avgDaily.toFixed(1)} L`;
  
  // Calculate bar width (national average = 100%)
  const yourBarWidth = Math.min((avgDaily / NATIONAL_AVERAGE) * 100, 150);
  document.getElementById('yourBar').style.width = `${yourBarWidth}%`;
}

// ===== EXPORT DATA =====
function exportData() {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthData = waterData.filter(a => a.date >= monthAgo);
  
  if (monthData.length === 0) {
    showAlert('No data to export!', 'warning');
    return;
  }
  
  // Create CSV content
  let csvContent = 'Date,Activity,Duration (min),Quantity,Water (L),Cost ($),Notes\n';
  
  monthData.forEach(activity => {
    csvContent += `${activity.date},${activity.typeName},${activity.duration},${activity.quantity},${activity.waterLiters.toFixed(2)},${activity.cost.toFixed(2)},"${activity.notes || ''}"\n`;
  });
  
  // Add summary
  const totalWater = monthData.reduce((sum, a) => sum + a.waterLiters, 0);
  const totalCost = monthData.reduce((sum, a) => sum + a.cost, 0);
  
  csvContent += `\nSummary\n`;
  csvContent += `Total Water,${totalWater.toFixed(2)} L\n`;
  csvContent += `Total Cost,$${totalCost.toFixed(2)}\n`;
  csvContent += `Daily Average,${(totalWater / 30).toFixed(2)} L\n`;
  
  // Download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `water-footprint-report-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showAlert('Report exported successfully!', 'success');
}

// ===== ALERT SYSTEM =====
function showAlert(message, type = 'info') {
  const banner = document.getElementById('alertBanner');
  const messageEl = document.getElementById('alertMessage');
  
  messageEl.textContent = message;
  banner.classList.remove('hidden');
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    closeAlert();
  }, 5000);
}

function closeAlert() {
  const banner = document.getElementById('alertBanner');
  banner.classList.add('hidden');
}
