// models/word.js
const db = require('../db/db');

/**
 * Create the words table
 */
const createTable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    collection_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    img_path TEXT,
    is_memorized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id, collection_id)
  );

  CREATE OR REPLACE VIEW collection_word_stats AS
  SELECT 
      collections.id AS collection_id,
      COUNT(words.id) AS word_cnt,
      COUNT(words.id) FILTER (WHERE words.is_memorized = FALSE) AS not_memorized_cnt
  FROM 
      collections
  LEFT JOIN 
      words ON collections.id = words.collection_id
  GROUP BY 
      collections.id;

  CREATE INDEX IF NOT EXISTS idx_words_collection ON words (collection_id);
  CREATE INDEX IF NOT EXISTS idx_words_collection_memorized_false ON words (collection_id) WHERE is_memorized = FALSE;
`;
  await db.query(query);
  console.log('Collections table and collection_word_stats view created successfully');
};
/**
 * Create a new word
 */

const create = async ({ user_id, collection_id, name, description, img_path, label_ids }) => {
  const query = `
    WITH new_word AS (
      INSERT INTO words (collection_id, name, description, img_path)
      SELECT $2, $3, $4, $5
      FROM collections
      WHERE id = $2 AND user_id = $1 
      RETURNING id
    ), insert_labels AS (
      INSERT INTO word_labels (word_id, label_id)
      SELECT new_word.id, unnest($6::int[])
      FROM new_word
      WHERE array_length($6::int[], 1) > 0
    )
    SELECT new_word.id FROM new_word;
  `;
  const result = await db.query(query, [user_id, collection_id, name, description, img_path, label_ids]);
  return result.rows[0]?.id || null;
};
  

/**
 * Remove a word by ID with ownership validation through collection's user_id
 */
const remove = async (user_id, collection_id, word_id) => {
  const query = `
    DELETE FROM words
    WHERE id = $3
      AND collection_id = $2
      AND EXISTS (
        SELECT 1 FROM collections WHERE id = $2 AND user_id = $1
      )
    RETURNING id;
  `;
  const result = await db.query(query, [user_id, collection_id, word_id]);
  return result.rowCount > 0; // Returns true if a row was deleted, false otherwise
};


/**
 * Update a word by ID with ownership validation through collection's user_id
 */
const update = async (user_id, collection_id, word_id, name, description, img_path) => {
  const query = `
    UPDATE words
    SET 
      name = COALESCE($1, name), 
      description = COALESCE($2, description), 
      img_path = COALESCE($3, img_path)
    WHERE id = $4
      AND collection_id = $5
      AND EXISTS (
        SELECT 1 FROM collections WHERE id = $5 AND user_id = $1
      )
    RETURNING id;
  `;
  const result = await db.query(query, [name, description, img_path, word_id, collection_id, user_id]);
  return result.rows[0] || null; // Returns the updated word's id if successful, otherwise null
};

const getPaginated = async (user_id, collection_id, limit = 50, offset = 0) => {
  const query = `
    SELECT 
      w.id,
      w.name,
      w.description,
      w.img_path,
      w.is_memorized,
      COALESCE(
        array_agg(DISTINCT wl.label_id), '{}'
      ) AS label_ids
    FROM words w
    LEFT JOIN word_labels wl ON w.id = wl.word_id
    WHERE w.collection_id IN (
      SELECT id FROM collections WHERE id = $2 AND user_id = $1
    )
    GROUP BY w.id
    ORDER BY w.created_at DESC
    LIMIT $3 OFFSET $4;
  `;
  const result = await db.query(query, [user_id, collection_id, limit, offset]);
  return result.rows;
};

const getPaginatedByLabelId = async (user_id, collection_id, label_id, limit = 50, offset = 0) => {
  const query = `
    SELECT 
      w.id,
      w.name,
      w.description,
      w.img_path,
      w.is_memorized,
      COALESCE(array_agg(DISTINCT wl2.label_id), '{}') AS label_ids
    FROM words w
    JOIN word_labels wl ON w.id = wl.word_id AND wl.label_id = $3
    LEFT JOIN word_labels wl2 ON w.id = wl2.word_id
    WHERE w.collection_id IN (
      SELECT id FROM collections WHERE id = $2 AND user_id = $1
    )
    GROUP BY w.id
    ORDER BY w.created_at DESC
    LIMIT $4 OFFSET $5;
  `;
  const result = await db.query(query, [user_id, collection_id, label_id, limit, offset]);
  return result.rows;
};


/**
 * Get paginated words by searching prefix within a collection with ownership validation
 */
const getPaginatedBySearchingPrefix = async (user_id, collection_id, searchQuery, limit = 50, offset = 0) => {
  const formattedQuery = `${searchQuery}%`; // Prefix match

  const query = `
    SELECT 
      w.id,
      w.name,
      w.description,
      w.img_path,
      w.is_memorized,
      COALESCE(
        array_agg(DISTINCT l.id) FILTER (WHERE l.id IS NOT NULL), '{}'
      ) AS label_ids
    FROM words w
    LEFT JOIN word_labels wl ON w.id = wl.word_id
    LEFT JOIN labels l ON wl.label_id = l.id
    WHERE EXISTS (
        SELECT 1 FROM collections WHERE id = $1 AND user_id = $3
      )
      AND w.collection_id = $1
      AND w.name ILIKE $2 
    GROUP BY w.id
    ORDER BY w.created_at DESC
    LIMIT $4 OFFSET $5;
  `;
  const result = await db.query(query, [collection_id, formattedQuery, user_id, limit, offset]);
  return result.rows;
};

/**
 * Toggle the is_memorized status of a word with ownership validation
 */
const changeIsMemorizedStatus = async (user_id, collection_id, word_id) => {
  const query = `
    UPDATE words
    SET is_memorized = NOT is_memorized 
    WHERE 
      EXISTS (
        SELECT 1 FROM collections WHERE id = $2 AND user_id = $1
      )
      AND id = $3
      AND collection_id = $2 
    RETURNING is_memorized;
  `;
  const result = await db.query(query, [user_id, collection_id, word_id]);
  
  // Return the updated is_memorized status or null if no row was updated
  return result.rows[0]?.is_memorized || null;
};

module.exports = {
  createTable,
  create,
  remove,
  update,
  getPaginated,
  getPaginatedByLabelId,
  getPaginatedBySearchingPrefix,
  changeIsMemorizedStatus
};