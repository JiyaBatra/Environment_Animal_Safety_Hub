const express = require('express');
const Report = require('../models/Report');
const { validate } = require('../middleware/validation');
const router = express.Router();

// Get all reports
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().populate('reportedBy', 'username email');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new report
router.post('/', validate('report'), async (req, res) => {
    try {
        const report = new Report(req.body);
        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update report status
router.patch('/:id/status', async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(report);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;