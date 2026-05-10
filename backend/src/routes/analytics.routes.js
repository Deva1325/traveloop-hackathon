const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../helpers/asyncHandler');

router.use(authenticate);
router.get('/dashboard', asyncHandler(analyticsController.getDashboardStats));

module.exports = router;
