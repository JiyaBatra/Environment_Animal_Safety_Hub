/**
 * Impact Stories & Metrics JavaScript Handler
 */

class ImpactStories {
    constructor() {
        this.stories = this.generateStories();
        this.updates = this.generateUpdates();
        this.metrics = this.generateMetrics();
        this.init();
    }

    generateStories() {
        return [
            {
                id: 1,
                title: 'Tiger Population Recovery in India',
                excerpt: 'How our conservation efforts increased tiger population by 40%',
                tag: 'Wildlife Protection',
                image: '🐯',
                date: '2024-02-15'
            },
            {
                id: 2,
                title: 'Amazon Reforestation Success',
                excerpt: 'Planting 1 million trees to combat deforestation',
                tag: 'Reforestation',
                image: '🌳',
                date: '2024-02-10'
            },
            {
                id: 3,
                title: 'Coral Reef Restoration Project',
                excerpt: 'Recovering marine biodiversity in Southeast Asia',
                tag: 'Marine Conservation',
                image: '🪸',
                date: '2024-02-05'
            },
            {
                id: 4,
                title: 'Community Education Initiative',
                excerpt: 'Teaching sustainable practices to local communities',
                tag: 'Education',
                image: '📚',
                date: '2024-01-30'
            }
        ];
    }

    generateUpdates() {
        return [
            { date: '2024-02-15', text: 'Successfully completed Q4 wildlife survey - tiger sightings up 40%', status: '✓ Completed' },
            { date: '2024-02-10', text: 'Launched Amazon reforestation campaign with 500 volunteers', status: '🚀 In Progress' },
            { date: '2024-02-01', text: 'Reached $100,000 fundraising goal for marine project', status: '✓ Completed' },
            { date: '2024-01-25', text: 'Trained 200 community educators in conservation practices', status: '✓ Completed' }
        ];
    }

    generateMetrics() {
        return [
            { label: 'Animals Protected', value: '2,450', change: '↑12%', icon: '🦁' },
            { label: 'Acres Restored', value: '5,230', change: '↑18%', icon: '🌍' },
            { label: 'Livelihoods Supported', value: '1,847', change: '↑8%', icon: '👨‍👩‍👧' },
            { label: 'Conservation Programs', value: '34', change: '+4 new', icon: '🛡️' },
            { label: 'Active Research Projects', value: '156', change: '↑22%', icon: '🔬' },
            { label: 'Cost per Animal Protected', value: '$187', change: '↓15% more efficient', icon: '💰' }
        ];
    }

    init() {
        this.setupEventListeners();
        this.switchTab('stories');
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Story cards click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.story-card')) {
                const storyId = e.target.closest('.story-card').dataset.storyId;
                this.showStoryModal(storyId);
            }
        });
    }

    switchTab(tabName) {
        const tabContent = document.querySelector('.tab-content.active');
        if (tabContent) {
            tabContent.classList.remove('active');
        }

        let html = '';
        
        switch(tabName) {
            case 'stories':
                html = this.renderStoriesTab();
                break;
            case 'updates':
                html = this.renderUpdatesTab();
                break;
            case 'metrics':
                html = this.renderMetricsTab();
                break;
            case 'reports':
                html = this.renderReportsTab();
                break;
        }

        const tabElement = document.querySelector('[data-tab-content="' + tabName + '"]');
        if (tabElement) {
            tabElement.innerHTML = html;
            tabElement.classList.add('active');
        }
    }

    renderStoriesTab() {
        return `
            <div class="stories-grid">
                ${this.stories.map(story => `
                    <div class="story-card" data-story-id="${story.id}">
                        <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #4CAF50, #81C784); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                            ${story.image}
                        </div>
                        <div class="story-card-content">
                            <div class="story-card-title">${story.title}</div>
                            <div class="story-card-excerpt">${story.excerpt}</div>
                            <div class="story-card-footer">
                                <span class="story-card-tag">${story.tag}</span>
                                <span>${this.formatDate(story.date)}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderUpdatesTab() {
        return `
            <div style="margin-top: 2rem;">
                ${this.updates.map((update, idx) => `
                    <div style="display: flex; gap: 2rem; margin-bottom: 2rem; position: relative;">
                        ${idx < this.updates.length - 1 ? '<div style="width: 2px; background: #e0e0e0; margin-left: 12px; position: absolute; top: 40px; bottom: -24px;"></div>' : ''}
                        <div>
                            <div style="width: 28px; height: 28px; background: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                                ${idx + 1}
                            </div>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; margin-bottom: 0.5rem;">${update.text}</div>
                            <div style="color: #999; font-size: 0.9rem;">${this.formatDate(update.date)} • ${update.status}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderMetricsTab() {
        const metricsHtml = `
            <div class="metrics-grid">
                ${this.metrics.map(metric => `
                    <div class="metric-card">
                        <div class="metric-icon">${metric.icon}</div>
                        <div class="metric-content">
                            <div class="metric-value">${metric.value}</div>
                            <div class="metric-label">${metric.label}</div>
                            <div class="metric-change">${metric.change}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        const beforeAfterHtml = `
            <div class="before-after-section">
                <h3>Conservation Impact: Before & After</h3>
                <div class="before-after-gallery">
                    <div>
                        <div class="before-after-comparison">
                            <div style="background: #ff6b6b; display: flex; align-items: center; justify-content: center; height: 200px; border-radius: 8px; color: white; font-size: 3rem;">
                                🏚️
                            </div>
                            <div style="background: #51cf66; display: flex; align-items: center; justify-content: center; height: 200px; border-radius: 8px; color: white; font-size: 3rem;">
                                🏞️
                            </div>
                        </div>
                        <div class="comparison-label">Forest Restoration</div>
                    </div>
                </div>
            </div>
        `;

        return metricsHtml + beforeAfterHtml;
    }

    renderReportsTab() {
        const reports = [
            { quarter: 'Q4 2023', date: 'Jan 15, 2024', link: '#' },
            { quarter: 'Q3 2023', date: 'Oct 10, 2023', link: '#' },
            { quarter: 'Q2 2023', date: 'Jul 12, 2023', link: '#' },
            { quarter: 'Q1 2023', date: 'Apr 5, 2023', link: '#' }
        ];

        return `
            <div style="margin-top: 2rem;">
                <div style="margin-bottom: 2rem; padding: 1.5rem; background: #e8f5e9; border-radius: 8px;">
                    <strong>Stay Updated</strong>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <input type="email" placeholder="your@email.com" style="flex: 1; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;">
                        <button class="btn">Subscribe</button>
                    </div>
                </div>
                <div style="display: grid; gap: 1rem;">
                    ${reports.map(report => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">
                            <div>
                                <div style="font-weight: 600;">${report.quarter} Impact Report</div>
                                <div style="color: #999; font-size: 0.9rem;">Released ${report.date}</div>
                            </div>
                            <button class="btn">📥 Download</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    showStoryModal(storyId) {
        const story = this.stories.find(s => s.id == storyId);
        if (!story) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>${story.title}</h2>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <div style="background: linear-gradient(135deg, #4CAF50, #81C784); height: 300px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 5rem; margin-bottom: 2rem;">
                        ${story.image}
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <span class="story-card-tag">${story.tag}</span>
                        <div style="color: #999; font-size: 0.9rem; margin-top: 0.5rem;">${this.formatDate(story.date)}</div>
                    </div>
                    <div style="line-height: 1.8; color: #555;">
                        <p>${story.excerpt}</p>
                        <p>This is a detailed story about ${story.title.toLowerCase()}. Our dedicated team of researchers and conservationists worked tirelessly to achieve these remarkable results. The impact has been felt across multiple ecosystems and has positively affected thousands of lives.</p>
                        <p>Thanks to our generous donors, we were able to implement innovative conservation strategies that are now being replicated across the region.</p>
                    </div>
                    <div class="modal-actions" style="margin-top: 2rem;">
                        <button class="btn" style="flex: 1;">Share This Story</button>
                        <button class="btn" style="flex: 1; background: #e0e0e0; color: #333;">Support This Project</button>
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

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ImpactStories();
});
