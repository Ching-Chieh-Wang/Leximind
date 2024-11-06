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
          { id: 1, user_id: 'user-123', author_id: 'user-123', name: 'Test Collection', description: 'A test description', is_public: true, save_cnt: 0 }
        ]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const userId = 'user-123';
      const authorId = 'user-123';
      const name = 'Test Collection';
      const description = 'A test description';
      const isPublic = true;

      const result = await collectionModel.create(userId, authorId, name, description, isPublic);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        INSERT INTO collections (user_id, author_id, name, description, is_public, save_cnt) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs(['user-123', 'user-123', 'Test Collection', 'A test description', true, 0]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const userId = 'user-123';
      const authorId = 'user-123';
      const name = 'Test Collection';
      const description = 'A test description';
      const isPublic = true;

      await expect(collectionModel.create(userId, authorId, name, description, isPublic))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        INSERT INTO collections (user_id, author_id, name, description, is_public, save_cnt) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs(['user-123', 'user-123', 'Test Collection', 'A test description', true, 0]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

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
    it('should update a collection successfully and increment save count', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'Updated Collection', description: 'Updated description', save_cnt: 1 }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const collectionId = 1;
      const name = 'Updated Collection';
      const description = 'Updated description';
      const isPublic = false;

      const result = await collectionModel.update(collectionId, name, description, isPublic);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        UPDATE collections SET name = $1, description = $2, is_public = $3, save_cnt = save_cnt + 1 
        WHERE id = $4 RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([name, description, isPublic, collectionId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully during update', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const collectionId = 1;
      const name = 'Updated Collection';
      const description = 'Updated description';
      const isPublic = true;

      await expect(collectionModel.update(collectionId, name, description, isPublic))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        UPDATE collections SET name = $1, description = $2, is_public = $3, save_cnt = save_cnt + 1 
        WHERE id = $4 RETURNING *;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([name, description, isPublic, collectionId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete a collection by ID successfully', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'Deleted Collection', description: 'Deleted Description' }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const collectionId = 1;
      const result = await collectionModel.remove(collectionId);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`DELETE FROM collections WHERE id = $1 RETURNING *;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([collectionId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully during deletion', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const collectionId = 1;

      await expect(collectionModel.remove(collectionId))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`DELETE FROM collections WHERE id = $1 RETURNING *;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([collectionId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllByUserIdSortedByLastViewTime', () => {
    it('should retrieve all collections sorted by last viewed time for a user', async () => {
      const mockResult = {
        rows: [
          { id: 'collection-1', user_id: 'user-123', last_viewed_at: '2023-11-01T12:00:00Z' },
          { id: 'collection-2', user_id: 'user-123', last_viewed_at: '2023-11-02T12:00:00Z' }
        ]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const userId = 'user-123';
      const result = await collectionModel.getAllByUserIdSortedByLastViewTime(userId);

      expect(result).toEqual(mockResult.rows);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        SELECT * FROM collections WHERE user_id = $1 ORDER BY last_viewed_at DESC;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([userId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });
});