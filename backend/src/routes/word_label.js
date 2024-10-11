const express = require('express');
const { authorizeUser } = require('../middlewares/auth/user');
const { checkLabelOwnership } = require('../middlewares/checkOwnership/label');
const { getWordsByLabel, addWordToLabel, removeWordFromLabel } = require('../controllers/word_label');
const {checkWordOwnership} = require('../middlewares/checkOwnership/word');

const router = express.Router();

// Route for getting all words under a specific label 
router.get('/label/:label_id/words', authorizeUser, checkLabelOwnership, getWordsByLabel);

// Route for adding a word to a label 
router.post('/label/:label_id/word/:word_id', authorizeUser, checkLabelOwnership, checkWordOwnership, addWordToLabel);

// Route for removing a word from a label 
router.delete('/label/:label_id/word/:word_id', authorizeUser, checkLabelOwnership,checkWordOwnership, removeWordFromLabel);

module.exports = router;