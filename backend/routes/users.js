const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Save quiz score
router.post('/:id/quiz-score', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.quizScores.push(req.body);
        await user.save();
        res.json({ message: 'Score saved successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;