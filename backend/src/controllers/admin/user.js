const UserModel = require('../../models/user');
const userController = require('../user'); // Reuse functions from user controller
const jwt = require('jsonwebtoken');

// Admin: Get all users with pagination
const getPaginated = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const users = await UserModel.getPaginated(limit, offset);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching paginated users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get a user by ID (userId already checked by middleware)
const getById = async (req, res) => {
  res.status(200).json(req.user);
};

// Admin: Get a user by email
const getByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await UserModel.getByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Promote an existing user to admin
const promoteToAdmin = async (req, res) => {
  const user = req.user; // Set by setUserInRequest middleware

  try {
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'User is already an admin' });
    }

    // Use the existing update function to update the role
    const updatedUser = await UserModel.update(user.id, { role: 'admin' });
    
    res.status(200).json({ message: 'User promoted to admin successfully', user: updatedUser });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete a user by ID
const remove = async (req, res) => {
  return userController.remove(req, res); // Reuse the remove function from user controller
};

// Admin: Update a user by ID
const update = async (req, res) => {
  return userController.update(req, res); // Reuse the update function from user controller
};

module.exports = {
  getPaginated,
  getById,
  getByEmail,
  promoteToAdmin,
  update,
  remove,
};