const jwt = require('jsonwebtoken');
const { authorizeUser, optionalAuthorizeUser } = require('@middlewares/auth/user');

jest.mock('jsonwebtoken');

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
    jwt.verify.mockReturnValue(mockDecoded);

    await authorizeUser(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith('token123', process.env.JWT_SECRET, { ignoreExpiration: true });
    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user_id).toBe('user-123');
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

  it('should allow optional authorization without token', async () => {
    mockReq.headers.authorization = null;

    await optionalAuthorizeUser(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
