const db = require('@db/db');
const userModel = require('@models/user');

jest.mock('@db/db');

// Helper function to normalize the SQL by removing duplicate spaces and line breaks
const normalizeSQL = (sql) => sql.replace(/\s+/g, ' ').trim();

// Helper function to normalize the arguments passed to db.query
const normalizeArgs = (args) => args.map(arg => (typeof arg === 'string' ? arg.trim() : arg));

describe('User Model', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const mockResult = {
        rows: [{ id: 1, username: 'TestUser', email: 'test@example.com', role: 'user' }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const username = 'TestUser';
      const email = 'test@example.com';
      const password = 'hashedPassword';
      const role = 'user';

      const result = await userModel.create(username, email, password, role);

      expect(result).toEqual(mockResult.rows[0]);

      // Normalizing the SQL query
      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        INSERT INTO users (username, email, password, role) 
        VALUES ($1, $2, $3, $4) RETURNING id,username,email,role;
      `);

      // Normalize arguments
      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([username, email, password, role]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const username = 'TestUser';
      const email = 'test@example.com';
      const password = 'hashedPassword';
      const role = 'user';

      await expect(userModel.create(username, email, password, role))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        INSERT INTO users (username, email, password, role) 
        VALUES ($1, $2, $3, $4) RETURNING id,username,email,role;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([username, email, password, role]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should fetch a user by its ID without the password', async () => {
      const mockResult = {
        rows: [{ id: 1, username: 'TestUser', email: 'test@example.com', role: 'user' }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const userId = 1;
      const result = await userModel.getById(userId);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`SELECT id, username, email, role, created_at FROM users WHERE id = $1;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([userId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const userId = 1;

      await expect(userModel.getById(userId))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`SELECT id, username, email, role, created_at FROM users WHERE id = $1;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([userId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByEmail', () => {
    it('should fetch a user by its email without the password', async () => {
      const mockResult = {
        rows: [{ id: 1, username: 'TestUser', email: 'test@example.com', role: 'user' }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const email = 'test@example.com';
      const result = await userModel.getByEmail(email);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`SELECT id, username, email, role, created_at FROM users WHERE email = $1;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([email]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValueOnce(mockError);

      const email = 'test@example.com';

      await expect(userModel.getByEmail(email))
        .rejects.toThrow('Database error');

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`SELECT id, username, email, role, created_at FROM users WHERE email = $1;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([email]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserWithPasswordByEmail', () => {
    it('should fetch a user by its email with the password', async () => {
      const mockResult = {
        rows: [{ id: 1, username: 'TestUser', email: 'test@example.com', password: 'hashedPassword', role: 'user' }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const email = 'test@example.com';
      const result = await userModel.getUserWithPasswordByEmail(email);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`SELECT * FROM users WHERE email = $1;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([email]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const mockResult = {
        rows: [{ id: 1, username: 'UpdatedUser', email: 'updated@example.com', role: 'user' }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const userId = 1;
      const username = 'UpdatedUser';
      const email = 'updated@example.com';

      const result = await userModel.update(userId, username, email);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`
        UPDATE users SET username = $1, email = $2 
        WHERE id = $3 RETURNING id, username, email, role;
      `);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([username, email, userId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const mockResult = {
        rows: [{ id: 1, username: 'TestUser', email: 'test@example.com', role: 'user' }]
      };
      db.query.mockResolvedValueOnce(mockResult);

      const userId = 1;
      const result = await userModel.remove(userId);

      expect(result).toEqual(mockResult.rows[0]);

      const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
      const expectedQuery = normalizeSQL(`DELETE FROM users WHERE id = $1 RETURNING *;`);

      const actualArgs = normalizeArgs(db.query.mock.calls[0][1]);
      const expectedArgs = normalizeArgs([userId]);

      expect(actualQuery).toBe(expectedQuery);
      expect(actualArgs).toEqual(expectedArgs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });
});