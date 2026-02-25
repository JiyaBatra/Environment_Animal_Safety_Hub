// Heat Inequality Mapper - Interactive Features & Sample Data

const heatMapperMap = document.getElementById('heatMapperMap');
const visualSection = document.getElementById('heatMapperVisual');
const actionsSection = document.getElementById('heatMapperActions');
const impactSection = document.getElementById('heatMapperImpact');
const historySection = document.getElementById('heatMapperHistory');
const feedbackSection = document.getElementById('heatMapperFeedback');
const feedbackForm = document.getElementById('heatFeedbackForm');
const feedbackInput = document.getElementById('heatFeedbackInput');
const feedbackList = document.getElementById('heatFeedbackList');

// Sample neighborhood data
const neighborhoods = [
  {
    name: 'Maplewood',
    treeCover: 18,
    surfaceTemp: 36,
    income: 32000,
    ageVulnerability: 0.22,
    coolingAccess: 'Low',
    urgent: true,
    actions: ['Plant trees', 'Open cooling center'],
    impact: 'High heat risk, elderly population',
    history: [
      { year: 2022, event: 'Heat wave, 5 hospitalizations' },
      { year: 2023, event: 'Tree planting campaign' }
    ]
  },
  {
    name: 'River Heights',
    treeCover: 42,
    surfaceTemp: 29,
    income: 67000,
    ageVulnerability: 0.09,
    coolingAccess: 'High',
    urgent: false,
    actions: ['Maintain tree cover'],
    impact: 'Moderate heat risk',
    history: [
      { year: 2021, event: 'Community cooling festival' }
    ]
  },
  {
    name: 'Sunset Park',
    treeCover: 8,
    surfaceTemp: 39,
    income: 25000,
    ageVulnerability: 0.31,
    coolingAccess: 'None',
    urgent: true,
    actions: ['Install shade structures', 'Mobile cooling van'],
    impact: 'Extreme heat risk, low income',
    history: [
      { year: 2023, event: 'Heat emergency declared' }
    ]
  }
];

function renderMap() {
  heatMapperMap.innerHTML = '<b>Neighborhood Heat Map Visualization</b><br>' +
    neighborhoods.map(n => `<span style="color:${n.urgent ? '#d84315' : '#388e3c'}">${n.name}</span>`).join(' | ');
}

function renderVisual() {
  visualSection.innerHTML = '<h2>Heat Injustice Visualization</h2>' +
    neighborhoods.map(n => `
      <div class="visual-row">
        <strong>${n.name}</strong>
        <span>Tree Cover: ${n.treeCover}%</span>
        <span>Surface Temp: ${n.surfaceTemp}°C</span>
        <span>Income: $${n.income}</span>
        <span>Age Vulnerability: ${(n.ageVulnerability * 100).toFixed(1)}%</span>
        <span>Cooling Access: ${n.coolingAccess}</span>
        <span>Urgency: ${n.urgent ? 'High' : 'Low'}</span>
      </div>
    `).join('');
}

function renderActions() {
  actionsSection.innerHTML = '<h2>Targeted Cooling Actions</h2>' +
    neighborhoods.map(n => `
      <div class="action-row">
        <strong>${n.name}</strong>
        <ul>${n.actions.map(a => `<li>${a}</li>`).join('')}</ul>
      </div>
    `).join('');
}

function renderImpact() {
  impactSection.innerHTML = '<h2>Impact Tracking</h2>' +
    neighborhoods.map(n => `
      <div class="impact-row">
        <strong>${n.name}</strong>
        <span>${n.impact}</span>
      </div>
    `).join('');
}

function renderHistory() {
  historySection.innerHTML = '<h2>History</h2>' +
    neighborhoods.map(n => `
      <div class="history-row">
        <strong>${n.name}</strong>
        <span>${n.history.map(h => `${h.year}: ${h.event}`).join(' | ')}</span>
      </div>
    `).join('');
}

function renderFeedback() {
  feedbackList.innerHTML = '';
  const feedbacks = JSON.parse(localStorage.getItem('heatMapperFeedback') || '[]');
  feedbacks.forEach(f => {
    const div = document.createElement('div');
    div.className = 'feedback-row';
    div.textContent = f;
    feedbackList.appendChild(div);
  });
}

feedbackForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const val = feedbackInput.value.trim();
  if (val) {
    let feedbacks = JSON.parse(localStorage.getItem('heatMapperFeedback') || '[]');
    feedbacks.push(val);
    localStorage.setItem('heatMapperFeedback', JSON.stringify(feedbacks));
    feedbackInput.value = '';
    renderFeedback();
  }
});

// Initial render
renderMap();
renderVisual();
renderActions();
renderImpact();
renderHistory();
renderFeedback();

// Example: Dynamic neighborhood addition
const addNeighborhoodBtn = document.createElement('button');
addNeighborhoodBtn.textContent = 'Add New Neighborhood';
addNeighborhoodBtn.style.margin = '16px 0';
addNeighborhoodBtn.onclick = function() {
  const name = prompt('Neighborhood name?');
  if (name) {
    neighborhoods.push({
      name,
      treeCover: 0,
      surfaceTemp: 0,
      income: 0,
      ageVulnerability: 0,
      coolingAccess: 'None',
      urgent: false,
      actions: [],
      impact: 'Unknown',
      history: []
    });
    renderMap();
    renderVisual();
    renderActions();
    renderImpact();
    renderHistory();
  }
};
visualSection.appendChild(addNeighborhoodBtn);

// Example: Neighborhood details modal
function showNeighborhoodDetails(n) {
  alert(`Details for ${n.name}\nTree Cover: ${n.treeCover}%\nSurface Temp: ${n.surfaceTemp}°C\nIncome: $${n.income}\nAge Vulnerability: ${(n.ageVulnerability * 100).toFixed(1)}%\nCooling Access: ${n.coolingAccess}`);
}
visualSection.addEventListener('click', function(e) {
  if (e.target.closest('.visual-row')) {
    const name = e.target.closest('.visual-row').querySelector('strong').textContent;
    const n = neighborhoods.find(nb => nb.name === name);
    if (n) showNeighborhoodDetails(n);
  }
});

// Example: Action completion tracking
actionsSection.addEventListener('click', function(e) {
  if (e.target.tagName === 'LI') {
    e.target.style.textDecoration = 'line-through';
    e.target.style.color = '#aaa';
  }
});

// Example: Impact score calculation
function calculateImpactScore() {
  let score = 0;
  neighborhoods.forEach(n => {
    if (n.urgent) score += 10;
    if (n.surfaceTemp > 35) score += 5;
    if (n.actions.length > 0) score += n.actions.length * 2;
  });
  return score;
}
const impactScoreDiv = document.createElement('div');
impactScoreDiv.style.margin = '12px 0';
impactScoreDiv.style.fontWeight = 'bold';
impactScoreDiv.style.color = '#ffab00';
impactScoreDiv.textContent = 'Total Impact Score: ' + calculateImpactScore();
impactSection.appendChild(impactScoreDiv);

// Example: History timeline visualization
function renderHistoryTimeline() {
  const timeline = document.createElement('div');
  timeline.style.margin = '18px 0';
  timeline.style.borderLeft = '3px solid #d84315';
  timeline.style.paddingLeft = '12px';
  neighborhoods.forEach(n => {
    n.history.forEach(h => {
      const eventDiv = document.createElement('div');
      eventDiv.textContent = `${n.name} (${h.year}): ${h.event}`;
      eventDiv.style.marginBottom = '6px';
      timeline.appendChild(eventDiv);
    });
  });
  historySection.appendChild(timeline);
}
renderHistoryTimeline();

// Example: Feedback analytics
function renderFeedbackAnalytics() {
  const feedbacks = JSON.parse(localStorage.getItem('heatMapperFeedback') || '[]');
  const analyticsDiv = document.createElement('div');
  analyticsDiv.style.margin = '12px 0';
  analyticsDiv.style.color = '#388e3c';
  analyticsDiv.textContent = `Feedback count: ${feedbacks.length}`;
  feedbackSection.appendChild(analyticsDiv);
}
renderFeedbackAnalytics();

// ... (continue adding more interactive features, impact tracking, history, and feedback for 500+ lines)
