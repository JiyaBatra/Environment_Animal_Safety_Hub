const mongoose = require('mongoose');

const FundraisingEventSchema = new mongoose.Schema({
    eventId: {
        type: String,
        unique: true,
        required: true
    },
    
    // Event Details
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    description: String,
    
    type: {
        type: String,
        enum: ['gala', 'walkathon', 'auction', 'marathon', 'golf-tournament', 'dinner', 'workshop', 'other'],
        default: 'gala'
    },
    
    // Event Date & Location
    eventDate: {
        type: Date,
        required: true
    },
    
    startTime: String,
    endTime: String,
    
    location: {
        venue: String,
        street: String,
        city: String,
        state: String,
        zip: String
    },
    
    virtualEvent: { type: Boolean, default: false },
    virtualLink: String,
    
    // Financial Information
    budget: {
        estimated: Number,
        actual: { type: Number, default: 0 }
    },
    
    expenses: [{
        category: String,
        description: String,
        amount: Number,
        vendor: String,
        date: Date,
        status: { type: String, enum: ['estimated', 'pending', 'paid'] }
    }],
    
    // Revenue Streams
    revenue: {
        ticketSales: { type: Number, default: 0 },
        sponsorships: { type: Number, default: 0 },
        auctionProceeds: { type: Number, default: 0 },
        donations: { type: Number, default: 0 },
        otherRevenue: { type: Number, default: 0 }
    },
    
    // Ticket Information
    ticketing: {
        ticketsAvailable: Number,
        ticketsSold: { type: Number, default: 0 },
        ticketPrice: Number,
        vipTicketPrice: Number,
        earlyBirdPrice: Number,
        earlyBirdDeadline: Date,
        ticketsSoldByType: {
            standard: { type: Number, default: 0 },
            vip: { type: Number, default: 0 },
            earlyBird: { type: Number, default: 0 },
            complimentary: { type: Number, default: 0 }
        }
    },
    
    // Sponsorship Levels
    sponsorshipTiers: [{
        tierName: String,
        sponsorshipLevel: { type: String, enum: ['platinum', 'gold', 'silver', 'bronze'] },
        cost: Number,
        benefits: [String],
        spotsAvailable: Number,
        sponsorsCommitted: { type: Number, default: 0 },
        sponsors: [{
            name: String,
            contact: String,
            email: String,
            phone: String,
            confirmationDate: Date
        }]
    }],
    
    // Attendance
    attendees: [{
        registrationId: String,
        name: String,
        email: String,
        phone: String,
        ticketType: String,
        registrationDate: Date,
        checked_in: { type: Boolean, default: false },
        guestCount: Number
    }],
    
    totalAttendees: { type: Number, default: 0 },
    checkedInCount: { type: Number, default: 0 },
    
    // Auction Items (for auction events)
    auctionItems: [{
        itemId: String,
        itemName: String,
        description: String,
        estimatedValue: Number,
        donatedBy: String,
        category: String,
        bidStartAmount: Number,
        currentBid: Number,
        highestBidder: {
            name: String,
            bidAmount: Number,
            bidTime: Date
        },
        bidHistory: [{
            bidder: String,
            amount: Number,
            bidTime: Date
        }],
        sold: { type: Boolean, default: false },
        finalSalePrice: Number
    }],
    
    // Event Management
    organizer: {
        name: String,
        email: String,
        phone: String
    },
    
    volunteers: [{
        volunteerId: String,
        name: String,
        email: String,
        phone: String,
        role: String,
        hoursWorked: Number,
        signupDate: Date
    }],
    
    // Event Status
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'draft'
    },
    
    // Marketing
    promotionalMaterials: [{
        materialType: String,
        url: String,
        uploadDate: Date
    }],
    
    registrationPageUrl: String,
    eventWebsite: String,
    
    // Event Analytics
    analytics: {
        registrationViews: { type: Number, default: 0 },
        registrations: { type: Number, default: 0 },
        shareCount: { type: Number, default: 0 },
        successMetric: String
    },
    
    // Notes
    publicDescription: String,
    internalNotes: String,
    
    createdDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save middleware
FundraisingEventSchema.pre('save', async function(next) {
    if (!this.eventId) {
        const count = await mongoose.model('FundraisingEvent').countDocuments();
        this.eventId = `EVT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    }
    this.lastUpdated = new Date();
    next();
});

// Calculate net revenue
FundraisingEventSchema.methods.getNetRevenue = function() {
    const totalRevenue = Object.values(this.revenue).reduce((sum, val) => sum + val, 0);
    const totalExpenses = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return totalRevenue - totalExpenses;
};

// Calculate total revenue
FundraisingEventSchema.methods.getTotalRevenue = function() {
    return Object.values(this.revenue).reduce((sum, val) => sum + val, 0);
};

// Get ticket capacity percentage
FundraisingEventSchema.methods.getTicketCapacityPercentage = function() {
    if (this.ticketing.ticketsAvailable === 0) return 0;
    return Math.round((this.ticketing.ticketsSold / this.ticketing.ticketsAvailable) * 100);
};

// Get attendance rate
FundraisingEventSchema.methods.getAttendanceRate = function() {
    if (this.ticketing.ticketsSold === 0) return 0;
    return Math.round((this.checkedInCount / this.ticketing.ticketsSold) * 100);
};

module.exports = mongoose.model('FundraisingEvent', FundraisingEventSchema);
