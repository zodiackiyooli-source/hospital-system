const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { successResponse } = require('../utils/response');

// ── GET /api/appointments ─────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient_id', 'name age gender phone')
            .populate('doctor_id', 'name specialization')
            .sort({ date: -1 });
        successResponse(res, 200, { appointments });
    } catch (err) {
        next(err);
    }
});

// ── POST /api/appointments ────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
    try {
        const { patient_id, doctor_id, date, time, status, notes, isOnline } = req.body;

        if (!patient_id || !doctor_id || !date || !time) {
            return res.status(400).json({ message: 'patient_id, doctor_id, date, and time are required.' });
        }

        const patient = await Patient.findById(patient_id);
        if (!patient) return res.status(404).json({ message: 'Patient not found.' });

        const doctor = await Doctor.findById(doctor_id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });

        const appointment = await Appointment.create({
            patient_id, doctor_id, date, time,
            status: status || 'Scheduled',
            notes: notes || '',
            isOnline: isOnline || false
        });

        await appointment.populate([
            { path: 'patient_id', select: 'name age gender phone' },
            { path: 'doctor_id', select: 'name specialization' }
        ]);

        successResponse(res, 201, { appointment }, 'Appointment booked successfully');
    } catch (err) {
        next(err);
    }
});

// ── GET /api/appointments/:id ─────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient_id', 'name age gender phone')
            .populate('doctor_id', 'name specialization');
        if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
        successResponse(res, 200, { appointment });
    } catch (err) {
        next(err);
    }
});

// ── PUT /api/appointments/:id ─────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('patient_id', 'name age gender phone')
            .populate('doctor_id', 'name specialization');

        if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
        successResponse(res, 200, { appointment }, 'Appointment updated successfully');
    } catch (err) {
        next(err);
    }
});

// ── DELETE /api/appointments/:id ──────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
        successResponse(res, 200, {}, 'Appointment cancelled successfully');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
