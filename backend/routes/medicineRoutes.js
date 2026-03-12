const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const ActivityLog = require('../models/ActivityLog');

// ── GET /api/medicines ────────────────────────────────────────────────────────
// Daroogooyinka oo dhan soo celi (optional search/category)
router.get('/', async (req, res) => {
    try {
        const { search, category } = req.query;

        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        if (category && category !== 'all') {
            filter.category = category;
        }

        const medicines = await Medicine.find(filter).sort({ createdAt: -1 });
        res.json(medicines);
    } catch (err) {
        console.error('GET /medicines error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ── POST /api/medicines ───────────────────────────────────────────────────────
// Medicine cusub ku dar
router.post('/', async (req, res) => {
    try {
        const { name, category, price, quantity, expiry_date, supplier, barcode } = req.body;

        if (!name || !category || price == null || quantity == null || !expiry_date || !supplier) {
            return res.status(400).json({ message: 'Magaca, category-ga, qiimaha, tirada, supplier-ka iyo expiry date waa waajib.' });
        }

        const medicine = await Medicine.create({
            name,
            category,
            price: Number(price),
            quantity: Number(quantity),
            expiry_date: new Date(expiry_date),
            supplier,
            barcode: barcode || ''
        });

        // Log activity (best-effort)
        try {
            await ActivityLog.create({
                action: 'medicine_added',
                entityType: 'Medicine',
                entityId: medicine._id,
                message: `${medicine.name} added`,
                meta: { name: medicine.name, category: medicine.category, quantity: medicine.quantity }
            });
        } catch (e) {
            console.warn('ActivityLog medicine_added failed:', e?.message);
        }

        res.status(201).json(medicine);
    } catch (err) {
        console.error('POST /medicines error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ── PUT /api/medicines/:id ────────────────────────────────────────────────────
// Medicine update
router.put('/:id', async (req, res) => {
    try {
        const { name, category, price, quantity, expiry_date, supplier, barcode } = req.body;

        const update = {
            ...(name !== undefined ? { name } : {}),
            ...(category !== undefined ? { category } : {}),
            ...(price !== undefined ? { price: Number(price) } : {}),
            ...(quantity !== undefined ? { quantity: Number(quantity) } : {}),
            ...(expiry_date !== undefined ? { expiry_date: new Date(expiry_date) } : {}),
            ...(supplier !== undefined ? { supplier } : {}),
            ...(barcode !== undefined ? { barcode } : {}),
        };

        const medicine = await Medicine.findByIdAndUpdate(req.params.id, update, { new: true });

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine lama helin.' });
        }

        // Log activity (best-effort)
        try {
            await ActivityLog.create({
                action: 'medicine_updated',
                entityType: 'Medicine',
                entityId: medicine._id,
                message: `${medicine.name} updated`,
                meta: { update }
            });
        } catch (e) {
            console.warn('ActivityLog medicine_updated failed:', e?.message);
        }

        res.json(medicine);
    } catch (err) {
        console.error('PUT /medicines/:id error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ── DELETE /api/medicines/:id ─────────────────────────────────────────────────
// Medicine tirtir
router.delete('/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine lama helin.' });
        }

        // Log activity (best-effort)
        try {
            await ActivityLog.create({
                action: 'medicine_deleted',
                entityType: 'Medicine',
                entityId: medicine._id,
                message: `${medicine.name} deleted`,
                meta: { name: medicine.name }
            });
        } catch (e) {
            console.warn('ActivityLog medicine_deleted failed:', e?.message);
        }

        res.json({ message: 'Medicine si guul leh ayaa loo tirtiray.' });
    } catch (err) {
        console.error('DELETE /medicines/:id error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

module.exports = router;

