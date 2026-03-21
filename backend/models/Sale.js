const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    invoiceId: { 
        type: String, 
        unique: true 
    },
    patientName: { 
        type: String, 
        required: true 
    },
    patient_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', 
        default: null 
    },
    serviceOrItem: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        default: 1 
    },
    unitPrice: { 
        type: Number, 
        required: true 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        enum: ['Cash', 'Card', 'Insurance', 'Mobile Money'], 
        default: 'Cash' 
    },
    status: { 
        type: String, 
        enum: ['Paid', 'Pending', 'Unpaid'], 
        default: 'Paid' 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
}, { timestamps: true });

// Auto-generate Invoice ID
saleSchema.pre('save', async function () {
    if (!this.invoiceId) {
        const count = await this.constructor.countDocuments();
        this.invoiceId = `INV-${String(count + 1).padStart(5, '0')}`;
    }
});

module.exports = mongoose.model('Sale', saleSchema);
