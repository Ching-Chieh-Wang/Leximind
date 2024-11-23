'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import ErrorMsg from '@/components/Msg/ErrorMsg';
import SuccessMsg from '@/components/Msg/SuccessMsg';
import Image from 'next/image';
import FormButton from '@/components/buttons/FormButton';
import GoogleIcon from '@/components/icons/Google';

const ProfilePage = () => {
  const { data: session, status,update } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [image, setImage] = useState(session?.user?.image || '/assets/images/logo.jpg');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (session) {
      setUsername(session.user.username);
      setEmail(session.user.email);
      setImage(session.user.image || '/assets/images/logo.jpg')
    }
  }, [session, status]);

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});
    setSuccessMessage(null);
    try {
      if (session.user.username == username && session.user.email == email) {
        setSuccessMessage('Profile updated successfully!');
        return;
      }
      const res = await fetch('/api/protected/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, image }),
      });


      if (!res.ok) {
        const data = await res.json();
        if (res.status === 400 && data.errors) {
          // Handle field-specific errors
          const errors = {};
          data.errors.forEach((error) => {
            if (!errors[error.path]) {
              errors[error.path] = error.msg; // Store only the first error for each field
            }
          });
          setFieldErrors(errors);
        } else {
          // Handle general errors
          setFieldErrors({ general: data.message || 'Registration failed. Please try again.' });
        }
        return;
      }

      // Update the session with the new user information
      await update({ user: { username, email, image } });

      // Handle profile image upload if there's a new one
      if (newImage) {
        const formData = new FormData();
        formData.append('image', newImage);
        const uploadResponse = await fetch('/api/user/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          setFieldErrors({ general: uploadData.message || 'Image upload failed. Please try again.' });
          return;
        }
      }

      setSuccessMessage('Profile updated successfully!');
      router.refresh(); // Refresh to reflect updates
    } catch (error) {
      console.error(error)
      setFieldErrors({ general: 'Something went wrong. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <Card type='form' title="Public Profile">
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Image
            className="object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 p-1 rounded-full ring-2 ring-indigo-300 hover:ring-indigo-500"
            src={image}
            alt="Image"
            width={160}
            height={160}
          />
          <div className="flex flex-col space-y-5 sm:ml-8">
            <label className="block">
              <input
                type="file"
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                className="p-3 text-base font-medium text-indigo-100 bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900"
              >
                Change picture
              </button>
            </label>
            <button
              type="button"
              onClick={() => setImage('/default-profile.png')}
              className="p-3 text-base font-medium text-indigo-900 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100"
            >
              Delete picture
            </button>
          </div>
        </div>

        {successMessage && <SuccessMsg>{successMessage}</SuccessMsg>}
        {fieldErrors.general && <ErrorMsg>{fieldErrors.general}</ErrorMsg>}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
            placeholder={session?.user?.username}
          />
          {fieldErrors.username && <ErrorMsg>{fieldErrors.username}</ErrorMsg>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Email
          </label>
          {session?.user?.login_provider === 'google' ? (
            <div className="flex items-center justify-center space-x-2 rounded-md border border-gray-300 p-2 my-2 bg-gray-50">
              <GoogleIcon className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 text-sm">{email}</span>
            </div>
          ) : (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
              placeholder={session?.user?.email}
            />
          )}
          {fieldErrors.email && <ErrorMsg>{fieldErrors.email}</ErrorMsg>}
        </div>

        <FormButton isLoading={isLoading} loadingText="Saving...">
          Save
        </FormButton>
      </Card>
    </form>
  );
};

export default ProfilePage;