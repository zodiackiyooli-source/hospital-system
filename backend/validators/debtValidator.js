const Joi = require('joi');

const debtSchema = Joi.object({
  patient_name: Joi.string().required().messages({
    'string.empty': 'Magaca bukaanka waa muhiim',
    'any.required': 'Magaca bukaanka waa muhiim'
  }),
  phone: Joi.string().required().messages({
    'string.empty': 'Telefoonka waa muhiim',
    'any.required': 'Telefoonka waa muhiim'
  }),
  service: Joi.string().required().messages({
    'string.empty': 'Adeegga ama Daawada waa muhiim',
    'any.required': 'Adeegga ama Daawada waa muhiim'
  }),
  total_amount: Joi.number().min(0).required().messages({
    'number.base': 'Lacagtu waa inay tiro noqotaa',
    'any.required': 'Lacagta guud waa laga baqaa'
  }),
  paid_amount: Joi.number().min(0).default(0),
  remaining_amount: Joi.number().min(0).required(),
  date: Joi.date().iso().optional(),
  status: Joi.string().valid('Paid', 'Unpaid').optional()
});

const validateDebt = (req, res, next) => {
  const { error } = debtSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error: ' + messages
    });
  }
  next();
};

module.exports = { validateDebt, debtSchema };
