const express = require('express');
const router = express.Router();
const { successResponse } = require('../utils/response');
const Billing = require('../models/Billing');

// ── GET /api/reports/summary ─────────────────────────────────────────────
router.get('/summary', async (req, res, next) => {
    try {
        // Aggregate all Paid invoices
        const revenueAggregate = await Billing.aggregate([
            { $match: { paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$totalCost' } } }
        ]);
        const totalRevenue = revenueAggregate[0]?.total || 0;

        // Fetch recent paid invoices for the transaction list
        const recentInvoices = await Billing.find({ paymentStatus: 'Paid' })
            .sort({ date: -1 })
            .limit(20)
            .populate('patient_id', 'full_name');

        const transactions = recentInvoices.map(inv => ({
            id: inv.invoice_number,
            description: `Hospital Invoice for ${inv.patient_id?.full_name || 'Patient'}`,
            category: 'General Billing',
            date: inv.date,
            amount: inv.totalCost
        }));

        // Group revenue by Item Types across all Paid Billings (assuming items exist)
        const typeAggregate = await Billing.aggregate([
            { $match: { paymentStatus: 'Paid' } },
            { $unwind: "$items" },
            { $group: { _id: "$items.type", total: { $sum: "$items.cost" } } }
        ]);

        let pharmaRevenue = 0;
        let labRevenue = 0;
        let consultationRevenue = 0;

        typeAggregate.forEach(item => {
            if (item._id === 'Medicine') pharmaRevenue = item.total;
            if (item._id === 'Test') labRevenue = item.total;
            if (item._id === 'Consultation') consultationRevenue = item.total;
        });

        successResponse(res, 200, {
            summary: {
                totalRevenue,
                pharmaRevenue,
                labRevenue,
                consultationRevenue
            },
            transactions
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
