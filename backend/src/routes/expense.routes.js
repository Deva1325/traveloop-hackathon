const express = require('express');
const router = express.Router({ mergeParams: true });
const expenseController = require('../controllers/expense.controller');
const { asyncHandler } = require('../helpers/asyncHandler');

router.post('/', asyncHandler(expenseController.addExpense));
router.get('/', asyncHandler(expenseController.getExpenses));

module.exports = router;
