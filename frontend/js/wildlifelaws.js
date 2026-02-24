    // Load navbar and footer
    fetch('../components/navbar.html')
      .then(r => r.text())
      .then(html => {
        document.getElementById('navbar-container').innerHTML = html;
      });
    
    fetch('../components/footer.html')
      .then(r => r.text())
      .then(html => {
        document.getElementById('footer-container').innerHTML = html;
      });

    // Wildlife Laws Data
    const wildlifeLaws = [
      {
        id: 1,
        name: "CITES Convention",
        type: "international",
        category: ["trade", "endangered"],
        year: 1973,
        countries: 183,
        status: "active",
        description: "Convention on International Trade in Endangered Species regulates international wildlife trade to prevent extinction.",
        icon: "fas fa-globe",
        details: {
          scope: "Regulates trade of ~35,000 species",
          penalties: "Trade sanctions, permit suspensions",
          enforcement: "National enforcement with CITES Secretariat oversight",
          success: "Reduced illegal trade of elephants, rhinos, tigers",
          challenges: "Enforcement varies by country, illegal trade persists"
        }
      },
      {
        id: 2,
        name: "US Endangered Species Act",
        type: "national",
        category: ["endangered", "habitat"],
        year: 1973,
        countries: 1,
        status: "active",
        description: "Provides conservation for threatened and endangered plants and animals and their habitats.",
        icon: "fas fa-balance-scale",
        details: {
          scope: "Protects 1,662 domestic and foreign species",
          penalties: "Up to $50,000 fine and 1 year imprisonment",
          enforcement: "US Fish & Wildlife Service, NOAA Fisheries",
          success: "99% of listed species still exist, 54 recovered",
          challenges: "Political opposition, funding limitations"
        }
      },
      {
        id: 3,
        name: "EU Habitats Directive",
        type: "regional",
        category: ["habitat", "endangered"],
        year: 1992,
        countries: 27,
        status: "active",
        description: "Cornerstone of Europe's nature conservation policy, establishing Natura 2000 network.",
        icon: "fas fa-leaf",
        details: {
          scope: "Over 1,000 animal and plant species, 200 habitat types",
          penalties: "EU infringement procedures, fines",
          enforcement: "European Commission, national authorities",
          success: "Largest network of protected areas in the world",
          challenges: "Implementation gaps in some member states"
        }
      },
      {
        id: 4,
        name: "Migratory Bird Treaty Act",
        type: "international",
        category: ["birds", "migratory"],
        year: 1916,
        countries: 4,
        status: "active",
        description: "Protects migratory birds between US, Canada, Mexico, and Japan through international agreements.",
        icon: "fas fa-dove",
        details: {
          scope: "Over 1,000 protected migratory bird species",
          penalties: "Fines up to $15,000 and 6 months imprisonment",
          enforcement: "US Fish & Wildlife Service",
          success: "Recovery of many bird populations from early 20th century",
          challenges: "Modern threats like climate change, habitat loss"
        }
      },
      {
        id: 5,
        name: "Wildlife Protection Act (India)",
        type: "national",
        category: ["endangered", "habitat"],
        year: 1972,
        countries: 1,
        status: "weak",
        description: "Provides protection to wild animals, birds, and plants to ensure ecological security.",
        icon: "fas fa-tiger",
        details: {
          scope: "Protects ~90 endangered species in India",
          penalties: "Up to 7 years imprisonment and fines",
          enforcement: "State forest departments, wildlife crime bureau",
          success: "Tiger population increased from 1,411 to 2,967",
          challenges: "Poaching, human-wildlife conflict, habitat fragmentation"
        }
      },
      {
        id: 6,
        name: "Marine Mammal Protection Act",
        type: "national",
        category: ["marine", "mammals"],
        year: 1972,
        countries: 1,
        status: "active",
        description: "Prohibits taking and importing marine mammals and products in the United States.",
        icon: "fas fa-whale",
        details: {
          scope: "All marine mammals in US waters",
          penalties: "Up to $100,000 fine and 1 year imprisonment",
          enforcement: "NOAA Fisheries, US Fish & Wildlife Service",
          success: "Recovery of sea otter, walrus populations",
          challenges: "Bycatch, climate change, pollution"
        }
      },
      {
        id: 7,
        name: "Convention on Biological Diversity",
        type: "international",
        category: ["habitat", "biodiversity"],
        year: 1992,
        countries: 196,
        status: "pending",
        description: "International treaty for conservation of biological diversity, sustainable use, and fair sharing of benefits.",
        icon: "fas fa-seedling",
        details: {
          scope: "All biological diversity globally",
          penalties: "Political pressure, international cooperation mechanisms",
          enforcement: "National implementation with CBD Secretariat",
          success: "30x30 target: protect 30% of land/ocean by 2030",
          challenges: "Implementation gaps, funding shortages"
        }
      },
      {
        id: 8,
        name: "Lacey Act (US)",
        type: "national",
        category: ["trade", "plants"],
        year: 1900,
        countries: 1,
        status: "active",
        description: "Prohibits trade in wildlife, fish, and plants that have been illegally taken, possessed, transported, or sold.",
        icon: "fas fa-tree",
        details: {
          scope: "All plants and wildlife taken in violation of laws",
          penalties: "Up to $500,000 fine and 5 years imprisonment",
          enforcement: "US Fish & Wildlife Service, NOAA, USDA",
          success: "Key tool against illegal logging and wildlife trade",
          challenges: "Complex international supply chains"
        }
      }
    ];

    // DOM Elements
    let currentView = 'grid';
    let currentFilter = 'all';
    let searchQuery = '';

    // Initialize
    function init() {
      renderLaws(wildlifeLaws);
      setupEventListeners();
    }

    // Render laws based on current view
    function renderLaws(laws) {
      const container = document.getElementById('lawsContainer');
      container.innerHTML = '';
      
      laws.forEach(law => {
        const lawElement = createLawElement(law);
        container.appendChild(lawElement);
      });
      
      // Update container class for view mode
      container.className = `laws-container ${currentView === 'grid' ? 'laws-grid' : 'laws-list'}`;
    }

    // Create law card element
    function createLawElement(law) {
      const div = document.createElement('div');
      div.className = 'law-card';
      div.onclick = () => openLawModal(law);
      
      const typeClass = `law-type ${law.type}`;
      const statusClass = `law-status status-${law.status}`;
      const countryText = law.countries === 1 ? `${law.countries} country` : `${law.countries} countries`;
      
      div.innerHTML = `
        <div class="law-header">
          <span class="${typeClass}">${law.type.charAt(0).toUpperCase() + law.type.slice(1)}</span>
          <h3 class="law-title">${law.name}</h3>
          <div class="law-countries">
            <i class="fas fa-map-marker-alt"></i>
            <span>${countryText}</span>
            <span style="margin-left: auto;">${law.year}</span>
          </div>
        </div>
        <div class="law-body">
          <p class="law-description">${law.description}</p>
          <div class="law-meta">
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>Enacted: ${law.year}</span>
            </div>
            <div class="meta-item">
              <i class="${law.icon}"></i>
              <span>${law.category.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</span>
            </div>
          </div>
          <span class="${statusClass}">${law.status === 'active' ? 'Actively Enforced' : 
                                        law.status === 'pending' ? 'Implementation Pending' : 'Weak Enforcement'}</span>
        </div>
      `;
      
      return div;
    }

    // Open law details modal
    function openLawModal(law) {
      const modal = document.getElementById('lawModal');
      const title = document.getElementById('modalTitle');
      const type = document.getElementById('modalType');
      const status = document.getElementById('modalStatus');
      const body = document.getElementById('modalBody');
      
      title.textContent = law.name;
      type.textContent = law.type.charAt(0).toUpperCase() + law.type.slice(1);
      status.textContent = law.status === 'active' ? 'Actively Enforced' : 
                          law.status === 'pending' ? 'Implementation Pending' : 'Weak Enforcement';
      
      body.innerHTML = `
        <p style="color: #D5DBDB; margin-bottom: 30px;">${law.description}</p>
        
        <div class="law-details-grid">
          <div class="detail-card">
            <strong><i class="fas fa-bullseye"></i> Scope</strong>
            <p style="margin: 10px 0 0 0; color: #D5DBDB;">${law.details.scope}</p>
          </div>
          <div class="detail-card">
            <strong><i class="fas fa-gavel"></i> Penalties</strong>
            <p style="margin: 10px 0 0 0; color: #D5DBDB;">${law.details.penalties}</p>
          </div>
          <div class="detail-card">
            <strong><i class="fas fa-shield-alt"></i> Enforcement</strong>
            <p style="margin: 10px 0 0 0; color: #D5DBDB;">${law.details.enforcement}</p>
          </div>
          <div class="detail-card">
            <strong><i class="fas fa-chart-line"></i> Success</strong>
            <p style="margin: 10px 0 0 0; color: #D5DBDB;">${law.details.success}</p>
          </div>
          <div class="detail-card">
            <strong><i class="fas fa-exclamation-triangle"></i> Challenges</strong>
            <p style="margin: 10px 0 0 0; color: #D5DBDB;">${law.details.challenges}</p>
          </div>
          <div class="detail-card">
            <strong><i class="fas fa-flag"></i> Coverage</strong>
            <p style="margin: 10px 0 0 0; color: #D5DBDB;">${law.countries} ${law.countries === 1 ? 'country' : 'countries'}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: rgba(41, 128, 185, 0.1); border-radius: 10px;">
          <h4 style="color: #FFEAA7; margin-bottom: 10px;"><i class="fas fa-lightbulb"></i> How to Support</h4>
          <p style="color: #D5DBDB;">Learn how you can help strengthen this legislation through advocacy, donations, or reporting violations.</p>
          <button onclick="closeModal()" style="margin-top: 15px; padding: 10px 20px; background: var(--law-blue); color: white; border: none; border-radius: 5px; cursor: pointer;">
            Get Involved
          </button>
        </div>
      `;
      
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
      const modal = document.getElementById('lawModal');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    // Filter laws
    function filterLaws(filter) {
      currentFilter = filter;
      updateFilterTags();
      applyFilters();
    }

    // Search laws
    function searchLaws() {
      const searchInput = document.getElementById('lawSearch');
      searchQuery = searchInput.value.toLowerCase();
      applyFilters();
    }

    // Reset filters
    function resetFilters() {
      currentFilter = 'all';
      searchQuery = '';
      document.getElementById('lawSearch').value = '';
      updateFilterTags();
      applyFilters();
    }

    // Apply all filters
    function applyFilters() {
      let filteredLaws = wildlifeLaws;
      
      // Apply category filter
      if (currentFilter !== 'all') {
        filteredLaws = filteredLaws.filter(law => 
          law.type === currentFilter || law.category.includes(currentFilter)
        );
      }
      
      // Apply search filter
      if (searchQuery) {
        filteredLaws = filteredLaws.filter(law =>
          law.name.toLowerCase().includes(searchQuery) ||
          law.description.toLowerCase().includes(searchQuery) ||
          law.category.some(cat => cat.includes(searchQuery)) ||
          law.type.includes(searchQuery)
        );
      }
      
      renderLaws(filteredLaws);
    }

    // Update filter tag styling
    function updateFilterTags() {
      const tags = document.querySelectorAll('.filter-tag');
      tags.forEach(tag => {
        if (tag.textContent.toLowerCase().includes(currentFilter)) {
          tag.classList.add('active');
        } else {
          tag.classList.remove('active');
        }
      });
    }

    // Set view mode
    function setView(view) {
      currentView = view;
      const viewBtns = document.querySelectorAll('.view-btn');
      viewBtns.forEach(btn => btn.classList.remove('active'));
      
      if (view === 'grid') {
        document.querySelector('.view-btn:nth-child(1)').classList.add('active');
      } else {
        document.querySelector('.view-btn:nth-child(2)').classList.add('active');
      }
      
      applyFilters();
    }

    // Sort laws
    function sortLaws(criteria) {
      let sortedLaws = [...wildlifeLaws];
      
      if (criteria === 'date') {
        sortedLaws.sort((a, b) => b.year - a.year);
      }
      
      renderLaws(sortedLaws);
    }

    // Event listeners
    function setupEventListeners() {
      // Search on Enter key
      document.getElementById('lawSearch').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchLaws();
      });
      
      // Close modal on outside click
      document.getElementById('lawModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('law-modal')) {
          closeModal();
        }
      });
      
      // Close modal with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', init);