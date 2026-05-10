const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { asyncHandler } = require('../helpers/asyncHandler');

router.get('/city/:cityId', asyncHandler(activityController.getCityActivities));

module.exports = router;
