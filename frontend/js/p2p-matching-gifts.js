/**
 * Matching Gift Directory JavaScript Handler
 */

class MatchingGiftDirectory {
    constructor() {
        this.companies = this.generateCompanyData();
        this.filteredCompanies = this.companies;
        this.init();
    }

    generateCompanyData() {
        const companies = [
            { id: 1, name: 'Google', category: 'Technology', logo: '🔍', matchRatio: '2:1', maxAnnual: '$5000', minDonation: '$25', verified: true },
            { id: 2, name: 'Microsoft', category: 'Technology', logo: '💻', matchRatio: '1:1', maxAnnual: '$3000', minDonation: '$50', verified: true },
            { id: 3, name: 'Apple', category: 'Technology', logo: '🍎', matchRatio: '2:1', maxAnnual: '$4000', minDonation: '$100', verified: true },
            { id: 4, name: 'Goldman Sachs', category: 'Finance', logo: '💰', matchRatio: '1:1', maxAnnual: '$2500', minDonation: '$50', verified: true },
            { id: 5, name: 'JP Morgan', category: 'Finance', logo: '🏦', matchRatio: '3:1', maxAnnual: '$5000', minDonation: '$25', verified: true },
            { id: 6, name: 'Pfizer', category: 'Healthcare', logo: '⚕️', matchRatio: '2:1', maxAnnual: '$3500', minDonation: '$100', verified: true },
            { id: 7, name: 'Johnson & Johnson', category: 'Healthcare', logo: '🏥', matchRatio: '1:1', maxAnnual: '$3000', minDonation: '$50', verified: true },
            { id: 8, name: 'Walmart', category: 'Retail', logo: '🛒', matchRatio: '1:1', maxAnnual: '$2000', minDonation: '$50', verified: true },
            { id: 9, name: 'Amazon', category: 'Technology', logo: '📦', matchRatio: '1:1', maxAnnual: '$2500', minDonation: '$100', verified: true },
            { id: 10, name: 'Meta', category: 'Technology', logo: '📱', matchRatio: '2:1', maxAnnual: '$4000', minDonation: '$50', verified: true }
        ];
        return companies;
    }

    init() {
        this.renderStats();
        this.renderCompanies();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e.target.textContent));
        });

        // Company card clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.company-card-btn')) {
                const card = e.target.closest('.company-card');
                const companyId = card.dataset.companyId;
                this.showCompanyModal(companyId);
            }
        });
    }

    renderStats() {
        const statsContainer = document.querySelector('.matching-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat">
                    <span class="stat-number">500+</span>
                    <span class="stat-label">Companies</span>
                </div>
                <div class="stat">
                    <span class="stat-number">2:1</span>
                    <span class="stat-label">Avg Match Ratio</span>
                </div>
                <div class="stat">
                    <span class="stat-number">$1M+</span>
                    <span class="stat-label">Matched in 2023</span>
                </div>
            `;
        }
    }

    renderCompanies() {
        const companiesList = document.querySelector('.companies-list');
        if (!companiesList) return;

        companiesList.innerHTML = this.filteredCompanies.map(company => `
            <div class="company-card" data-company-id="${company.id}">
                <div class="company-logo">${company.logo}</div>
                <div class="company-name">${company.name}</div>
                <div class="company-category">${company.category}</div>
                <div class="company-match-info">
                    <div class="match-stat">
                        <div class="match-stat-value">${company.matchRatio}</div>
                        <div class="match-stat-label">Match Ratio</div>
                    </div>
                    <div class="match-stat">
                        <div class="match-stat-value">${company.maxAnnual}</div>
                        <div class="match-stat-label">Max Annual</div>
                    </div>
                </div>
                <button class="company-card-btn">View Details →</button>
            </div>
        `).join('');
    }

    handleSearch(query) {
        this.filteredCompanies = this.companies.filter(c => 
            c.name.toLowerCase().includes(query.toLowerCase())
        );
        this.renderCompanies();
    }

    handleFilter(category) {
        if (category === 'All') {
            this.filteredCompanies = this.companies;
        } else {
            this.filteredCompanies = this.companies.filter(c => c.category === category);
        }
        this.renderCompanies();
    }

    showCompanyModal(companyId) {
        const company = this.companies.find(c => c.id == companyId);
        if (!company) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>${company.name}</h2>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin: 2rem 0;">
                        <div>
                            <h4>Match Details</h4>
                            <ul style="line-height: 2; color: #555;">
                                <li><strong>Match Ratio:</strong> ${company.matchRatio}</li>
                                <li><strong>Max Annual:</strong> ${company.maxAnnual}</li>
                                <li><strong>Min Donation:</strong> ${company.minDonation}</li>
                                <li><strong>Category:</strong> ${company.category}</li>
                                <li><strong>Status:</strong> ${company.verified ? '✓ Verified' : 'Pending'}</li>
                            </ul>
                        </div>
                        <div>
                            <h4>How It Works</h4>
                            <ol style="line-height: 2; color: #555;">
                                <li>Make your donation</li>
                                <li>Get donation receipt</li>
                                <li>Submit to ${company.name}</li>
                                <li>Receive matching funds</li>
                            </ol>
                        </div>
                    </div>
                    <div style="margin: 2rem 0; padding: 1.5rem; background: #e3f2fd; border-radius: 8px;">
                        <strong>Eligible Nonprofits:</strong> Conservation organizations, environmental nonprofits, research institutions
                    </div>
                    <div class="modal-actions">
                        <button class="btn" style="flex: 1;" onclick="window.location.href='https://${company.name.toLowerCase()}.com/careers/matching-gifts';">
                            View ${company.name} Matching Program →
                        </button>
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
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new MatchingGiftDirectory();
});
