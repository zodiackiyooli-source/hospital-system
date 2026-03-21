const express = require('express');
const router = express.Router();
const { successResponse } = require('../utils/response');
const PharmacySales = require('../models/PharmacySales');
const LabTest = require('../models/LabTest');

// ── GET /api/reports/summary ─────────────────────────────────────────────
router.get('/summary', async (req, res, next) => {
    try {
        // Fetch Pharmacy Revenue
        const pharmaAggregate = await PharmacySales.aggregate([
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const pharmaRevenue = pharmaAggregate[0]?.total || 0;

        // Fetch Lab Revenue
        const labAggregate = await LabTest.aggregate([
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const labRevenue = labAggregate[0]?.total || 0;

        // General list of transactions spanning Pharmacy & Labs
        const recentPharma = await PharmacySales.find().sort({ date: -1 }).limit(10).populate('medicine_id', 'name');
        const recentLabs = await LabTest.find().sort({ createdAt: -1 }).limit(10).populate('patient_id', 'full_name');

        const transactions = [
            ...recentPharma.map(p => ({
                id: `REP-PH-${p._id.toString().substring(0, 4).toUpperCase()}`,
                description: `Pharma Sales (${p.medicine_id?.name || 'Unknown'})`,
                category: 'Pharmacy',
                date: p.date,
                amount: p.total
            })),
            ...recentLabs.map(l => ({
                id: `REP-LB-${l._id.toString().substring(0, 4).toUpperCase()}`,
                description: `Laboratory Test (${l.test_name})`,
                category: 'Laboratory',
                date: l.createdAt,
                amount: l.price
            }))
        ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20);

        successResponse(res, 200, {
            summary: {
                totalRevenue: pharmaRevenue + labRevenue,
                pharmaRevenue,
                labRevenue,
            },
            transactions
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
