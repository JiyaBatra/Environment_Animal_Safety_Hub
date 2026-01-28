// Volunteer Scheduling & Shift Management System
// Handles shift calendar, volunteer management, task tracking, and hours logging

// Data structures
let volunteers = [];
let shifts = [];
let currentView = 'calendar';
let currentDate = new Date();
let roleFilter = 'all';
let statusFilter = 'all';

// Initialize the system
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    loadVolunteers();
    loadShifts();
    renderCalendar();
    updateStatistics();
    checkTrainingExpirations();
    populateVolunteerSelects();
    
    // Auto-refresh alerts every 10 minutes
    setInterval(checkTrainingExpirations, 600000);
});

// Initialize system with sample data
function initializeSystem() {
    const savedVolunteers = localStorage.getItem('volunteers');
    const savedShifts = localStorage.getItem('shifts');
    
    if (savedVolunteers) {
        volunteers = JSON.parse(savedVolunteers);
    } else {
        // Initialize with sample volunteers
        volunteers = [
            {
                id: 'VOL-001',
                name: 'Sarah Johnson',
                email: 'sarah.j@email.com',
                phone: '555-0101',
                roles: ['vet-tech', 'admin'],
                availability: {
                    monday: { available: true, start: '09:00', end: '17:00' },
                    tuesday: { available: true, start: '09:00', end: '17:00' },
                    wednesday: { available: true, start: '09:00', end: '17:00' },
                    thursday: { available: false },
                    friday: { available: true, start: '09:00', end: '15:00' },
                    saturday: { available: false },
                    sunday: { available: false }
                },
                certifications: [
                    { name: 'Veterinary Assistant', expiryDate: '2026-06-15' },
                    { name: 'Animal First Aid', expiryDate: '2026-03-20' }
                ],
                totalHours: 145.5,
                status: 'active',
                joinDate: '2025-01-15'
            },
            {
                id: 'VOL-002',
                name: 'Michael Chen',
                email: 'mchen@email.com',
                phone: '555-0102',
                roles: ['walker', 'feeder'],
                availability: {
                    monday: { available: false },
                    tuesday: { available: false },
                    wednesday: { available: false },
                    thursday: { available: false },
                    friday: { available: false },
                    saturday: { available: true, start: '08:00', end: '16:00' },
                    sunday: { available: true, start: '08:00', end: '16:00' }
                },
                certifications: [
                    { name: 'Dog Handling', expiryDate: '2026-08-10' }
                ],
                totalHours: 89.0,
                status: 'active',
                joinDate: '2025-03-10'
            }
        ];
        saveVolunteers();
    }
    
    if (savedShifts) {
        shifts = JSON.parse(savedShifts);
    } else {
        // Initialize with sample shifts
        const today = new Date();
        shifts = [
            {
                id: 'SH-001',
                date: formatDateISO(today),
                startTime: '09:00',
                endTime: '13:00',
                role: 'vet-tech',
                location: 'Main Facility',
                volunteerId: 'VOL-001',
                volunteerName: 'Sarah Johnson',
                status: 'filled',
                tasks: [
                    { description: 'Administer morning medications', completed: false },
                    { description: 'Assist with vet examinations', completed: false },
                    { description: 'Update medical records', completed: false }
                ],
                handoffNotes: '',
                incidents: [],
                hoursLogged: 0,
                createdAt: new Date().toISOString()
            }
        ];
        saveShifts();
    }
}

// Volunteer Management
function submitVolunteer(event) {
    event.preventDefault();
    
    const roles = Array.from(document.querySelectorAll('input[name="volunteerRole"]:checked'))
        .map(cb => cb.value);
    
    const availability = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const checkbox = document.querySelector(`input[name="availDay"][value="${day}"]`);
        const startTime = document.querySelector(`input[name="${day}-start"]`);
        const endTime = document.querySelector(`input[name="${day}-end"]`);
        
        if (checkbox && checkbox.checked) {
            availability[day] = {
                available: true,
                start: startTime.value || '09:00',
                end: endTime.value || '17:00'
            };
        } else {
            availability[day] = { available: false };
        }
    });
    
    const certifications = [];
    document.querySelectorAll('.cert-input-group').forEach(group => {
        const name = group.querySelector('.cert-name').value;
        const expiry = group.querySelector('.cert-expiry').value;
        if (name && expiry) {
            certifications.push({ name, expiryDate: expiry });
        }
    });
    
    const newVolunteer = {
        id: `VOL-${String(volunteers.length + 1).padStart(3, '0')}`,
        name: document.getElementById('volunteerName').value,
        email: document.getElementById('volunteerEmail').value,
        phone: document.getElementById('volunteerPhone').value,
        roles: roles,
        availability: availability,
        certifications: certifications,
        totalHours: 0,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };
    
    volunteers.push(newVolunteer);
    saveVolunteers();
    closeVolunteerModal();
    loadVolunteers();
    updateStatistics();
    populateVolunteerSelects();
    checkTrainingExpirations();
    
    showNotification('Success', `Volunteer ${newVolunteer.name} added successfully!`, 'success');
}

function loadVolunteers() {
    if (currentView === 'volunteers') {
        renderVolunteersGrid();
    }
}

function renderVolunteersGrid() {
    const grid = document.getElementById('volunteersGrid');
    if (!grid) return;
    
    if (volunteers.length === 0) {
        grid.innerHTML = '<div class="no-data">No volunteers found. Add your first volunteer!</div>';
        return;
    }
    
    grid.innerHTML = volunteers.map(volunteer => {
        const upcomingShifts = shifts.filter(s => s.volunteerId === volunteer.id && new Date(s.date) >= new Date()).length;
        const rolesHtml = volunteer.roles.map(role => `<span class="role-badge role-${role}">${formatRole(role)}</span>`).join(' ');
        
        return `
            <div class="volunteer-card">
                <div class="volunteer-header">
                    <div class="volunteer-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="volunteer-info">
                        <h3>${volunteer.name}</h3>
                        <p class="volunteer-id">${volunteer.id}</p>
                    </div>
                    <span class="status-badge status-${volunteer.status}">${volunteer.status}</span>
                </div>
                <div class="volunteer-body">
                    <div class="info-row">
                        <i class="fas fa-envelope"></i>
                        <span>${volunteer.email}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-phone"></i>
                        <span>${volunteer.phone || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-briefcase"></i>
                        <div class="roles-container">${rolesHtml}</div>
                    </div>
                    <div class="volunteer-stats">
                        <div class="stat-item">
                            <i class="fas fa-clock"></i>
                            <span>${volunteer.totalHours} hrs</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-calendar-check"></i>
                            <span>${upcomingShifts} upcoming</span>
                        </div>
                    </div>
                </div>
                <div class="volunteer-actions">
                    <button class="btn-icon" onclick="viewVolunteerDetails('${volunteer.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editVolunteer('${volunteer.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteVolunteer('${volunteer.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function viewVolunteerDetails(volunteerId) {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;
    
    const volunteerShifts = shifts.filter(s => s.volunteerId === volunteerId);
    const completedShifts = volunteerShifts.filter(s => s.status === 'completed');
    const upcomingShifts = volunteerShifts.filter(s => new Date(s.date) >= new Date() && s.status !== 'completed');
    
    const modal = document.getElementById('volunteerDetailsModal');
    const content = document.getElementById('volunteerDetailsContent');
    
    const availabilityHtml = Object.keys(volunteer.availability).map(day => {
        const avail = volunteer.availability[day];
        return `
            <div class="avail-row">
                <span class="day-name">${day.charAt(0).toUpperCase() + day.slice(1)}</span>
                ${avail.available 
                    ? `<span class="avail-time">${avail.start} - ${avail.end}</span>`
                    : '<span class="unavailable">Unavailable</span>'}
            </div>
        `;
    }).join('');
    
    const certHtml = volunteer.certifications.length > 0
        ? volunteer.certifications.map(cert => {
            const daysUntilExpiry = calculateDaysUntilExpiry(cert.expiryDate);
            const statusClass = daysUntilExpiry < 30 ? 'cert-expiring' : daysUntilExpiry < 0 ? 'cert-expired' : 'cert-valid';
            return `
                <div class="cert-item ${statusClass}">
                    <span class="cert-name">${cert.name}</span>
                    <span class="cert-expiry">Expires: ${formatDate(cert.expiryDate)}</span>
                </div>
            `;
        }).join('')
        : '<p class="no-data">No certifications recorded</p>';
    
    content.innerHTML = `
        <h2><i class="fas fa-user"></i> ${volunteer.name} - ${volunteer.id}</h2>
        
        <div class="details-grid">
            <div class="detail-section">
                <h3>Contact Information</h3>
                <div class="detail-row">
                    <span class="label">Email:</span>
                    <span class="value">${volunteer.email}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Phone:</span>
                    <span class="value">${volunteer.phone || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status:</span>
                    <span class="value"><span class="status-badge status-${volunteer.status}">${volunteer.status}</span></span>
                </div>
                <div class="detail-row">
                    <span class="label">Join Date:</span>
                    <span class="value">${formatDate(volunteer.joinDate)}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Roles & Capabilities</h3>
                <div class="roles-list">
                    ${volunteer.roles.map(role => `<span class="role-badge role-${role}">${formatRole(role)}</span>`).join(' ')}
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Hours & Performance</h3>
                <div class="detail-row">
                    <span class="label">Total Hours:</span>
                    <span class="value">${volunteer.totalHours} hours</span>
                </div>
                <div class="detail-row">
                    <span class="label">Completed Shifts:</span>
                    <span class="value">${completedShifts.length}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Upcoming Shifts:</span>
                    <span class="value">${upcomingShifts.length}</span>
                </div>
            </div>
            
            <div class="detail-section full-width">
                <h3>Weekly Availability</h3>
                <div class="availability-display">
                    ${availabilityHtml}
                </div>
            </div>
            
            <div class="detail-section full-width">
                <h3>Certifications & Training</h3>
                <div class="certifications-display">
                    ${certHtml}
                </div>
            </div>
            
            <div class="detail-section full-width">
                <h3>Recent Shifts</h3>
                <div class="shifts-list">
                    ${volunteerShifts.slice(0, 5).map(shift => `
                        <div class="shift-item">
                            <span class="shift-date">${formatDate(shift.date)}</span>
                            <span class="shift-role role-badge role-${shift.role}">${formatRole(shift.role)}</span>
                            <span class="shift-time">${shift.startTime} - ${shift.endTime}</span>
                            <span class="shift-status status-${shift.status}">${shift.status}</span>
                        </div>
                    `).join('') || '<p class="no-data">No shifts yet</p>'}
                </div>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn btn-secondary" onclick="closeVolunteerDetailsModal()">Close</button>
            <button class="btn btn-primary" onclick="editVolunteer('${volunteer.id}'); closeVolunteerDetailsModal();">Edit Volunteer</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function deleteVolunteer(volunteerId) {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;
    
    const assignedShifts = shifts.filter(s => s.volunteerId === volunteerId && new Date(s.date) >= new Date());
    
    if (assignedShifts.length > 0) {
        if (!confirm(`${volunteer.name} has ${assignedShifts.length} upcoming shifts. These shifts will be marked as unfilled. Continue?`)) {
            return;
        }
        
        // Unassign volunteer from future shifts
        shifts.forEach(shift => {
            if (shift.volunteerId === volunteerId && new Date(shift.date) >= new Date()) {
                shift.volunteerId = null;
                shift.volunteerName = null;
                shift.status = 'unfilled';
            }
        });
        saveShifts();
    }
    
    volunteers = volunteers.filter(v => v.id !== volunteerId);
    saveVolunteers();
    loadVolunteers();
    updateStatistics();
    populateVolunteerSelects();
    
    showNotification('Success', 'Volunteer removed successfully', 'success');
}

// Shift Management
function submitShift(event) {
    event.preventDefault();
    
    const tasks = [];
    document.querySelectorAll('.task-input').forEach(input => {
        if (input.value.trim()) {
            tasks.push({ description: input.value.trim(), completed: false });
        }
    });
    
    const volunteerId = document.getElementById('assignVolunteer').value;
    const volunteerName = volunteerId ? volunteers.find(v => v.id === volunteerId)?.name : null;
    
    const newShift = {
        id: `SH-${String(shifts.length + 1).padStart(3, '0')}`,
        date: document.getElementById('shiftDate').value,
        startTime: document.getElementById('shiftStartTime').value,
        endTime: document.getElementById('shiftEndTime').value,
        role: document.getElementById('shiftRole').value,
        location: document.getElementById('shiftLocation').value,
        volunteerId: volunteerId || null,
        volunteerName: volunteerName || null,
        status: volunteerId ? 'filled' : 'unfilled',
        tasks: tasks,
        handoffNotes: '',
        incidents: [],
        hoursLogged: 0,
        notes: document.getElementById('shiftNotes').value,
        createdAt: new Date().toISOString()
    };
    
    shifts.push(newShift);
    saveShifts();
    closeShiftModal();
    renderCalendar();
    updateStatistics();
    
    showNotification('Success', 'Shift created successfully!', 'success');
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    
    const monthYear = document.getElementById('currentMonth');
    monthYear.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    let html = '<div class="calendar-days-header">';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        html += `<div class="day-header">${day}</div>`;
    });
    html += '</div><div class="calendar-days">';
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDateISO(date);
        const isToday = dateStr === formatDateISO(new Date());
        
        // Get shifts for this day
        let dayShifts = shifts.filter(s => s.date === dateStr);
        
        // Apply filters
        if (roleFilter !== 'all') {
            dayShifts = dayShifts.filter(s => s.role === roleFilter);
        }
        if (statusFilter !== 'all') {
            dayShifts = dayShifts.filter(s => s.status === statusFilter);
        }
        
        const shiftsHtml = dayShifts.map(shift => {
            const statusClass = shift.status === 'unfilled' ? 'shift-unfilled' : shift.status === 'completed' ? 'shift-completed' : 'shift-filled';
            return `
                <div class="shift-item ${statusClass}" onclick="viewShiftDetails('${shift.id}')">
                    <span class="shift-time">${shift.startTime}</span>
                    <span class="shift-role">${formatRole(shift.role)}</span>
                    ${shift.volunteerName ? `<span class="shift-volunteer">${shift.volunteerName}</span>` : '<span class="shift-unassigned">Unassigned</span>'}
                </div>
            `;
        }).join('');
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <div class="day-number">${day}</div>
                <div class="day-shifts">
                    ${shiftsHtml}
                    <button class="btn-add-shift" onclick="quickAddShift('${dateStr}')" title="Add Shift">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    grid.innerHTML = html;
}

function viewShiftDetails(shiftId) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;
    
    const modal = document.getElementById('shiftDetailsModal');
    const content = document.getElementById('shiftDetailsContent');
    
    const tasksHtml = shift.tasks.map((task, index) => `
        <label class="task-checkbox">
            <input type="checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask('${shift.id}', ${index})">
            <span class="${task.completed ? 'completed' : ''}">${task.description}</span>
        </label>
    `).join('');
    
    const incidentsHtml = shift.incidents.length > 0
        ? shift.incidents.map(incident => `
            <div class="incident-item">
                <div class="incident-header">
                    <span class="incident-time">${incident.time}</span>
                    <span class="incident-severity severity-${incident.severity}">${incident.severity}</span>
                </div>
                <p class="incident-description">${incident.description}</p>
            </div>
        `).join('')
        : '<p class="no-data">No incidents reported</p>';
    
    content.innerHTML = `
        <h2><i class="fas fa-calendar-day"></i> Shift Details - ${shift.id}</h2>
        
        <div class="details-grid">
            <div class="detail-section">
                <h3>Shift Information</h3>
                <div class="detail-row">
                    <span class="label">Date:</span>
                    <span class="value">${formatDate(shift.date)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Time:</span>
                    <span class="value">${shift.startTime} - ${shift.endTime}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Role:</span>
                    <span class="value"><span class="role-badge role-${shift.role}">${formatRole(shift.role)}</span></span>
                </div>
                <div class="detail-row">
                    <span class="label">Location:</span>
                    <span class="value">${shift.location}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status:</span>
                    <span class="value"><span class="status-badge status-${shift.status}">${shift.status}</span></span>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Assignment</h3>
                ${shift.volunteerName ? `
                    <div class="detail-row">
                        <span class="label">Volunteer:</span>
                        <span class="value">
                            <a href="#" onclick="viewVolunteerDetails('${shift.volunteerId}'); return false;">${shift.volunteerName}</a>
                        </span>
                    </div>
                ` : `
                    <p class="no-assignment">No volunteer assigned</p>
                    <button class="btn btn-primary btn-sm" onclick="assignVolunteerToShift('${shift.id}')">
                        <i class="fas fa-user-plus"></i> Assign Volunteer
                    </button>
                `}
            </div>
            
            <div class="detail-section full-width">
                <h3>Task Checklist</h3>
                <div class="task-checklist">
                    ${tasksHtml || '<p class="no-data">No tasks assigned</p>'}
                </div>
                ${shift.status !== 'completed' ? `
                    <button class="btn btn-secondary btn-sm" onclick="addTaskToShift('${shift.id}')">
                        <i class="fas fa-plus"></i> Add Task
                    </button>
                ` : ''}
            </div>
            
            <div class="detail-section full-width">
                <h3>Handoff Notes</h3>
                <textarea id="handoffNotes" rows="3" onblur="saveHandoffNotes('${shift.id}')">${shift.handoffNotes || ''}</textarea>
                <small>Notes for the next volunteer or shift coordinator</small>
            </div>
            
            <div class="detail-section full-width">
                <h3>Incidents</h3>
                <div class="incidents-list">
                    ${incidentsHtml}
                </div>
                ${shift.status !== 'completed' ? `
                    <button class="btn btn-secondary btn-sm" onclick="logIncident('${shift.id}')">
                        <i class="fas fa-exclamation-triangle"></i> Log Incident
                    </button>
                ` : ''}
            </div>
            
            ${shift.status !== 'completed' && shift.volunteerId ? `
                <div class="detail-section">
                    <h3>Hours Logging</h3>
                    <div class="hours-input">
                        <input type="number" id="hoursWorked" step="0.5" min="0" value="${shift.hoursLogged || 0}">
                        <button class="btn btn-primary btn-sm" onclick="logHours('${shift.id}')">
                            <i class="fas fa-clock"></i> Log Hours
                        </button>
                    </div>
                </div>
            ` : ''}
        </div>
        
        <div class="modal-actions">
            <button class="btn btn-secondary" onclick="closeShiftDetailsModal()">Close</button>
            ${shift.status !== 'completed' ? `
                <button class="btn btn-success" onclick="completeShift('${shift.id}')">
                    <i class="fas fa-check"></i> Mark Complete
                </button>
            ` : ''}
            <button class="btn btn-danger" onclick="deleteShift('${shift.id}')">
                <i class="fas fa-trash"></i> Delete Shift
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function toggleTask(shiftId, taskIndex) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;
    
    shift.tasks[taskIndex].completed = !shift.tasks[taskIndex].completed;
    saveShifts();
    viewShiftDetails(shiftId); // Refresh view
}

function addTaskToShift(shiftId) {
    const description = prompt('Enter task description:');
    if (!description) return;
    
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;
    
    shift.tasks.push({ description, completed: false });
    saveShifts();
    viewShiftDetails(shiftId);
    showNotification('Success', 'Task added', 'success');
}

function saveHandoffNotes(shiftId) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;
    
    shift.handoffNotes = document.getElementById('handoffNotes').value;
    saveShifts();
}

function logIncident(shiftId) {
    const severity = prompt('Incident severity (low, medium, high, critical):');
    if (!severity || !['low', 'medium', 'high', 'critical'].includes(severity.toLowerCase())) return;
    
    const description = prompt('Describe the incident:');
    if (!description) return;
    
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;
    
    shift.incidents.push({
        time: new Date().toLocaleTimeString(),
        severity: severity.toLowerCase(),
        description: description,
        timestamp: new Date().toISOString()
    });
    
    saveShifts();
    viewShiftDetails(shiftId);
    showNotification('Incident Logged', `${severity} severity incident recorded`, 'warning');
}

function logHours(shiftId) {
    const hours = parseFloat(document.getElementById('hoursWorked').value);
    if (isNaN(hours) || hours <= 0) {
        alert('Please enter valid hours');
        return;
    }
    
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift || !shift.volunteerId) return;
    
    const volunteer = volunteers.find(v => v.id === shift.volunteerId);
    if (!volunteer) return;
    
    // Update volunteer total hours
    const previousHours = shift.hoursLogged || 0;
    volunteer.totalHours = (volunteer.totalHours - previousHours + hours);
    shift.hoursLogged = hours;
    
    saveVolunteers();
    saveShifts();
    viewShiftDetails(shiftId);
    showNotification('Success', `${hours} hours logged for ${volunteer.name}`, 'success');
}

function completeShift(shiftId) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;
    
    const incompleteTasks = shift.tasks.filter(t => !t.completed);
    if (incompleteTasks.length > 0) {
        if (!confirm(`${incompleteTasks.length} task(s) incomplete. Mark shift as complete anyway?`)) {
            return;
        }
    }
    
    shift.status = 'completed';
    saveShifts();
    closeShiftDetailsModal();
    renderCalendar();
    updateStatistics();
    showNotification('Success', 'Shift marked as completed', 'success');
}

function deleteShift(shiftId) {
    if (!confirm('Are you sure you want to delete this shift?')) return;
    
    shifts = shifts.filter(s => s.id !== shiftId);
    saveShifts();
    closeShiftDetailsModal();
    renderCalendar();
    updateStatistics();
    showNotification('Success', 'Shift deleted', 'success');
}

// Coverage Heatmap
function renderCoverageHeatmap() {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;
    
    const hours = [];
    for (let i = 0; i < 24; i++) {
        hours.push(`${String(i).padStart(2, '0')}:00`);
    }
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    let html = '<div class="heatmap-grid">';
    html += '<div class="heatmap-corner"></div>';
    
    // Hour headers
    hours.forEach(hour => {
        html += `<div class="heatmap-hour-header">${hour}</div>`;
    });
    
    // Day rows
    days.forEach((day, dayIndex) => {
        html += `<div class="heatmap-day-header">${day}</div>`;
        
        hours.forEach(hour => {
            const coverage = calculateCoverageForDayHour(dayIndex, hour);
            let coverageClass = 'coverage-low';
            if (coverage >= 4) coverageClass = 'coverage-high';
            else if (coverage >= 2) coverageClass = 'coverage-medium';
            
            html += `<div class="heatmap-cell ${coverageClass}" title="${day} ${hour}: ${coverage} volunteer(s)">
                ${coverage > 0 ? coverage : ''}
            </div>`;
        });
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function calculateCoverageForDayHour(dayOfWeek, hour) {
    // This is a simplified calculation
    // In real implementation, you'd check actual shift assignments
    return Math.floor(Math.random() * 5); // Placeholder
}

// Conflict Detection
function checkVolunteerConflict(volunteerId, date, startTime, endTime) {
    if (!volunteerId) return null;
    
    const existingShifts = shifts.filter(s => 
        s.volunteerId === volunteerId && 
        s.date === date &&
        s.status !== 'completed'
    );
    
    for (let shift of existingShifts) {
        if (timeOverlaps(startTime, endTime, shift.startTime, shift.endTime)) {
            return `Conflict: ${shift.role} shift from ${shift.startTime} to ${shift.endTime}`;
        }
    }
    
    return null;
}

function timeOverlaps(start1, end1, start2, end2) {
    return (start1 < end2 && end1 > start2);
}

// Training/Certification Expiration Checks
function checkTrainingExpirations() {
    const alerts = [];
    const today = new Date();
    
    volunteers.forEach(volunteer => {
        volunteer.certifications.forEach(cert => {
            const expiryDate = new Date(cert.expiryDate);
            const daysUntil = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysUntil < 0) {
                alerts.push({
                    type: 'danger',
                    icon: 'fas fa-times-circle',
                    title: 'Certification Expired',
                    message: `${volunteer.name}'s ${cert.name} certification expired ${Math.abs(daysUntil)} days ago`,
                    volunteerId: volunteer.id
                });
            } else if (daysUntil <= 30) {
                alerts.push({
                    type: 'warning',
                    icon: 'fas fa-exclamation-triangle',
                    title: 'Certification Expiring Soon',
                    message: `${volunteer.name}'s ${cert.name} certification expires in ${daysUntil} day(s)`,
                    volunteerId: volunteer.id
                });
            }
        });
    });
    
    displayTrainingAlerts(alerts);
}

function displayTrainingAlerts(alerts) {
    const grid = document.getElementById('trainingAlertsGrid');
    if (!grid) return;
    
    if (alerts.length === 0) {
        grid.innerHTML = '<div class="no-alerts"><i class="fas fa-check-circle"></i> All certifications up to date</div>';
        return;
    }
    
    grid.innerHTML = alerts.map(alert => `
        <div class="alert alert-${alert.type}">
            <i class="${alert.icon}"></i>
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.message}</p>
            </div>
            <button class="btn-alert-action" onclick="viewVolunteerDetails('${alert.volunteerId}')">
                View Profile
            </button>
        </div>
    `).join('');
}

// Statistics
function updateStatistics() {
    const activeVolunteers = volunteers.filter(v => v.status === 'active').length;
    const today = new Date();
    const upcomingShifts = shifts.filter(s => new Date(s.date) >= today && s.status !== 'completed').length;
    const unfilledShifts = shifts.filter(s => new Date(s.date) >= today && s.status === 'unfilled').length;
    
    // Calculate total hours for current month
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const totalHours = shifts.filter(s => {
        const shiftDate = new Date(s.date);
        return shiftDate.getMonth() === currentMonth && 
               shiftDate.getFullYear() === currentYear &&
               s.status === 'completed';
    }).reduce((sum, shift) => sum + (shift.hoursLogged || 0), 0);
    
    document.getElementById('statActiveVolunteers').textContent = activeVolunteers;
    document.getElementById('statUpcomingShifts').textContent = upcomingShifts;
    document.getElementById('statUnfilledShifts').textContent = unfilledShifts;
    document.getElementById('statTotalHours').textContent = totalHours.toFixed(1);
}

// View Management
function showView(view) {
    currentView = view;
    
    document.getElementById('calendarView').style.display = 'none';
    document.getElementById('coverageView').style.display = 'none';
    document.getElementById('volunteersView').style.display = 'none';
    
    if (view === 'calendar') {
        document.getElementById('calendarView').style.display = 'block';
        renderCalendar();
    } else if (view === 'coverage') {
        document.getElementById('coverageView').style.display = 'block';
        renderCoverageHeatmap();
    } else if (view === 'volunteers') {
        document.getElementById('volunteersView').style.display = 'block';
        renderVolunteersGrid();
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

function filterShifts() {
    roleFilter = document.getElementById('roleFilter').value;
    statusFilter = document.getElementById('statusFilter').value;
    renderCalendar();
}

function quickAddShift(date) {
    document.getElementById('shiftDate').value = date;
    openShiftModal();
}

// Modal Functions
function openShiftModal() {
    document.getElementById('shiftModal').style.display = 'block';
    document.getElementById('shiftForm').reset();
    
    // Set default date to today if not set
    if (!document.getElementById('shiftDate').value) {
        document.getElementById('shiftDate').value = formatDateISO(new Date());
    }
    
    // Add one default task input
    const container = document.getElementById('taskChecklistContainer');
    container.innerHTML = `
        <div class="task-input-group">
            <input type="text" class="task-input" placeholder="Task description">
            <button type="button" class="btn-remove-task" onclick="removeTaskInput(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function closeShiftModal() {
    document.getElementById('shiftModal').style.display = 'none';
}

function openVolunteerModal() {
    document.getElementById('volunteerModal').style.display = 'block';
    document.getElementById('volunteerForm').reset();
    
    // Reset certification inputs
    const container = document.getElementById('certificationContainer');
    container.innerHTML = `
        <div class="cert-input-group">
            <input type="text" class="cert-name" placeholder="Certification Name">
            <input type="date" class="cert-expiry" placeholder="Expiry Date">
            <button type="button" class="btn-remove-cert" onclick="removeCertInput(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function closeVolunteerModal() {
    document.getElementById('volunteerModal').style.display = 'none';
}

function closeShiftDetailsModal() {
    document.getElementById('shiftDetailsModal').style.display = 'none';
}

function closeVolunteerDetailsModal() {
    document.getElementById('volunteerDetailsModal').style.display = 'none';
}

// Dynamic Input Management
function addTaskInput() {
    const container = document.getElementById('taskChecklistContainer');
    const div = document.createElement('div');
    div.className = 'task-input-group';
    div.innerHTML = `
        <input type="text" class="task-input" placeholder="Task description">
        <button type="button" class="btn-remove-task" onclick="removeTaskInput(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(div);
}

function removeTaskInput(button) {
    button.parentElement.remove();
}

function addCertInput() {
    const container = document.getElementById('certificationContainer');
    const div = document.createElement('div');
    div.className = 'cert-input-group';
    div.innerHTML = `
        <input type="text" class="cert-name" placeholder="Certification Name">
        <input type="date" class="cert-expiry" placeholder="Expiry Date">
        <button type="button" class="btn-remove-cert" onclick="removeCertInput(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(div);
}

function removeCertInput(button) {
    button.parentElement.remove();
}

function populateVolunteerSelects() {
    const select = document.getElementById('assignVolunteer');
    if (!select) return;
    
    select.innerHTML = '<option value="">Leave Unfilled</option>';
    volunteers.filter(v => v.status === 'active').forEach(volunteer => {
        const option = document.createElement('option');
        option.value = volunteer.id;
        option.textContent = `${volunteer.name} (${volunteer.roles.map(r => formatRole(r)).join(', ')})`;
        select.appendChild(option);
    });
    
    // Add conflict detection
    select.addEventListener('change', function() {
        const volunteerId = this.value;
        if (!volunteerId) {
            document.getElementById('conflictWarning').style.display = 'none';
            return;
        }
        
        const date = document.getElementById('shiftDate').value;
        const startTime = document.getElementById('shiftStartTime').value;
        const endTime = document.getElementById('shiftEndTime').value;
        
        if (date && startTime && endTime) {
            const conflict = checkVolunteerConflict(volunteerId, date, startTime, endTime);
            if (conflict) {
                document.getElementById('conflictWarning').style.display = 'block';
                document.getElementById('conflictMessage').textContent = conflict;
            } else {
                document.getElementById('conflictWarning').style.display = 'none';
            }
        }
    });
}

// Export
function exportScheduleReport() {
    const csv = generateScheduleCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `volunteer-schedule-${formatDateISO(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Success', 'Schedule exported successfully', 'success');
}

function generateScheduleCSV() {
    const headers = ['Shift ID', 'Date', 'Start Time', 'End Time', 'Role', 'Location', 'Volunteer', 'Status', 'Hours Logged', 'Tasks Completed'];
    
    const rows = shifts.map(shift => [
        shift.id,
        shift.date,
        shift.startTime,
        shift.endTime,
        shift.role,
        shift.location,
        shift.volunteerName || 'Unassigned',
        shift.status,
        shift.hoursLogged || 0,
        `${shift.tasks.filter(t => t.completed).length}/${shift.tasks.length}`
    ]);
    
    const csvRows = [headers, ...rows];
    return csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

// Helper Functions
function formatRole(role) {
    const roleMap = {
        'vet-tech': 'Vet Tech',
        'walker': 'Walker',
        'admin': 'Admin',
        'feeder': 'Feeder',
        'cleaner': 'Cleaner',
        'foster-coordinator': 'Foster Coordinator'
    };
    return roleMap[role] || role;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateISO(date) {
    return date.toISOString().split('T')[0];
}

function calculateDaysUntilExpiry(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function saveVolunteers() {
    localStorage.setItem('volunteers', JSON.stringify(volunteers));
}

function saveShifts() {
    localStorage.setItem('shifts', JSON.stringify(shifts));
}

function showNotification(title, message, type = 'info') {
    alert(`${title}: ${message}`);
}

// Close modals on outside click
window.onclick = function(event) {
    const modals = ['shiftModal', 'volunteerModal', 'shiftDetailsModal', 'volunteerDetailsModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

// Volunteer assignment function
function assignVolunteerToShift(shiftId) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;
    
    // Create simple selection dialog
    const eligibleVolunteers = volunteers.filter(v => 
        v.status === 'active' && v.roles.includes(shift.role)
    );
    
    if (eligibleVolunteers.length === 0) {
        alert('No eligible volunteers found for this role');
        return;
    }
    
    const volunteerList = eligibleVolunteers.map((v, i) => 
        `${i + 1}. ${v.name} (${v.totalHours} hrs)`
    ).join('\n');
    
    const selection = prompt(`Select volunteer:\n${volunteerList}\n\nEnter number:`);
    const index = parseInt(selection) - 1;
    
    if (index >= 0 && index < eligibleVolunteers.length) {
        const volunteer = eligibleVolunteers[index];
        shift.volunteerId = volunteer.id;
        shift.volunteerName = volunteer.name;
        shift.status = 'filled';
        
        saveShifts();
        closeShiftDetailsModal();
        renderCalendar();
        updateStatistics();
        showNotification('Success', `${volunteer.name} assigned to shift`, 'success');
    }
}

function editVolunteer(volunteerId) {
    // This would open the volunteer modal with pre-filled data
    // For simplicity, showing alert
    alert('Edit functionality - populate form with existing volunteer data');
}
