const express = require('express');
const Animal = require('../models/Animal');
const router = express.Router();

// Get all available animals
router.get('/', async (req, res) => {
    try {
        const animals = await Animal.find({ status: 'available' });
        res.json(animals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get animal by ID
router.get('/:id', async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) return res.status(404).json({ error: 'Animal not found' });
        res.json(animal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new animal
router.post('/', async (req, res) => {
    try {
        const animal = new Animal(req.body);
        await animal.save();
        res.status(201).json(animal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;