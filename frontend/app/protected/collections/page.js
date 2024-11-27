'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCollections, CollectionsProvider } from '@/context/CollectionContext';
import Collections from '@/components/Collection/Collections';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import Card from '@/components/Card';
import { useDialog } from '@/context/DialogContext';
import { SortIcon } from '@/components/icons/SortIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import { DropdownIcon } from '@/components/icons/DropdownIcon';

const CollectionsPage = () => {
  const { showDialog } = useDialog();
  const { status } = useSession();
  const router = useRouter();
  const [fetchedCollections, setFetchedCollections] = useState([]);
  const {
    collections,
    setCollections,
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
        const data = await response.json(); // Parse the JSON response
        if (!response.ok) {
          console.log("Error fetching collections:", data.message);
          showDialog('Error!', 'Something went wrong, please try again later.');
        }

        setFetchedCollections(data.collections || []);
        setCollections(data.collections || [])
      } catch (error) {
        console.error(error);
        showDialog('Error!', 'Something went wrong, please try again later.');
      }
    };

    fetchCollections();
    setSortType('Recently viewed first~') // Avoid trigger sorting
  }, []);


  useEffect(() => {

    // Search Filter
    if (searchQuery.length != 0) {
      console.log(searchQuery)
      setCollections([...fetchedCollections].filter((collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      console.log(collections)
      setSortType('Recently viewed first~') // Avoid trigger sorting
    }
    else setCollections([...fetchedCollections])
  }, [searchQuery]);

  useEffect(() => {
    console.log(sortType)
    setCollections([...collections].sort((a, b) => {
      if (sortType === 'A-Z') return a.name.localeCompare(b.name);
      if (sortType === 'Newest first') return new Date(a.created_at) - new Date(b.created_at);
      if (sortType === 'Recently viewed first') return new Date(b.last_viewed_at) - new Date(a.last_viewed_at);

      return 0;
    }));
    console.log(collections)
  }, [sortType]);

  const sortDropDownButton = (
    <div
      className=" inline-flex  items-center font-bold whitespace-nowrap rounded-lg text-sm    px-1 sm:px-2 md:px-4 py-2  gap-2  bg-gray-200 "
    >
      <SortIcon />
      <span className="font-normal text-primary-text hidden md:inline-block">
        Sort By:
      </span>
      <span className="text-ellipsis hidden sm:inline-block">
        {sortType } {/* Show current sort type */}
      </span>
      <DropdownIcon />
    </div>
  )


  return (
    <Card type="page" title="My Collections">
      {/* Search and Sort Section */}
      <div className="shadow-lg shadow-indigo-200">
        <Card type="card" >
          {/* Dropdown (Sort Button) */}
          <div className='flex items-center  gap-x-2 gap-y-4'>
            <DropdownMenu button={sortDropDownButton}>
              <DropdownItem onClick={() => { setSortType('A-Z')  }}>A-Z</DropdownItem>
              <DropdownItem onClick={() => { setSortType('Newest first')}}>Newest first</DropdownItem>
              <DropdownItem onClick={() => { setSortType('Recently viewed first') }}>Recently viewed first'</DropdownItem>
            </DropdownMenu>


            <div className=" h-9 w-0.5 bg-indigo-400"></div>

            {/* Search Input */}
            <SearchIcon size="25" />
            <input
              className="w-full bg-transparent focus:outline-none placeholder:text-gray-500 text-clip truncate"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>
      </div>

      {/* Display Collections */}
      <Collections type="user" />
    </Card>
  );
};

export default CollectionsPage

