const jwt = require('jsonwebtoken');
const userModel = require('../../models/user');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token without an expiration time check
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

      // Fetch the user from the database (excluding the password)
      const user = await userModel.getById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;  // Attach user to request object
      next();  // Proceed to next middleware/route handler
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, token failed:', err });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Function to issue a non-expiring token
exports.issueToken = (user) => {
  // Create a token without expiration time
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  return token;
};
