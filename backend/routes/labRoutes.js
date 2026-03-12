const express = require('express');
const router = express.Router();
const LabTest = require('../models/LabTest');

// ── GET /api/labs ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const tests = await LabTest.find().sort({ createdAt: -1 });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── POST /api/labs ────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { patientName, testType, date } = req.body;
        if (!patientName || !testType || !date) {
            return res.status(400).json({ message: 'Patient name, test type, iyo date waa waajib.' });
        }
        const test = new LabTest(req.body);
        await test.save();
        res.status(201).json(test);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── PUT /api/labs/:id/status ──────────────────────────────────────────────────
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const test = await LabTest.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!test) return res.status(404).json({ message: 'Test lama helin.' });
        res.json(test);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── PUT /api/labs/:id/result ──────────────────────────────────────────────────
router.put('/:id/result', async (req, res) => {
    try {
        const { result } = req.body;
        const test = await LabTest.findByIdAndUpdate(req.params.id, { result }, { new: true });
        if (!test) return res.status(404).json({ message: 'Test lama helin.' });
        res.json(test);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── DELETE /api/labs/:id ──────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        await LabTest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Test si guul leh ayaa loo tirtiray.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
