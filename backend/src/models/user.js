const db = require('../db/db');

const createTable = async () => {
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
};

const getPaginated = async (limit = 10, offset = 0) => {
  const result = await db.query('SELECT * FROM users LIMIT $1 OFFSET $2;', [limit, offset]);
  return result.rows;
};

// Get a user by ID without the password
const getByEmail = async (email) => {
  const result = await db.query('SELECT id, username, email, role, created_at FROM users WHERE email = $1;', [email]);
  return result.rows[0];  // This will return the user without the password
};

// Get a user by ID without the password
const getById = async (id) => {
  const result = await db.query('SELECT id, username, email, role, created_at FROM users WHERE id = $1;', [id]);
  return result.rows[0];  // This will return the user without the password
};

// Get a user with password by email
const getUserWithPasswordByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1;', [email]);
  return result.rows[0];  // This will return only the password
};

const create = async (username, email, hashedPassword, role = 'user') => {
  const result = await db.query(
    'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id,username,email,role;',
    [username, email, hashedPassword, role]
  );
  return result.rows[0];
};


const update = async (userId, username, email) => {
  const result = await db.query(
    `UPDATE users 
      SET username = $1, 
          email = $2
      WHERE id = $3 
      RETURNING id, username, email, role;`,
    [username, email, userId]
  );
  
  return result.rows[0]; // Return the updated user without the password
};


const remove = async (id) => {
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);
  return result.rows[0]; 
};



module.exports = { createTable, getPaginated, getById, getByEmail, getUserWithPasswordByEmail, create, update, remove };
