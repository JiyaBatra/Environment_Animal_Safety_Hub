const neighborhoods = [
  {
    name: 'Elm Street',
    treeCover: 22,
    canopies: 3,
    reflectiveSurfaces: 2,
    shadeScore: 27,
    shadeDesert: false,
    actions: ['Plant more trees', 'Install canopy'],
    impact: 'Moderate cooling',
    history: [{ year: 2023, event: 'Canopy installed' }]
  },
  {
    name: 'Sunrise Avenue',
    treeCover: 5,
    canopies: 0,
    reflectiveSurfaces: 1,
    shadeScore: 6,
    shadeDesert: true,
    actions: ['Reflective paint', 'Community tree planting'],
    impact: 'High heat risk',
    history: [{ year: 2022, event: 'Shade desert identified' }]
  }
];

const mapBox = document.getElementById('shadePlannerMap');
const visualSection = document.getElementById('shadePlannerVisual');
const actionsSection = document.getElementById('shadePlannerActions');
const impactSection = document.getElementById('shadePlannerImpact');
const historySection = document.getElementById('shadePlannerHistory');
const feedbackForm = document.getElementById('shadePlannerFeedbackForm');
const feedbackInput = document.getElementById('shadePlannerFeedbackInput');
const feedbackList = document.getElementById('shadePlannerFeedbackList');

function renderAll() {
  renderMap();
  renderVisual();
  renderActions();
  renderImpact();
  renderHistory();
  renderFeedback();
}

function renderMap() {
  mapBox.innerHTML = neighborhoods.map(n =>
    `<span style="color:${n.shadeDesert ? '#d32f2f' : '#388e3c'}">${n.name}</span>`
  ).join(' | ');
}

function renderVisual() {
  visualSection.innerHTML = neighborhoods.map(n => `
    <div class="visual-row">
      <strong>${n.name}</strong>
      <div>Tree Cover: ${n.treeCover}%</div>
      <div>Canopies: ${n.canopies}</div>
      <div>Reflective Surfaces: ${n.reflectiveSurfaces}</div>
      <div>Shade Score: ${n.shadeScore}</div>
      <div>Shade Desert: ${n.shadeDesert ? 'Yes' : 'No'}</div>
    </div>
  `).join('');
}

function renderActions() {
  actionsSection.innerHTML = neighborhoods.map(n => `
    <div class="action-row">
      <strong>${n.name}</strong>
      <ul>${n.actions.map(a => `<li>${a}</li>`).join('')}</ul>
    </div>
  `).join('');
}

function renderImpact() {
  impactSection.innerHTML = neighborhoods.map(n => `
    <div class="impact-row">
      <strong>${n.name}</strong>
      <div>${n.impact}</div>
    </div>
  `).join('');
}

function renderHistory() {
  historySection.innerHTML = neighborhoods.map(n => `
    <div class="history-row">
      <strong>${n.name}</strong>
      <span>${n.history.map(h => `${h.year}: ${h.event}`).join(', ')}</span>
    </div>
  `).join('');
}

function renderFeedback() {
  const feedbacks = JSON.parse(localStorage.getItem('shadeFeedback') || '[]');
  feedbackList.innerHTML = feedbacks.map(f =>
    `<div class="feedback-row">${f}</div>`
  ).join('');
}

feedbackForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const val = feedbackInput.value.trim();
  if (!val) return;
  const feedbacks = JSON.parse(localStorage.getItem('shadeFeedback') || '[]');
  feedbacks.push(val);
  localStorage.setItem('shadeFeedback', JSON.stringify(feedbacks));
  feedbackInput.value = '';
  renderFeedback();
});

renderAll();