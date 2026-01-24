// Pet Health Check JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadSavedData();
  updateChecklistProgress();
  sortAppointments();
});

// Section Navigation
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.health-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Show selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = 'block';
    selectedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Health Checklist Functions
function updateChecklistProgress() {
  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  const checked = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
  const total = checkboxes.length;
  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
  
  document.getElementById('checklist-percentage').textContent = percentage + '%';
  document.getElementById('progress-fill').style.width = percentage + '%';
  
  // Save checklist state
  saveChecklistState();
}

function resetChecklist() {
  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  updateChecklistProgress();
}

function saveChecklistState() {
  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  const state = Array.from(checkboxes).map(cb => cb.checked);
  localStorage.setItem('healthChecklistState', JSON.stringify(state));
}

function loadChecklistState() {
  const savedState = localStorage.getItem('healthChecklistState');
  if (savedState) {
    const state = JSON.parse(savedState);
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
      if (state[index]) {
        checkbox.checked = true;
      }
    });
    updateChecklistProgress();
  }
}

// Add event listeners to checklist items
document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateChecklistProgress);
});

// Symptom Checker Functions
const symptomDatabase = {
  vomiting: {
    severity: 'medium',
    possibleCauses: ['Dietary indiscretion', 'Gastritis', 'Intestinal parasites', 'Food allergies', 'Pancreatitis'],
    recommendations: 'If vomiting persists for more than 24 hours, contains blood, or is accompanied by lethargy, seek veterinary care immediately. Withhold food for 12-24 hours and offer small amounts of water.',
    urgent: false
  },
  diarrhea: {
    severity: 'medium',
    possibleCauses: ['Dietary changes', 'Intestinal parasites', 'Food allergies', 'Infections', 'Stress'],
    recommendations: 'Monitor for dehydration. If diarrhea is severe, bloody, or lasts more than 48 hours, consult your veterinarian. Ensure access to fresh water.',
    urgent: false
  },
  lethargy: {
    severity: 'high',
    possibleCauses: ['Infection', 'Pain', 'Metabolic disorders', 'Heart disease', 'Anemia'],
    recommendations: 'Sudden or extreme lethargy requires immediate veterinary attention. Monitor for other symptoms and check temperature.',
    urgent: true
  },
  'loss-appetite': {
    severity: 'medium',
    possibleCauses: ['Dental problems', 'Gastrointestinal issues', 'Stress', 'Infections', 'Kidney disease'],
    recommendations: 'If loss of appetite persists for more than 24-48 hours, consult your veterinarian. Check for other symptoms like vomiting or lethargy.',
    urgent: false
  },
  coughing: {
    severity: 'medium',
    possibleCauses: ['Kennel cough', 'Heart disease', 'Allergies', 'Respiratory infection', 'Tracheal collapse'],
    recommendations: 'Persistent coughing, especially if accompanied by difficulty breathing, requires veterinary evaluation. Note the type and frequency of cough.',
    urgent: false
  },
  sneezing: {
    severity: 'low',
    possibleCauses: ['Upper respiratory infection', 'Allergies', 'Foreign object', 'Dental disease'],
    recommendations: 'Occasional sneezing is normal. If persistent or accompanied by discharge, consult your veterinarian.',
    urgent: false
  },
  scratching: {
    severity: 'low',
    possibleCauses: ['Fleas', 'Allergies', 'Skin infections', 'Dry skin', 'Parasites'],
    recommendations: 'Check for fleas and skin irritation. If scratching is excessive or causing wounds, seek veterinary care. Regular flea prevention is important.',
    urgent: false
  },
  limping: {
    severity: 'medium',
    possibleCauses: ['Injury', 'Arthritis', 'Paw pad injury', 'Muscle strain', 'Joint disease'],
    recommendations: 'Rest the pet and check for visible injuries. If limping persists for more than 24 hours or is severe, consult your veterinarian.',
    urgent: false
  },
  discharge: {
    severity: 'medium',
    possibleCauses: ['Infection', 'Allergies', 'Foreign body', 'Conjunctivitis', 'Upper respiratory infection'],
    recommendations: 'Yellow or green discharge indicates infection. Clean gently with warm water and consult your veterinarian if discharge persists.',
    urgent: false
  },
  'weight-loss': {
    severity: 'high',
    possibleCauses: ['Diabetes', 'Hyperthyroidism', 'Cancer', 'Kidney disease', 'Dental disease'],
    recommendations: 'Unexplained weight loss requires veterinary evaluation. Monitor food intake and check for other symptoms.',
    urgent: true
  },
  'excessive-thirst': {
    severity: 'high',
    possibleCauses: ['Diabetes', 'Kidney disease', 'Cushings disease', 'Liver disease', 'Hyperthyroidism'],
    recommendations: 'Excessive thirst can indicate serious conditions. Monitor urination frequency and consult your veterinarian promptly.',
    urgent: true
  },
  'bad-breath': {
    severity: 'low',
    possibleCauses: ['Dental disease', 'Kidney disease', 'Diabetes', 'Gastrointestinal issues'],
    recommendations: 'Bad breath often indicates dental disease. Schedule a dental checkup. Sudden, severe bad breath may indicate metabolic issues.',
    urgent: false
  }
};

function analyzeSymptoms() {
  const selectedSymptoms = Array.from(document.querySelectorAll('.symptom-option input:checked'))
    .map(cb => cb.value);
  
  const resultsDiv = document.getElementById('symptom-results');
  
  if (selectedSymptoms.length === 0) {
    resultsDiv.innerHTML = '<h3>Assessment:</h3><p class="no-symptoms">Select symptoms above to see potential causes and recommendations.</p>';
    return;
  }
  
  let html = '<h3>Assessment:</h3><div class="symptom-assessment">';
  
  // Check for urgent symptoms
  const hasUrgent = selectedSymptoms.some(symptom => symptomDatabase[symptom]?.urgent);
  
  if (hasUrgent) {
    html += `
      <div class="assessment-item urgent">
        <h4>⚠️ URGENT: Seek Immediate Veterinary Care</h4>
        <p>Some symptoms you've selected indicate potentially serious conditions that require prompt medical attention.</p>
      </div>
    `;
  }
  
  selectedSymptoms.forEach(symptom => {
    const data = symptomDatabase[symptom];
    if (data) {
      html += `
        <div class="assessment-item ${data.urgent ? 'urgent' : ''}">
          <h4>${symptom.replace(/-/g, ' ').toUpperCase()}</h4>
          <p><strong>Possible Causes:</strong></p>
          <ul>
            ${data.possibleCauses.map(cause => `<li>${cause}</li>`).join('')}
          </ul>
          <p><strong>Recommendations:</strong> ${data.recommendations}</p>
        </div>
      `;
    }
  });
  
  html += '</div>';
  resultsDiv.innerHTML = html;
}

// Toggle symptom selection styling
document.querySelectorAll('.symptom-option').forEach(option => {
  option.addEventListener('click', function() {
    const checkbox = this.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    this.classList.toggle('selected', checkbox.checked);
    analyzeSymptoms();
  });
});

// Vaccination Tracker Functions
function addVaccination(event) {
  event.preventDefault();
  
  const petName = document.getElementById('vax-pet-name').value;
  const vaxType = document.getElementById('vax-type').value;
  const vaxDate = document.getElementById('vax-date').value;
  const nextDate = document.getElementById('vax-next-date').value;
  const vet = document.getElementById('vax-vet').value;
  
  const vaccination = {
    id: Date.now(),
    petName,
    vaxType,
    vaxDate,
    nextDate,
    vet
  };
  
  let vaccinations = JSON.parse(localStorage.getItem('vaccinations') || '[]');
  vaccinations.push(vaccination);
  localStorage.setItem('vaccinations', JSON.stringify(vaccinations));
  
  displayVaccinations();
  document.getElementById('vaccination-form').reset();
}

function displayVaccinations() {
  const vaccinations = JSON.parse(localStorage.getItem('vaccinations') || '[]');
  const container = document.getElementById('vaccination-records');
  
  if (vaccinations.length === 0) {
    container.innerHTML = '<p class="no-records">No vaccination records yet. Add your first record above!</p>';
    return;
  }
  
  container.innerHTML = vaccinations.map(vax => {
    const nextDate = new Date(vax.nextDate);
    const today = new Date();
    const daysUntil = Math.floor((nextDate - today) / (1000 * 60 * 60 * 24));
    
    let badge = '<span class="record-badge">Up to date</span>';
    if (daysUntil < 0) {
      badge = '<span class="record-badge overdue">Overdue</span>';
    } else if (daysUntil < 30) {
      badge = '<span class="record-badge due-soon">Due Soon</span>';
    }
    
    return `
      <div class="vaccination-record">
        <div class="record-header">
          <h4>${vax.petName} - ${vax.vaxType}</h4>
          ${badge}
        </div>
        <div class="record-details">
          <p><strong>Administered:</strong> ${formatDate(vax.vaxDate)}</p>
          <p><strong>Next Due:</strong> ${formatDate(vax.nextDate)}</p>
          ${vax.vet ? `<p><strong>Veterinarian:</strong> ${vax.vet}</p>` : ''}
        </div>
        <button class="btn-delete" onclick="deleteVaccination(${vax.id})">Delete</button>
      </div>
    `;
  }).join('');
}

function deleteVaccination(id) {
  let vaccinations = JSON.parse(localStorage.getItem('vaccinations') || '[]');
  vaccinations = vaccinations.filter(vax => vax.id !== id);
  localStorage.setItem('vaccinations', JSON.stringify(vaccinations));
  displayVaccinations();
}

// Weight Monitor Functions
function addWeightEntry(event) {
  event.preventDefault();
  
  const petName = document.getElementById('weight-pet-name').value;
  const weight = document.getElementById('weight-value').value;
  const date = document.getElementById('weight-date').value;
  const notes = document.getElementById('weight-notes').value;
  
  const entry = {
    id: Date.now(),
    petName,
    weight: parseFloat(weight),
    date,
    notes
  };
  
  let weights = JSON.parse(localStorage.getItem('weights') || '[]');
  weights.push(entry);
  weights.sort((a, b) => new Date(a.date) - new Date(b.date));
  localStorage.setItem('weights', JSON.stringify(weights));
  
  displayWeightHistory();
  document.getElementById('weight-form').reset();
}

function displayWeightHistory() {
  const weights = JSON.parse(localStorage.getItem('weights') || '[]');
  const container = document.getElementById('weight-history');
  
  if (weights.length === 0) {
    container.innerHTML = '<p class="no-records">No weight records yet. Add your first entry above!</p>';
    return;
  }
  
  container.innerHTML = weights.reverse().map(entry => `
    <div class="weight-entry">
      <div class="record-header">
        <h4>${entry.petName}</h4>
        <span class="record-badge">${entry.weight} kg</span>
      </div>
      <div class="record-details">
        <p><strong>Date:</strong> ${formatDate(entry.date)}</p>
        ${entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : ''}
      </div>
      <button class="btn-delete" onclick="deleteWeightEntry(${entry.id})">Delete</button>
    </div>
  `).join('');
}

function deleteWeightEntry(id) {
  let weights = JSON.parse(localStorage.getItem('weights') || '[]');
  weights = weights.filter(entry => entry.id !== id);
  localStorage.setItem('weights', JSON.stringify(weights));
  displayWeightHistory();
}

// Appointment Functions
function addAppointment(event) {
  event.preventDefault();
  
  const petName = document.getElementById('appt-pet-name').value;
  const type = document.getElementById('appt-type').value;
  const datetime = document.getElementById('appt-datetime').value;
  const vet = document.getElementById('appt-vet').value;
  const notes = document.getElementById('appt-notes').value;
  
  const appointment = {
    id: Date.now(),
    petName,
    type,
    datetime,
    vet,
    notes
  };
  
  let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  appointments.push(appointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  
  displayAppointments();
  document.getElementById('appointment-form').reset();
}

function displayAppointments() {
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  const now = new Date();
  
  const upcoming = appointments.filter(appt => new Date(appt.datetime) >= now)
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  
  const past = appointments.filter(appt => new Date(appt.datetime) < now)
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
  
  displayAppointmentList('appointments-upcoming', upcoming, 'No upcoming appointments. Schedule one above!');
  displayAppointmentList('appointments-past', past, 'No past appointments recorded.');
}

function displayAppointmentList(containerId, appointments, emptyMessage) {
  const container = document.getElementById(containerId);
  
  if (appointments.length === 0) {
    container.innerHTML = `<p class="no-records">${emptyMessage}</p>`;
    return;
  }
  
  container.innerHTML = appointments.map(appt => `
    <div class="appointment-card">
      <div class="record-header">
        <h4>${appt.petName}</h4>
        <span class="record-badge">${appt.type}</span>
      </div>
      <div class="record-details">
        <p><strong>Date & Time:</strong> ${formatDateTime(appt.datetime)}</p>
        <p><strong>Location:</strong> ${appt.vet}</p>
        ${appt.notes ? `<p><strong>Notes:</strong> ${appt.notes}</p>` : ''}
      </div>
      <button class="btn-delete" onclick="deleteAppointment(${appt.id})">Delete</button>
    </div>
  `).join('');
}

function deleteAppointment(id) {
  let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  appointments = appointments.filter(appt => appt.id !== id);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  displayAppointments();
}

function sortAppointments() {
  displayAppointments();
}

// Pet Profile Functions
function savePetProfile() {
  const profile = {
    name: document.getElementById('profile-name').value,
    species: document.getElementById('profile-species').value,
    breed: document.getElementById('profile-breed').value,
    dob: document.getElementById('profile-dob').value,
    microchip: document.getElementById('profile-microchip').value,
    allergies: document.getElementById('profile-allergies').value,
    medications: document.getElementById('profile-medications').value
  };
  
  localStorage.setItem('petProfile', JSON.stringify(profile));
  alert('Pet profile saved successfully!');
}

function loadPetProfile() {
  const profile = JSON.parse(localStorage.getItem('petProfile') || '{}');
  
  if (profile.name) {
    document.getElementById('profile-name').value = profile.name || '';
    document.getElementById('profile-species').value = profile.species || '';
    document.getElementById('profile-breed').value = profile.breed || '';
    document.getElementById('profile-dob').value = profile.dob || '';
    document.getElementById('profile-microchip').value = profile.microchip || '';
    document.getElementById('profile-allergies').value = profile.allergies || '';
    document.getElementById('profile-medications').value = profile.medications || '';
  }
}

// Emergency Contacts Functions
function saveEmergencyContacts() {
  const contacts = {
    primary: document.getElementById('vet-primary').value,
    emergency: document.getElementById('vet-emergency').value,
    poison: document.getElementById('poison-control').value
  };
  
  localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  alert('Emergency contacts saved successfully!');
}

function loadEmergencyContacts() {
  const contacts = JSON.parse(localStorage.getItem('emergencyContacts') || '{}');
  
  document.getElementById('vet-primary').value = contacts.primary || '';
  document.getElementById('vet-emergency').value = contacts.emergency || '';
  document.getElementById('poison-control').value = contacts.poison || 'ASPCA: (888) 426-4435';
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(datetimeString) {
  const date = new Date(datetimeString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Load all saved data
function loadSavedData() {
  loadChecklistState();
  displayVaccinations();
  displayWeightHistory();
  displayAppointments();
  loadPetProfile();
  loadEmergencyContacts();
}
