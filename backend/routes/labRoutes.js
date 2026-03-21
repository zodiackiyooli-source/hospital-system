const express = require('express');
const router = express.Router();
const LabTest = require('../models/LabTest');
const { getPaginationOptions, paginateQuery } = require('../utils/pagination');
const { successResponse } = require('../utils/response');
const { singleDoc } = require('../middleware/upload');

const { validateLabTest } = require('../validators/labValidator');

// ── GET /api/labs ─────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { search, status, testType, page, limit } = req.query;
    const filter = {};
    
    if (search && search.trim() !== '') {
      filter.$or = [
        { patientName: { $regex: search.trim(), $options: 'i' } },
        { labId: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    if (status && status !== 'All' && status !== '') filter.status = status;
    if (testType && testType !== 'All' && testType !== '') filter.testType = testType;


    const options = getPaginationOptions(req);
    const result = await paginateQuery(LabTest)(filter, options);
    successResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/labs ────────────────────────────────────────────────────────────
router.post('/', validateLabTest, async (req, res, next) => {
  try {
    const labTest = await LabTest.create(req.body);
    successResponse(res, 201, labTest, 'Lab test created');
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/labs/:id/status ──────────────────────────────────────────────────
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const test = await LabTest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    successResponse(res, 200, test, 'Status updated');
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/labs/:id/result ──────────────────────────────────────────────────
router.put('/:id/result', async (req, res, next) => {
  try {
    const { result, result_by } = req.body;
    const test = await LabTest.findByIdAndUpdate(
      req.params.id, 
      { 
        result, 
        result_by,
        result_date: Date.now(),
        status: 'Completed' // Auto complete if result added? Or keep separate?
      }, 
      { new: true }
    );
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    successResponse(res, 200, test, 'Result saved');
  } catch (err) {
    next(err);
  }
});

// ── POST /api/labs/:id/result/upload ──────────────────────────────────────────
router.post('/:id/result/upload', singleDoc, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const test = await LabTest.findByIdAndUpdate(
      req.params.id,
      { 
        result_file: req.file.path,
        result: req.body.result || 'File uploaded',
        status: 'Completed'
      },
      { new: true }
    );

    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    successResponse(res, 200, test, 'File uploaded and result updated');
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/labs/:id ──────────────────────────────────────────────────────────
router.put('/:id', validateLabTest, async (req, res, next) => {
  try {
    const test = await LabTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    successResponse(res, 200, test, 'Lab test updated');
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/labs/:id ──────────────────────────────────────────────────────

router.delete('/:id', async (req, res, next) => {
  try {
    const test = await LabTest.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    successResponse(res, 200, null, 'Lab test deleted');
  } catch (err) {
    next(err);
  }
});


module.exports = router;

