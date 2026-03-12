const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// ── GET /api/patients ─────────────────────────────────────────────────────────
// Patients-ka oo dhan soo celi
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { full_name: { $regex: search, $options: 'i' } },
                    { patient_id: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                ]
            };
        }
        const patients = await Patient.find(query).sort({ createdAt: -1 });
        res.json(patients);
    } catch (err) {
        console.error('GET /patients error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ── POST /api/patients ────────────────────────────────────────────────────────
// Patient cusub ku dar
router.post('/', async (req, res) => {
    try {
        const { full_name, age, phone, status, medical_record, gender, address, blood_group } = req.body;

        if (!full_name || !age || !phone) {
            return res.status(400).json({ message: 'Magaca, da\'da, iyo taleefanka waa waajib.' });
        }

        const createPayload = {
            full_name,
            age: Number(age),
            phone,
            gender: gender || 'Male',
            address: address || 'N/A',
            blood_group: blood_group || 'O+',
            medical_record: medical_record || '',
            history: status || 'Active'
        };

        // patient_id is auto-generated in the model; retry once on duplicate key
        let patient;
        try {
            patient = await Patient.create(createPayload);
        } catch (err) {
            if (err?.code === 11000 && err?.keyPattern?.patient_id) {
                patient = await Patient.create(createPayload);
            } else {
                throw err;
            }
        }

        res.status(201).json(patient);
    } catch (err) {
        console.error('POST /patients error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ── PUT /api/patients/:id ─────────────────────────────────────────────────────
// Patient wax ka bedel
router.put('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) return res.status(404).json({ message: 'Patient lama helin.' });
        res.json(patient);
    } catch (err) {
        console.error('PUT /patients/:id error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ── DELETE /api/patients/:id ──────────────────────────────────────────────────
// Patient tirtir
router.delete('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient lama helin.' });
        res.json({ message: 'Patient si guul leh ayaa loo tirtiray.' });
    } catch (err) {
        console.error('DELETE /patients/:id error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

module.exports = router;
