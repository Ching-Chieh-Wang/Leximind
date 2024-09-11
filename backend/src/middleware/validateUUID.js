const  uuid = require('uuid');

// Middleware to validate UUID in the URL
const validateUUID = (req, res, next) => {
  const { id } = req.params;
  
  if (!uuid.validate(id)) {
    return res.status(400).json({ message: 'Invalid UUID format' });
  }
  
  next(); // Proceed to the next middleware or route handler
};

module.exports = validateUUID;
