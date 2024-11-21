'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCollections, CollectionsProvider } from '@/context/CollectionContext';
import Collections from '@/components/Collection/Collections';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import Card from '@/components/Card';

const CollectionsPageContent = () => {
  const { status } = useSession();
  const router = useRouter();

  const {
    collections,
    setCollections,
    addCollection,
  } = useCollections();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login if unauthenticated
    }
  }, [status]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/protected/collections', {
          method: 'GET', // Explicitly specify the HTTP method
          headers: {
            'Content-Type': 'application/json', // Ensure the content type is JSON
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }
        const data = await response.json(); // Parse the JSON response
        setCollections(data.collections || []); // Set collections in context
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };
  
    fetchCollections(); // Call the function here correctly
  }, []); // Dependency array ensures this runs only once on component mount

  const handleSearchAndSort = () => {
    let updatedCollections = [...collections];

    // Search Filter
    if (searchQuery) {
      updatedCollections = updatedCollections.filter((collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    else{
      updatedCollections=collections;
    }

    // Sorting
    if (sortType) {
      updatedCollections = updatedCollections.sort((a, b) => {
        if (sortType === 'name') return a.name.localeCompare(b.name);
        if (sortType === 'createdAt') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortType === 'lastViewTime') return new Date(b.lastViewTime) - new Date(a.lastViewTime);
        return 0;
      });
    }

    setCollections(updatedCollections);
  };

  useEffect(() => {
    handleSearchAndSort(); // Trigger search and sort when dependencies change
  }, [searchQuery, sortType]);

  const handleAddCollection = async (name, description, is_public) => {
    try {
      const response = await fetch('/api/protected/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, is_public }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add collection');
      }

      const newCollection = await response.json();
      addCollection(newCollection); // Add new collection optimistically

      alert('Collection added successfully!');
    } catch (error) {
      console.error('Error adding collection:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Card type='page' title="My Collections">
      {/* Search and Sort Section */}
      <div className="flex justify-between items-center">
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
          <DropdownItem onClick={() => setSortType('name')} label="Name" />
          <DropdownItem onClick={() => setSortType('createdAt')} label="Created At" />
          <DropdownItem onClick={() => setSortType('lastViewTime')} label="Last Viewed" />
        </DropdownMenu>
      </div>

      {/* Collections Component */}
      <Collections type="user" handleAddCollection={handleAddCollection} />
    </Card>
  );
};

const CollectionsPage = () => (
  <CollectionsProvider>
    <CollectionsPageContent />
  </CollectionsProvider>
);

export default CollectionsPage;