const corridors = [
  {
    name: 'Central Avenue',
    blocked: true,
    heatStress: 'High',
    airQuality: 'Poor',
    simulation: 'Opening reduces temp by 3°C',
    actions: ['Remove dense barriers', 'Add green buffer'],
    impact: 'Improved ventilation',
    history: [{ year: 2025, event: 'Barrier construction' }]
  },
  {
    name: 'Riverfront Lane',
    blocked: false,
    heatStress: 'Low',
    airQuality: 'Good',
    simulation: 'Stable temperature maintained',
    actions: ['Maintain open space'],
    impact: 'Healthy airflow',
    history: [{ year: 2024, event: 'Corridor maintained' }]
  }
];

const mapBox = document.getElementById('windCorridorMap');
const visualSection = document.getElementById('windCorridorVisual');
const actionsSection = document.getElementById('windCorridorActions');
const impactSection = document.getElementById('windCorridorImpact');
const historySection = document.getElementById('windCorridorHistory');
const feedbackForm = document.getElementById('windCorridorFeedbackForm');
const feedbackInput = document.getElementById('windCorridorFeedbackInput');
const feedbackList = document.getElementById('windCorridorFeedbackList');

function renderAll() {
  renderMap();
  renderVisual();
  renderActions();
  renderImpact();
  renderHistory();
  renderFeedback();
}

function renderMap() {
  mapBox.innerHTML = corridors.map(c =>
    `<span style="color:${c.blocked ? '#d32f2f' : '#388e3c'}">${c.name}</span>`
  ).join(' | ');
}

function renderVisual() {
  visualSection.innerHTML = corridors.map(c => `
    <div class="visual-row">
      <strong>${c.name}</strong>
      <div>Blocked: ${c.blocked ? 'Yes' : 'No'}</div>
      <div>Heat Stress: ${c.heatStress}</div>
      <div>Air Quality: ${c.airQuality}</div>
      <div>${c.simulation}</div>
    </div>
  `).join('');
}

function renderActions() {
  actionsSection.innerHTML = corridors.map(c => `
    <div class="action-row">
      <strong>${c.name}</strong>
      <ul>${c.actions.map(a => `<li>${a}</li>`).join('')}</ul>
    </div>
  `).join('');
}

function renderImpact() {
  impactSection.innerHTML = corridors.map(c => `
    <div class="impact-row">
      <strong>${c.name}</strong>
      <div>${c.impact}</div>
    </div>
  `).join('');
}

function renderHistory() {
  historySection.innerHTML = corridors.map(c => `
    <div class="history-row">
      <strong>${c.name}</strong>
      <span>${c.history.map(h => `${h.year}: ${h.event}`).join(', ')}</span>
    </div>
  `).join('');
}

function renderFeedback() {
  const feedbacks = JSON.parse(localStorage.getItem('windFeedback') || '[]');
  feedbackList.innerHTML = feedbacks.map(f =>
    `<div class="feedback-row">${f}</div>`
  ).join('');
}

feedbackForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const val = feedbackInput.value.trim();
  if (!val) return;
  const feedbacks = JSON.parse(localStorage.getItem('windFeedback') || '[]');
  feedbacks.push(val);
  localStorage.setItem('windFeedback', JSON.stringify(feedbacks));
  feedbackInput.value = '';
  renderFeedback();
});

renderAll();