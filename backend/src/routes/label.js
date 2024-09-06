const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth/user');
const {
  create,
  update,
  remove,
  getAllFromUser,
} = require('../controllers/label');
const {validateLabelInput} = require('../middleware/validateInput/label');
const {checkLabelOwnership} = require('../middleware/checkOwnership/label');

// Route for creating a new label with validation (requires authentication)
router.post('/', protect, validateLabelInput, create);

// Route for updating a specific label by ID with validation (requires authentication and ownership check)
router.put('/:id', protect, checkLabelOwnership, validateLabelInput, update);

// Route for deleting a specific label by ID (requires authentication and ownership check)
router.delete('/:id', protect, checkLabelOwnership, remove);

// Route for getting all labels for the authenticated user (requires authentication)
router.get('/', protect, getAllFromUser);

module.exports = router;
