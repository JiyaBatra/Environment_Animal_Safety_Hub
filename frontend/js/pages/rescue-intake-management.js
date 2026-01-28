// Rescue Intake & Quarantine Management System
// Handles intake queue, triage scoring, quarantine tracking, and medical management

// Sample data structure for intake records
let intakeRecords = [];
let alerts = [];
let currentFilter = 'all';

// Initialize the system
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    loadIntakeRecords();
    updateStatistics();
    checkAlerts();
    
    // Auto-refresh alerts every 5 minutes
    setInterval(checkAlerts, 300000);
});

// Initialize system with sample data
function initializeSystem() {
    // Load from localStorage or initialize with sample data
    const savedRecords = localStorage.getItem('intakeRecords');
    if (savedRecords) {
        intakeRecords = JSON.parse(savedRecords);
    } else {
        // Initialize with sample data
        intakeRecords = [
            {
                id: 'INT-001',
                intakeDate: '2026-01-25',
                animalName: 'Luna',
                species: 'dog',
                breed: 'Mixed Breed',
                age: '2 years',
                gender: 'female',
                weight: 15.5,
                intakeSource: 'stray',
                intakeLocation: 'Main Street Park',
                triageScore: 8,
                priority: 'Critical',
                physicalCondition: '5',
                behaviorAssessment: '3',
                medicalFlags: ['injury', 'malnutrition'],
                medicalNotes: 'Leg injury, severely underweight',
                quarantineRequired: true,
                quarantineStatus: 'active',
                quarantineStartDate: '2026-01-25',
                quarantineDuration: 14,
                quarantineEndDate: '2026-02-08',
                isolationRoom: 'iso-1',
                treatments: ['rabies-vaccine', 'deworming', 'flea-tick'],
                treatmentsDone: ['deworming'],
                vetAppointmentDate: '2026-01-26',
                vetAppointmentTime: '10:00',
                vetClinic: 'emergency',
                medicalCost: 350,
                quarantineCost: 140,
                suppliesCost: 75,
                status: 'quarantine',
                paperwork: [],
                releaseCriteria: {
                    medicalClearance: false,
                    vaccinationsComplete: false,
                    behaviorAssessment: false,
                    fosterPlacement: false
                }
            },
            {
                id: 'INT-002',
                intakeDate: '2026-01-26',
                animalName: 'Max',
                species: 'cat',
                breed: 'Domestic Shorthair',
                age: '1 year',
                gender: 'male',
                weight: 4.2,
                intakeSource: 'owner-surrender',
                intakeLocation: 'N/A',
                triageScore: 3,
                priority: 'Moderate',
                physicalCondition: '3',
                behaviorAssessment: '2',
                medicalFlags: ['respiratory'],
                medicalNotes: 'Upper respiratory infection',
                quarantineRequired: true,
                quarantineStatus: 'active',
                quarantineStartDate: '2026-01-26',
                quarantineDuration: 10,
                quarantineEndDate: '2026-02-05',
                isolationRoom: 'iso-3',
                treatments: ['fvrcp-vaccine', 'deworming', 'microchip'],
                treatmentsDone: [],
                vetAppointmentDate: '2026-01-28',
                vetAppointmentTime: '14:00',
                vetClinic: 'in-house',
                medicalCost: 150,
                quarantineCost: 100,
                suppliesCost: 50,
                status: 'quarantine',
                paperwork: [],
                releaseCriteria: {
                    medicalClearance: false,
                    vaccinationsComplete: false,
                    behaviorAssessment: false,
                    fosterPlacement: false
                }
            }
        ];
        saveIntakeRecords();
    }
}

// Calculate triage score based on physical condition and behavior
function calculateTriageScore() {
    const physicalCondition = parseInt(document.getElementById('physicalCondition').value) || 0;
    const behaviorAssessment = parseInt(document.getElementById('behaviorAssessment').value) || 0;
    
    const score = physicalCondition + behaviorAssessment;
    const scoreDisplay = document.getElementById('triageScoreDisplay');
    
    let priority = 'Not Assessed';
    let colorClass = 'triage-none';
    
    if (score >= 8) {
        priority = 'Critical';
        colorClass = 'triage-critical';
    } else if (score >= 6) {
        priority = 'High';
        colorClass = 'triage-high';
    } else if (score >= 4) {
        priority = 'Moderate';
        colorClass = 'triage-moderate';
    } else if (score > 0) {
        priority = 'Low';
        colorClass = 'triage-low';
    }
    
    scoreDisplay.innerHTML = `
        <span class="score ${colorClass}">${score}</span>
        <span class="priority ${colorClass}">${priority}</span>
    `;
    
    return { score, priority };
}

// Toggle quarantine fields based on selection
function toggleQuarantineFields() {
    const quarantineRequired = document.getElementById('quarantineRequired').value;
    const durationGroup = document.getElementById('quarantineDurationGroup');
    const roomGroup = document.getElementById('isolationRoomGroup');
    
    if (quarantineRequired === 'yes') {
        durationGroup.style.display = 'block';
        roomGroup.style.display = 'block';
        document.getElementById('quarantineDuration').required = true;
        document.getElementById('isolationRoom').required = true;
    } else {
        durationGroup.style.display = 'none';
        roomGroup.style.display = 'none';
        document.getElementById('quarantineDuration').required = false;
        document.getElementById('isolationRoom').required = false;
    }
}

// Calculate total cost
function updateTotalCost() {
    const medical = parseFloat(document.getElementById('medicalCost').value) || 0;
    const quarantine = parseFloat(document.getElementById('quarantineCost').value) || 0;
    const supplies = parseFloat(document.getElementById('suppliesCost').value) || 0;
    
    const total = medical + quarantine + supplies;
    document.getElementById('totalCost').textContent = total.toFixed(2);
}

// Add event listeners for cost calculation
document.addEventListener('DOMContentLoaded', function() {
    const costFields = ['medicalCost', 'quarantineCost', 'suppliesCost'];
    costFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateTotalCost);
        }
    });
});

// Open intake modal
function openIntakeModal() {
    document.getElementById('intakeModal').style.display = 'block';
    document.getElementById('intakeForm').reset();
    calculateTriageScore();
    updateTotalCost();
}

// Close intake modal
function closeIntakeModal() {
    document.getElementById('intakeModal').style.display = 'none';
}

// Submit new intake
function submitIntake(event) {
    event.preventDefault();
    
    const triageResult = calculateTriageScore();
    
    // Get medical flags
    const medicalFlags = Array.from(document.querySelectorAll('input[name="medicalFlag"]:checked'))
        .map(cb => cb.value);
    
    // Get treatments
    const treatments = Array.from(document.querySelectorAll('input[name="treatment"]:checked'))
        .map(cb => cb.value);
    
    // Calculate quarantine end date
    const quarantineRequired = document.getElementById('quarantineRequired').value === 'yes';
    let quarantineEndDate = null;
    if (quarantineRequired) {
        const duration = parseInt(document.getElementById('quarantineDuration').value);
        const startDate = new Date();
        quarantineEndDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
    }
    
    // Create new intake record
    const newIntake = {
        id: `INT-${String(intakeRecords.length + 1).padStart(3, '0')}`,
        intakeDate: new Date().toISOString().split('T')[0],
        animalName: document.getElementById('animalName').value,
        species: document.getElementById('species').value,
        breed: document.getElementById('breed').value || 'Unknown',
        age: document.getElementById('age').value || 'Unknown',
        gender: document.getElementById('gender').value,
        weight: parseFloat(document.getElementById('weight').value) || 0,
        intakeSource: document.getElementById('intakeSource').value,
        intakeLocation: document.getElementById('intakeLocation').value,
        intakeNotes: document.getElementById('intakeNotes').value,
        triageScore: triageResult.score,
        priority: triageResult.priority,
        physicalCondition: document.getElementById('physicalCondition').value,
        behaviorAssessment: document.getElementById('behaviorAssessment').value,
        medicalFlags: medicalFlags,
        medicalNotes: document.getElementById('medicalNotes').value,
        quarantineRequired: quarantineRequired,
        quarantineStatus: quarantineRequired ? 'active' : 'n/a',
        quarantineStartDate: quarantineRequired ? new Date().toISOString().split('T')[0] : null,
        quarantineDuration: quarantineRequired ? parseInt(document.getElementById('quarantineDuration').value) : 0,
        quarantineEndDate: quarantineEndDate ? quarantineEndDate.toISOString().split('T')[0] : null,
        isolationRoom: quarantineRequired ? document.getElementById('isolationRoom').value : null,
        treatments: treatments,
        treatmentsDone: [],
        vetAppointmentDate: document.getElementById('vetAppointmentDate').value,
        vetAppointmentTime: document.getElementById('vetAppointmentTime').value,
        vetClinic: document.getElementById('vetClinic').value,
        medicalCost: parseFloat(document.getElementById('medicalCost').value) || 0,
        quarantineCost: parseFloat(document.getElementById('quarantineCost').value) || 0,
        suppliesCost: parseFloat(document.getElementById('suppliesCost').value) || 0,
        status: quarantineRequired ? 'quarantine' : 'intake',
        paperwork: [],
        releaseCriteria: {
            medicalClearance: false,
            vaccinationsComplete: false,
            behaviorAssessment: false,
            fosterPlacement: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    intakeRecords.unshift(newIntake);
    saveIntakeRecords();
    closeIntakeModal();
    loadIntakeRecords();
    updateStatistics();
    checkAlerts();
    
    showNotification('Success', `Intake ${newIntake.id} created successfully for ${newIntake.animalName}`, 'success');
}

// Load and display intake records
function loadIntakeRecords() {
    const tbody = document.getElementById('intakeQueueBody');
    tbody.innerHTML = '';
    
    let filteredRecords = intakeRecords;
    
    // Apply filter
    if (currentFilter === 'quarantine') {
        filteredRecords = intakeRecords.filter(record => record.quarantineStatus === 'active');
    } else if (currentFilter === 'critical') {
        filteredRecords = intakeRecords.filter(record => record.priority === 'Critical' || record.priority === 'High');
    }
    
    if (filteredRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No intake records found</td></tr>';
        return;
    }
    
    filteredRecords.forEach(record => {
        const row = document.createElement('tr');
        row.className = `priority-${record.priority.toLowerCase()}`;
        
        // Medical flags display
        const flagsHtml = record.medicalFlags.length > 0 
            ? record.medicalFlags.map(flag => `<span class="medical-flag">${flag}</span>`).join(' ')
            : '<span class="no-flags">None</span>';
        
        // Quarantine status
        let quarantineHtml = 'N/A';
        if (record.quarantineRequired) {
            const daysRemaining = calculateDaysRemaining(record.quarantineEndDate);
            const statusClass = daysRemaining <= 2 ? 'status-warning' : 'status-active';
            quarantineHtml = `
                <span class="quarantine-status ${statusClass}">
                    ${record.quarantineStatus}<br>
                    <small>${daysRemaining} days left</small>
                </span>
            `;
        }
        
        row.innerHTML = `
            <td><strong>${record.id}</strong></td>
            <td>${formatDate(record.intakeDate)}</td>
            <td>
                <strong>${record.animalName}</strong><br>
                <small>${record.species} - ${record.breed}</small>
            </td>
            <td>
                <span class="triage-badge triage-${record.priority.toLowerCase()}">
                    ${record.triageScore} - ${record.priority}
                </span>
            </td>
            <td class="medical-flags-cell">${flagsHtml}</td>
            <td>${quarantineHtml}</td>
            <td><span class="isolation-room">${record.isolationRoom || 'N/A'}</span></td>
            <td class="actions-cell">
                <button class="btn-icon" onclick="viewAnimalDetails('${record.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" onclick="updateQuarantine('${record.id}')" title="Update Quarantine">
                    <i class="fas fa-shield-virus"></i>
                </button>
                <button class="btn-icon" onclick="editIntake('${record.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-danger" onclick="deleteIntake('${record.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Filter intake queue
function filterIntakeQueue(filter) {
    currentFilter = filter;
    loadIntakeRecords();
    
    // Update button states
    document.querySelectorAll('.action-buttons .btn-secondary').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// View animal details
function viewAnimalDetails(intakeId) {
    const record = intakeRecords.find(r => r.id === intakeId);
    if (!record) return;
    
    const modal = document.getElementById('animalDetailsModal');
    const content = document.getElementById('animalDetailsContent');
    
    // Calculate progress
    const releaseProgress = Object.values(record.releaseCriteria).filter(v => v).length;
    const releaseTotal = Object.keys(record.releaseCriteria).length;
    const releasePercentage = (releaseProgress / releaseTotal) * 100;
    
    // Treatments progress
    const treatmentsProgress = record.treatmentsDone.length;
    const treatmentsTotal = record.treatments.length;
    const treatmentsPercentage = treatmentsTotal > 0 ? (treatmentsProgress / treatmentsTotal) * 100 : 0;
    
    content.innerHTML = `
        <h2><i class="fas fa-paw"></i> ${record.animalName} - ${record.id}</h2>
        
        <div class="details-grid">
            <!-- Basic Info -->
            <div class="detail-section">
                <h3>Basic Information</h3>
                <div class="detail-row">
                    <span class="label">Species:</span>
                    <span class="value">${record.species}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Breed:</span>
                    <span class="value">${record.breed}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Age:</span>
                    <span class="value">${record.age}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Gender:</span>
                    <span class="value">${record.gender}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Weight:</span>
                    <span class="value">${record.weight} kg</span>
                </div>
                <div class="detail-row">
                    <span class="label">Intake Date:</span>
                    <span class="value">${formatDate(record.intakeDate)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Source:</span>
                    <span class="value">${record.intakeSource}</span>
                </div>
            </div>
            
            <!-- Triage & Medical -->
            <div class="detail-section">
                <h3>Triage & Medical</h3>
                <div class="detail-row">
                    <span class="label">Triage Score:</span>
                    <span class="value">
                        <span class="triage-badge triage-${record.priority.toLowerCase()}">
                            ${record.triageScore} - ${record.priority}
                        </span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="label">Medical Flags:</span>
                    <span class="value">
                        ${record.medicalFlags.map(flag => `<span class="medical-flag">${flag}</span>`).join(' ')}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="label">Medical Notes:</span>
                    <span class="value">${record.medicalNotes || 'None'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Vet Appointment:</span>
                    <span class="value">${formatDate(record.vetAppointmentDate)} at ${record.vetAppointmentTime}</span>
                </div>
            </div>
            
            <!-- Quarantine Status -->
            <div class="detail-section">
                <h3>Quarantine Status</h3>
                ${record.quarantineRequired ? `
                    <div class="detail-row">
                        <span class="label">Status:</span>
                        <span class="value"><span class="status-badge status-${record.quarantineStatus}">${record.quarantineStatus}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Start Date:</span>
                        <span class="value">${formatDate(record.quarantineStartDate)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">End Date:</span>
                        <span class="value">${formatDate(record.quarantineEndDate)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Days Remaining:</span>
                        <span class="value">${calculateDaysRemaining(record.quarantineEndDate)} days</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Isolation Room:</span>
                        <span class="value">${record.isolationRoom}</span>
                    </div>
                ` : '<p>No quarantine required</p>'}
            </div>
            
            <!-- Treatment Progress -->
            <div class="detail-section">
                <h3>Treatment Progress</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${treatmentsPercentage}%"></div>
                    <span class="progress-text">${treatmentsProgress} / ${treatmentsTotal} Completed</span>
                </div>
                <div class="treatment-checklist">
                    ${record.treatments.map(treatment => `
                        <label class="treatment-item">
                            <input type="checkbox" 
                                ${record.treatmentsDone.includes(treatment) ? 'checked' : ''}
                                onchange="toggleTreatment('${record.id}', '${treatment}')">
                            <span>${treatment}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <!-- Release Criteria -->
            <div class="detail-section">
                <h3>Release Criteria</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${releasePercentage}%"></div>
                    <span class="progress-text">${releaseProgress} / ${releaseTotal} Completed</span>
                </div>
                <div class="criteria-checklist">
                    <label>
                        <input type="checkbox" 
                            ${record.releaseCriteria.medicalClearance ? 'checked' : ''}
                            onchange="toggleCriteria('${record.id}', 'medicalClearance')">
                        <span>Medical Clearance</span>
                    </label>
                    <label>
                        <input type="checkbox" 
                            ${record.releaseCriteria.vaccinationsComplete ? 'checked' : ''}
                            onchange="toggleCriteria('${record.id}', 'vaccinationsComplete')">
                        <span>Vaccinations Complete</span>
                    </label>
                    <label>
                        <input type="checkbox" 
                            ${record.releaseCriteria.behaviorAssessment ? 'checked' : ''}
                            onchange="toggleCriteria('${record.id}', 'behaviorAssessment')">
                        <span>Behavior Assessment</span>
                    </label>
                    <label>
                        <input type="checkbox" 
                            ${record.releaseCriteria.fosterPlacement ? 'checked' : ''}
                            onchange="toggleCriteria('${record.id}', 'fosterPlacement')">
                        <span>Foster Placement Secured</span>
                    </label>
                </div>
                ${releasePercentage === 100 ? '<button class="btn btn-success" onclick="releaseAnimal(\'' + record.id + '\')"><i class="fas fa-check"></i> Release to Foster</button>' : ''}
            </div>
            
            <!-- Cost Summary -->
            <div class="detail-section">
                <h3>Cost Summary</h3>
                <div class="detail-row">
                    <span class="label">Medical Care:</span>
                    <span class="value">$${record.medicalCost.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Quarantine Care:</span>
                    <span class="value">$${record.quarantineCost.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Supplies:</span>
                    <span class="value">$${record.suppliesCost.toFixed(2)}</span>
                </div>
                <div class="detail-row total-cost">
                    <span class="label">Total:</span>
                    <span class="value">$${(record.medicalCost + record.quarantineCost + record.suppliesCost).toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn btn-secondary" onclick="closeAnimalDetailsModal()">Close</button>
            <button class="btn btn-primary" onclick="editIntake('${record.id}'); closeAnimalDetailsModal();">Edit Record</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close animal details modal
function closeAnimalDetailsModal() {
    document.getElementById('animalDetailsModal').style.display = 'none';
}

// Toggle treatment status
function toggleTreatment(intakeId, treatment) {
    const record = intakeRecords.find(r => r.id === intakeId);
    if (!record) return;
    
    const index = record.treatmentsDone.indexOf(treatment);
    if (index > -1) {
        record.treatmentsDone.splice(index, 1);
    } else {
        record.treatmentsDone.push(treatment);
    }
    
    record.updatedAt = new Date().toISOString();
    saveIntakeRecords();
    viewAnimalDetails(intakeId); // Refresh view
}

// Toggle release criteria
function toggleCriteria(intakeId, criteria) {
    const record = intakeRecords.find(r => r.id === intakeId);
    if (!record) return;
    
    record.releaseCriteria[criteria] = !record.releaseCriteria[criteria];
    record.updatedAt = new Date().toISOString();
    saveIntakeRecords();
    viewAnimalDetails(intakeId); // Refresh view
    checkAlerts(); // Update alerts
}

// Update quarantine status
function updateQuarantine(intakeId) {
    const record = intakeRecords.find(r => r.id === intakeId);
    if (!record) return;
    
    const newStatus = prompt(`Update quarantine status for ${record.animalName}:\n\nOptions: active, completed, extended\n\nCurrent: ${record.quarantineStatus}`);
    
    if (newStatus && ['active', 'completed', 'extended'].includes(newStatus.toLowerCase())) {
        record.quarantineStatus = newStatus.toLowerCase();
        
        if (newStatus.toLowerCase() === 'extended') {
            const additionalDays = parseInt(prompt('How many additional days?', '7'));
            if (additionalDays) {
                const currentEnd = new Date(record.quarantineEndDate);
                currentEnd.setDate(currentEnd.getDate() + additionalDays);
                record.quarantineEndDate = currentEnd.toISOString().split('T')[0];
                record.quarantineDuration += additionalDays;
            }
        }
        
        record.updatedAt = new Date().toISOString();
        saveIntakeRecords();
        loadIntakeRecords();
        updateStatistics();
        checkAlerts();
        showNotification('Success', `Quarantine status updated for ${record.animalName}`, 'success');
    }
}

// Edit intake record
function editIntake(intakeId) {
    const record = intakeRecords.find(r => r.id === intakeId);
    if (!record) return;
    
    // Populate form with existing data
    document.getElementById('animalName').value = record.animalName;
    document.getElementById('species').value = record.species;
    document.getElementById('breed').value = record.breed;
    document.getElementById('age').value = record.age;
    document.getElementById('gender').value = record.gender;
    document.getElementById('weight').value = record.weight;
    document.getElementById('intakeSource').value = record.intakeSource;
    document.getElementById('intakeLocation').value = record.intakeLocation;
    document.getElementById('intakeNotes').value = record.intakeNotes || '';
    document.getElementById('physicalCondition').value = record.physicalCondition;
    document.getElementById('behaviorAssessment').value = record.behaviorAssessment;
    document.getElementById('medicalNotes').value = record.medicalNotes || '';
    document.getElementById('quarantineRequired').value = record.quarantineRequired ? 'yes' : 'no';
    document.getElementById('quarantineDuration').value = record.quarantineDuration;
    document.getElementById('isolationRoom').value = record.isolationRoom || '';
    document.getElementById('vetAppointmentDate').value = record.vetAppointmentDate;
    document.getElementById('vetAppointmentTime').value = record.vetAppointmentTime;
    document.getElementById('vetClinic').value = record.vetClinic;
    document.getElementById('medicalCost').value = record.medicalCost;
    document.getElementById('quarantineCost').value = record.quarantineCost;
    document.getElementById('suppliesCost').value = record.suppliesCost;
    
    // Check medical flags
    document.querySelectorAll('input[name="medicalFlag"]').forEach(cb => {
        cb.checked = record.medicalFlags.includes(cb.value);
    });
    
    // Check treatments
    document.querySelectorAll('input[name="treatment"]').forEach(cb => {
        cb.checked = record.treatments.includes(cb.value);
    });
    
    calculateTriageScore();
    toggleQuarantineFields();
    updateTotalCost();
    
    openIntakeModal();
    
    // Modify form to update instead of create
    const form = document.getElementById('intakeForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Update record
        const triageResult = calculateTriageScore();
        const medicalFlags = Array.from(document.querySelectorAll('input[name="medicalFlag"]:checked')).map(cb => cb.value);
        const treatments = Array.from(document.querySelectorAll('input[name="treatment"]:checked')).map(cb => cb.value);
        
        record.animalName = document.getElementById('animalName').value;
        record.species = document.getElementById('species').value;
        record.breed = document.getElementById('breed').value;
        record.age = document.getElementById('age').value;
        record.gender = document.getElementById('gender').value;
        record.weight = parseFloat(document.getElementById('weight').value);
        record.intakeSource = document.getElementById('intakeSource').value;
        record.intakeLocation = document.getElementById('intakeLocation').value;
        record.intakeNotes = document.getElementById('intakeNotes').value;
        record.triageScore = triageResult.score;
        record.priority = triageResult.priority;
        record.physicalCondition = document.getElementById('physicalCondition').value;
        record.behaviorAssessment = document.getElementById('behaviorAssessment').value;
        record.medicalFlags = medicalFlags;
        record.medicalNotes = document.getElementById('medicalNotes').value;
        record.treatments = treatments;
        record.vetAppointmentDate = document.getElementById('vetAppointmentDate').value;
        record.vetAppointmentTime = document.getElementById('vetAppointmentTime').value;
        record.vetClinic = document.getElementById('vetClinic').value;
        record.medicalCost = parseFloat(document.getElementById('medicalCost').value);
        record.quarantineCost = parseFloat(document.getElementById('quarantineCost').value);
        record.suppliesCost = parseFloat(document.getElementById('suppliesCost').value);
        record.updatedAt = new Date().toISOString();
        
        saveIntakeRecords();
        closeIntakeModal();
        loadIntakeRecords();
        updateStatistics();
        
        // Reset form handler
        form.onsubmit = submitIntake;
        
        showNotification('Success', `Intake record updated for ${record.animalName}`, 'success');
    };
}

// Delete intake record
function deleteIntake(intakeId) {
    const record = intakeRecords.find(r => r.id === intakeId);
    if (!record) return;
    
    if (confirm(`Are you sure you want to delete intake record ${intakeId} for ${record.animalName}?`)) {
        intakeRecords = intakeRecords.filter(r => r.id !== intakeId);
        saveIntakeRecords();
        loadIntakeRecords();
        updateStatistics();
        checkAlerts();
        showNotification('Success', 'Intake record deleted', 'success');
    }
}

// Release animal to foster
function releaseAnimal(intakeId) {
    const record = intakeRecords.find(r => r.id === intakeId);
    if (!record) return;
    
    if (confirm(`Release ${record.animalName} to foster care?`)) {
        record.status = 'released';
        record.quarantineStatus = 'completed';
        record.releaseDate = new Date().toISOString().split('T')[0];
        record.updatedAt = new Date().toISOString();
        
        saveIntakeRecords();
        closeAnimalDetailsModal();
        loadIntakeRecords();
        updateStatistics();
        checkAlerts();
        
        showNotification('Success', `${record.animalName} released to foster care!`, 'success');
    }
}

// Update statistics
function updateStatistics() {
    const pendingIntake = intakeRecords.filter(r => r.status === 'intake').length;
    const inQuarantine = intakeRecords.filter(r => r.quarantineStatus === 'active').length;
    const critical = intakeRecords.filter(r => r.priority === 'Critical' || r.priority === 'High').length;
    const readyRelease = intakeRecords.filter(r => {
        const criteria = r.releaseCriteria;
        return Object.values(criteria).every(v => v === true);
    }).length;
    
    document.getElementById('statPendingIntake').textContent = pendingIntake;
    document.getElementById('statInQuarantine').textContent = inQuarantine;
    document.getElementById('statCritical').textContent = critical;
    document.getElementById('statReadyRelease').textContent = readyRelease;
}

// Check for alerts
function checkAlerts() {
    alerts = [];
    const today = new Date();
    
    intakeRecords.forEach(record => {
        // Check for overdue quarantine exits
        if (record.quarantineStatus === 'active' && record.quarantineEndDate) {
            const endDate = new Date(record.quarantineEndDate);
            const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysRemaining < 0) {
                alerts.push({
                    type: 'danger',
                    icon: 'fas fa-exclamation-circle',
                    title: 'Overdue Quarantine',
                    message: `${record.animalName} (${record.id}) quarantine ended ${Math.abs(daysRemaining)} days ago`,
                    intakeId: record.id
                });
            } else if (daysRemaining <= 2) {
                alerts.push({
                    type: 'warning',
                    icon: 'fas fa-clock',
                    title: 'Quarantine Ending Soon',
                    message: `${record.animalName} (${record.id}) quarantine ends in ${daysRemaining} day(s)`,
                    intakeId: record.id
                });
            }
        }
        
        // Check for pending vet appointments
        if (record.vetAppointmentDate) {
            const aptDate = new Date(record.vetAppointmentDate);
            const diffDays = Math.ceil((aptDate - today) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
                alerts.push({
                    type: 'info',
                    icon: 'fas fa-stethoscope',
                    title: 'Vet Appointment Today',
                    message: `${record.animalName} (${record.id}) has vet appointment at ${record.vetAppointmentTime}`,
                    intakeId: record.id
                });
            } else if (diffDays === 1) {
                alerts.push({
                    type: 'info',
                    icon: 'fas fa-calendar-check',
                    title: 'Upcoming Vet Appointment',
                    message: `${record.animalName} (${record.id}) has vet appointment tomorrow at ${record.vetAppointmentTime}`,
                    intakeId: record.id
                });
            }
        }
        
        // Check for critical cases without vet appointments
        if ((record.priority === 'Critical' || record.priority === 'High') && !record.vetAppointmentDate) {
            alerts.push({
                type: 'danger',
                icon: 'fas fa-heartbeat',
                title: 'Critical Case - No Vet Appointment',
                message: `${record.animalName} (${record.id}) needs immediate vet attention`,
                intakeId: record.id
            });
        }
        
        // Check for incomplete treatments
        if (record.treatments.length > 0 && record.treatmentsDone.length < record.treatments.length) {
            const pending = record.treatments.filter(t => !record.treatmentsDone.includes(t));
            alerts.push({
                type: 'warning',
                icon: 'fas fa-syringe',
                title: 'Pending Treatments',
                message: `${record.animalName} (${record.id}) has ${pending.length} pending treatment(s)`,
                intakeId: record.id
            });
        }
        
        // Check for animals ready for release
        const releaseCriteria = Object.values(record.releaseCriteria);
        if (releaseCriteria.every(v => v === true) && record.status !== 'released') {
            alerts.push({
                type: 'success',
                icon: 'fas fa-check-circle',
                title: 'Ready for Foster',
                message: `${record.animalName} (${record.id}) meets all release criteria`,
                intakeId: record.id
            });
        }
    });
    
    displayAlerts();
}

// Display alerts
function displayAlerts() {
    const alertsGrid = document.getElementById('alertsGrid');
    
    if (alerts.length === 0) {
        alertsGrid.innerHTML = '<div class="no-alerts"><i class="fas fa-check-circle"></i> No active alerts</div>';
        return;
    }
    
    alertsGrid.innerHTML = alerts.map(alert => `
        <div class="alert alert-${alert.type}">
            <i class="${alert.icon}"></i>
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.message}</p>
            </div>
            <button class="btn-alert-action" onclick="viewAnimalDetails('${alert.intakeId}')">
                View Details
            </button>
        </div>
    `).join('');
}

// Export intake report
function exportIntakeReport() {
    const csvContent = generateCSVReport();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `intake-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Success', 'Report exported successfully', 'success');
}

// Generate CSV report
function generateCSVReport() {
    const headers = [
        'ID', 'Intake Date', 'Animal Name', 'Species', 'Breed', 'Age', 'Gender', 'Weight',
        'Source', 'Triage Score', 'Priority', 'Medical Flags', 'Quarantine Status',
        'Quarantine End Date', 'Isolation Room', 'Treatments Done', 'Medical Cost',
        'Quarantine Cost', 'Supplies Cost', 'Total Cost', 'Status'
    ];
    
    const rows = intakeRecords.map(record => [
        record.id,
        record.intakeDate,
        record.animalName,
        record.species,
        record.breed,
        record.age,
        record.gender,
        record.weight,
        record.intakeSource,
        record.triageScore,
        record.priority,
        record.medicalFlags.join('; '),
        record.quarantineStatus,
        record.quarantineEndDate || 'N/A',
        record.isolationRoom || 'N/A',
        `${record.treatmentsDone.length}/${record.treatments.length}`,
        record.medicalCost,
        record.quarantineCost,
        record.suppliesCost,
        record.medicalCost + record.quarantineCost + record.suppliesCost,
        record.status
    ]);
    
    const csvRows = [headers, ...rows];
    return csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

// Helper functions
function calculateDaysRemaining(endDate) {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function saveIntakeRecords() {
    localStorage.setItem('intakeRecords', JSON.stringify(intakeRecords));
}

function showNotification(title, message, type = 'info') {
    // Simple notification - can be enhanced with a toast library
    alert(`${title}: ${message}`);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const intakeModal = document.getElementById('intakeModal');
    const detailsModal = document.getElementById('animalDetailsModal');
    
    if (event.target === intakeModal) {
        closeIntakeModal();
    }
    if (event.target === detailsModal) {
        closeAnimalDetailsModal();
    }
};
