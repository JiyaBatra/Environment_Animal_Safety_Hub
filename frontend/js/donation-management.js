/* ============================================
   DONATION & FUNDRAISING MANAGEMENT SCRIPT
   ============================================ */

// API Base URL
const API_BASE = 'http://localhost:3000/api/donations';

// ===== DUMMY DATA =====
const dummyData = {
    donors: [
        { id: 'DON-2024-0001', name: 'Sarah Mitchell', type: 'individual', email: 'sarah@example.com', phone: '555-0101', address: '123 Oak Street', city: 'Portland', state: 'OR', zip: '97201', segment: 'major', givingCapacity: 95, stats: { totalDonations: 12500, numberOfGifts: 5, averageGift: 2500, largestGift: 5000, donationFrequency: 'quarterly' }, preferences: { newsletter: true, events: true, anonymous: false } },
        { id: 'DON-2024-0002', name: 'John Chen', type: 'individual', email: 'john@example.com', phone: '555-0102', address: '456 Maple Ave', city: 'Seattle', state: 'WA', zip: '98101', segment: 'regular', givingCapacity: 65, stats: { totalDonations: 3200, numberOfGifts: 8, averageGift: 400, largestGift: 800, donationFrequency: 'monthly' }, preferences: { newsletter: true, events: false, anonymous: false } },
        { id: 'DON-2024-0003', name: 'Emma Rodriguez', type: 'individual', email: 'emma@example.com', phone: '555-0103', address: '789 Pine Road', city: 'San Francisco', state: 'CA', zip: '94102', segment: 'lapsed', givingCapacity: 45, stats: { totalDonations: 2000, numberOfGifts: 3, averageGift: 667, largestGift: 1000, donationFrequency: 'annual' }, preferences: { newsletter: false, events: true, anonymous: false } },
        { id: 'DON-2024-0004', name: 'TechCorp Inc', type: 'corporate', email: 'giving@techcorp.com', phone: '555-0104', address: '999 Business Blvd', city: 'San Jose', state: 'CA', zip: '95110', segment: 'major', givingCapacity: 92, stats: { totalDonations: 50000, numberOfGifts: 10, averageGift: 5000, largestGift: 15000, donationFrequency: 'quarterly' }, preferences: { newsletter: true, events: true, anonymous: false } },
        { id: 'DON-2024-0005', name: 'Wildlife Conservation Foundation', type: 'foundation', email: 'grants@wildlifeconserve.org', phone: '555-0105', address: '2000 Grant Avenue', city: 'New York', state: 'NY', zip: '10001', segment: 'major', givingCapacity: 98, stats: { totalDonations: 100000, numberOfGifts: 2, averageGift: 50000, largestGift: 75000, donationFrequency: 'annual' }, preferences: { newsletter: true, events: false, anonymous: false } },
        { id: 'DON-2024-0006', name: 'Michael Zhang', type: 'individual', email: 'michael@example.com', phone: '555-0106', address: '111 Elm Street', city: 'Boston', state: 'MA', zip: '02101', segment: 'prospect', givingCapacity: 55, stats: { totalDonations: 500, numberOfGifts: 1, averageGift: 500, largestGift: 500, donationFrequency: 'one-time' }, preferences: { newsletter: false, events: true, anonymous: false } },
        { id: 'DON-2024-0007', name: 'Patricia Johnson', type: 'individual', email: 'patricia@example.com', phone: '555-0107', address: '222 Birch Lane', city: 'Chicago', state: 'IL', zip: '60601', segment: 'regular', givingCapacity: 72, stats: { totalDonations: 4800, numberOfGifts: 12, averageGift: 400, largestGift: 600, donationFrequency: 'monthly' }, preferences: { newsletter: true, events: true, anonymous: false } },
        { id: 'DON-2024-0008', name: 'David Kim', type: 'individual', email: 'david@example.com', phone: '555-0108', address: '333 Cedar Way', city: 'Los Angeles', state: 'CA', zip: '90001', segment: 'regular', givingCapacity: 68, stats: { totalDonations: 2500, numberOfGifts: 6, averageGift: 417, largestGift: 700, donationFrequency: 'bimonthly' }, preferences: { newsletter: true, events: false, anonymous: false } },
        { id: 'DON-2024-0009', name: 'Lisa Anderson', type: 'individual', email: 'lisa@example.com', phone: '555-0109', address: '444 Spruce Drive', city: 'Austin', state: 'TX', zip: '73301', segment: 'major', givingCapacity: 88, stats: { totalDonations: 15000, numberOfGifts: 4, averageGift: 3750, largestGift: 6000, donationFrequency: 'quarterly' }, preferences: { newsletter: true, events: true, anonymous: false } },
        { id: 'DON-2024-0010', name: 'Robert Williams', type: 'individual', email: 'robert@example.com', phone: '555-0110', address: '555 Ash Court', city: 'Miami', state: 'FL', zip: '33101', segment: 'lapsed', givingCapacity: 50, stats: { totalDonations: 1500, numberOfGifts: 2, averageGift: 750, largestGift: 1000, donationFrequency: 'annual' }, preferences: { newsletter: false, events: false, anonymous: true } }
    ],
    donations: [
        { id: 'DT-2024-00001', amount: 1000, donorId: 'DON-2024-0001', type: 'general', paymentMethod: 'credit-card', status: 'completed', date: '2024-01-15', campaign: 'CAM-2024-0001' },
        { id: 'DT-2024-00002', amount: 500, donorId: 'DON-2024-0002', type: 'general', paymentMethod: 'paypal', status: 'completed', date: '2024-01-20', campaign: null },
        { id: 'DT-2024-00003', amount: 2500, donorId: 'DON-2024-0001', type: 'memorial', paymentMethod: 'check', status: 'completed', date: '2024-02-01', campaign: 'CAM-2024-0001' },
        { id: 'DT-2024-00004', amount: 250, donorId: 'DON-2024-0002', type: 'general', paymentMethod: 'credit-card', status: 'completed', date: '2024-02-05', campaign: null },
        { id: 'DT-2024-00005', amount: 5000, donorId: 'DON-2024-0004', type: 'general', paymentMethod: 'wire', status: 'completed', date: '2024-02-10', campaign: 'CAM-2024-0002' },
        { id: 'DT-2024-00006', amount: 1500, donorId: 'DON-2024-0009', type: 'tribute', paymentMethod: 'credit-card', status: 'completed', date: '2024-02-14', campaign: 'CAM-2024-0001' },
        { id: 'DT-2024-00007', amount: 750, donorId: 'DON-2024-0007', type: 'general', paymentMethod: 'paypal', status: 'completed', date: '2024-02-18', campaign: null },
        { id: 'DT-2024-00008', amount: 300, donorId: 'DON-2024-0008', type: 'general', paymentMethod: 'credit-card', status: 'completed', date: '2024-02-22', campaign: 'CAM-2024-0002' },
        { id: 'DT-2024-00009', amount: 10000, donorId: 'DON-2024-0005', type: 'general', paymentMethod: 'wire', status: 'completed', date: '2024-02-28', campaign: 'CAM-2024-0003' },
        { id: 'DT-2024-00010', amount: 400, donorId: 'DON-2024-0002', type: 'general', paymentMethod: 'credit-card', status: 'completed', date: '2024-03-05', campaign: null }
    ],
    campaigns: [
        { id: 'CAM-2024-0001', name: 'Tiger Habitat Protection', category: 'habitat-conservation', description: 'Protect and expand tiger habitats across Southeast Asia', goal: 50000, current: 28600, status: 'active', startDate: '2024-01-01', endDate: '2024-06-30', donations: 10, p2pEnabled: true },
        { id: 'CAM-2024-0002', name: 'Elephant Rescue Initiative', category: 'animal-rescue', description: 'Emergency rescue and rehabilitation of endangered elephants', goal: 75000, current: 42300, status: 'active', startDate: '2024-02-01', endDate: '2024-08-31', donations: 8, p2pEnabled: true },
        { id: 'CAM-2024-0003', name: 'Marine Conservation Fund', category: 'habitat-conservation', description: 'Protecting ocean ecosystems and marine wildlife', goal: 100000, current: 78500, status: 'active', startDate: '2024-01-15', endDate: '2024-12-31', donations: 12, p2pEnabled: true },
        { id: 'CAM-2024-0004', name: 'Wildlife Education Program', category: 'education', description: 'School programs teaching animal conservation', goal: 30000, current: 18900, status: 'active', startDate: '2024-03-01', endDate: '2024-09-30', donations: 6, p2pEnabled: false },
        { id: 'CAM-2024-0005', name: 'Veterinary Care Center', category: 'veterinary-care', description: 'Build and operate wildlife veterinary clinics', goal: 60000, current: 52400, status: 'active', startDate: '2024-02-15', endDate: '2024-08-15', donations: 9, p2pEnabled: true }
    ],
    events: [
        { id: 'EVT-2024-0001', name: 'Wildlife Gala 2024', type: 'gala', date: '2024-04-15', time: '18:00', venue: 'Grand Ballroom', city: 'San Francisco', ticketPrice: 250, ticketsAvailable: 300, ticketsSold: 187, description: 'Annual gala supporting wildlife conservation' },
        { id: 'EVT-2024-0002', name: 'Conservation Walkathon', type: 'walkathon', date: '2024-05-20', time: '08:00', venue: 'Central Park', city: 'New York', ticketPrice: 25, ticketsAvailable: 1000, ticketsSold: 643, description: '5K walk to benefit endangered species protection' },
        { id: 'EVT-2024-0003', name: 'Silent Auction Evening', type: 'auction', date: '2024-06-10', time: '19:00', venue: 'Art Gallery Downtown', city: 'Los Angeles', ticketPrice: 150, ticketsAvailable: 200, ticketsSold: 128, description: 'Auction of wildlife photography and art' }
    ],
    recurring: [
        { id: 'REC-2024-0001', donorId: 'DON-2024-0001', amount: 500, frequency: 'monthly', startDate: '2024-01-01', status: 'active', recognitionLevel: 'gold', payments: 3 },
        { id: 'REC-2024-0002', donorId: 'DON-2024-0002', amount: 100, frequency: 'monthly', startDate: '2024-01-15', status: 'active', recognitionLevel: 'silver', payments: 3 },
        { id: 'REC-2024-0003', donorId: 'DON-2024-0007', amount: 250, frequency: 'monthly', startDate: '2024-02-01', status: 'active', recognitionLevel: 'gold', payments: 2 },
        { id: 'REC-2024-0004', donorId: 'DON-2024-0008', amount: 150, frequency: 'monthly', startDate: '2024-02-15', status: 'active', recognitionLevel: 'silver', payments: 1 },
        { id: 'REC-2024-0005', donorId: 'DON-2024-0009', amount: 750, frequency: 'quarterly', startDate: '2024-01-01', status: 'active', recognitionLevel: 'platinum', payments: 1 },
        { id: 'REC-2024-0006', donorId: 'DON-2024-0004', amount: 2000, frequency: 'monthly', startDate: '2024-01-01', status: 'active', recognitionLevel: 'platinum', payments: 3 },
        { id: 'REC-2024-0007', donorId: 'DON-2024-0003', amount: 50, frequency: 'monthly', startDate: '2024-02-01', status: 'paused', recognitionLevel: 'bronze', payments: 1 },
        { id: 'REC-2024-0008', donorId: 'DON-2024-0010', amount: 200, frequency: 'quarterly', startDate: '2023-12-01', status: 'failed', recognitionLevel: 'silver', payments: 2 }
    ]
};

// ===== GLOBAL STATE =====
let currentData = {
    donors: [...dummyData.donors],
    donations: [...dummyData.donations],
    campaigns: [...dummyData.campaigns],
    events: [...dummyData.events],
    recurring: [...dummyData.recurring]
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadAllData();
});

function initializeEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Donor modal
    document.getElementById('addDonorBtn').addEventListener('click', openDonorModal);
    document.getElementById('donorForm').addEventListener('submit', handleAddDonor);
    document.getElementById('cancelDonorBtn').addEventListener('click', closeDonorModal);
    document.querySelector('#donorModal .modal-close').addEventListener('click', closeDonorModal);

    // Donation modal
    document.getElementById('newDonationBtn').addEventListener('click', openDonationModal);
    document.getElementById('donationForm').addEventListener('submit', handleAddDonation);
    document.getElementById('cancelDonationBtn').addEventListener('click', closeDonationModal);
    document.querySelector('#donationModal .modal-close').addEventListener('click', closeDonationModal);

    // Campaign modal
    document.getElementById('createCampaignBtn').addEventListener('click', openCampaignModal);
    document.getElementById('campaignForm').addEventListener('submit', handleAddCampaign);
    document.getElementById('cancelCampaignBtn').addEventListener('click', closeCampaignModal);
    document.querySelector('#campaignModal .modal-close').addEventListener('click', closeCampaignModal);

    // Event modal
    document.getElementById('createEventBtn').addEventListener('click', openEventModal);
    document.getElementById('eventForm').addEventListener('submit', handleAddEvent);
    document.getElementById('cancelEventBtn').addEventListener('click', closeEventModal);
    document.querySelector('#eventModal .modal-close').addEventListener('click', closeEventModal);

    // Recurring modal
    document.getElementById('createRecurringBtn').addEventListener('click', openRecurringModal);
    document.getElementById('recurringForm').addEventListener('submit', handleAddRecurring);
    document.getElementById('cancelRecurringBtn').addEventListener('click', closeRecurringModal);
    document.querySelector('#recurringModal .modal-close').addEventListener('click', closeRecurringModal);

    // Filters
    document.getElementById('donorSearchBox').addEventListener('input', filterDonors);
    document.getElementById('donorSegmentFilter').addEventListener('change', filterDonors);
    document.getElementById('donorTypeFilter').addEventListener('change', filterDonors);

    document.getElementById('donationSearchBox').addEventListener('input', filterDonations);
    document.getElementById('donationStatusFilter').addEventListener('change', filterDonations);
    document.getElementById('paymentMethodFilter').addEventListener('change', filterDonations);

    document.getElementById('campaignStatusFilter').addEventListener('change', filterCampaigns);
    document.getElementById('campaignSortBy').addEventListener('change', filterCampaigns);

    document.getElementById('eventStatusFilter').addEventListener('change', filterEvents);
    document.getElementById('eventTypeFilter').addEventListener('change', filterEvents);

    document.getElementById('recurringStatusFilter').addEventListener('change', filterRecurring);

    // Analytics export
    document.getElementById('exportReportBtn').addEventListener('click', exportAnalyticsReport);
}

// ===== TAB SWITCHING =====
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Load appropriate data
    if (tabName === 'analytics') {
        loadAnalytics();
    }
}

// ===== LOAD ALL DATA =====
function loadAllData() {
    loadDonors();
    loadDonations();
    loadCampaigns();
    loadEvents();
    loadRecurring();
    populateDonorSelects();
    populateCampaignSelects();
}

// ===== DONOR FUNCTIONS =====
function loadDonors() {
    const list = document.getElementById('donorsList');
    list.innerHTML = '';

    currentData.donors.forEach(donor => {
        const donorCard = document.createElement('div');
        donorCard.className = 'donor-card';
        donorCard.innerHTML = `
            <div class="donor-header">
                <h3 class="donor-name">${donor.name}</h3>
                <span class="donor-badge segment-${donor.segment}">${donor.segment}</span>
            </div>
            <div class="donor-type">${donor.type.charAt(0).toUpperCase() + donor.type.slice(1)}</div>
            <div class="donor-contact">
                <strong>Email:</strong> ${donor.email}
            </div>
            <div class="donor-contact">
                <strong>Phone:</strong> ${donor.phone}
            </div>
            <div class="donor-stats">
                <div class="stat-row">
                    <span>Total Donated:</span>
                    <strong>$${donor.stats.totalDonations.toLocaleString()}</strong>
                </div>
                <div class="stat-row">
                    <span>Number of Gifts:</span>
                    <strong>${donor.stats.numberOfGifts}</strong>
                </div>
                <div class="stat-row">
                    <span>Average Gift:</span>
                    <strong>$${donor.stats.averageGift.toLocaleString()}</strong>
                </div>
                <div class="stat-row">
                    <span>Largest Gift:</span>
                    <strong>$${donor.stats.largestGift.toLocaleString()}</strong>
                </div>
                <div class="stat-row">
                    <span>Last Donation:</span>
                    <strong>${donor.stats.donationFrequency}</strong>
                </div>
            </div>
            <div class="giving-capacity">
                <div style="display: flex; justify-content: space-between;">
                    <strong>Giving Capacity:</strong>
                    <span>${donor.givingCapacity}/100</span>
                </div>
                <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${donor.givingCapacity}%"></div>
                </div>
            </div>
            <div class="donor-actions">
                <button class="btn btn-small" onclick="editDonor('${donor.id}')">Edit</button>
                <button class="btn btn-small btn-secondary" onclick="deleteDonor('${donor.id}')">Delete</button>
            </div>
        `;
        list.appendChild(donorCard);
    });
}

function filterDonors() {
    const search = document.getElementById('donorSearchBox').value.toLowerCase();
    const segment = document.getElementById('donorSegmentFilter').value;
    const type = document.getElementById('donorTypeFilter').value;

    const filtered = currentData.donors.filter(donor => {
        const matchesSearch = donor.name.toLowerCase().includes(search) || donor.email.toLowerCase().includes(search);
        const matchesSegment = !segment || donor.segment === segment;
        const matchesType = !type || donor.type === type;
        return matchesSearch && matchesSegment && matchesType;
    });

    displayFilteredDonors(filtered);
}

function displayFilteredDonors(donors) {
    const list = document.getElementById('donorsList');
    list.innerHTML = '';
    donors.forEach(donor => {
        const donorCard = document.createElement('div');
        donorCard.className = 'donor-card';
        donorCard.innerHTML = `
            <div class="donor-header">
                <h3 class="donor-name">${donor.name}</h3>
                <span class="donor-badge segment-${donor.segment}">${donor.segment}</span>
            </div>
            <div class="donor-type">${donor.type.charAt(0).toUpperCase() + donor.type.slice(1)}</div>
            <div class="donor-contact"><strong>Email:</strong> ${donor.email}</div>
            <div class="donor-contact"><strong>Phone:</strong> ${donor.phone}</div>
            <div class="donor-stats">
                <div class="stat-row"><span>Total Donated:</span><strong>$${donor.stats.totalDonations.toLocaleString()}</strong></div>
                <div class="stat-row"><span>Gifts:</span><strong>${donor.stats.numberOfGifts}</strong></div>
                <div class="stat-row"><span>Avg Gift:</span><strong>$${donor.stats.averageGift}</strong></div>
            </div>
            <div class="giving-capacity">
                <div style="display: flex; justify-content: space-between;">
                    <strong>Giving Capacity:</strong>
                    <span>${donor.givingCapacity}/100</span>
                </div>
                <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${donor.givingCapacity}%"></div>
                </div>
            </div>
        `;
        list.appendChild(donorCard);
    });
}

function openDonorModal() {
    document.getElementById('donorModal').classList.remove('hidden');
}

function closeDonorModal() {
    document.getElementById('donorModal').classList.add('hidden');
    document.getElementById('donorForm').reset();
}

function handleAddDonor(e) {
    e.preventDefault();
    
    const newDonor = {
        id: `DON-${new Date().getFullYear()}-${String(currentData.donors.length + 1).padStart(4, '0')}`,
        name: document.getElementById('donorName').value,
        type: document.getElementById('donorType').value,
        email: document.getElementById('donorEmail').value,
        phone: document.getElementById('donorPhone').value,
        address: document.getElementById('donorAddress').value,
        city: document.getElementById('donorCity').value,
        state: document.getElementById('donorState').value,
        zip: document.getElementById('donorZip').value,
        segment: 'prospect',
        givingCapacity: 50,
        stats: { totalDonations: 0, numberOfGifts: 0, averageGift: 0, largestGift: 0, donationFrequency: 'new' },
        preferences: {
            newsletter: document.getElementById('newsLetterPref').checked,
            events: document.getElementById('eventInvPref').checked,
            anonymous: document.getElementById('anonPref').checked
        }
    };

    currentData.donors.push(newDonor);
    closeDonorModal();
    loadDonors();
    populateDonorSelects();
    alert('Donor added successfully!');
}

function deleteDonor(id) {
    if (confirm('Are you sure you want to delete this donor?')) {
        currentData.donors = currentData.donors.filter(d => d.id !== id);
        loadDonors();
    }
}

function editDonor(id) {
    alert('Edit feature would connect to API endpoint');
}

// ===== DONATION FUNCTIONS =====
function loadDonations() {
    const list = document.getElementById('donationsList');
    list.innerHTML = '';

    currentData.donations.forEach(donation => {
        const donor = currentData.donors.find(d => d.id === donation.donorId);
        const campaign = currentData.campaigns.find(c => c.id === donation.campaign);
        
        const donationItem = document.createElement('div');
        donationItem.className = 'donation-item';
        donationItem.innerHTML = `
            <div class="donation-header">
                <div>
                    <div style="font-size: 0.9rem; color: #666;">Donation ID: ${donation.id}</div>
                    <div class="donation-amount">$${donation.amount.toLocaleString()}</div>
                </div>
                <span class="donation-status status-${donation.status}">${donation.status.toUpperCase()}</span>
            </div>
            <div class="donation-details">
                <div class="donation-detail-item">
                    <strong>Donor:</strong>
                    ${donor ? donor.name : 'Unknown'}
                </div>
                <div class="donation-detail-item">
                    <strong>Type:</strong>
                    ${donation.type.charAt(0).toUpperCase() + donation.type.slice(1)}
                </div>
                <div class="donation-detail-item">
                    <strong>Payment Method:</strong>
                    ${donation.paymentMethod.replace('-', ' ').toUpperCase()}
                </div>
                <div class="donation-detail-item">
                    <strong>Date:</strong>
                    ${new Date(donation.date).toLocaleDateString()}
                </div>
                <div class="donation-detail-item">
                    <strong>Campaign:</strong>
                    ${campaign ? campaign.name : 'General Fund'}
                </div>
                <div class="donation-detail-item">
                    <strong>Tax Deductible:</strong>
                    Yes
                </div>
            </div>
        `;
        list.appendChild(donationItem);
    });
}

function filterDonations() {
    const search = document.getElementById('donationSearchBox').value.toLowerCase();
    const status = document.getElementById('donationStatusFilter').value;
    const method = document.getElementById('paymentMethodFilter').value;

    const filtered = currentData.donations.filter(donation => {
        const donor = currentData.donors.find(d => d.id === donation.donorId);
        const matchesSearch = donation.id.toLowerCase().includes(search) || (donor && donor.name.toLowerCase().includes(search));
        const matchesStatus = !status || donation.status === status;
        const matchesMethod = !method || donation.paymentMethod === method;
        return matchesSearch && matchesStatus && matchesMethod;
    });

    displayFilteredDonations(filtered);
}

function displayFilteredDonations(donations) {
    const list = document.getElementById('donationsList');
    list.innerHTML = '';
    donations.forEach(donation => {
        const donor = currentData.donors.find(d => d.id === donation.donorId);
        const donationItem = document.createElement('div');
        donationItem.className = 'donation-item';
        donationItem.innerHTML = `
            <div class="donation-header">
                <div>
                    <div style="font-size: 0.9rem; color: #666;">${donation.id}</div>
                    <div class="donation-amount">$${donation.amount.toLocaleString()}</div>
                </div>
                <span class="donation-status status-${donation.status}">${donation.status.toUpperCase()}</span>
            </div>
            <div class="donation-details">
                <div class="donation-detail-item"><strong>Donor:</strong> ${donor ? donor.name : 'Unknown'}</div>
                <div class="donation-detail-item"><strong>Type:</strong> ${donation.type}</div>
                <div class="donation-detail-item"><strong>Method:</strong> ${donation.paymentMethod}</div>
                <div class="donation-detail-item"><strong>Date:</strong> ${new Date(donation.date).toLocaleDateString()}</div>
            </div>
        `;
        list.appendChild(donationItem);
    });
}

function openDonationModal() {
    document.getElementById('donationModal').classList.remove('hidden');
}

function closeDonationModal() {
    document.getElementById('donationModal').classList.add('hidden');
    document.getElementById('donationForm').reset();
}

function handlePaymentMethodChange() {
    // Can add payment method-specific logic here
}

function handleAddDonation(e) {
    e.preventDefault();
    
    const newDonation = {
        id: `DT-${new Date().getFullYear()}-${String(currentData.donations.length + 1).padStart(5, '0')}`,
        amount: parseFloat(document.getElementById('donationAmount').value),
        donorId: document.getElementById('donationDonor').value,
        type: document.getElementById('donationType').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        status: 'completed',
        date: document.getElementById('donationDate').value,
        campaign: document.getElementById('associatedCampaign').value || null
    };

    if (newDonation.campaign) {
        const campaign = currentData.campaigns.find(c => c.id === newDonation.campaign);
        if (campaign) {
            campaign.current += newDonation.amount;
            campaign.donations++;
        }
    }

    const donor = currentData.donors.find(d => d.id === newDonation.donorId);
    if (donor) {
        donor.stats.totalDonations += newDonation.amount;
        donor.stats.numberOfGifts++;
        donor.stats.averageGift = Math.round(donor.stats.totalDonations / donor.stats.numberOfGifts);
        donor.stats.largestGift = Math.max(donor.stats.largestGift, newDonation.amount);
    }

    currentData.donations.push(newDonation);
    closeDonationModal();
    loadDonations();
    loadCampaigns();
    populateDonorSelects();
    alert('Donation recorded successfully!');
}

// ===== CAMPAIGN FUNCTIONS =====
function loadCampaigns() {
    const grid = document.getElementById('campaignsList');
    grid.innerHTML = '';

    currentData.campaigns.forEach(campaign => {
        const progress = Math.round((campaign.current / campaign.goal) * 100);
        const daysRemaining = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

        const campaignCard = document.createElement('div');
        campaignCard.className = 'campaign-card';
        campaignCard.innerHTML = `
            <div class="campaign-content">
                <h3 class="campaign-name">${campaign.name}</h3>
                <span class="campaign-category">${campaign.category.replace('-', ' ').toUpperCase()}</span>
                <p class="campaign-description">${campaign.description}</p>
                
                <div class="thermometer-container">
                    <div class="thermometer-header">
                        <strong>Progress</strong>
                        <span class="thermometer-percentage">${progress}%</span>
                    </div>
                    <div class="thermometer-bar">
                        <div class="thermometer-fill ${progress >= 100 ? 'full' : ''}" style="width: ${Math.min(progress, 100)}%">
                            ${progress > 10 ? `<span class="thermometer-text">${progress}%</span>` : ''}
                        </div>
                    </div>
                </div>

                <div style="margin: 1rem 0; font-size: 0.9rem; color: #666;">
                    <strong>$${campaign.current.toLocaleString()} of $${campaign.goal.toLocaleString()}</strong>
                </div>

                <div class="campaign-dates">
                    📅 ${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}
                    <br>⏱️ ${daysRemaining > 0 ? daysRemaining + ' days remaining' : 'Campaign ended'}
                </div>
            </div>
            <div class="campaign-stats">
                <div class="campaign-stat">
                    <div class="campaign-stat-value">$${campaign.current.toLocaleString()}</div>
                    <div class="campaign-stat-label">Raised</div>
                </div>
                <div class="campaign-stat">
                    <div class="campaign-stat-value">${campaign.donations}</div>
                    <div class="campaign-stat-label">Donations</div>
                </div>
                <div class="campaign-stat">
                    <div class="campaign-stat-value">${progress}%</div>
                    <div class="campaign-stat-label">Complete</div>
                </div>
            </div>
            <div class="campaign-actions">
                <button class="btn btn-small">Edit</button>
                <button class="btn btn-small btn-secondary">View Details</button>
            </div>
        `;
        grid.appendChild(campaignCard);
    });
}

function filterCampaigns() {
    const status = document.getElementById('campaignStatusFilter').value;
    const sortBy = document.getElementById('campaignSortBy').value;

    let filtered = currentData.campaigns.filter(c => !status || c.status === status);

    if (sortBy === 'progress') {
        filtered.sort((a, b) => (b.current / b.goal) - (a.current / a.goal));
    } else if (sortBy === 'goal') {
        filtered.sort((a, b) => b.goal - a.goal);
    } else {
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }

    displayFilteredCampaigns(filtered);
}

function displayFilteredCampaigns(campaigns) {
    const grid = document.getElementById('campaignsList');
    grid.innerHTML = '';
    campaigns.forEach(campaign => {
        const progress = Math.round((campaign.current / campaign.goal) * 100);
        const campaignCard = document.createElement('div');
        campaignCard.className = 'campaign-card';
        campaignCard.innerHTML = `
            <div class="campaign-content">
                <h3 class="campaign-name">${campaign.name}</h3>
                <span class="campaign-category">${campaign.category.replace('-', ' ')}</span>
                <div class="thermometer-container">
                    <div class="thermometer-header">
                        <strong>Progress</strong>
                        <span class="thermometer-percentage">${progress}%</span>
                    </div>
                    <div class="thermometer-bar">
                        <div class="thermometer-fill ${progress >= 100 ? 'full' : ''}" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                </div>
                <div style="margin: 1rem 0;">$${campaign.current.toLocaleString()} / $${campaign.goal.toLocaleString()}</div>
            </div>
            <div class="campaign-stats">
                <div class="campaign-stat">
                    <div class="campaign-stat-value">${campaign.donations}</div>
                    <div class="campaign-stat-label">Donations</div>
                </div>
                <div class="campaign-stat">
                    <div class="campaign-stat-value">${progress}%</div>
                    <div class="campaign-stat-label">Complete</div>
                </div>
            </div>
        `;
        grid.appendChild(campaignCard);
    });
}

function openCampaignModal() {
    document.getElementById('campaignModal').classList.remove('hidden');
}

function closeCampaignModal() {
    document.getElementById('campaignModal').classList.add('hidden');
    document.getElementById('campaignForm').reset();
}

function handleAddCampaign(e) {
    e.preventDefault();
    
    const newCampaign = {
        id: `CAM-${new Date().getFullYear()}-${String(currentData.campaigns.length + 1).padStart(4, '0')}`,
        name: document.getElementById('campaignName').value,
        category: document.getElementById('campaignCategory').value,
        description: document.getElementById('campaignDescription').value,
        goal: parseFloat(document.getElementById('campaignGoal').value),
        current: 0,
        status: 'draft',
        startDate: document.getElementById('campaignStart').value,
        endDate: document.getElementById('campaignEnd').value,
        donations: 0,
        p2pEnabled: document.getElementById('p2pEnabled').checked
    };

    currentData.campaigns.push(newCampaign);
    closeCampaignModal();
    loadCampaigns();
    populateCampaignSelects();
    alert('Campaign created successfully!');
}

// ===== EVENT FUNCTIONS =====
function loadEvents() {
    const grid = document.getElementById('eventsList');
    grid.innerHTML = '';

    currentData.events.forEach(event => {
        const capacity = Math.round((event.ticketsSold / event.ticketsAvailable) * 100);
        const eventDate = new Date(event.date);

        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-header">
                <div class="event-date">${eventDate.getDate()}</div>
                <div class="event-month">${eventDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                <h3 class="event-name">${event.name}</h3>
                <span class="event-type-badge">${event.type.toUpperCase()}</span>
            </div>
            <div class="event-content">
                <div class="event-venue">📍 ${event.venue}, ${event.city}</div>
                <p class="event-description">${event.description}</p>
                
                <div class="event-metrics">
                    <div class="metric">
                        <div class="metric-value">$${(event.ticketPrice * event.ticketsSold).toLocaleString()}</div>
                        <div class="metric-label">Revenue</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${event.ticketsSold}/${event.ticketsAvailable}</div>
                        <div class="metric-label">Tickets</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${capacity}%</div>
                        <div class="metric-label">Capacity</div>
                    </div>
                </div>
            </div>
            <div class="event-actions">
                <button class="btn btn-small" onclick="registerForEvent('${event.id}')">Register</button>
                <button class="btn btn-small btn-secondary">View Event</button>
            </div>
        `;
        grid.appendChild(eventCard);
    });
}

function filterEvents() {
    const status = document.getElementById('eventStatusFilter').value;
    const type = document.getElementById('eventTypeFilter').value;

    const filtered = currentData.events.filter(event => {
        const matchesStatus = !status || event.status === status;
        const matchesType = !type || event.type === type;
        return matchesStatus && matchesType;
    });

    displayFilteredEvents(filtered);
}

function displayFilteredEvents(events) {
    const grid = document.getElementById('eventsList');
    grid.innerHTML = '';
    events.forEach(event => {
        const capacity = Math.round((event.ticketsSold / event.ticketsAvailable) * 100);
        const eventDate = new Date(event.date);

        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-header">
                <div class="event-date">${eventDate.getDate()}</div>
                <div class="event-month">${eventDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                <h3 class="event-name">${event.name}</h3>
            </div>
            <div class="event-content">
                <div class="event-venue">📍 ${event.venue}, ${event.city}</div>
                <div class="event-metrics">
                    <div class="metric">
                        <div class="metric-value">${event.ticketsSold}</div>
                        <div class="metric-label">Registered</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${capacity}%</div>
                        <div class="metric-label">Capacity</div>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(eventCard);
    });
}

function openEventModal() {
    document.getElementById('eventModal').classList.remove('hidden');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.add('hidden');
    document.getElementById('eventForm').reset();
}

function handleAddEvent(e) {
    e.preventDefault();
    
    const newEvent = {
        id: `EVT-${new Date().getFullYear()}-${String(currentData.events.length + 1).padStart(4, '0')}`,
        name: document.getElementById('eventName').value,
        type: document.getElementById('eventType').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventStartTime').value,
        venue: document.getElementById('eventVenue').value,
        city: document.getElementById('eventCity').value,
        ticketPrice: parseFloat(document.getElementById('ticketPrice').value),
        ticketsAvailable: parseInt(document.getElementById('ticketsAvailable').value),
        ticketsSold: 0,
        description: document.getElementById('eventDescription').value
    };

    currentData.events.push(newEvent);
    closeEventModal();
    loadEvents();
    alert('Event created successfully!');
}

function registerForEvent(eventId) {
    alert('Event registration would connect to API');
}

// ===== RECURRING DONATION FUNCTIONS =====
function loadRecurring() {
    const list = document.getElementById('recurringList');
    list.innerHTML = '';

    currentData.recurring.forEach(rec => {
        const donor = currentData.donors.find(d => d.id === rec.donorId);
        const annualAmount = rec.frequency === 'monthly' ? rec.amount * 12 : 
                            rec.frequency === 'quarterly' ? rec.amount * 4 : rec.amount;

        const recurringItem = document.createElement('div');
        recurringItem.className = 'recurring-item';
        recurringItem.innerHTML = `
            <div class="recurring-header">
                <div>
                    <div class="sustainer-name">${donor ? donor.name : 'Unknown'}</div>
                    <div class="recurring-schedule">
                        <strong>$${rec.amount}/month</strong> • ${rec.frequency} • Started: ${new Date(rec.startDate).toLocaleDateString()}
                    </div>
                </div>
                <span class="sustainer-badge badge-${rec.status}">${rec.status.toUpperCase()}</span>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <span class="recognition-level">🏆 ${rec.recognitionLevel.toUpperCase()}</span>
                <span style="color: #27ae60; font-weight: 600;">Annual: $${annualAmount.toLocaleString()}</span>
            </div>

            <div class="recurring-details">
                <div class="recurring-detail-row">
                    <span>Payments Received:</span>
                    <strong>${rec.payments}</strong>
                </div>
                <div class="recurring-detail-row">
                    <span>Total Lifetime Value:</span>
                    <strong>$${(rec.payments * rec.amount).toLocaleString()}</strong>
                </div>
                <div class="recurring-detail-row">
                    <span>Next Payment Due:</span>
                    <strong>Next month</strong>
                </div>
            </div>

            <div class="recurring-actions">
                <button class="btn btn-small" onclick="updateRecurringAmount('${rec.id}')">Update Amount</button>
                <button class="btn btn-small" onclick="toggleRecurringStatus('${rec.id}', '${rec.status}')">
                    ${rec.status === 'active' ? 'Pause' : 'Resume'}
                </button>
                <button class="btn btn-small btn-secondary" onclick="cancelRecurring('${rec.id}')">Cancel</button>
            </div>
        `;
        list.appendChild(recurringItem);
    });
}

function filterRecurring() {
    const status = document.getElementById('recurringStatusFilter').value;

    const filtered = currentData.recurring.filter(r => !status || r.status === status);
    displayFilteredRecurring(filtered);
}

function displayFilteredRecurring(recurring) {
    const list = document.getElementById('recurringList');
    list.innerHTML = '';
    recurring.forEach(rec => {
        const donor = currentData.donors.find(d => d.id === rec.donorId);
        const recurringItem = document.createElement('div');
        recurringItem.className = 'recurring-item';
        recurringItem.innerHTML = `
            <div class="recurring-header">
                <div class="sustainer-name">${donor ? donor.name : 'Unknown'}</div>
                <span class="sustainer-badge badge-${rec.status}">${rec.status}</span>
            </div>
            <div class="recurring-schedule">$${rec.amount}/${rec.frequency}</div>
            <span class="recognition-level">${rec.recognitionLevel}</span>
        `;
        list.appendChild(recurringItem);
    });
}

function openRecurringModal() {
    document.getElementById('recurringModal').classList.remove('hidden');
}

function closeRecurringModal() {
    document.getElementById('recurringModal').classList.add('hidden');
    document.getElementById('recurringForm').reset();
}

function handleAddRecurring(e) {
    e.preventDefault();
    
    const newRecurring = {
        id: `REC-${new Date().getFullYear()}-${String(currentData.recurring.length + 1).padStart(4, '0')}`,
        donorId: document.getElementById('recurringDonor').value,
        amount: parseFloat(document.getElementById('sustainerAmount').value),
        frequency: document.getElementById('sustainerFrequency').value,
        startDate: document.getElementById('sustainerStartDate').value,
        status: 'active',
        recognitionLevel: 'silver',
        payments: 0
    };

    currentData.recurring.push(newRecurring);
    closeRecurringModal();
    loadRecurring();
    alert('Monthly sustainer created successfully!');
}

function updateRecurringAmount(id) {
    const recurring = currentData.recurring.find(r => r.id === id);
    const newAmount = prompt('Enter new monthly amount:', recurring.amount);
    if (newAmount && newAmount > 0) {
        recurring.amount = parseFloat(newAmount);
        loadRecurring();
    }
}

function toggleRecurringStatus(id, currentStatus) {
    const recurring = currentData.recurring.find(r => r.id === id);
    recurring.status = currentStatus === 'active' ? 'paused' : 'active';
    loadRecurring();
}

function cancelRecurring(id) {
    if (confirm('Cancel this recurring donation?')) {
        const recurring = currentData.recurring.find(r => r.id === id);
        recurring.status = 'cancelled';
        loadRecurring();
    }
}

// ===== ANALYTICS FUNCTIONS =====
function loadAnalytics() {
    // Calculate stats
    const totalDonors = currentData.donors.length;
    const totalAmount = currentData.donations.reduce((sum, d) => sum + d.amount, 0);
    const totalDonationCount = currentData.donations.length;
    const averageGift = totalDonationCount > 0 ? Math.round(totalAmount / totalDonationCount) : 0;

    document.getElementById('totalDonors').textContent = totalDonors;
    document.getElementById('totalDonationAmount').textContent = `$${totalAmount.toLocaleString()}`;
    document.getElementById('totalDonationCount').textContent = totalDonationCount;
    document.getElementById('averageGift').textContent = `$${averageGift.toLocaleString()}`;

    // Donor segment breakdown
    const segmentBreakdown = {};
    currentData.donors.forEach(donor => {
        segmentBreakdown[donor.segment] = (segmentBreakdown[donor.segment] || 0) + 1;
    });

    const chartContainer = document.getElementById('donorSegmentChart');
    chartContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">' +
        Object.entries(segmentBreakdown).map(([segment, count]) => 
            `<div style="margin: 0.5rem 0;"><strong>${segment}:</strong> ${count} donors</div>`
        ).join('') +
    '</div>';

    // Campaign performance
    const tbody = document.getElementById('campaignPerformanceBody');
    tbody.innerHTML = '';
    currentData.campaigns.filter(c => c.status === 'active').forEach(campaign => {
        const progress = Math.round((campaign.current / campaign.goal) * 100);
        const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${campaign.name}</strong></td>
            <td>$${campaign.goal.toLocaleString()}</td>
            <td>$${campaign.current.toLocaleString()}</td>
            <td><div class="progress-bar-small"><div class="progress-fill-small" style="width: ${progress}%"></div></div></td>
            <td>${campaign.donations}</td>
            <td>${daysLeft > 0 ? daysLeft + ' days' : 'Ended'}</td>
        `;
        tbody.appendChild(row);
    });

    // Top donors
    const topDonors = currentData.donors.sort((a, b) => b.stats.totalDonations - a.stats.totalDonations).slice(0, 10);
    const topDonorsBody = document.getElementById('topDonorsBody');
    topDonorsBody.innerHTML = '';
    topDonors.forEach((donor, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${donor.name}</strong></td>
            <td>$${donor.stats.totalDonations.toLocaleString()}</td>
            <td>${donor.stats.numberOfGifts}</td>
            <td><span class="donor-badge segment-${donor.segment}">${donor.segment}</span></td>
        `;
        topDonorsBody.appendChild(row);
    });

    // Monthly sustainers
    const activeSustainers = currentData.recurring.filter(r => r.status === 'active').length;
    const totalMonthlyGiving = currentData.recurring.filter(r => r.status === 'active' && r.frequency === 'monthly')
        .reduce((sum, r) => sum + r.amount, 0);
    
    document.getElementById('monthlySustainers').innerHTML = `
        <div class="sustainer-card">
            <strong>Active Sustainers</strong>
            <span>${activeSustainers}</span>
        </div>
        <div class="sustainer-card">
            <strong>Monthly Committed</strong>
            <span>$${totalMonthlyGiving.toLocaleString()}</span>
        </div>
        <div class="sustainer-card">
            <strong>Annual Committed</strong>
            <span>$${(totalMonthlyGiving * 12).toLocaleString()}</span>
        </div>
    `;
}

// ===== EXPORT REPORT =====
function exportAnalyticsReport() {
    let csv = 'Donation Analytics Report\n';
    csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;

    // Summary stats
    const totalAmount = currentData.donations.reduce((sum, d) => sum + d.amount, 0);
    csv += `Total Donors,${currentData.donors.length}\n`;
    csv += `Total Raised,$${totalAmount}\n`;
    csv += `Total Donations,${currentData.donations.length}\n\n`;

    // Donors
    csv += 'DONORS REPORT\n';
    csv += 'Name,Type,Email,Total Donated,Gifts,Segment\n';
    currentData.donors.forEach(donor => {
        csv += `"${donor.name}","${donor.type}","${donor.email}",${donor.stats.totalDonations},${donor.stats.numberOfGifts},"${donor.segment}"\n`;
    });

    csv += '\n\nCOMPAIGNS REPORT\n';
    csv += 'Name,Goal,Current,Progress %,Donations\n';
    currentData.campaigns.forEach(campaign => {
        const progress = Math.round((campaign.current / campaign.goal) * 100);
        csv += `"${campaign.name}",${campaign.goal},${campaign.current},${progress},${campaign.donations}\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ===== POPULATE SELECTS =====
function populateDonorSelects() {
    const selects = document.getElementById('donationDonor');
    selects.innerHTML = '<option value="">Select Donor</option>';
    currentData.donors.forEach(donor => {
        const option = document.createElement('option');
        option.value = donor.id;
        option.textContent = donor.name;
        selects.appendChild(option);
    });

    const recurringSelect = document.getElementById('recurringDonor');
    recurringSelect.innerHTML = '<option value="">Select Donor</option>';
    currentData.donors.forEach(donor => {
        const option = document.createElement('option');
        option.value = donor.id;
        option.textContent = donor.name;
        recurringSelect.appendChild(option);
    });
}

function populateCampaignSelects() {
    const select = document.getElementById('associatedCampaign');
    select.innerHTML = '<option value="">No Campaign</option>';
    currentData.campaigns.forEach(campaign => {
        const option = document.createElement('option');
        option.value = campaign.id;
        option.textContent = campaign.name;
        select.appendChild(option);
    });
}

// Set default date to today
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('donationDate').value = today;
});
