const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String, enum: ['office', 'apartment', 'small transfer', 'warehouse', 'history'], default: 'office' },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  availability: { type: Date, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model('Service', ServiceSchema);
