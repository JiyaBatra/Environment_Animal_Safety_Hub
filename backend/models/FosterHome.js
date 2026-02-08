const mongoose = require('mongoose');

const fosterHomeSchema = new mongoose.Schema({
    homeNumber: { type: String, unique: true },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'FosterApplication', required: true },
    fosterParent: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: Object
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'full', 'available'],
        default: 'active'
    },
    capacity: {
        maximum: { type: Number, default: 1 },
        current: { type: Number, default: 0 },
        available: { type: Number, default: 1 }
    },
    specializations: [{
        type: String,
        enum: ['puppies', 'kittens', 'senior', 'medical', 'behavioral', 'special-needs', 'nursing', 'hospice']
    }],
    preferences: {
        animalTypes: [String],
        sizePreference: [String], // small, medium, large
        agePreference: [String], // young, adult, senior
        temperament: [String],
        specialNeeds: Boolean
    },
    certifications: [{
        name: String,
        issuedBy: String,
        issueDate: Date,
        expiryDate: Date,
        verified: Boolean
    }],
    performance: {
        totalPlacements: { type: Number, default: 0 },
        successfulAdoptions: { type: Number, default: 0 },
        returnRate: { type: Number, default: 0 },
        averagePlacementDuration: Number, // in days
        rating: { type: Number, min: 0, max: 5, default: 0 },
        reviews: [{
            date: Date,
            rating: Number,
            comment: String,
            reviewer: String
        }]
    },
    checkIns: [{
        date: Date,
        type: { type: String, enum: ['scheduled', 'emergency', 'routine', 'follow-up'] },
        performedBy: String,
        status: String,
        notes: String,
        concerns: [String],
        animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }
    }],
    support: {
        assignedCoordinator: String,
        lastContactDate: Date,
        nextCheckInDate: Date,
        trainingCompleted: [String],
        resourcesProvided: [String],
        supportNeeded: [String]
    },
    alerts: [{
        type: { 
            type: String, 
            enum: ['renewal-due', 'check-in-overdue', 'capacity-reached', 'concern-reported', 'certification-expiring']
        },
        message: String,
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
        createdDate: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false },
        resolvedDate: Date
    }],
    renewalDate: Date,
    lastRenewalDate: Date,
    notes: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Generate home number before saving
fosterHomeSchema.pre('save', async function(next) {
    if (!this.homeNumber) {
        const count = await this.constructor.countDocuments();
        this.homeNumber = `FH-${Date.now()}-${count + 1}`;
    }
    
    // Update available capacity
    this.capacity.available = this.capacity.maximum - this.capacity.current;
    
    // Update status based on capacity
    if (this.capacity.current >= this.capacity.maximum) {
        this.status = 'full';
    } else if (this.status === 'full' && this.capacity.current < this.capacity.maximum) {
        this.status = 'active';
    }
    
    next();
});

// Calculate performance metrics
fosterHomeSchema.methods.calculateMetrics = function() {
    if (this.performance.totalPlacements > 0) {
        this.performance.returnRate = 
            ((this.performance.totalPlacements - this.performance.successfulAdoptions) / 
            this.performance.totalPlacements * 100).toFixed(2);
    }
    
    // Calculate average rating from reviews
    if (this.performance.reviews && this.performance.reviews.length > 0) {
        const totalRating = this.performance.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.performance.rating = (totalRating / this.performance.reviews.length).toFixed(2);
    }
};

module.exports = mongoose.model('FosterHome', fosterHomeSchema);
