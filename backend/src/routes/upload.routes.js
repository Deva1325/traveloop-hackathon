const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/upload.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../helpers/asyncHandler');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post('/image', authenticate, upload.single('image'), asyncHandler(uploadController.uploadImage));

module.exports = router;
