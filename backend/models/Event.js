const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['cleanup', 'awareness', 'workshop', 'adoption'], required: true },
    maxParticipants: { type: Number, default: 50 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);