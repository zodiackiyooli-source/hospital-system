const express = require('express');
const router = express.Router();
const { getSalesReport } = require('../services/reportService');
const { successResponse } = require('../utils/response');
const Medicine = require('../models/Medicine');
const PharmacySales = require('../models/PharmacySales');
const ActivityLog = require('../models/ActivityLog');

// ── GET /api/pharmacy/dashboard ────────────────────────────────────────────────
router.get('/dashboard', async (req, res, next) => {
  try {
    const today = new Date();

    // Stats
    const totalMedicines = await Medicine.countDocuments();

    const lowStockMedicines = await Medicine.find({ quantity: { $lte: 20 } });
    const lowStockLevel = lowStockMedicines.length;

    const expiredMedicines = await Medicine.find({ expiry_date: { $lt: today } });
    const expiredCount = expiredMedicines.length;

    // Optional: revenue for today
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todaysSales = await PharmacySales.aggregate([
      { $match: { date: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const todayRevenue = todaysSales.length > 0 ? todaysSales[0].total : 0;

    const data = {
      stats: {
        totalMedicines,
        lowStockLevel,
        totalSalesToday: todayRevenue,
        expiredCount
      },
      charts: {
        salesByDay: [],
        usageByMedicine: [],
        stockDistribution: []
      },
      activity: [],
      alerts: {
        lowStock: lowStockMedicines.map(m => ({ id: m._id, name: m.name, quantity: m.quantity })),
        expired: expiredMedicines.map(m => ({ id: m._id, name: m.name, expiredAt: m.expiry_date }))
      }
    };

    successResponse(res, 200, data);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/pharmacy/daily-stats ──────────────────────────────────────────────
router.get('/daily-stats', async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const filterDate = req.query.date ? new Date(req.query.date) : today;
    const filterStart = new Date(filterDate);
    filterStart.setHours(0, 0, 0, 0);
    const filterEnd = new Date(filterDate);
    filterEnd.setHours(23, 59, 59, 999);

    // 1. Stats for the selected day
    const salesAgg = await PharmacySales.aggregate([
      { $match: { date: { $gte: filterStart, $lte: filterEnd } } },
      { 
        $group: { 
          _id: null, 
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 } 
        } 
      }
    ]);
    const stats = {
      totalRevenue: salesAgg[0]?.totalRevenue || 0,
      totalOrders: salesAgg[0]?.totalOrders || 0,
      profit: (salesAgg[0]?.totalRevenue || 0) * 0.2 // Assume 20% margin
    };

    // 2. Sales Table items (detailed list for the day)
    const salesTable = await PharmacySales.find({ date: { $gte: filterStart, $lte: filterEnd } })
      .populate('medicine_id', 'name')
      .sort({ date: -1 });

    // 3. Top Selling Medicines (Top 5)
    const topMedicines = await PharmacySales.aggregate([
      { $match: { date: { $gte: filterStart, $lte: filterEnd } } },
      { 
        $group: { 
          _id: "$medicine_id", 
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" }
        } 
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'medicines',
          localField: '_id',
          foreignField: '_id',
          as: 'medicine'
        }
      },
      { $unwind: "$medicine" },
      {
        $project: {
          name: "$medicine.name",
          quantity: "$totalQuantity",
          revenue: "$totalRevenue"
        }
      }
    ]);

    // 4. Sales Overview (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0,0,0,0);

    const weeklyTrend = await PharmacySales.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$total" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    successResponse(res, 200, {
      stats,
      salesTable,
      topMedicines,
      weeklyTrend
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/pharmacy/reports ─────────────────────────────────────────────────
router.get('/reports', async (req, res, next) => {
  try {
    const report = await getSalesReport({ from: req.query.from || new Date('2000-01-01'), to: req.query.to || new Date() });
    successResponse(res, 200, report);
  } catch (err) {
    next(err);
  }
});


module.exports = router;

