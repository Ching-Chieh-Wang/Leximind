const express = require('express');
const router = express.Router();
const authorizeDeveloper = require('../../middleware/auth/admin');
const { getAll, remove, update, getById } = require('../../controllers/admins/user');
const { validateProfile } = require('../../middleware/validateInput/user');

// Route for fetching all users, restricted to developers
router.get('/', authorizeDeveloper, getAll);

// Route for fetching a user by ID, restricted to developers
router.get('/:id', authorizeDeveloper, getById);  

// Route for deleting a user by ID, restricted to developers
router.delete('/:id', authorizeDeveloper, remove);

// Route for updating a user by ID, restricted to developers
router.put('/:id', authorizeDeveloper, validateProfile, update);

module.exports = router;
