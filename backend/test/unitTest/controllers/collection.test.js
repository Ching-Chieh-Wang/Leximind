// Mock the collection model before importing the controller
jest.mock('@models/collection');

const { create, getById, update, remove, getAllByUserIdSortedByLastViewTime } = require('@controllers/collection');
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
    beforeEach(() => {
      mockReq = {
        body: {
          name: 'Test Collection',
          description: 'A description for test collection',
          is_public: true,
        },
        user: { id: 'user-id-123' },
      };

      jest.clearAllMocks();
    });

    it('should create a new collection successfully', async () => {
      const newCollection = {
        id: 'collection-id-123',
        name: 'Test Collection',
        description: 'A description for test collection',
        user_id: 'user-id-123',
        author_id: 'user-id-123',
        is_public: true,
        save_cnt: 0,
      };

      collectionModel.create.mockResolvedValue(newCollection);

      await create(mockReq, mockRes);

      expect(collectionModel.create).toHaveBeenCalledWith('user-id-123', 'user-id-123', 'Test Collection', 'A description for test collection', true);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Collection created successfully',
        collection: newCollection,
      });
    });

    it('should return 500 if collection creation fails', async () => {
      collectionModel.create.mockResolvedValue(null);

      await create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error creating collection' });
    });

    it('should return 500 on server error', async () => {
      collectionModel.create.mockRejectedValue(new Error('Server error'));

      await create(mockReq, mockRes);

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
      mockReq.body = { name: 'Updated Collection', description: 'Updated Description', is_public: false };
      const updatedCollection = { id: 'collection-id-456', ...mockReq.body, save_cnt: 1 };
      collectionModel.update.mockResolvedValue(updatedCollection);

      await update(mockReq, mockRes);

      expect(collectionModel.update).toHaveBeenCalledWith('collection-id-456', 'Updated Collection', 'Updated Description', false);
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

    it('should return 404 if collection not found during update', async () => {
      mockReq.body = { name: 'Updated Collection', description: 'Updated Description', is_public: true };
      collectionModel.update.mockResolvedValue(null);
      await update(mockReq, mockRes);

      expect(collectionModel.update).toHaveBeenCalledWith(
        'collection-id-456', 'Updated Collection', 'Updated Description', true
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Collection not found',
      });
    });

    it('should return 500 on server error', async () => {
      mockReq.body = { name: 'Updated Collection', description: 'Updated Description', is_public: true };
      const error = new Error('Database error');
      collectionModel.update.mockRejectedValue(error);

      await update(mockReq, mockRes);

      expect(collectionModel.update).toHaveBeenCalledWith('collection-id-456', 'Updated Collection', 'Updated Description', true);
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

  describe('getAllByUserIdSortedByLastViewTime', () => {
    it('should return all collections for the user sorted by last viewed time', async () => {
      const collections = [
        { id: 'collection-id-1', name: 'Collection 1', last_viewed_at: '2023-11-01T12:00:00Z' },
        { id: 'collection-id-2', name: 'Collection 2', last_viewed_at: '2023-11-02T12:00:00Z' },
      ];
      collectionModel.getAllByUserIdSortedByLastViewTime.mockResolvedValue(collections);

      await getAllByUserIdSortedByLastViewTime(mockReq, mockRes);

      expect(collectionModel.getAllByUserIdSortedByLastViewTime).toHaveBeenCalledWith('user-id-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ collections });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Database error');
      collectionModel.getAllByUserIdSortedByLastViewTime.mockRejectedValue(error);

      await getAllByUserIdSortedByLastViewTime(mockReq, mockRes);

      expect(collectionModel.getAllByUserIdSortedByLastViewTime).toHaveBeenCalledWith('user-id-123');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});