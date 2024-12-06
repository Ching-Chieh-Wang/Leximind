'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCollections } from '@/context/CollectionContext';
import Collections from '@/components/Collection/Collections';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import Card from '@/components/Card';
import { SortIcon } from '@/components/icons/SortIcon';
import { DropdownIcon } from '@/components/icons/DropdownIcon';
import SearchBar from '@/components/SearchBar';

const CollectionsPage = () => {
  const {
    collections,
    fetchCollections,
    sortCollections,
    filterCollections,
    isLoading,
    error,
  } = useCollections();

  const { status } = useSession()
  const [sortType, setSortType] = useState('Recently viewed first~');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login if unauthenticated
    }
  }, [status]);

  // Fetch collections on mount
  useEffect(() => {
    console.log(collections)
    fetchCollections('/api/protected/collections');
  }, []);

  // Sort collections when sortType changes
  useEffect(() => {
    sortCollections(sortType);
  }, [sortType]);

  const handleSearch = (searchQuery) => {
    setSortType('Recently viewed first~')
    filterCollections(searchQuery);
  }


  const sortDropDownButton = (
    <div className="inline-flex items-center font-bold whitespace-nowrap rounded-lg text-sm px-1 sm:px-2 md:px-4 py-2 gap-2 bg-gray-200">
      <SortIcon />
      <span className="font-normal text-primary-text hidden md:inline-block">
        Sort By:
      </span>
      <span className="text-ellipsis hidden sm:inline-block">
        {sortType || 'None'} {/* Show current sort type or 'None' if empty */}
      </span>
      <DropdownIcon />
    </div>
  );

  return (
    <Card type="page" title="My Collections">
      {/* Dropdown (Sort Button) */}
      <div className="flex items-center justify-between gap-x-2 gap-y-4">
        <DropdownMenu button={sortDropDownButton}>
          <DropdownItem onClick={() => setSortType('A-Z')}>A-Z</DropdownItem>
          <DropdownItem onClick={() => setSortType('Newest first')}>
            Newest first
          </DropdownItem>
          <DropdownItem onClick={() => setSortType('Recently viewed first')}>
            Recently viewed first
          </DropdownItem>
        </DropdownMenu>

        <div className="w-1/3 items-end">
          <SearchBar
            handleSearch={handleSearch}
            isHandleSearchOnChange={true}
          />
        </div>
      </div>

      {/* Display Loading, Error, or Collections */}
      {isLoading ? (
        <div className="text-center mt-4">Loading collections...</div>
      ) : error ? (
        <div className="text-center mt-4 text-red-500">Error: {error}</div>
      ) : (
          <Collections type="user" collections={collections} />
      )}
    </Card>
  );
};

export default CollectionsPage;