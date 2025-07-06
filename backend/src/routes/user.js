const express = require('express');
const router = express.Router({ mergeParams: true });
const { authorizeUser } = require('../middlewares/auth/user');
const { register, login, googleLoginOrRegister, getProfile, update, remove } = require('../controllers/user');
const { validateRegister, validateProfile } = require('../middlewares/validateInput/user');
const path = require('path');

// Route for user registration
// RESTful URL: POST /api/users/register
router.post('/register', validateRegister, register);

// Route for user login
// RESTful URL: POST /api/users/login
router.post('/login', login);

// Route for Google login or registration
// RESTful URL: POST /api/users/google
router.post('/google', googleLoginOrRegister);

// Route for fetching the user's profile (requires authentication)
// RESTful URL: GET /api/users (returns the authenticated user's profile)
router.get('/', authorizeUser, getProfile);

// Route for updating the user's profile (requires authentication)
// RESTful URL: PUT /api/users (updates the authenticated user's profile)
router.put('/', authorizeUser, validateProfile, update);

// Route for deleting the user's account (requires authentication)
// RESTful URL: DELETE /api/users (deletes the authenticated user's account)
router.delete('/', authorizeUser, remove);

module.exports = router;