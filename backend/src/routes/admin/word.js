const express = require('express');
const router = express.Router();
const authorizeDeveloper = require('../../middleware/auth/admin');
const {createWord,getWordById,updateWord, deleteWord,getAllWords} = require('../../controllers/admin/word');

// Route for creating a new word (admin only)
router.post('/', authorizeDeveloper, createWord);

// Route for fetching a word by ID (admin only)
router.get('/:id', authorizeDeveloper, getWordById);

// Route for updating a word by ID (admin only)
router.put('/:id', authorizeDeveloper, updateWord);

// Route for deleting a word by ID (admin only)
router.delete('/:id', authorizeDeveloper, deleteWord);

// Route for fetching all words with pagination (admin only)
router.get('/', authorizeDeveloper, getAllWords);

module.exports = router;