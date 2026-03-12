const mongoose = require('mongoose');

// Schema cusub oo la wafaqsan Laboratory.jsx
const labTestSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    surname: { type: String, default: '' },
    testType: { type: String, required: true },
    date: { type: String, required: true },
    doctor: { type: String, default: '' },
    note: { type: String, default: '' },
    status: { type: String, default: 'Pending', enum: ['Pending', 'In Progress', 'Completed'] },
    result: { type: String, default: '' },
    labId: { type: String, unique: true },
}, { timestamps: true });

// Auto-generate LAB ID
labTestSchema.pre('save', async function (next) {
    if (!this.labId) {
        const count = await mongoose.model('LabTest', labTestSchema).countDocuments();
        this.labId = `LAB-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('LabTest', labTestSchema);
