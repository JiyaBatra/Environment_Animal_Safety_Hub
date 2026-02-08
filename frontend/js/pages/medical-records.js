// Medical Records & Treatment Tracking - Frontend JavaScript

const API_BASE_URL = 'http://localhost:3000/api';
const MEDICAL_API = `${API_BASE_URL}/medical-records`;
const ANIMALS_API = `${API_BASE_URL}/animals`;

let currentRecord = null;
let allAnimals = [];
let allRecords = [];

// ======================== Initialization ========================

document.addEventListener('DOMContentLoaded', async () => {
    initializeEventListeners();
    await loadAllAnimals();
    await loadAllRecords();
    updateStats();
    loadAlerts();
    populateAnimalSelects();
});

// ======================== Event Listeners ========================

function initializeEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.closest('.tab-btn')));
    });

    // New record button
    document.getElementById('newRecordBtn').addEventListener('click', () => {
        openNewRecordModal();
    });

    // Vitals
    document.getElementById('recordVitalsBtn').addEventListener('click', () => {
        document.getElementById('vitalsForm').style.display = 'block';
    });

    document.getElementById('cancelVitals').addEventListener('click', () => {
        document.getElementById('vitalsForm').style.display = 'none';
        document.getElementById('recordVitalsForm').reset();
    });

    document.getElementById('recordVitalsForm').addEventListener('submit', handleRecordVitals);

    // Prescriptions
    document.getElementById('newPrescriptionBtn').addEventListener('click', () => {
        document.getElementById('prescriptionForm').style.display = 'block';
    });

    document.getElementById('cancelPrescription').addEventListener('click', () => {
        document.getElementById('prescriptionForm').style.display = 'none';
        document.getElementById('addPrescriptionForm').reset();
    });

    document.getElementById('addPrescriptionForm').addEventListener('submit', handleAddPrescription);

    // Vet Visits
    document.getElementById('scheduleVisitBtn').addEventListener('click', () => {
        document.getElementById('vetVisitForm').style.display = 'block';
    });

    document.getElementById('cancelVetVisit').addEventListener('click', () => {
        document.getElementById('vetVisitForm').style.display = 'none';
        document.getElementById('addVetVisitForm').reset();
    });

    document.getElementById('addVetVisitForm').addEventListener('submit', handleAddVetVisit);

    // Treatment Plans
    document.getElementById('newTreatmentPlanBtn').addEventListener('click', () => {
        document.getElementById('treatmentPlanForm').style.display = 'block';
    });

    document.getElementById('cancelTreatmentPlan').addEventListener('click', () => {
        document.getElementById('treatmentPlanForm').style.display = 'none';
        document.getElementById('addTreatmentPlanForm').reset();
    });

    document.getElementById('addTreatmentPlanForm').addEventListener('submit', handleAddTreatmentPlan);

    // Animal selections
    document.getElementById('animalSelectVitals').addEventListener('change', (e) => {
        if (e.target.value) {
            loadVitalsHistory(e.target.value);
        } else {
            document.getElementById('vitalsHistory').innerHTML = '';
        }
    });

    document.getElementById('animalSelectPrescription').addEventListener('change', (e) => {
        if (e.target.value) {
            loadPrescriptions(e.target.value);
        } else {
            document.getElementById('prescriptionsList').innerHTML = '';
        }
    });

    document.getElementById('animalSelectVet').addEventListener('change', (e) => {
        if (e.target.value) {
            loadVetVisits(e.target.value);
        } else {
            document.getElementById('vetVisitsList').innerHTML = '';
        }
    });

    document.getElementById('animalSelectTreatment').addEventListener('change', (e) => {
        if (e.target.value) {
            loadTreatmentPlans(e.target.value);
        } else {
            document.getElementById('treatmentPlansList').innerHTML = '';
        }
    });

    // Search and filters
    document.getElementById('searchRecords').addEventListener('input', filterRecords);
    document.getElementById('filterStatus').addEventListener('change', filterRecords);

    // Modal close
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal')));
    });

    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal')));
    });
}

// ======================== Tab Management ========================

function switchTab(btn) {
    // Remove active from all tabs and buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    // Add active to clicked button and corresponding content
    btn.classList.add('active');
    const tabId = btn.dataset.tab;
    document.getElementById(tabId).classList.add('active');
}

// ======================== Data Loading ========================

async function loadAllAnimals() {
    try {
        const response = await fetch(`${ANIMALS_API}`);
        allAnimals = await response.json();
    } catch (error) {
        console.error('Error loading animals:', error);
    }
}

async function loadAllRecords() {
    try {
        const response = await fetch(`${MEDICAL_API}`);
        allRecords = await response.json();
        displayRecords(allRecords);
    } catch (error) {
        console.error('Error loading records:', error);
    }
}

function populateAnimalSelects() {
    const selects = ['animalSelectVitals', 'animalSelectPrescription', 'animalSelectVet', 'animalSelectTreatment'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Choose an animal...</option>';
        allAnimals.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal._id;
            option.textContent = `${animal.name} (${animal.species})`;
            select.appendChild(option);
        });
    });
}

// ======================== Records Display ========================

function displayRecords(records) {
    const recordsList = document.getElementById('recordsList');
    
    if (records.length === 0) {
        recordsList.innerHTML = '<p class="no-data-message">No medical records found</p>';
        return;
    }

    recordsList.innerHTML = records.map(record => `
        <div class="record-card" onclick="viewRecordDetails('${record._id}')">
            <div class="record-header">
                <div class="animal-info">
                    <div class="animal-name">${record.animalId?.name || 'Unknown Animal'}</div>
                    <div class="animal-details">
                        <div class="detail-item">
                            <i class="fas fa-hashtag"></i>
                            <span>${record.recordNumber}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-paw"></i>
                            <span>${record.animalId?.species || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-user-md"></i>
                            <span>${record.primaryVet || 'Not assigned'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${formatDate(record.lastUpdated)}</span>
                        </div>
                    </div>
                </div>
                <div class="record-status ${getRecordStatusClass(record)}">${getRecordStatus(record)}</div>
            </div>

            <div class="animal-details">
                <div class="detail-item">
                    <i class="fas fa-heartbeat"></i>
                    <span>${record.vitalSigns?.length || 0} Vital Records</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-stethoscope"></i>
                    <span>${record.diagnosisHistory?.length || 0} Diagnoses</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-pills"></i>
                    <span>${record.prescriptions?.filter(p => p.status === 'active').length || 0} Active Meds</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-bell"></i>
                    <span>${record.alerts?.filter(a => !a.resolved).length || 0} Active Alerts</span>
                </div>
            </div>

            <div class="record-actions">
                <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); viewRecordDetails('${record._id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); editRecord('${record._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        </div>
    `).join('');
}

function getRecordStatus(record) {
    if (record.alerts?.some(a => a.severity === 'critical' && !a.resolved)) return 'Critical';
    if (record.diagnosisHistory?.some(d => d.severity === 'critical')) return 'Critical';
    if (record.prescriptions?.some(p => p.status === 'active')) return 'Active Treatment';
    return 'Stable';
}

function getRecordStatusClass(record) {
    if (record.alerts?.some(a => a.severity === 'critical' && !a.resolved)) return 'status-critical';
    if (record.prescriptions?.some(p => p.status === 'active')) return 'status-active';
    return 'status-stable';
}

function filterRecords() {
    const searchTerm = document.getElementById('searchRecords').value.toLowerCase();
    const status = document.getElementById('filterStatus').value;

    const filtered = allRecords.filter(record => {
        const matchesSearch = 
            record.animalId?.name?.toLowerCase().includes(searchTerm) ||
            record.recordNumber?.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !status || getRecordStatus(record).toLowerCase().includes(status.toLowerCase());
        
        return matchesSearch && matchesStatus;
    });

    displayRecords(filtered);
}

function viewRecordDetails(recordId) {
    const record = allRecords.find(r => r._id === recordId);
    if (!record) return;

    currentRecord = record;
    const modal = document.getElementById('recordDetailModal');
    const content = document.getElementById('recordDetailContent');

    const criticalConditions = record.chronicConditions || [];
    const recentDiagnosis = record.diagnosisHistory?.[record.diagnosisHistory.length - 1];
    const activeMeds = record.prescriptions?.filter(p => p.status === 'active') || [];

    content.innerHTML = `
        <div class="record-detail-section">
            <h3>${record.animalId?.name || 'Unknown'}</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="label">Record Number:</span>
                    <span>${record.recordNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Species:</span>
                    <span>${record.animalId?.species || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Breed:</span>
                    <span>${record.animalId?.breed || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Primary Vet:</span>
                    <span>${record.primaryVet || 'Not assigned'}</span>
                </div>
            </div>
        </div>

        <div class="record-detail-section">
            <h4>Recent Vitals</h4>
            ${record.vitalSigns && record.vitalSigns.length > 0 ? `
                <div class="vitals-grid">
                    <div class="vital">
                        <span class="vital-label">Temperature</span>
                        <span class="vital-value ${isAbnormalTemp(record.vitalSigns[0].temperature) ? 'vital-critical' : ''}">${record.vitalSigns[0].temperature}°C</span>
                    </div>
                    <div class="vital">
                        <span class="vital-label">Weight</span>
                        <span class="vital-value">${record.vitalSigns[0].weight}kg</span>
                    </div>
                    <div class="vital">
                        <span class="vital-label">Heart Rate</span>
                        <span class="vital-value ${isAbnormalHR(record.vitalSigns[0].heartRate) ? 'vital-critical' : ''}">${record.vitalSigns[0].heartRate}bpm</span>
                    </div>
                    <div class="vital">
                        <span class="vital-label">Recorded</span>
                        <span class="vital-value" style="font-size: 0.9rem;">${formatDate(record.vitalSigns[0].date)}</span>
                    </div>
                </div>
            ` : '<p>No vital signs recorded</p>'}
        </div>

        <div class="record-detail-section">
            <h4>Recent Diagnosis</h4>
            ${recentDiagnosis ? `
                <div class="diagnosis-detail">
                    <strong>${recentDiagnosis.condition}</strong>
                    <span class="severity-badge ${recentDiagnosis.severity}">${recentDiagnosis.severity}</span>
                    <p>${recentDiagnosis.description || ''}</p>
                    <small>Diagnosed by: ${recentDiagnosis.diagnosingVet}</small>
                </div>
            ` : '<p>No diagnosis recorded</p>'}
        </div>

        <div class="record-detail-section">
            <h4>Active Medications (${activeMeds.length})</h4>
            ${activeMeds.length > 0 ? `
                <ul class="medications-list">
                    ${activeMeds.map(med => `
                        <li>
                            <strong>${med.medicationName}</strong> - ${med.dosage}, ${med.frequency}
                            <br><small>Until: ${formatDate(med.endDate)}</small>
                        </li>
                    `).join('')}
                </ul>
            ` : '<p>No active medications</p>'}
        </div>

        <div class="record-detail-section">
            <h4>Chronic Conditions</h4>
            ${criticalConditions.length > 0 ? `
                <ul>
                    ${criticalConditions.map(c => `<li>${c}</li>`).join('')}
                </ul>
            ` : '<p>No chronic conditions recorded</p>'}
        </div>

        <div class="record-detail-section">
            <h4>Allergies</h4>
            ${record.allergies && record.allergies.length > 0 ? `
                <ul>
                    ${record.allergies.map(a => `<li>${a}</li>`).join('')}
                </ul>
            ` : '<p>No known allergies</p>'}
        </div>
    `;

    openModal('recordDetailModal');
}

function editRecord(recordId) {
    // This would open an edit form - implementation depends on your needs
    console.log('Edit record:', recordId);
}

// ======================== Alerts ========================

async function loadAlerts() {
    try {
        const response = await fetch(`${MEDICAL_API}`);
        const records = await response.json();
        
        const allAlerts = [];
        records.forEach(record => {
            record.alerts?.forEach((alert, idx) => {
                if (!alert.resolved) {
                    allAlerts.push({
                        ...alert,
                        recordId: record._id,
                        animalName: record.animalId?.name
                    });
                }
            });
        });

        displayAlerts(allAlerts);
    } catch (error) {
        console.error('Error loading alerts:', error);
    }
}

function displayAlerts(alerts) {
    const alertsGrid = document.getElementById('alertsGrid');
    const noAlerts = document.getElementById('noAlerts');

    if (alerts.length === 0) {
        alertsGrid.style.display = 'none';
        noAlerts.style.display = 'block';
        return;
    }

    alertsGrid.style.display = 'grid';
    noAlerts.style.display = 'none';

    alertsGrid.innerHTML = alerts.map((alert, idx) => `
        <div class="alert-card ${alert.severity}">
            <div class="alert-card-header">
                <span class="alert-type">${formatAlertType(alert.type)}</span>
                <span class="alert-severity ${alert.severity}">${alert.severity.toUpperCase()}</span>
            </div>
            <div class="alert-message">${alert.message}</div>
            <div class="alert-animal">Animal: <strong>${alert.animalName}</strong></div>
            <div class="alert-actions">
                <button class="btn btn-primary btn-small" onclick="resolveAlert('${alert.recordId}', ${idx})">
                    <i class="fas fa-check"></i> Resolve
                </button>
            </div>
        </div>
    `).join('');
}

function formatAlertType(type) {
    const types = {
        'medication-pending': 'Pending Medication',
        'follow-up-overdue': 'Overdue Follow-up',
        'critical-condition': 'Critical Condition',
        'vital-abnormal': 'Abnormal Vital'
    };
    return types[type] || type;
}

function resolveAlert(recordId, alertIdx) {
    openModal('alertResolutionModal');
    document.getElementById('resolveAlertForm').onsubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${MEDICAL_API}/${recordId}/alerts/${alertIdx}/resolve`, { method: 'PATCH' });
            closeModal(document.getElementById('alertResolutionModal'));
            loadAlerts();
        } catch (error) {
            console.error('Error resolving alert:', error);
        }
    };
}

// ======================== Vitals ========================

async function handleRecordVitals(e) {
    e.preventDefault();
    const animalId = document.getElementById('animalSelectVitals').value;
    
    if (!animalId) {
        alert('Please select an animal');
        return;
    }

    const record = allRecords.find(r => r.animalId._id === animalId);
    if (!record) {
        alert('Medical record not found for this animal');
        return;
    }

    const vitals = {
        temperature: parseFloat(document.getElementById('temperature').value),
        weight: parseFloat(document.getElementById('weight').value),
        heartRate: parseInt(document.getElementById('heartRate').value),
        respiratoryRate: document.getElementById('respiratoryRate').value ? parseInt(document.getElementById('respiratoryRate').value) : null,
        bloodPressure: document.getElementById('bloodPressure').value,
        notes: document.getElementById('vitalsNotes').value,
        date: new Date()
    };

    try {
        const response = await fetch(`${MEDICAL_API}/${record._id}/vitals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vitals)
        });

        if (response.ok) {
            alert('Vitals recorded successfully');
            document.getElementById('recordVitalsForm').reset();
            document.getElementById('vitalsForm').style.display = 'none';
            await loadAllRecords();
            loadAlerts();
        }
    } catch (error) {
        console.error('Error recording vitals:', error);
        alert('Error recording vitals');
    }
}

async function loadVitalsHistory(animalId) {
    const record = allRecords.find(r => r.animalId._id === animalId);
    if (!record) return;

    const vitalsHistory = document.getElementById('vitalsHistory');
    
    if (!record.vitalSigns || record.vitalSigns.length === 0) {
        vitalsHistory.innerHTML = '<p>No vital signs recorded</p>';
        return;
    }

    vitalsHistory.innerHTML = `
        <h4>Vital Signs History</h4>
        ${record.vitalSigns.map((vital, idx) => `
            <div class="vitals-entry">
                <div class="vitals-date">${formatDateTime(vital.date)}</div>
                <div class="vitals-grid">
                    <div class="vital">
                        <span class="vital-label">Temperature</span>
                        <span class="vital-value ${isAbnormalTemp(vital.temperature) ? 'vital-critical' : ''}">${vital.temperature}°C</span>
                    </div>
                    <div class="vital">
                        <span class="vital-label">Weight</span>
                        <span class="vital-value">${vital.weight}kg</span>
                    </div>
                    <div class="vital">
                        <span class="vital-label">Heart Rate</span>
                        <span class="vital-value ${isAbnormalHR(vital.heartRate) ? 'vital-critical' : ''}">${vital.heartRate}bpm</span>
                    </div>
                    ${vital.respiratoryRate ? `
                        <div class="vital">
                            <span class="vital-label">Respiratory Rate</span>
                            <span class="vital-value">${vital.respiratoryRate}</span>
                        </div>
                    ` : ''}
                    ${vital.bloodPressure ? `
                        <div class="vital">
                            <span class="vital-label">Blood Pressure</span>
                            <span class="vital-value">${vital.bloodPressure}</span>
                        </div>
                    ` : ''}
                </div>
                ${vital.notes ? `<div class="vitals-notes"><strong>Notes:</strong> ${vital.notes}</div>` : ''}
            </div>
        `).join('')}
    `;
}

function isAbnormalTemp(temp) {
    return temp < 36.5 || temp > 39.5;
}

function isAbnormalHR(hr) {
    return hr < 40 || hr > 180;
}

// ======================== Prescriptions ========================

async function handleAddPrescription(e) {
    e.preventDefault();
    const animalId = document.getElementById('animalSelectPrescription').value;
    
    if (!animalId) {
        alert('Please select an animal');
        return;
    }

    const record = allRecords.find(r => r.animalId._id === animalId);
    if (!record) {
        alert('Medical record not found for this animal');
        return;
    }

    const prescription = {
        medicationName: document.getElementById('medicationName').value,
        dosage: document.getElementById('dosage').value,
        frequency: document.getElementById('frequency').value,
        duration: document.getElementById('duration').value,
        startDate: new Date(document.getElementById('startDate').value),
        endDate: new Date(document.getElementById('endDate').value),
        prescribedBy: document.getElementById('prescribedBy').value,
        purpose: document.getElementById('purpose').value,
        sideEffects: document.getElementById('sideEffects').value
    };

    try {
        const response = await fetch(`${MEDICAL_API}/${record._id}/prescriptions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prescription)
        });

        if (response.ok) {
            alert('Prescription added successfully');
            document.getElementById('addPrescriptionForm').reset();
            document.getElementById('prescriptionForm').style.display = 'none';
            await loadAllRecords();
            loadAlerts();
        }
    } catch (error) {
        console.error('Error adding prescription:', error);
        alert('Error adding prescription');
    }
}

async function loadPrescriptions(animalId) {
    const record = allRecords.find(r => r.animalId._id === animalId);
    if (!record) return;

    const prescriptionsList = document.getElementById('prescriptionsList');
    
    if (!record.prescriptions || record.prescriptions.length === 0) {
        prescriptionsList.innerHTML = '<p>No prescriptions found</p>';
        return;
    }

    prescriptionsList.innerHTML = record.prescriptions.map((prescription, idx) => `
        <div class="prescription-card">
            <div class="prescription-header">
                <div class="medication-info">
                    <div class="medication-name">${prescription.medicationName}</div>
                    <div class="medication-details">
                        <div class="med-detail">
                            <span class="med-detail-label">Dosage:</span>
                            <span>${prescription.dosage}</span>
                        </div>
                        <div class="med-detail">
                            <span class="med-detail-label">Frequency:</span>
                            <span>${prescription.frequency}</span>
                        </div>
                        <div class="med-detail">
                            <span class="med-detail-label">Duration:</span>
                            <span>${prescription.duration}</span>
                        </div>
                        <div class="med-detail">
                            <span class="med-detail-label">By:</span>
                            <span>${prescription.prescribedBy}</span>
                        </div>
                    </div>
                </div>
                <span class="prescription-status status-${prescription.status}">${prescription.status.toUpperCase()}</span>
            </div>

            ${prescription.purpose ? `<p><strong>Purpose:</strong> ${prescription.purpose}</p>` : ''}
            ${prescription.sideEffects ? `<p><strong>Side Effects:</strong> ${prescription.sideEffects}</p>` : ''}

            <div class="medication-details" style="margin-top: 1rem;">
                <div class="med-detail">
                    <span class="med-detail-label">Start:</span>
                    <span>${formatDate(prescription.startDate)}</span>
                </div>
                <div class="med-detail">
                    <span class="med-detail-label">End:</span>
                    <span>${formatDate(prescription.endDate)}</span>
                </div>
                <div class="med-detail">
                    <span class="med-detail-label">Days Remaining:</span>
                    <span>${Math.ceil((new Date(prescription.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days</span>
                </div>
            </div>

            ${prescription.administrations && prescription.administrations.length > 0 ? `
                <div class="administrations">
                    <h5>Administration History (${prescription.administrations.length})</h5>
                    ${prescription.administrations.map(admin => `
                        <div class="administration-item">
                            <span class="admin-date">${formatDateTime(admin.date)}</span>
                            <span class="admin-by">By: ${admin.administeredBy || 'Not recorded'}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${prescription.status === 'active' ? `
                <button class="btn btn-primary administer-btn" onclick="recordMedicationAdministration('${record._id}', ${idx})">
                    <i class="fas fa-check-circle"></i> Mark as Administered
                </button>
            ` : ''}
        </div>
    `).join('');
}

async function recordMedicationAdministration(recordId, prescriptionIdx) {
    const administration = {
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        administeredBy: prompt('Who administered the medication?') || 'Staff',
        notes: prompt('Any notes?') || ''
    };

    try {
        const response = await fetch(`${MEDICAL_API}/${recordId}/prescriptions/${prescriptionIdx}/administer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(administration)
        });

        if (response.ok) {
            alert('Medication administration recorded');
            await loadAllRecords();
        }
    } catch (error) {
        console.error('Error recording administration:', error);
    }
}

// ======================== Vet Visits ========================

async function handleAddVetVisit(e) {
    e.preventDefault();
    const animalId = document.getElementById('animalSelectVet').value;
    
    if (!animalId) {
        alert('Please select an animal');
        return;
    }

    const record = allRecords.find(r => r.animalId._id === animalId);
    if (!record) {
        alert('Medical record not found for this animal');
        return;
    }

    const vetVisit = {
        date: new Date(document.getElementById('visitDate').value),
        vetName: document.getElementById('vetName').value,
        vetClinic: document.getElementById('vetClinic').value,
        visitType: document.getElementById('visitType').value,
        reasonForVisit: document.getElementById('reasonForVisit').value,
        nextVisitDate: document.getElementById('nextFollowUp').value ? new Date(document.getElementById('nextFollowUp').value) : null,
        status: 'scheduled'
    };

    try {
        const response = await fetch(`${MEDICAL_API}/${record._id}/vet-visits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vetVisit)
        });

        if (response.ok) {
            alert('Vet visit scheduled successfully');
            document.getElementById('addVetVisitForm').reset();
            document.getElementById('vetVisitForm').style.display = 'none';
            await loadAllRecords();
            loadAlerts();
        }
    } catch (error) {
        console.error('Error scheduling visit:', error);
        alert('Error scheduling visit');
    }
}

async function loadVetVisits(animalId) {
    const record = allRecords.find(r => r.animalId._id === animalId);
    if (!record) return;

    const vetVisitsList = document.getElementById('vetVisitsList');
    
    if (!record.vetVisits || record.vetVisits.length === 0) {
        vetVisitsList.innerHTML = '<p>No vet visits recorded</p>';
        return;
    }

    vetVisitsList.innerHTML = record.vetVisits.map(visit => `
        <div class="visit-card">
            <div class="visit-header">
                <div>
                    <span class="visit-type-badge">${visit.visitType.toUpperCase()}</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.9rem; color: #7f8c8d;">${formatDate(visit.date)}</div>
                </div>
            </div>

            <div class="visit-details">
                <div class="visit-detail">
                    <span class="visit-detail-label">Veterinarian</span>
                    <span class="visit-detail-value">${visit.vetName}</span>
                </div>
                <div class="visit-detail">
                    <span class="visit-detail-label">Clinic</span>
                    <span class="visit-detail-value">${visit.vetClinic || 'Not specified'}</span>
                </div>
                <div class="visit-detail">
                    <span class="visit-detail-label">Status</span>
                    <span class="visit-detail-value">${visit.status}</span>
                </div>
            </div>

            ${visit.reasonForVisit ? `
                <div class="visit-notes">
                    <div class="visit-notes-label">Reason for Visit</div>
                    <div>${visit.reasonForVisit}</div>
                </div>
            ` : ''}

            ${visit.findings ? `
                <div class="visit-notes">
                    <div class="visit-notes-label">Findings</div>
                    <div>${visit.findings}</div>
                </div>
            ` : ''}

            ${visit.nextVisitDate ? `
                <div class="visit-notes">
                    <div class="visit-notes-label">Next Visit Scheduled</div>
                    <div>${formatDate(visit.nextVisitDate)}</div>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ======================== Treatment Plans ========================

async function handleAddTreatmentPlan(e) {
    e.preventDefault();
    const animalId = document.getElementById('animalSelectTreatment').value;
    
    if (!animalId) {
        alert('Please select an animal');
        return;
    }

    const record = allRecords.find(r => r.animalId._id === animalId);
    if (!record) {
        alert('Medical record not found for this animal');
        return;
    }

    const objectives = document.getElementById('planObjectives').value
        .split('\n')
        .filter(o => o.trim())
        .map(o => o.trim());

    const treatmentPlan = {
        condition: document.getElementById('planCondition').value,
        duration: document.getElementById('planDuration').value,
        objectives,
        dietaryRequirements: document.getElementById('planDietaryRequirements').value,
        activityRestrictions: document.getElementById('planActivityRestrictions').value,
        expectedOutcome: document.getElementById('planExpectedOutcome').value,
        status: 'active'
    };

    try {
        const response = await fetch(`${MEDICAL_API}/${record._id}/treatment-plans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(treatmentPlan)
        });

        if (response.ok) {
            alert('Treatment plan created successfully');
            document.getElementById('addTreatmentPlanForm').reset();
            document.getElementById('treatmentPlanForm').style.display = 'none';
            await loadAllRecords();
        }
    } catch (error) {
        console.error('Error creating treatment plan:', error);
        alert('Error creating treatment plan');
    }
}

async function loadTreatmentPlans(animalId) {
    const record = allRecords.find(r => r.animalId._id === animalId);
    if (!record) return;

    const treatmentPlansList = document.getElementById('treatmentPlansList');
    
    if (!record.treatmentPlans || record.treatmentPlans.length === 0) {
        treatmentPlansList.innerHTML = '<p>No treatment plans created</p>';
        return;
    }

    treatmentPlansList.innerHTML = record.treatmentPlans.map((plan, idx) => `
        <div class="plan-card">
            <div class="plan-header">
                <div>
                    <div class="plan-condition">${plan.condition}</div>
                    <small style="color: #7f8c8d;">Duration: ${plan.duration}</small>
                </div>
                <span class="plan-status-badge plan-status-${plan.status}">${plan.status.toUpperCase()}</span>
            </div>

            <div class="plan-sections">
                ${plan.objectives && plan.objectives.length > 0 ? `
                    <div class="plan-section">
                        <div class="plan-section-title">Treatment Objectives</div>
                        <ul class="objectives-list">
                            ${plan.objectives.map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${plan.dietaryRequirements ? `
                    <div class="plan-section">
                        <div class="plan-section-title">Dietary Requirements</div>
                        <div class="plan-section-content">${plan.dietaryRequirements}</div>
                    </div>
                ` : ''}

                ${plan.activityRestrictions ? `
                    <div class="plan-section">
                        <div class="plan-section-title">Activity Restrictions</div>
                        <div class="plan-section-content">${plan.activityRestrictions}</div>
                    </div>
                ` : ''}

                ${plan.expectedOutcome ? `
                    <div class="plan-section">
                        <div class="plan-section-title">Expected Outcome</div>
                        <div class="plan-section-content">${plan.expectedOutcome}</div>
                    </div>
                ` : ''}
            </div>

            ${plan.progressNotes && plan.progressNotes.length > 0 ? `
                <div class="progress-notes">
                    <h5>Progress Notes (${plan.progressNotes.length})</h5>
                    ${plan.progressNotes.map(note => `
                        <div class="progress-note">
                            <div class="progress-date">${formatDateTime(note.date)}</div>
                            <span class="progress-status ${note.status || 'on-track'}">${(note.status || 'on-track').toUpperCase()}</span>
                            <p>${note.note}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <button class="btn btn-primary administer-btn" onclick="addProgressNote('${record._id}', ${idx})">
                <i class="fas fa-plus"></i> Add Progress Note
            </button>
        </div>
    `).join('');
}

async function addProgressNote(recordId, planIdx) {
    const note = prompt('Enter progress note:');
    if (!note) return;

    const status = prompt('Status (on-track, improving, plateaued, worsening):') || 'on-track';

    const progressNote = {
        date: new Date(),
        note,
        versionedBy: 'Staff',
        status
    };

    try {
        const response = await fetch(`${MEDICAL_API}/${recordId}/treatment-plans/${planIdx}/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(progressNote)
        });

        if (response.ok) {
            alert('Progress note added');
            await loadAllRecords();
        }
    } catch (error) {
        console.error('Error adding progress note:', error);
    }
}

// ======================== Stats ========================

function updateStats() {
    const totalRecords = allRecords.length;
    const activeMeds = allRecords.reduce((sum, r) => sum + (r.prescriptions?.filter(p => p.status === 'active').length || 0), 0);
    const scheduledVisits = allRecords.reduce((sum, r) => sum + (r.vetVisits?.filter(v => v.status === 'scheduled').length || 0), 0);
    
    let overdueFollowups = 0;
    allRecords.forEach(record => {
        record.vetVisits?.forEach(visit => {
            if (visit.nextVisitDate && visit.nextVisitDate < new Date() && visit.status !== 'completed') {
                overdueFollowups++;
            }
        });
    });

    document.getElementById('statTotalRecords').textContent = totalRecords;
    document.getElementById('statActiveMeds').textContent = activeMeds;
    document.getElementById('statScheduledVisits').textContent = scheduledVisits;
    document.getElementById('statOverdueFollowups').textContent = overdueFollowups;
}

// ======================== Utility Functions ========================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + 
           ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function openNewRecordModal() {
    alert('New Medical Record creation requires an Animal first. Please use the Animals management section.');
}

// Auto-refresh alerts every 30 seconds
setInterval(loadAlerts, 30000);
