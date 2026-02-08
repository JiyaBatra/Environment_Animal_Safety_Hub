const mongoose = require('mongoose');

const vitalSignSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    temperature: { type: Number }, // in Celsius
    weight: { type: Number }, // in kg
    heartRate: { type: Number }, // in bpm
    respiratoryRate: { type: Number }, // in breaths/min
    bloodPressure: { type: String }, // systolic/diastolic
    notes: String
}, { timestamps: true });

const diagnosisSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    condition: { type: String, required: true },
    severity: { type: String, enum: ['mild', 'moderate', 'severe', 'critical'], required: true },
    description: String,
    diagnosingVet: String,
    clinicalNotes: String
}, { timestamps: true });

const prescriptionSchema = new mongoose.Schema({
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g., "500mg"
    frequency: { type: String, required: true }, // e.g., "twice daily"
    duration: { type: String, required: true }, // e.g., "7 days"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    prescribedBy: { type: String, required: true },
    purpose: String,
    sideEffects: String,
    administrations: [{
        date: Date,
        time: String,
        administeredBy: String,
        notes: String
    }],
    status: { type: String, enum: ['active', 'completed', 'discontinued'], default: 'active' }
}, { timestamps: true });

const vetVisitSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    vetName: { type: String, required: true },
    vetClinic: String,
    visitType: { type: String, enum: ['checkup', 'treatment', 'vaccination', 'surgery', 'follow-up'], required: true },
    reasonForVisit: String,
    findings: String,
    treatmentProvided: String,
    nextVisitDate: Date,
    cost: Number,
    documents: [String], // array of file paths/URLs
    status: { type: String, enum: ['completed', 'scheduled', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

const treatmentPlanSchema = new mongoose.Schema({
    createdDate: { type: Date, default: Date.now },
    condition: { type: String, required: true },
    objectives: [String],
    duration: String, // e.g., "2 weeks"
    medications: [String],
    procedures: [String],
    dietaryRequirements: String,
    activityRestrictions: String,
    progressNotes: [{
        date: Date,
        note: String,
        versionedBy: String,
        status: { type: String, enum: ['on-track', 'improving', 'plateaued', 'worsening'], default: 'on-track' }
    }],
    expectedOutcome: String,
    completionDate: Date,
    status: { type: String, enum: ['active', 'completed', 'on-hold'], default: 'active' }
}, { timestamps: true });

const medicalRecordSchema = new mongoose.Schema({
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    recordNumber: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    primaryVet: String,
    vitalSigns: [vitalSignSchema],
    diagnosisHistory: [diagnosisSchema],
    prescriptions: [prescriptionSchema],
    vetVisits: [vetVisitSchema],
    treatmentPlans: [treatmentPlanSchema],
    allergies: [String],
    chronicConditions: [String],
    surgicalHistory: [{
        date: Date,
        procedure: String,
        surgeon: String,
        notes: String
    }],
    vaccinationHistory: [{
        vaccine: String,
        date: Date,
        nextDueDate: Date,
        administeredBy: String
    }],
    alerts: [{
        type: { type: String, enum: ['medication-pending', 'follow-up-overdue', 'critical-condition', 'vital-abnormal'], required: true },
        message: String,
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
        createdDate: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false },
        resolvedDate: Date
    }],
    notes: String
}, { timestamps: true });

// Pre-save hook to update lastUpdated timestamp
medicalRecordSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

// Create a document number before saving
medicalRecordSchema.pre('save', async function(next) {
    if (!this.recordNumber) {
        const count = await this.constructor.countDocuments();
        this.recordNumber = `MR-${Date.now()}-${count + 1}`;
    }
    next();
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
