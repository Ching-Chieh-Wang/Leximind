// models/word.js
const db = require('../db/db');

// Function to create the words table
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS words (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      collection_id INT REFERENCES collections(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      img_path TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.query(query);
  console.log('Words table created successfully');
};

// Function to create a new word with transaction handling
const create = async ({ name, description, img_path, user_id, collection_id, label_ids }) => {
  return await db.executeTransaction(async (client) => {
    // Validate label_ids if provided
    if (Array.isArray(label_ids) && label_ids.length > 0) {
      // Check that all provided label_ids belong to the user and are in the specified collection
      const labelCheckResult = await client.query(
        'SELECT id FROM labels WHERE id = ANY($1) AND user_id = $2 AND collection_id = $3;',
        [label_ids, user_id, collection_id]
      );

      const existingLabelIds = labelCheckResult.rows.map(row => row.id);
      const invalidLabelIds = label_ids.filter(id => !existingLabelIds.includes(id));

      // If there are any invalid labels, throw an error to roll back the transaction
      if (invalidLabelIds.length > 0) {
        throw new Error(`Labels not owned by the user or not in the collection: ${invalidLabelIds.join(', ')}`);
      }
    }

    // Insert the new word
    const result = await client.query(
      `INSERT INTO words (name, description, img_path, user_id, collection_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [name, description, img_path, user_id, collection_id]
    );

    const newWord = result.rows[0];

    // Manage label associations if label_ids are provided
    if (Array.isArray(label_ids) && label_ids.length > 0) {
      for (const label_id of label_ids) {
        await client.query(
          `INSERT INTO word_labels (word_id, label_id)
           VALUES ($1, $2)
           ON CONFLICT (word_id, label_id) DO NOTHING;`,
          [newWord.id, label_id]
        );
      }
    }

    return newWord;
  });
};

// Function to update a word by ID with transaction handling
const update = async (id, { name, description, img_path }) => {
    // Update the word
    const result = await db.query(
      `UPDATE words SET name = $1, description = $2, img_path = $3 WHERE id = $4 RETURNING *;`,
      [name,description ,img_path,id]
    );
    return result.rows[0];
};

// Function to remove a word by ID with transaction handling
const remove = async (id) => {
    // Delete the word and return the deleted word's details
    const result = await db.query(
      'DELETE FROM words WHERE id = $1 RETURNING collection_id, order_index;',
      [id]
    );

    return result.rows[0];
};

// Function to get paginated words by collection ID
const getPaginated = async (collection_id, offset = 0, limit = 50) => {
  const result = await db.query(
    `SELECT words.*,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', labels.id,
            'name', labels.name
          )
        ) FILTER (WHERE labels.id IS NOT NULL), '[]'
      ) AS labels
      FROM words
      LEFT JOIN word_labels ON words.id = word_labels.word_id
      LEFT JOIN labels ON word_labels.label_id = labels.id
      WHERE words.collection_id = $1
      GROUP BY words.id
      ORDER BY words.created_at
      LIMIT $2 OFFSET $3;`,
    [collection_id, limit, offset]
  );
  return result.rows;
};


// Function to get paginated words by collection ID and label ID
const getPaginatedByLabelId = async (collection_id, label_id, offset = 0, limit = 50) => {
  const result = await db.query(
    `SELECT words.*,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', labels.id,
            'name', labels.name
          )
        ) FILTER (WHERE labels.id IS NOT NULL), '[]'
      ) AS labels
      FROM words
      JOIN word_labels ON words.id = word_labels.word_id
      LEFT JOIN labels ON word_labels.label_id = labels.id
      WHERE words.collection_id = $1 AND word_labels.label_id = $2
      GROUP BY words.id
      ORDER BY words.created_at
      LIMIT $3 OFFSET $4;`,
    [collection_id, label_id, limit, offset]
  );
  return result.rows;
};



// Function to search words by prefix within a specific collection
const searchByPrefix = async (collection_id, prefix) => {
  const result = await db.query(
    `SELECT * FROM words 
      WHERE collection_id = $1 
      AND (name ILIKE $2 OR description ILIKE $2)
      ORDER BY created_at;`,
    [collection_id, `${prefix}%`]
  );
  return result.rows; // Return the list of words that match the prefix in either name or description
};

// Function to get a word by ID
const getById = async (id) => {
  const result = await db.query('SELECT * FROM words WHERE id = $1;', [id]);
  return result.rows[0];
};


module.exports = {
  createTable,
  create,
  update,
  remove,
  searchByPrefix,
  getPaginated,
  getPaginatedByLabelId,
  getById
};