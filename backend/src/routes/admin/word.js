const express = require('express');
const router = express.Router();
const {authorizeAdmin} = require('../../middlewares/auth/admin');
const { create, getById, update, remove, getPaginated, getAllByUserId } = require('../../controllers/admin/word');
const {validateUUID} = require('../../middlewares/validateUUID');
const {validatePagination} = require('../../middlewares/validatePagination');
const {setUserInRequest} = require('../../middlewares/setUserInRequest'); // Middleware to set user by userId
const { checkValidWordId } = require('../../middlewares/checkValidId/word'); // Import the word ID check middleware

// Route for creating a new word for a specific user (admin only)
router.post('/users/:user_id', authorizeAdmin, validateUUID, setUserInRequest, create);

// Route for fetching all words by a specific user (admin only)
router.get('/users/:user_id', authorizeAdmin, validateUUID, setUserInRequest, getAllByUserId);

// Route for fetching a word by ID (admin only)
router.get('/:id', authorizeAdmin, checkValidWordId, getById); // Added checkValidWordId

// Route for updating a word by ID (admin only)
router.put('/:id', authorizeAdmin, checkValidWordId, update); // Added checkValidWordId

// Route for deleting a word by ID (admin only)
router.delete('/:id', authorizeAdmin, checkValidWordId, remove); // Added checkValidWordId

// Route for fetching all words with pagination (admin only)
router.get('/', validatePagination, authorizeAdmin, getPaginated);

module.exports = router;