const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    activityNumber: { type: String, unique: true },
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
    volunteerName: String,
    shiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' },
    date: { type: Date, required: true },
    type: {
        type: String,
        enum: ['shift', 'training', 'event', 'special-project', 'admin', 'other'],
        required: true
    },
    category: String,
    checkIn: {
        time: Date,
        method: { type: String, enum: ['qr-code', 'manual', 'mobile-app', 'supervisor'], default: 'manual' },
        location: String,
        supervisor: String
    },
    checkOut: {
        time: Date,
        method: { type: String, enum: ['qr-code', 'manual', 'mobile-app', 'supervisor'], default: 'manual' },
        location: String,
        supervisor: String
    },
    hoursWorked: Number,
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'approved', 'disputed'],
        default: 'in-progress'
    },
    activities: [{
        type: { type: String, enum: ['dog-walking', 'cat-socialization', 'feeding', 'cleaning', 'medical-assist', 'transport', 'admin', 'other'] },
        description: String,
        quantity: Number,
        unit: String, // e.g., "dogs walked", "cages cleaned"
        startTime: Date,
        endTime: Date,
        notes: String
    }],
    tasksCompleted: [{
        task: String,
        completed: Boolean,
        completedAt: Date,
        notes: String
    }],
    animalsInteracted: [{
        animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
        animalName: String,
        activityType: String,
        duration: Number,
        notes: String
    }],
    incident: {
        occurred: { type: Boolean, default: false },
        type: String,
        description: String,
        severity: { type: String, enum: ['minor', 'moderate', 'serious', 'critical'] },
        actionTaken: String,
        reportedTo: String,
        reportedAt: Date
    },
    feedback: {
        volunteerNotes: String,
        supervisorNotes: String,
        rating: { type: Number, min: 1, max: 5 },
        challenges: String,
        suggestions: String
    },
    approval: {
        approved: { type: Boolean, default: false },
        approvedBy: String,
        approvedDate: Date,
        notes: String
    },
    photos: [{
        url: String,
        caption: String,
        uploadedAt: Date
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Generate activity number before saving
activitySchema.pre('save', async function(next) {
    if (!this.activityNumber) {
        const count = await this.constructor.countDocuments();
        this.activityNumber = `ACT-${Date.now()}-${count + 1}`;
    }
    
    // Calculate hours worked if both check-in and check-out exist
    if (this.checkIn.time && this.checkOut.time && !this.hoursWorked) {
        this.calculateHours();
    }
    
    // Update status based on check-in/out
    if (this.checkIn.time && !this.checkOut.time) {
        this.status = 'in-progress';
    } else if (this.checkIn.time && this.checkOut.time && this.status === 'in-progress') {
        this.status = 'completed';
    }
    
    next();
});

// Calculate hours worked
activitySchema.methods.calculateHours = function() {
    if (this.checkIn.time && this.checkOut.time) {
        const hours = (this.checkOut.time - this.checkIn.time) / (1000 * 60 * 60);
        this.hoursWorked = parseFloat(hours.toFixed(2));
    }
};

// Get activity summary
activitySchema.methods.getSummary = function() {
    const summary = {
        volunteer: this.volunteerName,
        date: this.date,
        hours: this.hoursWorked,
        activitiesCount: this.activities.length,
        tasksCompleted: this.tasksCompleted.filter(t => t.completed).length,
        animalsHelped: this.animalsInteracted.length,
        hadIncident: this.incident.occurred
    };
    return summary;
};

module.exports = mongoose.model('Activity', activitySchema);
