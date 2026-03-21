const PharmacySales = require('../models/PharmacySales');

// Generate unique invoice number: INV-YYYYMMDD-### 
const generateInvoiceNumber = async () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const lastInvoice = await PharmacySales.findOne({
    invoice_number: new RegExp(`^INV-${today}`)
  }).sort({ createdAt: -1 }).limit(1);

  const seq = lastInvoice ? parseInt(lastInvoice.invoice_number.slice(-3)) + 1 : 1;
  const padded = seq.toString().padStart(3, '0');

  return `INV-${today}-${padded}`;
};

module.exports = { generateInvoiceNumber };

