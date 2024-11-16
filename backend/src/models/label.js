const db = require('../db/db');

// Function to create the labels table
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS labels (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      collection_id INT REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (collection_id, name),
      UNIQUE (id, collection_id)
    );
  `;
  await db.query(query);
  console.log('Labels table created successfully');
};

// Function to create a new label with ownership validation
const create = async ({ user_id, collection_id, name }) => {
  const query = `
    INSERT INTO labels (name, collection_id)
    VALUES (
      $3,
      (SELECT id FROM collections WHERE id = $2 AND user_id = $1)
    )
    RETURNING id;
  `;
  const result = await db.query(query, [user_id, collection_id, name]);
  return result.rows[0] || null; // Returns the newly created label if successful, or null if not
};

// Function to update a label by ID with ownership validation
const update = async (user_id, collection_id, label_id, name) => {
  const query = `
    UPDATE labels 
    SET name = $4
    WHERE collection_id = (
        SELECT id FROM collections WHERE id = $2 AND user_id = $1
      )
      AND id=$3
    RETURNING id;
  `;
  const result = await db.query(query, [user_id, collection_id, label_id, name]);
  return result.rowCount > 0; // Returns true if a row was updated, false otherwise
};

// Function to remove a label by ID with ownership validation
const remove = async (user_id, collection_id, label_id) => {
  const query = `
    DELETE FROM labels
    WHERE collection_id = (
        SELECT id FROM collections WHERE id = $2 AND user_id = $1
      )
      AND id=$3
    RETURNING id;
  `;
  const result = await db.query(query, [user_id, collection_id, label_id]);
  return result.rowCount > 0; // Returns true if a row was deleted, false otherwise
};

// Function to get all labels by collection ID
const getAllByCollectionId = async (user_id, collection_id) => {
  const query = `
    SELECT id, name 
    FROM labels 
    WHERE collection_id = (
      SELECT id FROM collections WHERE id = $2 AND user_id = $1
    )
    ORDER BY name ASC;
  `;
  const result = await db.query(query, [user_id, collection_id]);
  return result.rows; // Return the list of labels
};

module.exports = {
  createTable,
  create,
  update,
  remove,
  getAllByCollectionId
};