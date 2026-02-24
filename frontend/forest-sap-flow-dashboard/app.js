// Demo data for Forest Sap Flow Rate Dashboard
const demoSapFlow = {
  species: ['Oak', 'Pine', 'Maple', 'Birch'],
  rates: [45.2, 32.8, 28.5, 38.9], // g/h
  stressLevel: 'Moderate',
  message: 'Sap flow rates indicate developing drought stress. Monitor closely.'
};

const demoTrend = [
  { date: '2026-02-01', oak: 52.3, pine: 41.2, maple: 35.6, birch: 45.8 },
  { date: '2026-02-02', oak: 48.7, pine: 38.9, maple: 32.1, birch: 42.3 },
  { date: '2026-02-03', oak: 46.2, pine: 36.5, maple: 30.8, birch: 40.1 },
  { date: '2026-02-04', oak: 44.8, pine: 34.2, maple: 29.3, birch: 39.7 },
  { date: '2026-02-05', oak: 43.1, pine: 33.8, maple: 28.9, birch: 38.4 },
  { date: '2026-02-06', oak: 45.2, pine: 32.8, maple: 28.5, birch: 38.9 }
];

const demoEnvironmental = {
  temperature: 24.5,
  humidity: 45.2,
  soilMoisture: 32.1,
  vpd: 1.8
};

const demoAlerts = [
  'Oak trees showing early signs of hydraulic stress.',
  'Soil moisture levels below optimal range.',
  'VPD levels indicate high evaporative demand.'
];

const recommendations = [
  'Increase irrigation in monitored areas.',
  'Implement shade management strategies.',
  'Monitor for pest outbreaks that may compound stress.',
  'Consider mulching to retain soil moisture.',
  'Schedule regular sap flow measurements.'
];

document.addEventListener('DOMContentLoaded', () => {
  const sapflowSpecies = document.getElementById('sapflow-species');
  const sapflowValues = document.getElementById('sapflow-values');
  const stressLevel = document.getElementById('stress-level');
  const alertsList = document.getElementById('alerts-list');
  const recommendationsList = document.getElementById('recommendations-list');
  const fetchBtn = document.getElementById('fetch-btn');
  const locationInput = document.getElementById('location');

  // Update environmental data
  document.getElementById('temperature').textContent = demoEnvironmental.temperature + '°C';
  document.getElementById('humidity').textContent = demoEnvironmental.humidity + '%';
  document.getElementById('soil-moisture').textContent = demoEnvironmental.soilMoisture + '%';
  document.getElementById('vpd').textContent = demoEnvironmental.vpd + ' kPa';

  // Show current sap flow data
  sapflowSpecies.innerHTML = '<h3>Tree Species</h3>' +
    demoSapFlow.species.map(species => `<div>${species}</div>`).join('');

  sapflowValues.innerHTML = '<h3>Sap Flow Rate (g/h)</h3>' +
    demoSapFlow.rates.map(rate => `<div>${rate}</div>`).join('');

  stressLevel.innerHTML = `<h3>Stress Level: ${demoSapFlow.stressLevel}</h3><p>${demoSapFlow.message}</p>`;

  // Show alerts
  alertsList.innerHTML = '';
  demoAlerts.forEach(alert => {
    const div = document.createElement('div');
    div.className = 'alert-item';
    div.textContent = alert;
    alertsList.appendChild(div);
  });

  // Show recommendations
  recommendations.forEach(rec => {
    const li = document.createElement('li');
    li.textContent = rec;
    recommendationsList.appendChild(li);
  });

  // Create sap flow trend chart
  const ctx = document.getElementById('sapflow-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: demoTrend.map(d => d.date),
      datasets: [
        {
          label: 'Oak',
          data: demoTrend.map(d => d.oak),
          borderColor: '#8B4513',
          backgroundColor: 'rgba(139, 69, 19, 0.1)',
          fill: false,
          tension: 0.3
        },
        {
          label: 'Pine',
          data: demoTrend.map(d => d.pine),
          borderColor: '#228B22',
          backgroundColor: 'rgba(34, 139, 34, 0.1)',
          fill: false,
          tension: 0.3
        },
        {
          label: 'Maple',
          data: demoTrend.map(d => d.maple),
          borderColor: '#FF6347',
          backgroundColor: 'rgba(255, 99, 71, 0.1)',
          fill: false,
          tension: 0.3
        },
        {
          label: 'Birch',
          data: demoTrend.map(d => d.birch),
          borderColor: '#DAA520',
          backgroundColor: 'rgba(218, 165, 32, 0.1)',
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sap Flow Rate (g/h)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });

  // Fetch button functionality
  fetchBtn.addEventListener('click', () => {
    const loc = locationInput.value.trim();
    if (!loc) {
      alert('Please enter a forest location.');
      return;
    }
    // TODO: Connect to backend/API for real sap flow data
    alert('Fetching sap flow data for: ' + loc + '\n(Demo only - showing sample data)');
  });
});