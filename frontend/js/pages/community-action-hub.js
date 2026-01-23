/**
 * Community Action Hub - JavaScript
 * Handles interactive map, event management, RSVP system, and filters
 */

// ============================================
// Sample Events Data (Simulating API/Database)
// ============================================
const sampleEvents = [
    {
        id: 1,
        title: "Beach Cleanup Drive at Marina",
        category: "cleanup",
        date: "2026-02-15",
        time: "07:00",
        location: "Marina Beach, Chennai",
        description: "Join us for a massive beach cleanup initiative! We'll be collecting plastic waste, educating visitors, and making our beaches beautiful again. Bring gloves and wear comfortable clothes.",
        lat: 13.0475,
        lng: 80.2824,
        organizer: "Green Chennai Foundation",
        contact: "contact@greenchennai.org",
        capacity: 100,
        attendees: 67,
        featured: true,
        image: "https://images.unsplash.com/photo-1567393528677-d6adae7d4a0a?w=400"
    },
    {
        id: 2,
        title: "Tree Plantation Drive - Urban Forest",
        category: "plantation",
        date: "2026-02-20",
        time: "09:00",
        location: "Cubbon Park, Bangalore",
        description: "Help us plant 500 native trees in Cubbon Park! We're creating an urban forest to improve air quality and provide habitat for birds. Tools and saplings will be provided.",
        lat: 12.9763,
        lng: 77.5929,
        organizer: "Bangalore Green Initiative",
        contact: "+91 9876543210",
        capacity: 200,
        attendees: 142,
        featured: true,
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400"
    },
    {
        id: 3,
        title: "Wildlife Conservation Workshop",
        category: "workshop",
        date: "2026-02-25",
        time: "10:00",
        location: "Nature Center, Mumbai",
        description: "Learn about India's endangered species and what you can do to help. Interactive sessions, documentaries, and expert talks included. Perfect for families with children!",
        lat: 19.0760,
        lng: 72.8777,
        organizer: "Wildlife Warriors India",
        contact: "info@wildlifewarriors.in",
        capacity: 50,
        attendees: 38,
        featured: true,
        image: "https://images.unsplash.com/photo-1683805056985-569848fc7503?q=80&w=1636&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 4,
        title: "Stray Animal Feeding & Care",
        category: "animal-care",
        date: "2026-02-18",
        time: "06:30",
        location: "Koramangala, Bangalore",
        description: "Join our weekly stray feeding program. We provide food and basic medical care to street dogs and cats. Learn how to safely approach and care for stray animals.",
        lat: 12.9352,
        lng: 77.6245,
        organizer: "Compassionate Bangalore",
        contact: "+91 8765432109",
        capacity: 30,
        attendees: 22,
        featured: false,
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400"
    },
    {
        id: 5,
        title: "River Bank Cleanup - Yamuna",
        category: "cleanup",
        date: "2026-03-01",
        time: "08:00",
        location: "Yamuna Ghat, Delhi",
        description: "Help restore the glory of Yamuna river! Join hundreds of volunteers in our biggest cleanup drive. Transportation and refreshments provided.",
        lat: 28.6692,
        lng: 77.2295,
        organizer: "Clean Delhi Movement",
        contact: "cleanup@cleandelhimovement.org",
        capacity: 500,
        attendees: 287,
        featured: true,
        image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=400"
    },
    {
        id: 6,
        title: "Composting Workshop for Beginners",
        category: "workshop",
        date: "2026-02-22",
        time: "15:00",
        location: "Community Center, Pune",
        description: "Learn how to convert kitchen waste into nutrient-rich compost. Hands-on workshop with take-home composting starter kit. Registration required.",
        lat: 18.5204,
        lng: 73.8567,
        organizer: "Zero Waste Pune",
        contact: "workshops@zerowastepune.com",
        capacity: 40,
        attendees: 35,
        featured: false,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },
    {
        id: 7,
        title: "Bird Sanctuary Visit & Bird Count",
        category: "animal-care",
        date: "2026-02-28",
        time: "06:00",
        location: "Keoladeo National Park, Bharatpur",
        description: "Join our annual bird counting event at the famous Keoladeo sanctuary. Experts will guide you in identifying species. Binoculars available for rent.",
        lat: 27.1597,
        lng: 77.5313,
        organizer: "Birders of India",
        contact: "events@birdersofindia.org",
        capacity: 60,
        attendees: 45,
        featured: false,
        image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400"
    },
    {
        id: 8,
        title: "Mangrove Plantation Drive",
        category: "plantation",
        date: "2026-03-05",
        time: "07:30",
        location: "Sundarbans, West Bengal",
        description: "Help protect India's coastline by planting mangroves. This unique ecosystem supports countless species and protects against storm surges. Adventure and conservation combined!",
        lat: 21.9497,
        lng: 89.1833,
        organizer: "Coastal Conservation Society",
        contact: "+91 7654321098",
        capacity: 80,
        attendees: 52,
        featured: false,
        image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400"
    }
];

function getMapContainerId() {
  if (document.getElementById('eventsMap')) return 'eventsMap';
  if (document.getElementById('events-map')) return 'events-map';
  return null;
}

const PAGE = {
  LIST: !!document.getElementById('eventsList'),
  GRID: !!document.getElementById('eventsGrid')
};




// ============================================
// Global Variables
// ============================================
let map = null;
let markers = [];
let filteredEvents = [...sampleEvents];
let userRSVPs = JSON.parse(localStorage.getItem('userRSVPs')) || [];

// ============================================
// Category Configuration
// ============================================
const categoryConfig = {
    cleanup: { icon: 'fa-broom', color: '#ef4444', emoji: '🧹' },
    plantation: { icon: 'fa-tree', color: '#10b981', emoji: '🌳' },
    workshop: { icon: 'fa-chalkboard-user', color: '#3b82f6', emoji: '📚' },
    'animal-care': { icon: 'fa-paw', color: '#f59e0b', emoji: '🐾' }
};

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Initialize components
    initializeMap();
    renderEvents();
    renderFeaturedEvents();
    setupEventListeners();
    animateStats();
    createHeroParticles();

    // Set minimum date for date filters
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateFilter').min = today;
    document.getElementById('eventDate').min = today;
});

// ============================================
// Map Initialization
// ============================================
function initializeMap() {
  const mapId = getMapContainerId();
  if (!mapId) {
    console.warn('No map container found on this page');
    return;
  }

  map = L.map(mapId).setView([20.5937, 78.9629], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  addMarkersToMap(filteredEvents);
}


function addMarkersToMap(events) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    events.forEach(event => {
        const config = categoryConfig[event.category];

        // Create custom icon
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-icon ${event.category}"><i class="fa-solid ${config.icon}"></i></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        // Create marker
        const marker = L.marker([event.lat, event.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(createPopupContent(event));

        // Add click event
        marker.on('click', () => {
            setTimeout(() => {
                const popupBtn = document.querySelector(`.popup-rsvp-btn[data-id="${event.id}"]`);
                if (popupBtn) {
                    popupBtn.addEventListener('click', () => showEventDetails(event.id));
                }
            }, 100);
        });

        markers.push(marker);
    });

    // Fit map to show all markers if there are events
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2));
    }
}

function createPopupContent(event) {
    const config = categoryConfig[event.category];
    const formattedDate = formatDate(event.date);

    return `
    <div class="popup-content">
      <h4>${event.title}</h4>
      <p><i class="fa-solid fa-calendar" style="color: ${config.color}"></i> ${formattedDate}</p>
      <p><i class="fa-solid fa-location-dot" style="color: ${config.color}"></i> ${event.location}</p>
      <p><i class="fa-solid fa-users" style="color: ${config.color}"></i> ${event.attendees}/${event.capacity} attending</p>
      <button class="btn btn-primary popup-rsvp-btn" data-id="${event.id}">View Details</button>
    </div>
  `;
}

// ============================================
// Events List Rendering
// ============================================
function renderEvents() {
  const eventsList = document.getElementById('eventsList');
  const eventsGrid = document.getElementById('eventsGrid');
  const eventsCount = document.getElementById('eventsCount');

  // 🔹 Page does not support list layout
  if (!eventsList && !eventsGrid) {
    return;
  }

  const html = filteredEvents.map(event => createEventCard(event)).join('');

  if (eventsList) {
    eventsList.innerHTML = html;
    if (eventsCount) {
      eventsCount.textContent = `${filteredEvents.length} events found`;
    }
  }

  if (eventsGrid) {
    eventsGrid.innerHTML = html;
  }

  document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', () => {
      showEventDetails(Number(card.dataset.id));
    });
  });
}

function createEventCard(event) {
    const config = categoryConfig[event.category];
    const formattedDate = formatDate(event.date);
    const categoryName = event.category.replace('-', ' ');

    return `
    <div class="event-card ${event.category}" data-id="${event.id}">
      <div class="event-card-header">
        <span class="event-category ${event.category}">${config.emoji} ${categoryName}</span>
        <span class="event-attendees">
          <i class="fa-solid fa-users"></i> ${event.attendees}/${event.capacity}
        </span>
      </div>
      <h3 class="event-title">${event.title}</h3>
      <div class="event-meta">
        <span><i class="fa-solid fa-calendar"></i> ${formattedDate}</span>
        <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
        <span><i class="fa-solid fa-location-dot"></i> ${event.location.split(',')[0]}</span>
      </div>
    </div>
  `;
}

// ============================================
// Featured Events Rendering
// ============================================
function renderFeaturedEvents() {
    const featuredList = document.getElementById('featuredEventsList');
    const featuredEvents = sampleEvents.filter(event => event.featured);

    featuredList.innerHTML = featuredEvents.map(event => createFeaturedEventCard(event)).join('');

    // Add event listeners
    document.querySelectorAll('.featured-rsvp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleRSVP(parseInt(btn.dataset.id));
        });
    });

    document.querySelectorAll('.featured-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showEventDetails(parseInt(btn.dataset.id));
        });
    });
}

function createFeaturedEventCard(event) {
    const config = categoryConfig[event.category];
    const formattedDate = formatDate(event.date);
    const isRegistered = userRSVPs.includes(event.id);

    return `
    <div class="featured-event-card" data-aos="fade-up">
      <div class="featured-event-image">
        <img src="${event.image}" alt="${event.title}" loading="lazy">
        <div class="featured-event-overlay">
          <span class="featured-badge">
            <i class="fa-solid fa-star"></i> Featured
          </span>
          <span class="event-category ${event.category}">${config.emoji}</span>
        </div>
      </div>
      <div class="featured-event-content">
        <h3>${event.title}</h3>
        <p>${event.description.substring(0, 120)}...</p>
        <div class="featured-event-details">
          <span><i class="fa-solid fa-calendar"></i> ${formattedDate}</span>
          <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
          <span><i class="fa-solid fa-location-dot"></i> ${event.location.split(',')[0]}</span>
          <span><i class="fa-solid fa-users"></i> ${event.attendees}/${event.capacity}</span>
        </div>
        <div class="featured-event-actions">
          <button class="btn btn-rsvp featured-rsvp-btn" data-id="${event.id}" ${isRegistered ? 'disabled' : ''}>
            <i class="fa-solid ${isRegistered ? 'fa-check' : 'fa-hand'}"></i> 
            ${isRegistered ? 'Registered' : 'RSVP Now'}
          </button>
          <button class="btn btn-details featured-details-btn" data-id="${event.id}">
            <i class="fa-solid fa-eye"></i> Details
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Event Details Modal
// ============================================
function showEventDetails(eventId) {
    const event = sampleEvents.find(e => e.id === eventId);
    if (!event) return;

    const modal = document.getElementById('eventDetailsModal');
    const content = document.getElementById('eventDetailsContent');
    const config = categoryConfig[event.category];
    const formattedDate = formatDate(event.date);
    const isRegistered = userRSVPs.includes(event.id);
    const categoryName = event.category.replace('-', ' ');

    // Generate random attendee initials
    const attendeeInitials = ['A', 'B', 'C', 'D', 'E'].slice(0, Math.min(5, event.attendees));

    content.innerHTML = `
    <div class="event-details-header">
      <span class="event-details-badge">${config.emoji} ${categoryName}</span>
      <h2>${event.title}</h2>
    </div>

    <div class="event-details-info">
      <div class="event-detail-item">
        <i class="fa-solid fa-calendar"></i>
        <div class="detail-content">
          <h4>Date & Time</h4>
          <p>${formattedDate} at ${event.time}</p>
        </div>
      </div>

      <div class="event-detail-item">
        <i class="fa-solid fa-location-dot"></i>
        <div class="detail-content">
          <h4>Location</h4>
          <p>${event.location}</p>
        </div>
      </div>

      <div class="event-detail-item">
        <i class="fa-solid fa-user"></i>
        <div class="detail-content">
          <h4>Organizer</h4>
          <p>${event.organizer}</p>
        </div>
      </div>

      <div class="event-detail-item">
        <i class="fa-solid fa-phone"></i>
        <div class="detail-content">
          <h4>Contact</h4>
          <p>${event.contact}</p>
        </div>
      </div>
    </div>

    <div class="event-description">
      <h4><i class="fa-solid fa-align-left"></i> About This Event</h4>
      <p>${event.description}</p>
    </div>

    <div class="event-attendees-section">
      <h4><i class="fa-solid fa-users"></i> Attendees (${event.attendees}/${event.capacity})</h4>
      <div class="attendees-avatars">
        ${attendeeInitials.map(initial => `<div class="attendee-avatar">${initial}</div>`).join('')}
        ${event.attendees > 5 ? `<span class="attendee-count">+${event.attendees - 5} more</span>` : ''}
      </div>
    </div>

    <div class="event-details-actions">
      <button class="btn btn-share" onclick="shareEvent(${event.id})">
        <i class="fa-solid fa-share-nodes"></i> Share
      </button>
      <button class="btn btn-primary detail-rsvp-btn" data-id="${event.id}" ${isRegistered ? 'disabled' : ''}>
        <i class="fa-solid ${isRegistered ? 'fa-check' : 'fa-hand'}"></i> 
        ${isRegistered ? 'Already Registered' : 'RSVP for This Event'}
      </button>
    </div>
  `;

    // Add RSVP button listener
    content.querySelector('.detail-rsvp-btn')?.addEventListener('click', () => {
        handleRSVP(eventId);
        closeModal('eventDetailsModal');
    });

    openModal('eventDetailsModal');
}

// ============================================
// RSVP Handling
// ============================================
function handleRSVP(eventId) {
    if (userRSVPs.includes(eventId)) {
        showToast('You are already registered for this event!');
        return;
    }

    // Add to RSVPs
    userRSVPs.push(eventId);
    localStorage.setItem('userRSVPs', JSON.stringify(userRSVPs));

    // Update UI
    const event = sampleEvents.find(e => e.id === eventId);
    if (event) {
        event.attendees += 1;
    }

    // Refresh all event displays
    renderEvents();
    renderFeaturedEvents();
    addMarkersToMap(filteredEvents);

    showToast(`🎉 You've registered for "${event?.title}"! See you there!`);
}

// ============================================
// Filter Functionality
// ============================================
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const locationFilter = document.getElementById('locationFilter').value.toLowerCase().trim();
    const dateFilter = document.getElementById('dateFilter').value;

    filteredEvents = sampleEvents.filter(event => {
        // Category filter
        if (categoryFilter !== 'all' && event.category !== categoryFilter) {
            return false;
        }

        // Location filter
        if (locationFilter && !event.location.toLowerCase().includes(locationFilter)) {
            return false;
        }

        // Date filter
        if (dateFilter && event.date !== dateFilter) {
            return false;
        }

        return true;
    });

    renderEvents();
    addMarkersToMap(filteredEvents);

    // Scroll to events section
    document.getElementById('eventsSection').scrollIntoView({ behavior: 'smooth' });
}

function clearFilters() {
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('locationFilter').value = '';
    document.getElementById('dateFilter').value = '';

    filteredEvents = [...sampleEvents];
    renderEvents();
    addMarkersToMap(filteredEvents);
}

// ============================================
// Create Event Form
// ============================================
function handleCreateEvent(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newEvent = {
        id: sampleEvents.length + 1 + Date.now(),
        title: formData.get('title'),
        category: formData.get('category'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        description: formData.get('description'),
        contact: formData.get('contact') || 'Not provided',
        capacity: parseInt(formData.get('capacity')) || 50,
        attendees: 1, // Creator is first attendee
        featured: false,
        organizer: 'You',
        lat: 20.5937 + (Math.random() - 0.5) * 10, // Random location for demo
        lng: 78.9629 + (Math.random() - 0.5) * 10,
        image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400'
    };

    // Add to events
    sampleEvents.push(newEvent);
    filteredEvents = [...sampleEvents];

    // Auto-RSVP creator
    userRSVPs.push(newEvent.id);
    localStorage.setItem('userRSVPs', JSON.stringify(userRSVPs));

    // Refresh UI
    renderEvents();
    addMarkersToMap(filteredEvents);

    // Close modal and show success
    closeModal('createEventModal');
    e.target.reset();
    showToast(`🎉 Event "${newEvent.title}" created successfully!`);

    // Scroll to events section
    setTimeout(() => {
        document.getElementById('eventsSection').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// ============================================
// Modal Controls
// ============================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// Toast Notification
// ============================================
function showToast(message) {
    const toast = document.getElementById('rsvpToast');
    const messageEl = document.getElementById('toastMessage');

    messageEl.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ============================================
// Share Event
// ============================================
function shareEvent(eventId) {
    const event = sampleEvents.find(e => e.id === eventId);
    if (!event) return;

    const shareData = {
        title: event.title,
        text: `Join me at "${event.title}" on ${formatDate(event.date)}! 🌍`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        showToast('📋 Event link copied to clipboard!');
    }
}

// ============================================
// Utility Functions
// ============================================
function formatDate(dateString) {
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(start + (end - start) * easeOut);

        element.textContent = value.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end.toLocaleString() + '+';
        }
    }

    requestAnimationFrame(update);
}

function createHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: rgba(16, 185, 129, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
        container.appendChild(particle);
    }

    // Add CSS animation if not exists
    if (!document.getElementById('particleAnimation')) {
        const style = document.createElement('style');
        style.id = 'particleAnimation';
        style.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px); opacity: 0; }
      }
    `;
        document.head.appendChild(style);
    }
}

// ============================================
// Event Listeners Setup
// ============================================
function setupEventListeners() {
    // Create Event Modal
    document.getElementById('createEventBtn')?.addEventListener('click', () => openModal('createEventModal'));
    document.getElementById('ctaCreateEventBtn')?.addEventListener('click', () => openModal('createEventModal'));
    document.getElementById('closeModalBtn')?.addEventListener('click', () => closeModal('createEventModal'));
    document.getElementById('cancelEventBtn')?.addEventListener('click', () => closeModal('createEventModal'));

    // Event Details Modal
    document.getElementById('closeDetailsModalBtn')?.addEventListener('click', () => closeModal('eventDetailsModal'));

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Event Form submission
    document.getElementById('eventForm')?.addEventListener('submit', handleCreateEvent);

    // Filter controls
    document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
    document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);

    // Explore Events button
    document.getElementById('exploreEventsBtn')?.addEventListener('click', () => {
        document.getElementById('eventsSection').scrollIntoView({ behavior: 'smooth' });
    });

    // Enter key on location filter
    document.getElementById('locationFilter')?.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') applyFilters();
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}








// Export functions for global access
window.shareEvent = shareEvent;
