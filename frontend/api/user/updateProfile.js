export const updateProfile = async (username, email,image,isNewImage) => {
  const res = await fetch('/api/protected/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email,image,isNewImage }),
  });

  if (!res.ok) {
    const data = await res.json();  // Parse JSON first
    const error = new Error();
    error.data = data;  // Attach parsed JSON to the error object
    throw error;
  }
};
