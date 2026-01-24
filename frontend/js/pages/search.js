// ===== GLOBAL SEARCH FUNCTIONALITY =====

class GlobalSearch {
  constructor() {
    this.searchIndex = [];
    this.isInitialized = false;
  }

  // Initialize search by loading all data
  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.loadSearchData();
      this.setupEventListeners();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize search:', error);
    }
  }

  // Load all searchable data
  async loadSearchData() {
    const dataPromises = [
      this.loadEndangeredAnimals(),
      this.loadQuizData(),
      this.loadPlantCareTips(),
      this.loadForumPosts(),
      this.loadOtherContent()
    ];

    await Promise.all(dataPromises);
  }

  // Load endangered animals data
  async loadEndangeredAnimals() {
    try {
      const response = await fetch('../assets/data/endangered-animals.json');
      const animals = await response.json();

      animals.forEach(animal => {
        this.searchIndex.push({
          id: `animal-${animal.id}`,
          category: 'Endangered Animals',
          title: animal.name,
          content: `${animal.description} ${animal.facts.join(' ')} ${animal.threats.join(' ')}`,
          url: `animal-safety/endangered-animals.html?id=${animal.id}`,
          image: animal.image,
          meta: `${animal.statusText} • ${animal.population} remaining`
        });
      });
    } catch (error) {
      console.error('Failed to load endangered animals:', error);
    }
  }

  // Load quiz data from various quiz files
  async loadQuizData() {
    // Temporarily simplified - add static quiz content
    const quizContent = [
      { category: 'Plant Care Quiz', title: 'How often should plants be watered?', content: 'Every hour, Only when soil is dry, Never, Once a year', url: 'quizzes/plant-care-quiz.html' },
      { category: 'Environment Quiz', title: 'What is the main cause of climate change?', content: 'Natural cycles, Human activities, Solar flares, Volcanic eruptions', url: 'quizzes/environment-awareness-quiz.html' },
      { category: 'Climate Change Quiz', title: 'What is the greenhouse effect?', content: 'Plants growing in greenhouses, Trapping heat in atmosphere, Cooling the planet, Creating oxygen', url: 'quizzes/climate-change-quiz.html' }
    ];

    quizContent.forEach((quiz, index) => {
      this.searchIndex.push({
        id: `quiz-${index}`,
        category: quiz.category,
        title: quiz.title,
        content: quiz.content,
        url: quiz.url,
        meta: 'Interactive Quiz'
      });
    });
  }

  // Load plant care tips from HTML content
  async loadPlantCareTips() {
    try {
      const response = await fetch('../pages/plant-care.html');
      const html = await response.text();

      // Extract text content from plant care page
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const sections = doc.querySelectorAll('.info-card, .split-box');
      sections.forEach((section, index) => {
        const title = section.querySelector('h3')?.textContent || '';
        const content = section.textContent || '';

        if (title && content) {
          this.searchIndex.push({
            id: `plant-care-${index}`,
            category: 'Plant Care',
            title: title,
            content: content,
            url: 'plant-care.html',
            meta: 'Gardening Tips'
          });
        }
      });
    } catch (error) {
      console.error('Failed to load plant care tips:', error);
    }
  }

  // Load forum posts
  async loadForumPosts() {
    try {
      const response = await fetch('../assets/data/forums.json');
      const data = await response.json();

      data.threads.forEach(thread => {
        this.searchIndex.push({
          id: `forum-${thread.id}`,
          category: 'Community Forums',
          title: thread.title,
          content: thread.content,
          url: `community/forums.html?thread=${thread.id}`,
          meta: `By ${thread.author.name} • ${thread.replies || 0} replies`
        });
      });
    } catch (error) {
      console.error('Failed to load forum posts:', error);
    }
  }

  // Load other content (blogs, etc.)
  async loadOtherContent() {
    // Add static content entries
    const staticContent = [
      {
        id: 'virtual-garden',
        category: 'Education',
        title: 'Virtual Garden',
        content: 'Learn about different plants and gardening techniques in our interactive virtual garden.',
        url: 'virtual-garden.html',
        meta: 'Interactive Learning'
      },
      {
        id: 'feeding-awareness',
        category: 'Education',
        title: 'Feeding Awareness',
        content: 'Understand proper feeding practices for wildlife and pets.',
        url: 'feeding-awareness.html',
        meta: 'Animal Care'
      },
      {
        id: 'impact-calculator',
        category: 'Tools',
        title: 'Impact Calculator',
        content: 'Calculate your environmental impact and learn how to reduce it.',
        url: 'impact-calculator.html',
        meta: 'Sustainability Tool'
      }
    ];

    this.searchIndex.push(...staticContent);
  }

  // Setup event listeners
  setupEventListeners() {
    // Handle search form submission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
          this.performSearch(query);
        }
      });
    }

    // Handle URL parameters for search results page
    if (window.location.pathname.includes('search.html')) {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q');
      if (query) {
        this.displaySearchResults(query);
      }
    }
  }

  // Perform search
  performSearch(query) {
    // Redirect to search results page with query
    window.location.href = `pages/search.html?q=${encodeURIComponent(query)}`;
  }

  // Display search results
  displaySearchResults(query) {
    const resultsContainer = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const searchQuery = document.getElementById('searchQuery');
    const resultsCount = document.getElementById('resultsCount');

    if (!resultsContainer) return;

    searchQuery.textContent = `Searching for: "${query}"`;

    const results = this.search(query.toLowerCase());

    if (results.length === 0) {
      resultsContainer.innerHTML = '';
      noResults.style.display = 'block';
      resultsCount.textContent = '';
      return;
    }

    noResults.style.display = 'none';
    resultsCount.textContent = `${results.length} result${results.length === 1 ? '' : 's'} found`;

    resultsContainer.innerHTML = results.map(result => this.createResultCard(result)).join('');
  }

  // Search function
  search(query) {
    return this.searchIndex.filter(item => {
      const searchableText = `${item.title} ${item.content} ${item.category}`.toLowerCase();
      return searchableText.includes(query);
    });
  }

  // Create result card HTML
  createResultCard(result) {
    return `
      <div class="search-result-card" onclick="window.location.href='${result.url}'">
        <span class="result-category">${result.category}</span>
        <h3 class="result-title">${this.highlightSearchTerm(result.title, this.getCurrentQuery())}</h3>
        <p class="result-content">${this.truncateContent(result.content, 150)}</p>
        <div class="result-meta">
          <span>${result.meta || ''}</span>
          <a href="${result.url}" class="result-link" onclick="event.stopPropagation()">View <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `;
  }

  // Get current search query
  getCurrentQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  }

  // Highlight search terms in text
  highlightSearchTerm(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Truncate content
  truncateContent(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const search = new GlobalSearch();
  search.initialize();
});

// Export for global access
window.GlobalSearch = GlobalSearch;