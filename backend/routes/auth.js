const express = require('express');
const User = require('../models/User');
const { validate } = require('../middleware/validation');
const router = express.Router();

// Register user
router.post('/register', validate('user'), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = new User({ username, email, password });
        await user.save();
        
        res.status(201).json({ 
            message: 'User registered successfully',
            userId: user._id,
            username: user.username
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            userId: user._id,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;