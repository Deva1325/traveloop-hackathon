const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');
const { asyncHandler } = require('../helpers/asyncHandler');

router.get('/trips/:slug', asyncHandler(publicController.getSharedTrip));

module.exports = router;
