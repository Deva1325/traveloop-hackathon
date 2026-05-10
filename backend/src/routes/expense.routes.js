const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { asyncHandler } = require('../helpers/asyncHandler');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/categories', asyncHandler(expenseController.getCategories));
router.get('/trip/:tripId', asyncHandler(expenseController.getTripExpenses));
router.get('/trip/:tripId/summary', asyncHandler(expenseController.getTripSummary));
router.get('/global/summary', asyncHandler(expenseController.getGlobalSummary));

router.post('/', asyncHandler(expenseController.addExpense));
router.put('/:id', asyncHandler(expenseController.updateExpense));
router.delete('/:id', asyncHandler(expenseController.deleteExpense));

module.exports = router;
