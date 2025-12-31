const userRepo = require('../repositories/user');

// Middleware to set req.user based on userId in the URL
const setUserInRequest = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const user = await userRepo.getById(user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set req.user to match the userId provided in the URL
    req.user = user;
    next(); // Continue to the next middleware/controller function
  } catch (err) {
    console.error('Error setting user in request:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {setUserInRequest};
