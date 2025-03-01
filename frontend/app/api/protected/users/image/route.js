import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function PUT(req) {
  try {
    // Retrieve the session to access the token
    const session = await getServerSession(authOptions);

    // Parse the incoming FormData
    const body = await req.json(); // Parse the request body
    // Forward the request to the backend with the token and FormData
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/image`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'  // Required for JSON
      },
      body: JSON.stringify(body), // Send the body as a JSON string
    });

    const data = await res.json();
    // Return the backend response data and status
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}