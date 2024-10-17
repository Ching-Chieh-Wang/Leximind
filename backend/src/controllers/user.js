const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    email = email.toLowerCase();

    // Check if the user already exists
    const user = await userModel.getByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await userModel.create(username, email, hashedPassword);

    // Generate a JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = newUser;

    // Respond with the token and user details
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
const login = async (req, res) => {
  let { email, password } = req.body;

  try {
    email = email.toLowerCase();

    // Find the user by email
    const user = await userModel.getByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    // Respond with the token and user details
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    // Respond with user details
    res.status(200).json({ user: userWithoutPassword });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const update = async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.user.id;

  try {
    // Prepare fields to be updated
    const updatedFields = {
      username: username || null,   // If username is provided, use it; otherwise, null
      email: email || null,         // If email is provided, use it; otherwise, null
      password: password ? await bcrypt.hash(password, 10) : null, // Hash password if provided
    };

    // Update the user using the UserModel update function
    const updatedUser = await userModel.update(userId, updatedFields);

    // Exclude the password from the response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.status(200).json({ user: userWithoutPassword });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove user profile
const remove = async (req, res) => {
  const userId = req.user.id;

  try {
    const deletedUser = await userModel.remove(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  update,
  remove,
};