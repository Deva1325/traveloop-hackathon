const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const tripRoutes = require('./trip.routes');

router.use('/upload', require('./upload.routes'));
router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/public', require('./public.routes'));
router.use('/analytics', require('./analytics.routes'));
router.use('/activities', require('./activity.routes'));

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

module.exports = router;
