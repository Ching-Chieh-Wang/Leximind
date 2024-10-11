const express = require('express');
const router = express.Router();
const { authorizedUser } = require('../middlewares/auth/user'); // Authentication middleware
const { checkWordOwnership } = require('../middlewares/checkOwnership/word'); // Ownership check middleware
const { validateWordInput } = require('../middlewares/validateInput/word'); // Validation middleware
const {
  updateWord, // Controller to update a word
  searchWords, // Controller to search for words
} = require('../controllers/word');

// Route for updating a word by ID (requires authentication and ownership check)
router.put('/:id', authorizedUser, checkWordOwnership, validateWordInput, updateWord);

// Route for searching words (can search in both title and description)
router.get('/search', authorizedUser, searchWords);

module.exports = router;