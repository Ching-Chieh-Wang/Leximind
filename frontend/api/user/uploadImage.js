



export default async function uploadImage(image) {
  const formData = new FormData();
  formData.append('image', image); 

  const res = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    console.error('Error uploading image:', res);
    throw new Error('Failed to upload image');
  }
  const data = await res.json();
  console.log('Image uploaded successfully:', data);
  return data.transformedImageUrl;
}