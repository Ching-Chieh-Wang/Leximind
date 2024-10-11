const db = require('../db/db');

const createTable = async () => {
  try {
    const result = await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(50) NOT NULL,
        email VARCHAR(60) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT NOW()  -- Automatically store creation time with timezone
      );
    `);
    console.log('Users table created successfully');
    return result;
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
};

const getPaginated = async (limit = 10, offset = 0) => {
  try {
    const result = await db.query('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching paginated users:', err);
    throw err;
  }
};

const getById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const getByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const create = async (username, email, hashedPassword, role = 'user') => {
  const result = await db.query(
    'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, email, hashedPassword, role]
  );
  return result.rows[0];
};


const update = async (userId, { username, email, password, role }) => {
  try {
    const result = await db.query(
      `UPDATE users 
       SET username = COALESCE($1, username), 
           email = COALESCE($2, email), 
           password = COALESCE($3, password),
           role = COALESCE($4, role)
       WHERE id = $5 
       RETURNING id, username, email, role`,
      [username, email, password, role, userId]
    );
    
    return result.rows[0]; // Return the updated user without the password
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};


const remove = async (id) => {
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0]; 
};



module.exports = { createTable, getPaginated, getById, getByEmail, create, update, remove };
