const { create, getById, getPaginated, update, remove, searchByPrefix } = require('@controllers/word');
const wordModel = require('@models/word');

jest.mock('@models/word');

describe('Word Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        name: 'Test Word',
        description: 'A description of the test word',
        img_path: 'test_image.png',
        label_ids: [1, 2],
      },
      user: { id: 'user-id-123' },
      collection: { id: 1 },
      query: { offset: '0', limit: '50', prefix: 'Test' },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new word successfully', async () => {
      const newWord = { id: 1, name: 'Test Word', description: 'A description of the test word' };
      wordModel.create.mockResolvedValue(newWord);

      await create(mockReq, mockRes);

      expect(wordModel.create).toHaveBeenCalledWith({
        name: 'Test Word',
        description: 'A description of the test word',
        img_path: 'test_image.png',
        user_id: 'user-id-123',
        collection_id: 1,
        label_ids: [1, 2],
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Word created successfully',
        word: newWord,
      });
    });

    it('should return 400 if label validation fails', async () => {
      const error = new Error('Labels not owned by the user or not in the collection: 3');
      wordModel.create.mockRejectedValue(error);

      await create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Labels not owned by the user or not in the collection: 3',
      });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      wordModel.create.mockRejectedValue(error);

      await create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('getById', () => {
    beforeEach(() => {
      mockReq = {
        params: { word_id: 1 },
      };
    });
    it('should return a word by ID', async () => {
      const word = { id: 1, name: 'Test Word' };
      wordModel.getById.mockResolvedValue(word);

      await getById(mockReq, mockRes);

      expect(wordModel.getById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ word });
    });

    it('should return 404 if word not found', async () => {
      wordModel.getById.mockResolvedValue(null);

      await getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Word not found' });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      wordModel.getById.mockRejectedValue(error);

      await getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('getPaginated', () => {
    it('should return paginated words successfully', async () => {
      const words = [{ id: 1, name: 'Word 1' }, { id: 2, name: 'Word 2' }];
      wordModel.getPaginated.mockResolvedValue(words);

      await getPaginated(mockReq, mockRes);

      expect(wordModel.getPaginated).toHaveBeenCalledWith(1, 0, 50);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ words, offset: 0, limit: 50 });
    });

    it('should return 500 on server error', async () => {
      wordModel.getPaginated.mockRejectedValue(new Error('Server error'));

      await getPaginated(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('update', () => {
    beforeEach(() => {
      mockReq.word = { id: 1, name: 'Old Name', description: 'Old description', img_path: 'old_image.png' };
    });

    it('should update the word successfully', async () => {
      const updatedWord = { id: 1, name: 'New Name', description: 'New description', img_path: 'new_image.png' };
      wordModel.update.mockResolvedValue(updatedWord);

      mockReq.body = { name: 'New Name', description: 'New description', img_path: 'new_image.png' };

      await update(mockReq, mockRes);

      expect(wordModel.update).toHaveBeenCalledWith(1, {
        name: 'New Name',
        description: 'New description',
        img_path: 'new_image.png',
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Word updated successfully', word: updatedWord });
    });

    it('should return 204 if no changes are made', async () => {
      mockReq.body = { name: 'Old Name', description: 'Old description', img_path: 'old_image.png' };

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No changes made to the word.' });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      wordModel.update.mockRejectedValue(error);

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('Word Controller - Remove Function', () => {
    let mockReq, mockRes;
  
    beforeEach(() => {
      mockReq = {
        word: { id: 123 },  // Use an integer ID
      };
  
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      jest.clearAllMocks();  // Clear mock calls before each test
    });
  
    it('should delete a word successfully', async () => {
      // Mock the resolved value from wordModel.remove to simulate a successful deletion
      wordModel.remove.mockResolvedValue({
        id: 123,
        name: 'testName',
        description: 'testDescription',
        img_path: "test_img_path.jpg",
      });
  
      // Call the remove function in the controller
      await remove(mockReq, mockRes);
  
      // Verify that wordModel.remove was called with the correct argument
      expect(wordModel.remove).toHaveBeenCalledWith(123);
  
      // Ensure that the response status is 200 and correct message is sent
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Word deleted successfully'
      });
    });
  
    it('should return 404 if the word is not found', async () => {
      // Simulate a case where the word does not exist in the database
      wordModel.remove.mockResolvedValue(null);
  
      // Call the remove function
      await remove(mockReq, mockRes);
  
      // Ensure that wordModel.remove was called with the correct argument
      expect(wordModel.remove).toHaveBeenCalledWith(123);
  
      // Ensure that the response status is 404 and the message is correct
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Word not found.' });
    });
  
    it('should return 500 on server error', async () => {
      // Simulate a server error
      wordModel.remove.mockRejectedValue(new Error('Server error'));
  
      // Call the remove function
      await remove(mockReq, mockRes);
  
      // Ensure that the response status is 500 and the message is correct
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });



  describe('searchByPrefix', () => {
    it('should return words matching the prefix', async () => {
      const words = [{ id: 1, name: 'Test Word' }];
      wordModel.searchByPrefix.mockResolvedValue(words);

      await searchByPrefix(mockReq, mockRes);

      expect(wordModel.searchByPrefix).toHaveBeenCalledWith(1, 'Test');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ words });
    });

    it('should return 400 if no prefix is provided', async () => {
      mockReq.query.prefix = '';

      await searchByPrefix(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Search prefix is required.' });
    });

    it('should return 500 on server error', async () => {
      const error = new Error('Server error');
      wordModel.searchByPrefix.mockRejectedValue(error);

      await searchByPrefix(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});