const express = require('express');
const router = express.Router({ mergeParams: true });
const { authorizeUser } = require('../middlewares/auth/user');
const { validateWordInput } = require('../middlewares/validateInput/word');
const { validateLabelId } = require('../middlewares/validateId/label')
const {
  create,
  getByLabelId,
  searchByPrefix,
  update,
  remove,
  changeIsMemorizedStatus,
  getUnmemorized
} = require('../controllers/word');
const { validateCollectionId } = require('../middlewares/validateId/collection');
const { validateWordId } = require('../middlewares/validateId/word')

// Apply middlewares that are common to all routes in this router
router.use(authorizeUser);
router.use(validateCollectionId)


// Route to get all unmemorized words
router.get('/words/unmemorized', getUnmemorized);

// Route to create a new word in a specific collection
router.post('/words', validateWordInput, create);

// Route to get paginated words associated with a label
router.get('/labels/:label_id/words', validateLabelId, getByLabelId);

// Route to search words by prefix in a specific collection
router.get('/words/search', searchByPrefix);

// Route to update a word by ID
router.put('/words/:word_id', validateWordId, validateWordInput, update);

// Route to delete a word by ID
router.delete('/words/:word_id', validateWordId, remove);

// Add a route for changing the memorize status of a word
router.patch('/words/:word_id/memorize', validateWordId, changeIsMemorizedStatus);

module.exports = router;