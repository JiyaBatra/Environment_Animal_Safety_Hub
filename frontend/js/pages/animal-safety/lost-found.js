// Lost & Found Pets Page JavaScript

let allAlerts = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeElements();
    initializeEventListeners();
    initializeFormHandlers();
    initializeAOS();
    loadPetsData();
});

// Initialize elements
function initializeElements() {
    // Initialize theme
    setupThemeToggle();
}

// Initialize event listeners
function initializeEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.alert-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            switchTab(this.dataset.tab);
        });
    });

    // Filter search
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', filterAlerts);
    }

    // Load More
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreAlerts);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeContactModal();
            }
        });
    }
}

// Initialize form handlers
function initializeFormHandlers() {
    // Lost Pet Form
    const lostForm = document.getElementById('lostPetForm');
    if (lostForm) {
        lostForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitLostPetForm();
        });
    }

    // Found Pet Form
    const foundForm = document.getElementById('foundPetForm');
    if (foundForm) {
        foundForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitFoundPetForm();
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitContactForm();
        });
    }
}

// Switch tab
function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.alert-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });

    // Filter and display alerts
    filterAlertsByTab(tabName);
}

// Filter alerts by category
function filterAlertsByTab(category) {
    const alertsGrid = document.getElementById('alertsGrid');
    const cards = alertsGrid.querySelectorAll('.alert-card');

    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = '';
        } else if (card.dataset.category === category) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });

    // Add animation
    cards.forEach((card, index) => {
        if (card.style.display !== 'none') {
            card.style.animation = `fadeIn 0.3s ease ${index * 0.1}s both`;
        }
    });
}

// Filter alerts
function filterAlerts() {
    const alertType = document.getElementById('alertType')?.value || '';
    const species = document.getElementById('species')?.value || '';
    const location = document.getElementById('location')?.value.toLowerCase() || '';
    const urgency = document.getElementById('urgency')?.value || '';

    const alertsGrid = document.getElementById('alertsGrid');
    const cards = alertsGrid.querySelectorAll('.alert-card');

    let visibleCount = 0;

    cards.forEach((card, index) => {
        let matches = true;

        // Check alert type
        if (alertType && card.dataset.category !== alertType) {
            matches = false;
        }

        // Check species (not implemented in demo data but ready for backend)
        // Check location (would need to parse from card)
        // Check urgency (would need to parse from card)

        card.style.display = matches ? '' : 'none';
        if (matches) {
            card.style.animation = `fadeIn 0.3s ease ${visibleCount * 0.1}s both`;
            visibleCount++;
        }
    });

    showNotification(`Found ${visibleCount} matching alerts`, 'info');
}

// Load more alerts
function loadMoreAlerts() {
    showNotification('Loading more alerts...', 'info');
    // In a real app, this would fetch more data from the backend
    setTimeout(() => {
        showNotification('No more alerts available', 'info');
    }, 1000);
}

// Submit lost pet form
function submitLostPetForm() {
    const formData = {
        type: 'lost',
        petName: document.getElementById('lostPetName').value,
        species: document.getElementById('lostSpecies').value,
        breed: document.getElementById('lostBreed').value,
        age: document.getElementById('lostAge').value,
        gender: document.getElementById('lostGender').value,
        location: document.getElementById('lostLocation').value,
        date: document.getElementById('lostDate').value,
        time: document.getElementById('lostTime').value,
        description: document.getElementById('lostDescription').value,
        photos: document.getElementById('lostPhotos').files,
        contactName: document.getElementById('contactName').value,
        contactPhone: document.getElementById('contactPhone').value,
        contactEmail: document.getElementById('contactEmail').value
    };

    // Validate form
    if (!formData.petName || !formData.species || !formData.location || !formData.date || !formData.description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Save to localStorage (in real app, send to backend)
    const alerts = JSON.parse(localStorage.getItem('petAlerts') || '[]');
    alerts.push({
        ...formData,
        id: Date.now(),
        submitted: new Date().toISOString()
    });
    localStorage.setItem('petAlerts', JSON.stringify(alerts));

    showNotification('Lost pet alert submitted successfully! We\'ll notify the community.', 'success');
    document.getElementById('lostPetForm').reset();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Submit found pet form
function submitFoundPetForm() {
    const formData = {
        type: 'found',
        species: document.getElementById('foundSpecies').value,
        breed: document.getElementById('foundBreed').value,
        age: document.getElementById('foundAge').value,
        gender: document.getElementById('foundGender').value,
        location: document.getElementById('foundLocation').value,
        date: document.getElementById('foundDate').value,
        time: document.getElementById('foundTime').value,
        description: document.getElementById('foundDescription').value,
        photos: document.getElementById('foundPhotos').files,
        status: document.querySelector('input[name="foundStatus"]:checked').value,
        contactName: document.getElementById('foundContactName').value,
        contactPhone: document.getElementById('foundContactPhone').value,
        contactEmail: document.getElementById('foundContactEmail').value
    };

    // Validate form
    if (!formData.species || !formData.location || !formData.date || !formData.description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Save to localStorage (in real app, send to backend)
    const alerts = JSON.parse(localStorage.getItem('petAlerts') || '[]');
    alerts.push({
        ...formData,
        id: Date.now(),
        submitted: new Date().toISOString()
    });
    localStorage.setItem('petAlerts', JSON.stringify(alerts));

    showNotification('Found pet alert submitted! We\'ll help find the owner.', 'success');
    document.getElementById('foundPetForm').reset();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Submit contact form
function submitContactForm() {
    const formData = {
        senderName: document.getElementById('senderName').value,
        senderEmail: document.getElementById('senderEmail').value,
        senderPhone: document.getElementById('senderPhone').value,
        message: document.getElementById('message').value
    };

    // Validate form
    if (!formData.senderName || !formData.senderEmail || !formData.senderPhone || !formData.message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Save message to localStorage (in real app, send to backend)
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({
        ...formData,
        id: Date.now(),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    showNotification('Message sent! The reporter will review it and contact you.', 'success');
    document.getElementById('contactForm').reset();
    closeContactModal();
}

// Open contact modal
function openContactModal(alertId) {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('active');
        // Store the alert ID for reference when submitting
        modal.dataset.alertId = alertId;
    }
}

// Close contact modal
function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Share alert
function shareAlert(alertId) {
    const alertCard = document.querySelector(`[data-alert-id="${alertId}"]`) || 
                      document.querySelector(`button[onclick*="${alertId}"]`).closest('.alert-card');
    
    const alertTitle = alertCard?.querySelector('h3')?.textContent || 'Lost & Found Pet Alert';
    const shareText = `Check out this pet alert on EcoLife: ${alertTitle}`;
    const shareUrl = window.location.href;

    // Use native share API if available
    if (navigator.share) {
        navigator.share({
            title: 'EcoLife - Lost & Found Pets',
            text: shareText,
            url: shareUrl
        }).catch(() => {
            // Fallback to copy link
            copyToClipboard(shareUrl);
        });
    } else {
        // Fallback: copy to clipboard
        copyToClipboard(shareUrl);
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Link copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy link', 'error');
    });
}

// Load pets data
function loadPetsData() {
    // In a real app, this would fetch from the backend
    // For now, the data is hardcoded in the HTML
    const alertsGrid = document.getElementById('alertsGrid');
    if (alertsGrid) {
        // Count stats
        const lostAlerts = alertsGrid.querySelectorAll('.alert-card.lost').length;
        const foundAlerts = alertsGrid.querySelectorAll('.alert-card.found').length;
        const reunitedAlerts = alertsGrid.querySelectorAll('.alert-card.reunited').length;

        // Update stats if they exist
        const lostCount = document.querySelector('[data-count="45"]');
        if (lostCount) {
            animateCounter(lostCount, lostAlerts);
        }
    }
}

// Animate counter
function animateCounter(element, targetValue) {
    let currentValue = 0;
    const increment = Math.ceil(targetValue / 20);
    
    const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(interval);
        }
        element.textContent = currentValue;
    }, 50);
}

// Setup theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#51cf66' : type === 'error' ? '#ff6b6b' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize AOS
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
}

// Add animations to style
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .btn-sm {
        padding: 8px 12px;
        font-size: 0.85rem;
    }
`;
document.head.appendChild(style);
