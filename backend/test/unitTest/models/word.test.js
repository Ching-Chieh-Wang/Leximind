const db = require('@db/db');
const wordModel = require('@models/word');

jest.mock('@db/db');

// Helper function to normalize the SQL by removing duplicate spaces and line breaks
const normalizeSQL = (sql) => sql.replace(/\s+/g, ' ').trim();

// Helper function to normalize the arguments passed to db.query
const normalizeArgs = (args) => args.map(arg => (typeof arg === 'string' ? arg.trim() : arg));

describe('Word Model', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('create', () => {
    it('should create a new word successfully', async () => {
      // Mock the transaction result to directly return the created word
      const mockNewWord = {
        id: 1,
        name: 'Word 1',
        description: 'Test Description',
        img_path: 'image.jpg',
        collection_id: 1,
      };
      
      // Mock the client behavior within the transaction
      db.executeTransaction.mockImplementationOnce(async (callback) => {
        const mockClient = {
          query: jest.fn()
            .mockResolvedValueOnce({ rows: [{ id: 1} ,{id:2}] }) // for the label check
            .mockResolvedValueOnce({ rows: [mockNewWord] }) // for word insert
            .mockResolvedValueOnce({ rows: [] }), // for label association insertions
        };
        return await callback(mockClient);
      });
  
      const wordData = {
        name: 'Word 1',
        description: 'Test Description',
        img_path: 'image.jpg',
        user_id: 'user-123',
        collection_id: 1,
        label_ids: [1, 2],
      };
  
      const result = await wordModel.create(wordData);
  
      // Assert the result matches the expected new word
      expect(result).toEqual(mockNewWord);
  
      const expectedQuery = normalizeSQL(`
        INSERT INTO words (name, description, img_path, user_id, collection_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `);
  
      // Check that the transaction was called with the proper queries
      expect(db.executeTransaction).toHaveBeenCalledWith(expect.any(Function));
    });


    it('should throw an error for invalid labels', async () => {
      const invalidLabelsError = new Error('Labels not owned by the user or not in the collection: 3');

      db.executeTransaction.mockImplementationOnce(async (callback) => {
        throw invalidLabelsError;
      });

      const wordData = {
        name: 'Word 1',
        description: 'Test Description',
        img_path: 'image.jpg',
        user_id: 'user-123',
        collection_id: 1,
        label_ids: [1, 2, 3]
      };

      await expect(wordModel.create(wordData))
        .rejects.toThrow('Labels not owned by the user or not in the collection: 3');
    });
  });

  describe('update', () => {
    it('should update a word successfully', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'Updated Word', description: 'Updated description', img_path: 'updated.jpg' }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const wordId = 1;
      const wordData = {
        name: 'Updated Word',
        description: 'Updated description',
        img_path: 'updated.jpg'
      };

      const result = await wordModel.update(wordId, wordData);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        UPDATE words SET name = $1, description = $2, img_path = $3 WHERE id = $4 RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([wordData.name, wordData.description, wordData.img_path, wordId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const wordId = 1;
      const wordData = {
        name: 'Updated Word',
        description: 'Updated description',
        img_path: 'updated.jpg'
      };

      await expect(wordModel.update(wordId, wordData))
        .rejects.toThrow('Database error');
    });
  });

  describe('remove', () => {
    it('should remove a word successfully', async () => {
      const mockResult = {
        rows: [{ collection_id: 1, order_index: 2 }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const wordId = 1;

      const result = await wordModel.remove(wordId);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`DELETE FROM words WHERE id = $1 RETURNING collection_id, order_index;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([wordId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const wordId = 1;

      await expect(wordModel.remove(wordId))
        .rejects.toThrow('Database error');
    });
  });

  describe('getPaginated', () => {
    it('should fetch paginated words successfully', async () => {
      const mockResult = {
        rows: [
          { id: 1, name: 'Word 1', description: 'First word', labels: [{ id: 1, name: 'Label 1' }] },
          { id: 2, name: 'Word 2', description: 'Second word', labels: [{ id: 2, name: 'Label 2' }] }
        ]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const collectionId = 1;
      const offset = 0;
      const limit = 10;

      const result = await wordModel.getPaginated(collectionId, offset, limit);

      expect(result).toEqual(mockResult.rows);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        SELECT words.*, 
        COALESCE(
          json_agg( DISTINCT jsonb_build_object( 'id', labels.id, 'name', labels.name ) )
          FILTER (WHERE labels.id IS NOT NULL), '[]'
        ) AS labels
        FROM words
        LEFT JOIN word_labels ON words.id = word_labels.word_id
        LEFT JOIN labels ON word_labels.label_id = labels.id
        WHERE words.collection_id = $1
        GROUP BY words.id
        ORDER BY words.created_at
        LIMIT $2 OFFSET $3;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([collectionId, limit, offset]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
    });
  });
});