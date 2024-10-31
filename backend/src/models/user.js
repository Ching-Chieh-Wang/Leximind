const db = require('../db/db');

const createTable = async () => {
  const result = await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(50) NOT NULL,
      email VARCHAR(60) NOT NULL UNIQUE,
      password VARCHAR(255),
      role VARCHAR(20),
      image TEXT DEFAULT NULL,
      login_provider VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('Users table created successfully');
  return result;
};

// Create a new user
const create = async (username, email, login_provider, role, hashedPassword = '', image = '') => {
  const result = await db.query(
    'INSERT INTO users (username, email, password, role, login_provider, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, role, login_provider, image;',
    [username, email, hashedPassword, role, login_provider, image]
  );
  return result.rows[0];
};

// Get user by email without password
const getByEmail = async (email) => {
  const result = await db.query('SELECT id, username, email, role, image, login_provider, created_at FROM users WHERE email = $1;', [email]);
  return result.rows[0];
};

// Get user by ID without password
const getById = async (id) => {
  const result = await db.query('SELECT id, username, email, role, image, login_provider, created_at FROM users WHERE id = $1;', [id]);
  return result.rows[0];
};

// Get user with password by email (for login validation)
const getUserWithPasswordByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1;', [email]);
  return result.rows[0];
};

// Update user's username, email, and image
const update = async (userId, username, email, image) => {
  const result = await db.query(
    `UPDATE users 
      SET username = $1, 
          email = $2,
          image = $3
      WHERE id = $4 
      RETURNING id, username, email, role, image, login_provider;`,
    [username, email, image, userId]
  );
  
  return result.rows[0] || null; // Return updated data, or null if no rows updated
};

// Remove user by ID
const remove = async (id) => {
  const result = await db.query(
    'DELETE FROM users WHERE id = $1 RETURNING *;',
    [id]
  );

  return result.rowCount > 0; // Return true if deletion was successful, false otherwise
};

module.exports = { createTable, create, getByEmail, getById, getUserWithPasswordByEmail, update, remove };