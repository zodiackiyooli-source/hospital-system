const express = require('express');
const router = express.Router();

const Medicine = require('../models/Medicine');
const PharmacySales = require('../models/PharmacySales');
const ActivityLog = require('../models/ActivityLog');

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function parseRange(query) {
  const now = new Date();
  const range = String(query.range || '').toLowerCase();

  if (range === 'today') {
    return { from: startOfDay(now), to: endOfDay(now) };
  }
  if (range === 'week') {
    const from = startOfDay(now);
    from.setDate(from.getDate() - 6);
    return { from, to: endOfDay(now) };
  }
  if (range === 'month') {
    const from = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
    return { from, to: endOfDay(now) };
  }

  const from = query.from ? new Date(query.from) : null;
  const to = query.to ? new Date(query.to) : null;
  if (from && to) return { from: startOfDay(from), to: endOfDay(to) };
  return { from: null, to: null };
}

// ── GET /api/pharmacy/dashboard ────────────────────────────────────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const todayFrom = startOfDay(today);
    const todayTo = endOfDay(today);

    const [totalMedicines, lowStockMedicines, expiredMedicines] = await Promise.all([
      Medicine.countDocuments(),
      Medicine.countDocuments({ quantity: { $lte: 20 }, expiry_date: { $gte: todayFrom } }),
      Medicine.countDocuments({ expiry_date: { $lt: todayFrom } }),
    ]);

    const todaySalesAgg = await PharmacySales.aggregate([
      { $match: { date: { $gte: todayFrom, $lte: todayTo } } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]);
    const todaySales = todaySalesAgg[0]?.total || 0;
    const todayPrescriptions = todaySalesAgg[0]?.count || 0;

    const suppliers = await Medicine.distinct('supplier');
    const totalSuppliers = suppliers.filter(Boolean).length;

    // Charts
    const { from, to } = parseRange({ range: 'month' }); // default last month view
    const salesByDay = await PharmacySales.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$total' },
          prescriptions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', total: 1, prescriptions: 1 } },
    ]);

    const usageByMedicine = await PharmacySales.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      { $group: { _id: '$medicine_id', qty: { $sum: '$quantity' } } },
      { $sort: { qty: -1 } },
      { $limit: 7 },
      {
        $lookup: {
          from: 'medicines',
          localField: '_id',
          foreignField: '_id',
          as: 'medicine',
        },
      },
      { $unwind: { path: '$medicine', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, name: '$medicine.name', qty: 1 } },
    ]);

    const stockDistribution = await Medicine.aggregate([
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                { case: { $lt: ['$expiry_date', todayFrom] }, then: 'Expired' },
                { case: { $lte: ['$quantity', 20] }, then: 'Low Stock' },
              ],
              default: 'Available',
            },
          },
        },
      },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } },
    ]);

    // Alerts
    const lowStockAlerts = await Medicine.find({ quantity: { $lte: 20 }, expiry_date: { $gte: todayFrom } })
      .sort({ quantity: 1 })
      .limit(5)
      .select('name quantity expiry_date');

    const expiredAlerts = await Medicine.find({ expiry_date: { $lt: todayFrom } })
      .sort({ expiry_date: -1 })
      .limit(5)
      .select('name quantity expiry_date');

    // Recent activity (fallback to medicine/sales if activity log empty)
    const activity = await ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean();

    res.json({
      stats: {
        totalMedicines,
        lowStockMedicines,
        expiredMedicines,
        todaySales,
        todayPrescriptions,
        totalSuppliers,
      },
      charts: {
        salesByDay,
        usageByMedicine,
        stockDistribution,
      },
      alerts: {
        lowStock: lowStockAlerts,
        expired: expiredAlerts,
      },
      activity,
    });
  } catch (err) {
    console.error('GET /pharmacy/dashboard error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ── GET /api/pharmacy/reports ─────────────────────────────────────────────────
router.get('/reports', async (req, res) => {
  try {
    const { from, to } = parseRange(req.query);
    const match = {};
    if (from && to) match.date = { $gte: from, $lte: to };

    const salesRows = await PharmacySales.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            medicine_id: '$medicine_id',
          },
          quantitySold: { $sum: '$quantity' },
          total: { $sum: '$total' },
        },
      },
      {
        $lookup: {
          from: 'medicines',
          localField: '_id.medicine_id',
          foreignField: '_id',
          as: 'medicine',
        },
      },
      { $unwind: { path: '$medicine', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          date: '$_id.day',
          medicine: '$medicine.name',
          category: '$medicine.category',
          quantitySold: 1,
          total: 1,
        },
      },
      { $sort: { date: -1, total: -1 } },
      { $limit: 200 },
    ]);

    const stockRows = await Medicine.find()
      .sort({ createdAt: -1 })
      .select('name category quantity expiry_date supplier price')
      .lean();

    const monthSales = await PharmacySales.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          total: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: '$_id', total: 1 } },
    ]);

    const mostUsedMedicines = await PharmacySales.aggregate([
      { $match: match },
      { $group: { _id: '$medicine_id', qty: { $sum: '$quantity' } } },
      { $sort: { qty: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'medicines',
          localField: '_id',
          foreignField: '_id',
          as: 'medicine',
        },
      },
      { $unwind: { path: '$medicine', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, medicine: '$medicine.name', qty: 1 } },
    ]);

    const categoryUsage = await PharmacySales.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'medicines',
          localField: 'medicine_id',
          foreignField: '_id',
          as: 'medicine',
        },
      },
      { $unwind: { path: '$medicine', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$medicine.category', qty: { $sum: '$quantity' } } },
      { $sort: { qty: -1 } },
      { $project: { _id: 0, category: '$_id', qty: 1 } },
    ]);

    res.json({
      range: from && to ? { from, to } : null,
      tables: {
        sales: salesRows,
        stock: stockRows,
      },
      charts: {
        monthSales,
        mostUsedMedicines,
        categoryUsage,
      },
    });
  } catch (err) {
    console.error('GET /pharmacy/reports error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;

