const express = require('express');
const router = express.Router();
const {authorizeUser} = require('../middlewares/auth/user');
const {
  create,
  update,
  remove,
  getAllByUserId,
} = require('../controllers/label');
const {validateLabelInput} = require('../middlewares/validateInput/label');
const {checkLabelOwnership} = require('../middlewares/checkOwnership/label');

// Route for creating a new label with validation (requires authentication)
router.post('/', authorizeUser, validateLabelInput, create);

// Route for updating a specific label by ID with validation (requires authentication and ownership check)
router.put('/:id', authorizeUser, checkLabelOwnership, validateLabelInput, update);

// Route for deleting a specific label by ID (requires authentication and ownership check)
router.delete('/:id', authorizeUser, checkLabelOwnership, remove);

// Route for getting all labels for the authenticated user (requires authentication)
router.get('/', authorizeUser, getAllByUserId);

module.exports = router;
