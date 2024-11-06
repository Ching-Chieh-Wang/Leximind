jest.mock('google-auth-library', () => {
  const clientMock = {
    verifyIdToken: jest.fn(),
  };
  return {
    OAuth2Client: jest.fn(() => clientMock),
  };
});

const userModel = require('@models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  register,
  login,
  getProfile,
  update,
  remove,
  googleLoginOrRegister,
} = require('@controllers/user');
const { OAuth2Client } = require('google-auth-library');

const clientMock = new OAuth2Client();

jest.mock('@models/user');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');


describe('User Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        image: 'default-image.url.com', // Adding image field to mock request body
      },
      user: {
        id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        image: 'default-image.url.com', // Adding image field to mock user data
      }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashed_password';
      const newUser = { id: 1, username: 'testuser', email: 'test@example.com', role: 'user', image: 'image.url.com' };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      userModel.create.mockResolvedValue(newUser);
      jwt.sign.mockReturnValue('jwt_token');

      await register(mockReq, mockRes);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userModel.create).toHaveBeenCalledWith(
        'testuser',
        'test@example.com',
        'credential',
        'user',
        hashedPassword
      );
      expect(jwt.sign).toHaveBeenCalledWith({ id: newUser.id }, process.env.JWT_SECRET);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        token: 'jwt_token',
        user: newUser,
      });
    });

    it('should return 409 if email is already in use', async () => {
      const error = { code: '23505' }; // PostgreSQL unique constraint violation

      bcrypt.hash.mockResolvedValue('hashed_password');
      userModel.create.mockRejectedValue(error);

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already in use. Please use a different email.' });
    });


    it('should return 500 if user creation fails', async () => {

      bcrypt.hash.mockResolvedValue('hashed_password');
      userModel.create.mockResolvedValue(null);

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error creating user' });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      userModel.create.mockRejectedValue(error);

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const userWithPassword = {
        id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'user',
      };

      bcrypt.compare.mockResolvedValue(true);
      userModel.getUserWithPasswordByEmail.mockResolvedValue(userWithPassword);
      jwt.sign.mockReturnValue('jwt_token');

      await login(mockReq, mockRes);

      expect(userModel.getUserWithPasswordByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'user-id-123', role: 'user' }, process.env.JWT_SECRET);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        token: 'jwt_token',
        user: {
          id: 'user-id-123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
        },
      });
    });

    it('should return 404 if user not found', async () => {
      userModel.getUserWithPasswordByEmail.mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    it('should return 400 if password does not match', async () => {
      const userWithPassword = {
        id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'user',
      };

      bcrypt.compare.mockResolvedValue(false);
      userModel.getUserWithPasswordByEmail.mockResolvedValue(userWithPassword);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      userModel.getUserWithPasswordByEmail.mockRejectedValue(error);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('getProfile', () => {
    it('should return the user profile successfully', async () => {
      await getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        user: {
          id: 'user-id-123',
          username: 'testuser',
          email: 'test@example.com',
          image: 'default-image.url.com'
        },
      });
    });

    it('should return 500 on server error', async () => {
      mockReq.user = null;
      await getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error.' });
    });
  });

  describe('update', () => {
    it('should update the user profile successfully', async () => {
      mockReq.body = {
        username: 'newusername',
        email: 'newemail@example.com',
        image: 'new-image.url.com'  // Including image in the request body
      };

      const updatedUser = {
        id: 'user-id-123',
        username: 'newusername',
        email: 'newemail@example.com',
        image: 'new-image.url.com'  // Ensuring the updated user object has the new image
      };

      userModel.update.mockResolvedValue(updatedUser);

      await update(mockReq, mockRes);

      // Updated function call to include image parameter
      expect(userModel.update).toHaveBeenCalledWith(
        'user-id-123',
        'newusername',
        'newemail@example.com',
        'new-image.url.com'
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ user: updatedUser });
    });

    it('should return 204 if no changes made', async () => {
      // Simulate no changes by using the same username, email, and image as in the user object
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        image: 'default-image.url.com'
      };

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No changes made to the user profile' });
    });

    it('should return 409 if email is already in use', async () => {
      const error = { code: '23505' }; // PostgreSQL unique constraint violation
      mockReq.body = {
        username: 'newuser',
        email: 'newemail@example.com',
        image: 'new-image.url.com'
      };

      userModel.update.mockRejectedValue(error);

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already in use. Please use a different email.' });
    });

    it('should return 404 if user not found during update', async () => {
      mockReq.body = {
        username: 'newuser',
        email: 'newemail@example.com',
        image: 'new-image.url.com'
      };

      userModel.update.mockResolvedValue(null);

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      mockReq.body = {
        username: 'newuser',
        email: 'newemail@example.com',
        image: 'new-image.url.com'
      };

      userModel.update.mockRejectedValue(error);

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('remove', () => {
    it('should delete user profile successfully', async () => {
      userModel.remove.mockResolvedValue(true);

      await remove(mockReq, mockRes);

      expect(userModel.remove).toHaveBeenCalledWith('user-id-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 404 if user not found', async () => {
      userModel.remove.mockResolvedValue(null);

      await remove(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      userModel.remove.mockRejectedValue(error);

      await remove(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });


  describe('googleLoginOrRegister', () => {
    let mockReq, mockRes;
  
    beforeEach(() => {
      mockReq = {
        body: { token_id: 'valid_google_token' },
      };
  
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      jest.clearAllMocks();
    });
  
    it('should return 400 if token_id is missing', async () => {
      mockReq.body = {}; // No token_id provided
  
      await googleLoginOrRegister(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token ID is required' });
    });
  
    it('should log in an existing user successfully', async () => {
      const user = {
        id: 'user-id-123',
        username: 'ExistingUser',
        email: 'existing@example.com',
        role: 'user',
        image: 'existing-image-url',
      };
      const payload = {
        email: 'existing@example.com',
        name: 'ExistingUser',
        picture: 'existing-image-url',
      };
  
      clientMock.verifyIdToken.mockResolvedValue({
        getPayload: () => payload,
      });
      userModel.getByEmail.mockResolvedValue(user);
      jwt.sign.mockReturnValue('app_jwt_token');
  
      await googleLoginOrRegister(mockReq, mockRes);
  
      expect(clientMock.verifyIdToken).toHaveBeenCalledWith({
        idToken: 'valid_google_token',
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      expect(userModel.getByEmail).toHaveBeenCalledWith('existing@example.com');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        token: 'app_jwt_token',
        user,
      });
    });
  
    it('should register a new user if not already registered', async () => {
      const payload = { email: 'new@example.com', name: 'NewUser', picture: 'new-image-url' };
      const newUser = { id: 'new-user-id', username: 'NewUser', email: 'new@example.com', role: 'user', image: 'new-image-url' };
  
      clientMock.verifyIdToken.mockResolvedValue({ getPayload: () => payload });
      userModel.getByEmail.mockResolvedValue(null);
      userModel.create.mockResolvedValue(newUser);
      jwt.sign.mockReturnValue('app_jwt_token');
  
      await googleLoginOrRegister(mockReq, mockRes);
  
      expect(clientMock.verifyIdToken).toHaveBeenCalledWith({
        idToken: 'valid_google_token',
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      expect(userModel.getByEmail).toHaveBeenCalledWith('new@example.com');
      expect(userModel.create).toHaveBeenCalledWith('NewUser', 'new@example.com', 'google', 'user', '', 'new-image-url');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ token: 'app_jwt_token', user: newUser });
    });
  
    it('should return 500 if there is an error with Google verification', async () => {
      clientMock.verifyIdToken.mockRejectedValue(new Error('Google verification error'));
  
      await googleLoginOrRegister(mockReq, mockRes);
  
      expect(clientMock.verifyIdToken).toHaveBeenCalledWith({
        idToken: 'valid_google_token',
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  
    it('should return 500 if there is an error in user creation', async () => {
      const payload = { email: 'new@example.com', name: 'NewUser', picture: 'new-image-url' };
  
      clientMock.verifyIdToken.mockResolvedValue({ getPayload: () => payload });
      userModel.getByEmail.mockResolvedValue(null);
      userModel.create.mockRejectedValue(new Error('Database error'));
  
      await googleLoginOrRegister(mockReq, mockRes);
  
      expect(clientMock.verifyIdToken).toHaveBeenCalledWith({
        idToken: 'valid_google_token',
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      expect(userModel.getByEmail).toHaveBeenCalledWith('new@example.com');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});