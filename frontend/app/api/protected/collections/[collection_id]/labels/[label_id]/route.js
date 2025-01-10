import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';


export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions); // Authenticate the user session
    const body = await req.json(); // Parse the request body

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/collections/${params.collection_id}/labels/${params.label_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`, // Add user token
      },
      body: JSON.stringify(body), // Send the body as a JSON string
    });

    const result = await res.json(); // Parse the backend response

    // Return the backend response
    return NextResponse.json(result, { status: res.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions); // Authenticate the user session

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/collections/${params.collection_id}/labels/${params.label_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`, // Add user token
      },
    });

    // Return the backend response
    return NextResponse.json({ status: res.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}