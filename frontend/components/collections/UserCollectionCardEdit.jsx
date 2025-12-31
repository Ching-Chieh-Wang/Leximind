'use client';
import { useState } from 'react';
import Card from '../Card';
import FormSubmitButton from '../buttons/FormSubmitButton';
import FormCancelButton from '../buttons/FormCancelButton';
import { useCollections } from '@/context/CollectionsContext';
import SwitcherButton from '../buttons/SwitcherButton';
import LockIcon from '../icons/LockIcon';
import GlobalIcon from '../icons/GlobalIcon';
import Horizontal_Layout from '../Horizontal_Layout';
import Vertical_Layout from '../Vertical_Layout';
import ErrorMsg from '@/components/msg/ErrorMsg';

const UserCollectionCardEdit = ({ index }) => {
  const {
    status,
    collections,
    createCollection,
    updateCollection,
    cancelEditCollection,
  } = useCollections();
  const [name, setName] = useState(status === 'updatingCollection' ? collections[index].name : '');
  const [description, setDescription] = useState(status === 'updatingCollection' ? collections[index].description : '');
  const [isPublic, setIsPublic] = useState(status === 'updatingCollection' ? collections[index].is_public : false);
  const [fieldErrors, setFieldErrors] = useState({})

  const handleUpsert = async (e) => {
    e.preventDefault();
    setFieldErrors({})
    try {
      if (status === 'creatingCollection') await createCollection(name, description, isPublic)
      else if (status === 'updatingCollection') updateCollection(`/api/protected/collections/${collections[index].id}`, name, description, isPublic)
      else {
        console.error('status not found', status)
        return
      }
    } catch (err) {
      console.log(err)
      if (err.errors) {
        const errors = {};
        err.errors.forEach((error) => {
          if (!errors[error.path]) {
            errors[error.path] = error.msg; // Store only the first error for each field
          }
        });
        setFieldErrors(errors);
      }
      else{
        setFieldErrors({general:'Unexpected error! Please try again later.'})
      }
    }
    
  };

  const handleNameChange = (e) => {
    const input = e.target.value;
    setName(input);
  };
  const handleDescriptionChange = (e) => {
    const input = e.target.value;
    setDescription(input);
  };
  const handleIsPublicChange = () => {
    setFieldErrors({})
    setIsPublic((prev) => !prev)
  }

  return (
    <form onSubmit={handleUpsert}>
      <Card
        type="card"
        title={status === 'creatingCollection' || status === 'createCollectionLoading' ? 'Create new collection' : 'Update collection'}
      >
        {fieldErrors.general && <ErrorMsg>{fieldErrors.general}</ErrorMsg>}
        {/* Name Input */}
        <Vertical_Layout spacing='space-y-1'>
          <label className="block  text-sm font-medium text-gray-900">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
            placeholder="Enter collection name"
            required
            autoComplete="on"
            autoFocus="on"
          />
          <ErrorMsg>{fieldErrors.name}</ErrorMsg>

        </Vertical_Layout>

        {/* Description Input */}
        <Vertical_Layout spacing='space-y-1'>
          <label
            htmlFor="description"
            className="block text-sm font-medium  text-gray-900"
          >
            Description
          </label>
          <textarea
            id="description"
            rows="2"
            value={description}
            onChange={handleDescriptionChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg h-24 w-full p-2.5"
            placeholder="Enter collection description"
          ></textarea>
          <ErrorMsg>{fieldErrors.description}</ErrorMsg>
        </Vertical_Layout>


        <Horizontal_Layout justify="between" >
          <SwitcherButton
            checked={isPublic}
            onChange={handleIsPublicChange}
            offBody={
              <Horizontal_Layout spacing='space-x-1' >
                <LockIcon />
                <span className="hidden sm:block">Private</span>
              </Horizontal_Layout>
            }
            onBody={
              <Horizontal_Layout spacing='space-x-1' >
                <GlobalIcon />
                <span className="hidden sm:block">Public</span>
              </Horizontal_Layout>
            }
          />

          <Horizontal_Layout  >
            <FormCancelButton onClick={cancelEditCollection}>
              Cancel
            </FormCancelButton>
            <FormSubmitButton isLoading={status === 'createCollectionLoading'}>
              {status === 'creatingCollection' || status === 'createCollectionLoading' ? 'Create' : 'Update'}
            </FormSubmitButton>
          </Horizontal_Layout>
        </Horizontal_Layout>
      </Card>
    </form>
  );
};

export default UserCollectionCardEdit;