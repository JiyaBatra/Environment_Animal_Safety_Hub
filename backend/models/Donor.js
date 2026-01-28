const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    donorId: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        enum: ['individual', 'corporate', 'foundation'],
        default: 'individual'
    },
    
    // Personal/Corporate Information
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String, default: 'USA' }
    },
    
    // Corporate/Foundation Specific
    organizationName: String,
    companyType: String,
    numberOfEmployees: Number,
    taxExemptStatus: Boolean,
    einNumber: String,
    
    // Contact Preferences
    preferences: {
        communicationMethod: { type: String, enum: ['email', 'phone', 'mail'], default: 'email' },
        frequency: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'annually'], default: 'quarterly' },
        newsletter: { type: Boolean, default: true },
        eventInvitations: { type: Boolean, default: true },
        anonymousDonation: { type: Boolean, default: false }
    },
    
    // Giving Profile
    givingCapacity: {
        score: { type: Number, min: 1, max: 100, default: 50 },
        estimatedAnnualGift: Number,
        lastUpdated: Date
    },
    
    // Donation Segment
    segment: {
        type: String,
        enum: ['major', 'regular', 'lapsed', 'prospect'],
        default: 'prospect'
    },
    
    // Tags and Custom Fields
    tags: [{
        type: String,
        trim: true
    }],
    customNotes: String,
    internalNotes: String,
    
    // Donation Statistics
    stats: {
        totalDonations: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0 },
        numberOfGifts: { type: Number, default: 0 },
        averageGift: { type: Number, default: 0 },
        largestGift: { type: Number, default: 0 },
        lastDonationDate: Date,
        firstDonationDate: Date,
        donationFrequency: { type: Number, default: 0 }, // days between gifts
        retentionStatus: { type: String, enum: ['active', 'lapsed', 'at-risk'], default: 'prospect' }
    },
    
    // Recurring Donation
    hasRecurringDonation: { type: Boolean, default: false },
    monthlyDonationAmount: Number,
    
    // Tax Information
    taxExemptAllowed: { type: Boolean, default: true },
    taxYear: { type: Number, default: new Date().getFullYear() },
    
    // Status
    status: { type: String, enum: ['active', 'inactive', 'deceased', 'opt-out'], default: 'active' },
    
    createdDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save middleware to auto-generate donorId
DonorSchema.pre('save', async function(next) {
    if (!this.donorId) {
        const count = await mongoose.model('Donor').countDocuments();
        this.donorId = `DON-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    }
    this.lastUpdated = new Date();
    next();
});

// Calculate giving capacity score
DonorSchema.methods.calculateGivingCapacity = function() {
    let score = 50; // base score
    
    if (this.stats.totalAmount > 10000) score += 20;
    else if (this.stats.totalAmount > 5000) score += 15;
    else if (this.stats.totalAmount > 1000) score += 10;
    
    if (this.stats.numberOfGifts > 10) score += 15;
    else if (this.stats.numberOfGifts > 5) score += 10;
    
    if (this.hasRecurringDonation) score += 10;
    
    if (this.type === 'corporate' || this.type === 'foundation') score += 15;
    
    return Math.min(score, 100);
};

// Update donor segment based on stats
DonorSchema.methods.updateSegment = function() {
    const now = new Date();
    const lastDonation = this.stats.lastDonationDate;
    const daysSinceLastDonation = lastDonation ? Math.floor((now - lastDonation) / (1000 * 60 * 60 * 24)) : null;
    
    if (this.stats.totalAmount > 5000) {
        this.segment = 'major';
    } else if (daysSinceLastDonation && daysSinceLastDonation < 365) {
        this.segment = 'regular';
    } else if (daysSinceLastDonation && daysSinceLastDonation > 730) {
        this.segment = 'lapsed';
    } else {
        this.segment = 'prospect';
    }
};

module.exports = mongoose.model('Donor', DonorSchema);
