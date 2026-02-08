const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    campaignId: {
        type: String,
        unique: true,
        required: true
    },
    
    // Campaign Basics
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    description: String,
    
    category: {
        type: String,
        enum: ['animal-rescue', 'habitat-conservation', 'education', 'veterinary-care', 'sanctuary', 'wildlife-protection', 'general'],
        default: 'general'
    },
    
    // Financial Goals
    goalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    
    currentAmount: {
        type: Number,
        default: 0
    },
    
    // Timeline
    startDate: {
        type: Date,
        default: Date.now
    },
    
    endDate: {
        type: Date,
        required: true
    },
    
    // Campaign Status
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'completed', 'archived'],
        default: 'draft'
    },
    
    // Media & Marketing
    bannerImage: String,
    heroImage: String,
    videoUrl: String,
    shortDescription: String,
    
    // Campaign Manager
    createdBy: String,
    manager: {
        name: String,
        email: String,
        phone: String
    },
    
    // Donation Information
    donationCount: { type: Number, default: 0 },
    uniqueDonors: { type: Number, default: 0 },
    averageGift: { type: Number, default: 0 },
    largestGift: { type: Number, default: 0 },
    smallestGift: { type: Number, default: 0 },
    
    // Analytics
    analytics: {
        conversionRate: { type: Number, default: 0 },
        pageViews: { type: Number, default: 0 },
        uniqueVisitors: { type: Number, default: 0 },
        shareCount: { type: Number, default: 0 },
        donorRetention: { type: Number, default: 0 }
    },
    
    // Campaign-Specific Donation Page
    fundraisingPageUrl: String,
    peerToPeerEnabled: { type: Boolean, default: false },
    
    // Peer-to-Peer Fundraising
    peerPages: [{
        pageId: String,
        fundraiser: {
            name: String,
            email: String,
            phone: String
        },
        personalGoal: Number,
        amountRaised: { type: Number, default: 0 },
        pageUrl: String,
        createdDate: Date,
        status: { type: String, enum: ['active', 'inactive', 'completed'] }
    }],
    
    // Matching Gift Program
    matchingGiftProgram: {
        enabled: { type: Boolean, default: false },
        matchingRatio: Number, // e.g., 1 = 1:1 match
        totalMatching: { type: Number, default: 0 },
        maxMatchAmount: Number,
        deadline: Date
    },
    
    // Segments & Targeting
    targetAudience: [String],
    excludedDonorSegments: [String],
    
    // Milestone Tracking
    milestones: [{
        milestone: String,
        targetAmount: Number,
        reachedAmount: { type: Number, default: 0 },
        reachedDate: Date,
        description: String
    }],
    
    // Campaign Communications
    emails: [{
        emailId: String,
        subject: String,
        sentDate: Date,
        openRate: Number,
        clickRate: Number,
        recipients: Number
    }],
    
    // Documents & Files
    attachments: [{
        fileName: String,
        fileUrl: String,
        uploadDate: Date,
        description: String
    }],
    
    // Funding Sources
    fundingBreakdown: [{
        source: String,
        amount: Number,
        percentage: Number
    }],
    
    // Notes
    publicNotes: String,
    internalNotes: String,
    
    createdDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save middleware
CampaignSchema.pre('save', async function(next) {
    if (!this.campaignId) {
        const count = await mongoose.model('Campaign').countDocuments();
        this.campaignId = `CAM-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    }
    this.lastUpdated = new Date();
    next();
});

// Calculate progress percentage
CampaignSchema.methods.getProgressPercentage = function() {
    if (this.goalAmount === 0) return 0;
    return Math.round((this.currentAmount / this.goalAmount) * 100);
};

// Calculate days remaining
CampaignSchema.methods.getDaysRemaining = function() {
    const today = new Date();
    const daysRemaining = Math.ceil((this.endDate - today) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
};

// Calculate conversion rate
CampaignSchema.methods.calculateConversionRate = function() {
    if (this.analytics.uniqueVisitors === 0) return 0;
    return ((this.donationCount / this.analytics.uniqueVisitors) * 100).toFixed(2);
};

// Calculate average gift
CampaignSchema.methods.calculateAverageGift = function() {
    if (this.donationCount === 0) return 0;
    return (this.currentAmount / this.donationCount).toFixed(2);
};

module.exports = mongoose.model('Campaign', CampaignSchema);
