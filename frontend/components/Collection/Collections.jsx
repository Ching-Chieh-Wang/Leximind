// components/Collection/Collections.jsx
import { useState } from 'react';
import { useCollections } from '@/context/CollectionContext';
import GlobalCollectionCard from './GlobalCollectionCard';
import UserCollectionCard from './UserCollectionCard';
import UserCollectionCardEdit from './UserCollectionCardEdit';

const Collections = ({ type = 'user', handleAddCollection }) => {
  const { collections, editingIdx ,setEditingIdx} = useCollections(); // Access collections from context

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-cols-fr">
      {collections.map((collection, index) => {
        if (index === editingIdx) {
          return (
            <UserCollectionCardEdit
              key={collection.id}
              index={index}
              title="Edit Collection"
              defaultName={collections[index].name}
              defaultDescription={collections[index].description}
               className="w-full max-w-sm mx-auto"
    
            />
          );
        }

        if (type === 'global') {
          return (
            <GlobalCollectionCard
              key={collection.id}
              index={index}
            />
          );
        }

        if (type === 'user') {
          return (
            <UserCollectionCard
              key={collection.id}
              index={index}
            />
          );
        }

        return null; // Handle unexpected cases
      })}

      {/* Add New Collection Card */}
      {type === 'user' && (
        editingIdx==-1 ? (
          <UserCollectionCardEdit
            title="Create New Collection"
          />
        ) : (
          <button onClick={() => {setEditingIdx(-1)}} >
            <div
              className="min-h-[364.5px] bg-white  border-2 border-dashed border-blue-300 rounded-lg shadow-md flex flex-col items-center justify-center "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-blue-500 mb-2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="text-blue-500">Add New Collection</span>
            </div>
          </button>
        )
      )}
    </div>
  );
};

export default Collections;