const db = require('../db/db');

// Function to create the collections table
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS collections (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      author_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      is_public BOOLEAN DEFAULT FALSE,
      save_cnt INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.query(query);
  console.log('Collections table created successfully');
};

// Create a new collection
const create = async (user_id, author_id, name, description, is_public = false) => {
  const query = `
    INSERT INTO collections (user_id, author_id, name, description, is_public, save_cnt) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const result = await db.query(query, [user_id, author_id, name, description, is_public, 0]);
  return result.rows[0];
};

// Get a collection by ID
const getById = async (id) => {
  const query = `SELECT * FROM collections WHERE id = $1;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// Update a collection by ID
const update = async (id, name, description, is_public) => {
  const query = `
    UPDATE collections 
    SET name = $1, description = $2, is_public = $3, save_cnt = save_cnt + 1 
    WHERE id = $4 RETURNING *;
  `;
  const result = await db.query(query, [name, description, is_public, id]);
  return result.rows[0];
};

// Delete a collection by ID
const remove = async (id) => {
  const query = `DELETE FROM collections WHERE id = $1 RETURNING *;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// Get all collections for a user sorted by last viewed time
const getAllByUserIdSortedByLastViewTime = async (user_id) => {
  const query = `
    SELECT * FROM collections 
    WHERE user_id = $1
    ORDER BY last_viewed_at DESC;
  `;
  const result = await db.query(query, [user_id]);
  return result.rows;
};

module.exports = {
  createTable,
  create,
  getById,
  update,
  remove,
  getAllByUserIdSortedByLastViewTime
};