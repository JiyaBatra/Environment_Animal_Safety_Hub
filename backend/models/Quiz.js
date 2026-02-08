const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    questions: [{
        q: String,
        o: [String],
        a: Number
    }],
    category: { type: String, default: 'general' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);