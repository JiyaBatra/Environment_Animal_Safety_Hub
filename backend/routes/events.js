const express = require('express');
const Event = require('../models/Event');
const { validate } = require('../middleware/validation');
const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'username')
            .populate('participants', 'username')
            .sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new event
router.post('/', validate('event'), async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Join event
router.post('/:id/join', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        const userId = req.body.userId;
        
        if (event.participants.includes(userId)) {
            return res.status(400).json({ error: 'Already registered' });
        }
        
        if (event.participants.length >= event.maxParticipants) {
            return res.status(400).json({ error: 'Event is full' });
        }
        
        event.participants.push(userId);
        await event.save();
        res.json({ message: 'Successfully joined event' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;