'use client';

import { useCollections } from '@/context/CollectionsContext';
import GlobalCollectionCard from './GlobalCollectionCard';
import UserCollectionCard from './UserCollectionCard';
import UserCollectionCardEdit from './UserCollectionCardEdit';
import Image from 'next/image';
import CreateIcon from '../icons/CreateIcon';
import ErrorMsg from '@/components/msg/ErrorMsg';
import Vertical_Layout from '../Vertical_Layout';

const Collections = () => {
  const { status, collections, editingIdx, startCreateCollectionSession, error, type } = useCollections(); // Access collections from context

  // Handle loading or error states
  if (status === 'loading') {
    return <div className="text-center mt-4">Loading collections...</div>;
  }

  if (status === 'error') {
    return <ErrorMsg >{error}</ErrorMsg>
  }



  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 auto-rows-fr ">
      {
        collections.length === 0 ? (
          <Vertical_Layout extraStyle={"items-center col-span-full"}>
            <Image
              src='/assets/images/no content.png'
              width={200}
              height={200}
              alt='no content'
              className=' rounded-lg'
            />
            <div className="text-center mt-4">No result</div>
          </Vertical_Layout>
        ) : (
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

            return null; // Handle unexpected cases
          })
        )
      }


      {/* Add New Collection Card */}
      {type === 'user' && (
        status === 'creatingCollection' || status === 'createCollectionLoading' ? (
          <UserCollectionCardEdit />
        ) : (
          <button onClick={startCreateCollectionSession} className={collections.length==0 && 'col-span-full'}>
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