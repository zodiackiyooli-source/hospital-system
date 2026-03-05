const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patient_id: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    blood_group: { type: String, required: true },
    history: { type: String, default: '' },
    medical_record: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
