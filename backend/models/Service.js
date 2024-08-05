const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: { type: String, enum: ['Office', 'Apartment', 'Small Transfer', 'Warehouse', 'History'], default: 'Office' },
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
});

module.exports = mongoose.model('Service', ServiceSchema);
