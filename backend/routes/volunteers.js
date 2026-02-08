const express = require('express');
const router = express.Router();
const VolunteerApplication = require('../models/VolunteerApplication');
const Volunteer = require('../models/Volunteer');
const Shift = require('../models/Shift');
const Activity = require('../models/Activity');

// ==================== VOLUNTEER APPLICATIONS ====================

// Submit new volunteer application
router.post('/applications', async (req, res) => {
    try {
        const application = new VolunteerApplication(req.body);
        await application.save();
        res.status(201).json({ 
            success: true, 
            message: 'Volunteer application submitted successfully',
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
                { 'personalInfo.firstName': new RegExp(search, 'i') },
                { 'personalInfo.lastName': new RegExp(search, 'i') },
                { 'personalInfo.email': new RegExp(search, 'i') },
                { applicationNumber: new RegExp(search, 'i') }
            ];
        }
        
        const applications = await VolunteerApplication.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single application
router.get('/applications/:id', async (req, res) => {
    try {
        const application = await VolunteerApplication.findById(req.params.id);
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
        const application = await VolunteerApplication.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        res.json({ success: true, message: 'Application updated', data: application });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Schedule orientation
router.post('/applications/:id/orientation', async (req, res) => {
    try {
        const { scheduledDate, trainer } = req.body;
        const application = await VolunteerApplication.findByIdAndUpdate(
            req.params.id,
            {
                'orientation.scheduled': true,
                'orientation.scheduledDate': scheduledDate,
                'orientation.trainer': trainer,
                'orientation.attendanceStatus': 'scheduled',
                'approval.status': 'orientation-scheduled'
            },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        res.json({ success: true, message: 'Orientation scheduled', data: application });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Complete orientation
router.post('/applications/:id/orientation/complete', async (req, res) => {
    try {
        const { attended, notes } = req.body;
        const application = await VolunteerApplication.findByIdAndUpdate(
            req.params.id,
            {
                'orientation.completed': attended,
                'orientation.completedDate': attended ? new Date() : null,
                'orientation.attendanceStatus': attended ? 'attended' : 'no-show',
                'orientation.notes': notes,
                'approval.status': attended ? 'approved' : 'orientation-scheduled'
            },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        res.json({ success: true, message: 'Orientation marked complete', data: application });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Review and approve/reject application
router.post('/applications/:id/review', async (req, res) => {
    try {
        const { status, reviewedBy, scoringCriteria, rejectionReason, waitlistReason } = req.body;
        
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
        } else if (status === 'rejected' && rejectionReason) {
            updateData['approval.rejectionReason'] = rejectionReason;
        } else if (status === 'waitlisted' && waitlistReason) {
            updateData['approval.waitlistReason'] = waitlistReason;
        }
        
        const application = await VolunteerApplication.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        application.calculateScore();
        await application.save();
        
        res.json({ success: true, message: `Application ${status}`, data: application });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ==================== VOLUNTEERS ====================

// Create volunteer from approved application
router.post('/volunteers', async (req, res) => {
    try {
        const { applicationId } = req.body;
        const application = await VolunteerApplication.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        if (application.approval.status !== 'approved') {
            return res.status(400).json({ success: false, message: 'Application must be approved first' });
        }
        
        const volunteer = new Volunteer({
            applicationId,
            personalInfo: application.personalInfo,
            emergencyContact: application.emergencyContact,
            skills: application.skills,
            interests: application.interests,
            availability: application.availability,
            certifications: application.certifications,
            joinDate: new Date()
        });
        
        await volunteer.save();
        res.status(201).json({ success: true, message: 'Volunteer created', data: volunteer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get all volunteers with filters
router.get('/volunteers', async (req, res) => {
    try {
        const { status, skill, search } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (skill) query['skills.specializations'] = skill;
        if (search) {
            query.$or = [
                { 'personalInfo.firstName': new RegExp(search, 'i') },
                { 'personalInfo.lastName': new RegExp(search, 'i') },
                { 'personalInfo.email': new RegExp(search, 'i') },
                { volunteerId: new RegExp(search, 'i') }
            ];
        }
        
        const volunteers = await Volunteer.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: volunteers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single volunteer
router.get('/volunteers/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id).populate('applicationId');
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        res.json({ success: true, data: volunteer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update volunteer
router.put('/volunteers/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        res.json({ success: true, message: 'Volunteer updated', data: volunteer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Add training completion
router.post('/volunteers/:id/training', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        
        volunteer.training.push({
            ...req.body,
            completedDate: new Date()
        });
        
        await volunteer.save();
        res.json({ success: true, message: 'Training recorded', data: volunteer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Add/update certification
router.post('/volunteers/:id/certifications', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        
        volunteer.certifications.push(req.body);
        await volunteer.save();
        
        res.json({ success: true, message: 'Certification added', data: volunteer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get expiring certifications
router.get('/volunteers/:id/certifications/expiring', async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        
        const expiring = volunteer.getExpiringCertifications(parseInt(days));
        res.json({ success: true, data: expiring });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Calculate volunteer metrics
router.post('/volunteers/:id/calculate-metrics', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        
        volunteer.calculateMetrics();
        await volunteer.save();
        
        res.json({ success: true, message: 'Metrics calculated', data: volunteer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Add recognition
router.post('/volunteers/:id/recognition', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        
        volunteer.recognition.push({
            ...req.body,
            date: new Date()
        });
        
        await volunteer.save();
        res.json({ success: true, message: 'Recognition added', data: volunteer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ==================== SHIFTS ====================

// Create new shift
router.post('/shifts', async (req, res) => {
    try {
        const shift = new Shift(req.body);
        await shift.save();
        
        // If recurring, create future shifts
        if (shift.isRecurring && shift.recurrence.frequency) {
            await createRecurringShifts(shift);
        }
        
        res.status(201).json({ success: true, message: 'Shift created', data: shift });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Create recurring shifts helper function
async function createRecurringShifts(parentShift) {
    const occurrences = [];
    let currentDate = new Date(parentShift.date);
    const endDate = parentShift.recurrence.endDate || new Date(currentDate.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days default
    
    while (currentDate <= endDate) {
        // Skip first occurrence (already created)
        if (currentDate.getTime() !== new Date(parentShift.date).getTime()) {
            const newShift = new Shift({
                ...parentShift.toObject(),
                _id: undefined,
                shiftNumber: undefined,
                date: new Date(currentDate),
                isRecurring: true,
                'recurrence.parentShiftId': parentShift._id,
                assignments: [],
                status: 'open'
            });
            occurrences.push(newShift.save());
        }
        
        // Increment date based on frequency
        switch (parentShift.recurrence.frequency) {
            case 'daily':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'biweekly':
                currentDate.setDate(currentDate.getDate() + 14);
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
        }
    }
    
    await Promise.all(occurrences);
}

// Get all shifts with filters
router.get('/shifts', async (req, res) => {
    try {
        const { status, category, startDate, endDate, volunteerId } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (category) query.category = category;
        if (startDate && endDate) {
            query.date = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }
        if (volunteerId) {
            query['assignments.volunteerId'] = volunteerId;
        }
        
        const shifts = await Shift.find(query)
            .populate('assignments.volunteerId', 'personalInfo volunteerId')
            .sort({ date: 1 });
        res.json({ success: true, data: shifts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single shift
router.get('/shifts/:id', async (req, res) => {
    try {
        const shift = await Shift.findById(req.params.id)
            .populate('assignments.volunteerId', 'personalInfo volunteerId skills');
        if (!shift) {
            return res.status(404).json({ success: false, message: 'Shift not found' });
        }
        res.json({ success: true, data: shift });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Assign volunteer to shift
router.post('/shifts/:id/assign', async (req, res) => {
    try {
        const { volunteerId, assignedBy } = req.body;
        const shift = await Shift.findById(req.params.id);
        const volunteer = await Volunteer.findById(volunteerId);
        
        if (!shift) {
            return res.status(404).json({ success: false, message: 'Shift not found' });
        }
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        
        // Check if volunteer is qualified
        if (!shift.isVolunteerQualified(volunteer)) {
            return res.status(400).json({ success: false, message: 'Volunteer does not meet shift requirements' });
        }
        
        // Check if shift is full
        const currentAssignments = shift.assignments.filter(a => 
            ['assigned', 'confirmed', 'checked-in'].includes(a.status)
        ).length;
        
        if (currentAssignments >= shift.requirements.maxVolunteers) {
            return res.status(400).json({ success: false, message: 'Shift is already fully booked' });
        }
        
        shift.assignments.push({
            volunteerId,
            volunteerName: `${volunteer.personalInfo.firstName} ${volunteer.personalInfo.lastName}`,
            assignedDate: new Date(),
            assignedBy,
            status: 'assigned'
        });
        
        shift.updateStatus();
        await shift.save();
        
        res.json({ success: true, message: 'Volunteer assigned to shift', data: shift });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Check in to shift
router.post('/shifts/:shiftId/assignments/:assignmentId/check-in', async (req, res) => {
    try {
        const { method, location, supervisor } = req.body;
        const shift = await Shift.findById(req.params.shiftId);
        
        if (!shift) {
            return res.status(404).json({ success: false, message: 'Shift not found' });
        }
        
        const assignment = shift.assignments.id(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }
        
        assignment.checkInTime = new Date();
        assignment.status = 'checked-in';
        
        await shift.save();
        
        // Create activity record
        const activity = new Activity({
            volunteerId: assignment.volunteerId,
            volunteerName: assignment.volunteerName,
            shiftId: shift._id,
            date: shift.date,
            type: 'shift',
            category: shift.category,
            checkIn: {
                time: new Date(),
                method: method || 'manual',
                location: location || shift.location.area,
                supervisor
            }
        });
        
        await activity.save();
        
        res.json({ success: true, message: 'Checked in successfully', data: { shift, activity } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Check out from shift
router.post('/shifts/:shiftId/assignments/:assignmentId/check-out', async (req, res) => {
    try {
        const { activityId, method, location, supervisor, notes } = req.body;
        const shift = await Shift.findById(req.params.shiftId);
        
        if (!shift) {
            return res.status(404).json({ success: false, message: 'Shift not found' });
        }
        
        const assignment = shift.assignments.id(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }
        
        assignment.checkOutTime = new Date();
        assignment.status = 'completed';
        assignment.notes = notes;
        
        shift.calculateActualHours(shift.assignments.indexOf(assignment));
        shift.updateStatus();
        await shift.save();
        
        // Update activity record
        if (activityId) {
            const activity = await Activity.findById(activityId);
            if (activity) {
                activity.checkOut = {
                    time: new Date(),
                    method: method || 'manual',
                    location: location || shift.location.area,
                    supervisor
                };
                activity.calculateHours();
                activity.status = 'completed';
                await activity.save();
                
                // Update volunteer total hours
                const volunteer = await Volunteer.findById(assignment.volunteerId);
                if (volunteer) {
                    volunteer.performance.totalHours += activity.hoursWorked;
                    volunteer.performance.totalShifts += 1;
                    volunteer.performance.lastActiveDate = new Date();
                    await volunteer.save();
                }
            }
        }
        
        res.json({ success: true, message: 'Checked out successfully', data: shift });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Cancel shift assignment
router.post('/shifts/:shiftId/assignments/:assignmentId/cancel', async (req, res) => {
    try {
        const shift = await Shift.findById(req.params.shiftId);
        if (!shift) {
            return res.status(404).json({ success: false, message: 'Shift not found' });
        }
        
        const assignment = shift.assignments.id(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }
        
        assignment.status = 'cancelled';
        
        // Update volunteer cancelled count
        const volunteer = await Volunteer.findById(assignment.volunteerId);
        if (volunteer) {
            volunteer.performance.cancelledShifts += 1;
            await volunteer.save();
        }
        
        shift.updateStatus();
        await shift.save();
        
        res.json({ success: true, message: 'Shift assignment cancelled', data: shift });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ==================== ACTIVITIES ====================

// Get all activities
router.get('/activities', async (req, res) => {
    try {
        const { volunteerId, startDate, endDate, status } = req.query;
        let query = {};
        
        if (volunteerId) query.volunteerId = volunteerId;
        if (status) query.status = status;
        if (startDate && endDate) {
            query.date = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }
        
        const activities = await Activity.find(query)
            .populate('volunteerId', 'personalInfo volunteerId')
            .populate('shiftId', 'title category')
            .sort({ date: -1 });
        res.json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single activity
router.get('/activities/:id', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)
            .populate('volunteerId')
            .populate('shiftId');
        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        res.json({ success: true, data: activity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Approve activity
router.post('/activities/:id/approve', async (req, res) => {
    try {
        const { approvedBy, notes } = req.body;
        const activity = await Activity.findByIdAndUpdate(
            req.params.id,
            {
                'approval.approved': true,
                'approval.approvedBy': approvedBy,
                'approval.approvedDate': new Date(),
                'approval.notes': notes,
                status: 'approved'
            },
            { new: true }
        );
        
        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        
        res.json({ success: true, message: 'Activity approved', data: activity });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ==================== REPORTS ====================

// Dashboard statistics
router.get('/reports/dashboard', async (req, res) => {
    try {
        const stats = {
            applications: {
                total: await VolunteerApplication.countDocuments(),
                pending: await VolunteerApplication.countDocuments({ 'approval.status': 'pending' }),
                approved: await VolunteerApplication.countDocuments({ 'approval.status': 'approved' }),
                rejected: await VolunteerApplication.countDocuments({ 'approval.status': 'rejected' })
            },
            volunteers: {
                total: await Volunteer.countDocuments(),
                active: await Volunteer.countDocuments({ status: 'active' }),
                inactive: await Volunteer.countDocuments({ status: 'inactive' })
            },
            shifts: {
                total: await Shift.countDocuments(),
                open: await Shift.countDocuments({ status: 'open' }),
                fullyBooked: await Shift.countDocuments({ status: 'fully-booked' }),
                completed: await Shift.countDocuments({ status: 'completed' })
            },
            hours: {
                thisMonth: await Activity.aggregate([
                    { $match: { 
                        date: { 
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                            $lte: new Date()
                        },
                        status: { $in: ['completed', 'approved'] }
                    }},
                    { $group: { _id: null, total: { $sum: '$hoursWorked' } } }
                ]),
                total: await Activity.aggregate([
                    { $match: { status: { $in: ['completed', 'approved'] } }},
                    { $group: { _id: null, total: { $sum: '$hoursWorked' } } }
                ])
            }
        };
        
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Volunteer leaderboard
router.get('/reports/leaderboard', async (req, res) => {
    try {
        const volunteers = await Volunteer.find({ status: 'active' })
            .sort({ 'performance.totalHours': -1 })
            .limit(10)
            .select('personalInfo volunteerId performance');
        
        res.json({ success: true, data: volunteers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Export volunteer hours
router.get('/reports/hours/export', async (req, res) => {
    try {
        const { startDate, endDate, format = 'json' } = req.query;
        let query = { status: { $in: ['completed', 'approved'] } };
        
        if (startDate && endDate) {
            query.date = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }
        
        const activities = await Activity.find(query)
            .populate('volunteerId', 'personalInfo volunteerId')
            .sort({ date: 1 });
        
        if (format === 'csv') {
            let csv = 'Volunteer ID,Volunteer Name,Date,Hours,Activity Type,Status\n';
            activities.forEach(a => {
                const volunteer = a.volunteerId;
                csv += `${volunteer.volunteerId},`;
                csv += `${volunteer.personalInfo.firstName} ${volunteer.personalInfo.lastName},`;
                csv += `${a.date.toISOString().split('T')[0]},`;
                csv += `${a.hoursWorked || 0},`;
                csv += `${a.type},`;
                csv += `${a.status}\n`;
            });
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=volunteer-hours.csv');
            res.send(csv);
        } else {
            res.json({ success: true, data: activities });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
