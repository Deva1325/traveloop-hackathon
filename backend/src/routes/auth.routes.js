const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { asyncHandler } = require('../helpers/asyncHandler');

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));

module.exports = router;
