'use client';

import { useEffect } from 'react';
import { useCollections } from '@/context/CollectionsContext';
import Collections from '@/components/collections/Collections';
import DropdownMenu from '@/components/dropdownMenu/DropdownMenu';
import DropdownItem from '@/components/dropdownMenu/DropdownItem';
import Card from '@/components/Card';
import { SortIcon } from '@/components/icons/SortIcon';
import { DropdownIcon } from '@/components/icons/DropdownIcon';
import SearchBar from '@/components/SearchBar';
import Horizontal_Layout from '@/components/Horizontal_Layout';

const CollectionsPage = () => {
  const {
    sortType,
    fetchCollections,
    sortCollections,
    searchCollections,
  } = useCollections();

  // Fetch collections on mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchCollections('/api/protected/collections');
    }
    fetchData();
  }, []);

  const handleSearch = (searchQuery) => {
    searchCollections(searchQuery);
  }


  const sortDropDownButton = (

      <Horizontal_Layout spacing={"space-x-2.5"} extraStyle='bg-gray-200 rounded-lg whitespace-nowrap font-bold p-2'>
        <SortIcon />
        <span className="font-normal text-primary-text hidden md:inline-block">
          Sort By:
        </span>
        <span className="text-ellipsis hidden sm:inline-block">
          {!sortType ? 'Recently viewed first' : sortType}
        </span>
        <DropdownIcon />
      </Horizontal_Layout>

  );

  return (
    <Card type="page" title="My Collections">
      {/* Dropdown (Sort Button) */}
      <div className="flex items-center justify-between gap-x-2 gap-y-4">
        <DropdownMenu button={sortDropDownButton}>
          <DropdownItem onClick={() => sortCollections('A-Z')}>A-Z</DropdownItem>
          <DropdownItem onClick={() => sortCollections('Newest first')}>
            Newest first
          </DropdownItem>
          <DropdownItem onClick={() => sortCollections('Recently viewed first')}>
            Recently viewed first
          </DropdownItem>
        </DropdownMenu>

        <div className=" items-end">
          <SearchBar
            handleSearch={handleSearch}
            isHandleSearchOnChange={true}
          />
        </div>
      </div>
      <Collections />
    </Card>
  );
};

export default CollectionsPage;