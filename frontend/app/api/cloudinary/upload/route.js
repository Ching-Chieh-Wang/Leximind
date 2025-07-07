import { NextResponse } from 'next/server';

export async function POST(req) {
  // Parse the incoming form data
  const formData = await req.formData();
  const file = formData.get('image');
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  // Fix: Check env vars before using them, and return early if missing
  if (!uploadPreset || !apiKey || !cloudName) {
    return NextResponse.json({ error: 'Missing Cloudinary environment variables' }, { status: 500 });
  }

  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('upload_preset', uploadPreset);
  uploadFormData.append('public_id', `custom_name_${Date.now()}`); // Optional: Custom name for the file
  uploadFormData.append('api_key', apiKey); // Optional

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: uploadFormData,
  });


  const data = await response.json();


  const transformation = 'c_thumb,g_face,h_200,w_200/r_max/f_auto'; 
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Cloudinary upload error:', errorText);
    return NextResponse.json({ error: 'Image upload failed', message: data }, { status: 500 });
  }

  const transformedImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/v${data.version}/${data.public_id}.${data.format}`;
  return NextResponse.json({ transformedImageUrl }, { status: 200 });
}