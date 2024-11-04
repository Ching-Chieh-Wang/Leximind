'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Page from '@/components/Page';
import ErrorMsg from '@/components/ErrorMsg';
import Image from 'next/image';

const ProfilePage = () => {
  const { data: session, update } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [profileImage, setProfileImage] = useState(session?.user?.image || '/assets/images/logo.jpg');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      setUsername(session.user.username);
      setEmail(session.user.email);
    }
  }, [session]);

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    try {
      // Include the token from the session
      const token = session?.accessToken;

      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass the token here
        },
        body: JSON.stringify({ username: username, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errors = {};
        if (data.errors) {
          data.errors.forEach((error) => {
            errors[error.path] = error.msg;
          });
          setFieldErrors(errors);
        } else {
          setFieldErrors({ general: data.message || 'Update failed. Please try again.' });
        }
        return;
      }

      // Update the session data with the new username and email
      await update({ username, email });

      // Handle profile image upload if there's a new one
      if (newProfileImage) {
        const formData = new FormData();
        formData.append('image', newProfileImage);
        await fetch('/api/user/upload-image', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here too, if needed
          },
          body: formData,
        });
      }
      update();
      router.refresh(); // Reload page to reflect updates
    } catch (error) {
      setFieldErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
      <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>

      <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
        <div className="transition-all opacity-50 -inset-px bg-gradient-to-r from-red-400 from-0% via-yellow-400 via-50% to-green-400 to-100% rounded-full blur-lg group-hover:opacity-100"></div>
        <Image
          className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
          src={profileImage}
          alt="Profile"
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
              className="py-3.5 px-7 text-base font-medium text-indigo-100 bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900"
            >
              Change picture
            </button>
          </label>
          <button
            type="button"
            onClick={() => setProfileImage('/default-profile.png')}
            className="py-3.5 px-7 text-base font-medium text-indigo-900 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100"
          >
            Delete picture
          </button>
        </div>
      </div>

      {fieldErrors.general && <ErrorMsg>{fieldErrors.general}</ErrorMsg>}

      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
          placeholder="Username"
        />
        {fieldErrors.username && <ErrorMsg>{fieldErrors.username}</ErrorMsg>}
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
          Your email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
          placeholder="name@company.com"
        />
        {fieldErrors.email && <ErrorMsg>{fieldErrors.email}</ErrorMsg>}
      </div>

      <button
        type="submit"
        onClick={handleSave}
        className="mt-4 text-white bg-indigo-500 py-1.5 px-4 rounded font-bold w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </Page>
  );
};

export default ProfilePage;