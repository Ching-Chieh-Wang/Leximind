

export const updateProfile = async (username, email) => {
  const res = await fetch('/api/protected/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email }),
  });

  if (!res.ok) {
    const data = await res.json();  // Parse JSON first
    const error = new Error();
    error.data = data;  // Attach parsed JSON to the error object
    throw error;
  }
};

export const updateImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);  // Append the image file to FormData

  const res = await fetch('/api/protected/users/image', {
    method: 'PUT',
    body: formData,  // Use FormData for file uploads
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(data.message)
    const error = new Error("Failed to upload image, please try again later.");
    error.data = data;
    throw error;
  }

  return data.image;  // Return the new image URL
};

