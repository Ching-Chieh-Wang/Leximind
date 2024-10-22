const express = require('express');
const router = express.Router({ mergeParams: true });
const { authorizeUser } = require('../middlewares/auth/user');
const { checkCollectionOwnership } = require('../middlewares/checkOwnership/collection');
const { checkLabelOwnership } = require('../middlewares/checkOwnership/label');
const { checkWordOwnership } = require('../middlewares/checkOwnership/word');
const { validateWordInput } = require('../middlewares/validateInput/word');
const {validatePagination}= require('../middlewares/validatePagination')
const {
  create,
  getById,
  getPaginated,
  update,
  remove,
  searchByPrefix,
} = require('../controllers/word');

// Apply middlewares that are common to all routes in this router
router.use(authorizeUser);
router.use(checkCollectionOwnership);

// Route to create a new word in a specific collection
// This route is now nested under /api/collections/:collection_id/words
router.post('/', validateWordInput, create);

// Route to get words within a specific order_index range in a collection
router.get('/', validatePagination, getPaginated);

// Route to search words by prefix in a specific collection
// RESTful URL: GET /api/collections/:collection_id/words/search?prefix=<prefix>
router.get('/search',searchByPrefix);

// Route to update a word by ID
router.put('/:word_id', checkWordOwnership, validateWordInput, update);

// Route to delete a word by ID
router.delete('/:word_id', checkWordOwnership, remove);

module.exports = router;