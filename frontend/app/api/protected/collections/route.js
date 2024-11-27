import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/authOptions';


export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/collections`, {
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
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/collections`, {
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
