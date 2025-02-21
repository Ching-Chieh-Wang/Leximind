import { NextResponse } from 'next/server';
import https from 'https';

// Interval ID to avoid duplicate intervals
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
  console.log('hihi'); // This should show up now
  if (!intervalId) {
    // Send the first request immediately
    sendHealthCheck();

    // Send every 14 minutes (14 * 60 * 1000 ms)
    intervalId = setInterval(sendHealthCheck, 14 * 60 * 1000);
    console.log('Health check interval started');
  }
};

// ✅ Self-Request to Start Interval on Server Start
(async () => {
  try {
    const frontendUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/health`;

    console.log('Triggering self-request to:', frontendUrl);

    // Use Node.js https module to avoid CORS issues
    https.get(frontendUrl, (res) => {
      console.log('Self-request status:', res.statusCode);
    }).on('error', (error) => {
      console.error('Error in self-request:', error);
    });
  } catch (error) {
    console.error('Failed to trigger self-request:', error);
  }
})();

export async function GET() {
  // This will trigger the interval if it's not already running
  startHealthCheckInterval();
  return NextResponse.json({ message: 'Health check interval is running' }, { status: 200 });
}