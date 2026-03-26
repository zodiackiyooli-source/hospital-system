const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { successResponse } = require('../utils/response');

// ── GET /api/doctors ──────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
    try {
        const doctors = await Doctor.find().sort({ createdAt: -1 });
        successResponse(res, 200, { doctors });
    } catch (err) {
        next(err);
    }
});

// ── POST /api/doctors ─────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
    try {
        const doctor = await Doctor.create(req.body);
        successResponse(res, 201, { doctor }, 'Doctor added successfully');
    } catch (err) {
        next(err);
    }
});

// ── GET /api/doctors/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        successResponse(res, 200, doctor);
    } catch (err) {
        next(err);
    }
});

// ── PUT /api/doctors/:id ─────────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        successResponse(res, 200, { doctor }, 'Doctor updated successfully');
    } catch (err) {
        next(err);
    }
});

// ── DELETE /api/doctors/:id ───────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        successResponse(res, 200, {}, 'Doctor deleted successfully');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
