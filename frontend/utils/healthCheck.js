// /frontend/utils/healthCheck.js
let intervalId;

const sendHealthCheck = async () => {
  try {
    const backendUrl = `${process.env.BACKEND_API_URL}/health`;

    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'active' }),
    });

    if (res.ok) {
      console.log('Health check sent successfully');
    } else {
      console.error('Failed to send health check:', res.statusText);
    }
  } catch (error) {
    console.error('Error sending health check:', error);
  }
};

const startHealthCheckInterval = () => {
  console.log('🔥 Starting Health Check Interval...');
  if (!intervalId) {
    // Send the first request immediately
    sendHealthCheck();

    // Send every 14 minutes (14 * 60 * 1000 ms)
    intervalId = setInterval(sendHealthCheck, 14 * 60 * 1000);
    console.log('✅ Health check interval started');
  }
};

// ✅ Top-level call to start the interval on server start
startHealthCheckInterval();