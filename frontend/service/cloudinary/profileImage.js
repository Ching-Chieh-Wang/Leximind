const proccessImg = async (image) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  formData.append('public_id', `custom_name_${Date.now()}`); // Optional: Custom name for the file
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY); // Optional


  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  const transformation = 'w_200,h_200,c_fill,g_auto,q_auto,f_auto';
  const transformUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/v${result.version}/${result.public_id}.${result.format}`;
  return transformUrl;
};
export default proccessImg;
