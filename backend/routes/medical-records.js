const express = require('express');
const MedicalRecord = require('../models/MedicalRecord');
const Animal = require('../models/Animal');
const router = express.Router();

// Get all medical records
router.get('/', async (req, res) => {
    try {
        const records = await MedicalRecord.find().populate('animalId');
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get medical record by animal ID
router.get('/animal/:animalId', async (req, res) => {
    try {
        const record = await MedicalRecord.findOne({ animalId: req.params.animalId }).populate('animalId');
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get medical record by record ID
router.get('/:id', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id).populate('animalId');
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new medical record
router.post('/', async (req, res) => {
    try {
        // Verify animal exists
        const animal = await Animal.findById(req.body.animalId);
        if (!animal) {
            return res.status(404).json({ error: 'Animal not found' });
        }

        const record = new MedicalRecord(req.body);
        await record.save();
        await record.populate('animalId');
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update medical record
router.put('/:id', async (req, res) => {
    try {
        const record = await MedicalRecord.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('animalId');
        
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }
        res.json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add vital signs
router.post('/:id/vitals', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        record.vitalSigns.push(req.body);
        
        // Check for abnormal vitals and create alerts
        const vitals = req.body;
        const alerts = [];
        
        if (vitals.temperature && (vitals.temperature < 36.5 || vitals.temperature > 39.5)) {
            alerts.push({
                type: 'vital-abnormal',
                message: `Abnormal temperature: ${vitals.temperature}°C`,
                severity: vitals.temperature < 35 || vitals.temperature > 40 ? 'high' : 'medium'
            });
        }
        
        if (vitals.heartRate && (vitals.heartRate < 40 || vitals.heartRate > 180)) {
            alerts.push({
                type: 'vital-abnormal',
                message: `Abnormal heart rate: ${vitals.heartRate} bpm`,
                severity: 'medium'
            });
        }

        record.alerts.push(...alerts);
        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add diagnosis
router.post('/:id/diagnoses', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        record.diagnosisHistory.push(req.body);
        
        // Create alert for critical conditions
        if (req.body.severity === 'critical') {
            record.alerts.push({
                type: 'critical-condition',
                message: `Critical condition identified: ${req.body.condition}`,
                severity: 'critical'
            });
        }

        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add prescription
router.post('/:id/prescriptions', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        record.prescriptions.push(req.body);
        
        // Create alert for new medication
        record.alerts.push({
            type: 'medication-pending',
            message: `New medication scheduled: ${req.body.medicationName}`,
            severity: 'medium'
        });

        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Record medication administration
router.post('/:id/prescriptions/:prescriptionIndex/administer', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        const prescription = record.prescriptions[req.params.prescriptionIndex];
        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        prescription.administrations.push(req.body);
        
        // Check if all doses for today are administered
        const today = new Date().toISOString().split('T')[0];
        const administeredToday = prescription.administrations.filter(
            a => a.date && a.date.toISOString().split('T')[0] === today
        ).length;

        await record.save();
        res.status(201).json({ 
            message: 'Medication administration recorded',
            administeredToday,
            record 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add vet visit
router.post('/:id/vet-visits', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        record.vetVisits.push(req.body);
        
        // Create follow-up alert if next visit is scheduled
        if (req.body.nextVisitDate) {
            record.alerts.push({
                type: 'follow-up-overdue',
                message: `Follow-up visit scheduled for ${new Date(req.body.nextVisitDate).toLocaleDateString()}`,
                severity: 'low'
            });
        }

        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create treatment plan
router.post('/:id/treatment-plans', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        record.treatmentPlans.push(req.body);
        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add progress note to treatment plan
router.post('/:id/treatment-plans/:planIndex/progress', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        const plan = record.treatmentPlans[req.params.planIndex];
        if (!plan) {
            return res.status(404).json({ error: 'Treatment plan not found' });
        }

        plan.progressNotes.push(req.body);
        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get active alerts
router.get('/:id/alerts', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        const activeAlerts = record.alerts.filter(a => !a.resolved);
        res.json(activeAlerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Resolve alert
router.patch('/:id/alerts/:alertIndex/resolve', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        const alert = record.alerts[req.params.alertIndex];
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        alert.resolved = true;
        alert.resolvedDate = new Date();
        await record.save();
        res.json(alert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get overdue follow-ups
router.get('/check/overdue-followups', async (req, res) => {
    try {
        const records = await MedicalRecord.find({
            'vetVisits.nextVisitDate': { $lt: new Date() }
        }).populate('animalId');

        const overdueVisits = [];
        records.forEach(record => {
            record.vetVisits.forEach((visit, idx) => {
                if (visit.nextVisitDate && visit.nextVisitDate < new Date() && visit.status !== 'completed') {
                    overdueVisits.push({
                        animalId: record.animalId._id,
                        animalName: record.animalId.name,
                        daysOverdue: Math.floor((new Date() - visit.nextVisitDate) / (1000 * 60 * 60 * 24)),
                        scheduledDate: visit.nextVisitDate
                    });
                }
            });
        });

        res.json(overdueVisits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get medication schedule
router.get('/check/medication-schedule', async (req, res) => {
    try {
        const records = await MedicalRecord.find({
            'prescriptions.status': 'active'
        }).populate('animalId');

        const medicationSchedule = [];
        records.forEach(record => {
            record.prescriptions.forEach(prescription => {
                if (prescription.status === 'active') {
                    medicationSchedule.push({
                        animalId: record.animalId._id,
                        animalName: record.animalId.name,
                        medication: prescription.medicationName,
                        dosage: prescription.dosage,
                        frequency: prescription.frequency,
                        endDate: prescription.endDate,
                        daysRemaining: Math.ceil((prescription.endDate - new Date()) / (1000 * 60 * 60 * 24))
                    });
                }
            });
        });

        res.json(medicationSchedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
