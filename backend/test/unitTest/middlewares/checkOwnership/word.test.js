const { checkWordOwnership } = require('@middlewares/checkOwnership/word');
const wordModel = require('@models/word');
const httpMocks = require('node-mocks-http');

jest.mock('@models/word');

describe('checkWordOwnership Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = httpMocks.createRequest();
    mockRes = httpMocks.createResponse();
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should proceed to the next middleware if word belongs to the user and collection', async () => {
    mockReq.params.word_id = '123';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    const word = {
      id: '123',
      user_id: 'user-123',
      collection_id: 'collection-123',
    };

    wordModel.getById.mockResolvedValue(word);

    await checkWordOwnership(mockReq, mockRes, mockNext);

    expect(wordModel.getById).toHaveBeenCalledWith('123');
    expect(mockReq.word).toEqual(word);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 400 if word ID is missing', async () => {
    mockReq.params.word_id = undefined;
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    await checkWordOwnership(mockReq, mockRes, mockNext);

    expect(wordModel.getById).not.toHaveBeenCalled();
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._getJSONData()).toEqual({ message: 'Word ID is required' });
  });

  it('should return 400 if word ID is invalid', async () => {
    mockReq.params.word_id = 'invalid-id';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    await checkWordOwnership(mockReq, mockRes, mockNext);

    expect(wordModel.getById).not.toHaveBeenCalled();
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._getJSONData()).toEqual({ message: 'Invalid word ID' });
  });

  it('should return 404 if the word does not exist', async () => {
    mockReq.params.word_id = '123';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    wordModel.getById.mockResolvedValue(null);

    await checkWordOwnership(mockReq, mockRes, mockNext);

    expect(wordModel.getById).toHaveBeenCalledWith('123');
    expect(mockRes.statusCode).toBe(404);
    expect(mockRes._getJSONData()).toEqual({ message: 'Word not found' });
  });

  it('should return 403 if the word does not belong to the user', async () => {
    mockReq.params.word_id = '123';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    const word = {
      id: '123',
      user_id: 'another-user',
      collection_id: 'collection-123',
    };

    wordModel.getById.mockResolvedValue(word);

    await checkWordOwnership(mockReq, mockRes, mockNext);

    expect(wordModel.getById).toHaveBeenCalledWith('123');
    expect(mockRes.statusCode).toBe(403);
    expect(mockRes._getJSONData()).toEqual({ message: 'You do not have permission to access this word.' });
  });

  it('should return 403 if the word does not belong to the collection', async () => {
    mockReq.params.word_id = '123';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    const word = {
      id: '123',
      user_id: 'user-123',
      collection_id: 'another-collection',
    };

    wordModel.getById.mockResolvedValue(word);

    await checkWordOwnership(mockReq, mockRes, mockNext);

    expect(wordModel.getById).toHaveBeenCalledWith('123');
    expect(mockRes.statusCode).toBe(403);
    expect(mockRes._getJSONData()).toEqual({ message: 'Word does not belong to this collection.' });
  });

  it('should return 500 if there is a server error during the process', async () => {
    mockReq.params.word_id = '123';
    mockReq.user = { id: 'user-123' };
    mockReq.collection = { id: 'collection-123' };

    const error = new Error('Database error');
    wordModel.getById.mockRejectedValue(error);

    await checkWordOwnership(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(500);
    expect(mockRes._getJSONData()).toEqual({ message: 'Server error' });
  });
});