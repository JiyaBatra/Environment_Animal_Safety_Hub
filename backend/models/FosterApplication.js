const mongoose = require('mongoose');

const fosterApplicationSchema = new mongoose.Schema({
    applicationNumber: { type: String, unique: true },
    applicantInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        dateOfBirth: Date,
        occupation: String
    },
    householdInfo: {
        residenceType: { type: String, enum: ['house', 'apartment', 'condo', 'other'], required: true },
        ownOrRent: { type: String, enum: ['own', 'rent'], required: true },
        landlordApproval: { type: Boolean, default: false },
        householdMembers: [{
            name: String,
            age: Number,
            relationship: String
        }],
        otherPets: [{
            type: String,
            breed: String,
            age: Number,
            spayedNeutered: Boolean
        }],
        hasYard: Boolean,
        yardFenced: Boolean,
        yardSize: String
    },
    experience: {
        previousFoster: Boolean,
        previousFosterDetails: String,
        petOwnershipYears: Number,
        specializedTraining: [String],
        preferredAnimalTypes: [String],
        canHandleSpecialNeeds: Boolean,
        experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] }
    },
    availability: {
        startDate: Date,
        durationPreference: String, // e.g., "short-term", "long-term", "flexible"
        maxAnimals: { type: Number, default: 1 },
        availableForEmergencies: Boolean,
        scheduleFlexibility: String
    },
    questionnaire: {
        whyFoster: String,
        timeCommitment: String,
        behavioralChallenges: String,
        medicalCareComfort: String,
        transportationAvailable: Boolean,
        travelFrequency: String,
        emergencyBackup: String,
        references: [{
            name: String,
            relationship: String,
            phone: String,
            email: String
        }]
    },
    homeInspection: {
        scheduled: Boolean,
        scheduledDate: Date,
        completed: Boolean,
        completedDate: Date,
        inspector: String,
        safetyScore: { type: Number, min: 0, max: 100 },
        checklist: {
            securePerimeter: Boolean,
            safeIndoorSpace: Boolean,
            appropriateShelter: Boolean,
            cleanWaterAccess: Boolean,
            safeFoodStorage: Boolean,
            firstAidKit: Boolean,
            emergencyPlan: Boolean,
            petProofing: Boolean,
            adequateSpace: Boolean,
            climateControl: Boolean
        },
        notes: String,
        photos: [String],
        concerns: [String],
        recommendations: [String]
    },
    approval: {
        status: { 
            type: String, 
            enum: ['pending', 'under-review', 'inspection-scheduled', 'approved', 'rejected', 'on-hold'],
            default: 'pending'
        },
        reviewedBy: String,
        reviewedDate: Date,
        score: { type: Number, min: 0, max: 100 },
        scoringCriteria: {
            experience: Number,
            homeEnvironment: Number,
            availability: Number,
            references: Number,
            inspection: Number
        },
        approvalDate: Date,
        expirationDate: Date,
        conditions: [String],
        rejectionReason: String
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

// Generate application number before saving
fosterApplicationSchema.pre('save', async function(next) {
    if (!this.applicationNumber) {
        const count = await this.constructor.countDocuments();
        this.applicationNumber = `FA-${Date.now()}-${count + 1}`;
    }
    next();
});

// Calculate approval score
fosterApplicationSchema.methods.calculateScore = function() {
    const criteria = this.approval.scoringCriteria;
    const weights = {
        experience: 0.25,
        homeEnvironment: 0.30,
        availability: 0.15,
        references: 0.15,
        inspection: 0.15
    };
    
    let totalScore = 0;
    Object.keys(weights).forEach(key => {
        if (criteria[key]) {
            totalScore += criteria[key] * weights[key];
        }
    });
    
    this.approval.score = Math.round(totalScore);
    return this.approval.score;
};

module.exports = mongoose.model('FosterApplication', fosterApplicationSchema);
