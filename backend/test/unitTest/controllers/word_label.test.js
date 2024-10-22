const wordLabelModel = require('@models/word_label');
const {
  getPaginatedWordsByLabelId,
  addWordToLabel,
  removeWordFromLabel,
} = require('@controllers/word_label');

jest.mock('@models/word_label');

describe('WordLabel Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      label: { id: 1 },
      word: { id: 2 },
      query: { offset: '0', limit: '50' },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('getPaginatedWordsByLabelId', () => {
    it('should return paginated words associated with a label', async () => {
      const words = [{ id: 1, name: 'Word 1' }, { id: 2, name: 'Word 2' }];
      wordLabelModel.getPaginatedWordsByLabelId.mockResolvedValue(words);

      await getPaginatedWordsByLabelId(mockReq, mockRes);

      expect(wordLabelModel.getPaginatedWordsByLabelId).toHaveBeenCalledWith(1, 0, 50);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ words, offset: 0, limit: 50 });
    });

    it('should use default offset and limit if not provided', async () => {
      mockReq.query = {};
      const words = [{ id: 1, name: 'Word 1' }];
      wordLabelModel.getPaginatedWordsByLabelId.mockResolvedValue(words);

      await getPaginatedWordsByLabelId(mockReq, mockRes);

      expect(wordLabelModel.getPaginatedWordsByLabelId).toHaveBeenCalledWith(1, 0, 50);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ words, offset: 0, limit: 50 });
    });

    it('should return 500 on server error', async () => {
      wordLabelModel.getPaginatedWordsByLabelId.mockRejectedValue(new Error('Unexpected error'));

      await getPaginatedWordsByLabelId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('addWordToLabel', () => {
    it('should add a word to a label successfully', async () => {
      const association = { label_id: 1, word_id: 2 };
      wordLabelModel.addWordToLabel.mockResolvedValue(association);

      await addWordToLabel(mockReq, mockRes);

      expect(wordLabelModel.addWordToLabel).toHaveBeenCalledWith(1, 2);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Word added to label successfully',
        association,
      });
    });

    it('should return 409 if association already exists', async () => {
      const error = { code: '23505' }; // PostgreSQL unique constraint violation
      wordLabelModel.addWordToLabel.mockRejectedValue(error);

      await addWordToLabel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'This word is already associated with the label',
      });
    });

    it('should return 404 if association not found', async () => {
      wordLabelModel.addWordToLabel.mockResolvedValue(null);

      await addWordToLabel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Word-label association not found',
      });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      wordLabelModel.addWordToLabel.mockRejectedValue(error);

      await addWordToLabel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('removeWordFromLabel', () => {
    it('should remove a word from a label successfully', async () => {
      wordLabelModel.removeWordFromLabel.mockResolvedValue(true);

      await removeWordFromLabel(mockReq, mockRes);

      expect(wordLabelModel.removeWordFromLabel).toHaveBeenCalledWith(1, 2);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Word removed from label successfully',
      });
    });

    it('should return 404 if association not found', async () => {
      wordLabelModel.removeWordFromLabel.mockResolvedValue(null);

      await removeWordFromLabel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Word-label association not found',
      });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      wordLabelModel.removeWordFromLabel.mockRejectedValue(error);

      await removeWordFromLabel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});