const mongoose = require('mongoose');

const AdditionalServiceSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceName: { type: String, enum: ['Buying Cartons', 'Packaging', 'Unloading', 'Disassemble/Assemble Furniture', 'Crane Transfers', 'Storage Services'], default: 'Packaging' },
  description: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('AdditionalService', AdditionalServiceSchema);
