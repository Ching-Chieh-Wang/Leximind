'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Collections from '@/components/Collection/Collections';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';

const CollectionsPage = () => {
  const { data:session, status } = useSession();
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState('lastViewTime');
  const [isLoading, setIsLoading] = useState(true);
  const router=useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/'); // Redirect to login if unauthenticated
    }
  }, [status, session]);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`api/protected/collections?sort=${sortType}&search=${searchQuery}`);
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Failed to load collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [searchQuery, sortType]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800">Collections</h1>

      {/* Search and Sort Section */}
      <div className="flex justify-between items-center space-x-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Sort Dropdown */}
        <DropdownMenu button={<div className="p-2 border rounded-md border-gray-300 bg-gray-50 hover:bg-gray-100">Sort</div>}>
          <DropdownItem
            onClick={() => setSortType('name')}
            label="Name"
          />
          <DropdownItem
            onClick={() => setSortType('createdAt')}
            label="Created At"
          />
          <DropdownItem
            onClick={() => setSortType('lastViewTime')}
            label="Last Viewed"
          />
        </DropdownMenu>
      </div>

      {/* Collections Component */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Collections
          title="All Collections"
          collections={collections}
          apiRoute='api/protected/collections'
          isAllowShowmore={true}
          addButtonUrl='/protected/collections/new'
        />
      )}
    </div>
  );
};

export default CollectionsPage;