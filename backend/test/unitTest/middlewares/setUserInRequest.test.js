const userRepo = require('../../../src/repositories/user');
const { setUserInRequest } = require('@middlewares/setUserInRequest');

jest.mock('../../../src/repositories/user', () => ({
  getById: jest.fn(),
}));

describe('setUserInRequest middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = { params: { user_id: 'u1' } };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('sets req.user when user exists', async () => {
    userRepo.getById.mockResolvedValue({ id: 'u1', username: 'test' });

    await setUserInRequest(mockReq, mockRes, nextFunction);

    expect(mockReq.user).toEqual({ id: 'u1', username: 'test' });
    expect(nextFunction).toHaveBeenCalled();
  });

  it('returns 404 when user is missing', async () => {
    userRepo.getById.mockResolvedValue(null);

    await setUserInRequest(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
});
