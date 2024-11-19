const { checkLabelOwnership } = require('@middlewares/checkOwnership/label');
const labelModel = require('@models/label');
const httpMocks = require('node-mocks-http');

jest.mock('@models/label');

describe('checkLabelOwnership Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = httpMocks.createRequest();
    mockRes = httpMocks.createResponse();
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should proceed to the next middleware if label belongs to the user and collection', async () => {
    mockReq.params.label_id = '123';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    const label = {
      id: '123',
      user_id: 'user-123',
      collection_id: 'collection-123',
    };

    labelModel.getById.mockResolvedValue(label);

    await checkLabelOwnership(mockReq, mockRes, mockNext);

    expect(labelModel.getById).toHaveBeenCalledWith('123');
    expect(mockReq.label).toEqual(label);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 400 if label ID is missing', async () => {
    mockReq.params.label_id = undefined;
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    await checkLabelOwnership(mockReq, mockRes, mockNext);

    expect(labelModel.getById).not.toHaveBeenCalled();
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._getJSONData()).toEqual({ message: 'Label ID is required' });
  });

  it('should return 400 if label ID is invalid', async () => {
    mockReq.params.label_id = 'invalid-id';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    await checkLabelOwnership(mockReq, mockRes, mockNext);

    expect(labelModel.getById).not.toHaveBeenCalled();
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._getJSONData()).toEqual({ message: 'Invalid label ID' });
  });

  it('should return 404 if the label does not exist', async () => {
    mockReq.params.label_id = '123';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    labelModel.getById.mockResolvedValue(null);

    await checkLabelOwnership(mockReq, mockRes, mockNext);

    expect(labelModel.getById).toHaveBeenCalledWith('123');
    expect(mockRes.statusCode).toBe(404);
    expect(mockRes._getJSONData()).toEqual({ message: 'Label not found' });
  });

  it('should return 403 if the label does not belong to the user', async () => {
    mockReq.params.label_id = '123';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    const label = {
      id: '123',
      user_id: 'another-user',
      collection_id: 'collection-123',
    };

    labelModel.getById.mockResolvedValue(label);

    await checkLabelOwnership(mockReq, mockRes, mockNext);

    expect(labelModel.getById).toHaveBeenCalledWith('123');
    expect(mockRes.statusCode).toBe(403);
    expect(mockRes._getJSONData()).toEqual({ message: 'You do not have permission to access this label' });
  });

  it('should return 403 if the label does not belong to the collection', async () => {
    mockReq.params.label_id = '123';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    const label = {
      id: '123',
      user_id: 'user-123',
      collection_id: 'another-collection',
    };

    labelModel.getById.mockResolvedValue(label);

    await checkLabelOwnership(mockReq, mockRes, mockNext);

    expect(labelModel.getById).toHaveBeenCalledWith('123');
    expect(mockRes.statusCode).toBe(403);
    expect(mockRes._getJSONData()).toEqual({ message: 'Label does not belong to this collection' });
  });

  it('should return 500 if there is a server error during the process', async () => {
    mockReq.params.label_id = '123';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    const error = new Error('Database error');
    labelModel.getById.mockRejectedValue(error);

    await checkLabelOwnership(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(500);
    expect(mockRes._getJSONData()).toEqual({ message: 'Server error' });
  });
});