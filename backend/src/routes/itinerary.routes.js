const express = require('express');
const router = express.Router({ mergeParams: true });
const itineraryController = require('../controllers/itinerary.controller');
const { asyncHandler } = require('../helpers/asyncHandler');

router.post('/', asyncHandler(itineraryController.addStop));
router.put('/reorder', asyncHandler(itineraryController.reorderStops));
router.put('/:id', asyncHandler(itineraryController.updateStop));
router.delete('/:id', asyncHandler(itineraryController.deleteStop));

module.exports = router;
