/**
 * P2P Leaderboard JavaScript Handler
 */

class P2PLeaderboard {
    constructor() {
        this.fundraisers = this.generateFundraisers();
        this.teamData = this.generateTeams();
        this.currentView = 'individual';
        this.currentSort = 'raised';
        this.currentPeriod = 'all-time';
        this.init();
    }

    generateFundraisers() {
        return [
            { id: 1, name: 'John Smith', campaign: 'Save the Amazon', raised: 28500, goal: 30000, donors: 145, photo: '👨' },
            { id: 2, name: 'Sarah Johnson', campaign: 'Ocean Cleanup', raised: 22000, goal: 25000, donors: 118, photo: '👩' },
            { id: 3, name: 'Michael Chen', campaign: 'Wildlife Protection', raised: 18750, goal: 20000, donors: 94, photo: '👨' },
            { id: 4, name: 'Emily Davis', campaign: 'Coral Reef Recovery', raised: 15500, goal: 18000, donors: 87, photo: '👩' },
            { id: 5, name: 'David Martinez', campaign: 'Forest Reforestation', raised: 12300, goal: 15000, donors: 71, photo: '👨' },
            { id: 6, name: 'Lisa Anderson', campaign: 'Endangered Species', raised: 9800, goal: 12000, donors: 58, photo: '👩' },
            { id: 7, name: 'James Wilson', campaign: 'Water Conservation', raised: 8500, goal: 10000, donors: 49, photo: '👨' },
            { id: 8, name: 'Amanda Garcia', campaign: 'Biodiversity Initiative', raised: 7200, goal: 9000, donors: 42, photo: '👩' },
            { id: 9, name: 'Robert Brown', campaign: 'Climate Action', raised: 5600, goal: 7000, donors: 35, photo: '👨' },
            { id: 10, name: 'Jennifer Lee', campaign: 'Sustainable Living', raised: 4300, goal: 5500, donors: 28, photo: '👩' }
        ];
    }

    generateTeams() {
        return [
            { id: 1, name: 'Tech Corp Warriors', members: 8, raised: 65000, goal: 75000, donors: 320 },
            { id: 2, name: 'Finance Friends for the Planet', members: 12, raised: 58000, goal: 70000, donors: 295 },
            { id: 3, name: 'Healthcare Heroes', members: 6, raised: 42000, goal: 50000, donors: 210 },
            { id: 4, name: 'University Students Network', members: 15, raised: 38000, goal: 45000, donors: 185 }
        ];
    }

    init() {
        this.renderStats();
        this.setupEventListeners();
        this.renderLeaderboard();
    }

    setupEventListeners() {
        // View filters
        document.querySelectorAll('[data-filter="view"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-filter="view"]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.value;
                this.renderLeaderboard();
            });
        });

        // Sort filters
        document.querySelectorAll('[data-filter="sort"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-filter="sort"]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentSort = e.target.dataset.value;
                this.renderLeaderboard();
            });
        });

        // Period filters
        document.querySelectorAll('[data-filter="period"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-filter="period"]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.value;
                this.renderLeaderboard();
            });
        });

        // Search
        const searchInput = document.querySelector('[data-search]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Fundraiser detail clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-fundraiser-id]')) {
                const fundraiserId = e.target.closest('[data-fundraiser-id]').dataset.fundraiserId;
                this.showFundraiserModal(fundraiserId);
            }
        });
    }

    renderStats() {
        const statsContainer = document.querySelector('.leaderboard-stats');
        if (!statsContainer) return;

        const totalRaised = this.fundraisers.reduce((sum, f) => sum + f.raised, 0);
        const totalDonors = this.fundraisers.reduce((sum, f) => sum + f.donors, 0);

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div>
                    <div class="stat-value">$${(totalRaised / 1000).toFixed(0)}K</div>
                    <div class="stat-label">Total Raised</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div>
                    <div class="stat-value">${this.fundraisers.length}</div>
                    <div class="stat-label">Active Fundraisers</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div>
                    <div class="stat-value">${(totalDonors / 100).toFixed(0)}K+</div>
                    <div class="stat-label">Total Donors</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div>
                    <div class="stat-value">87%</div>
                    <div class="stat-label">Goal Progress</div>
                </div>
            </div>
        `;
    }

    renderLeaderboard() {
        const leaderboardContainer = document.querySelector('.leaderboard-table-container');
        if (!leaderboardContainer) return;

        let data;
        if (this.currentView === 'individual') {
            data = this.getSortedFundraisers();
        } else if (this.currentView === 'team') {
            data = this.getSortedTeams();
        } else {
            data = this.getSortedCombined();
        }

        leaderboardContainer.innerHTML = this.generateTable(data);
    }

    getSortedFundraisers() {
        let sorted = [...this.fundraisers];
        switch(this.currentSort) {
            case 'raised':
                sorted.sort((a, b) => b.raised - a.raised);
                break;
            case 'donors':
                sorted.sort((a, b) => b.donors - a.donors);
                break;
            case 'recent':
                sorted.reverse();
                break;
        }
        return sorted;
    }

    getSortedTeams() {
        let sorted = [...this.teamData];
        switch(this.currentSort) {
            case 'raised':
                sorted.sort((a, b) => b.raised - a.raised);
                break;
            case 'donors':
                sorted.sort((a, b) => b.donors - a.donors);
                break;
            case 'recent':
                sorted.reverse();
                break;
        }
        return sorted;
    }

    getSortedCombined() {
        return this.getSortedFundraisers();
    }

    generateTable(data) {
        if (this.currentView === 'team') {
            return `
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Team Name</th>
                            <th>Members</th>
                            <th>Raised</th>
                            <th>Progress</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((team, idx) => {
                            const progress = (team.raised / team.goal) * 100;
                            return `
                                <tr data-fundraiser-id="${team.id}">
                                    <td class="rank-col">
                                        <div class="rank-badge ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : ''}">#${idx + 1}</div>
                                    </td>
                                    <td>
                                        <div class="fundraiser-name">${team.name}</div>
                                        <div class="fundraiser-campaign">${team.members} members</div>
                                    </td>
                                    <td>${team.members}</td>
                                    <td><strong>$${this.formatCurrency(team.raised)}</strong></td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${progress}%"></div>
                                        </div>
                                        <div style="font-size: 0.85rem; color: #999;">${progress.toFixed(0)}%</div>
                                    </td>
                                    <td><button class="action-btn">View →</button></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        } else {
            return `
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Fundraiser</th>
                            <th>Campaign</th>
                            <th>Raised</th>
                            <th>Donors</th>
                            <th>Progress</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((fundraiser, idx) => {
                            const progress = (fundraiser.raised / fundraiser.goal) * 100;
                            return `
                                <tr data-fundraiser-id="${fundraiser.id}">
                                    <td class="rank-col">
                                        <div class="rank-badge ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : ''}">#${idx + 1}</div>
                                    </td>
                                    <td>
                                        <div class="fundraiser-name">${fundraiser.name}</div>
                                    </td>
                                    <td class="fundraiser-campaign">${fundraiser.campaign}</td>
                                    <td><strong>$${this.formatCurrency(fundraiser.raised)}</strong></td>
                                    <td>${fundraiser.donors}</td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${progress}%"></div>
                                        </div>
                                        <div style="font-size: 0.85rem; color: #999;">${progress.toFixed(0)}%</div>
                                    </td>
                                    <td><button class="action-btn">View →</button></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        }
    }

    handleSearch(query) {
        const rows = document.querySelectorAll('.leaderboard-table tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    showFundraiserModal(fundraiserId) {
        const fundraiser = this.fundraisers.find(f => f.id == fundraiserId);
        if (!fundraiser) return;

        const progress = (fundraiser.raised / fundraiser.goal) * 100;
        const avgDonation = fundraiser.raised / fundraiser.donors;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>${fundraiser.name}</h2>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <div style="background: linear-gradient(135deg, #4CAF50, #81C784); height: 250px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem; margin-bottom: 2rem;">
                        ${fundraiser.photo}
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
                        <div style="text-align: center; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #4CAF50;">$${this.formatCurrency(fundraiser.raised)}</div>
                            <div style="font-size: 0.85rem; color: #666;">Raised</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #4CAF50;">$${this.formatCurrency(fundraiser.goal)}</div>
                            <div style="font-size: 0.85rem; color: #666;">Goal</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #4CAF50;">${fundraiser.donors}</div>
                            <div style="font-size: 0.85rem; color: #666;">Donors</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #4CAF50;">${progress.toFixed(0)}%</div>
                            <div style="font-size: 0.85rem; color: #666;">Complete</div>
                        </div>
                    </div>
                    <div style="margin-bottom: 2rem;">
                        <h4>${fundraiser.campaign}</h4>
                        <p>Join ${fundraiser.name} in supporting this important conservation initiative. Every dollar makes a real difference in protecting our planet's wildlife and ecosystems.</p>
                    </div>
                    <div class="progress-bar" style="height: 12px;">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn" style="flex: 1;">Donate Now</button>
                        <button class="btn" style="flex: 1; background: #e0e0e0; color: #333;">Share</button>
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

    formatCurrency(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 0 });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new P2PLeaderboard();
});
