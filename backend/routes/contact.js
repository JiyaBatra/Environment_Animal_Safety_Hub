const express = require('express');
const Contact = require('../models/Contact');
const { validate } = require('../middleware/validation');
const router = express.Router();

// Submit contact form
router.post('/', validate('contact'), async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Message sent successfully', id: contact._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all contacts (admin)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update contact status
router.patch('/:id/status', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(contact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;