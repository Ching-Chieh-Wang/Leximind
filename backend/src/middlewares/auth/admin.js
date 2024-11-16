const jwt = require('jsonwebtoken');
const userModel =require('../../models/user')

const authorizeAdmin = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'Forbidden: No token provided' });
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin' && decoded.role !== 'developer') {
      return res.status(403).json({ message: 'User not authorized as admin or developer' });
    }

    // Attach the user information to the request object
    req.user_id = decoded.id;
    req.user_rolt= decoded.role;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};


module.exports = {authorizeAdmin};
