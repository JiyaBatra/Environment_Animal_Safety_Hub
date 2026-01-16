// Community Forums and Discussion Boards
// Issue #741

class EcoForums {
  constructor() {
    this.forumData = null;
    this.currentUser = {
      username: "EcoUser", // In real app, this would come from authentication
      role: "user",
      avatar: "https://picsum.photos/seed/avatar1/100"
    };

    this.init();
  }

  async init() {
    await this.loadForumData();
    this.setupEventListeners();
    this.renderCategories();
    this.renderRecentThreads();
    this.setupThemeToggle();
  }

  async loadForumData() {
    try {
      const response = await fetch('../../assets/data/forums.json');
      this.forumData = await response.json();
    } catch (error) {
      console.error('Error loading forum data:', error);
      // Fallback to empty data structure
      this.forumData = { categories: [], threads: [] };
    }
  }

  setupEventListeners() {
    // Create thread button
    const createBtn = document.getElementById('createThreadBtn');
    if (createBtn) {
      createBtn.addEventListener('click', () => this.openCreateThreadModal());
    }

    // Search functionality
    const searchInput = document.getElementById('forumSearch');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.handleSearch(searchInput.value));
    }

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });

    // Create thread form
    const createForm = document.getElementById('createThreadForm');
    if (createForm) {
      createForm.addEventListener('submit', (e) => this.handleCreateThread(e));
    }

    // Reply functionality
    const replyBtn = document.getElementById('submitReplyBtn');
    if (replyBtn) {
      replyBtn.addEventListener('click', () => this.handleAddReply());
    }

    // Moderation buttons
    this.setupModerationListeners();
  }

  setupModerationListeners() {
    const pinBtn = document.getElementById('pinThreadBtn');
    const lockBtn = document.getElementById('lockThreadBtn');
    const deleteBtn = document.getElementById('deleteThreadBtn');

    if (pinBtn) pinBtn.addEventListener('click', () => this.togglePinThread());
    if (lockBtn) lockBtn.addEventListener('click', () => this.toggleLockThread());
    if (deleteBtn) deleteBtn.addEventListener('click', () => this.deleteThread());
  }

  renderCategories() {
    const container = document.getElementById('forumCategories');
    if (!container || !this.forumData) return;

    container.innerHTML = this.forumData.categories.map(category => `
      <div class="forum-category" data-category="${category.id}" onclick="ecoForums.showCategory('${category.id}')">
        <div class="category-icon" style="background: ${category.color}">
          ${category.icon}
        </div>
        <div class="category-info">
          <h3 class="category-title">${category.name}</h3>
          <p class="category-description">${category.description}</p>
          <div class="category-stats">
            <span>${category.threads.length} threads</span>
          </div>
        </div>
        <div class="category-arrow">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    `).join('');
  }

  renderRecentThreads() {
    const container = document.getElementById('recentThreads');
    if (!container || !this.forumData) return;

    const recentThreads = this.forumData.threads
      .sort((a, b) => new Date(b.lastReply) - new Date(a.lastReply))
      .slice(0, 10);

    container.innerHTML = recentThreads.map(thread => `
      <div class="thread-item ${thread.pinned ? 'pinned' : ''}" onclick="ecoForums.openThread('${thread.id}')">
        ${thread.pinned ? '<div class="pin-indicator"><i class="fas fa-thumbtack"></i></div>' : ''}
        <div class="thread-avatar">
          <img src="${thread.authorAvatar}" alt="${thread.author}">
        </div>
        <div class="thread-content">
          <h4 class="thread-title">${thread.title}</h4>
          <div class="thread-meta">
            <span class="thread-author">by ${thread.author}</span>
            <span class="thread-category">${this.getCategoryName(thread.category)}</span>
            <span class="thread-stats">
              <i class="fas fa-reply"></i> ${thread.replies}
              <i class="fas fa-eye"></i> ${thread.views}
            </span>
          </div>
        </div>
        <div class="thread-date">
          ${this.formatDate(thread.lastReply)}
        </div>
      </div>
    `).join('');
  }

  showCategory(categoryId) {
    const category = this.forumData.categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const categoryThreads = this.forumData.threads.filter(thread => thread.category === categoryId);

    // For now, just show threads in that category
    const container = document.getElementById('recentThreads');
    container.innerHTML = `
      <div class="category-header">
        <button onclick="ecoForums.renderRecentThreads()" class="back-btn">
          <i class="fas fa-arrow-left"></i> Back to All Discussions
        </button>
        <h3>${category.icon} ${category.name}</h3>
        <p>${category.description}</p>
      </div>
      ${categoryThreads.map(thread => `
        <div class="thread-item ${thread.pinned ? 'pinned' : ''}" onclick="ecoForums.openThread('${thread.id}')">
          ${thread.pinned ? '<div class="pin-indicator"><i class="fas fa-thumbtack"></i></div>' : ''}
          <div class="thread-avatar">
            <img src="${thread.authorAvatar}" alt="${thread.author}">
          </div>
          <div class="thread-content">
            <h4 class="thread-title">${thread.title}</h4>
            <div class="thread-meta">
              <span class="thread-author">by ${thread.author}</span>
              <span class="thread-stats">
                <i class="fas fa-reply"></i> ${thread.replies}
                <i class="fas fa-eye"></i> ${thread.views}
              </span>
            </div>
          </div>
          <div class="thread-date">
            ${this.formatDate(thread.lastReply)}
          </div>
        </div>
      `).join('')}
    `;
  }

  openCreateThreadModal() {
    const modal = document.getElementById('createThreadModal');
    const categorySelect = document.getElementById('threadCategory');

    // Populate categories
    categorySelect.innerHTML = '<option value="">Select a category</option>' +
      this.forumData.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');

    modal.style.display = 'block';
  }

  handleCreateThread(e) {
    e.preventDefault();

    const title = document.getElementById('threadTitle').value.trim();
    const category = document.getElementById('threadCategory').value;
    const content = document.getElementById('threadContent').value.trim();

    if (!title || !category || !content) {
      alert('Please fill in all fields');
      return;
    }

    const newThread = {
      id: `thread_${Date.now()}`,
      title,
      content,
      author: this.currentUser.username,
      authorAvatar: this.currentUser.avatar,
      category,
      createdAt: new Date().toISOString(),
      lastReply: new Date().toISOString(),
      replies: 0,
      views: 0,
      likes: 0,
      pinned: false,
      locked: false,
      repliesList: []
    };

    this.forumData.threads.unshift(newThread);
    this.renderRecentThreads();
    this.closeModals();

    // Reset form
    e.target.reset();

    // Show success message
    this.showNotification('Discussion created successfully!', 'success');
  }

  openThread(threadId) {
    const thread = this.forumData.threads.find(t => t.id === threadId);
    if (!thread) return;

    // Update view count
    thread.views++;

    const modal = document.getElementById('threadModal');
    document.getElementById('threadTitleDisplay').textContent = thread.title;
    document.getElementById('threadAuthor').textContent = `by ${thread.author}`;
    document.getElementById('threadDate').textContent = this.formatDate(thread.createdAt);
    document.getElementById('threadCategoryDisplay').textContent = this.getCategoryName(thread.category);
    document.getElementById('threadContentDisplay').innerHTML = `<p>${thread.content}</p>`;
    document.getElementById('replyCount').textContent = thread.replies;

    this.renderReplies(thread);

    // Show moderation panel if user has permissions
    const modPanel = document.getElementById('moderationPanel');
    if (this.hasPermission('moderate')) {
      modPanel.style.display = 'block';
      this.currentModeratedThread = thread;
    } else {
      modPanel.style.display = 'none';
    }

    modal.style.display = 'block';
  }

  renderReplies(thread) {
    const container = document.getElementById('repliesList');
    if (!thread.repliesList || thread.repliesList.length === 0) {
      container.innerHTML = '<p class="no-replies">No replies yet. Be the first to share your thoughts!</p>';
      return;
    }

    container.innerHTML = thread.repliesList.map(reply => `
      <div class="reply-item">
        <div class="reply-avatar">
          <img src="${reply.authorAvatar}" alt="${reply.author}">
        </div>
        <div class="reply-content">
          <div class="reply-header">
            <span class="reply-author">${reply.author}</span>
            <span class="reply-date">${this.formatDate(reply.createdAt)}</span>
          </div>
          <div class="reply-text">${reply.content}</div>
          <div class="reply-actions">
            <button class="like-btn" onclick="ecoForums.likeReply('${reply.id}')">
              <i class="fas fa-heart"></i> ${reply.likes || 0}
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  handleAddReply() {
    const replyContent = document.getElementById('replyContent').value.trim();
    if (!replyContent) {
      alert('Please enter a reply');
      return;
    }

    const threadTitle = document.getElementById('threadTitleDisplay').textContent;
    const thread = this.forumData.threads.find(t => t.title === threadTitle);
    if (!thread) return;

    const newReply = {
      id: `reply_${Date.now()}`,
      content: replyContent,
      author: this.currentUser.username,
      authorAvatar: this.currentUser.avatar,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    thread.repliesList.push(newReply);
    thread.replies++;
    thread.lastReply = new Date().toISOString();

    this.renderReplies(thread);
    document.getElementById('replyCount').textContent = thread.replies;
    document.getElementById('replyContent').value = '';

    this.showNotification('Reply added successfully!', 'success');
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.renderRecentThreads();
      return;
    }

    const filteredThreads = this.forumData.threads.filter(thread =>
      thread.title.toLowerCase().includes(query.toLowerCase()) ||
      thread.content.toLowerCase().includes(query.toLowerCase()) ||
      thread.author.toLowerCase().includes(query.toLowerCase())
    );

    const container = document.getElementById('recentThreads');
    container.innerHTML = `
      <div class="search-results">
        <h3>Search Results for "${query}"</h3>
        <p>Found ${filteredThreads.length} discussions</p>
      </div>
      ${filteredThreads.map(thread => `
        <div class="thread-item" onclick="ecoForums.openThread('${thread.id}')">
          <div class="thread-avatar">
            <img src="${thread.authorAvatar}" alt="${thread.author}">
          </div>
          <div class="thread-content">
            <h4 class="thread-title">${this.highlightSearch(thread.title, query)}</h4>
            <div class="thread-meta">
              <span class="thread-author">by ${thread.author}</span>
              <span class="thread-category">${this.getCategoryName(thread.category)}</span>
              <span class="thread-stats">
                <i class="fas fa-reply"></i> ${thread.replies}
              </span>
            </div>
          </div>
          <div class="thread-date">
            ${this.formatDate(thread.lastReply)}
          </div>
        </div>
      `).join('')}
    `;
  }

  highlightSearch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Moderation functions
  togglePinThread() {
    if (!this.currentModeratedThread) return;
    this.currentModeratedThread.pinned = !this.currentModeratedThread.pinned;
    this.showNotification(`Thread ${this.currentModeratedThread.pinned ? 'pinned' : 'unpinned'}!`, 'info');
  }

  toggleLockThread() {
    if (!this.currentModeratedThread) return;
    this.currentModeratedThread.locked = !this.currentModeratedThread.locked;
    this.showNotification(`Thread ${this.currentModeratedThread.locked ? 'locked' : 'unlocked'}!`, 'info');
  }

  deleteThread() {
    if (!this.currentModeratedThread) return;
    if (!confirm('Are you sure you want to delete this thread? This action cannot be undone.')) return;

    const index = this.forumData.threads.findIndex(t => t.id === this.currentModeratedThread.id);
    if (index > -1) {
      this.forumData.threads.splice(index, 1);
      this.closeModals();
      this.renderRecentThreads();
      this.showNotification('Thread deleted successfully!', 'success');
    }
  }

  hasPermission(action) {
    const userRole = this.forumData.users[this.currentUser.role] || this.forumData.users.user;
    return userRole.permissions.includes(action);
  }

  // Utility functions
  getCategoryName(categoryId) {
    const category = this.forumData.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }

  showNotification(message, type = 'info') {
    // Simple notification - in real app, use a proper notification system
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('forum-theme', isDark ? 'dark' : 'light');
      });

      // Load saved theme
      const savedTheme = localStorage.getItem('forum-theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
      }
    }
  }
}

// Initialize forums when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.ecoForums = new EcoForums();
});