const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
    patient_name: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    total_amount: { type: Number, required: true },
    paid_amount: { type: Number, default: 0 },
    remaining_amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' }
}, { timestamps: true });

// Auto-update status based on remaining amount
debtSchema.pre('save', function (next) {
    if (this.remaining_amount <= 0) {
        this.status = 'Paid';
    } else {
        this.status = 'Unpaid';
    }
    next();
});

module.exports = mongoose.model('Debt', debtSchema);
