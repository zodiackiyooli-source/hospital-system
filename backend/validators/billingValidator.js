const Joi = require('joi');

const billingSchema = Joi.object({
  patient_id: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      medicine_id: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  total: Joi.number().min(0).required(),
  status: Joi.string().valid('Pending', 'Paid', 'Overdue').default('Pending'),
  notes: Joi.string().allow('')
});

const validateBilling = (req, res, next) => {
  const { error } = billingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(d => d.message)
    });
  }
  next();
};

module.exports = { validateBilling, billingSchema };

