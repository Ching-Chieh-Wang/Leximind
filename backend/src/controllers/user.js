const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    email = email.toLowerCase();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await userModel.create(username, email, hashedPassword);

    // If user creation fails, return a 500 error
    if (!newUser) {
      return res.status(500).json({ message: 'Error creating user' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);

    // Respond with the token and user details (which already excludes the password)
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    // Check for the PostgreSQL unique constraint violation error
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already in use. Please use a different email.' });
    }
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
    const userWithPassowrd = await userModel.getUserWithPasswordByEmail(email);
    if (!userWithPassowrd) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, userWithPassowrd.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = userWithPassowrd;

    // Generate a JWT token
    const token = jwt.sign({ id: userWithoutPassword.id, role: userWithoutPassword.role }, process.env.JWT_SECRET);

    // Respond with the token and user details
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  const user = req.user;
  if(!user){
    res.status(500).json({ message: 'Server error.' });
  }
  // Respond with user details
  res.status(200).json({ user: user });
};

// Update user profile
const update = async (req, res) => {
  const { username, email } = req.body;
  const user = req.user;

  try {
    // Check if the username and email are unchanged
    if (username === user.username && email === user.email) {
      return res.status(204).json({ message: 'No changes made to the user profile' });
    }

    // Update the user using the UserModel update function
    const updatedUser = await userModel.update(user.id, username, email);

    // Check if the update was successful
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    // Check for the PostgreSQL unique constraint violation error
    if (err.code == '23505') {
      // Send a conflict error if the email already exists
      return res.status(409).json({ message: 'Email already in use. Please use a different email.' });
    }
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