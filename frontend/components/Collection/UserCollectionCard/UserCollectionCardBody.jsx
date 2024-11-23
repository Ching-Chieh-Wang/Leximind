'use client'
import { useCollections } from '@/context/CollectionContext';


const UserCollectionCardBody = ({ index }) => {
  const { collections } = useCollections();
  const {
    description,
  } = collections[index];





  return (
    <div className="flex-grow">
      {/* Project Description */}
      <div className='flex-grow'>
        <p
          className="text-sm text-gray-600 "
          style={{
            maxHeight: '5.5em', // Limit height to approximately 3 lines
            overflowY: 'auto',  // Enable vertical scrolling
            overflowWrap: 'break-word', // Handle long words
            paddingRight: '0.5em', // Add padding to the right of the scrollable area
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default UserCollectionCardBody;