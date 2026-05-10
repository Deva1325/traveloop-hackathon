const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { asyncHandler } = require('../helpers/asyncHandler');

const { authenticate } = require('../middlewares/auth.middleware');

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.get('/profile', authenticate, asyncHandler(authController.getProfile));
router.put('/profile', authenticate, asyncHandler(authController.updateProfile));
router.delete('/account', authenticate, asyncHandler(authController.deleteAccount));

module.exports = router;
