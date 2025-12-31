const { validateUUID } = require('@middlewares/validateUUID');

describe('validateUUID middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = { params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('rejects invalid UUID', () => {
    mockReq.params.user_id = 'not-a-uuid';

    validateUUID(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid user_id UUID format' });
  });

  it('accepts valid UUID', () => {
    mockReq.params.user_id = '550e8400-e29b-41d4-a716-446655440000';

    validateUUID(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });
});
