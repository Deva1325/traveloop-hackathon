const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createTripSchema } = require('../validations/trip.validation');
const { asyncHandler } = require('../helpers/asyncHandler');
const itineraryRoutes = require('./itinerary.routes');
const expenseRoutes = require('./expense.routes');
const packingRoutes = require('./packing.routes');
const noteRoutes = require('./note.routes');

router.use(authenticate);

router.post('/', validate(createTripSchema), asyncHandler(tripController.create));
router.get('/', asyncHandler(tripController.getAll));
router.get('/:id', asyncHandler(tripController.getOne));
router.put('/:id', validate(createTripSchema), asyncHandler(tripController.update));
router.delete('/:id', asyncHandler(tripController.delete));

// Nested Routes
router.use('/:tripId/stops', itineraryRoutes);
router.use('/:tripId/expenses', expenseRoutes);
router.use('/:tripId/checklist', packingRoutes);
router.use('/:tripId/notes', noteRoutes);

module.exports = router;
