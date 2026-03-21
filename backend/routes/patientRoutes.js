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

// ── GET /api/patients/:id/history ─────────────────────────────────────────────
router.get('/:id/history', async (req, res, next) => {
  try {
    const patientId = req.params.id;
    const patientDoc = await Patient.findById(patientId);
    if (!patientDoc) return res.status(404).json({ success: false, message: 'Patient not found' });

    const Prescription = require('../models/Prescription');
    const LabTest = require('../models/LabTest');
    const Appointment = require('../models/Appointment');

    const [prescriptions, labTests, appointments] = await Promise.all([
      Prescription.find({ patient_db_id: patientId }).sort({ date: -1 }),
      LabTest.find({ patient: patientId }).sort({ date: -1 }),
      Appointment.find({ patient_id: patientId }).populate('doctor_id').sort({ date: -1 })
    ]);

    // Format all to a unified timeline structure
    const timeline = [
      ...prescriptions.map(p => ({
        id: p._id,
        type: 'prescription',
        date: p.date,
        doctor: p.practitioner,
        title: 'Prescription Issued',
        details: p.medicines.map(m => `${m.name} (${m.qty})`).join(', ')
      })),
      ...labTests.map(t => ({
        id: t._id,
        type: 'lab',
        date: t.date,
        doctor: t.doctor,
        title: `Lab Test: ${t.testType}`,
        details: `Status: ${t.status}. Result: ${t.result || 'Pending'}`
      })),
      ...appointments.map(a => ({
        id: a._id,
        type: 'appointment',
        date: a.date,
        doctor: a.doctor_id?.name || 'Unknown',
        title: 'Clinic Appointment',
        details: `Notes: ${a.notes || 'No notes'}. Status: ${a.status}`
      })),
      {
        id: 'registration',
        type: 'registration',
        date: patientDoc.createdAt,
        doctor: 'ADMIN',
        title: 'Initial Registration',
        details: `Patient was officially registered in the hospital database.`
      }
    ];

    // Final sort by date descending
    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    successResponse(res, 200, { timeline });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

