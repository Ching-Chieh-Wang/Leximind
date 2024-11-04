import { NextResponse } from 'next/server';

export async function PUT(req) {
  // Get the data from the request body
  const { username, email, image } = await req.json();

  // Retrieve the access token from headers
  const token = req.headers.get('Authorization');

  try {
    // Send the update request to your backend
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token, // Pass the token here
      },
      body: JSON.stringify({ username, email, image }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}