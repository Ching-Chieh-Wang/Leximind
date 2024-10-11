const { Pool } = require('pg');
require('dotenv').config(); // Ensure environment variables are loaded

// Create a new Pool instance
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // Adjust SSL settings if needed
});

// Function to connect to the database and initialize tables
const connectToDatabase = async () => {
  try {
    const user = require('../models/user');
    const label = require('../models/label');
    const word = require('../models/word');
    const word_label = require('../models/word_label');
    
    await pool.connect(); // Ensure proper connection
    
    await user.createTable();  // Create user table if it doesn't exist
    await label.createTable(); // Create label table if it doesn't exist
    await word.createTable();  // Create word table if it doesn't exist
    await word_label.createTable();  // Create word_label table if it doesn't exist
    
    console.log('Database connected and tables initialized');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

// Function to execute a query
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};

module.exports = { connectToDatabase, query, pool };  // Export the pool instead of client