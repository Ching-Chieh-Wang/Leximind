const db = require('@db/db');
const collectionModel = require('@models/collection');

jest.mock('@db/db');

// Helper function to normalize the SQL by removing duplicate spaces and line breaks
const normalizeSQL = (sql) => sql.replace(/\s+/g, ' ').trim();

// Helper function to normalize the arguments passed to db.query
const normalizeArgs = (args) => args.map(arg => (typeof arg === 'string' ? arg.trim() : arg));

describe('Collection Model', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new collection successfully', async () => {
      const mockResult = {
        rows: [
          { id: 1, user_id: 'user-123', name: 'Test Collection', description: 'A test description' }
        ]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const userId = 'user-123';
      const name = 'Test Collection';
      const description = 'A test description';

      const result = await collectionModel.create(userId, name, description);

      expect(result).toEqual(mockResult.rows[0]);

      // Normalize the SQL query
      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        INSERT INTO collections (user_id, name, description) 
        VALUES ($1, $2, $3) RETURNING *;
      `);

      // Normalize arguments
      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs(['user-123', 'Test Collection', 'A test description']);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const userId = 'user-123';
      const name = 'Test Collection';
      const description = 'A test description';

      await expect(collectionModel.create(userId, name, description))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        INSERT INTO collections (user_id, name, description) 
        VALUES ($1, $2, $3) RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs(['user-123', 'Test Collection', 'A test description']);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  // Repeat similar normalization for other tests

  describe('getById', () => {
    it('should fetch a collection by its ID', async () => {
      const mockResult = {
        rows: [{ id: 1, user_id: 'user-123', name: 'Test Collection', description: 'A test description' }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const collectionId = 1;
      const result = await collectionModel.getById(collectionId);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`SELECT * FROM collections WHERE id = $1;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([collectionId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a collection successfully', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'Updated Collection', description: 'Updated description' }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const collectionId = 1;
      const name = 'Updated Collection';
      const description = 'Updated description';

      const result = await collectionModel.update(collectionId, name, description);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        UPDATE collections SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $3 RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([name, description, collectionId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  // Additional test cases can follow the same pattern for other CRUD operations.
});