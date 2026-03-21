const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { getPaginationOptions, paginateQuery } = require('../utils/pagination');
const { successResponse } = require('../utils/response');
const { validatePatient } = require('../validators/patientValidator');

// ── GET /api/patients (paginated/search) ──────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { patient_id: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const options = getPaginationOptions(req);
    const result = await paginateQuery(Patient)(query, options);
    successResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/patients ────────────────────────────────────────────────────────
router.post('/', validatePatient, async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);
    successResponse(res, 201, patient, 'Patient created');
  } catch (err) {
    console.error('Save Patient Error:', err);
    next(err);
  }
});

// ── PUT /api/patients/:id ─────────────────────────────────────────────────────
router.put('/:id', validatePatient, async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    successResponse(res, 200, patient, 'Patient updated');
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/patients/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    successResponse(res, 200, { message: 'Patient deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

