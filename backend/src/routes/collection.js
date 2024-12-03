const express = require('express');
const router = express.Router({ mergeParams: true });
const { authorizeUser } = require('../middlewares/auth/user');
const { validateCollectionInput } = require('../middlewares/validateInput/collection');
const { validatePagination } = require('../middlewares/validatePagination');
const {validateCollectionId} =require('../middlewares/validateId/collection')
const {
  create,
  update,
  updateAuthorize,
  remove,
  getAllByUserIdSortedByLastViewedAt,
  searchPublicCollections,
} = require('../controllers/collection');

// Route for creating a new collection (requires authentication and input validation)
router.post('/', authorizeUser, validateCollectionInput, create);

// Route for updating a specific collection (requires authentication and ownership check)
router.put('/:collection_id', authorizeUser, validateCollectionId , validateCollectionInput, update);

// Route for updating a specific collection (requires authentication and ownership check)
router.put('/:collection_id/authorize', authorizeUser, validateCollectionId , updateAuthorize);

// Route for deleting a specific collection (requires authentication and ownership check)
router.delete('/:collection_id', authorizeUser, validateCollectionId, remove);

// Route for getting all collections of a user
router.get('/', authorizeUser, getAllByUserIdSortedByLastViewedAt);

// Route for searching public collections with pagination (does not require authentication)
router.get('/search', validatePagination, searchPublicCollections);

module.exports = router;