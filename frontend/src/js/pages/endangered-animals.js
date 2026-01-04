let animalsData = [];
let filteredAnimals = [];
let currentFilter = 'all';

// Parallax Effect for Hero
document.addEventListener('mousemove', (e) => {
    const heroBg = document.getElementById('heroBg');
    if (heroBg) {
        const x = (window.innerWidth - e.pageX * 5) / 100;
        const y = (window.innerHeight - e.pageY * 5) / 100;
        heroBg.style.transform = `translateX(${x}px) translateY(${y}px)`;
    }
});

// Load animals data
async function loadAnimalsData() {
    try {
        const response = await fetch('../assets/data/endangered-animals.json');
        animalsData = await response.json();
        filteredAnimals = [...animalsData];
        displayAnimals(filteredAnimals);
    } catch (error) {
        console.error('Error loading animals data:', error);
        document.getElementById('noResults').style.display = 'block';
    }
}

// Display animals in grid
function displayAnimals(animals) {
    const grid = document.getElementById('animalsGrid');
    const noResults = document.getElementById('noResults');

    if (animals.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    grid.innerHTML = animals.map(animal => `
        <div class="animal-card" onclick="openModal(${animal.id})">
            <div class="card-image-wrapper">
                <img src="${animal.image}" alt="${animal.name}" class="animal-image" 
                     onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
                <span class="status-badge-overlay status-${animal.status}">${animal.status}</span>
            </div>
            <div class="animal-content">
                <div class="card-header">
                    <h3 class="animal-name">${animal.name}</h3>
                    <p class="scientific-name">${animal.scientificName}</p>
                </div>
                
                <div class="card-info">
                    <div class="info-item">
                        <span class="info-icon">🏠</span>
                        <span class="info-text">${animal.habitat}</span>
                    </div>
                </div>

                <div class="card-tags">
                    ${animal.threats.slice(0, 2).map(threat =>
        `<span class="threat-tag">${threat}</span>`
    ).join('')}
                    ${animal.threats.length > 2 ? `<span class="threat-tag">+${animal.threats.length - 2}</span>` : ''}
                </div>

                <p class="animal-description">${truncateText(animal.description, 80)}</p>
                
                <div class="card-footer">
                    <span class="learn-more">Learn More →</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Search functionality with debouncing
function searchAnimals() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();

    if (!query) {
        filteredAnimals = currentFilter === 'all' ? [...animalsData] :
            animalsData.filter(animal => animal.status === currentFilter);
    } else {
        const searchResults = animalsData.filter(animal =>
            animal.name.toLowerCase().includes(query) ||
            animal.scientificName.toLowerCase().includes(query) ||
            animal.description.toLowerCase().includes(query)
        );

        filteredAnimals = currentFilter === 'all' ? searchResults :
            searchResults.filter(animal => animal.status === currentFilter);
    }

    displayAnimals(filteredAnimals);
}

// Filter by conservation status
function filterByStatus(status) {
    currentFilter = status;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const query = document.getElementById('searchInput').value.toLowerCase().trim();

    if (status === 'all') {
        filteredAnimals = query ?
            animalsData.filter(animal =>
                animal.name.toLowerCase().includes(query) ||
                animal.scientificName.toLowerCase().includes(query) ||
                animal.description.toLowerCase().includes(query)
            ) : [...animalsData];
    } else {
        const statusFiltered = animalsData.filter(animal => animal.status === status);
        filteredAnimals = query ?
            statusFiltered.filter(animal =>
                animal.name.toLowerCase().includes(query) ||
                animal.scientificName.toLowerCase().includes(query) ||
                animal.description.toLowerCase().includes(query)
            ) : statusFiltered;
    }

    displayAnimals(filteredAnimals);
}

// Open animal details modal
function openModal(animalId) {
    const animal = animalsData.find(a => a.id === animalId);
    if (!animal) return;

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <img src="${animal.image}" alt="${animal.name}" class="modal-image"
             onerror="this.src='https://via.placeholder.com/800x300?text=No+Image'">
        
        <h2>${animal.name}</h2>
        <p class="scientific-name" style="font-size: 1.1rem; margin-bottom: 1rem;">${animal.scientificName}</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
            <div>
                <h3>Basic Information</h3>
                <p><strong>Conservation Status:</strong> <span class="status-badge status-${animal.status}">${animal.statusText}</span></p>
                <p><strong>Habitat:</strong> ${animal.habitat}</p>
                <p><strong>Population:</strong> ${animal.population}</p>
            </div>
            
            <div>
                <h3>Geographic Locations</h3>
                <ul class="locations-list">
                    ${animal.locations.map(location => `<li>${location}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3>Description</h3>
            <p style="line-height: 1.6;">${animal.description}</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3>Main Threats</h3>
            <ul class="threats-list">
                ${animal.threats.map(threat => `<li>${threat}</li>`).join('')}
            </ul>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3>Fun Facts</h3>
            <ul class="facts-list">
                ${animal.facts.map(fact => `<li>${fact}</li>`).join('')}
            </ul>
        </div>
        
        <div>
            <h3>How You Can Help</h3>
            <div class="organizations">
                ${animal.organizations.map(org => `
                    <div class="org-card">
                        <h4>${org.name}</h4>
                        <div class="org-links">
                            <a href="${org.website}" target="_blank" class="org-link visit-link">Visit Website</a>
                            <a href="${org.donate}" target="_blank" class="org-link donate-link">Donate Now</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.getElementById('animalModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    document.getElementById('animalModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    return text.length <= maxLength ? text : text.substr(0, maxLength) + '...';
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', debounce(searchAnimals, 300));
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchAnimals();
    }
});

// Close modal when clicking outside
document.getElementById('animalModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', loadAnimalsData);