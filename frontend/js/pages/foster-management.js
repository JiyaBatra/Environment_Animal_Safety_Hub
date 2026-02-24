// Foster Management JavaScript
const API_BASE_URL = 'http://localhost:3000/api';

const fosterManagement = {
    currentTab: 'applications',
    applications: [],
    homes: [],
    placements: [],
    animals: [],
    currentPlacementId: null,
    currentHomeId: null,
    useDummyData: true, // Set to false when API is ready

    // Initialize
    init() {
        this.setupTabs();
        this.setupEventListeners();
        this.loadDashboardStats();
        this.loadAllData();
    },

    // Setup tabs
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabName}-tab`) {
                        content.classList.add('active');
                    }
                });

                this.currentTab = tabName;
            });
        });
    },

    // Setup event listeners
    setupEventListeners() {
        // Application form
        const appForm = document.getElementById('application-form');
        if (appForm) {
            appForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitApplication();
            });
        }

        // Placement form
        const placementForm = document.getElementById('placement-form');
        if (placementForm) {
            placementForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createPlacement();
            });
        }

        // Check-in form
        const checkinForm = document.getElementById('checkin-form');
        if (checkinForm) {
            checkinForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitCheckIn();
            });
        }

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    },

    // Load dashboard statistics
    async loadDashboardStats() {
        if (this.useDummyData) {
            document.getElementById('stat-applications').textContent = '3';
            document.getElementById('stat-homes').textContent = '3';
            document.getElementById('stat-placements').textContent = '2';
            document.getElementById('stat-adoptions').textContent = '1';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/foster/reports/dashboard`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.success) {
                const stats = data.data;
                document.getElementById('stat-applications').textContent = stats.applications.total;
                document.getElementById('stat-homes').textContent = stats.homes.active;
                document.getElementById('stat-placements').textContent = stats.placements.active;
                document.getElementById('stat-adoptions').textContent = stats.placements.adopted;
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            document.getElementById('stat-applications').textContent = '0';
            document.getElementById('stat-homes').textContent = '0';
            document.getElementById('stat-placements').textContent = '0';
            document.getElementById('stat-adoptions').textContent = '0';
        }
    },

    // Load all data
    async loadAllData() {
        await Promise.all([
            this.loadApplications(),
            this.loadFosterHomes(),
            this.loadPlacements(),
            this.loadAnimals()
        ]);
    },

    // ==================== APPLICATIONS ====================

    // Load applications
    async loadApplications() {
        if (this.useDummyData) {
            this.applications = [
                {
                    _id: '1',
                    applicationNumber: 'FA-2026-001',
                    applicantInfo: {
                        firstName: 'Sarah',
                        lastName: 'Johnson',
                        email: 'sarah.j@email.com',
                        phone: '(555) 123-4567'
                    },
                    householdInfo: {
                        residenceType: 'house',
                        ownOrRent: 'own'
                    },
                    experience: {
                        previousFoster: true,
                        petOwnershipYears: 10,
                        canHandleSpecialNeeds: true,
                        experienceLevel: 'advanced'
                    },
                    approval: {
                        status: 'approved',
                        score: 92
                    },
                    createdAt: new Date('2026-01-15')
                },
                {
                    _id: '2',
                    applicationNumber: 'FA-2026-002',
                    applicantInfo: {
                        firstName: 'Michael',
                        lastName: 'Chen',
                        email: 'mchen@email.com',
                        phone: '(555) 234-5678'
                    },
                    householdInfo: {
                        residenceType: 'apartment',
                        ownOrRent: 'rent'
                    },
                    experience: {
                        previousFoster: false,
                        petOwnershipYears: 5,
                        canHandleSpecialNeeds: false,
                        experienceLevel: 'intermediate'
                    },
                    approval: {
                        status: 'under-review',
                        score: 75
                    },
                    createdAt: new Date('2026-01-20')
                },
                {
                    _id: '3',
                    applicationNumber: 'FA-2026-003',
                    applicantInfo: {
                        firstName: 'Emily',
                        lastName: 'Rodriguez',
                        email: 'emily.r@email.com',
                        phone: '(555) 345-6789'
                    },
                    householdInfo: {
                        residenceType: 'house',
                        ownOrRent: 'own'
                    },
                    experience: {
                        previousFoster: false,
                        petOwnershipYears: 3,
                        canHandleSpecialNeeds: true,
                        experienceLevel: 'beginner'
                    },
                    approval: {
                        status: 'pending',
                        score: null
                    },
                    createdAt: new Date('2026-01-25')
                }
            ];
            this.displayApplications(this.applications);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/foster/applications`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.success) {
                this.applications = data.data;
                this.displayApplications(this.applications);
            } else {
                throw new Error(data.message || 'Failed to load applications');
            }
        } catch (error) {
            console.error('Error loading applications:', error);
            document.getElementById('applications-list').innerHTML = 
                `<div class="loading-message">Error: ${error.message}<br>Make sure the server is running on port 3000</div>`;
        }
    },

    // Display applications
    displayApplications(applications) {
        const container = document.getElementById('applications-list');
        
        if (applications.length === 0) {
            container.innerHTML = '<div class="loading-message">No applications found</div>';
            return;
        }

        container.innerHTML = applications.map(app => `
            <div class="application-card" onclick="fosterManagement.showApplicationDetails('${app._id}')">
                <div class="application-header">
                    <span class="application-number">${app.applicationNumber}</span>
                    <span class="status-badge status-${app.approval.status}">
                        ${app.approval.status.replace('-', ' ').toUpperCase()}
                    </span>
                </div>
                <h3 class="applicant-name">
                    ${app.applicantInfo.firstName} ${app.applicantInfo.lastName}
                </h3>
                <div class="application-details">
                    <div class="detail-row">
                        <span class="detail-icon">📧</span>
                        <span>${app.applicantInfo.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-icon">📞</span>
                        <span>${app.applicantInfo.phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-icon">🏠</span>
                        <span>${app.householdInfo.residenceType} (${app.householdInfo.ownOrRent})</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-icon">📅</span>
                        <span>Applied: ${new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    ${app.approval.score ? `
                        <div class="score-badge">
                            <span>⭐</span>
                            <span>Score: ${app.approval.score}/100</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    // Filter applications
    filterApplications() {
        const statusFilter = document.getElementById('app-status-filter').value;
        const searchTerm = document.getElementById('app-search').value.toLowerCase();

        let filtered = this.applications;

        if (statusFilter) {
            filtered = filtered.filter(app => app.approval.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(app => 
                app.applicantInfo.firstName.toLowerCase().includes(searchTerm) ||
                app.applicantInfo.lastName.toLowerCase().includes(searchTerm) ||
                app.applicantInfo.email.toLowerCase().includes(searchTerm) ||
                app.applicationNumber.toLowerCase().includes(searchTerm)
            );
        }

        this.displayApplications(filtered);
    },

    // Show application form
    showApplicationForm() {
        this.openModal('application-modal');
        document.getElementById('application-form').reset();
    },

    // Submit application
    async submitApplication() {
        try {
            const formData = {
                applicantInfo: {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    dateOfBirth: document.getElementById('dateOfBirth').value,
                    occupation: document.getElementById('occupation').value,
                    address: {
                        street: document.getElementById('street').value,
                        city: document.getElementById('city').value,
                        state: document.getElementById('state').value,
                        zipCode: document.getElementById('zipCode').value
                    }
                },
                householdInfo: {
                    residenceType: document.getElementById('residenceType').value,
                    ownOrRent: document.getElementById('ownOrRent').value,
                    hasYard: document.getElementById('hasYard').checked,
                    yardFenced: document.getElementById('yardFenced').checked
                },
                experience: {
                    previousFoster: document.getElementById('previousFoster').checked,
                    petOwnershipYears: parseInt(document.getElementById('petOwnershipYears').value) || 0,
                    canHandleSpecialNeeds: document.getElementById('canHandleSpecialNeeds').checked,
                    experienceLevel: document.getElementById('experienceLevel').value
                },
                availability: {
                    startDate: document.getElementById('startDate').value,
                    maxAnimals: parseInt(document.getElementById('maxAnimals').value) || 1,
                    availableForEmergencies: document.getElementById('availableForEmergencies').checked
                },
                questionnaire: {
                    whyFoster: document.getElementById('whyFoster').value,
                    timeCommitment: document.getElementById('timeCommitment').value
                }
            };

            const response = await fetch(`${API_BASE_URL}/foster/applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Application submitted successfully!');
                this.closeModal('application-modal');
                this.loadApplications();
                this.loadDashboardStats();
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            this.showError('Failed to submit application');
        }
    },

    // Show application details
    async showApplicationDetails(applicationId) {
        try {
            const response = await fetch(`${API_BASE_URL}/foster/applications/${applicationId}`);
            const data = await response.json();

            if (data.success) {
                const app = data.data;
                const content = document.getElementById('application-details-content');
                
                content.innerHTML = `
                    <div class="application-details-view">
                        <div class="detail-section">
                            <h3>Application Information</h3>
                            <p><strong>Application Number:</strong> ${app.applicationNumber}</p>
                            <p><strong>Status:</strong> 
                                <span class="status-badge status-${app.approval.status}">
                                    ${app.approval.status.replace('-', ' ').toUpperCase()}
                                </span>
                            </p>
                            <p><strong>Submitted:</strong> ${new Date(app.createdAt).toLocaleDateString()}</p>
                            ${app.approval.score ? `<p><strong>Score:</strong> ${app.approval.score}/100</p>` : ''}
                        </div>

                        <div class="detail-section">
                            <h3>Applicant Information</h3>
                            <p><strong>Name:</strong> ${app.applicantInfo.firstName} ${app.applicantInfo.lastName}</p>
                            <p><strong>Email:</strong> ${app.applicantInfo.email}</p>
                            <p><strong>Phone:</strong> ${app.applicantInfo.phone}</p>
                            ${app.applicantInfo.occupation ? `<p><strong>Occupation:</strong> ${app.applicantInfo.occupation}</p>` : ''}
                        </div>

                        <div class="detail-section">
                            <h3>Household Information</h3>
                            <p><strong>Residence Type:</strong> ${app.householdInfo.residenceType}</p>
                            <p><strong>Own/Rent:</strong> ${app.householdInfo.ownOrRent}</p>
                            <p><strong>Has Yard:</strong> ${app.householdInfo.hasYard ? 'Yes' : 'No'}</p>
                            ${app.householdInfo.hasYard ? `<p><strong>Fenced:</strong> ${app.householdInfo.yardFenced ? 'Yes' : 'No'}</p>` : ''}
                        </div>

                        <div class="detail-section">
                            <h3>Experience</h3>
                            <p><strong>Previous Foster:</strong> ${app.experience.previousFoster ? 'Yes' : 'No'}</p>
                            <p><strong>Pet Ownership:</strong> ${app.experience.petOwnershipYears} years</p>
                            <p><strong>Experience Level:</strong> ${app.experience.experienceLevel}</p>
                            <p><strong>Special Needs:</strong> ${app.experience.canHandleSpecialNeeds ? 'Yes' : 'No'}</p>
                        </div>

                        ${app.homeInspection.completed ? `
                            <div class="detail-section">
                                <h3>Home Inspection</h3>
                                <p><strong>Completed:</strong> ${new Date(app.homeInspection.completedDate).toLocaleDateString()}</p>
                                <p><strong>Safety Score:</strong> ${app.homeInspection.safetyScore}/100</p>
                                <p><strong>Inspector:</strong> ${app.homeInspection.inspector}</p>
                                ${app.homeInspection.notes ? `<p><strong>Notes:</strong> ${app.homeInspection.notes}</p>` : ''}
                            </div>
                        ` : ''}

                        <div class="form-actions">
                            ${app.approval.status === 'pending' || app.approval.status === 'under-review' ? `
                                <button class="btn btn-primary" onclick="fosterManagement.scheduleInspection('${app._id}')">
                                    Schedule Inspection
                                </button>
                                <button class="btn btn-success" onclick="fosterManagement.approveApplication('${app._id}')">
                                    Approve
                                </button>
                                <button class="btn btn-danger" onclick="fosterManagement.rejectApplication('${app._id}')">
                                    Reject
                                </button>
                            ` : ''}
                            ${app.approval.status === 'approved' ? `
                                <button class="btn btn-primary" onclick="fosterManagement.createHomeFromApplication('${app._id}')">
                                    Create Foster Home
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;

                this.openModal('application-details-modal');
            }
        } catch (error) {
            console.error('Error loading application details:', error);
            this.showError('Failed to load application details');
        }
    },

    // Approve application
    async approveApplication(applicationId) {
        try {
            const response = await fetch(`${API_BASE_URL}/foster/applications/${applicationId}/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'approved',
                    reviewedBy: 'Admin',
                    scoringCriteria: {
                        experience: 80,
                        homeEnvironment: 85,
                        availability: 90,
                        references: 75,
                        inspection: 80
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Application approved!');
                this.closeModal('application-details-modal');
                this.loadApplications();
            }
        } catch (error) {
            console.error('Error approving application:', error);
            this.showError('Failed to approve application');
        }
    },

    // Reject application
    async rejectApplication(applicationId) {
        const reason = prompt('Please provide a rejection reason:');
        if (!reason) return;

        try {
            const response = await fetch(`${API_BASE_URL}/foster/applications/${applicationId}/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'rejected',
                    reviewedBy: 'Admin',
                    rejectionReason: reason
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Application rejected');
                this.closeModal('application-details-modal');
                this.loadApplications();
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            this.showError('Failed to reject application');
        }
    },

    // Create foster home from approved application
    async createHomeFromApplication(applicationId) {
        try {
            const response = await fetch(`${API_BASE_URL}/foster/homes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId })
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Foster home created successfully!');
                this.closeModal('application-details-modal');
                this.loadFosterHomes();
                this.loadDashboardStats();
            }
        } catch (error) {
            console.error('Error creating foster home:', error);
            this.showError('Failed to create foster home');
        }
    },

    // Export applications
    exportApplications() {
        const csv = this.convertToCSV(this.applications, [
            'applicationNumber',
            'applicantInfo.firstName',
            'applicantInfo.lastName',
            'applicantInfo.email',
            'approval.status',
            'approval.score',
            'createdAt'
        ]);
        this.downloadCSV(csv, 'foster-applications.csv');
    },

    // ==================== FOSTER HOMES ====================

    // Load foster homes
    async loadFosterHomes() {
        if (this.useDummyData) {
            this.homes = [
                {
                    _id: '1',
                    homeNumber: 'FH-2026-001',
                    fosterParent: {
                        firstName: 'Sarah',
                        lastName: 'Johnson',
                        email: 'sarah.j@email.com',
                        phone: '(555) 123-4567'
                    },
                    status: 'active',
                    capacity: {
                        maximum: 3,
                        current: 2,
                        available: 1
                    },
                    specializations: ['puppies', 'medical', 'special-needs'],
                    performance: {
                        totalPlacements: 12,
                        successfulAdoptions: 10,
                        returnRate: 16.67,
                        rating: 4.8
                    }
                },
                {
                    _id: '2',
                    homeNumber: 'FH-2026-002',
                    fosterParent: {
                        firstName: 'David',
                        lastName: 'Martinez',
                        email: 'david.m@email.com',
                        phone: '(555) 987-6543'
                    },
                    status: 'available',
                    capacity: {
                        maximum: 2,
                        current: 0,
                        available: 2
                    },
                    specializations: ['kittens', 'senior'],
                    performance: {
                        totalPlacements: 8,
                        successfulAdoptions: 7,
                        returnRate: 12.5,
                        rating: 4.5
                    }
                },
                {
                    _id: '3',
                    homeNumber: 'FH-2026-003',
                    fosterParent: {
                        firstName: 'Lisa',
                        lastName: 'Thompson',
                        email: 'lisa.t@email.com',
                        phone: '(555) 456-7890'
                    },
                    status: 'full',
                    capacity: {
                        maximum: 1,
                        current: 1,
                        available: 0
                    },
                    specializations: ['behavioral'],
                    performance: {
                        totalPlacements: 5,
                        successfulAdoptions: 4,
                        returnRate: 20,
                        rating: 4.2
                    }
                }
            ];
            this.displayFosterHomes(this.homes);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/foster/homes`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.success) {
                this.homes = data.data;
                this.displayFosterHomes(this.homes);
            } else {
                throw new Error(data.message || 'Failed to load homes');
            }
        } catch (error) {
            console.error('Error loading foster homes:', error);
            document.getElementById('homes-list').innerHTML = 
                `<div class="loading-message">Error: ${error.message}</div>`;
        }
    },

    // Display foster homes
    displayFosterHomes(homes) {
        const container = document.getElementById('homes-list');
        
        if (homes.length === 0) {
            container.innerHTML = '<div class="loading-message">No foster homes found</div>';
            return;
        }

        container.innerHTML = homes.map(home => `
            <div class="home-card">
                <div class="home-header">
                    <span class="home-number">${home.homeNumber}</span>
                    <span class="status-badge status-${home.status}">${home.status.toUpperCase()}</span>
                </div>
                <h3 class="foster-parent-name">
                    ${home.fosterParent.firstName} ${home.fosterParent.lastName}
                </h3>
                
                <div class="capacity-info">
                    <div class="capacity-item">
                        <div class="capacity-value">${home.capacity.maximum}</div>
                        <div class="capacity-label">Max</div>
                    </div>
                    <div class="capacity-item">
                        <div class="capacity-value">${home.capacity.current}</div>
                        <div class="capacity-label">Current</div>
                    </div>
                    <div class="capacity-item">
                        <div class="capacity-value">${home.capacity.available}</div>
                        <div class="capacity-label">Available</div>
                    </div>
                </div>

                ${home.specializations && home.specializations.length > 0 ? `
                    <div class="specializations">
        if (this.useDummyData) {
            this.placements = [
                {
                    _id: '1',
                    placementNumber: 'PL-2026-001',
                    animalInfo: {
                        name: 'Max',
                        species: 'Dog',
                        breed: 'Golden Retriever',
                        age: 2
                    },
                    fosterHomeId: { homeNumber: 'FH-2026-001' },
                    status: 'active',
                    matchingScore: 95,
                    placementDate: new Date('2026-01-10')
                },
                {
                    _id: '2',
                    placementNumber: 'PL-2026-002',
                    animalInfo: {
                        name: 'Luna',
                        species: 'Cat',
                        breed: 'Siamese',
                        age: 1
                    },
                    fosterHomeId: { homeNumber: 'FH-2026-003' },
                    status: 'active',
                    matchingScore: 88,
                    placementDate: new Date('2026-01-18')
                },
                {
                    _id: '3',
                    placementNumber: 'PL-2025-045',
                    animalInfo: {
                        name: 'Bella',
                        species: 'Dog',
                        breed: 'Labrador',
                        age: 3
                    },
                    fosterHomeId: { homeNumber: 'FH-2026-001' },
                    status: 'completed',
                    matchingScore: 92,
                    outcome: { type: 'adopted' },
                    placementDate: new Date('2025-11-15'),
                    actualEndDate: new Date('2026-01-05')
                }
            ];
            this.displayPlacements(this.placements);
            return;
        }

                        ${home.specializations.map(spec => 
                            `<span class="specialization-tag">${spec}</span>`
                        ).join('')}
                    </div>
                ` : ''}

                <div class="performance-metrics">
                    <div class="metric-row">
                        <span>Total Placements:</span>
                        <strong>${home.performance.totalPlacements}</strong>
                    </div>
                    <div class="metric-row">
                        <span>Successful Adoptions:</span>
                        <strong>${home.performance.successfulAdoptions}</strong>
                    </div>
                    <div class="metric-row">
                        <span>Rating:</span>
                        <span class="rating-stars">${'⭐'.repeat(Math.round(home.performance.rating))}</span>
                    </div>
                </div>

                <div class="application-actions">
                    <button class="btn btn-primary btn-small" onclick="fosterManagement.viewHomeDetails('${home._id}')">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Filter foster homes
    filterHomes() {
        const statusFilter = document.getElementById('home-status-filter').value;
        const specializationFilter = document.getElementById('home-specialization-filter').value;

        let filtered = this.homes;

        if (statusFilter) {
            if (statusFilter === 'available') {
                filtered = filtered.filter(home => home.status === 'active' && home.capacity.available > 0);
            } else {
                filtered = filtered.filter(home => home.status === statusFilter);
            }
        }

        if (specializationFilter) {
            filtered = filtered.filter(home => 
                home.specializations && home.specializations.includes(specializationFilter)
            );
        }

        this.displayFosterHomes(filtered);
    },

    // Calculate all metrics
    async calculateAllMetrics() {
        try {
            const promises = this.homes.map(home => 
                fetch(`${API_BASE_URL}/foster/homes/${home._id}/calculate-metrics`, {
                    method: 'POST'
                })
            );

            await Promise.all(promises);
            this.showSuccess('Metrics updated for all homes');
            this.loadFosterHomes();
        } catch (error) {
            console.error('Error calculating metrics:', error);
            this.showError('Failed to update metrics');
        }
    },

    // ==================== PLACEMENTS ====================

    // Load placements
    async loadPlacements() {
        try {
            const response = await fetch(`${API_BASE_URL}/foster/placements`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.success) {
                this.placements = data.data;
                this.displayPlacements(this.placements);
            } else {
                throw new Error(data.message || 'Failed to load placements');
            }
        } catch (error) {
            console.error('Error loading placements:', error);
            document.getElementById('placements-list').innerHTML = 
                `<div class="loading-message">Error: ${error.message}</div>`;
        }
    },

    // Display placements
    displayPlacements(placements) {
        const container = document.getElementById('placements-list');
        
        if (placements.length === 0) {
            container.innerHTML = '<div class="loading-message">No placements found</div>';
            return;
        }

        container.innerHTML = placements.map(placement => `
            <div class="placement-card">
                <div class="placement-header">
                    <span class="placement-number">${placement.placementNumber}</span>
                    <span class="status-badge status-${placement.status}">${placement.status.toUpperCase()}</span>
                </div>
                <h3 class="animal-name">${placement.animalInfo.name}</h3>
                
                <div class="placement-info">
                    <div class="detail-row">
                        <span>Species:</span>
                        <strong>${placement.animalInfo.species}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Foster Home:</span>
                        <strong>${placement.fosterHomeId?.homeNumber || 'N/A'}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Placement Date:</span>
                        <strong>${new Date(placement.placementDate).toLocaleDateString()}</strong>
                    </div>
                    ${placement.matchingScore ? `
                        <div class="matching-score-display">
                            <span>Match:</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${placement.matchingScore}%"></div>
                            </div>
                            <span class="score-value">${placement.matchingScore}%</span>
                        </div>
                    ` : ''}
                </div>

                <div class="placement-actions">
                    <button class="btn btn-primary btn-small" onclick="fosterManagement.viewPlacementDetails('${placement._id}')">
                        View Details
                    </button>
                    ${placement.status === 'active' ? `
                        <button class="btn btn-secondary btn-small" onclick="fosterManagement.showCheckInModal('${placement._id}')">
                            Check-In
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    // Filter placements
    filterPlacements() {
        const statusFilter = document.getElementById('placement-status-filter').value;
        let filtered = this.placements;

        if (statusFilter) {
            if (statusFilter === 'adopted') {
                filtered = filtered.filter(p => p.outcome && p.outcome.type === 'adopted');
            } else {
                filtered = filtered.filter(p => p.status === statusFilter);
            }
        }

        this.displayPlacements(filtered);
    },

    // Show placement form
    async showPlacementForm() {
        // Load animals and available homes
        await this.loadAnimals();
        const availableHomes = this.homes.filter(h => h.capacity.available > 0);

        const animalSelect = document.getElementById('placement-animal');
        const homeSelect = document.getElementById('placement-home');

        animalSelect.innerHTML = '<option value="">Select Animal</option>' +
            this.animals.map(a => `<option value="${a._id}">${a.name} (${a.species})</option>`).join('');

        homeSelect.innerHTML = '<option value="">Select Foster Home</option>' +
            availableHomes.map(h => `<option value="${h._id}">${h.homeNumber} - ${h.fosterParent.firstName} ${h.fosterParent.lastName}</option>`).join('');

        this.openModal('placement-modal');
    },

    // Create placement
    async createPlacement() {
        try {
            const formData = {
                animalId: document.getElementById('placement-animal').value,
                fosterHomeId: document.getElementById('placement-home').value,
                expectedEndDate: document.getElementById('expectedEndDate').value,
                notes: document.getElementById('placement-notes').value,
                matchingCriteria: {
                    sizeCompatibility: 85,
                    temperamentMatch: 90,
                    experienceLevel: 80,
                    specialNeedsCapability: 75,
                    availabilityMatch: 95
                }
            };

            const response = await fetch(`${API_BASE_URL}/foster/placements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Placement created successfully!');
                this.closeModal('placement-modal');
                this.loadPlacements();
                this.loadFosterHomes();
                this.loadDashboardStats();
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            console.error('Error creating placement:', error);
            this.showError('Failed to create placement');
        if (this.useDummyData) {
            this.animals = [
                { _id: '1', name: 'Charlie', species: 'Dog', breed: 'Beagle', age: 4, size: 'medium', temperament: 'friendly' },
                { _id: '2', name: 'Whiskers', species: 'Cat', breed: 'Persian', age: 2, size: 'small', temperament: 'calm' },
                { _id: '3', name: 'Rocky', species: 'Dog', breed: 'German Shepherd', age: 5, size: 'large', temperament: 'protective' },
                { _id: '4', name: 'Mittens', species: 'Cat', breed: 'Tabby', age: 1, size: 'small', temperament: 'playful' }
            ];
            
            const select = document.getElementById('matching-animal-select');
            if (select) {
                select.innerHTML = '<option value="">-- Select Animal --</option>' +
                    this.animals.map(a => `<option value="${a._id}">${a.name} (${a.species})</option>`).join('');
            }
            return;
        }

        }
    },

    // Show check-in modal
    showCheckInModal(placementId) {
        this.currentPlacementId = placementId;
        document.getElementById('checkin-form').reset();
        this.openModal('checkin-modal');
    },

    // Submit check-in
    async submitCheckIn() {
        try {
            const formData = {
                type: document.getElementById('checkin-type').value,
                method: document.getElementById('checkin-method').value,
                performedBy: 'Admin',
                animalCondition: {
                    health: document.getElementById('animal-health').value,
                    behavior: document.getElementById('animal-behavior').value,
                    notes: document.getElementById('checkin-notes').value
                }
            };

            const response = await fetch(`${API_BASE_URL}/foster/placements/${this.currentPlacementId}/check-ins`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Check-in recorded successfully!');
                this.closeModal('checkin-modal');
                this.loadPlacements();
            }
        } catch (error) {
            console.error('Error recording check-in:', error);
            this.showError('Failed to record check-in');
        }
    },

    // Export placements
    async exportPlacements() {
        try {
            const response = await fetch(`${API_BASE_URL}/foster/reports/placements/export?format=csv`);
            const csv = await response.text();
            this.downloadCSV(csv, 'placements-report.csv');
        } catch (error) {
            console.error('Error exporting placements:', error);
            this.showError('Failed to export placements');
        }
    },

    // ==================== MATCHING ====================

    // Load animals
    async loadAnimals() {
        try {
            const response = await fetch(`${API_BASE_URL}/animals`);
            const data = await response.json();

            if (data.success) {
                this.animals = data.data;
                
                // Populate animal select in matching tab
                const select = document.getElementById('matching-animal-select');
                if (select) {
                    select.innerHTML = '<option value="">-- Select Animal --</option>' +
                        this.animals.map(a => `<option value="${a._id}">${a.name} (${a.species})</option>`).join('');
                }
            }
        } catch (error) {
            console.error('Error loading animals:', error);
        }
    },

    // Find matches for animal
    async findMatches() {
        const animalId = document.getElementById('matching-animal-select').value;
        if (!animalId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/foster/placements/match/${animalId}`);
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                this.displayMatches(data.data);
                document.getElementById('matching-results').style.display = 'block';
            } else {
                document.getElementById('matching-results').style.display = 'none';
                this.showError('No available foster homes found');
            }
        } catch (error) {
            console.error('Error finding matches:', error);
            this.showError('Failed to find matches');
        }
    },

    // Display matches
    displayMatches(matches) {
        const container = document.getElementById('matches-list');
        
        container.innerHTML = matches.map(match => `
            <div class="match-card">
                <div class="match-score">
                    <div>
                        <strong>${match.home.homeNumber}</strong>
                        <p>${match.home.fosterParent.firstName} ${match.home.fosterParent.lastName}</p>
                    </div>
                    <div class="match-score-value">${match.matchingScore}%</div>
                </div>
                
                <div class="match-criteria">
                    ${Object.entries(match.matchingCriteria).map(([key, value]) => `
                        <div class="criteria-item">
                            <div class="criteria-value">${Math.round(value)}%</div>
                            <div class="criteria-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="form-actions">
                    <button class="btn btn-primary" onclick="fosterManagement.createMatchedPlacement('${match.home._id}')">
                        Create Placement
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Create matched placement
    async createMatchedPlacement(homeId) {
        const animalId = document.getElementById('matching-animal-select').value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/foster/placements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animalId,
                    fosterHomeId: homeId,
                    matchingCriteria: {
                        sizeCompatibility: 85,
                        temperamentMatch: 90,
                        experienceLevel: 80,
                        specialNeedsCapability: 75,
                        availabilityMatch: 95
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Placement created successfully!');
                this.loadPlacements();
                this.loadFosterHomes();
                this.loadDashboardStats();
            }
        } catch (error) {
            console.error('Error creating placement:', error);
            this.showError('Failed to create placement');
        }
    },

    // ==================== REPORTS ====================

    // Load performance report
    async loadPerformanceReport() {
        try {
            const response = await fetch(`${API_BASE_URL}/foster/reports/performance`);
            const data = await response.json();

            if (data.success) {
                const content = document.getElementById('report-content');
                content.innerHTML = `
                    <h3>Foster Home Performance Metrics</h3>
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>Home Number</th>
                                <th>Foster Parent</th>
                                <th>Total Placements</th>
                                <th>Adoptions</th>
                                <th>Return Rate</th>
                                <th>Avg Duration</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.data.map(home => `
                                <tr>
                                    <td>${home.homeNumber}</td>
                                    <td>${home.fosterParent}</td>
                                    <td>${home.totalPlacements}</td>
                                    <td>${home.successfulAdoptions}</td>
                                    <td>${home.returnRate}%</td>
                                    <td>${home.averagePlacementDuration || 'N/A'} days</td>
                                    <td>${'⭐'.repeat(Math.round(home.rating))}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        } catch (error) {
            console.error('Error loading performance report:', error);
            this.showError('Failed to load report');
        }
    },

    // Load placement analytics
    async loadPlacementAnalytics() {
        const content = document.getElementById('report-content');
        content.innerHTML = `
            <h3>Placement Analytics</h3>
            <p>Coming soon: Charts and graphs showing placement trends, success rates, and more.</p>
        `;
    },

    // Load monthly summary
    async loadMonthlySummary() {
        const content = document.getElementById('report-content');
        content.innerHTML = `
            <h3>Monthly Summary</h3>
            <p>Coming soon: Monthly statistics and summaries.</p>
        `;
    },

    // Load alerts report
    async loadAlertsReport() {
        const content = document.getElementById('report-content');
        content.innerHTML = `
            <h3>Active Alerts & Issues</h3>
            <p>Coming soon: List of active alerts and reported issues.</p>
        `;
    },

    // ==================== UTILITIES ====================

    // Open modal
    openModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    },

    // Close modal
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    },

    // Show success message
    showSuccess(message) {
        alert(message);
    },

    // Show error message
    showError(message) {
        alert('Error: ' + message);
    },

    // Convert to CSV
    convertToCSV(data, fields) {
        const header = fields.join(',') + '\n';
        const rows = data.map(item => {
            return fields.map(field => {
                const value = field.split('.').reduce((obj, key) => obj?.[key], item);
                return value || '';
            }).join(',');
        }).join('\n');
        return header + rows;
    },

    // Download CSV
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fosterManagement.init();
});
