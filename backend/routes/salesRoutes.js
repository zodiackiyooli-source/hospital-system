const express = require('express');
const router = express.Router();

const Medicine = require('../models/Medicine');
const PharmacySales = require('../models/PharmacySales');
const ActivityLog = require('../models/ActivityLog');

// ── POST /api/sales ────────────────────────────────────────────────────────────
// Create a sale/prescription record and decrement stock
router.post('/', async (req, res) => {
  try {
    const { medicine_id, quantity, patient_id, staff_id, date } = req.body;

    if (!medicine_id || quantity == null) {
      return res.status(400).json({ message: 'medicine_id iyo quantity waa waajib.' });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ message: 'quantity waa inuu noqdaa number sax ah oo ka weyn 0.' });
    }

    const medicine = await Medicine.findById(medicine_id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine lama helin.' });
    }

    if (medicine.quantity < qty) {
      return res.status(400).json({ message: `Stock kuma filna. Available: ${medicine.quantity}` });
    }

    medicine.quantity = Number(medicine.quantity) - qty;
    await medicine.save();

    const price = Number(medicine.price || 0);
    const total = Number((price * qty).toFixed(2));

    const sale = await PharmacySales.create({
      medicine_id: medicine._id,
      quantity: qty,
      price,
      total,
      patient_id: patient_id || null,
      staff_id: staff_id || null,
      date: date ? new Date(date) : new Date(),
    });

    // Log activity (best-effort)
    try {
      await ActivityLog.create({
        action: 'sale_created',
        entityType: 'PharmacySales',
        entityId: sale._id,
        message: `${medicine.name} sold (${qty})`,
        meta: { medicine_id: medicine._id, medicine_name: medicine.name, quantity: qty, total },
      });
    } catch (e) {
      console.warn('ActivityLog sale_created failed:', e?.message);
    }

    res.status(201).json(sale);
  } catch (err) {
    console.error('POST /sales error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ── GET /api/sales ─────────────────────────────────────────────────────────────
// List sales (optional date range)
router.get('/', async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const filter = {};

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const max = Math.min(Number(limit || 50), 200);

    const sales = await PharmacySales.find(filter)
      .populate('medicine_id', 'name category')
      .sort({ date: -1 })
      .limit(max);

    res.json(sales);
  } catch (err) {
    console.error('GET /sales error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;

