import { useState } from 'react';
import Card from '../Card';
import FormButton from '../buttons/FormButton';
import FormCancelButton from '../buttons/FormCancelButton';
import { useCollections } from '@/context/CollectionContext';

const UserCollectionCardEdit = ({
  title = '',
  key: id = -1,
  defaultName = '',
  defaultDescription = '',
}) => {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [isLoading, setIsLoading] = useState(false);
  const { editingIdx, setEditingIdx } = useCollections();

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      if(id==-1){
        const response = await fetch('/api/protected/collections', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, name, description }),
        });
        if (response.ok) {
          alert('Collection created successfully!');
        } else {
          const error = await response.json();
          alert(`Error creating collection: ${error.message}`);
        }
      }
      else{
        const response = await fetch('api/protected/collections', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, name, description }),
        });
  
        if (response.ok) {
          alert('Collection updated successfully!');
        } else {
          const error = await response.json();
          alert(`Error updating collection: ${error.message}`);
        }
      }

    } catch (error) {
      console.error('Error updating collection:', error);
      alert('An unexpected error occurred while updating the collection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <Card type='card' title={title}>
        {/* Name Input */}
        <label htmlFor="name" className="block  text-sm font-medium text-gray-900">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5 mb-4"
          placeholder="Enter collection name"
          required
        />

        {/* Description Input */}
        <label htmlFor="description" className="block text-sm font-medium text-gray-900">
          Description
        </label>
        <textarea
          id="description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5 mb-4 resize-none overflow-y-auto"
          placeholder="Enter collection description"

        ></textarea>

        <div className="flex justify-end space-x-4 ">
          <FormButton isLoading={isLoading}>
            Update
          </FormButton>
          <FormCancelButton onclick={()=>{setEditingIdx(null)}}>
            Cancel
          </FormCancelButton>
        </div>
      </Card>
    </form>
  );
};

export default UserCollectionCardEdit;