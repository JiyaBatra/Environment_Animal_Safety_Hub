/**
 * Event Calendar Data and Helper Functions
 *
 * Comprehensive dataset for environmental and conservation events across India.
 * Contains event details, filtering functions, and utility methods for the
 * event calendar system.
 *
 * Event Types:
 * - cleanup: Beach, river, and urban area clean-up activities
 * - tree-planting: Urban forestry and community gardening projects
 * - workshop: Educational workshops on sustainable living
 * - volunteer: Wildlife rescue and conservation volunteering
 * - education: Seminars, fairs, and awareness programs
 *
 * Features:
 * - Location-based filtering (Mumbai, Delhi, Bangalore, Chennai, etc.)
 * - Date range filtering (this week, this month, next month)
 * - Event type categorization
 * - Attendee management and capacity tracking
 * - Geographic coordinates for mapping
 * - Contact information and requirements
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== EVENT DATA =====
/**
 * Complete dataset of environmental and conservation events
 * Each event contains comprehensive details for display and filtering
 * @type {Array<Object>}
 */
const eventCalendarData = [
    {
        id: 'cleanup-2026-01-25',
        title: 'Beach Clean-up Drive',
        start: '2026-01-25T09:00:00',
        end: '2026-01-25T12:00:00',
        type: 'cleanup',
        location: 'Juhu Beach, Mumbai',
        description: 'Join us for a comprehensive beach clean-up to remove plastic waste and marine debris. All equipment and refreshments provided.',
        attendees: 45,
        maxAttendees: 50,
        organizer: 'EcoLife Mumbai Chapter',
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
        coordinates: { lat: 19.1075, lng: 72.8267 },
        requirements: ['Comfortable clothing', 'Closed-toe shoes', 'Sunscreen', 'Reusable water bottle'],
        contact: 'mumbai@ecolife.org'
    },
    {
        id: 'tree-planting-2026-01-28',
        title: 'Urban Tree Planting Initiative',
        start: '2026-01-28T08:00:00',
        end: '2026-01-28T13:00:00',
        type: 'tree-planting',
        location: 'Andheri Park, Mumbai',
        description: 'Help us plant 200 native trees in urban green spaces. Learn proper planting techniques and tree care.',
        attendees: 32,
        maxAttendees: 40,
        organizer: 'Green Mumbai Foundation',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        coordinates: { lat: 19.1136, lng: 72.8417 },
        requirements: ['Gardening gloves', 'Water bottle', 'Hat', 'Comfortable shoes'],
        contact: 'trees@ecolife.org'
    },
    {
        id: 'workshop-2026-02-02',
        title: 'Sustainable Living Workshop',
        start: '2026-02-02T14:00:00',
        end: '2026-02-02T17:00:00',
        type: 'workshop',
        location: 'Community Center, Delhi',
        description: 'Interactive workshop on sustainable living practices, zero-waste cooking, and eco-friendly home solutions.',
        attendees: 28,
        maxAttendees: 30,
        organizer: 'Delhi Eco Collective',
        image: 'https://images.unsplash.com/photo-1544531586-9849ac535ee6?w=400',
        coordinates: { lat: 28.6139, lng: 77.2090 },
        requirements: ['Notebook and pen', 'Open mind'],
        contact: 'workshops@ecolife.org'
    },
    {
        id: 'volunteer-2026-02-05',
        title: 'Wildlife Rescue Training',
        start: '2026-02-05T10:00:00',
        end: '2026-02-05T16:00:00',
        type: 'volunteer',
        location: 'Wildlife Sanctuary, Bangalore',
        description: 'Comprehensive training on wildlife rescue techniques, first aid for animals, and rehabilitation procedures.',
        attendees: 15,
        maxAttendees: 20,
        organizer: 'Wildlife Conservation Society',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
        coordinates: { lat: 12.9716, lng: 77.5946 },
        requirements: ['Valid ID', 'Medical certificate', 'Comfortable clothing'],
        contact: 'wildlife@ecolife.org'
    },
    {
        id: 'education-2026-02-08',
        title: 'Climate Change Awareness Seminar',
        start: '2026-02-08T15:00:00',
        end: '2026-02-08T18:00:00',
        type: 'education',
        location: 'IIT Campus, Chennai',
        description: 'Educational seminar featuring climate scientists discussing global warming impacts and mitigation strategies.',
        attendees: 120,
        maxAttendees: 150,
        organizer: 'Climate Action Network',
        image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400',
        coordinates: { lat: 13.0827, lng: 80.2707 },
        requirements: ['None'],
        contact: 'education@ecolife.org'
    },
    {
        id: 'cleanup-2026-02-12',
        title: 'River Bank Restoration',
        start: '2026-02-12T07:00:00',
        end: '2026-02-12T14:00:00',
        type: 'cleanup',
        location: 'Yamuna River, Delhi',
        description: 'Large-scale river bank clean-up and restoration project. Help remove invasive species and plant native vegetation.',
        attendees: 75,
        maxAttendees: 80,
        organizer: 'River Conservation Initiative',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        coordinates: { lat: 28.6139, lng: 77.2090 },
        requirements: ['Work gloves', 'Waterproof boots', 'Insect repellent', 'Packed lunch'],
        contact: 'rivers@ecolife.org'
    },
    {
        id: 'tree-planting-2026-02-15',
        title: 'School Garden Project',
        start: '2026-02-15T09:00:00',
        end: '2026-02-15T12:00:00',
        type: 'tree-planting',
        location: 'Delhi Public School, Pune',
        description: 'Collaborative project with local schools to create educational gardens and teach children about environmental stewardship.',
        attendees: 40,
        maxAttendees: 50,
        organizer: 'Education for Environment',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        coordinates: { lat: 18.5204, lng: 73.8567 },
        requirements: ['Child-friendly attitude', 'Gardening tools provided'],
        contact: 'schools@ecolife.org'
    },
    {
        id: 'workshop-2026-02-20',
        title: 'Composting Masterclass',
        start: '2026-02-20T10:00:00',
        end: '2026-02-20T13:00:00',
        type: 'workshop',
        location: 'Community Garden, Bangalore',
        description: 'Hands-on workshop teaching different composting methods, troubleshooting common issues, and creating nutrient-rich soil.',
        attendees: 22,
        maxAttendees: 25,
        organizer: 'Urban Farming Collective',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        coordinates: { lat: 12.9716, lng: 77.5946 },
        requirements: ['Notebook', 'Samples will be provided'],
        contact: 'compost@ecolife.org'
    },
    {
        id: 'volunteer-2026-02-25',
        title: 'Marine Conservation Survey',
        start: '2026-02-25T06:00:00',
        end: '2026-02-25T18:00:00',
        type: 'volunteer',
        location: 'Chennai Coastline',
        description: 'Scientific survey of marine biodiversity, coral reef monitoring, and data collection for conservation research.',
        attendees: 12,
        maxAttendees: 15,
        organizer: 'Marine Biology Institute',
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
        coordinates: { lat: 13.0827, lng: 80.2707 },
        requirements: ['Swimming certification', 'Basic diving experience', 'Scientific background preferred'],
        contact: 'marine@ecolife.org'
    },
    {
        id: 'education-2026-03-01',
        title: 'Renewable Energy Fair',
        start: '2026-03-01T10:00:00',
        end: '2026-03-01T17:00:00',
        type: 'education',
        location: 'Hyderabad Exhibition Center',
        description: 'Interactive fair showcasing renewable energy technologies, solar installations, wind turbines, and sustainable energy solutions.',
        attendees: 200,
        maxAttendees: 300,
        organizer: 'Clean Energy Alliance',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400',
        coordinates: { lat: 17.3850, lng: 78.4867 },
        requirements: ['None'],
        contact: 'energy@ecolife.org'
    }
];

// ===== FILTERING FUNCTIONS =====
/**
 * Filter events by type
 * @param {string} type - Event type ('cleanup', 'tree-planting', 'workshop', 'volunteer', 'education', or 'all')
 * @returns {Array<Object>} Filtered array of events
 */
function getEventsByType(type) {
    if (type === 'all') return eventCalendarData;
    return eventCalendarData.filter(event => event.type === type);
}

/**
 * Filter events by location
 * @param {string} location - Location string to search for (case-insensitive partial match)
 * @returns {Array<Object>} Filtered array of events
 */
function getEventsByLocation(location) {
    if (location === 'all') return eventCalendarData;
    return eventCalendarData.filter(event =>
        event.location.toLowerCase().includes(location.toLowerCase())
    );
}

/**
 * Filter events by date range
 * @param {string} range - Date range ('this-week', 'this-month', 'next-month')
 * @returns {Array<Object>} Filtered array of events
 */
function getEventsByDateRange(range) {
    const now = new Date();
    let startDate, endDate;

    switch (range) {
        case 'this-week':
            startDate = new Date(now);
            endDate = new Date(now);
            endDate.setDate(now.getDate() + 7);
            break;
        case 'this-month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
        case 'next-month':
            startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
            break;
        default:
            return eventCalendarData;
    }

    return eventCalendarData.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= startDate && eventDate <= endDate;
    });
}

// ===== UTILITY FUNCTIONS =====
/**
 * Get upcoming events sorted by date
 * @param {number} limit - Maximum number of events to return (default: 6)
 * @returns {Array<Object>} Array of upcoming events
 */
function getUpcomingEvents(limit = 6) {
    const now = new Date();
    return eventCalendarData
        .filter(event => new Date(event.start) > now)
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, limit);
}

/**
 * Find event by ID
 * @param {string} id - Event ID to search for
 * @returns {Object|null} Event object or null if not found
 */
function getEventById(id) {
    return eventCalendarData.find(event => event.id === id);
}

/**
 * Format event date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string (e.g., "Monday, January 25, 2026")
 */
function formatEventDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format event time for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time string (e.g., "09:00")
 */
function formatEventTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}