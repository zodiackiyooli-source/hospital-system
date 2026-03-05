const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    amount: { type: Number, required: true },
    payment_method: { type: String, required: true, enum: ['Cash', 'Card', 'Insurance', 'Mobile Money'] },
    status: { type: String, required: true, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);
