/**
 * P2P Fundraising - Personal Campaign JavaScript Handler
 */

class PersonalFundraiser {
    constructor() {
        this.campaign = {
            id: null,
            title: 'Save the Amazon Rainforest',
            fundraiser: 'John Smith',
            goal: 50000,
            raised: 28500,
            donors: 145,
            startDate: '2024-01-15',
            endDate: '2024-03-15',
            story: 'The Amazon rainforest is disappearing at an alarming rate...',
            image: 'https://via.placeholder.com/800x400',
            team: [],
            milestones: [
                { amount: 10000, reached: true, date: '2024-01-20' },
                { amount: 25000, reached: true, date: '2024-02-10' },
                { amount: 40000, reached: false, date: null },
                { amount: 50000, reached: false, date: null }
            ],
            donors: [],
            updates: []
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCampaign();
    }

    setupEventListeners() {
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Donate button
        const donateBtn = document.querySelector('[data-action="donate"]');
        if (donateBtn) {
            donateBtn.addEventListener('click', () => this.showDonateModal());
        }

        // Share button
        const shareBtn = document.querySelector('[data-action="share"]');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.showShareModal());
        }

        // Edit button
        const editBtn = document.querySelector('[data-action="edit"]');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.showEditModal());
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        const selectedTab = document.querySelector(`[data-tab-content="${tabName}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Add active class to clicked button
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Load tab content
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        switch(tabName) {
            case 'about':
                this.renderAboutTab();
                break;
            case 'donors':
                this.renderDonorsTab();
                break;
            case 'team':
                this.renderTeamTab();
                break;
            case 'impact':
                this.renderImpactTab();
                break;
            case 'matching':
                this.renderMatchingTab();
                break;
        }
    }

    renderCampaign() {
        const container = document.querySelector('.campaign-info-section');
        if (!container) return;

        const progressPercent = (this.campaign.raised / this.campaign.goal) * 100;

        container.querySelector('h1').textContent = this.campaign.title;
        container.querySelector('.campaign-subtitle').innerHTML = `
            Led by <strong>${this.campaign.fundraiser}</strong>
        `;

        // Update meta info
        const metaContainer = container.querySelector('.campaign-meta');
        metaContainer.innerHTML = `
            <div class="meta-item">📅 ${this.formatDate(this.campaign.startDate)} - ${this.formatDate(this.campaign.endDate)}</div>
            <div class="meta-item">💰 Raised: $${this.formatCurrency(this.campaign.raised)} of $${this.formatCurrency(this.campaign.goal)}</div>
            <div class="meta-item">👥 ${this.campaign.donors} Donors</div>
        `;

        // Update thermometer
        const progressSection = document.querySelector('.progress-section');
        const thermometerFill = progressSection.querySelector('.thermometer-fill');
        thermometerFill.style.height = `${progressPercent}%`;

        // Update stats
        const statsBox = document.querySelector('.progress-stats');
        statsBox.innerHTML = `
            <div class="stat-box">
                <div class="stat-value">$${this.formatCurrency(this.campaign.raised)}</div>
                <div class="stat-label">Raised</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${progressPercent.toFixed(0)}%</div>
                <div class="stat-label">Progress</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${this.campaign.donors}</div>
                <div class="stat-label">Donors</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${this.daysRemaining(this.campaign.endDate)}</div>
                <div class="stat-label">Days Left</div>
            </div>
        `;

        // Update milestones
        this.renderMilestones();
    }

    renderMilestones() {
        const milestonesContainer = document.querySelector('.milestones-list');
        if (!milestonesContainer) return;

        milestonesContainer.innerHTML = this.campaign.milestones.map(m => `
            <div class="milestone-item ${m.reached ? 'completed' : ''}">
                <div class="milestone-check">${m.reached ? '✓' : ''}</div>
                <div class="milestone-text">
                    <div><strong>$${this.formatCurrency(m.amount)}</strong></div>
                    ${m.reached ? `<div class="milestone-date">Reached ${this.formatDate(m.date)}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    renderAboutTab() {
        const tabContent = document.querySelector('[data-tab-content="about"]');
        if (tabContent) {
            tabContent.innerHTML = `
                <div class="content-card">
                    <h2>Campaign Story</h2>
                    <div class="story-text">
                        <p>${this.campaign.story}</p>
                        <p>Every dollar raised will directly support conservation efforts, research, and local community programs.</p>
                        <p>Join us in making a difference!</p>
                    </div>
                </div>
            `;
        }
    }

    renderDonorsTab() {
        const tabContent = document.querySelector('[data-tab-content="donors"]');
        if (!tabContent) return;

        const donors = [
            { name: 'Sarah Johnson', amount: 500, date: '2024-02-15' },
            { name: 'Michael Chen', amount: 250, date: '2024-02-14' },
            { name: 'Emma Wilson', amount: 100, date: '2024-02-13' },
            { name: 'David Martinez', amount: 1000, date: '2024-02-12' }
        ];

        tabContent.innerHTML = `
            <div class="content-card">
                <h2>Recent Donors (${donors.length}+)</h2>
                <div class="donors-list">
                    ${donors.map(d => `
                        <div class="donor-card">
                            <div class="donor-avatar">${d.name.charAt(0)}</div>
                            <div class="donor-info">
                                <div class="donor-name">${d.name}</div>
                                <div class="donor-date">${this.formatDate(d.date)}</div>
                            </div>
                            <div class="donor-amount">$${this.formatCurrency(d.amount)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderTeamTab() {
        const tabContent = document.querySelector('[data-tab-content="team"]');
        if (!tabContent) return;

        const team = [
            { name: 'John Smith', raised: 28500, goal: 30000, donors: 145 },
            { name: 'Jane Doe', raised: 5200, goal: 10000, donors: 28 },
            { name: 'Bob Wilson', raised: 3100, goal: 5000, donors: 18 }
        ];

        tabContent.innerHTML = `
            <div class="content-card">
                <h2>Team Members</h2>
                <div class="team-list">
                    ${team.map(m => `
                        <div class="team-member-card">
                            <div class="team-member-info">
                                <div><strong>${m.name}</strong></div>
                                <div style="color: #999; font-size: 0.9rem;">Raised $${this.formatCurrency(m.raised)}</div>
                            </div>
                            <div class="team-member-stats">
                                <div style="text-align: center;">
                                    <div style="font-weight: bold; color: #4CAF50;">$${this.formatCurrency(m.raised)}/$${this.formatCurrency(m.goal)}</div>
                                    <div style="font-size: 0.85rem; color: #999;">${m.donors} donors</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderImpactTab() {
        const tabContent = document.querySelector('[data-tab-content="impact"]');
        if (!tabContent) return;

        tabContent.innerHTML = `
            <div class="content-card">
                <h2>Campaign Impact</h2>
                <div style="margin: 2rem 0;">
                    <h3>What Your Donation Supports</h3>
                    <ul style="line-height: 2; color: #555;">
                        <li>🌱 Acre Reforestation: $25 plants 100 trees</li>
                        <li>🦁 Wildlife Protection: $50 protects 1 animal</li>
                        <li>👥 Community Education: $100 funds training programs</li>
                        <li>📊 Research & Monitoring: $250 supports field studies</li>
                    </ul>
                </div>
            </div>
        `;
    }

    renderMatchingTab() {
        const tabContent = document.querySelector('[data-tab-content="matching"]');
        if (!tabContent) return;

        tabContent.innerHTML = `
            <div class="content-card">
                <h2>Employer Matching Gifts</h2>
                <p>Have your donation matched by your employer! Many companies offer matching gift programs to double your impact.</p>
                <div style="margin: 1.5rem 0; padding: 1.5rem; background: #e8f5e9; border-radius: 8px;">
                    <strong>Did you know?</strong> Over 30% of our donors doubled their impact through employer matching.
                </div>
                <button class="btn" style="width: 100%;" onclick="window.location.href='/matching-gifts.html'">
                    Browse Matching Gift Companies
                </button>
            </div>
        `;
    }

    showDonateModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Make a Donation</h2>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 1.5rem;">
                        <label><strong>Donation Amount</strong></label>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 0.5rem;">
                            <button class="filter-btn" data-amount="25">$25</button>
                            <button class="filter-btn" data-amount="50">$50</button>
                            <button class="filter-btn" data-amount="100">$100</button>
                            <button class="filter-btn" data-amount="250">$250</button>
                            <button class="filter-btn" data-amount="500">$500</button>
                            <button class="filter-btn" data-amount="1000">$1000</button>
                        </div>
                        <input type="number" placeholder="Custom Amount" min="1" style="width: 100%; padding: 0.75rem; margin-top: 1rem; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    <div class="modal-actions">
                        <button class="btn" style="flex: 1;">Continue to Payment →</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    showShareModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Share This Campaign</h2>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                        <button class="btn" style="background: #1877F2;">📘 Facebook</button>
                        <button class="btn" style="background: #1DA1F2;">𝕏 Twitter</button>
                        <button class="btn" style="background: #0A66C2;">💼 LinkedIn</button>
                        <button class="btn" style="background: #E1306C;">📷 Instagram</button>
                    </div>
                    <div style="margin-top: 1.5rem;">
                        <label><strong>Copy Link</strong></label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" value="https://ewoc.org/fundraiser/123" readonly style="flex: 1; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;">
                            <button class="btn" onclick="this.previousElementSibling.select(); document.execCommand('copy'); alert('Copied!')">Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    }

    showEditModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>Edit Campaign</h2>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 1.5rem;">
                        <label><strong>Campaign Title</strong></label>
                        <input type="text" value="${this.campaign.title}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label><strong>Goal Amount</strong></label>
                        <input type="number" value="${this.campaign.goal}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label><strong>Campaign Story</strong></label>
                        <textarea style="width: 100%; height: 150px; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-family: inherit;">${this.campaign.story}</textarea>
                    </div>
                    <div class="modal-actions">
                        <button class="btn" style="flex: 1;">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    }

    formatCurrency(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 0 });
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    daysRemaining(endDate) {
        const today = new Date();
        const end = new Date(endDate);
        const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new PersonalFundraiser();
});
