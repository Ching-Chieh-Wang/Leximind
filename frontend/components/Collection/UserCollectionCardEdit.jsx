'use client';
import { useState } from 'react';
import Card from '../Card';
import FormButton from '../buttons/FormButton';
import FormCancelButton from '../buttons/FormCancelButton';
import ErrorMsg from '../Msg/ErrorMsg';
import { useDialog } from '@/context/DialogContext';
import { useCollections } from '@/context/CollectionContext';

const UserCollectionCardEdit = () => {
  const {
    collections,
    editingIdx,
    setEditingIdx,
    addCollection,
    updateCollection,
  } = useCollections();
  const collectionCnt = collections.length;
  const { showDialog } = useDialog();

  const isNewCollection = editingIdx === collectionCnt;
  const [name, setName] = useState(
    isNewCollection ? '' : collections[editingIdx].name
  );
  const [description, setDescription] = useState(
    isNewCollection ? '' : collections[editingIdx].description
  );
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleUpsert = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isNewCollection) {
        // Insert new collection
        const response = await fetch(`/api/protected/collections/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, description }),
        });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400 && data.errors) {
            // Handle field-specific errors
            const errors = {};
            data.errors.forEach((error) => {
              if (!errors[error.path]) {
                errors[error.path] = error.msg; // Store only the first error for each field
              }
            });
            setFieldErrors(errors);
          } else {
            showDialog('Error', 'Unexpected error! Please try again later.');
          }
          return;
        }

        // Add the new collection to the context
        addCollection({
          id: data.id,
          name: name,
          description: description,
          created_at: data.created_at,
          memorized_cnt: 0,
          word_cnt: 0,
          not_memorized_cnt: 0,
          is_public: false,
        });

        setEditingIdx(-1);
      } else {
        // Update existing collection
        if (
          collections[editingIdx].name === name &&
          collections[editingIdx].description === description
        ) {
          setEditingIdx(-1);
          setIsLoading(false);
          return; // No changes made
        }

        const collection_id = collections[editingIdx].id;
        const response = await fetch(
          `/api/protected/collections/${collection_id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
          }
        );
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400 && data.errors) {
            // Handle field-specific errors
            const errors = {};
            data.errors.forEach((error) => {
              if (!errors[error.path]) {
                errors[error.path] = error.msg; // Store only the first error for each field
              }
            });
            setFieldErrors(errors);
          } else {
            showDialog('Error', 'Unexpected error! Please try again later.');
          }
          return;
        }

        // Update the collection in the context
        const updatedCollection = {
          ...collections[editingIdx],
          name,
          description,
        };
        updateCollection(editingIdx, updatedCollection);
        setEditingIdx(-1);
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      showDialog(
        'Error',
        'An unexpected error occurred while updating the collection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpsert}>
      <Card
        type="card"
        title={isNewCollection ? 'Create new collection' : 'Update collection'}
      >
        {/* Name Input */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
            placeholder="Enter collection name"
            required
            autoComplete="on"
          />
        </div>
        {fieldErrors.name && <ErrorMsg>{fieldErrors.name}</ErrorMsg>}

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium pb-2 text-gray-900"
          >
            Description
          </label>
          <textarea
            id="description"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg h-24 w-full p-2.5"
            placeholder="Enter collection description"
          ></textarea>
          {fieldErrors.description && <ErrorMsg>{fieldErrors.description}</ErrorMsg>}
        </div>

        <div className="flex justify-end space-x-4 ml-32 xl:ml-48">
          <FormCancelButton onClick={() => setEditingIdx(-1)}>
            Cancel
          </FormCancelButton>
          <FormButton isLoading={isLoading}>
            {isNewCollection ? 'Create' : 'Update'}
          </FormButton>
        </div>
      </Card>
    </form>
  );
};

export default UserCollectionCardEdit;