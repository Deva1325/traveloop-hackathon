const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../helpers/asyncHandler');

router.use(authenticate);

router.get('/saved-destinations', asyncHandler(userController.getSavedDestinations));
router.post('/saved-destinations', asyncHandler(userController.saveDestination));
router.delete('/saved-destinations/:cityId', asyncHandler(userController.removeSavedDestination));

module.exports = router;
