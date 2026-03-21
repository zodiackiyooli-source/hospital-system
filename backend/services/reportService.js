const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');
const PharmacySales = require('../models/PharmacySales');

// Generate dashboard reports
const getDashboardStats = async () => {
  const [
    totalPatients,
    totalDoctors,
    todayAppointments,
    totalRevenue
  ] = await Promise.all([
    Patient.countDocuments(),
    // Assume Doctor model exists
    // Doctor.countDocuments(),
    0, // Placeholder
    Appointment.countDocuments({ date: new Date().toISOString().split('T')[0] }),
    Billing.aggregate([{ $group: { _sum: { $sum: '$total' } } }])
  ]);

  return {
    totalPatients,
    totalDoctors: 0,
    todayAppointments,
    totalRevenue: totalRevenue[0]?._sum || 0
  };
};

// Sales report by date range
const getSalesReport = async ({ from, to }) => {
  return await PharmacySales.aggregate([
    { $match: { date: { $gte: new Date(from), $lte: new Date(to) } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, total: { $sum: '$total' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = { getDashboardStats, getSalesReport };

