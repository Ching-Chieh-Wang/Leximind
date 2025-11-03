'use client';

import { useCollections } from '@/context/CollectionsContext';
import GlobalCollectionCard from './GlobalCollectionCard';
import UserCollectionCard from './UserCollectionCard';
import UserCollectionCardEdit from './UserCollectionCardEdit';
import CreateIcon from '../icons/CreateIcon';
import ErrorMsg from '@/components/msg/ErrorMsg';
import Vertical_Layout from '../Vertical_Layout';
import { ErrorHandle } from '@/utils/ErrorHandle';

const Collections = () => {
  const { status, collections, editingIdx, startCreateCollectionSession, error, type } = useCollections(); // Access collections from context

  // Handle loading or error states
  if (status === 'loading') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 auto-rows-fr">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between min-h-[340px] rounded-xl border border-gray-200 bg-white shadow-sm p-6 animate-pulse"
          >
            {/* Title */}
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-10"></div>

            {/* Description */}
            <div className="space-y-3 flex-1">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>

            {/* Bottom Section */}
            <div className="mt-6">
              <div className="h-2 w-full bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-center gap-4">
                <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-28 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return <ErrorMsg >{error}</ErrorMsg>
  }



  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 auto-rows-fr ">
      {
          collections.map((collection, index) => {
            if ((status === 'updatingCollection' || status === 'updateCollectionLoading') && index === editingIdx) {
              return <UserCollectionCardEdit key={collection.id} index={index} />;
            }

            if (type === 'global') {
              return <GlobalCollectionCard key={collection.id} index={index} />;
            }

            if (type === 'user') {
              return <UserCollectionCard key={collection.id} index={index} />;
            }
            ErrorHandle("Unexpected error, please try again later!");
            console.error("No collection status for:", status);
            return null; // Handle unexpected cases
          })
          
      }


      {/* Add New Collection Card */}
      {type === 'user' && (
        status === 'creatingCollection' || status === 'createCollectionLoading' ? (
          <UserCollectionCardEdit />
        ) : (
          <button onClick={startCreateCollectionSession}>
            <Vertical_Layout spacing="space-y-1" extraStyle={" h-full w-full bg-white min-h-[340px] items-center border-2 border-dashed hover:border-solid border-blue-300 rounded-lg  text-blue-500 hover:text-2xl duration-500"}>
              <CreateIcon size={35} />
              <h1>Add New Collection</h1>
            </Vertical_Layout>
          </button>
        )
      )}
    </div>
  );
};

export default Collections;