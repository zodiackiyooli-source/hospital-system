const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    patient_db_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    patient_id: { type: String, required: true },
    patient_name: { type: String, required: true },
    practitioner: { type: String, required: true },
    date: { type: Date, default: Date.now },
    serial: { type: String },
    medicines: [{
        name: { type: String, required: true },
        qty: { type: String },
        freq: { type: String },
        form: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
