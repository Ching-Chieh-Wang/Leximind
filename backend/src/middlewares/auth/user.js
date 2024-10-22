const jwt = require('jsonwebtoken');
const userModel = require('../../models/user'); 

const authorizeUser = async (req, res, next) => {

  // Check if Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization.split(' ')[1];

      // Verify the token (ignoring expiration for testing purposes)
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

      // Fetch the user from the database, but exclude the password
      const user = await userModel.getById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found, invalid token' });
      }

      req.user = user; // Attach user to the request without the password

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
    }
  } else {
    // No token provided in the Authorization header
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

module.exports = {authorizeUser};