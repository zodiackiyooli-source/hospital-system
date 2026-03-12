const mongoose = require('mongoose');

const pharmacySalesSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
    medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PharmacySales', pharmacySalesSchema);
