const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const { successResponse } = require('../utils/response');

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
router.get('/', async (req, res, next) => {
    try {
        const prescriptions = await Prescription.find().sort({ createdAt: -1 });
        successResponse(res, 200, prescriptions);
    } catch (err) {
        next(err);
    }
});

// @desc    Get all prescriptions for a specific patient
// @route   GET /api/prescriptions/patient/:id
router.get('/patient/:id', async (req, res, next) => {
    try {
        const prescriptions = await Prescription.find({ patient_db_id: req.params.id }).sort({ createdAt: -1 });
        successResponse(res, 200, prescriptions);
    } catch (err) {
        next(err);
    }
});

// @desc    Create new prescription
// @route   POST /api/prescriptions
router.post('/', async (req, res, next) => {
    try {
        const { patient_db_id, patient_id, patient_name, practitioner, date, serial, medicines } = req.body;
        
        const prescription = await Prescription.create({
            patient_db_id,
            patient_id,
            patient_name,
            practitioner,
            date,
            serial,
            medicines
        });

        successResponse(res, 201, prescription);
    } catch (err) {
        next(err);
    }
});

// @desc    Update a prescription
// @route   PUT /api/prescriptions/:id
router.put('/:id', async (req, res, next) => {
    try {
        const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        successResponse(res, 200, prescription);
    } catch (err) {
        next(err);
    }
});

// @desc    Delete a prescription
// @route   DELETE /api/prescriptions/:id
router.delete('/:id', async (req, res, next) => {
    try {
        await Prescription.findByIdAndDelete(req.params.id);
        successResponse(res, 200, { message: 'Prescription deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
