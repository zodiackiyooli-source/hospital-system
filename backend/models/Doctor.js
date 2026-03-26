const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    department: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    schedule: { type: String, required: true },
    salary: { type: Number, required: true },
    status: { type: String, default: 'Active', enum: ['Active', 'On Leave', 'Inactive'] }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
