const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g. medicine_added, medicine_updated, sale_created
    entityType: { type: String, required: true }, // e.g. Medicine, PharmacySales
    entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    message: { type: String, default: '' },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);

