const db = require('@db/db');
const labelModel = require('@models/label');

jest.mock('@db/db');

// Helper function to normalize the SQL by removing duplicate spaces and line breaks
const normalizeSQL = (sql) => sql.replace(/\s+/g, ' ').trim();

// Helper function to normalize the arguments passed to db.query
const normalizeArgs = (args) => args.map(arg => (typeof arg === 'string' ? arg.trim() : arg));

describe('Label Model', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new label successfully', async () => {
      const mockResult = {
        rows: [
          { id: 1, name: 'Test Label', user_id: 'user-123', collection_id: 1 }
        ]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const name = 'Test Label';
      const userId = 'user-123';
      const collectionId = 1;

      const result = await labelModel.create({ name, user_id: userId, collection_id: collectionId });

      expect(result).toEqual(mockResult.rows[0]);

      // Normalizing the SQL query
      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        INSERT INTO labels (name, user_id, collection_id) 
        VALUES ($1, $2, $3) RETURNING *;
      `);

      // Normalize arguments
      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([name, userId, collectionId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const name = 'Test Label';
      const userId = 'user-123';
      const collectionId = 1;

      await expect(labelModel.create({ name, user_id: userId, collection_id: collectionId }))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        INSERT INTO labels (name, user_id, collection_id) 
        VALUES ($1, $2, $3) RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([name, userId, collectionId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should fetch a label by its ID', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'Test Label', user_id: 'user-123', collection_id: 1 }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const labelId = 1;
      const result = await labelModel.getById(labelId);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`SELECT * FROM labels WHERE id = $1;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([labelId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const labelId = 1;

      await expect(labelModel.getById(labelId))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`SELECT * FROM labels WHERE id = $1;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([labelId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a label successfully', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'Updated Label', user_id: 'user-123', collection_id: 1 }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const labelId = 1;
      const name = 'Updated Label';

      const result = await labelModel.update(labelId, { name });

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        UPDATE labels SET name = $1 WHERE id = $2 RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([name, labelId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const labelId = 1;
      const name = 'Updated Label';

      await expect(labelModel.update(labelId, { name }))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        UPDATE labels SET name = $1 WHERE id = $2 RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([name, labelId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a label successfully', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'Test Label', user_id: 'user-123', collection_id: 1 }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const labelId = 1;
      const result = await labelModel.remove(labelId);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`DELETE FROM labels WHERE id = $1;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([labelId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const labelId = 1;

      await expect(labelModel.remove(labelId))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`DELETE FROM labels WHERE id = $1;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([labelId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllByCollectionId', () => {
    it('should fetch all labels for a given collection ID', async () => {
      const mockResult = {
        rows: [
          { id: 1, name: 'Label 1', user_id: 'user-123', collection_id: 1 },
          { id: 2, name: 'Label 2', user_id: 'user-123', collection_id: 1 }
        ]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const collectionId = 1;
      const result = await labelModel.getAllByCollectionId(collectionId);

      expect(result).toEqual(mockResult.rows);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`SELECT * FROM labels WHERE collection_id = $1 ORDER BY name ASC;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([collectionId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByNameAndCollectionId', () => {
    it('should fetch a label by its name and collection ID', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'Test Label', user_id: 'user-123', collection_id: 1 }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const name = 'Test Label';
      const collectionId = 1;
      const result = await labelModel.getByNameAndCollectionId(name, collectionId);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`SELECT * FROM labels WHERE name = $1 AND collection_id = $2;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([name, collectionId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });
});