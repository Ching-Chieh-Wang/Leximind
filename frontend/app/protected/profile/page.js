'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {  updateImage, updateProfile } from '@/api/user';
import Card from '@/components/Card';
import ErrorMsg from '@/components/msg/ErrorMsg';
import SuccessMsg from '@/components/msg/SuccessMsg';
import Image from 'next/image';
import FormSubmitButton from '@/components/buttons/FormSubmitButton';
import GoogleIcon from '@/components/icons/Google';

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

  // Handle image change
  const handleImageChange = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    try{
      if (e.target.files && e.target.files[0]) {
        const uploadImage= e.target.files[0];
        const newImage= await updateImage(uploadImage);
        await update({ user: {...session.user, image:newImage } });
      }
    } catch(error){
      console.log("Failed to change profile image",error)
      setFieldErrors({ ...fieldErrors, general: "Failed to change profile image, please try again later" });
    }finally{
      e.target.value= '';
    }
  };

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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card type='form' title="Public Profile">
      <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Image
          unoptimized
          className="object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 p-1 rounded-full ring-2 ring-indigo-300 hover:ring-indigo-500"
          src={session.user.image}
          alt="Image"
          width={160}
          height={160}
        />
        <div className="flex flex-col space-y-5 sm:ml-8">
          <label className="block">
            <input
              type="file"
              onChange={handleImageChange}
              ref={fileInputRef}  // Attach ref to file input
              className="hidden"
              accept="image/*"
            />
            <button
              type="button"
              className="p-3 text-base font-medium text-indigo-100 bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900"
              onClick={triggerFileInput}  // Trigger file input click
            >
              Change picture
            </button>
          </label>
          <button
            type="button"
            onClick={() => setImage('/assets/images/logo.jpg')}
            className="p-3 text-base font-medium text-indigo-900 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100"
          >
            Delete picture
          </button>
        </div>
      </div>

      {successMessage && <SuccessMsg>{successMessage}</SuccessMsg>}
      {fieldErrors.general && <ErrorMsg>{fieldErrors.general}</ErrorMsg>}
      <form onSubmit={handleSave}>
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
      </form>
    </Card>

  );
};

export default ProfilePage;