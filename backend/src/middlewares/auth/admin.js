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

    // Fetch the user from the database to check their current role
    const user = await userModel.getById(decoded.id);

    // Ensure the user exists and has either 'admin' or 'developer' role
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (user.role !== 'admin' && user.role !== 'developer') {
      return res.status(403).json({ message: 'User not authorized as admin or developer' });
    }

    // Attach the user information to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};


module.exports = {authorizeAdmin};
