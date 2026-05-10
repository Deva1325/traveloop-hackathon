const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { asyncHandler } = require('../helpers/asyncHandler');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', asyncHandler(noteController.getUserNotes));
router.get('/trip/:tripId', asyncHandler(noteController.getTripNotes));

router.post('/', asyncHandler(noteController.addNote));
router.put('/:id', asyncHandler(noteController.updateNote));
router.delete('/:id', asyncHandler(noteController.deleteNote));

module.exports = router;
