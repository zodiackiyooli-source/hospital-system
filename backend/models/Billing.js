const mongoose = require('mongoose');

const billingItemSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['Consultation', 'Test', 'Medicine', 'Room', 'Other'] },
    name: { type: String, required: true },
    cost: { type: Number, required: true, min: 0 }
});

const billingSchema = new mongoose.Schema({
    invoice_number: { type: String, unique: true },
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    items: [billingItemSchema],
    totalCost: { type: Number, required: true, default: 0 },
    paymentStatus: { type: String, required: true, enum: ['Paid', 'Pending', 'Partially Paid'], default: 'Pending' },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'Insurance', 'Mobile Money'], default: 'Cash' },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate invoice number (INV-0001)
billingSchema.pre('save', async function (next) {
    if (this.isNew && !this.invoice_number) {
        const last = await this.constructor.findOne({}, 'invoice_number').sort({ invoice_number: -1 });
        const lastNum = last && last.invoice_number ? parseInt(last.invoice_number.replace('INV-', '')) : 0;
        this.invoice_number = `INV-${String(lastNum + 1).padStart(4, '0')}`;
    }
    
    // Auto calculate total cost if items exist
    if (this.items && this.items.length > 0) {
        this.totalCost = this.items.reduce((acc, item) => acc + item.cost, 0);
    }
    
    next();
});

module.exports = mongoose.model('Billing', billingSchema);
