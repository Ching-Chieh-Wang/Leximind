'use client'
import { useCollections } from '@/context/CollectionContext';

const UserCollectionCardBody = ({ index }) => {
  if(index==undefined){console.error("index must provide")}  const { collections } = useCollections();
  const {description } = collections[index];
  return (
    <div className="flex-grow">
        <p
          className="text-md text-gray-600 h-40 pr-2 overflow-y-auto"
          style={{
            overflowWrap: 'break-word', // Handle long words
          }}
        >
          {description}
        </p>
    </div>
  );
};

export default UserCollectionCardBody;