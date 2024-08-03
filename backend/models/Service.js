const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: { type: String, enum: ['office', 'apartment', 'small transfer', 'warehouse', 'history'], default: 'office' },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    availability: { type: Date, required: true },
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    address: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined', 'completed'],
        required: true,
    },
});

module.exports = mongoose.model('Service', ServiceSchema);
