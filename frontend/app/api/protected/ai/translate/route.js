import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import {Credentials, Translator} from "@translated/lara";

const credentials = new Credentials(process.env.LARA_ACCESS_KEY_ID, process.env.LARA_ACCESS_KEY_SECRET)
const lara = new Translator(credentials);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { text, source = 'en-US', target } = await req.json();


    if (!text || !target) {
      return NextResponse.json({ message: 'text and target are required' }, { status: 400 });
    }

    const res = await lara.translate(text, source, target);
    return NextResponse.json({ translation: res.translation }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
