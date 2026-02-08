const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    volunteerId: { type: String, unique: true },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'VolunteerApplication' },
    personalInfo: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        dateOfBirth: Date,
        address: Object,
        photo: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
        email: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'on-leave', 'suspended', 'alumni'],
        default: 'active'
    },
    badgeInfo: {
        badgeNumber: String,
        issueDate: Date,
        expiryDate: Date,
        qrCode: String,
        photoUrl: String
    },
    skills: {
        animalHandling: String,
        medicalKnowledge: String,
        specializations: [String],
        languages: [String]
    },
    interests: {
        animalTypes: [String],
        activities: [String],
        preferredRole: String
    },
    availability: {
        daysAvailable: [String],
        timesAvailable: [String],
        hoursPerWeek: Number
    },
    certifications: [{
        name: String,
        issuedBy: String,
        issueDate: Date,
        expiryDate: Date,
        certificateNumber: String,
        verified: Boolean,
        documentUrl: String
    }],
    training: [{
        moduleName: String,
        category: String,
        completedDate: Date,
        trainer: String,
        score: Number,
        certificateUrl: String,
        expiryDate: Date
    }],
    activityLog: [{
        date: Date,
        type: { type: String, enum: ['shift', 'training', 'event', 'other'] },
        description: String,
        hoursWorked: Number,
        supervisor: String,
        notes: String
    }],
    performance: {
        totalHours: { type: Number, default: 0 },
        totalShifts: { type: Number, default: 0 },
        cancelledShifts: { type: Number, default: 0 },
        noShowCount: { type: Number, default: 0 },
        rating: { type: Number, min: 0, max: 5, default: 0 },
        reviews: [{
            date: Date,
            rating: Number,
            comment: String,
            reviewer: String
        }],
        lastActiveDate: Date
    },
    achievements: [{
        type: String,
        title: String,
        description: String,
        earnedDate: Date,
        icon: String,
        milestone: Number
    }],
    recognition: [{
        type: { type: String, enum: ['volunteer-of-month', 'volunteer-of-year', 'special-recognition', 'milestone'] },
        title: String,
        date: Date,
        description: String,
        awardedBy: String
    }],
    communication: {
        emailNotifications: { type: Boolean, default: true },
        smsNotifications: { type: Boolean, default: false },
        newsletterSubscribed: { type: Boolean, default: true },
        preferredContact: { type: String, enum: ['email', 'phone', 'sms'], default: 'email' }
    },
    notes: String,
    joinDate: { type: Date, default: Date.now },
    lastActiveDate: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Generate volunteer ID before saving
volunteerSchema.pre('save', async function(next) {
    if (!this.volunteerId) {
        const count = await this.constructor.countDocuments();
        const year = new Date().getFullYear();
        this.volunteerId = `VOL-${year}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

// Calculate volunteer metrics
volunteerSchema.methods.calculateMetrics = function() {
    // Calculate attendance rate
    if (this.performance.totalShifts > 0) {
        const attendedShifts = this.performance.totalShifts - this.performance.noShowCount;
        this.performance.attendanceRate = ((attendedShifts / this.performance.totalShifts) * 100).toFixed(2);
    }
    
    // Calculate average rating from reviews
    if (this.performance.reviews && this.performance.reviews.length > 0) {
        const totalRating = this.performance.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.performance.rating = (totalRating / this.performance.reviews.length).toFixed(2);
    }
    
    // Check for milestone achievements
    const milestones = [50, 100, 250, 500, 1000];
    milestones.forEach(milestone => {
        if (this.performance.totalHours >= milestone) {
            const exists = this.achievements.some(a => a.milestone === milestone);
            if (!exists) {
                this.achievements.push({
                    type: 'hour-milestone',
                    title: `${milestone} Hours`,
                    description: `Completed ${milestone} volunteer hours`,
                    earnedDate: new Date(),
                    icon: '⭐',
                    milestone: milestone
                });
            }
        }
    });
};

// Check expiring certifications
volunteerSchema.methods.getExpiringCertifications = function(daysAhead = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    return this.certifications.filter(cert => 
        cert.expiryDate && cert.expiryDate <= futureDate && cert.expiryDate > new Date()
    );
};

module.exports = mongoose.model('Volunteer', volunteerSchema);
