const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
    placementNumber: { type: String, unique: true },
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    fosterHomeId: { type: mongoose.Schema.Types.ObjectId, ref: 'FosterHome', required: true },
    placementDate: { type: Date, default: Date.now },
    expectedEndDate: Date,
    actualEndDate: Date,
    status: {
        type: String,
        enum: ['active', 'completed', 'returned', 'adopted', 'transferred', 'emergency-removed'],
        default: 'active'
    },
    matchingScore: { type: Number, min: 0, max: 100 },
    matchingCriteria: {
        sizeCompatibility: Number,
        temperamentMatch: Number,
        experienceLevel: Number,
        specialNeedsCapability: Number,
        availabilityMatch: Number
    },
    animalInfo: {
        name: String,
        species: String,
        breed: String,
        age: Number,
        size: String,
        temperament: String,
        specialNeeds: [String],
        medicalConditions: [String]
    },
    checkIns: [{
        date: Date,
        type: { type: String, enum: ['scheduled', 'emergency', 'routine', 'follow-up'] },
        performedBy: String,
        method: { type: String, enum: ['phone', 'video', 'in-person', 'email'] },
        animalCondition: {
            health: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
            behavior: { type: String, enum: ['excellent', 'good', 'fair', 'concerning'] },
            weight: Number,
            notes: String
        },
        fosterFeedback: String,
        concerns: [String],
        actionItems: [String],
        nextCheckInDate: Date
    }],
    supplies: [{
        item: String,
        quantity: Number,
        providedDate: Date,
        returnRequired: Boolean,
        returned: Boolean
    }],
    expenses: [{
        date: Date,
        category: String,
        amount: Number,
        description: String,
        reimbursed: Boolean,
        reimbursementDate: Date
    }],
    issues: [{
        date: Date,
        type: { type: String, enum: ['behavioral', 'medical', 'compatibility', 'foster-concern', 'other'] },
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
        description: String,
        resolution: String,
        resolvedDate: Date,
        resolved: Boolean
    }],
    outcome: {
        type: { type: String, enum: ['adopted', 'returned', 'transferred', 'deceased', 'ongoing'] },
        date: Date,
        reason: String,
        notes: String,
        adoptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Adoption' }
    },
    rating: {
        fosterRating: { type: Number, min: 0, max: 5 },
        animalProgress: { type: Number, min: 0, max: 5 },
        overallExperience: { type: Number, min: 0, max: 5 },
        comments: String
    },
    documents: [{
        name: String,
        type: String,
        url: String,
        uploadedDate: Date
    }],
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Generate placement number before saving
placementSchema.pre('save', async function(next) {
    if (!this.placementNumber) {
        const count = await this.constructor.countDocuments();
        this.placementNumber = `PL-${Date.now()}-${count + 1}`;
    }
    next();
});

// Calculate placement duration
placementSchema.methods.getDuration = function() {
    const endDate = this.actualEndDate || new Date();
    const duration = Math.floor((endDate - this.placementDate) / (1000 * 60 * 60 * 24));
    return duration;
};

// Calculate matching score
placementSchema.methods.calculateMatchingScore = function() {
    const criteria = this.matchingCriteria;
    const weights = {
        sizeCompatibility: 0.20,
        temperamentMatch: 0.25,
        experienceLevel: 0.20,
        specialNeedsCapability: 0.20,
        availabilityMatch: 0.15
    };
    
    let totalScore = 0;
    Object.keys(weights).forEach(key => {
        if (criteria[key]) {
            totalScore += criteria[key] * weights[key];
        }
    });
    
    this.matchingScore = Math.round(totalScore);
    return this.matchingScore;
};

module.exports = mongoose.model('Placement', placementSchema);
