const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    shiftNumber: { type: String, unique: true },
    title: { type: String, required: true },
    description: String,
    category: {
        type: String,
        enum: ['animal-care', 'dog-walking', 'cat-socialization', 'feeding', 'cleaning', 'medical', 'transport', 'event', 'admin', 'other'],
        required: true
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: Number, // in minutes
    location: {
        area: String,
        building: String,
        room: String,
        address: String
    },
    requirements: {
        minVolunteers: { type: Number, default: 1 },
        maxVolunteers: { type: Number, default: 1 },
        skillsRequired: [String],
        certificationsRequired: [String],
        experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'any'], default: 'any' },
        physicalRequirements: [String]
    },
    assignments: [{
        volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
        volunteerName: String,
        assignedDate: Date,
        assignedBy: String,
        status: { 
            type: String, 
            enum: ['assigned', 'confirmed', 'checked-in', 'completed', 'no-show', 'cancelled'],
            default: 'assigned'
        },
        checkInTime: Date,
        checkOutTime: Date,
        actualHours: Number,
        notes: String
    }],
    isRecurring: { type: Boolean, default: false },
    recurrence: {
        frequency: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'] },
        daysOfWeek: [String],
        endDate: Date,
        parentShiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }
    },
    status: {
        type: String,
        enum: ['open', 'partially-filled', 'fully-booked', 'in-progress', 'completed', 'cancelled'],
        default: 'open'
    },
    supervisor: {
        name: String,
        phone: String,
        email: String
    },
    tasks: [{
        description: String,
        completed: Boolean,
        completedBy: String,
        completedAt: Date
    }],
    notes: String,
    cancellationReason: String,
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Generate shift number before saving
shiftSchema.pre('save', async function(next) {
    if (!this.shiftNumber) {
        const count = await this.constructor.countDocuments();
        this.shiftNumber = `SH-${Date.now()}-${count + 1}`;
    }
    
    // Calculate duration if not set
    if (this.startTime && this.endTime && !this.duration) {
        const start = this.parseTime(this.startTime);
        const end = this.parseTime(this.endTime);
        this.duration = (end - start) / (1000 * 60); // in minutes
    }
    
    // Update shift status based on assignments
    this.updateStatus();
    
    next();
});

// Parse time string to Date
shiftSchema.methods.parseTime = function(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(this.date);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

// Update shift status based on assignments
shiftSchema.methods.updateStatus = function() {
    const now = new Date();
    const shiftDate = new Date(this.date);
    
    if (this.status === 'cancelled') return;
    
    const assignedCount = this.assignments.filter(a => 
        ['assigned', 'confirmed', 'checked-in'].includes(a.status)
    ).length;
    
    if (shiftDate < now && this.status !== 'completed') {
        this.status = 'completed';
    } else if (assignedCount === 0) {
        this.status = 'open';
    } else if (assignedCount < this.requirements.maxVolunteers) {
        this.status = 'partially-filled';
    } else if (assignedCount >= this.requirements.maxVolunteers) {
        this.status = 'fully-booked';
    }
};

// Check if volunteer is qualified for shift
shiftSchema.methods.isVolunteerQualified = function(volunteer) {
    // Check experience level
    if (this.requirements.experienceLevel !== 'any') {
        const experienceLevels = { beginner: 1, intermediate: 2, advanced: 3 };
        const volunteerLevel = experienceLevels[volunteer.skills.animalHandling] || 0;
        const requiredLevel = experienceLevels[this.requirements.experienceLevel] || 0;
        if (volunteerLevel < requiredLevel) return false;
    }
    
    // Check required certifications
    if (this.requirements.certificationsRequired && this.requirements.certificationsRequired.length > 0) {
        const volunteerCerts = volunteer.certifications
            .filter(c => c.verified && (!c.expiryDate || c.expiryDate > new Date()))
            .map(c => c.name);
        
        const hasAllCerts = this.requirements.certificationsRequired.every(req =>
            volunteerCerts.includes(req)
        );
        
        if (!hasAllCerts) return false;
    }
    
    return true;
};

// Calculate actual hours worked
shiftSchema.methods.calculateActualHours = function(assignmentIndex) {
    const assignment = this.assignments[assignmentIndex];
    if (assignment.checkInTime && assignment.checkOutTime) {
        const hours = (assignment.checkOutTime - assignment.checkInTime) / (1000 * 60 * 60);
        assignment.actualHours = parseFloat(hours.toFixed(2));
    }
};

module.exports = mongoose.model('Shift', shiftSchema);
