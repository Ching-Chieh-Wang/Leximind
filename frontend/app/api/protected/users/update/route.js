import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(req) {
  try {
    // Retrieve the session to access the token
    const session = await getServerSession(authOptions);

    // Check if the session or token is available
    if (!session || !session.user?.accessToken) {
      console.error("Unauthorized access - session or token missing");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }


    // Forward the request to the backend with the token and parsed body
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(await req.json()), // Forwarding parsed request body
    });

    // Parse the JSON response from the backend
    const data = await res.json();

    // Return the backend response data and status
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}