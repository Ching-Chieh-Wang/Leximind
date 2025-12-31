const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const userRepo = require('../repositories/user');
const c2Service = require('./c2Service');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async ({ username, email, password }) => {
  try {
    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepo.create(username, normalizedEmail, 'credential', 'user', hashedPassword);
    if (!user) {
      return { status: 500, error: { message: 'Error creating user' } };
    }
    if (!user.is_new_user) {
      return { status: 409, error: { message: 'Email already in use. Please use a different email.' } };
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return { status: 201, data: { accessToken, ...user } };
  } catch (err) {
    console.error('Error registering user:', err);
    return { status: 500, error: { message: 'Failed to register, please try again later!' } };
  }
};

const login = async ({ email, password }) => {
  try {
    const normalizedEmail = email.toLowerCase();

    const userWithPassword = await userRepo.getUserWithPasswordByEmail(normalizedEmail);
    if (!userWithPassword) {
      return { status: 404, error: { message: 'Invalid email or password' } };
    }

    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    if (!isMatch) {
      return { status: 400, error: { message: 'Invalid email or password' } };
    }

    const { password: _, ...userWithoutPassword } = userWithPassword;
    const accessToken = jwt.sign(
      { id: userWithoutPassword.id, role: userWithoutPassword.role },
      process.env.JWT_SECRET
    );

    return { status: 200, data: { accessToken, ...userWithoutPassword } };
  } catch (err) {
    console.error('Error logging in user:', err);
    return { status: 500, error: { message: 'Failed to login, please try again later!' } };
  }
};

const googleLoginOrRegister = async ({ token_id }) => {
  try {
    if (!token_id) {
      return { status: 400, error: { message: 'Token ID is required' } };
    }

    const ticket = await client.verifyIdToken({
      idToken: token_id,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.name;
    const image = payload.picture;

    const user = await userRepo.create(username, email, 'google', 'user', '', image);
    if (!user) {
      return { status: 500, error: { message: 'Error creaing or retrieving user' } };
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    return { status: 200, data: { accessToken, ...user } };
  } catch (err) {
    console.error('Error logging in with Google:', err);
    if (err.message.includes('Invalid token')) {
      return { status: 401, error: { message: 'Invalid Google token' } };
    }
    return { status: 500, error: { message: 'Failed to login via google, please try again later!' } };
  }
};

const getProfile = async ({ user_id }) => {
  try {
    let user = await userRepo.getById(user_id);
    user = { ...user, image: c2Service.generateSignedUrl(user.image) };
    if (!user) {
      return { status: 404, error: { message: 'User not found' } };
    }
    return { status: 200, data: { user } };
  } catch (err) {
    console.error('Error geting user profile:', err);
    return { status: 500, error: { message: 'Failed to get user profile, please try again later!' } };
  }
};

const update = async ({ user_id, username, email, image, isNewImage }) => {
  let imageUrl = null;
  if (isNewImage && image) {
    imageUrl = process.env.CDN_URL + (await c2Service.uploadProfileImage(image));
  }

  try {
    const updateSuccess = await userRepo.update(user_id, username, email, imageUrl);
    if (!updateSuccess) {
      return { status: 404, error: { message: 'User not found.' } };
    }

    return { status: 200, data: { image: imageUrl } };
  } catch (err) {
    if (err.code === '23505') {
      return {
        status: 409,
        error: { message: 'Email already in use. Please use a different email.' },
      };
    }
    console.error('Error updating user profile:', err);
    return { status: 500, error: { message: 'Failed to update profile, please try again later!' } };
  }
};

const remove = async ({ user_id }) => {
  try {
    const isDeleteSuccess = await userRepo.remove(user_id);
    if (!isDeleteSuccess) {
      return { status: 404, error: { message: 'User not found' } };
    }

    return { status: 200, data: {} };
  } catch (err) {
    console.error('Error deleting user profile:', err);
    return { status: 500, error: { message: 'Failed to remove account, please try again later!' } };
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
