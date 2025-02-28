const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const c2Service = require('../services/c2Service');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    email = email.toLowerCase();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await userModel.create(username, email, 'credential', 'user', hashedPassword);
    if (!user) {
      return res.status(500).json({ message: 'Error creating user' });
    }
    if (!user.is_new_user) {
      return res.status(409).json({ message: 'Email already in use. Please use a different email.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    // Respond with the token and user details
    res.status(201).json({ token, user: user });
  } catch (err) {
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
  try {
    const { token_id } = req.body;
    // Validate the presence of token_id
    if (!token_id) {
      return res.status(400).json({ message: 'Token ID is required' });
    }
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token_id,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of your app
    });

    // Extract user details from the token payload
    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.name;  // Full name
    const image = payload.picture;  // Profile picture URL

    const user = await userModel.create(username, email, 'google', 'user', '', image);
    if (!user) {
      return res.status(500).json({ message: 'Error creaing or retrieving user' });
    }
    // Generate a JWT token with user details for session management
    const appToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // Set token expiration for added security
    );


    // Send back the app-specific token and user details
    res.status(200).json({ token: appToken, user });
  } catch (err) {
    console.error('Error logging in with Google:', err);

    // Handle specific Google error codes if needed
    if (err.message.includes('Invalid token')) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};


const getProfile = async (req, res) => {
  try {
    const user_id = req.user_id;
    let user = await userModel.getById(user_id);
    user = { ...user, image: c2Service.generateSignedUrl(user.image) }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error geting user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }

};

const updateImage = async (req, res) => {
  try {
    const user_id = req.user_id;
    const imageUrl=req.body.imageUrl
    console.log(req.body)
    console.log(imageUrl)
    const imageFile = await c2Service.uploadProfileImage(imageUrl);

    await userModel.updateImage(user_id, imageFile);
    
    res.status(200).json({ message: "User image updated successfully", image: imageFile });
  } catch (err) {
    console.error("Error when uploading profile image", err);
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req, res) => {
  const { username, email, image } = req.body;
  const user_id = req.user_id;

  try {
    // Perform the update operation
    const isUpdateSucess = await userModel.update(user_id, username, email, image);
    if (!isUpdateSucess) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: "User update successfully" });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already in use. Please use a different email.' });
    }
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req, res) => {
  const user_id = req.user_id;

  try {
    const isDeleteSuccess = await userModel.remove(user_id);
    if (!isDeleteSuccess) {
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
  updateImage
};