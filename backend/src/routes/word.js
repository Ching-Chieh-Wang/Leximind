const express = require('express');
const router = express.Router({ mergeParams: true });
const { authorizeUser } = require('../middlewares/auth/user');
const { validateWordInput } = require('../middlewares/validateInput/word');
const { validatePagination } = require('../middlewares/validatePagination');
const {
  create,
  getPaginated,
  getPaginatedByLabelId,
  getPaginatedBySearchingPrefix,
  update,
  remove,
  changeIsMemorizedStatus
} = require('../controllers/word');
const { validateCollectionId } = require('../middlewares/validateId/collection');
const {validateWordId} =require('../middlewares/validateId/word')

// Apply middlewares that are common to all routes in this router
router.use(authorizeUser);
router.use(validateCollectionId)

// Route to create a new word in a specific collection
router.post('/words', validateWordInput, create);

// Route to get paginated words within a specific collection
router.get('/words', validatePagination, getPaginated);

// Route to get paginated words associated with a label
router.get('/labels/:label_id/words', validatePagination, getPaginatedByLabelId);

// Route to search words by prefix in a specific collection
router.get('/words/search', validatePagination, getPaginatedBySearchingPrefix);

// Route to update a word by ID
router.put('/words/:word_id', validateWordId, validateWordInput, update);

// Route to delete a word by ID
router.delete('/words/:word_id', remove);

// Add a route for changing the memorize status of a word
router.patch('/words/:word_id/memorize', changeIsMemorizedStatus);

module.exports = router;