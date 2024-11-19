const { checkCollectionOwnership } = require('@middlewares/checkOwnership/collection');
const collectionModel = require('@models/collection');
const httpMocks = require('node-mocks-http');

jest.mock('@models/collection');

describe('checkCollectionOwnership Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = httpMocks.createRequest();
    mockRes = httpMocks.createResponse();
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should proceed to the next middleware if collection belongs to the user', async () => {
    mockReq.params.collection_id = '123';
    mockReq.user = { id: 'user-123' };

    const collection = {
      id: '123',
      user_id: 'user-123',
    };

    collectionModel.getById.mockResolvedValue(collection);

    await checkCollectionOwnership(mockReq, mockRes, mockNext);

    expect(collectionModel.getById).toHaveBeenCalledWith('123');
    expect(mockReq.collection).toEqual(collection);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 400 if collection ID is missing', async () => {
    mockReq.params.collection_id = undefined; // No collection ID
    mockReq.user = { id: 'user-123' };

    await checkCollectionOwnership(mockReq, mockRes, mockNext);

    expect(collectionModel.getById).not.toHaveBeenCalled();
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._getJSONData()).toEqual({ message: 'Collection ID is required' });
  });

  it('should return 400 if collection ID is invalid (non-numeric)', async () => {
    mockReq.params.collection_id = 'invalid-id';
    mockReq.user = { id: 'user-123' };

    await checkCollectionOwnership(mockReq, mockRes, mockNext);

    expect(collectionModel.getById).not.toHaveBeenCalled();
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._getJSONData()).toEqual({ message: 'Invalid collection ID' });
  });

  it('should return 400 if collection ID is a float or not a valid integer', async () => {
    mockReq.params.collection_id = '123.45'; // Float value
    mockReq.user = { id: 'user-123' };

    await checkCollectionOwnership(mockReq, mockRes, mockNext);

    expect(collectionModel.getById).not.toHaveBeenCalled();
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._getJSONData()).toEqual({ message: 'Invalid collection ID' });
  });

  it('should return 404 if the collection does not exist', async () => {
    mockReq.params.collection_id = '123';
    mockReq.user = { id: 'user-123' };

    collectionModel.getById.mockResolvedValue(null);

    await checkCollectionOwnership(mockReq, mockRes, mockNext);

    expect(collectionModel.getById).toHaveBeenCalledWith('123');
    expect(mockRes.statusCode).toBe(404);
    expect(mockRes._getJSONData()).toEqual({ message: 'Collection not found' });
  });

  it('should return 403 if the collection does not belong to the user', async () => {
    mockReq.params.collection_id = '123';
    mockReq.user = { id: 'user-123' };

    const collection = {
      id: '123',
      user_id: 'another-user', // Different user ID
    };

    collectionModel.getById.mockResolvedValue(collection);

    await checkCollectionOwnership(mockReq, mockRes, mockNext);

    expect(collectionModel.getById).toHaveBeenCalledWith('123');
    expect(mockRes.statusCode).toBe(403);
    expect(mockRes._getJSONData()).toEqual({ message: 'You do not have permission to perform this action' });
  });

  it('should return 500 if there is a server error during the process', async () => {
    mockReq.params.collection_id = '123';
    mockReq.user = { id: 'user-123' };

    const error = new Error('Database error');
    collectionModel.getById.mockRejectedValue(error);

    await checkCollectionOwnership(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(500);
    expect(mockRes._getJSONData()).toEqual({ message: 'Server error' });
  });
});