const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true }
});

module.exports = mongoose.model('Review', ReviewSchema);
