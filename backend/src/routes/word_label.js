const express = require('express');
const router = express.Router({ mergeParams: true });
const { authorizeUser } = require('../middlewares/auth/user');
const { checkLabelOwnership } = require('../middlewares/checkOwnership/label');
const { checkWordOwnership } = require('../middlewares/checkOwnership/word');
const { addWordToLabel, removeWordFromLabel, getWordsByLabel } = require('../controllers/word_label');

// Route for getting all words under a specific label
// RESTful URL: GET /api/labels/:label_id/words
router.get('/labels/:label_id/words', authorizeUser, checkLabelOwnership, getWordsByLabel);

// Route for adding a word to a label
// RESTful URL: POST /api/labels/:label_id/words/:word_id
router.post('/labels/:label_id/words/:word_id', authorizeUser, checkLabelOwnership, checkWordOwnership, addWordToLabel);

// Route for removing a word from a label
// RESTful URL: DELETE /api/labels/:label_id/words/:word_id
router.delete('/labels/:label_id/words/:word_id', authorizeUser, checkLabelOwnership, checkWordOwnership, removeWordFromLabel);

module.exports = router;