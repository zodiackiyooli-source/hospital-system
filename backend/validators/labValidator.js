const Joi = require('joi');

const labTestSchema = Joi.object({
    patient: Joi.string().optional().allow(null),
    patientName: Joi.string().required(),
    surname: Joi.string().allow('').optional(),
    testType: Joi.string().required(),
    date: Joi.string().required(),
    doctor: Joi.string().allow('').optional(),
    note: Joi.string().allow('').optional(),
    status: Joi.string().valid('Pending', 'In Progress', 'Completed', 'Cancelled').optional(),
    result: Joi.string().allow('').optional(),
});

const validateLabTest = (req, res, next) => {
    const { error } = labTestSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
};

module.exports = { validateLabTest };
