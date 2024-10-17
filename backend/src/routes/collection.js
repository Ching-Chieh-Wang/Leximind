const express = require('express');
const router = express.Router({ mergeParams: true });
const { authorizeUser } = require('../middlewares/auth/user');
const { checkCollectionOwnership } = require('../middlewares/checkOwnership/collection');
const { validateCollectionInput } = require('../middlewares/validateInput/collection');
const { validatePagination } = require('../middlewares/validatePagination');
const {
  create,
  update,
  remove,
  getById,
  getPaginatedByUserId
} = require('../controllers/collection');

// Route for creating a new collection (requires authentication and input validation)
// RESTful URL: POST /api/collections
router.post('/', authorizeUser, validateCollectionInput, create);

// Route for updating a specific collection (requires authentication and ownership check)
// RESTful URL: PUT /api/collections/:collection_id
router.put('/:collection_id', authorizeUser, checkCollectionOwnership, validateCollectionInput, update);

// Route for deleting a specific collection (requires authentication and ownership check)
// RESTful URL: DELETE /api/collections/:collection_id
router.delete('/:collection_id', authorizeUser, checkCollectionOwnership, remove);

// Route for getting a specific collection by its ID (requires authentication and ownership check)
// RESTful URL: GET /api/collections/:collection_id
router.get('/:collection_id', authorizeUser, checkCollectionOwnership, getById);

// Route for getting paginated collections for the authenticated user (requires authentication)
// RESTful URL: GET /api/collections (with pagination query parameters: limit, offset)
router.get('/', authorizeUser, validatePagination, getPaginatedByUserId);

module.exports = router;