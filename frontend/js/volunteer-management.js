// ========== VOLUNTEER MANAGEMENT SYSTEM - JAVASCRIPT ==========

// ========== CONFIGURATION ==========
const API_BASE = 'http://localhost:3000/api';
const useDummyData = true; // Set to false when backend is ready

// ========== STATE MANAGEMENT ==========
const appState = {
    applications: [],
    volunteers: [],
    shifts: [],
    activities: [],
    certifications: [],
    currentTab: 'applications',
    currentUser: { id: 'user-admin', name: 'Admin User' },
    filters: {
        appStatus: '',
        volunteerSort: 'hours-desc',
        shiftCategory: '',
        shiftStatus: '',
        activityType: '',
        certStatus: '',
    }
};

// ========== DUMMY DATA ==========
const dummyData = {
    applications: [
        {
            id: 'VA-0001',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '555-0101',
            dob: '1990-05-15',
            address: '123 Main St, City, State',
            availability: ['Monday', 'Wednesday', 'Friday'],
            timeSlots: ['morning', 'afternoon'],
            skills: ['animal-handling', 'medical'],
            experience: 3,
            interests: ['dogs', 'cats', 'education'],
            emergencyContact: { name: 'John Johnson', relation: 'Brother', phone: '555-0102' },
            reference: { name: 'Dr. Lisa Chen', contact: 'lisa@example.com' },
            backgroundCheck: 'approved',
            waiver: 'signed',
            status: 'approved',
            approvalScore: 95,
            appliedDate: '2024-01-10',
            orientationDate: '2024-01-25',
            approvedDate: '2024-01-20'
        },
        {
            id: 'VA-0002',
            name: 'Michael Chen',
            email: 'michael@example.com',
            phone: '555-0201',
            dob: '1988-08-22',
            address: '456 Oak Ave, City, State',
            availability: ['Tuesday', 'Thursday', 'Saturday'],
            timeSlots: ['afternoon', 'evening'],
            skills: ['animal-handling', 'transport'],
            experience: 5,
            interests: ['dogs', 'wildlife'],
            emergencyContact: { name: 'Maria Chen', relation: 'Sister', phone: '555-0202' },
            reference: { name: 'Tom Wilson', contact: 'tom@example.com' },
            backgroundCheck: 'approved',
            waiver: 'signed',
            status: 'approved',
            approvalScore: 88,
            appliedDate: '2024-01-15',
            orientationDate: '2024-01-28',
            approvedDate: '2024-01-22'
        },
        {
            id: 'VA-0003',
            name: 'Emma Rodriguez',
            email: 'emma@example.com',
            phone: '555-0301',
            dob: '1995-03-10',
            address: '789 Pine Rd, City, State',
            availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            timeSlots: ['morning'],
            skills: ['admin', 'education', 'photography'],
            experience: 2,
            interests: ['education', 'events'],
            emergencyContact: { name: 'Carlos Rodriguez', relation: 'Father', phone: '555-0302' },
            reference: { name: 'Angela Martinez', contact: 'angela@example.com' },
            backgroundCheck: 'pending',
            waiver: 'pending',
            status: 'under-review',
            approvalScore: 72,
            appliedDate: '2024-01-25',
            orientationDate: null,
            approvedDate: null
        }
    ],
    volunteers: [
        {
            id: 'VOL-2024-0001',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '555-0101',
            joinDate: '2024-01-25',
            status: 'active',
            experienceLevel: 'intermediate',
            totalHours: 145,
            thisMonthHours: 32,
            shiftsCompleted: 28,
            noShowCount: 0,
            avgRating: 4.9,
            certifications: [
                { type: 'Animal Handling', issued: '2023-06-15', expiry: '2025-06-15', status: 'valid' },
                { type: 'First Aid', issued: '2023-09-01', expiry: '2025-09-01', status: 'valid' }
            ],
            badges: ['50-hours', '100-hours', 'perfect-attendance'],
            trainingModules: ['animal-care', 'safety-protocols', 'customer-service'],
            performanceMetrics: {
                punctuality: 95,
                reliability: 98,
                qualityRating: 4.9
            }
        },
        {
            id: 'VOL-2024-0002',
            name: 'Michael Chen',
            email: 'michael@example.com',
            phone: '555-0201',
            joinDate: '2024-01-28',
            status: 'active',
            experienceLevel: 'advanced',
            totalHours: 287,
            thisMonthHours: 45,
            shiftsCompleted: 52,
            noShowCount: 0,
            avgRating: 4.85,
            certifications: [
                { type: 'Animal Handling', issued: '2022-08-10', expiry: '2026-08-10', status: 'valid' },
                { type: 'CPR', issued: '2023-04-20', expiry: '2025-04-20', status: 'valid' },
                { type: 'Dog Training', issued: '2023-01-15', expiry: '2025-01-15', status: 'valid' }
            ],
            badges: ['50-hours', '100-hours', '250-hours', 'volunteer-of-month'],
            trainingModules: ['animal-care', 'safety-protocols', 'dog-training', 'leadership'],
            performanceMetrics: {
                punctuality: 100,
                reliability: 100,
                qualityRating: 4.85
            }
        },
        {
            id: 'VOL-2024-0003',
            name: 'Emma Rodriguez',
            email: 'emma@example.com',
            phone: '555-0301',
            joinDate: '2024-02-01',
            status: 'active',
            experienceLevel: 'beginner',
            totalHours: 34,
            thisMonthHours: 34,
            shiftsCompleted: 8,
            noShowCount: 0,
            avgRating: 4.75,
            certifications: [
                { type: 'Animal Handling', issued: '2024-02-05', expiry: '2026-02-05', status: 'valid' }
            ],
            badges: [],
            trainingModules: ['animal-care', 'safety-protocols'],
            performanceMetrics: {
                punctuality: 95,
                reliability: 95,
                qualityRating: 4.75
            }
        },
        {
            id: 'VOL-2024-0004',
            name: 'David Thompson',
            email: 'david@example.com',
            phone: '555-0401',
            joinDate: '2023-11-15',
            status: 'active',
            experienceLevel: 'intermediate',
            totalHours: 198,
            thisMonthHours: 28,
            shiftsCompleted: 35,
            noShowCount: 1,
            avgRating: 4.7,
            certifications: [
                { type: 'Animal Handling', issued: '2023-10-01', expiry: '2025-10-01', status: 'valid' },
                { type: 'First Aid', issued: '2023-11-15', expiry: '2024-11-15', status: 'expiring-soon' }
            ],
            badges: ['50-hours', '100-hours'],
            trainingModules: ['animal-care', 'safety-protocols', 'customer-service'],
            performanceMetrics: {
                punctuality: 88,
                reliability: 92,
                qualityRating: 4.7
            }
        },
        {
            id: 'VOL-2024-0005',
            name: 'Jessica Martinez',
            email: 'jessica@example.com',
            phone: '555-0501',
            joinDate: '2023-12-20',
            status: 'active',
            experienceLevel: 'beginner',
            totalHours: 72,
            thisMonthHours: 18,
            shiftsCompleted: 14,
            noShowCount: 0,
            avgRating: 4.8,
            certifications: [
                { type: 'Animal Handling', issued: '2023-12-22', expiry: '2025-12-22', status: 'valid' }
            ],
            badges: ['50-hours'],
            trainingModules: ['animal-care', 'safety-protocols'],
            performanceMetrics: {
                punctuality: 96,
                reliability: 96,
                qualityRating: 4.8
            }
        }
    ],
    shifts: [
        {
            id: 'SH-0001',
            date: formatDate(new Date(Date.now() + 2 * 86400000)),
            startTime: '09:00',
            endTime: '12:00',
            category: 'dog-walking',
            title: 'Morning Dog Walk - Downtown Park',
            description: 'Walk 5-7 dogs around downtown park. Leash training required.',
            minVolunteers: 2,
            maxVolunteers: 4,
            requiredSkills: ['animal-handling'],
            minExperience: 'beginner',
            volunteers: [
                { id: 'VOL-2024-0001', name: 'Sarah Johnson', checkedIn: true, hoursWorked: 3 }
            ],
            status: 'partially-filled',
            recurring: 'weekly',
            createdDate: '2024-02-01'
        },
        {
            id: 'SH-0002',
            date: formatDate(new Date(Date.now() + 3 * 86400000)),
            startTime: '13:00',
            endTime: '17:00',
            category: 'animal-care',
            title: 'Afternoon Animal Care - Shelter A',
            description: 'Feed, water, and provide basic care for shelter animals. Cage cleaning.',
            minVolunteers: 1,
            maxVolunteers: 3,
            requiredSkills: ['animal-handling', 'medical'],
            minExperience: 'intermediate',
            volunteers: [
                { id: 'VOL-2024-0002', name: 'Michael Chen', checkedIn: true, hoursWorked: 4 },
                { id: 'VOL-2024-0004', name: 'David Thompson', checkedIn: false, hoursWorked: 0 }
            ],
            status: 'partially-filled',
            recurring: 'daily',
            createdDate: '2024-01-30'
        },
        {
            id: 'SH-0003',
            date: formatDate(new Date(Date.now() + 4 * 86400000)),
            startTime: '10:00',
            endTime: '14:00',
            category: 'cleaning',
            title: 'Facility Cleaning - Building B',
            description: 'Deep cleaning of kennels, common areas, and equipment sanitization.',
            minVolunteers: 2,
            maxVolunteers: 5,
            requiredSkills: [],
            minExperience: 'beginner',
            volunteers: [],
            status: 'open',
            recurring: 'none',
            createdDate: '2024-02-02'
        },
        {
            id: 'SH-0004',
            date: formatDate(new Date(Date.now() + 5 * 86400000)),
            startTime: '15:00',
            endTime: '18:00',
            category: 'events',
            title: 'Community Outreach Event - Park Fair',
            description: 'Set up and manage booth at community park fair. Promote adoption programs.',
            minVolunteers: 3,
            maxVolunteers: 6,
            requiredSkills: ['education'],
            minExperience: 'beginner',
            volunteers: [
                { id: 'VOL-2024-0003', name: 'Emma Rodriguez', checkedIn: false, hoursWorked: 0 }
            ],
            status: 'partially-filled',
            recurring: 'none',
            createdDate: '2024-02-02'
        },
        {
            id: 'SH-0005',
            date: formatDate(new Date(Date.now() + 6 * 86400000)),
            startTime: '08:00',
            endTime: '12:00',
            category: 'feeding',
            title: 'Feeding & Nutrition Program',
            description: 'Prepare and distribute meals to animals. Record intake and preferences.',
            minVolunteers: 1,
            maxVolunteers: 2,
            requiredSkills: [],
            minExperience: 'beginner',
            volunteers: [
                { id: 'VOL-2024-0005', name: 'Jessica Martinez', checkedIn: false, hoursWorked: 0 },
                { id: 'VOL-2024-0001', name: 'Sarah Johnson', checkedIn: false, hoursWorked: 0 }
            ],
            status: 'fully-booked',
            recurring: 'daily',
            createdDate: '2024-01-28'
        }
    ],
    activities: [
        {
            id: 'ACT-0001',
            volunteerId: 'VOL-2024-0001',
            volunteerName: 'Sarah Johnson',
            type: 'dog-walking',
            description: 'Walked 4 dogs in downtown park for 2 hours',
            startTime: '2024-02-02 09:00',
            endTime: '2024-02-02 11:00',
            hoursWorked: 2,
            status: 'approved',
            approvedBy: 'Admin User',
            approvalDate: '2024-02-02 15:30',
            incident: null
        },
        {
            id: 'ACT-0002',
            volunteerId: 'VOL-2024-0002',
            volunteerName: 'Michael Chen',
            type: 'animal-care',
            description: 'Provided care for 12 animals: feeding, watering, medical checkups',
            startTime: '2024-02-02 13:00',
            endTime: '2024-02-02 17:00',
            hoursWorked: 4,
            status: 'approved',
            approvedBy: 'Admin User',
            approvalDate: '2024-02-02 18:15',
            incident: null
        },
        {
            id: 'ACT-0003',
            volunteerId: 'VOL-2024-0003',
            volunteerName: 'Emma Rodriguez',
            type: 'admin',
            description: 'Updated volunteer database and organized training materials',
            startTime: '2024-02-03 10:00',
            endTime: '2024-02-03 12:00',
            hoursWorked: 2,
            status: 'pending-approval',
            approvedBy: null,
            approvalDate: null,
            incident: null
        },
        {
            id: 'ACT-0004',
            volunteerId: 'VOL-2024-0004',
            volunteerName: 'David Thompson',
            type: 'cleaning',
            description: 'Deep cleaned kennels A1-A5 and sanitized equipment',
            startTime: '2024-02-03 14:00',
            endTime: '2024-02-03 16:30',
            hoursWorked: 2.5,
            status: 'approved',
            approvedBy: 'Admin User',
            approvalDate: '2024-02-03 18:00',
            incident: { type: 'safety-concern', description: 'Slippery floor - cleaned immediately', severity: 'low' }
        },
        {
            id: 'ACT-0005',
            volunteerId: 'VOL-2024-0005',
            volunteerName: 'Jessica Martinez',
            type: 'feeding',
            description: 'Prepared and distributed meals to 25 animals',
            startTime: '2024-02-04 08:00',
            endTime: '2024-02-04 10:30',
            hoursWorked: 2.5,
            status: 'approved',
            approvedBy: 'Admin User',
            approvalDate: '2024-02-04 11:00',
            incident: null
        }
    ],
    certifications: [
        {
            id: 'CERT-0001',
            volunteerId: 'VOL-2024-0001',
            volunteerName: 'Sarah Johnson',
            type: 'Animal Handling',
            issued: '2023-06-15',
            expiry: '2025-06-15',
            status: 'valid',
            certificateUrl: 'https://example.com/cert1.pdf'
        },
        {
            id: 'CERT-0002',
            volunteerId: 'VOL-2024-0001',
            volunteerName: 'Sarah Johnson',
            type: 'First Aid',
            issued: '2023-09-01',
            expiry: '2025-09-01',
            status: 'valid',
            certificateUrl: 'https://example.com/cert2.pdf'
        },
        {
            id: 'CERT-0003',
            volunteerId: 'VOL-2024-0004',
            volunteerName: 'David Thompson',
            type: 'First Aid',
            issued: '2023-11-15',
            expiry: '2024-11-15',
            status: 'expiring-soon',
            certificateUrl: 'https://example.com/cert3.pdf'
        }
    ]
};

// ========== UTILITY FUNCTIONS ==========

function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const tab = document.getElementById(tabName);
    if (tab) {
        tab.classList.add('active');
    }

    // Mark button as active
    const btn = document.querySelector(`[data-tab="${tabName}"]`);
    if (btn) {
        btn.classList.add('active');
    }

    appState.currentTab = tabName;

    // Load data for tab if needed
    if (tabName === 'recognition') {
        loadRecognitionData();
    } else if (tabName === 'volunteers') {
        loadVolunteersTab();
    }
}

function calculateCertStatus(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
        return 'expired';
    } else if (daysUntilExpiry <= 30) {
        return 'expiring-soon';
    }
    return 'valid';
}

function getHoursSinceDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now - date) / (1000 * 60 * 60));
}

// ========== API FUNCTIONS ==========

async function fetchApplications() {
    try {
        if (useDummyData) {
            appState.applications = dummyData.applications;
            return;
        }
        const response = await fetch(`${API_BASE}/volunteers/applications`);
        appState.applications = await response.json();
    } catch (error) {
        console.error('Error fetching applications:', error);
        appState.applications = dummyData.applications;
    }
}

async function fetchVolunteers() {
    try {
        if (useDummyData) {
            appState.volunteers = dummyData.volunteers;
            return;
        }
        const response = await fetch(`${API_BASE}/volunteers`);
        appState.volunteers = await response.json();
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        appState.volunteers = dummyData.volunteers;
    }
}

async function fetchShifts() {
    try {
        if (useDummyData) {
            appState.shifts = dummyData.shifts;
            return;
        }
        const response = await fetch(`${API_BASE}/volunteers/shifts`);
        appState.shifts = await response.json();
    } catch (error) {
        console.error('Error fetching shifts:', error);
        appState.shifts = dummyData.shifts;
    }
}

async function fetchActivities() {
    try {
        if (useDummyData) {
            appState.activities = dummyData.activities;
            return;
        }
        const response = await fetch(`${API_BASE}/volunteers/activities`);
        appState.activities = await response.json();
    } catch (error) {
        console.error('Error fetching activities:', error);
        appState.activities = dummyData.activities;
    }
}

async function fetchCertifications() {
    try {
        if (useDummyData) {
            appState.certifications = dummyData.certifications;
            return;
        }
        const response = await fetch(`${API_BASE}/volunteers/certifications`);
        appState.certifications = await response.json();
    } catch (error) {
        console.error('Error fetching certifications:', error);
        appState.certifications = dummyData.certifications;
    }
}

// ========== RENDER FUNCTIONS ==========

function renderApplications() {
    const container = document.getElementById('appsList');
    let filtered = appState.applications;

    // Apply filters
    const statusFilter = document.getElementById('appStatusFilter').value;
    if (statusFilter) {
        filtered = filtered.filter(app => app.status === statusFilter);
    }

    const searchTerm = document.getElementById('appSearchBox').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(app =>
            app.name.toLowerCase().includes(searchTerm) ||
            app.email.toLowerCase().includes(searchTerm)
        );
    }

    container.innerHTML = filtered.map(app => `
        <div class="app-card">
            <div class="app-card-header">
                <div>
                    <p class="app-name">${app.name}</p>
                    <p class="app-id">${app.id}</p>
                </div>
                <span class="app-status ${app.status}">${app.status.replace('-', ' ').toUpperCase()}</span>
            </div>
            <div class="app-details">
                <div class="app-detail">
                    <span class="app-detail-label">Email</span>
                    <span class="app-detail-value">${app.email}</span>
                </div>
                <div class="app-detail">
                    <span class="app-detail-label">Phone</span>
                    <span class="app-detail-value">${app.phone}</span>
                </div>
                <div class="app-detail">
                    <span class="app-detail-label">Experience</span>
                    <span class="app-detail-value">${app.experience} years</span>
                </div>
                <div class="app-detail">
                    <span class="app-detail-label">Approval Score</span>
                    <span class="app-detail-value">${app.approvalScore}%</span>
                </div>
                <div class="app-detail">
                    <span class="app-detail-label">Available</span>
                    <span class="app-detail-value">${app.availability.slice(0, 3).join(', ')}${app.availability.length > 3 ? '...' : ''}</span>
                </div>
                <div class="app-detail">
                    <span class="app-detail-label">Applied</span>
                    <span class="app-detail-value">${app.appliedDate}</span>
                </div>
            </div>
            <div class="app-details">
                <div class="app-detail">
                    <span class="app-detail-label">Skills</span>
                    <div class="app-skills">
                        ${app.skills.map(skill => `<span class="skill-badge">${skill.replace('-', ' ')}</span>`).join('')}
                    </div>
                </div>
                <div class="app-detail">
                    <span class="app-detail-label">Interests</span>
                    <div class="app-skills">
                        ${app.interests.map(interest => `<span class="skill-badge">${interest}</span>`).join('')}
                    </div>
                </div>
            </div>
            ${app.status === 'under-review' ? `
                <div class="app-actions">
                    <button class="btn-approve" onclick="approveApplication('${app.id}')">✓ Approve</button>
                    <button class="btn-reject" onclick="rejectApplication('${app.id}')">✗ Reject</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderVolunteers() {
    const container = document.getElementById('volunteersList');
    let volunteers = [...appState.volunteers];

    // Apply sorting
    const sortBy = document.getElementById('volunteerSortBy').value;
    switch(sortBy) {
        case 'hours-desc':
            volunteers.sort((a, b) => b.totalHours - a.totalHours);
            break;
        case 'hours-asc':
            volunteers.sort((a, b) => a.totalHours - b.totalHours);
            break;
        case 'name-asc':
            volunteers.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'recent':
            volunteers.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
            break;
    }

    // Apply search
    const searchTerm = document.getElementById('volunteerSearchBox').value.toLowerCase();
    if (searchTerm) {
        volunteers = volunteers.filter(vol =>
            vol.name.toLowerCase().includes(searchTerm) ||
            vol.email.toLowerCase().includes(searchTerm)
        );
    }

    container.innerHTML = volunteers.map(vol => {
        const expiring = vol.certifications.filter(c => calculateCertStatus(c.expiry) === 'expiring-soon');
        const expired = vol.certifications.filter(c => calculateCertStatus(c.expiry) === 'expired');

        return `
            <div class="volunteer-card">
                <div class="volunteer-header">
                    <div class="volunteer-avatar">${vol.name.charAt(0).toUpperCase()}</div>
                    <div class="volunteer-info">
                        <p class="volunteer-name">${vol.name}</p>
                        <p class="volunteer-id">${vol.id}</p>
                    </div>
                    <span class="volunteer-badge">${vol.experienceLevel}</span>
                </div>
                <div class="volunteer-metrics">
                    <div class="metric-item">
                        <span class="metric-value">${vol.totalHours}</span>
                        <span class="metric-label">Total Hours</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-value">${vol.shiftsCompleted}</span>
                        <span class="metric-label">Shifts</span>
                    </div>
                </div>
                <div class="volunteer-certifications">
                    <span class="volunteer-certifications-label">Certifications:</span>
                    <div>
                        ${vol.certifications.map(cert => {
                            const status = calculateCertStatus(cert.expiry);
                            return `<span class="cert-item ${status}">${cert.type}</span>`;
                        }).join('')}
                    </div>
                </div>
                <div class="volunteer-actions">
                    <button onclick="viewVolunteerDetail('${vol.id}')">View Details</button>
                    <button onclick="logActivity('${vol.id}')">Log Activity</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderShifts() {
    const container = document.getElementById('shiftsList');
    let shifts = [...appState.shifts];

    // Apply filters
    const category = document.getElementById('shiftCategoryFilter').value;
    const status = document.getElementById('shiftStatusFilter').value;
    
    if (category) {
        shifts = shifts.filter(s => s.category === category);
    }
    if (status) {
        shifts = shifts.filter(s => s.status === status);
    }

    const searchTerm = document.getElementById('shiftSearchBox').value.toLowerCase();
    if (searchTerm) {
        shifts = shifts.filter(s =>
            s.title.toLowerCase().includes(searchTerm) ||
            s.description.toLowerCase().includes(searchTerm)
        );
    }

    // Sort by date
    shifts.sort((a, b) => new Date(a.date) - new Date(b.date));

    container.innerHTML = shifts.map(shift => `
        <div class="shift-card">
            <div class="shift-header">
                <div>
                    <p class="shift-title">${shift.title}</p>
                    <p class="shift-id">${shift.id}</p>
                </div>
                <span class="shift-status ${shift.status}">${shift.status.replace('-', ' ').toUpperCase()}</span>
            </div>
            <div class="shift-details">
                <div class="shift-detail">
                    <span class="shift-detail-label">Date</span>
                    <span class="shift-detail-value">${shift.date}</span>
                </div>
                <div class="shift-detail">
                    <span class="shift-detail-label">Time</span>
                    <span class="shift-detail-value">${shift.startTime} - ${shift.endTime}</span>
                </div>
                <div class="shift-detail">
                    <span class="shift-detail-label">Category</span>
                    <span class="shift-detail-value">${shift.category.replace('-', ' ')}</span>
                </div>
                <div class="shift-detail">
                    <span class="shift-detail-label">Volunteers</span>
                    <span class="shift-detail-value">${shift.volunteers.length}/${shift.maxVolunteers}</span>
                </div>
            </div>
            ${shift.description ? `<div class="shift-description">${shift.description}</div>` : ''}
            ${shift.requiredSkills.length > 0 ? `
                <div class="shift-requirements">
                    ${shift.requiredSkills.map(skill => `<span class="requirement-badge">${skill.replace('-', ' ')}</span>`).join('')}
                </div>
            ` : ''}
            ${shift.volunteers.length > 0 ? `
                <div class="shift-volunteers">
                    <div class="shift-volunteers-label">Assigned Volunteers:</div>
                    <div class="shift-volunteer-list">
                        ${shift.volunteers.map(v => `<span class="shift-volunteer-item">${v.name}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            <div class="shift-actions">
                <button onclick="assignVolunteerToShift('${shift.id}')">Assign Volunteer</button>
                <button onclick="viewShiftDetail('${shift.id}')">View Details</button>
            </div>
        </div>
    `).join('');
}

function renderActivities() {
    const container = document.getElementById('activitiesList');
    let activities = [...appState.activities];

    // Apply filters
    const volunteerFilter = document.getElementById('activityVolunteerFilter').value;
    const typeFilter = document.getElementById('activityTypeFilter').value;
    const statusFilter = document.getElementById('activityStatusFilter').value;

    if (volunteerFilter) {
        activities = activities.filter(a => a.volunteerId === volunteerFilter);
    }
    if (typeFilter) {
        activities = activities.filter(a => a.type === typeFilter);
    }
    if (statusFilter) {
        activities = activities.filter(a => a.status === statusFilter);
    }

    // Sort by date descending
    activities.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    container.innerHTML = activities.map(activity => `
        <div class="activity-item ${activity.status}">
            <div class="activity-header">
                <div class="activity-title">${activity.volunteerName} - ${activity.type.replace('-', ' ')}</div>
                <span class="activity-status ${activity.status}">${activity.status.replace('-', ' ').toUpperCase()}</span>
            </div>
            <div class="activity-details">
                <div class="activity-detail">
                    <span class="activity-detail-label">Date:</span>
                    <span class="activity-detail-value">${activity.startTime.split(' ')[0]}</span>
                </div>
                <div class="activity-detail">
                    <span class="activity-detail-label">Time:</span>
                    <span class="activity-detail-value">${activity.startTime.split(' ')[1]} - ${activity.endTime.split(' ')[1]}</span>
                </div>
                <div class="activity-detail">
                    <span class="activity-hours">${activity.hoursWorked} hrs</span>
                </div>
            </div>
            <div class="activity-description">${activity.description}</div>
            ${activity.incident ? `
                <div style="padding: 10px; background: #fff3cd; border-radius: 5px; margin: 10px 0; font-size: 13px;">
                    <strong>Incident (${activity.incident.type}):</strong> ${activity.incident.description}
                </div>
            ` : ''}
            ${activity.status === 'pending-approval' ? `
                <div class="activity-actions">
                    <button onclick="approveActivity('${activity.id}')">Approve</button>
                    <button onclick="rejectActivity('${activity.id}')">Reject</button>
                </div>
            ` : ''}
        </div>
    `).join('');

    // Populate volunteer filter
    const volunteerFilterSelect = document.getElementById('activityVolunteerFilter');
    if (volunteerFilterSelect.children.length === 1) { // Only "All Volunteers" option
        appState.activities.forEach(activity => {
            if (!Array.from(volunteerFilterSelect.options).some(opt => opt.value === activity.volunteerId)) {
                const option = document.createElement('option');
                option.value = activity.volunteerId;
                option.textContent = activity.volunteerName;
                volunteerFilterSelect.appendChild(option);
            }
        });
    }
}

function renderCertifications() {
    const container = document.getElementById('certificationsList');
    let certs = [...appState.certifications];

    // Apply filters
    const volunteerFilter = document.getElementById('trainingVolunteerFilter').value;
    const statusFilter = document.getElementById('certStatusFilter').value;

    if (volunteerFilter) {
        certs = certs.filter(c => c.volunteerId === volunteerFilter);
    }
    if (statusFilter) {
        certs = certs.filter(c => {
            const status = calculateCertStatus(c.expiry);
            return status === statusFilter;
        });
    }

    container.innerHTML = certs.map(cert => {
        const status = calculateCertStatus(cert.expiry);
        return `
            <div class="certification-item">
                <div class="cert-left">
                    <p class="cert-volunteer-name">${cert.volunteerName}</p>
                    <div class="cert-type">${cert.type}</div>
                    <div class="cert-dates">Issued: ${cert.issued} | Expires: ${cert.expiry}</div>
                </div>
                <span class="cert-status ${status}">${status.replace('-', ' ').toUpperCase()}</span>
            </div>
        `;
    }).join('');

    // Populate volunteer filter
    const volunteerFilterSelect = document.getElementById('trainingVolunteerFilter');
    if (volunteerFilterSelect.children.length === 1) {
        appState.certifications.forEach(cert => {
            if (!Array.from(volunteerFilterSelect.options).some(opt => opt.value === cert.volunteerId)) {
                const option = document.createElement('option');
                option.value = cert.volunteerId;
                option.textContent = cert.volunteerName;
                volunteerFilterSelect.appendChild(option);
            }
        });
    }

    // Render training modules
    const modulesContainer = document.getElementById('trainingModulesList');
    const modules = [
        { icon: '🐕', title: 'Animal Care Basics', description: 'Learn proper animal handling and care techniques' },
        { icon: '🛡️', title: 'Safety Protocols', description: 'Essential safety guidelines and emergency procedures' },
        { icon: '👥', title: 'Customer Service', description: 'Communicating effectively with visitors and adopters' },
        { icon: '🐶', title: 'Dog Training', description: 'Advanced dog behavior and training methods' },
        { icon: '📚', title: 'Health & Nutrition', description: 'Animal nutrition and basic health monitoring' },
        { icon: '💼', title: 'Leadership Skills', description: 'Becoming a volunteer coordinator or mentor' }
    ];

    modulesContainer.innerHTML = modules.map((mod, idx) => `
        <div class="module-card">
            <div class="module-icon">${mod.icon}</div>
            <h4 class="module-title">${mod.title}</h4>
            <p class="module-description">${mod.description}</p>
            <button class="module-btn" onclick="enrollModule(${idx})">Enroll</button>
        </div>
    `).join('');
}

function loadRecognitionData() {
    // Stats
    document.getElementById('totalVolunteers').textContent = appState.volunteers.length;
    const totalHours = appState.volunteers.reduce((sum, v) => sum + v.totalHours, 0);
    document.getElementById('totalHours').textContent = totalHours;
    
    const thisMonthHours = appState.volunteers.reduce((sum, v) => sum + v.thisMonthHours, 0);
    document.getElementById('thisMonthHours').textContent = thisMonthHours;
    
    const expiringCerts = appState.certifications.filter(c =>
        calculateCertStatus(c.expiry) === 'expiring-soon'
    ).length;
    document.getElementById('certExpiring').textContent = expiringCerts;

    // Leaderboard
    renderLeaderboard('all-time');

    // Badges
    renderBadges();

    // Volunteer of the Month
    renderVolunteerOfMonth();

    // Messages
    renderMessages();
}

function renderLeaderboard(period) {
    const tbody = document.getElementById('leaderboardBody');
    let volunteers = [...appState.volunteers];

    // Sort by hours
    volunteers.sort((a, b) => b.totalHours - a.totalHours);
    volunteers = volunteers.slice(0, 10);

    tbody.innerHTML = volunteers.map((vol, idx) => {
        let rankBadgeClass = 'other';
        if (idx === 0) rankBadgeClass = 'gold';
        else if (idx === 1) rankBadgeClass = 'silver';
        else if (idx === 2) rankBadgeClass = 'bronze';

        return `
            <tr>
                <td><div class="rank-badge ${rankBadgeClass}">${idx + 1}</div></td>
                <td>${vol.name}</td>
                <td>${vol.totalHours}h</td>
                <td>${vol.shiftsCompleted}</td>
                <td>${vol.badges.map(b => {
                    if (b === '50-hours') return '🥉';
                    if (b === '100-hours') return '🥈';
                    if (b === '250-hours') return '🥇';
                    if (b === 'volunteer-of-month') return '⭐';
                    return '🎖️';
                }).join('')}</td>
            </tr>
        `;
    }).join('');
}

function renderBadges() {
    const container = document.getElementById('badgesList');
    const badges = [
        { icon: '🥉', name: '50 Hours', description: 'Complete 50 volunteer hours' },
        { icon: '🥈', name: '100 Hours', description: 'Complete 100 volunteer hours' },
        { icon: '🥇', name: '250 Hours', description: 'Complete 250 volunteer hours' },
        { icon: '👑', name: '500 Hours', description: 'Complete 500 volunteer hours' },
        { icon: '💎', name: '1000 Hours', description: 'Complete 1000 volunteer hours' },
        { icon: '⭐', name: 'Volunteer of Month', description: 'Awarded for excellence' },
        { icon: '🎖️', name: 'Perfect Attendance', description: '0 no-shows for 90 days' },
        { icon: '🌟', name: 'Top Rated', description: '4.8+ average rating' }
    ];

    container.innerHTML = badges.map(badge => `
        <div class="badge-item">
            <div class="badge-icon">${badge.icon}</div>
            <p class="badge-name">${badge.name}</p>
            <p class="badge-description">${badge.description}</p>
        </div>
    `).join('');
}

function renderVolunteerOfMonth() {
    const container = document.getElementById('volOfMonth');
    const topVol = appState.volunteers.reduce((prev, current) =>
        (prev.thisMonthHours > current.thisMonthHours) ? prev : current
    );

    container.innerHTML = `
        <div class="vol-month-avatar">${topVol.name.charAt(0)}</div>
        <div class="vol-month-name">${topVol.name}</div>
        <div class="vol-month-stats">
            <div class="vol-month-stat">
                <div class="vol-month-stat-value">${topVol.thisMonthHours}</div>
                <div class="vol-month-stat-label">Hours</div>
            </div>
            <div class="vol-month-stat">
                <div class="vol-month-stat-value">${topVol.shiftsCompleted}</div>
                <div class="vol-month-stat-label">Shifts</div>
            </div>
            <div class="vol-month-stat">
                <div class="vol-month-stat-value">${topVol.avgRating}</div>
                <div class="vol-month-stat-label">Rating</div>
            </div>
        </div>
    `;
}

function renderMessages() {
    const container = document.getElementById('messagesList');
    const messages = [
        {
            recipient: 'Michael Chen',
            date: '2024-02-01',
            message: 'Thank you for your exceptional dedication! Your consistent volunteer work and positive attitude make a real difference in our organization.'
        },
        {
            recipient: 'Sarah Johnson',
            date: '2024-01-28',
            message: 'We truly appreciate your commitment to animal welfare. Your contributions have helped many animals find loving homes.'
        },
        {
            recipient: 'Jessica Martinez',
            date: '2024-01-25',
            message: 'Welcome to the team! Thank you for getting involved in our community and helping animals in need.'
        }
    ];

    container.innerHTML = messages.map(msg => `
        <div class="message-item">
            <div class="message-header">
                <div class="message-recipient">${msg.recipient}</div>
                <div class="message-date">${msg.date}</div>
            </div>
            <div class="message-content">${msg.message}</div>
            <div class="message-signature">- EWOC Team</div>
        </div>
    `).join('');
}

// ========== CALENDAR ========== 

function generateCalendar(month, year) {
    const calendarContainer = document.getElementById('calendar');
    const monthYear = document.getElementById('currentMonth');
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    monthYear.textContent = firstDay.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = dayHeaders.map(day => `<div class="calendar-day-header">${day}</div>`).join('');
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div class="calendar-day other-month"></div>';
    }
    
    // Days of the month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        const isToday = date.toDateString() === today.toDateString();
        const shiftsOnDay = appState.shifts.filter(s => s.date === dateStr);
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <div class="calendar-day-number">${day}</div>
                <div class="calendar-day-shifts">
                    ${shiftsOnDay.length > 0 ? `${shiftsOnDay.length} shift${shiftsOnDay.length > 1 ? 's' : ''}` : ''}
                </div>
            </div>
        `;
    }
    
    // Empty cells for days after month ends
    const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
    for (let i = startingDayOfWeek + daysInMonth; i < totalCells; i++) {
        html += '<div class="calendar-day other-month"></div>';
    }
    
    calendarContainer.innerHTML = html;
}

// ========== EVENT HANDLERS ==========

document.addEventListener('DOMContentLoaded', async () => {
    // Load initial data
    await fetchApplications();
    await fetchVolunteers();
    await fetchShifts();
    await fetchActivities();
    await fetchCertifications();

    // Render initial tab
    renderApplications();

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            showTab(e.target.closest('.tab-btn').dataset.tab);
        });
    });

    // Application form
    document.getElementById('openAppFormBtn').addEventListener('click', () => {
        showModal('appFormModal');
    });

    document.getElementById('cancelAppFormBtn').addEventListener('click', () => {
        hideModal('appFormModal');
    });

    document.querySelector('#appFormModal .modal-close').addEventListener('click', () => {
        hideModal('appFormModal');
    });

    document.getElementById('appForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('✓ Application submitted! The applicant will be reviewed by our team.');
        hideModal('appFormModal');
        document.getElementById('appForm').reset();
    });

    // Application filters
    document.getElementById('appStatusFilter').addEventListener('change', renderApplications);
    document.getElementById('appSearchBox').addEventListener('input', renderApplications);

    // Volunteer filters
    document.getElementById('volunteerSortBy').addEventListener('change', renderVolunteers);
    document.getElementById('volunteerSearchBox').addEventListener('input', renderVolunteers);

    // Shift creation
    document.getElementById('createShiftBtn').addEventListener('click', () => {
        showModal('shiftModal');
    });

    document.getElementById('cancelShiftBtn').addEventListener('click', () => {
        hideModal('shiftModal');
    });

    document.querySelector('#shiftModal .modal-close').addEventListener('click', () => {
        hideModal('shiftModal');
    });

    document.getElementById('shiftForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('✓ Shift created! Volunteers can now sign up.');
        hideModal('shiftModal');
        document.getElementById('shiftForm').reset();
    });

    // Recurrence toggle
    document.getElementById('shiftRecurrence').addEventListener('change', (e) => {
        const endGroup = document.getElementById('recurrenceEndGroup');
        endGroup.style.display = e.target.value !== 'none' ? 'block' : 'none';
    });

    // Shift filters
    document.getElementById('shiftCategoryFilter').addEventListener('change', renderShifts);
    document.getElementById('shiftStatusFilter').addEventListener('change', renderShifts);
    document.getElementById('shiftSearchBox').addEventListener('input', renderShifts);

    // Clock in/out
    document.getElementById('clockInBtn').addEventListener('click', () => {
        document.getElementById('clockTitle').textContent = 'Clock In';
        document.getElementById('clockOutFields').style.display = 'none';
        document.getElementById('clockSubmitBtn').textContent = 'Clock In';
        document.getElementById('clockForm').dataset.mode = 'in';
        showModal('clockModal');
    });

    document.getElementById('cancelClockBtn').addEventListener('click', () => {
        hideModal('clockModal');
    });

    document.querySelector('#clockModal .modal-close').addEventListener('click', () => {
        hideModal('clockModal');
    });

    // Populate clock in volunteer selector
    const clockVolSelect = document.getElementById('clockVolunteer');
    appState.volunteers.forEach(vol => {
        const option = document.createElement('option');
        option.value = vol.id;
        option.textContent = vol.name;
        clockVolSelect.appendChild(option);
    });

    document.getElementById('clockForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const volunteerName = appState.volunteers.find(v => v.id === document.getElementById('clockVolunteer').value)?.name;
        alert(`✓ Activity logged for ${volunteerName}!`);
        hideModal('clockModal');
        document.getElementById('clockForm').reset();
    });

    // Activity filters
    document.getElementById('activityTypeFilter').addEventListener('change', renderActivities);
    document.getElementById('activityStatusFilter').addEventListener('change', renderActivities);
    document.getElementById('activityVolunteerFilter').addEventListener('change', renderActivities);

    // Certifications
    document.getElementById('addCertBtn').addEventListener('click', () => {
        showModal('certModal');
    });

    document.getElementById('cancelCertBtn').addEventListener('click', () => {
        hideModal('certModal');
    });

    document.querySelector('#certModal .modal-close').addEventListener('click', () => {
        hideModal('certModal');
    });

    // Populate cert volunteer selector
    const certVolSelect = document.getElementById('certVolunteer');
    appState.volunteers.forEach(vol => {
        const option = document.createElement('option');
        option.value = vol.id;
        option.textContent = vol.name;
        certVolSelect.appendChild(option);
    });

    document.getElementById('certForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('✓ Certification added!');
        hideModal('certModal');
        document.getElementById('certForm').reset();
    });

    document.getElementById('trainingVolunteerFilter').addEventListener('change', renderCertifications);
    document.getElementById('certStatusFilter').addEventListener('change', renderCertifications);

    // Leaderboard period filters
    document.querySelectorAll('.leaderboard-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.leaderboard-filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderLeaderboard(e.target.dataset.period);
        });
    });

    // CSV Export
    document.getElementById('exportCsvBtn').addEventListener('click', () => {
        let csv = 'Volunteer,Email,Total Hours,This Month,Shifts Completed,Rating\n';
        appState.volunteers.forEach(vol => {
            csv += `"${vol.name}","${vol.email}",${vol.totalHours},${vol.thisMonthHours},${vol.shiftsCompleted},${vol.avgRating}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `volunteer-hours-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    });

    // Send thank you message
    document.getElementById('sendThankYouBtn').addEventListener('click', () => {
        const volunteer = prompt('Enter volunteer name:');
        if (volunteer) {
            const message = prompt('Enter your message:');
            if (message) {
                alert(`✓ Message sent to ${volunteer}!`);
            }
        }
    });

    // Calendar
    const today = new Date();
    generateCalendar(today.getMonth(), today.getFullYear());

    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    // Initial render of scheduling tab content
    renderShifts();
});

// ========== BUTTON ACTION FUNCTIONS ==========

function approveApplication(appId) {
    const app = appState.applications.find(a => a.id === appId);
    if (app) {
        app.status = 'approved';
        alert(`✓ Application approved for ${app.name}!`);
        renderApplications();
    }
}

function rejectApplication(appId) {
    const app = appState.applications.find(a => a.id === appId);
    if (app) {
        app.status = 'rejected';
        alert(`✗ Application rejected for ${app.name}`);
        renderApplications();
    }
}

function viewVolunteerDetail(volId) {
    const vol = appState.volunteers.find(v => v.id === volId);
    if (vol) {
        alert(`Volunteer: ${vol.name}\nID: ${vol.id}\nTotal Hours: ${vol.totalHours}\nRating: ${vol.avgRating}/5`);
    }
}

function logActivity(volId) {
    document.getElementById('clockVolunteer').value = volId;
    showModal('clockModal');
}

function assignVolunteerToShift(shiftId) {
    alert('Volunteer assignment feature - select a volunteer from the list to assign to this shift');
}

function viewShiftDetail(shiftId) {
    const shift = appState.shifts.find(s => s.id === shiftId);
    if (shift) {
        alert(`Shift: ${shift.title}\nDate: ${shift.date}\nTime: ${shift.startTime}-${shift.endTime}\nStatus: ${shift.status}\nRequired: ${shift.minVolunteers}-${shift.maxVolunteers} volunteers`);
    }
}

function approveActivity(actId) {
    const activity = appState.activities.find(a => a.id === actId);
    if (activity) {
        activity.status = 'approved';
        alert(`✓ Activity approved! ${activity.hoursWorked} hours logged for ${activity.volunteerName}`);
        renderActivities();
    }
}

function rejectActivity(actId) {
    const activity = appState.activities.find(a => a.id === actId);
    if (activity) {
        activity.status = 'pending-approval';
        alert(`Activity returned for revision`);
        renderActivities();
    }
}

function enrollModule(moduleIdx) {
    alert('✓ Enrolled in training module! You\'ll receive materials via email.');
}

function loadVolunteersTab() {
    renderVolunteers();
}
