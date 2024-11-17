// components/collection/Collection.js
import GlobalCollectionCardBody from './GlobalCollectionCard/GlobalCollectionCardBody';
import UserCollectionCard from './UserCollectionCard';
import Link from 'next/link';

const Collections = ({ collections, type = 'user', addButtonUrl = null }) => {
  return (
    <div className="w-full max-w-7xl space-y-6">
      {/* Project Cards */}
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-1 md:p-4 xl:p-5">
        {collections.map((collection) => (
          type === 'user' ? (
            <UserCollectionCard
              key={collection.id}
              collection={collection}
            />
          ) : (
            <GlobalCollectionCardBody
              key={collection.id}
              collection={collection}
            />
          )
        ))}
        {/* Add New Collection Card */}
        {addButtonUrl && (
          <Link href={addButtonUrl}>
            <div className='bg-white mt-4 mb-4 border-2 border-dashed border-blue-300 rounded-lg shadow-md  flex flex-col items-center justify-center' style={{ height: '96%' }}>
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
          </Link>
        )}
      </div>
    </div>
  );
};

export default Collections;