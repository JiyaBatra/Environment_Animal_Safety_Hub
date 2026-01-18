/**
 * Event Calendar JavaScript
 *
 * Interactive calendar system for eco-friendly events using FullCalendar library.
 * Features event filtering, RSVP functionality, Google Calendar export, and
 * accessibility enhancements for environmental awareness events.
 *
 * Features:
 * - FullCalendar integration with multiple view modes
 * - Event filtering by type, location, and date range
 * - RSVP system with form validation
 * - Google Calendar export functionality
 * - Search functionality across events
 * - Accessibility features and keyboard navigation
 * - Responsive design with lazy loading
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 * @requires FullCalendar
 * @requires eventCalendarData (from event-calendar-data.js)
 */

// Global variables
let calendar;
let currentFilter = {
    type: 'all',
    location: 'all',
    dateRange: 'all'
};

// Initialize all calendar features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventCalendar();
    initializeFilters();
    initializeRSVPModal();
    initializeExportFunctionality();
});

/**
 * Initialize FullCalendar with eco-friendly events
 */
function initializeEventCalendar() {
    const calendarEl = document.getElementById('event-calendar');

    if (!calendarEl) {
        console.error('Calendar element not found');
        return;
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        events: getCalendarEvents(),
        eventClick: handleEventClick,
        eventMouseEnter: handleEventMouseEnter,
        eventMouseLeave: handleEventMouseLeave,
        height: 'auto',
        contentHeight: 600,
        aspectRatio: 1.35,
        dayMaxEvents: 3,
        moreLinkClick: 'popover',
        eventDisplay: 'block',
        displayEventTime: true,
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
        },
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
        },
        buttonText: {
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'List'
        },
        themeSystem: 'standard',
        bootstrapFontAwesome: false,
        eventClassNames: function(arg) {
            return [`event-${arg.event.extendedProps.type}`];
        }
    });

    calendar.render();

    // Update upcoming events display
    updateUpcomingEvents();
}

/**
 * Convert event data to FullCalendar format
 * @returns {Array} Array of FullCalendar event objects
 */
function getCalendarEvents() {
    return eventCalendarData.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        extendedProps: {
            type: event.type,
            location: event.location,
            description: event.description,
            attendees: event.attendees,
            maxAttendees: event.maxAttendees,
            organizer: event.organizer,
            image: event.image,
            requirements: event.requirements,
            contact: event.contact,
            coordinates: event.coordinates
        },
        backgroundColor: getEventTypeColor(event.type),
        borderColor: getEventTypeColor(event.type),
        textColor: '#ffffff'
    }));
}

/**
 * Get color for event type
 * @param {string} type - Event type
 * @returns {string} Hex color code
 */
function getEventTypeColor(type) {
    const colors = {
        'cleanup': '#4CAF50',
        'tree-planting': '#8BC34A',
        'workshop': '#FF9800',
        'volunteer': '#2196F3',
        'education': '#9C27B0'
    };

    return colors[type] || '#607D8B';
}

/**
 * Handle event click to show details modal
 * @param {Object} info - FullCalendar event click info
 */
function handleEventClick(info) {
    const event = info.event;
    const eventData = getEventById(event.id);

    if (eventData) {
        showEventDetailsModal(eventData);
    }
}

/**
 * Handle event mouse enter for tooltip
 * @param {Object} info - FullCalendar mouse enter info
 */
function handleEventMouseEnter(info) {
    const event = info.event;
    const tooltip = createEventTooltip(event);
    info.el.appendChild(tooltip);
}

/**
 * Handle event mouse leave to remove tooltip
 * @param {Object} info - FullCalendar mouse leave info
 */
function handleEventMouseLeave(info) {
    const tooltip = info.el.querySelector('.event-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * Create event tooltip element
 * @param {Object} event - FullCalendar event object
 * @returns {HTMLElement} Tooltip element
 */
function createEventTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'event-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <strong>${event.title}</strong><br>
            <small>${event.extendedProps.location}</small><br>
            <small>${event.extendedProps.attendees}/${event.extendedProps.maxAttendees} attending</small>
        </div>
    `;

    return tooltip;
}

/**
 * Initialize filter functionality
 */
function initializeFilters() {
    const typeFilter = document.getElementById('event-type-filter');
    const locationFilter = document.getElementById('event-location-filter');
    const dateFilter = document.getElementById('event-date-filter');

    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            currentFilter.type = this.value;
            applyFilters();
        });
    }

    if (locationFilter) {
        locationFilter.addEventListener('change', function() {
            currentFilter.location = this.value;
            applyFilters();
        });
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            currentFilter.dateRange = this.value;
            applyFilters();
        });
    }

    // Populate location filter with unique locations
    populateLocationFilter();
}

/**
 * Populate location filter with unique locations from events
 */
function populateLocationFilter() {
    const locationFilter = document.getElementById('event-location-filter');

    if (!locationFilter) return;

    const locations = [...new Set(eventCalendarData.map(event => {
        // Extract city from location
        const parts = event.location.split(',');
        return parts[parts.length - 1].trim();
    }))].sort();

    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.toLowerCase();
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

/**
 * Apply current filters to calendar display
 */
function applyFilters() {
    let filteredEvents = eventCalendarData;

    // Filter by type
    if (currentFilter.type !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.type === currentFilter.type);
    }

    // Filter by location
    if (currentFilter.location !== 'all') {
        filteredEvents = filteredEvents.filter(event =>
            event.location.toLowerCase().includes(currentFilter.location)
        );
    }

    // Filter by date range
    if (currentFilter.dateRange !== 'all') {
        filteredEvents = getEventsByDateRange(currentFilter.dateRange);
    }

    // Update calendar events
    calendar.removeAllEvents();
    calendar.addEventSource(filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        extendedProps: {
            type: event.type,
            location: event.location,
            description: event.description,
            attendees: event.attendees,
            maxAttendees: event.maxAttendees,
            organizer: event.organizer,
            image: event.image,
            requirements: event.requirements,
            contact: event.contact,
            coordinates: event.coordinates
        },
        backgroundColor: getEventTypeColor(event.type),
        borderColor: getEventTypeColor(event.type),
        textColor: '#ffffff'
    })));

    // Update upcoming events display
    updateUpcomingEvents(filteredEvents);
}

/**
 * Update upcoming events display
 * @param {Array} events - Filtered events array (optional)
 */
function updateUpcomingEvents(events = null) {
    const upcomingEventsContainer = document.getElementById('upcoming-events');

    if (!upcomingEventsContainer) return;

    const eventsToShow = events || getUpcomingEvents(6);

    upcomingEventsContainer.innerHTML = eventsToShow.map(event => `
        <div class="upcoming-event-card" data-event-id="${event.id}">
            <div class="event-image">
                <img src="${event.image}" alt="${event.title}" loading="lazy">
                <span class="event-type-badge ${event.type}">${event.type.replace('-', ' ')}</span>
            </div>
            <div class="event-content">
                <h4>${event.title}</h4>
                <p class="event-date">${formatEventDate(event.start)} at ${formatEventTime(event.start)}</p>
                <p class="event-location">${event.location}</p>
                <p class="event-attendees">${event.attendees}/${event.maxAttendees} attending</p>
                <button class="btn-primary event-details-btn" data-event-id="${event.id}">
                    View Details
                </button>
            </div>
        </div>
    `).join('');

    // Add click handlers for upcoming events
    document.querySelectorAll('.event-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event-id');
            const eventData = getEventById(eventId);
            if (eventData) {
                showEventDetailsModal(eventData);
            }
        });
    });
}

/**
 * Show event details modal
 * @param {Object} eventData - Event data object
 */
function showEventDetailsModal(eventData) {
    const modal = document.getElementById('event-details-modal');

    if (!modal) return;

    // Populate modal content
    document.getElementById('modal-event-title').textContent = eventData.title;
    document.getElementById('modal-event-image').src = eventData.image;
    document.getElementById('modal-event-image').alt = eventData.title;
    document.getElementById('modal-event-description').textContent = eventData.description;
    document.getElementById('modal-event-date').textContent = formatEventDate(eventData.start);
    document.getElementById('modal-event-time').textContent = `${formatEventTime(eventData.start)} - ${formatEventTime(eventData.end)}`;
    document.getElementById('modal-event-location').textContent = eventData.location;
    document.getElementById('modal-event-organizer').textContent = eventData.organizer;
    document.getElementById('modal-event-attendees').textContent = `${eventData.attendees}/${eventData.maxAttendees}`;
    document.getElementById('modal-event-contact').textContent = eventData.contact;
    document.getElementById('modal-event-contact').href = `mailto:${eventData.contact}`;

    // Requirements list
    const requirementsList = document.getElementById('modal-event-requirements');
    requirementsList.innerHTML = eventData.requirements.map(req => `<li>${req}</li>`).join('');

    // RSVP button state
    const rsvpBtn = document.getElementById('rsvp-button');
    const isFull = eventData.attendees >= eventData.maxAttendees;
    rsvpBtn.disabled = isFull;
    rsvpBtn.textContent = isFull ? 'Event Full' : 'RSVP Now';
    rsvpBtn.setAttribute('data-event-id', eventData.id);

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Focus management
    modal.setAttribute('aria-hidden', 'false');
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) closeBtn.focus();
}

/**
 * Initialize RSVP modal functionality
 */
function initializeRSVPModal() {
    const modal = document.getElementById('event-details-modal');
    const closeBtn = modal?.querySelector('.close-modal');
    const rsvpBtn = document.getElementById('rsvp-button');
    const rsvpForm = document.getElementById('rsvp-form');

    // Close modal handlers
    if (closeBtn) {
        closeBtn.addEventListener('click', closeEventModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeEventModal();
            }
        });
    }

    // ESC key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeEventModal();
        }
    });

    // RSVP button handler
    if (rsvpBtn) {
        rsvpBtn.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event-id');
            showRSVPForm(eventId);
        });
    }

    // RSVP form handler
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleRSVPSubmit);
    }
}

/**
 * Close event details modal
 */
function closeEventModal() {
    const modal = document.getElementById('event-details-modal');

    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        modal.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Show RSVP form for event
 * @param {string} eventId - Event ID
 */
function showRSVPForm(eventId) {
    const eventData = getEventById(eventId);

    if (!eventData) return;

    // Hide event details and show RSVP form
    document.getElementById('event-details-content').style.display = 'none';
    document.getElementById('rsvp-form-section').style.display = 'block';

    // Set event ID in form
    document.getElementById('rsvp-event-id').value = eventId;
    document.getElementById('rsvp-event-title').textContent = eventData.title;

    // Focus on first form field
    const nameField = document.getElementById('rsvp-name');
    if (nameField) nameField.focus();
}

/**
 * Handle RSVP form submission
 * @param {Event} e - Form submit event
 */
function handleRSVPSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const rsvpData = {
        eventId: formData.get('eventId'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        attendees: parseInt(formData.get('attendees')),
        specialRequirements: formData.get('specialRequirements'),
        timestamp: new Date().toISOString()
    };

    // Validate form
    if (!validateRSVPForm(rsvpData)) {
        return;
    }

    // Simulate RSVP submission (in real app, this would be an API call)
    submitRSVP(rsvpData);

    // Show success message
    showRSVPSuccess(rsvpData);
}

/**
 * Validate RSVP form data
 * @param {Object} data - RSVP form data
 * @returns {boolean} Validation result
 */
function validateRSVPForm(data) {
    const errors = [];

    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!isValidEmail(data.email)) errors.push('Valid email is required');
    if (!data.phone.trim()) errors.push('Phone number is required');
    if (data.attendees < 1 || data.attendees > 5) errors.push('Number of attendees must be between 1 and 5');

    if (errors.length > 0) {
        showRSVPError(errors.join('<br>'));
        return false;
    }

    return true;
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Email validity
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Submit RSVP (simulated)
 * @param {Object} data - RSVP data
 */
function submitRSVP(data) {
    // In a real application, this would send data to a server
    console.log('RSVP submitted:', data);

    // Update local event data (simulated)
    const event = eventCalendarData.find(e => e.id === data.eventId);
    if (event) {
        event.attendees += data.attendees;
    }

    // Update calendar display
    calendar.refetchEvents();
    updateUpcomingEvents();
}

/**
 * Show RSVP success message
 * @param {Object} data - RSVP data
 */
function showRSVPSuccess(data) {
    const formSection = document.getElementById('rsvp-form-section');
    const successSection = document.getElementById('rsvp-success-section');

    formSection.style.display = 'none';
    successSection.style.display = 'block';

    document.getElementById('success-event-title').textContent = document.getElementById('rsvp-event-title').textContent;
    document.getElementById('success-attendees').textContent = data.attendees;

    // Auto-close modal after 3 seconds
    setTimeout(() => {
        closeEventModal();
        resetRSVPModal();
    }, 3000);
}

/**
 * Show RSVP error message
 * @param {string} message - Error message
 */
function showRSVPError(message) {
    const errorDiv = document.getElementById('rsvp-error');
    errorDiv.innerHTML = message;
    errorDiv.style.display = 'block';

    // Hide error after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

/**
 * Reset RSVP modal to initial state
 */
function resetRSVPModal() {
    document.getElementById('event-details-content').style.display = 'block';
    document.getElementById('rsvp-form-section').style.display = 'none';
    document.getElementById('rsvp-success-section').style.display = 'none';
    document.getElementById('rsvp-form').reset();
    document.getElementById('rsvp-error').style.display = 'none';
}

/**
 * Initialize export functionality
 */
function initializeExportFunctionality() {
    const exportBtn = document.getElementById('export-calendar-btn');

    if (exportBtn) {
        exportBtn.addEventListener('click', exportToGoogleCalendar);
    }
}

/**
 * Export events to Google Calendar
 */
function exportToGoogleCalendar() {
    const events = calendar.getEvents();

    if (events.length === 0) {
        alert('No events to export');
        return;
    }

    // Create Google Calendar URL
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams();

    events.forEach((event, index) => {
        const startDate = new Date(event.start).toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
        const endDate = new Date(event.end).toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';

        params.append(`dates${index > 0 ? index + 1 : ''}`, `${startDate}/${endDate}`);
        params.append(`text${index > 0 ? index + 1 : ''}`, event.title);
        params.append(`location${index > 0 ? index + 1 : ''}`, event.extendedProps.location);
        params.append(`details${index > 0 ? index + 1 : ''}`, event.extendedProps.description);
    });

    const exportUrl = `${baseUrl}&${params.toString()}`;

    // Open in new tab
    window.open(exportUrl, '_blank');
}

/**
 * Enhance accessibility features
 */
function enhanceAccessibility() {
    // Add keyboard navigation for calendar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Ensure focus management in modals
            const modal = document.querySelector('.modal[style*="block"]');
            if (modal) {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        }
    });

    // Add screen reader announcements
    const calendarEl = document.getElementById('event-calendar');
    if (calendarEl) {
        calendarEl.setAttribute('aria-label', 'Event calendar showing upcoming eco-friendly events');
    }
}

// Initialize accessibility features
enhanceAccessibility();

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('event-search');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();

        if (query.length < 2) {
            applyFilters(); // Reset to current filters
            return;
        }

        const filteredEvents = eventCalendarData.filter(event =>
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query) ||
            event.organizer.toLowerCase().includes(query)
        );

        calendar.removeAllEvents();
        calendar.addEventSource(filteredEvents.map(event => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            extendedProps: {
                type: event.type,
                location: event.location,
                description: event.description,
                attendees: event.attendees,
                maxAttendees: event.maxAttendees,
                organizer: event.organizer,
                image: event.image,
                requirements: event.requirements,
                contact: event.contact,
                coordinates: event.coordinates
            },
            backgroundColor: getEventTypeColor(event.type),
            borderColor: getEventTypeColor(event.type),
            textColor: '#ffffff'
        })));

        updateUpcomingEvents(filteredEvents);
    });
}

// Initialize search
initializeSearch();

/**
 * Performance optimization: Lazy load calendar
 */
function lazyLoadCalendar() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Calendar is already initialized, but we can add more events if needed
                observer.disconnect();
            }
        });
    });

    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        observer.observe(calendarContainer);
    }
}

// Initialize lazy loading
lazyLoadCalendar();

// ==========================================
// Helper Functions (assumed to be defined elsewhere)
// ==========================================

/**
 * Get event by ID from eventCalendarData
 * @param {string} id - Event ID
 * @returns {Object|null} Event data or null
 */
function getEventById(id) {
    return eventCalendarData.find(event => event.id === id) || null;
}

/**
 * Get upcoming events
 * @param {number} limit - Maximum number of events to return
 * @returns {Array} Array of upcoming events
 */
function getUpcomingEvents(limit) {
    const now = new Date();
    return eventCalendarData
        .filter(event => new Date(event.start) > now)
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, limit);
}

/**
 * Get events by date range
 * @param {string} range - Date range ('week', 'month', 'quarter')
 * @returns {Array} Filtered events
 */
function getEventsByDateRange(range) {
    const now = new Date();
    let endDate;

    switch (range) {
        case 'week':
            endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            break;
        case 'quarter':
            endDate = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
            break;
        default:
            return eventCalendarData;
    }

    return eventCalendarData.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= now && eventDate <= endDate;
    });
}

/**
 * Format event date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatEventDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format event time for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time
 */
function formatEventTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}