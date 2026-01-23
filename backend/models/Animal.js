const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: String,
    age: Number,
    description: String,
    image: String,
    location: String,
    status: { type: String, enum: ['available', 'adopted', 'pending'], default: 'available' },
    adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    healthInfo: {
        vaccinated: Boolean,
        spayed: Boolean,
        medicalNotes: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);