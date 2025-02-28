import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function PUT(req) {
  try {
    // Retrieve the session to access the token
    const session = await getServerSession(authOptions);
    const body=await req.json();

    // Forward the request to the backend with the token and parsed body
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(body), // Forwarding parsed request body
    });
    const data = await res.json();
    // Return the backend response data and status
    return NextResponse.json(data,{ status: res.status });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}