const Joi = require('joi');

const appointmentSchema = Joi.object({
  patient_id: Joi.string().required(),
  doctor_id: Joi.string().required(),
  date: Joi.date().min('now').iso().required(),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  reason: Joi.string().max(500),
  status: Joi.string().valid('Scheduled', 'Confirmed', 'Completed', 'Cancelled').default('Scheduled'),
  notes: Joi.string().allow('')
});

const validateAppointment = (req, res, next) => {
  const { error } = appointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(d => d.message)
    });
  }
  next();
};

module.exports = { validateAppointment, appointmentSchema };

