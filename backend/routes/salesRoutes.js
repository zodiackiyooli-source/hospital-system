const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const { getPaginationOptions, paginateQuery } = require('../utils/pagination');
const { successResponse } = require('../utils/response');

// ── GET /api/sales ─────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { search, method, status, from, to } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { invoiceId: { $regex: search, $options: 'i' } },
        { serviceOrItem: { $regex: search, $options: 'i' } }
      ];
    }

    if (method && method !== 'All') filter.paymentMethod = method;
    if (status && status !== 'All') filter.status = status;

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    } else {
      // Default to today if no date range provided? 
      // User requested "Daily Sales", so filtering by specific date is key.
    }
    
    const options = getPaginationOptions(req);
    const result = await paginateQuery(Sale)(filter, options);
    successResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/sales/stats ───────────────────────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await Sale.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow } } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          count: { $sum: 1 },
          cashPayments: {
            $sum: { $cond: [{ $eq: ['$paymentMethod', 'Cash'] }, '$totalAmount', 0] }
          },
          pendingAmount: {
            $sum: { $cond: [{ $ne: ['$status', 'Paid'] }, '$totalAmount', 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalSales: 0,
      count: 0,
      cashPayments: 0,
      pendingAmount: 0
    };

    successResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/sales ────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const sale = await Sale.create(req.body);
    successResponse(res, 201, sale, 'Sale processed');
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/sales/:id ──────────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
    successResponse(res, 200, null, 'Sale deleted');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
