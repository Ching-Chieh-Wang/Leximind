import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // <--- Add this line

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const query = searchParams.get('query');

    // Validate query parameters
    if (page === null || limit === null || query === null) {
      return NextResponse.json(
        { message: 'Both "page" and "limit" and "query" must be provided.' },
        { status: 400 }
      );
    }

    const backendUrl = `${process.env.BACKEND_API_URL}/api/collections/search?query=${query}&page=${page}&limit=${limit}`;
    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}