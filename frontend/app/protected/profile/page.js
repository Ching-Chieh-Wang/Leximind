'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { updateImage, updateProfile } from '@/api/user';
import Card from '@/components/Card';
import ErrorMsg from '@/components/msg/ErrorMsg';
import SuccessMsg from '@/components/msg/SuccessMsg';
import Image from 'next/image';
import FormSubmitButton from '@/components/buttons/FormSubmitButton';
import GoogleIcon from '@/components/icons/Google';
import ProfileImageUpload from '@/components/ProfileImageUpload';
import Vertical_Layout from '@/components/Vertical_Layout';

const ProfilePage = () => {
  const fileInputRef = useRef(null);  // Create a ref for the file input
  const { data: session, update } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (session) {
      setUsername(session.user.username);
      setEmail(session.user.email);
    }
  }, [session]);

  // Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});
    setSuccessMessage(null);

    try {
      await updateProfile(username, email);
      await update({ user: { username, email } });
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      let errors = {};
      error.data?.errors?.forEach((fieldError) => {
        if (!errors[fieldError.path]) {
          errors[fieldError.path] = fieldError.msg; // Store only the first error for each field
        }
      });
      setFieldErrors({ ...errors, general: error.data.message });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card type='form' title="Public Profile" >
      <ProfileImageUpload  setFieldErrors={setFieldErrors}/>
      {successMessage && <SuccessMsg>{successMessage}</SuccessMsg>}
      {fieldErrors.general && <ErrorMsg>{fieldErrors.general}</ErrorMsg>}
      <form onSubmit={handleSave}>
        <Vertical_Layout >
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

          <FormSubmitButton isLoading={isLoading} loadingText="Saving...">
            Save
          </FormSubmitButton>
        </Vertical_Layout>
      </form>
    </Card >

  );
};

export default ProfilePage;