const express = require('express');
const router = express.Router();
const authorizeDeveloper = require('../../middleware/auth/admin');
const { getAll, remove, update, getById, registerAdmin} = require('../../controllers/admin/user');
const { validateProfile } = require('../../middleware/validateInput/user');
const validateUUID = require('../../middleware/validateUUID');

// Route for fetching all users, restricted to developers
router.get('/', authorizeDeveloper, getAll);

// Route for fetching a user by ID, restricted to developers
router.get('/:id', authorizeDeveloper, validateUUID, getById);  

// Route for deleting a user by ID, restricted to developers
router.delete('/:id', authorizeDeveloper,validateUUID, remove);

// Route for updating a user by ID, restricted to developers
router.put('/:id', authorizeDeveloper, validateUUID, validateProfile, update);

// Route for registering a new admin, restricted to admins
router.post('/register-admin', authorizeDeveloper, validateProfile, registerAdmin);

module.exports = router;
