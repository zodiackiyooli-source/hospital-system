const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patient_id: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    age: {
      value: { type: Number, required: true },
      unit: { type: String, required: true, enum: ['Year', 'Month', 'Week', 'Day', 'Hour'] }
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    blood_group: { type: String, required: true },
    illness_duration: {
        value: { type: Number, default: 0 },
        unit: { type: String, enum: ['Year', 'Month', 'Week', 'Day', 'Hour'], default: 'Day' }
    },
    history: { type: String, default: '' },
    medical_record: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate patient_id if missing (PT-0001, PT-0002, ...)
patientSchema.pre('validate', async function () {
    if (this.patient_id) return;

    try {
        const last = await this.constructor
            .findOne({ patient_id: { $regex: /^PT-\d+$/ } })
            .sort({ patient_id: -1 })
            .select('patient_id')
            .lean();

        console.log('Generating patient_id, Last patient found:', last);

        const lastNum = last?.patient_id ? Number(String(last.patient_id).split('-')[1]) : 0;
        const nextNum = Number.isFinite(lastNum) ? lastNum + 1 : 1;
        this.patient_id = `PT-${String(nextNum).padStart(4, '0')}`;
        
        console.log('Generated patient_id:', this.patient_id);
    } catch (err) {
        console.error('Patient ID generation error:', err);
        throw err;
    }
});


module.exports = mongoose.model('Patient', patientSchema);
