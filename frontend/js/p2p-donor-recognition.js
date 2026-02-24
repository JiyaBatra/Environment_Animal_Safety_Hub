/**
 * Donor Recognition System JavaScript Handler
 */

class DonorRecognition {
    constructor() {
        this.donors = this.generateDonorData();
        this.init();
    }

    generateDonorData() {
        return {
            supporters: [
                { name: 'Jane Smith', amount: 75 },
                { name: 'Tom Johnson', amount: 50 },
                { name: 'Lisa Chen', amount: 99 }
            ],
            champions: [
                { name: 'Robert Wilson', amount: 250 },
                { name: 'Maria Garcia', amount: 300 },
                { name: 'James Lee', amount: 150 }
            ],
            heroes: [
                { name: 'David Brown', amount: 1500 },
                { name: 'Sarah Davis', amount: 500 }
            ],
            guardians: [
                { name: 'Elizabeth Martinez', amount: 5000 }
            ],
            milestones: [
                { amount: '$100', celebrants: 145, milestone: '🥉 Bronze Donor' },
                { amount: '$500', celebrants: 47, milestone: '🥈 Silver Donor' },
                { amount: '$1000', celebrants: 18, milestone: '🥇 Gold Donor' },
                { amount: '$5000', celebrants: 5, milestone: '💎 Platinum Donor' },
                { amount: '1-Year', celebrants: 89, milestone: '📅 Year-Long Supporter' },
                { amount: '5-Year', celebrants: 12, milestone: '⭐ Lifetime Champion' }
            ],
            spotlights: [
                { name: 'Emma Wilson', reason: 'Supporting marine conservation for 3 years', image: '👩‍💼' },
                { name: 'Marcus Brown', reason: 'Organized corporate fundraising drive', image: '👨‍💼' },
                { name: 'Sofia Rodriguez', reason: 'Donated 100% of birthday gifts', image: '👩' }
            ]
        };
    }

    init() {
        this.setupEventListeners();
        this.switchTab('levels');
    }

    setupEventListeners() {
        document.querySelectorAll('.recognition-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.recognition-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Add event delegation for donor detail modals
        document.addEventListener('click', (e) => {
            if (e.target.closest('.level-card')) {
                const level = e.target.closest('.level-card').dataset.level;
                this.showDonorModal(level);
            }
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.recognition-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        const tabContent = document.querySelector('.recognition-content');
        
        switch(tabName) {
            case 'levels':
                this.renderGivingLevels();
                break;
            case 'gratitude':
                this.renderWallOfGratitude();
                break;
            case 'milestones':
                this.renderMilestones();
                break;
            case 'spotlights':
                this.renderSpotlights();
                break;
        }
    }

    renderGivingLevels() {
        const levels = [
            {
                name: 'Supporter',
                emoji: '🌱',
                range: '$25 - $99',
                benefits: ['Recognition on Wall of Gratitude', 'Monthly Newsletter', 'Impact Updates'],
                count: this.donors.supporters.length,
                featured: false,
                level: 'supporter',
                donors: this.donors.supporters
            },
            {
                name: 'Champion',
                emoji: '🦁',
                range: '$100 - $499',
                benefits: ['All Supporter benefits', 'VIP Event Invitations', 'Quarterly Impact Report'],
                count: this.donors.champions.length,
                featured: false,
                level: 'champion',
                donors: this.donors.champions
            },
            {
                name: 'Hero',
                emoji: '🦅',
                range: '$500 - $2,499',
                benefits: ['All Champion benefits', 'Exclusive Behind-the-Scenes Content', 'Named Recognition'],
                count: this.donors.heroes.length,
                featured: true,
                level: 'hero',
                donors: this.donors.heroes
            },
            {
                name: 'Guardian',
                emoji: '👑',
                range: '$2,500+',
                benefits: ['All Hero benefits', 'Strategic Advisory Board Access', 'Lifetime Recognition', 'Custom Impact Updates'],
                count: this.donors.guardians.length,
                featured: false,
                level: 'guardian',
                donors: this.donors.guardians
            }
        ];

        const html = levels.map(level => `
            <div class="level-card ${level.featured ? 'featured' : ''}" data-level="${level.level}">
                ${level.featured ? '<div class="popular-badge">Most Popular</div>' : ''}
                <div class="level-badge ${level.level}">${level.name}</div>
                <div style="font-size: 2.5rem; margin-bottom: 1rem;">${level.emoji}</div>
                <h3>${level.range}</h3>
                <p class="level-description">Become a ${level.name} today</p>
                <div class="level-benefits">
                    <strong>Your Benefits:</strong>
                    <ul>
                        ${level.benefits.map(b => `<li>✓ ${b}</li>`).join('')}
                    </ul>
                </div>
                <button class="btn btn-block">Donate Now</button>
                <div class="donor-count">${level.count} donors at this level</div>
            </div>
        `).join('');

        document.querySelector('.recognition-content').innerHTML = `
            <div class="giving-levels-grid">${html}</div>
        `;
    }

    renderWallOfGratitude() {
        const allDonors = [
            ...this.donors.supporters,
            ...this.donors.champions,
            ...this.donors.heroes,
            ...this.donors.guardians
        ];

        const html = allDonors.map(donor => `
            <div class="gratitude-card">
                <div class="gratitude-name">${donor.name}</div>
                <div class="gratitude-message">"Thank you for protecting our planet!" - ${donor.name}</div>
            </div>
        `).join('');

        document.querySelector('.recognition-content').innerHTML = `
            <div class="wall-of-gratitude-section">
                <div class="wall-header">
                    <h2>Wall of Gratitude</h2>
                    <p>Our most generous supporters who opted to be recognized</p>
                </div>
                <div class="gratitude-wall">${html}</div>
                <div style="text-align: center; margin-top: 2rem;">
                    <p style="color: #666;">Would you like to join our Wall of Gratitude? <a href="#" style="color: #4CAF50; font-weight: bold;">Learn more →</a></p>
                </div>
            </div>
        `;
    }

    renderMilestones() {
        const html = this.donors.milestones.map(milestone => `
            <div class="milestone-achievement">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${milestone.amount}</div>
                <h4>${milestone.milestone}</h4>
                <p style="color: #999; margin-bottom: 1rem;">${milestone.celebrants} donors have reached this milestone</p>
                <div class="milestone-celebrants">
                    ${Array(Math.min(5, milestone.celebrants)).fill().map((_, i) => `
                        <div class="celebrant-avatar">${String.fromCharCode(65 + i)}</div>
                    `).join('')}
                    ${milestone.celebrants > 5 ? `<div class="celebrant-more">+${milestone.celebrants - 5}</div>` : ''}
                </div>
            </div>
        `).join('');

        document.querySelector('.recognition-content').innerHTML = `
            <div class="milestone-achievements">${html}</div>
        `;
    }

    renderSpotlights() {
        const html = this.donors.spotlights.map(donor => `
            <div class="spotlight-card">
                <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #4CAF50, #81C784); display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem;">
                    ${donor.image}
                </div>
                <div class="spotlight-content">
                    <div class="spotlight-title">${donor.name}</div>
                    <div class="spotlight-excerpt">${donor.reason}</div>
                    <div class="spotlight-meta">
                        <span>This Month's Spotlight</span>
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelector('.recognition-content').innerHTML = `
            <div class="spotlights-list">${html}</div>
        `;
    }

    showDonorModal(level) {
        const donors = this.donors[`${level}s`];
        if (!donors || !donors.length) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>Donors at ${level.charAt(0).toUpperCase() + level.slice(1)} Level</h2>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <div class="donors-list">
                        ${donors.map(d => `
                            <div class="donor-card">
                                <div class="donor-avatar">${d.name.charAt(0)}</div>
                                <div class="donor-info">
                                    <div class="donor-name">${d.name}</div>
                                    <div style="color: #999; font-size: 0.9rem;">Generous Supporter</div>
                                </div>
                                <div class="donor-amount">$${d.amount.toLocaleString()}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new DonorRecognition();
});
