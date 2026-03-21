const Joi = require('joi');

const medicineSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  category: Joi.string().min(2).max(50).required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(0).required(),
  expiry_date: Joi.date().min('now').iso().required(),
  supplier: Joi.string().min(2).max(100).required(),
  barcode: Joi.string().allow('')
});

const validateMedicine = (req, res, next) => {
  const { error } = medicineSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(d => d.message)
    });
  }
  next();
};

module.exports = { validateMedicine, medicineSchema };

