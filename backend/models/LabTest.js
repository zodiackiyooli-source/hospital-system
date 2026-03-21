const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
    patient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient' 
    },
    patientName: { type: String, required: true },
    surname: { type: String, default: '' },
    testType: { type: String, required: true },
    date: { type: String, required: true },
    doctor: { type: String, default: '' },
    note: { type: String, default: '' },
    status: { 
        type: String, 
        default: 'Pending', 
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'] 
    },
    result: { type: String, default: '' },
    result_date: { type: Date },
    result_by: { type: String }, // User who added result
    labId: { type: String, unique: true },
    result_file: { type: String }, // Path for file if any
}, { timestamps: true });

labTestSchema.pre('save', async function () {
    if (!this.labId) {
        const count = await this.constructor.countDocuments();
        this.labId = `TEST-${String(count + 1).padStart(4, '0')}`;
    }
});




module.exports = mongoose.model('LabTest', labTestSchema);

