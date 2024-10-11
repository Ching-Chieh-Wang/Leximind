const express = require('express');
const router = express.Router();
const {authorizeAdmin} = require('../../middlewares/auth/admin');
const { addWordToLabel, removeWordFromLabel, getWordsByLabelId } = require('../../controllers/admin/word_label');
const {checkValidLabelId} = require('../../middlewares/checkValidId/label'); // Import the label ID check middleware
const {checkValidWordId} = require('../../middlewares/checkValidId/word'); // Import the word ID check middleware

// Route for adding a word to a label (admin only)
router.post('/label/:label_id/word/:word_id', authorizeAdmin, checkValidLabelId, checkValidWordId, addWordToLabel);

// Route for removing a word from a label (admin only)
router.delete('/label/:label_id/word/:word_id', authorizeAdmin, checkValidLabelId, checkValidWordId, removeWordFromLabel);

// Route for fetching all words associated with a specific label (admin only)
router.get('/label/:label_id/words', authorizeAdmin, checkValidLabelId, getWordsByLabelId);

module.exports = router;