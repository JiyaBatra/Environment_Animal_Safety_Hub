
        const animals = [
            { id: 'A001', name: 'Buddy', species: 'Dog', stress: 'low', activity: 85, feeding: 92, social: 78 },
            { id: 'A002', name: 'Whiskers', species: 'Cat', stress: 'high', activity: 45, feeding: 67, social: 23 },
            { id: 'A003', name: 'Charlie', species: 'Dog', stress: 'medium', activity: 72, feeding: 88, social: 65 },
            { id: 'A004', name: 'Luna', species: 'Cat', stress: 'low', activity: 90, feeding: 95, social: 82 }
        ];

        const patterns = [
            { name: 'Feeding Behavior', status: 'Normal', icon: 'fas fa-utensils' },
            { name: 'Sleep Patterns', status: 'Irregular', icon: 'fas fa-bed' },
            { name: 'Social Interaction', status: 'Improving', icon: 'fas fa-users' },
            { name: 'Play Activity', status: 'Active', icon: 'fas fa-gamepad' }
        ];

        const alerts = [
            'Whiskers showing increased stress levels - requires attention',
            'Charlie has reduced feeding activity for 2 days',
            'Luna needs socialization assessment',
            'Buddy ready for adoption evaluation'
        ];

        const recommendations = [
            { text: 'Increase enrichment activities for high-stress animals', icon: 'fas fa-puzzle-piece' },
            { text: 'Schedule veterinary check for animals with feeding issues', icon: 'fas fa-stethoscope' },
            { text: 'Implement gradual socialization program', icon: 'fas fa-handshake' },
            { text: 'Monitor sleep patterns more closely', icon: 'fas fa-eye' }
        ];

        function showSection(sectionId) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.getElementById(sectionId).classList.add('active');
            event.target.classList.add('active');
        }

        function loadAnimals() {
            const animalGrid = document.getElementById('animalGrid');
            animalGrid.innerHTML = animals.map(animal => `
                <div class="animal-card">
                    <div class="animal-header">
                        <h3 class="animal-name">${animal.name}</h3>
                        <div class="animal-id">${animal.id} - ${animal.species}</div>
                    </div>
                    <div class="animal-content">
                        <div class="stress-indicator">
                            <span>Stress Level:</span>
                            <span class="stress-level stress-${animal.stress}">${animal.stress.toUpperCase()}</span>
                        </div>
                        <div class="behavior-metrics">
                            <div class="metric-item">
                                <div class="metric-value">${animal.activity}%</div>
                                <div class="metric-label">Activity</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${animal.feeding}%</div>
                                <div class="metric-label">Feeding</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${animal.social}%</div>
                                <div class="metric-label">Social</div>
                            </div>
                            <div class="metric-item">
                                <button class="btn btn-primary" onclick="viewDetails('${animal.id}')">View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function loadPatterns() {
            const patternGrid = document.getElementById('patternGrid');
            patternGrid.innerHTML = patterns.map(pattern => `
                <div class="pattern-card">
                    <div class="pattern-icon">
                        <i class="${pattern.icon}"></i>
                    </div>
                    <h4 class="pattern-name">${pattern.name}</h4>
                    <p class="pattern-status">${pattern.status}</p>
                </div>
            `).join('');
        }

        function loadAlerts() {
            const alertList = document.getElementById('alertList');
            alertList.innerHTML = alerts.map(alert => `
                <li class="alert-item">${alert}</li>
            `).join('');
        }

        function loadRecommendations() {
            const recList = document.getElementById('recommendationList');
            recList.innerHTML = recommendations.map(rec => `
                <li class="rec-item">
                    <i class="${rec.icon}"></i>
                    <span>${rec.text}</span>
                </li>
            `).join('');
        }

        function createCharts() {
            // Stress Level Chart
            const stressCtx = document.getElementById('stressChart').getContext('2d');
            new Chart(stressCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Average Stress Level',
                        data: [3.2, 2.8, 3.5, 2.1, 1.9, 2.3, 2.0],
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true, max: 5 }
                    }
                }
            });

            // Activity Chart
            const activityCtx = document.getElementById('activityChart').getContext('2d');
            new Chart(activityCtx, {
                type: 'bar',
                data: {
                    labels: ['Feeding', 'Playing', 'Sleeping', 'Social', 'Exercise'],
                    datasets: [{
                        label: 'Activity Hours',
                        data: [6, 4, 12, 3, 2],
                        backgroundColor: ['#28a745', '#17a2b8', '#6f42c1', '#fd7e14', '#dc3545']
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }

        function viewDetails(animalId) {
            alert(`Viewing detailed behavior analysis for animal ${animalId}`);
        }

        function addObservation() {
            alert('Adding new behavioral observation...');
        }

        function generateReport() {
            alert('Generating comprehensive behavior report...');
        }

        function exportData() {
            alert('Exporting behavior data for veterinary consultation...');
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            loadAnimals();
            loadPatterns();
            loadAlerts();
            loadRecommendations();
            createCharts();
        });