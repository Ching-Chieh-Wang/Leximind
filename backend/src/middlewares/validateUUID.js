const  uuid = require('uuid');

// Middleware to validate UUID in the URL
const validateUUID = (req, res, next) => {
  const { user_id } = req.params;
  
  if (!uuid.validate(user_id)) {
    return res.status(400).json({ message: 'Invalid user_id UUID format' });
  }
  
  next(); // Proceed to the next middleware or route handler
};

module.exports = {validateUUID};
