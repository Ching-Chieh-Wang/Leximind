const db = require('../db/db');
const WordLabel = require('./word_label');  // Import the word_label model for managing associations

// Create the labels table
const createTable = async () => {
  try {
    const result = await db.query(`
      CREATE TABLE IF NOT EXISTS labels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(name, user_id) 
      );
    `);
    console.log('Labels table created successfully');
    return result;
  } catch (error) {
    console.error('Error creating labels table:', error);
    throw error;
  }
};

// Get all labels with pagination
const getPaginated = async (limit, offset) => {
  const result = await db.query('SELECT * FROM labels LIMIT $1 OFFSET $2', [limit, offset]);
  return result.rows;
};

// Create a new label
const create = async (name, userId) => {
  try {
    const result = await db.query(
      'INSERT INTO labels (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating label:', error);
    throw error;
  }
};

// Find a label by ID
const getById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM labels WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error finding label by ID:', error);
    throw error;
  }
};

//Find a label by name and user ID (to prevent duplicates)
const getByNameAndUserId = async (name, user_id) => {
  try {
    const result = await db.query('SELECT * FROM labels WHERE name = $1 AND user_id = $2', [name, user_id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error finding label by name and user ID:', error);
    throw error;
  }
};

// Update a label by ID
const update = async (id, name) => {
  try {
    const result = await db.query(
      'UPDATE labels SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating label:', error);
    throw error;
  }
};

// Delete a label by ID
const remove = async (id) => {
  try {
    await db.query('DELETE FROM labels WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting label:', error);
    throw error;
  }
};

// Get all labels for a specific user
const getAllByUserId = async (user_id) => {
  try {
    const result = await db.query('SELECT * FROM labels WHERE user_id = $1', [user_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching labels by user ID:', error);
    throw error;
  }
};


module.exports = {
  createTable,
  create,
  getById,
  getByNameAndUserId,
  update,
  remove,
  getAllByUserId,
  getPaginated,
};
