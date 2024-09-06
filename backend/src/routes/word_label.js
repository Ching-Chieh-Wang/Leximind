const express = require('express');
const { protect } = require('../middleware/auth/user');
const {checkLabelOwnership} = require('../middleware/checkOwnership/label');
const { getWordsByLabel, addWordToLabel, removeWordFromLabel } = require('../controllers/word_label');

const router = express.Router();

// Route for getting all words under a specific label (requires authentication and ownership check)
router.get('/:labelId/words', protect, checkLabelOwnership, getWordsByLabel);

// Route for adding a word to a label (requires authentication and ownership check)
router.post('/:labelId/words/:wordId', protect, checkLabelOwnership, addWordToLabel);

// Route for removing a word from a label (requires authentication and ownership check)
router.delete('/:labelId/words/:wordId', protect, checkLabelOwnership, removeWordFromLabel);

module.exports = router;
