// /frontend/app/api/health/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  console.log('💚 Frontend: health received');

  // Send another health check back to the backend
  const backendUrl = `${process.env.BACKEND_API_URL}/api/health`;

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'received' }),
    });

    if (response.ok) {
    } else {
      console.error(' Frontend: Failed to send health check to backend:', response.statusText);
    }
  } catch (error) {
    console.error(' Frontend: Error sending health check to backend:', error.message);
  }

  return NextResponse.json( { status: 200 });
}