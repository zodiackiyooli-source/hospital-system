const Medicine = require('../models/Medicine');

// Process pharmacy sale (update stock)
const processPharmacySale = async (items) => {
  const updates = items.map(item => ({
    updateOne: {
      filter: { _id: item.medicine_id },
      update: { $inc: { quantity: -item.quantity } }
    }
  }));

  const result = await Medicine.bulkWrite(updates);
  
  // Check low stock
  const lowStock = await Medicine.find({ quantity: { $lt: 10 } }).select('name quantity');
  
  return { 
    updated: result.modifiedCount, 
    lowStockAlerts: lowStock 
  };
};

// Get expiry alerts
const getExpiryAlerts = async (days = 30) => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + days);
  
  return await Medicine.find({
    expiry_date: { $lte: threshold, $ne: null },
    quantity: { $gt: 0 }
  }).sort({ expiry_date: 1 }).limit(10);
};

module.exports = { processPharmacySale, getExpiryAlerts };

