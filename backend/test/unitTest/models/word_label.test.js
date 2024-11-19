const db = require('@db/db');
const wordLabelModel = require('@models/word_label');

jest.mock('@db/db');

// Helper function to normalize the SQL by removing duplicate spaces and line breaks
const normalizeSQL = (sql) => sql.replace(/\s+/g, ' ').trim();

// Helper function to normalize the arguments passed to db.query
const normalizeArgs = (args) => args.map(arg => (typeof arg === 'string' ? arg.trim() : arg));

describe('Word Label Model', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addWordToLabel', () => {
    it('should add a word to a label successfully', async () => {
      const mockResult = {
        rows: [{ word_id: 1, label_id: 2 }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const labelId = 2;
      const wordId = 1;

      const result = await wordLabelModel.addWordToLabel(labelId, wordId);

      expect(result).toEqual(mockResult.rows[0]);

      // Normalizing the SQL query
      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        INSERT INTO word_labels (label_id, word_id) 
        VALUES ($1, $2) RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([labelId, wordId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const labelId = 2;
      const wordId = 1;

      await expect(wordLabelModel.addWordToLabel(labelId, wordId))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        INSERT INTO word_labels (label_id, word_id) 
        VALUES ($1, $2) RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([labelId, wordId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeWordFromLabel', () => {
    it('should remove a word from a label successfully', async () => {
      const mockResult = {
        rows: [{ word_id: 1, label_id: 2 }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const labelId = 2;
      const wordId = 1;

      const result = await wordLabelModel.removeWordFromLabel(labelId, wordId);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`DELETE FROM word_labels WHERE label_id = $1 AND word_id = $2;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([labelId, wordId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const labelId = 2;
      const wordId = 1;

      await expect(wordLabelModel.removeWordFromLabel(labelId, wordId))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`DELETE FROM word_labels WHERE label_id = $1 AND word_id = $2;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([labelId, wordId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPaginatedWordsByLabelId', () => {
    it('should fetch paginated words by label ID successfully', async () => {
      const mockResult = {
        rows: [
          { id: 1, name: 'Word 1', labels: [{ id: 2, name: 'Label 1' }] },
          { id: 2, name: 'Word 2', labels: [{ id: 2, name: 'Label 1' }] }
        ]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const collectionId = 1;
      const labelId = 2;
      const limit = 10;
      const offset = 0;

      const result = await wordLabelModel.getPaginatedWordsByLabelId(collectionId, labelId, offset, limit);

      expect(result).toEqual(mockResult.rows);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        SELECT words.*, 
        COALESCE(
          json_agg( DISTINCT jsonb_build_object( 'id', labels.id, 'name', labels.name ) )
          FILTER (WHERE labels.id IS NOT NULL), '[]'
        ) AS labels
        FROM words
        JOIN word_labels ON words.id = word_labels.word_id
        LEFT JOIN labels ON word_labels.label_id = labels.id
        WHERE words.collection_id = $1 AND word_labels.label_id = $2
        GROUP BY words.id
        ORDER BY words.created_at
        LIMIT $3 OFFSET $4;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([collectionId, labelId, limit, offset]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const collectionId = 1;
      const labelId = 2;
      const limit = 10;
      const offset = 0;

      await expect(wordLabelModel.getPaginatedWordsByLabelId(collectionId, labelId, offset, limit))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        SELECT words.*, 
        COALESCE(
          json_agg( DISTINCT jsonb_build_object( 'id', labels.id, 'name', labels.name ) )
          FILTER (WHERE labels.id IS NOT NULL), '[]'
        ) AS labels
        FROM words
        JOIN word_labels ON words.id = word_labels.word_id
        LEFT JOIN labels ON word_labels.label_id = labels.id
        WHERE words.collection_id = $1 AND word_labels.label_id = $2
        GROUP BY words.id
        ORDER BY words.created_at
        LIMIT $3 OFFSET $4;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([collectionId, labelId, limit, offset]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });
});