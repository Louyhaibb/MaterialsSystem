const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  }],
  additionalServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdditionalService'
  }],
  date: { type: String, required: true },
  time: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropOffLocation: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Completed'], default: 'Pending' }
});

module.exports = mongoose.model('Order', OrderSchema);
