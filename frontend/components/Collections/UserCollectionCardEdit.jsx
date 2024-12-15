'use client';
import { useEffect, useState } from 'react';
import Card from '../Card';
import FormButton from '../Buttons/FormButton';
import FormCancelButton from '../Buttons/FormCancelButton';
import { useCollections } from '@/context/CollectionsContext';
import SwitcherButton from '../Buttons/SwitcherButton';
import LockIcon from '../icons/LockIcon';
import GlobalIcon from '../icons/GlobalIcon';
import HorizontalLayout from '../horizontalLayout';
import VerticalLayout from '../VerticalLayout';

const UserCollectionCardEdit = ({ index }) => {
  const {
    status,
    collections,
    createCollection,
    updateCollection,
    cancelEditCollection
  } = useCollections();
  const [name, setName] = useState(() => {
    return collections[index]?.name || '';
  });
  const [description, setDescription] = useState(() => {
    return collections[index]?.description || '';
  });
  const [is_public, setIsPublic] = useState(() => {
    return collections[index]?.is_public || false;
  });

  const handleIsPublicChange = (e) => {
    setIsPublic(e.target.checked);
  }

  const handleUpsert = async (e) => {
    e.preventDefault();
    if (status === 'adding') createCollection('/api/protected/collections', { name, description, is_public })
    else if (status === 'updating') updateCollection(`/api/protected/collections/${collections[index].id}`, { name, description, is_public })
  };

  return (
    <form onSubmit={handleUpsert}>
      <Card
        type="card"
        title={status === 'adding' ? 'Create new collection' : 'Update collection'}
      >
        {/* Name Input */}
        <VerticalLayout spacing='space-y-1'>
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
        </VerticalLayout>

        {/* Description Input */}
        <VerticalLayout spacing='space-y-1'>
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
        </VerticalLayout>


        <HorizontalLayout extraStyle={"justify-between"}>
          <SwitcherButton
            checked={is_public}
            onChange={handleIsPublicChange}
            offBody={
              <HorizontalLayout spaceing='space-x-1'>
                <LockIcon />
                <span className="hidden sm:inline">Private</span> {/* Hide text on small screens */}
              </HorizontalLayout>
            }
            onBody={
              <HorizontalLayout spaceing='space-x-1'>
                <GlobalIcon />
                <span className="hidden sm:inline">Public</span> {/* Hide text on small screens */}
              </HorizontalLayout>
            }
          />

          <HorizontalLayout>
            <FormCancelButton onClick={cancelEditCollection}>
              Cancel
            </FormCancelButton>
            <FormButton status={status === 'loading'}>
              {status === 'adding' ? 'Create' : 'Update'}
            </FormButton>
          </HorizontalLayout>
        </HorizontalLayout>
      </Card>
    </form>
  );
};

export default UserCollectionCardEdit;