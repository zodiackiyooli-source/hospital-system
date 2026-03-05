const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    expiry_date: { type: Date, required: true },
    supplier: { type: String, required: true },
    barcode: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
