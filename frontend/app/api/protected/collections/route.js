import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/authOptions';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    const res = await fetch(`${BACKEND_API_URL}/api/collections`, {
      headers: {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    const result=await res.json();

    return NextResponse.json(result, { status: res.status })
  
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const body=await req.json();
    const res = await fetch(`${BACKEND_API_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(body),
    });
    const result=await res.json();

    // Return the response from the backend API
    return NextResponse.json(result,{status:res.status});
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions); // Authenticate the user session
    const body = await req.json(); // Parse the request body

    const res = await fetch(`${BACKEND_API_URL}/api/collections`, {
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

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions); // Authenticate the user session
    const body = await req.json(); // Parse the request body

    const res = await fetch(`${BACKEND_API_URL}/api/collections`, {
      method: 'DELETE',
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