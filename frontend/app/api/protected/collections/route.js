import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/authOptions';


export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    // Validate query parameters
    if ((page !== null && limit === null) || (page === null && limit !== null)) {
      return NextResponse.json(
        { message: 'Both "page" and "limit" must be provided together.' },
        { status: 400 }
      );
    }

    // Construct the backend API URL with query parameters dynamically
    let backendUrl
    if(page==null&&limit==null) backendUrl=`${process.env.BACKEND_API_URL}/api/collections/`;
    else backendUrl=`${process.env.BACKEND_API_URL}/api/collections?page=${page}&limit=${limit}`

    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    const result = await res.json();

    return NextResponse.json(result, { status: res.status });
  } catch (error) {
    console.error(error);
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
