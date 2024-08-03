const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: false },
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'company', 'client'], default: 'client' },
    businessLicense: { type: String },
    avatar: { type: String },
    lastLogin: { type: Date },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

// Add custom validation to ensure company specific fields are present when role is 'company'
UserSchema.pre('save', function (next) {
    if (this.role === 'company') {
        if (!this.businessLicense) {
            let err = new Error('Company users must have a company name and business license');
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
