'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Collections from '@/components/Collection/Collections';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import Card from '@/components/Card';

const CollectionsPage = () => {
  const { data: session, status } = useSession();
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/'); // Redirect to login if unauthenticated
    }
  }, [status, router]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = collections.filter((collection) =>
      collection.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCollections(filtered);
  };

  const handleSort = (type) => {
    setSortType(type);
    const sorted = [...filteredCollections].sort((a, b) => {
      if (type === 'name') return a.name.localeCompare(b.name);
      if (type === 'createdAt') return new Date(a.createdAt) - new Date(b.createdAt);
      if (type === 'lastViewTime') return new Date(b.lastViewTime) - new Date(a.lastViewTime);
      return 0;
    });
    setFilteredCollections(sorted);
  };

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/protected/collections');
        const data = await response.json();
        if (response.ok) {
          setCollections(data.collections);
          setFilteredCollections(data.collections); // Initialize filtered collections
        } else {
          console.error("Failed to load collections:", data);
        }
      } catch (error) {
        console.error('Failed to load collections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    handleSort(sortType);
  }, [sortType]);

  return (
    <Card fullWidth={true} title="My Collections">

      {/* Search and Sort Section */}
      <div className="flex justify-between items-center space-x-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Sort Dropdown */}
        <DropdownMenu button={<div className="p-2 border rounded-md border-gray-300 bg-gray-50 hover:bg-gray-100">Sort</div>}>
          <DropdownItem onClick={() => handleSort('name')} label="Name" />
          <DropdownItem onClick={() => handleSort('createdAt')} label="Created At" />
          <DropdownItem onClick={() => handleSort('lastViewTime')} label="Last Viewed" />
        </DropdownMenu>
      </div>

      {/* Collections Component */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Collections
          title="All Collections"
          type="user"
          collections={filteredCollections}
          addButtonUrl="/protected/collections/new"
        />
      )}
    </Card>
  );
};

export default CollectionsPage;