const db = require('../db/db');

// Function to create the collections table
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS collections (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.query(query);
  console.log('Collections table created successfully');
};

// Create a new collection
const create = async (user_id, name, description) => {
  const query = `
    INSERT INTO collections (user_id, name, description) 
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const result = await db.query(query, [user_id, name, description]);
  return result.rows[0];
};

// Get a collection by ID
const getById = async (id) => {
  const query = `SELECT * FROM collections WHERE id = $1;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// Update a collection by ID
const update = async (id, name, description) => {
  const query = `
    UPDATE collections SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $3 RETURNING *;
  `;
  const result = await db.query(query, [name, description, id]);
  return result.rows[0];
};

// Delete a collection by ID
const remove = async (id) => {
  const query = `DELETE FROM collections WHERE id = $1 RETURNING *;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// Function to get paginated collections for a user by their user ID
const getPaginatedByUserId = async (user_id, limit, offset) => {
  const query = `
    SELECT * FROM collections 
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const result = await db.query(query, [user_id, limit, offset]);
  return result.rows;
};

module.exports = {
  createTable,
  create,
  getById,
  update,
  remove,
  getPaginatedByUserId
};