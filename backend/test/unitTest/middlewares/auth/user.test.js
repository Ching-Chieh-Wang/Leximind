const jwt = require('jsonwebtoken');
const userModel = require('@models/user');
const { authorizeUser } = require('@middlewares/auth/user');

// Mocking dependencies
jest.mock('jsonwebtoken');
jest.mock('@models/user');

describe('authorizeUser Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: 'Bearer token123'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should authorize user successfully with a valid token', async () => {
    const mockDecoded = { id: 'user-123' };
    const mockUser = { id: 'user-123', username: 'testuser', email: 'test@example.com' };

    // Mock jwt.verify to return a decoded token
    jwt.verify.mockReturnValue(mockDecoded);

    // Mock userModel.getById to return a user
    userModel.getById.mockResolvedValue(mockUser);

    await authorizeUser(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith('token123', process.env.JWT_SECRET, { ignoreExpiration: true });
    expect(userModel.getById).toHaveBeenCalledWith('user-123');
    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toEqual({
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com'
    });
  });

  it('should return 401 if the token is invalid', async () => {
    // Mock jwt.verify to throw an error
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authorizeUser(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith('token123', process.env.JWT_SECRET, { ignoreExpiration: true });
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized: Token verification failed' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    // Remove the Authorization header
    mockReq.headers.authorization = null;

    await authorizeUser(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if the user is not found', async () => {
    const mockDecoded = { id: 'user-123' };

    // Mock jwt.verify to return a decoded token
    jwt.verify.mockReturnValue(mockDecoded);

    // Mock userModel.getById to return null (user not found)
    userModel.getById.mockResolvedValue(null);

    await authorizeUser(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith('token123', process.env.JWT_SECRET, { ignoreExpiration: true });
    expect(userModel.getById).toHaveBeenCalledWith('user-123');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found, invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});