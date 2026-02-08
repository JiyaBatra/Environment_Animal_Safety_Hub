const mongoose = require('mongoose');

const volunteerApplicationSchema = new mongoose.Schema({
    applicationNumber: { type: String, unique: true },
    personalInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        dateOfBirth: Date,
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
        email: String
    },
    availability: {
        daysAvailable: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
        timesAvailable: [{ type: String, enum: ['morning', 'afternoon', 'evening', 'night'] }],
        hoursPerWeek: Number,
        startDate: Date,
        longTermCommitment: Boolean,
        flexibleSchedule: Boolean
    },
    interests: {
        animalTypes: [{ type: String, enum: ['dogs', 'cats', 'birds', 'reptiles', 'small-mammals', 'wildlife', 'farm-animals'] }],
        activities: [{ type: String, enum: ['animal-care', 'dog-walking', 'cat-socialization', 'feeding', 'cleaning', 'medical-assistance', 'transport', 'events', 'fundraising', 'education', 'admin', 'social-media', 'photography'] }],
        preferredRole: String
    },
    skills: {
        animalHandling: { type: String, enum: ['none', 'basic', 'intermediate', 'advanced'], default: 'none' },
        medicalKnowledge: { type: String, enum: ['none', 'basic', 'intermediate', 'advanced'], default: 'none' },
        training: Boolean,
        grooming: Boolean,
        driving: Boolean,
        languages: [String],
        specialSkills: [String]
    },
    experience: {
        previousVolunteer: Boolean,
        previousOrganizations: [String],
        yearsExperience: Number,
        petOwnership: Boolean,
        petTypes: [String],
        workWithAnimals: Boolean,
        workDescription: String
    },
    certifications: [{
        name: String,
        issuedBy: String,
        issueDate: Date,
        expiryDate: Date,
        certificateNumber: String
    }],
    backgroundCheck: {
        consentGiven: { type: Boolean, default: false },
        consentDate: Date,
        checkCompleted: Boolean,
        completedDate: Date,
        status: { type: String, enum: ['pending', 'in-progress', 'cleared', 'flagged'], default: 'pending' },
        notes: String
    },
    references: [{
        name: String,
        relationship: String,
        phone: String,
        email: String,
        contacted: Boolean,
        response: String,
        rating: Number
    }],
    questionnaire: {
        whyVolunteer: String,
        animalExperience: String,
        strengths: String,
        commitment: String,
        allergies: Boolean,
        allergyDetails: String,
        physicalLimitations: Boolean,
        limitationDetails: String
    },
    documents: [{
        name: String,
        type: { type: String, enum: ['id', 'certification', 'waiver', 'medical', 'other'] },
        url: String,
        uploadedDate: Date,
        verified: Boolean
    }],
    approval: {
        status: { 
            type: String, 
            enum: ['pending', 'under-review', 'orientation-scheduled', 'approved', 'rejected', 'waitlisted'],
            default: 'pending'
        },
        reviewedBy: String,
        reviewedDate: Date,
        score: { type: Number, min: 0, max: 100 },
        scoringCriteria: {
            availability: Number,
            experience: Number,
            skills: Number,
            references: Number,
            backgroundCheck: Number
        },
        approvalDate: Date,
        rejectionReason: String,
        waitlistReason: String
    },
    orientation: {
        scheduled: Boolean,
        scheduledDate: Date,
        completed: Boolean,
        completedDate: Date,
        attendanceStatus: { type: String, enum: ['scheduled', 'attended', 'no-show', 'rescheduled'] },
        trainer: String,
        notes: String
    },
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Generate application number before saving
volunteerApplicationSchema.pre('save', async function(next) {
    if (!this.applicationNumber) {
        const count = await this.constructor.countDocuments();
        this.applicationNumber = `VA-${Date.now()}-${count + 1}`;
    }
    next();
});

// Calculate approval score
volunteerApplicationSchema.methods.calculateScore = function() {
    const criteria = this.approval.scoringCriteria;
    const weights = {
        availability: 0.25,
        experience: 0.20,
        skills: 0.20,
        references: 0.20,
        backgroundCheck: 0.15
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

module.exports = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
