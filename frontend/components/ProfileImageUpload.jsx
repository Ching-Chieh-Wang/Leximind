'use client';

import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { updateImage } from '@/api/user';
import processImg from '@/service/cloudinary/profileImage'

const ProfileImageUpload = ({setFieldErrors}) => {
  const fileInputRef = useRef(null);
  const { data: session, update } = useSession();

// Handle image change
const handleImageChange = async (e) => {
    e.preventDefault();
    try {
      const uploadImage = fileInputRef.current.files[0]; // Access directly from ref
      if (uploadImage) {
        const proccessedImgURL= await processImg(uploadImage);
        console.log('proccessedImgUrl',proccessedImgURL)
        const newImage = await updateImage(proccessedImgURL);
        console.log('newImg',newImage)
        await update({ user: { ...session.user, image: newImage } });
      }
    } catch (error) {
      console.log("Failed to change profile image", error);
      setFieldErrors({
        general: "Failed to change profile image, please try again later",
      });
    } finally {
      e.target.value = '';
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <Image
        unoptimized
        className="object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 p-1 rounded-full ring-2 ring-indigo-300 hover:ring-indigo-500"
        src={session.user.image}
        alt="Profile Image"
        width={160}
        height={160}
      />
      <div className="flex flex-col space-y-5 sm:ml-8">
        <label className="block">
          <input
            type="file"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
          />
          <button
            type="button"
            className="p-3 text-base font-medium text-indigo-100 bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900"
            onClick={triggerFileInput}
          >
            Change picture
          </button>
        </label>
        <button
          type="button"
          onClick={() => update({ user: { ...session.user, image: '/assets/images/logo.jpg' } })}
          className="p-3 text-base font-medium text-indigo-900 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100"
        >
          Delete picture
        </button>
      </div>
    </div>
  );
};

export default ProfileImageUpload;