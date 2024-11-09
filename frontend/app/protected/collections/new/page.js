'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import ErrorMsg from '@/components/msg/ErrorMsg';
import SuccessMsg from '@/components/msg/SuccessMsg';
import FormButton from '@/components/buttons/FormButton';

const NewCollectionPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/'); // Redirect to login if unauthenticated
    }
  }, [status, session]);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});
    setSuccessMessage(null);

    try {
      const token = session?.accessToken;

      const response = await fetch('/api/protected/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errors = {};
        if (data.errors.path=='name') {
          data.errors.forEach((error) => {
            errors[error.path] = error.msg;
          });
          setFieldErrors(errors);
        } else {
          setFieldErrors({ general: data.message || 'Creation failed. Please try again.' });
        }
        return;
      }

      setSuccessMessage('Collection created successfully!');
      router.push('/protected/collections'); // Redirect to collections page after creation
    } catch (error) {
      setFieldErrors({ general: 'Something went wrong. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
      <h2 className="pl-6 text-2xl font-bold sm:text-xl">Create New Collection</h2>

      {/* Show success message */}
      {successMessage && <SuccessMsg>{successMessage}</SuccessMsg>}

      {/* Show general error message */}
      {fieldErrors.general && <ErrorMsg>{fieldErrors.general}</ErrorMsg>}

      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
          Collection Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
          placeholder="Collection Name"
          required
        />
        {fieldErrors.name && <ErrorMsg>{fieldErrors.name}</ErrorMsg>}
      </div>

      <div>
        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
          placeholder="Enter a description"
          rows={4}
        />
        {fieldErrors.description && <ErrorMsg>{fieldErrors.description}</ErrorMsg>}
      </div>

      <FormButton onClick={handleCreateCollection} isLoading={isLoading} loadingText="Creating...">
        Create Collection
      </FormButton>
    </Card>
  );
};

export default NewCollectionPage;