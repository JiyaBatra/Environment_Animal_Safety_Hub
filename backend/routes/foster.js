const express = require('express');
const router = express.Router();
const FosterApplication = require('../models/FosterApplication');
const FosterHome = require('../models/FosterHome');
const Placement = require('../models/Placement');
const Animal = require('../models/Animal');

// ==================== FOSTER APPLICATIONS ====================

// Submit new foster application
router.post('/applications', async (req, res) => {
    try {
        const application = new FosterApplication(req.body);
        await application.save();
        res.status(201).json({ 
            success: true, 
            message: 'Foster application submitted successfully',
            data: application 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get all applications with filters
router.get('/applications', async (req, res) => {
    try {
        const { status, startDate, endDate, search } = req.query;
        let query = {};
        
        if (status) query['approval.status'] = status;
        if (startDate && endDate) {
            query.createdAt = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }
        if (search) {
            query.$or = [
                { 'applicantInfo.firstName': new RegExp(search, 'i') },
                { 'applicantInfo.lastName': new RegExp(search, 'i') },
                { 'applicantInfo.email': new RegExp(search, 'i') },
                { applicationNumber: new RegExp(search, 'i') }
            ];
        }
        
        const applications = await FosterApplication.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single application by ID
router.get('/applications/:id', async (req, res) => {
    try {
        const application = await FosterApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        res.json({ success: true, data: application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update application
router.put('/applications/:id', async (req, res) => {
    try {
        const application = await FosterApplication.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        res.json({ success: true, message: 'Application updated successfully', data: application });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Schedule home inspection
router.post('/applications/:id/inspection', async (req, res) => {
    try {
        const { scheduledDate, inspector } = req.body;
        const application = await FosterApplication.findByIdAndUpdate(
            req.params.id,
            {
                'homeInspection.scheduled': true,
                'homeInspection.scheduledDate': scheduledDate,
                'homeInspection.inspector': inspector,
                'approval.status': 'inspection-scheduled'
            },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        res.json({ success: true, message: 'Home inspection scheduled', data: application });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Submit home inspection results
router.post('/applications/:id/inspection/complete', async (req, res) => {
    try {
        const { safetyScore, checklist, notes, photos, concerns, recommendations } = req.body;
        const application = await FosterApplication.findByIdAndUpdate(
            req.params.id,
            {
                'homeInspection.completed': true,
                'homeInspection.completedDate': new Date(),
                'homeInspection.safetyScore': safetyScore,
                'homeInspection.checklist': checklist,
                'homeInspection.notes': notes,
                'homeInspection.photos': photos,
                'homeInspection.concerns': concerns,
                'homeInspection.recommendations': recommendations,
                'approval.scoringCriteria.inspection': safetyScore,
                'approval.status': 'under-review'
            },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        res.json({ success: true, message: 'Inspection completed', data: application });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Calculate and update application score
router.post('/applications/:id/calculate-score', async (req, res) => {
    try {
        const application = await FosterApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        application.calculateScore();
        await application.save();
        
        res.json({ 
            success: true, 
            message: 'Score calculated', 
            score: application.approval.score,
            data: application 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Approve or reject application
router.post('/applications/:id/review', async (req, res) => {
    try {
        const { status, reviewedBy, conditions, rejectionReason, scoringCriteria } = req.body;
        
        const updateData = {
            'approval.status': status,
            'approval.reviewedBy': reviewedBy,
            'approval.reviewedDate': new Date()
        };
        
        if (scoringCriteria) {
            updateData['approval.scoringCriteria'] = scoringCriteria;
        }
        
        if (status === 'approved') {
            updateData['approval.approvalDate'] = new Date();
            updateData['approval.expirationDate'] = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
            if (conditions) updateData['approval.conditions'] = conditions;
        } else if (status === 'rejected' && rejectionReason) {
            updateData['approval.rejectionReason'] = rejectionReason;
        }
        
        const application = await FosterApplication.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        // Calculate final score
        application.calculateScore();
        await application.save();
        
        res.json({ success: true, message: `Application ${status}`, data: application });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ==================== FOSTER HOMES ====================

// Create foster home from approved application
router.post('/homes', async (req, res) => {
    try {
        const { applicationId } = req.body;
        const application = await FosterApplication.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        if (application.approval.status !== 'approved') {
            return res.status(400).json({ success: false, message: 'Application must be approved first' });
        }
        
        const home = new FosterHome({
            applicationId,
            fosterParent: {
                firstName: application.applicantInfo.firstName,
                lastName: application.applicantInfo.lastName,
                email: application.applicantInfo.email,
                phone: application.applicantInfo.phone,
                address: application.applicantInfo.address
            },
            capacity: {
                maximum: req.body.capacity?.maximum || application.availability.maxAnimals || 1,
                current: 0,
                available: req.body.capacity?.maximum || application.availability.maxAnimals || 1
            },
            specializations: req.body.specializations || [],
            preferences: {
                animalTypes: application.experience.preferredAnimalTypes,
                specialNeeds: application.experience.canHandleSpecialNeeds
            },
            renewalDate: application.approval.expirationDate,
            lastRenewalDate: application.approval.approvalDate
        });
        
        await home.save();
        res.status(201).json({ success: true, message: 'Foster home created', data: home });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get all foster homes with filters
router.get('/homes', async (req, res) => {
    try {
        const { status, specialization, available } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (specialization) query.specializations = specialization;
        if (available === 'true') query['capacity.available'] = { $gt: 0 };
        
        const homes = await FosterHome.find(query)
            .populate('applicationId')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: homes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single foster home
router.get('/homes/:id', async (req, res) => {
    try {
        const home = await FosterHome.findById(req.params.id).populate('applicationId');
        if (!home) {
            return res.status(404).json({ success: false, message: 'Foster home not found' });
        }
        res.json({ success: true, data: home });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update foster home
router.put('/homes/:id', async (req, res) => {
    try {
        const home = await FosterHome.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!home) {
            return res.status(404).json({ success: false, message: 'Foster home not found' });
        }
        res.json({ success: true, message: 'Foster home updated', data: home });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Add check-in to foster home
router.post('/homes/:id/check-ins', async (req, res) => {
    try {
        const home = await FosterHome.findById(req.params.id);
        if (!home) {
            return res.status(404).json({ success: false, message: 'Foster home not found' });
        }
        
        home.checkIns.push({
            date: new Date(),
            ...req.body
        });
        
        home.support.lastContactDate = new Date();
        await home.save();
        
        res.json({ success: true, message: 'Check-in recorded', data: home });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Add alert to foster home
router.post('/homes/:id/alerts', async (req, res) => {
    try {
        const home = await FosterHome.findById(req.params.id);
        if (!home) {
            return res.status(404).json({ success: false, message: 'Foster home not found' });
        }
        
        home.alerts.push({
            ...req.body,
            createdDate: new Date()
        });
        
        await home.save();
        res.json({ success: true, message: 'Alert created', data: home });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Resolve alert
router.patch('/homes/:homeId/alerts/:alertId', async (req, res) => {
    try {
        const home = await FosterHome.findById(req.params.homeId);
        if (!home) {
            return res.status(404).json({ success: false, message: 'Foster home not found' });
        }
        
        const alert = home.alerts.id(req.params.alertId);
        if (!alert) {
            return res.status(404).json({ success: false, message: 'Alert not found' });
        }
        
        alert.resolved = true;
        alert.resolvedDate = new Date();
        await home.save();
        
        res.json({ success: true, message: 'Alert resolved', data: home });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Calculate performance metrics
router.post('/homes/:id/calculate-metrics', async (req, res) => {
    try {
        const home = await FosterHome.findById(req.params.id);
        if (!home) {
            return res.status(404).json({ success: false, message: 'Foster home not found' });
        }
        
        home.calculateMetrics();
        await home.save();
        
        res.json({ success: true, message: 'Metrics calculated', data: home });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ==================== PLACEMENTS ====================

// Create new placement with matching algorithm
router.post('/placements', async (req, res) => {
    try {
        const { animalId, fosterHomeId } = req.body;
        
        // Get animal and foster home details
        const animal = await Animal.findById(animalId);
        const home = await FosterHome.findById(fosterHomeId);
        
        if (!animal) {
            return res.status(404).json({ success: false, message: 'Animal not found' });
        }
        if (!home) {
            return res.status(404).json({ success: false, message: 'Foster home not found' });
        }
        if (home.capacity.available <= 0) {
            return res.status(400).json({ success: false, message: 'Foster home at capacity' });
        }
        
        // Create placement
        const placement = new Placement({
            animalId,
            fosterHomeId,
            animalInfo: {
                name: animal.name,
                species: animal.species,
                breed: animal.breed,
                age: animal.age,
                size: animal.size,
                temperament: animal.temperament,
                specialNeeds: animal.specialNeeds || [],
                medicalConditions: animal.medicalConditions || []
            },
            ...req.body
        });
        
        // Calculate matching score if criteria provided
        if (req.body.matchingCriteria) {
            placement.calculateMatchingScore();
        }
        
        await placement.save();
        
        // Update foster home capacity
        home.capacity.current += 1;
        home.capacity.available -= 1;
        home.performance.totalPlacements += 1;
        await home.save();
        
        res.status(201).json({ success: true, message: 'Placement created', data: placement });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get matching suggestions for an animal
router.get('/placements/match/:animalId', async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.animalId);
        if (!animal) {
            return res.status(404).json({ success: false, message: 'Animal not found' });
        }
        
        // Find available foster homes
        const availableHomes = await FosterHome.find({
            status: 'active',
            'capacity.available': { $gt: 0 }
        }).populate('applicationId');
        
        // Calculate matching scores
        const matches = availableHomes.map(home => {
            let score = 0;
            let criteria = {};
            
            // Size compatibility (20%)
            if (home.preferences.sizePreference && home.preferences.sizePreference.includes(animal.size)) {
                criteria.sizeCompatibility = 100;
            } else {
                criteria.sizeCompatibility = 50;
            }
            
            // Temperament match (25%)
            if (home.preferences.temperament && home.preferences.temperament.includes(animal.temperament)) {
                criteria.temperamentMatch = 100;
            } else {
                criteria.temperamentMatch = 60;
            }
            
            // Experience level (20%)
            const application = home.applicationId;
            if (application && application.experience) {
                if (application.experience.experienceLevel === 'advanced') {
                    criteria.experienceLevel = 100;
                } else if (application.experience.experienceLevel === 'intermediate') {
                    criteria.experienceLevel = 75;
                } else {
                    criteria.experienceLevel = 50;
                }
            } else {
                criteria.experienceLevel = 50;
            }
            
            // Special needs capability (20%)
            if (animal.specialNeeds && animal.specialNeeds.length > 0) {
                if (home.preferences.specialNeeds && home.specializations.includes('special-needs')) {
                    criteria.specialNeedsCapability = 100;
                } else if (home.preferences.specialNeeds) {
                    criteria.specialNeedsCapability = 70;
                } else {
                    criteria.specialNeedsCapability = 30;
                }
            } else {
                criteria.specialNeedsCapability = 100;
            }
            
            // Availability match (15%)
            criteria.availabilityMatch = (home.capacity.available / home.capacity.maximum) * 100;
            
            // Calculate total score
            const weights = {
                sizeCompatibility: 0.20,
                temperamentMatch: 0.25,
                experienceLevel: 0.20,
                specialNeedsCapability: 0.20,
                availabilityMatch: 0.15
            };
            
            Object.keys(weights).forEach(key => {
                score += criteria[key] * weights[key];
            });
            
            return {
                home: home,
                matchingScore: Math.round(score),
                matchingCriteria: criteria
            };
        });
        
        // Sort by matching score
        matches.sort((a, b) => b.matchingScore - a.matchingScore);
        
        res.json({ success: true, data: matches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all placements with filters
router.get('/placements', async (req, res) => {
    try {
        const { status, fosterHomeId, animalId, startDate, endDate } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (fosterHomeId) query.fosterHomeId = fosterHomeId;
        if (animalId) query.animalId = animalId;
        if (startDate && endDate) {
            query.placementDate = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }
        
        const placements = await Placement.find(query)
            .populate('animalId')
            .populate('fosterHomeId')
            .sort({ placementDate: -1 });
        res.json({ success: true, data: placements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single placement
router.get('/placements/:id', async (req, res) => {
    try {
        const placement = await Placement.findById(req.params.id)
            .populate('animalId')
            .populate('fosterHomeId');
        if (!placement) {
            return res.status(404).json({ success: false, message: 'Placement not found' });
        }
        res.json({ success: true, data: placement });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update placement
router.put('/placements/:id', async (req, res) => {
    try {
        const placement = await Placement.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!placement) {
            return res.status(404).json({ success: false, message: 'Placement not found' });
        }
        res.json({ success: true, message: 'Placement updated', data: placement });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Add check-in to placement
router.post('/placements/:id/check-ins', async (req, res) => {
    try {
        const placement = await Placement.findById(req.params.id);
        if (!placement) {
            return res.status(404).json({ success: false, message: 'Placement not found' });
        }
        
        placement.checkIns.push({
            date: new Date(),
            ...req.body
        });
        
        await placement.save();
        res.json({ success: true, message: 'Check-in recorded', data: placement });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Report issue with placement
router.post('/placements/:id/issues', async (req, res) => {
    try {
        const placement = await Placement.findById(req.params.id);
        if (!placement) {
            return res.status(404).json({ success: false, message: 'Placement not found' });
        }
        
        placement.issues.push({
            date: new Date(),
            ...req.body,
            resolved: false
        });
        
        // Create alert in foster home if severity is high or critical
        if (req.body.severity === 'high' || req.body.severity === 'critical') {
            const home = await FosterHome.findById(placement.fosterHomeId);
            if (home) {
                home.alerts.push({
                    type: 'concern-reported',
                    message: `${req.body.type} issue reported for placement ${placement.placementNumber}`,
                    severity: req.body.severity,
                    createdDate: new Date()
                });
                await home.save();
            }
        }
        
        await placement.save();
        res.json({ success: true, message: 'Issue reported', data: placement });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// End placement
router.post('/placements/:id/end', async (req, res) => {
    try {
        const { outcomeType, reason, notes } = req.body;
        const placement = await Placement.findById(req.params.id);
        
        if (!placement) {
            return res.status(404).json({ success: false, message: 'Placement not found' });
        }
        
        placement.status = 'completed';
        placement.actualEndDate = new Date();
        placement.outcome = {
            type: outcomeType,
            date: new Date(),
            reason,
            notes
        };
        
        await placement.save();
        
        // Update foster home capacity and performance
        const home = await FosterHome.findById(placement.fosterHomeId);
        if (home) {
            home.capacity.current -= 1;
            home.capacity.available += 1;
            
            if (outcomeType === 'adopted') {
                home.performance.successfulAdoptions += 1;
            }
            
            // Calculate average placement duration
            const allPlacements = await Placement.find({ 
                fosterHomeId: home._id,
                status: 'completed'
            });
            
            const totalDuration = allPlacements.reduce((sum, p) => sum + p.getDuration(), 0);
            home.performance.averagePlacementDuration = Math.round(totalDuration / allPlacements.length);
            
            home.calculateMetrics();
            await home.save();
        }
        
        res.json({ success: true, message: 'Placement ended', data: placement });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ==================== REPORTS ====================

// Get dashboard statistics
router.get('/reports/dashboard', async (req, res) => {
    try {
        const stats = {
            applications: {
                total: await FosterApplication.countDocuments(),
                pending: await FosterApplication.countDocuments({ 'approval.status': 'pending' }),
                underReview: await FosterApplication.countDocuments({ 'approval.status': 'under-review' }),
                approved: await FosterApplication.countDocuments({ 'approval.status': 'approved' }),
                rejected: await FosterApplication.countDocuments({ 'approval.status': 'rejected' })
            },
            homes: {
                total: await FosterHome.countDocuments(),
                active: await FosterHome.countDocuments({ status: 'active' }),
                available: await FosterHome.countDocuments({ status: 'active', 'capacity.available': { $gt: 0 } }),
                full: await FosterHome.countDocuments({ status: 'full' }),
                totalCapacity: await FosterHome.aggregate([
                    { $group: { _id: null, total: { $sum: '$capacity.maximum' } } }
                ]),
                currentOccupancy: await FosterHome.aggregate([
                    { $group: { _id: null, total: { $sum: '$capacity.current' } } }
                ])
            },
            placements: {
                total: await Placement.countDocuments(),
                active: await Placement.countDocuments({ status: 'active' }),
                completed: await Placement.countDocuments({ status: 'completed' }),
                adopted: await Placement.countDocuments({ 'outcome.type': 'adopted' }),
                returned: await Placement.countDocuments({ status: 'returned' })
            }
        };
        
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get performance metrics
router.get('/reports/performance', async (req, res) => {
    try {
        const homes = await FosterHome.find({ status: 'active' });
        
        const metrics = homes.map(home => ({
            homeNumber: home.homeNumber,
            fosterParent: `${home.fosterParent.firstName} ${home.fosterParent.lastName}`,
            totalPlacements: home.performance.totalPlacements,
            successfulAdoptions: home.performance.successfulAdoptions,
            returnRate: home.performance.returnRate,
            averagePlacementDuration: home.performance.averagePlacementDuration,
            rating: home.performance.rating
        }));
        
        metrics.sort((a, b) => b.rating - a.rating);
        
        res.json({ success: true, data: metrics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Export placements report
router.get('/reports/placements/export', async (req, res) => {
    try {
        const { startDate, endDate, format = 'json' } = req.query;
        let query = {};
        
        if (startDate && endDate) {
            query.placementDate = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }
        
        const placements = await Placement.find(query)
            .populate('animalId', 'name species breed')
            .populate('fosterHomeId', 'homeNumber fosterParent')
            .sort({ placementDate: -1 });
        
        if (format === 'csv') {
            // Convert to CSV format
            let csv = 'Placement Number,Animal,Foster Home,Placement Date,End Date,Duration (days),Status,Outcome\n';
            placements.forEach(p => {
                csv += `${p.placementNumber},`;
                csv += `${p.animalInfo.name},`;
                csv += `${p.fosterHomeId.homeNumber},`;
                csv += `${p.placementDate.toISOString().split('T')[0]},`;
                csv += `${p.actualEndDate ? p.actualEndDate.toISOString().split('T')[0] : 'Ongoing'},`;
                csv += `${p.getDuration()},`;
                csv += `${p.status},`;
                csv += `${p.outcome.type || 'N/A'}\n`;
            });
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=placements-report.csv');
            res.send(csv);
        } else {
            res.json({ success: true, data: placements });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
