const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'company', 'client'], default: 'client' }
});

module.exports = mongoose.model('User', UserSchema);
