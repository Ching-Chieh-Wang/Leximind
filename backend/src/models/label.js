const db = require('../db/db');  // Import the database connection

// Function to create the labels table
const createTable = async () => {
  const result = await db.query(`
    CREATE TABLE IF NOT EXISTS labels (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(50) NOT NULL,
      collection_id INT REFERENCES collections(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (collection_id, name) -- Ensures name is unique within each collection
    );
  `);
  console.log('Labels table created successfully');
  return result;
};

// Function to create a new label
const create = async ({ name, user_id, collection_id }) => {
  const result = await db.query(
    `INSERT INTO labels (name, user_id, collection_id) 
      VALUES ($1, $2, $3) RETURNING *;`,
    [name, user_id, collection_id]
  );
  return result.rows[0]; // Return the created label
};

// Function to get a label by ID
const getById = async (id) => {
  const result = await db.query('SELECT * FROM labels WHERE id = $1;', [id]);
  return result.rows[0];
};

// Function to update a label by ID
const update = async (id, { name }) => {
  const result = await db.query(
    `UPDATE labels SET name = $1 WHERE id = $2 RETURNING *;`,
    [name, id]
  );
  return result.rows[0]; // Return the updated label
};

// Function to remove a label by ID
const remove = async (id) => {
  const result= await db.query('DELETE FROM labels WHERE id = $1;', [id]);
  return result.rows[0];
};


// Function to get all labels by collection ID
const getAllByCollectionId = async (collection_id) => {
  const result = await db.query('SELECT * FROM labels WHERE collection_id = $1 ORDER BY name ASC;', [collection_id]);
  return result.rows; // Return the list of labels
};

// Function to get a label by name and collection ID
const getByNameAndCollectionId = async (name, collection_id) => {
  const result = await db.query(
    'SELECT * FROM labels WHERE name = $1 AND collection_id = $2;',
    [name, collection_id]
  );
  return result.rows[0]; // Return the label or null if not found
};

module.exports = {
  createTable,
  create,
  getById,
  update,
  remove,
  getAllByCollectionId,
  getByNameAndCollectionId,
};