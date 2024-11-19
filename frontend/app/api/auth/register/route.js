// app/api/register/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { username, email, password } = await req.json();

  try {
    // Forward the request directly to the backend API
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    // Convert the backend response into NextResponse to return it
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}