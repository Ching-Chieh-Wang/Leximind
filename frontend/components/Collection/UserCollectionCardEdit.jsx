import { useState } from 'react';
import Card from '../Card';
import FormButton from '../buttons/FormButton';

const UserCollectionCardEdit = ({
  title = '',
  key: id = -1,
  defaultName = '',
  defaultDescription = '',
  apiRoute,
}) => {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiRoute, {
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
    } catch (error) {
      console.error('Error updating collection:', error);
      alert('An unexpected error occurred while updating the collection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <Card fullWidth={true} maxWidthtitle={title}>
        {/* Name Input */}
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
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
        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
          Description
        </label>
        <textarea
          id="description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5 mb-4 resize-none overflow-y-auto"
          placeholder="Enter collection description"
          required
        ></textarea>

        {/* Save Button */}
        <FormButton isLoading={isLoading} className="w-full">
          Update
        </FormButton>
      </Card>
    </form>
  );
};

export default UserCollectionCardEdit;