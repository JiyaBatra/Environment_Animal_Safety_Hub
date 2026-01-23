const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['waste', 'animal_abuse', 'pollution', 'other'] },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    images: [String],
    status: { type: String, enum: ['pending', 'investigating', 'resolved'], default: 'pending' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);