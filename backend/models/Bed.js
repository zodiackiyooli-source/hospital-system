const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
    bed_number: { type: String, required: true, unique: true },
    ward: { type: String, required: true },
    status: { type: String, required: true, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Bed', bedSchema);
