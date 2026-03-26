const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');
const { successResponse } = require('../utils/response');

// GET all invoices
router.get('/', async (req, res, next) => {
    try {
        const invoices = await Billing.find()
            .populate('patient_id', 'full_name patient_id phone')
            .sort({ createdAt: -1 });
        successResponse(res, 200, { invoices });
    } catch (err) {
        next(err);
    }
});

// GET single invoice by ID
router.get('/:id', async (req, res, next) => {
    try {
        const invoice = await Billing.findById(req.params.id)
            .populate('patient_id', 'full_name patient_id phone address age gender');
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        successResponse(res, 200, invoice);
    } catch (err) {
        next(err);
    }
});

// POST create new invoice
router.post('/', async (req, res, next) => {
    try {
        const invoice = new Billing(req.body);
        await invoice.save();
        successResponse(res, 201, invoice);
    } catch (err) {
        next(err);
    }
});

// PUT update invoice (e.g. status)
router.put('/:id', async (req, res, next) => {
    try {
        const invoice = await Billing.findById(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

        // Update fields
        Object.assign(invoice, req.body);
        await invoice.save(); // triggers pre-save hook for total calculation

        successResponse(res, 200, invoice);
    } catch (err) {
        next(err);
    }
});

// DELETE invoice
router.delete('/:id', async (req, res, next) => {
    try {
        const invoice = await Billing.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        successResponse(res, 200, { message: 'Invoice deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
