const db = require('../config/db');

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
      RETURNING id AS id
    ), insert_labels AS (
      INSERT INTO word_labels (word_id, label_id)
      SELECT new_word.id, unnest($6::int[])
      FROM new_word
      WHERE array_length($6::int[], 1) > 0
    )
    SELECT id FROM new_word;
  `;
  const result = await db.query(query, [user_id, collection_id, name, description, img_path, label_ids]);
  return result.rows[0] || null;
};

/**
 * Remove a word by ID with ownership validation through collection's user_id
 */
const remove = async (user_id, collection_id, word_id) => {
  const query = `
    DELETE FROM words
    WHERE id = $3
    AND collection_id = (
      SELECT id FROM collections WHERE id = $2 AND user_id = $1
    )
    RETURNING id;
  `;
  const result = await db.query(query, [user_id, collection_id, word_id]);

  return result.rowCount > 0;
};

/**
 * Update a word by ID with ownership validation through collection's user_id
 */
const update = async (user_id, collection_id, word_id, name, description, img_path) => {
  const query = `
    UPDATE words
    SET 
      name = $4, 
      description = $5, 
      img_path = $6
    WHERE id = $3
      AND collection_id = (
        SELECT id FROM collections WHERE id = $2 AND user_id = $1
      )
    RETURNING id;
  `;
  const result = await db.query(query, [user_id, collection_id, word_id, name, description, img_path]);
  return result.rowCount > 0; // Returns true if at least one row was updated
};


/**
 * Get all words for a collection by label ID
 */
const getByLabelId = async (user_id, collection_id, label_id) => {
  const query = `
    SELECT 
      array_agg(w.id ORDER BY w.created_at DESC) AS word_ids
    FROM words w
    JOIN word_labels wl ON w.id = wl.word_id AND wl.label_id = $3
    WHERE w.collection_id = (
      SELECT c.id FROM collections c WHERE c.id = $2 AND c.user_id = $1
    )
    GROUP BY w.collection_id;
  `;
  const result = await db.query(query, [user_id, collection_id, label_id]);

  return result.rows[0] || { word_ids: [] };
};

/**
 * Get all unmemorized words for a collection 
 */
const getUnmemorized = async (user_id, collection_id) => {
  const query = `
    SELECT 
      array_agg(w.id ORDER BY w.created_at DESC) AS word_ids
    FROM words w
    WHERE w.collection_id = (
      SELECT c.id FROM collections c WHERE c.id = $2 AND c.user_id = $1
    )
    AND w.is_memorized = FALSE
    GROUP BY w.collection_id;
  `;
  const result = await db.query(query, [user_id, collection_id]); 

  return result.rows[0] || { word_ids: [] };
};


/**
 * Search words by prefix within a collection
 */
const searchByPrefix = async (user_id, collection_id, searchQuery) => {
  const formattedQuery = `%${searchQuery}%`;
  const query = `
    SELECT 
      array_agg(w.id ORDER BY w.created_at DESC) AS word_ids
    FROM words w
    WHERE w.collection_id = (
      SELECT id FROM collections WHERE id = $1 AND user_id = $3
    )
    AND w.name ILIKE $2
    GROUP BY w.collection_id;
  `;
  const result = await db.query(query, [collection_id, formattedQuery, user_id]);
  return result.rows[0]|| {word_ids:[]};
};

/**
 * Toggle the is_memorized status of a word
 */
const changeIsMemorizedStatus = async (user_id, collection_id, word_id, is_memorized) => {
  const query = `
    UPDATE words
    SET is_memorized = $4 
    WHERE collection_id = (
        SELECT id FROM collections WHERE id = $2 AND user_id = $1
      )
      AND id = $3
    RETURNING id ;
  `;
  const result = await db.query(query, [user_id, collection_id, word_id, is_memorized]);
  return result.rows[0];
};

module.exports = {
  createTable,
  create,
  remove,
  update,
  getByLabelId,
  getUnmemorized,
  searchByPrefix,
  changeIsMemorizedStatus
};