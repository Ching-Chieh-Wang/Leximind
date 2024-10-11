const express = require('express');
const router = express.Router();
const { authorizeUser } = require('../middlewares/auth/user'); // Import the authentication middleware
const {checkWordOwnership} = require('../middlewares/checkOwnership/word'); // Import the ownership check middleware
const {
  create,
  update,
  remove,
  getAllByUserId,
  searchByPrefix
} = require('../controllers/word');

// Route for creating a new word with authentication
router.post('/', authorizeUser, create);

// Route for updating a specific word by ID with ownership check and validation
router.put('/:id', authorizeUser,  checkWordOwnership, update);

// Route for deleting a specific word by ID with ownership check
router.delete('/:id', authorizeUser,  checkWordOwnership, remove);

// Route for getting all words for the authenticated user
router.get('/', authorizeUser, getAllByUserId);

router.get('/search', authorizeUser, searchByPrefix);

module.exports = router;