const express = require('express');
const router = express.Router({ mergeParams: true });
const { authorizeUser } = require('../middlewares/auth/user');
const { addWordToLabel, removeWordFromLabel } = require('../controllers/word_label');
const { validateCollectionId } = require('../middlewares/validateId/collection');
const { validateLabelId } = require('../middlewares/validateId/label');
const { validateWordId } = require('../middlewares/validateId/word');


router.use(authorizeUser)
router.use(validateCollectionId)

// Route for adding a word to a label
// RESTful URL: POST /api/labels/:label_id/words/:word_id
router.post('/labels/:label_id/words/:word_id',validateLabelId,validateWordId, addWordToLabel);

// Route for removing a word from a label
// RESTful URL: DELETE /api/labels/:label_id/words/:word_id
router.delete('/labels/:label_id/words/:word_id',validateLabelId,validateWordId, removeWordFromLabel);

module.exports = router;