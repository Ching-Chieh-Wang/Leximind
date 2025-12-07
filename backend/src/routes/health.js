// /backend/src/routes/health.js
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const db = require('../config/db');
require('dotenv').config(); // ✅ load credentials from .env

let intervalId;

// Helper: authenticate with Aiven
const authenticateAiven = async () => {
  try {
    const response = await fetch('https://console.aiven.io/v1/userauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.AIVEN_EMAIL,
        password: process.env.AIVEN_PASSWORD,
        tenant: 'aiven',
      }),
    });

    if (!response.ok) throw new Error(`Auth failed: ${response.statusText}`);
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Aiven auth error:', error.message);
    return null;
  }
};

// Helper: delete inactivity alerts
const deleteFreeServiceAlerts = async (token) => {
  try {
    const response = await fetch(
      'https://console.aiven.io/v1/console/user/free-service-inactivity-alerts',
      {
        method: 'DELETE',
        headers: {
          Authorization: `aivenv1 ${token}`,
        },
      }
    );
    if (!response.ok) {
      console.error('Delete failed:', response.statusText);
    } else {
      console.log('Successfully deleted inactivity alerts.');
    }
  } catch (error) {
    console.error('Error deleting inactivity alerts:', error.message);
  }
};

const sendHealthCheck = async () => {
  try {
    const frontendUrl = `${process.env.FRONTEND_URL}/api/health`;
    const response = await fetch(frontendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' }),
    });
    if (!response.ok) {
      console.error('Health check failed:', response.statusText);
    }
    console.log("Health checked success to frontend")
  } catch (error) {
    console.error('Health check request error:', error.message);
  }

  // Run Aiven cleanup regardless of frontend request result
  const token = await authenticateAiven();
  if (token) await deleteFreeServiceAlerts(token);
};

const startHealthCheckInterval = () => {
  if (!intervalId) {
    sendHealthCheck();
    intervalId = setInterval(sendHealthCheck, 5 * 60 * 1000);
  }
};

router.post('/', (req, res) => res.sendStatus(200));

module.exports = { router, startHealthCheckInterval };