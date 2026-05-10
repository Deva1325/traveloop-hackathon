const express = require('express');
const router = express.Router({ mergeParams: true });
const packingController = require('../controllers/packing.controller');
const { asyncHandler } = require('../helpers/asyncHandler');

router.post('/', asyncHandler(packingController.addItem));
router.get('/', asyncHandler(packingController.getItems));
router.put('/reset', asyncHandler(packingController.resetChecklist));
router.put('/:itemId/packed', asyncHandler(packingController.togglePacked));
router.delete('/:itemId', asyncHandler(packingController.deleteItem));

module.exports = router;
