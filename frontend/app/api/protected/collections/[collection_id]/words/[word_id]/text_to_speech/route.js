import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function GET(req, { params }) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/collections/${params.collection_id}/words/${params.word_id}/text_to_speech`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}