// Mock the collection model before importing the controller
jest.mock('@models/collection');

const { create, getById, update, remove, getPaginatedByUserId } = require('@controllers/collection');
const collectionModel = require('@models/collection');

describe('Collection Controller Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { id: 'user-id-123' },
      collection: { id: 'collection-id-456', name: 'Original Collection', description: 'Original Description' },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('Collection Controller - Create', () => {
    let mockReq, mockRes;
  
    beforeEach(() => {
      mockReq = {
        body: {
          name: 'Test Collection',
          description: 'A description for test collection',
        },
        user: { id: 'user-id-123' },
      };
  
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      jest.clearAllMocks(); // Clear mocks before each test
    });
  
    it('should create a new collection successfully', async () => {
      // Mock the create function to return a new collection
      const newCollection = {
        id: 'collection-id-123',
        name: 'Test Collection',
        description: 'A description for test collection',
        user_id: 'user-id-123',
      };
  
      collectionModel.create.mockResolvedValue(newCollection);
  
      // Call the create function
      await create(mockReq, mockRes);
  
      // Verify that the response was successful
      expect(collectionModel.create).toHaveBeenCalledWith('user-id-123', 'Test Collection', 'A description for test collection');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Collection created successfully',
        collection: newCollection,
      });
    });
  
    it('should return 500 if collection creation fails', async () => {
      // Mock the create function to return null (simulate failure)
      collectionModel.create.mockResolvedValue(null);
  
      // Call the create function
      await create(mockReq, mockRes);
  
      // Verify that a 500 error is returned
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error creating collection' });
    });
  
    it('should return 500 on server error', async () => {
      // Mock the create function to throw an error
      collectionModel.create.mockRejectedValue(new Error('Server error'));
  
      // Call the create function
      await create(mockReq, mockRes);
  
      // Verify that a 500 error is returned
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('getById', () => {
    it('should return a collection when found', async () => {
      mockReq.params = { collection_id: 'collection-id-456' };
      const collection = { id: 'collection-id-456', name: 'Test Collection', description: 'Description' };
      collectionModel.getById.mockResolvedValue(collection);

      await getById(mockReq, mockRes);

      expect(collectionModel.getById).toHaveBeenCalledWith('collection-id-456');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ collection });
    });

    it('should return 404 if collection not found', async () => {
      mockReq.params = { collection_id: 'non-existent-id' };
      collectionModel.getById.mockResolvedValue(null);

      await getById(mockReq, mockRes);

      expect(collectionModel.getById).toHaveBeenCalledWith('non-existent-id');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Collection not found' });
    });

    it('should return 500 on server error', async () => {
      mockReq.params = { collection_id: 'collection-id-456' };
      const error = new Error('Database error');
      collectionModel.getById.mockRejectedValue(error);

      await getById(mockReq, mockRes);

      expect(collectionModel.getById).toHaveBeenCalledWith('collection-id-456');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('update', () => {
    it('should update the collection when changes are made', async () => {
      mockReq.body = { name: 'Updated Collection', description: 'Updated Description' };
      const updatedCollection = { id: 'collection-id-456', ...mockReq.body };
      collectionModel.update.mockResolvedValue(updatedCollection);

      await update(mockReq, mockRes);

      expect(collectionModel.update).toHaveBeenCalledWith('collection-id-456', 'Updated Collection', 'Updated Description');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Collection updated successfully',
        collection: updatedCollection,
      });
    });

    it('should return 204 when no changes are made', async () => {
      mockReq.body = { name: 'Original Collection', description: 'Original Description' };

      await update(mockReq, mockRes);

      expect(collectionModel.update).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No changes made to the collection.' });
    });

    it('should return 404 if label not found during update', async () => {
      mockReq.body = { name: 'Updated Collection', description: 'Updated Description' };
      collectionModel.update.mockResolvedValue(null);
      await update(mockReq, mockRes);

      expect(collectionModel.update).toHaveBeenCalledWith(
        'collection-id-456', 'Updated Collection', 'Updated Description'
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Collection not found',
      });
    });

    it('should return 500 on server error', async () => {
      mockReq.body = { name: 'Updated Collection', description: 'Updated Description' };
      const error = new Error('Database error');
      collectionModel.update.mockRejectedValue(error);

      await update(mockReq, mockRes);

      expect(collectionModel.update).toHaveBeenCalledWith('collection-id-456', 'Updated Collection', 'Updated Description');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('remove', () => {
    it('should delete the collection successfully', async () => {
      const deletedCollection = { id: 'collection-id-456', name: 'Deleted Collection', description: 'Deleted Description' };
      collectionModel.remove.mockResolvedValue(deletedCollection);

      await remove(mockReq, mockRes);

      expect(collectionModel.remove).toHaveBeenCalledWith('collection-id-456');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Collection deleted successfully',
        collection: deletedCollection,
      });
    });

    it('should return 404 if collection not found during removal', async () => {
      collectionModel.remove.mockResolvedValue(null);

      await remove(mockReq, mockRes);

      expect(collectionModel.remove).toHaveBeenCalledWith('collection-id-456');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Collection not found' });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Database error');
      collectionModel.remove.mockRejectedValue(error);

      await remove(mockReq, mockRes);

      expect(collectionModel.remove).toHaveBeenCalledWith('collection-id-456');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('getPaginatedByUserId', () => {
    it('should return paginated collections for the user', async () => {
      mockReq.query = { limit: '10', offset: '0' };
      const collections = [
        { id: 'collection-id-1', name: 'Collection 1' },
        { id: 'collection-id-2', name: 'Collection 2' },
      ];
      collectionModel.getPaginatedByUserId.mockResolvedValue(collections);

      await getPaginatedByUserId(mockReq, mockRes);

      expect(collectionModel.getPaginatedByUserId).toHaveBeenCalledWith('user-id-123', 10, 0);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ collections });
    });

    it('should use default limit and offset if not provided', async () => {
      mockReq.query = {};
      const collections = [{ id: 'collection-id-1', name: 'Collection 1' }];
      collectionModel.getPaginatedByUserId.mockResolvedValue(collections);

      await getPaginatedByUserId(mockReq, mockRes);

      expect(collectionModel.getPaginatedByUserId).toHaveBeenCalledWith('user-id-123', 10, 0);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ collections });
    });

    it('should return 500 on server error', async () => {
      mockReq.query = { limit: '10', offset: '0' };
      const error = new Error('Database error');
      collectionModel.getPaginatedByUserId.mockRejectedValue(error);

      await getPaginatedByUserId(mockReq, mockRes);

      expect(collectionModel.getPaginatedByUserId).toHaveBeenCalledWith('user-id-123', 10, 0);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});