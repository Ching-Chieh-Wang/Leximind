const userModel = require('@models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { register, login, getProfile, update, remove } = require('@controllers/user');

jest.mock('@models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
      user: {
        id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
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
      const newUser = { id: 1, username: 'testuser', email: 'test@example.com', role: 'user' };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      userModel.create.mockResolvedValue(newUser);
      jwt.sign.mockReturnValue('jwt_token');

      await register(mockReq, mockRes);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userModel.create).toHaveBeenCalledWith('testuser', 'test@example.com', hashedPassword);
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
      mockReq.body = { username: 'newusername', email: 'newemail@example.com' };
      const updatedUser = { id: 'user-id-123', username: 'newusername', email: 'newemail@example.com' };

      userModel.update.mockResolvedValue(updatedUser);

      await update(mockReq, mockRes);

      expect(userModel.update).toHaveBeenCalledWith('user-id-123', 'newusername', 'newemail@example.com');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ user: updatedUser });
    });

    it('should return 409 if email is already in use', async () => {
      const error = { code: '23505' }; // PostgreSQL unique constraint violation
      mockReq.body = { username: 'newuser', email: 'newemail@example.com' }; // Changing username and email
      
      userModel.update.mockRejectedValue(error);

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already in use. Please use a different email.' });
    });

    it('should return 204 if no changes made', async () => {
      // Simulate no changes by using the same username and email as in the user object
      mockReq.body = { username: 'testuser', email: 'test@example.com' }; 

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No changes made to the user profile' });
    });

    it('should return 404 if user not found during update', async () => {
      mockReq.body = { username: 'newuser', email: 'newemail@example.com' }; // Simulate changing username/email
      
      userModel.update.mockResolvedValue(null);

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });


    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      mockReq.body = { username: 'newuser', email: 'newemail@example.com' }; // Simulate changing username/email
      
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
});