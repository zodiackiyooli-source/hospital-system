const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    test_name: { type: String, required: true },
    result: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('LabTest', labTestSchema);
