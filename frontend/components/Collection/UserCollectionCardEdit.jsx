'use client';
import { useEffect, useState } from 'react';
import Card from '../Card';
import FormButton from '../buttons/FormButton';
import FormCancelButton from '../buttons/FormCancelButton';
import { useCollections } from '@/context/CollectionsContext';
import ToggleButton from '../buttons/ToggleButton';

const UserCollectionCardEdit = ({index}) => {
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

  const handleIsPublicChange= (e)=>{
    setIsPublic(e.target.checked);
  }

  const handleUpsert = async (e) => {
    e.preventDefault();
    if(status==='adding')createCollection('/api/protected/collections',name,description,is_public)
    else if(status==='updating')updateCollection(`/api/protected/collections/${collections[index].id}`,name,description,is_public)
  };

  return (
    <form onSubmit={handleUpsert}>
      <Card
        type="card"
        title={status==='adding' ? 'Create new collection' : 'Update collection'}
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
        </div>


        <div className="flex justify-between items-center">
          <div className="inline-flex jusity-start space-x-2 items-center">
            <h1 className='text-sm text-gray-500'>public: </h1>
            <ToggleButton checked={is_public} onChange={handleIsPublicChange}/>
          </div>

          <div className="flex justify-end space-x-4 ">
            <FormCancelButton onClick={cancelEditCollection}>
              Cancel
            </FormCancelButton>
            <FormButton status={status==='loading'}>
              {status==='adding' ? 'Create' : 'Update'}
            </FormButton>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default UserCollectionCardEdit;