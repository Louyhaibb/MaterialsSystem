const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const OrderSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }],
    additionalServices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdditionalService'
    }],
    orderDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    address: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Completed'], default: 'Pending' }
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

OrderSchema.plugin(AutoIncrement, { inc_field: 'orderNumber', start_seq: 1001 });

module.exports = mongoose.model('Order', OrderSchema);
