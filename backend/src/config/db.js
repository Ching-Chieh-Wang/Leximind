const { Pool } = require('pg');
require('dotenv').config(); // Ensure environment variables are loaded


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // Adjust SSL settings if needed
});

let client;


// Function to connect to the database and initialize tables
const connectToDatabase = async () => {
  try {
    const user = require('../models/user');
    const label = require('../models/label');
    const word = require('../models/word');
    const word_label=require('../models/word_label');
    client = await pool.connect(); // Ensure proper connection
    await user.createTable(); // Create tables if they do not exist
    await label.createTable(); // Create tables if they do not exist
    await word.createTable(); // Create tables if they do not exist
    await word_label.createTable(); // Create tables if they do not exist
    console.log('Database connected');
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

module.exports = { connectToDatabase, query, client };
