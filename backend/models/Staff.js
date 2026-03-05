const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician', 'Admin'] },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salary: { type: Number, required: true },
    attendance: { type: String, default: 'Present' }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
