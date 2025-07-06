
const proccessImg = async (image) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
  formData.append('public_id', `custom_name_${Date.now()}`); // Optional: Custom name for the file
  formData.append('api_key', process.env.CLOUDINARY_API_KEY); // Optional

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Cloudinary upload failed:', data);
    throw new Error(data.message || 'Failed to upload image');
  }
  console.log('Cloudinary upload successful:', data);

  const transformation = 'w_200,h_200,c_fill,g_auto,q_auto,f_auto';
  const transformUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/v${data.version}/${data.public_id}.${data.format}`;
  return transformUrl;
};
export default proccessImg;
