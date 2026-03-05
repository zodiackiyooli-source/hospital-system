const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, required: true, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    notes: { type: String, default: '' },
    isOnline: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
