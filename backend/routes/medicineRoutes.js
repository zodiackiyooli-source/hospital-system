const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const ActivityLog = require('../models/ActivityLog');
const { getPaginationOptions, paginateQuery } = require('../utils/pagination');
const { successResponse } = require('../utils/response');
const { validateMedicine } = require('../validators/medicineValidator');
const { processPharmacySale } = require('../services/pharmacyService'); // For sales

// ── GET /api/medicines ────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category && category !== 'all') filter.category = category;

    const options = getPaginationOptions(req);
    const result = await paginateQuery(Medicine)(filter, options);
    successResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/medicines ───────────────────────────────────────────────────────
router.post('/', validateMedicine, async (req, res, next) => {
  try {
    const medicine = await Medicine.create(req.body);

    // Log activity
    await ActivityLog.create({
      action: 'medicine_added',
      entityType: 'Medicine',
      entityId: medicine._id,
      message: `${medicine.name} added`,
      meta: { category: medicine.category, quantity: medicine.quantity }
    }).catch(() => {}); // Best effort

    successResponse(res, 201, medicine, 'Medicine created');
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/medicines/:id ────────────────────────────────────────────────────
router.put('/:id', validateMedicine, async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });

    await ActivityLog.create({
      action: 'medicine_updated',
      entityType: 'Medicine',
      entityId: medicine._id,
      message: `${medicine.name} updated`,
      meta: req.body
    }).catch(() => {});

    successResponse(res, 200, medicine);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/medicines/:id ─────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });

    await ActivityLog.create({
      action: 'medicine_deleted',
      entityType: 'Medicine',
      entityId: medicine._id,
      message: `${medicine.name} deleted`
    }).catch(() => {});

    successResponse(res, 200, { message: 'Medicine deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

