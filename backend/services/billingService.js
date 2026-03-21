const Billing = require('../models/Billing');
const PharmacySales = require('../models/PharmacySales');
const Medicine = require('../models/Medicine');

// Calculate billing total from items
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.quantity * item.price), 0);
};

// Create billing record
const createBilling = async (billingData) => {
  const { patient_id, items, notes } = billingData;
  const total = calculateTotal(items);
  
  const billing = await Billing.create({
    patient_id,
    items,
    total,
    status: 'Pending',
    notes
  });

  return billing;
};

// Process pharmacy sale + update stock
const processSale = async (saleData) => {
  const session = await PharmacySales.startSession();
  try {
    let total = 0;
    await session.withTransaction(async () => {
      for (let item of saleData.items) {
        // Update medicine stock
        const medicine = await Medicine.findByIdAndUpdate(
          item.medicine_id,
          { $inc: { quantity: -item.quantity } },
          { session, new: true }
        );

        if (medicine.quantity < 0) {
          throw new Error(`Insufficient stock for ${medicine.name}`);
        }

        total += item.quantity * item.price;
      }

      // Create sale
      saleData.total = total;
      const sale = await PharmacySales.create([saleData], { session });
      return sale[0];
    });

    return { success: true, total };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    session.endSession();
  }
};

module.exports = { calculateTotal, createBilling, processSale };

