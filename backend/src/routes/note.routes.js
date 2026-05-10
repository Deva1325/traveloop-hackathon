const express = require('express');
const router = express.Router({ mergeParams: true });
const noteController = require('../controllers/note.controller');
const { asyncHandler } = require('../helpers/asyncHandler');

router.post('/', asyncHandler(noteController.addNote));
router.get('/', asyncHandler(noteController.getNotes));

module.exports = router;
