const Joi = require('joi');

const doctorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  specialty: Joi.string().min(2).max(50).required(),
  phone: Joi.string().min(10).max(15).pattern(/^[0-9+\-\s()]+$/).required(),
  email: Joi.string().email().lowercase().required(),
  qualification: Joi.string().max(200),
  department: Joi.string().max(50),
  status: Joi.string().valid('Active', 'Inactive').default('Active')
});

const validateDoctor = (req, res, next) => {
  const { error } = doctorSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(d => d.message)
    });
  }
  next();
};

module.exports = { validateDoctor, doctorSchema };

