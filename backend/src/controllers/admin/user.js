const userModel = require('../../models/user'); 
const userController = require('../user');
const bcrypt = require('bcryptjs');

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
    const user_id = req.params.id;  // Extract user ID from the request parameters
    const user = await userModel.getById(user_id);

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

// Register a new admin by an admin
const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    
    const user = await userModel.getByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin user with 'admin' role
    const newAdmin = await userModel.create(username, email, hashedPassword, 'admin');
    
    res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAll,
  getById,
  getByEmail,
  remove,
  update,
  registerAdmin
};
