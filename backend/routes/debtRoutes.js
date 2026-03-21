const express = require('express');
const router = express.Router();
const Debt = require('../models/Debt');
const { getPaginationOptions, paginateQuery } = require('../utils/pagination');
const { successResponse } = require('../utils/response');
const { validateDebt } = require('../validators/debtValidator');

// GET all debts
router.get('/', async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { patient_name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;

    const options = getPaginationOptions(req);
    const result = await paginateQuery(Debt)(query, options);
    successResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
});

// GET single debt
router.get('/:id', async (req, res, next) => {
  try {
    const debt = await Debt.findById(req.params.id);
    if (!debt) return res.status(404).json({ success: false, message: 'Debt not found' });
    successResponse(res, 200, debt);
  } catch (err) {
    next(err);
  }
});

// POST new debt
router.post('/', validateDebt, async (req, res, next) => {
  try {
    const debt = await Debt.create(req.body);
    successResponse(res, 201, debt, 'Debt recorded successfully');
  } catch (err) {
    next(err);
  }
});

// PUT update debt
router.put('/:id', validateDebt, async (req, res, next) => {
  try {
    const debt = await Debt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!debt) return res.status(404).json({ success: false, message: 'Debt not found' });
    successResponse(res, 200, debt, 'Debt updated successfully');
  } catch (err) {
    next(err);
  }
});

// DELETE debt
router.delete('/:id', async (req, res, next) => {
  try {
    const debt = await Debt.findByIdAndDelete(req.params.id);
    if (!debt) return res.status(404).json({ success: false, message: 'Debt not found' });
    successResponse(res, 200, null, 'Debt deleted successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
