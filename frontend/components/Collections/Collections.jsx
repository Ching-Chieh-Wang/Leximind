'use client';

import { useCollections } from '@/context/CollectionsContext';
import GlobalCollectionCard from './GlobalCollectionCard';
import UserCollectionCard from './UserCollectionCard';
import UserCollectionCardEdit from './UserCollectionCardEdit';
import CreateIcon from '../icons/CreateIcon';
import ErrorMsg from '../Msg/ErrorMsg';

const Collections = () => {
  const { status, collections, editingIdx, startCreateCollectionSession, error,type} = useCollections(); // Access collections from context

  // Handle loading or error states
  if (status === 'loading') {
    return <div className="text-center mt-4">Loading collections...</div>;
  }

  if (status === 'error') {
    return <ErrorMsg >{error}</ErrorMsg>
  }

  if(collections.length==0){
    return <div className="text-center mt-4">No result</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 auto-rows-fr">
      {collections.map((collection, index) => {
        if (status === 'updating' && index === editingIdx) {
          return <UserCollectionCardEdit key={collection.id} index={index} />;
        }

        if (type === 'global') {
          return <GlobalCollectionCard key={collection.id} index={index} />;
        }

        if (type === 'user') {
          return <UserCollectionCard key={collection.id} index={index} />;
        }

        return null; // Handle unexpected cases
      })}

      {/* Add New Collection Card */}
      {type === 'user' && (
        status === 'adding' ? (
          <UserCollectionCardEdit />
        ) : (
          <button onClick={startCreateCollectionSession} >
            <div className="bg-white min-h-[340px] h-full w-full border-2 border-dashed hover:border-solid border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-500 hover:text-2xl duration-500">
              <CreateIcon size={35} />
              Add New Collection
            </div>
          </button>
        )
      )}
    </div>
  );
};

export default Collections;