const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    email = email.toLowerCase();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await userModel.create(username, email, 'credential', 'user', hashedPassword);

    if (!newUser) {
      return res.status(500).json({ message: 'Error creating user' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);

    // Respond with the token and user details
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already in use. Please use a different email.' });
    }
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;

  try {
    email = email.toLowerCase();

    const userWithPassword = await userModel.getUserWithPasswordByEmail(email);
    if (!userWithPassword) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const { password: _, ...userWithoutPassword } = userWithPassword;
    const token = jwt.sign({ id: userWithoutPassword.id, role: userWithoutPassword.role }, process.env.JWT_SECRET);

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const googleLoginOrRegister = async (req, res) => {
  const { token_id } = req.body;
  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token_id,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of your app
    });

    // Extract the user details from the token payload
    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.name;  // Full name
    const image = payload.picture;  // Profile picture URL

    // Check if the user already exists in the database
    let user = await userModel.getByEmail(email);

    // If the user doesn't exist, create a new one
    if (!user) {
      user = await userModel.create(username, email, 'google', 'user', '', image);
    }

    // Generate an application-specific JWT token for session management
    const appToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    // Send back the app-specific token and user details
    res.status(200).json({ token: appToken, user });
  } catch (err) {
    console.error('Error logging in with Google:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const getProfile = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(500).json({ message: 'Server error.' });
  }
  res.status(200).json({ user });
};

const update = async (req, res) => {
  const { username, email, image } = req.body;
  const user = req.user;

  try {
    if (username === user.username && email === user.email && image === user.image) {
      return res.status(204).json({ message: 'No changes made to the user profile' });
    }

    const updatedUser = await userModel.update(user.id, username, email, image);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already in use. Please use a different email.' });
    }
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

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
  googleLoginOrRegister,
  getProfile,
  update,
  remove,
};