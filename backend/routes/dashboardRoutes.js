const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Medicine = require('../models/Medicine');
const Doctor = require('../models/Doctor');
const PharmacySales = require('../models/PharmacySales');
const { successResponse } = require('../utils/response');

router.get('/', async (req, res, next) => {
    try {
        const totalPatients = await Patient.countDocuments();
        const totalMedicines = await Medicine.countDocuments();
        const lowStockMedicinesCount = await Medicine.countDocuments({ quantity: { $lte: 20 } });
        const totalDoctors = await Doctor.countDocuments();

        // **1. Patient Demographics (Gender)**
        const maleCount = await Patient.countDocuments({ gender: 'Male' });
        const femaleCount = await Patient.countDocuments({ gender: 'Female' });
        const patientData = [
            { name: "Male", value: maleCount || 0 },
            { name: "Female", value: femaleCount || 0 },
        ];

        // **2. Top Selling Medicines**
        let topMedicines = [];
        const topMedsAgg = await PharmacySales.aggregate([
            { $group: { _id: "$medicine_id", sales: { $sum: "$total" } } },
            { $sort: { sales: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "medicines",
                    localField: "_id",
                    foreignField: "_id",
                    as: "med"
                }
            },
            { $unwind: "$med" }
        ]);

        if (topMedsAgg.length > 0) {
            topMedicines = topMedsAgg
                .filter(item => item.med) // Ensure med exists
                .map(item => ({
                    name: item.med.name,
                    sales: item.sales
                }));
        } else {
            // Fallback if no sales yet
            topMedicines = [
                { name: "No Sales Yet", sales: 0 }
            ];
        }

        if (topMedicines.length === 0) {
            topMedicines = [{ name: "No Data", sales: 0 }];
        }

        // **3. Monthly Revenue (Expense vs Profit mock / Actual Revenue)**
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Last 7 days including today

        const weeklyTrend = await PharmacySales.aggregate([
            { $match: { date: { $exists: true, $ne: null, $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const revAgg = await PharmacySales.aggregate([
            { $match: { date: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                    revenue: { $sum: "$total" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let expenseRevenue = revAgg.map(item => ({
            name: months[item._id.month - 1],
            expense: item.revenue * 0.4, // Assume 40% expense
            profit: item.revenue * 0.6   // Assume 60% profit
        }));

        if (expenseRevenue.length === 0) {
            expenseRevenue = [
                { name: "Current", expense: 0, profit: 0 }
            ];
        }

        successResponse(res, 200, {
            totalPatients,
            totalMedicines,
            totalDoctors,
            stockAlerts: lowStockMedicinesCount,
            patientData,
            topMedicines,
            expenseRevenue
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;
