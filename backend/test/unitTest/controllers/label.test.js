const labelModel = require('@models/label');
const {
  create,
  update,
  remove,
  getAllByCollectionId,
} = require('@controllers/label');

jest.mock('@models/label');

describe('Label Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: 'user-id-123' },
      collection: { id: 'collection-id-123' },
      label: {
        id: 'label-id-123',
        name: 'Test Label',
        collection_id: 'collection-id-123',
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new label successfully', async () => {
      mockReq.body = { name: 'New Label' };

      const newLabel = {
        id: 'label-id-new',
        name: 'New Label',
        user_id: 'user-id-123',
        collection_id: 'collection-id-123',
      };

      labelModel.create.mockResolvedValue(newLabel);

      await create(mockReq, mockRes);

      expect(labelModel.create).toHaveBeenCalledWith({
        name: 'New Label',
        user_id: 'user-id-123',
        collection_id: 'collection-id-123',
      });

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Label created successfully',
        label: newLabel,
      });
    });

    it('should return 500 if label creation fails', async () => {
      mockReq.body = { name: 'New Label' };

      labelModel.create.mockResolvedValue(null);

      await create(mockReq, mockRes);

      expect(labelModel.create).toHaveBeenCalledWith({
        name: 'New Label',
        user_id: 'user-id-123',
        collection_id: 'collection-id-123',
      });

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error creating newLabel',
      });
    });

    it('should return 400 if label name already exists', async () => {
      mockReq.body = { name: 'Duplicate Label' };
      const error = { code: '23505' }; // PostgreSQL unique constraint violation

      labelModel.create.mockRejectedValue(error);

      await create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'A label with this name already exists in this collection.',
      });
    });

    it('should return 500 on server error', async () => {
      mockReq.body = { name: 'New Label' };
      const error = new Error('Server error');

      labelModel.create.mockRejectedValue(error);

      await create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Server error',
      });
    });
  });

  describe('update', () => {
    it('should update the label successfully', async () => {
      mockReq.body = { name: 'Updated Label' };

      const updatedLabel = {
        id: 'label-id-123',
        name: 'Updated Label',
        collection_id: 'collection-id-123',
      };

      labelModel.update.mockResolvedValue(updatedLabel);

      await update(mockReq, mockRes);

      expect(labelModel.update).toHaveBeenCalledWith('label-id-123', {
        name: 'Updated Label',
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Label updated successfully',
        label: updatedLabel,
      });
    });

    it('should return 204 if no changes were made', async () => {
      mockReq.body = { name: 'Test Label' }; // Same as current name

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'No changes made to the label.',
      });
      expect(labelModel.update).not.toHaveBeenCalled();
    });

    it('should return 404 if label not found during update', async () => {
      mockReq.body = { name: 'Updated Label' };

      labelModel.update.mockResolvedValue(null);

      await update(mockReq, mockRes);

      expect(labelModel.update).toHaveBeenCalledWith('label-id-123', {
        name: 'Updated Label',
      });

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Collection not found',
      });
    });

    it('should return 400 if label name already exists', async () => {
      mockReq.body = { name: 'Duplicate Label' };
      const error = { code: '23505' }; // PostgreSQL unique constraint violation

      labelModel.update.mockRejectedValue(error);

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'A label with this name already exists in this collection.',
      });
    });

    it('should return 500 on server error', async () => {
      mockReq.body = { name: 'Updated Label' };
      const error = new Error('Server error');

      labelModel.update.mockRejectedValue(error);

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Server error',
      });
    });
  });

  describe('remove', () => {
    it('should delete the label successfully', async () => {
      labelModel.remove.mockResolvedValue(true);

      await remove(mockReq, mockRes);

      expect(labelModel.remove).toHaveBeenCalledWith('label-id-123');

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Label deleted successfully',
      });
    });

    it('should return 404 if label not found during deletion', async () => {
      labelModel.remove.mockResolvedValue(null);

      await remove(mockReq, mockRes);

      expect(labelModel.remove).toHaveBeenCalledWith('label-id-123');

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Label not found',
      });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      labelModel.remove.mockRejectedValue(error);

      await remove(mockReq, mockRes);

      expect(labelModel.remove).toHaveBeenCalledWith('label-id-123');

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Server error',
      });
    });
  });

  describe('getAllByCollectionId', () => {
    it('should return all labels for the collection', async () => {
      const labels = [
        { id: 'label-id-1', name: 'Label 1' },
        { id: 'label-id-2', name: 'Label 2' },
      ];

      labelModel.getAllByCollectionId.mockResolvedValue(labels);

      await getAllByCollectionId(mockReq, mockRes);

      expect(labelModel.getAllByCollectionId).toHaveBeenCalledWith(
        'collection-id-123'
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ labels });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      labelModel.getAllByCollectionId.mockRejectedValue(error);

      await getAllByCollectionId(mockReq, mockRes);

      expect(labelModel.getAllByCollectionId).toHaveBeenCalledWith(
        'collection-id-123'
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Server error',
      });
    });
  });
});