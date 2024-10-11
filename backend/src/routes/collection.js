const express = require('express');
const router = express.Router();
const { authorizedUser } = require('../middlewares/auth/user'); // Import the authentication middleware
const { checkCollectionOwnership } = require('../middlewares/checkOwnership/collection'); // Import the ownership check middleware
const { validateCollectionInput } = require('../middlewares/validateInput/collection'); // Import the validation middleware
const {
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionById,
  getAllCollectionsByUserId
} = require('../controllers/collection');

// Route for creating a new collection (requires authentication and input validation)
router.post('/', authorizedUser, validateCollectionInput, createCollection);

// Route for updating a specific collection (requires authentication, ownership check, and input validation)
router.put('/:collection_id', authorizedUser, checkCollectionOwnership, validateCollectionInput, updateCollection);

// Route for deleting a specific collection (requires authentication and ownership check)
router.delete('/:collection_id', authorizedUser, checkCollectionOwnership, deleteCollection);

// Route for getting a specific collection by its ID (requires authentication and ownership check)
router.get('/:collection_id', authorizedUser, checkCollectionOwnership, getCollectionById);

// Route for getting all collections for the authenticated user
router.get('/', authorizedUser, getAllCollectionsByUserId);

module.exports = router;