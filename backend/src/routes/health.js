// /backend/src/routes/health.js
const express = require('express');
const fetch = require('node-fetch'); // Add this line at the top
const router = express.Router();

let intervalId; // Store the interval ID to prevent multiple intervals

const sendHealthCheck = async () => {
  try {
    const frontendUrl = `${process.env.FRONTEND_URL}/api/health`;
    const response = await fetch(frontendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'active' }),
    });

    if (response.ok) {
      console.log('✅ Health check sent to frontend successfully');
    } else {
      console.error('❌ Health check failed:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error sending health check:', error.message);
  }
};

const startHealthCheckInterval = () => {
  if (!intervalId) {
    console.log('🔥 Starting Health Check Interval...');
    sendHealthCheck(); // Send the first request immediately

    // Send health check every 14 minutes (14 * 60 * 1000 ms)
    intervalId = setInterval(sendHealthCheck, 14 * 60 * 1000);
    console.log('✅ Health check interval started');
  }
};

router.post('/', (req, res) => {
  console.log('health received');
  res.sendStatus(200); // Responds with HTTP 200 and no content
});

module.exports = {router,startHealthCheckInterval};