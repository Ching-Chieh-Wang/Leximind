'use client'
import { useCollections } from '@/context/CollectionContext';
import GlobalCollectionCard from './GlobalCollectionCard';
import UserCollectionCard from './UserCollectionCard';
import UserCollectionCardEdit from './UserCollectionCardEdit';
import CreateIcon from '../icons/CreateIcon';

const Collections = ({ type = 'user' }) => {
  const { collections, editingIdx ,setEditingIdx} = useCollections(); // Access collections from context
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 auto-rows-fr">

      {collections.map((collection, index) => {
        if (index === editingIdx) {
          return (
            <UserCollectionCardEdit
              key={collection.id}
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
        editingIdx==collections.length ? (
          <UserCollectionCardEdit/>
        ) : (
          <button onClick={() => {setEditingIdx(collections.length)}} >
            <div
              className=" bg-white min-h-[340px] border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-500"
            >
              <CreateIcon size={35}/>
              Add New Collection
            </div>
          </button>
        )
      )}
    </div>
  );
};

export default Collections;