// /backend/src/routes/health.js
const express = require('express');
const fetch = require('node-fetch'); // Add this line at the top
const router = express.Router();
const db = require('../config/db');

let intervalId; // Store the interval ID to prevent multiple intervals

const sendHealthCheck = async () => {
  try {
    db.query("SELECT 1");
    const frontendUrl = `${process.env.FRONTEND_URL}/api/health`;
    const response = await fetch(frontendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'active' }),
    });

    if (response.ok) {
    } else {
      console.error(' Health check failed:', response.statusText);
    }
  } catch (error) {
    console.error(' Error sending health check:', error.message);
  }
};

const startHealthCheckInterval = () => {
  if (!intervalId) {
    sendHealthCheck(); // Send the first request immediately

    // Send health check every 14 minutes (14 * 60 * 1000 ms)
    intervalId = setInterval(sendHealthCheck, 14 * 60 * 1000);
  }
};

router.post('/', (req, res) => {
  res.sendStatus(200); // Responds with HTTP 200 and no content
});

module.exports = {router,startHealthCheckInterval};