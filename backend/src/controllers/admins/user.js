const userModel = require('../../models/user'); 
const userController = require('../user');

// Fetch all users (admin-specific)
const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;  // Use query params for pagination
    const offset = (page - 1) * limit;

    // Fetch paginated users
    const users = await userModel.getPaginatedUsers(limit, offset);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getById = async (req, res) => {
  try {
    const userId = req.params.id;  // Extract user ID from the request parameters
    const user = await userModel.getById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getByEmail = async (req, res) => {
  req.user.id=req.params.id
  return userController.getByEmail(req, res);
};

const remove = async (req, res) => {
  req.user.id=req.params.id
  return userController.remove(req, res);
};

const update = async (req, res) => {
  req.user.id=req.params.id
  return userController.update(req, res);
};

module.exports = {
  getAll,
  getById,
  getByEmail,
  remove,
  update
};
