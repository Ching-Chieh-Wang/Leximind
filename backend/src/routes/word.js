const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth/user'); // Import the authentication middleware
const checkWordOwnership = require('../middleware/checkOwnership/word'); // Import the ownership check middleware
const {
  create,
  update,
  remove,
  getByUserId
} = require('../controllers/word');

// Route for creating a new word with authentication
router.post('/', protect, create);

// Route for updating a specific word by ID with ownership check and validation
router.put('/:id', protect, checkWordOwnership, update);

// Route for deleting a specific word by ID with ownership check
router.delete('/:id', protect, checkWordOwnership, remove);

// Route for getting all words for the authenticated user
router.get('/', protect, getByUserId);

module.exports = router;
