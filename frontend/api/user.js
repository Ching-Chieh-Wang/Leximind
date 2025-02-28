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


export const updateImage = async (imageUrl) => {
  // Step 1: Upload image to Cloudinary and resize
  try {
    // Step 3: Pass the transformed URL to the backend
    const res = await fetch('/api/protected/users/image', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl:imageUrl }), 
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      const error = new Error("Failed to update image on the backend.");
      error.data = data;
      throw error;
    }

    return data.image;
  } catch (error) {
    console.error("Error during image upload:", error);
    throw new Error("Failed to upload image, please try again later.");
  }
};

