const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  serviceType: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  availability: { 
    dates: [String],
    times: [String],
    required: true 
  },
  locationsCovered: [String]
});

module.exports = mongoose.model('Service', ServiceSchema);
