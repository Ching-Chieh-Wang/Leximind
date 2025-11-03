'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Block from '../Block';
import Link from 'next/link';
import SearchIcon from '../icons/SearchIcon';
import SearchBar from '../SearchBar';

const SearchCollectionComponent = () => {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (searchValue) => {
    // Pass searchValue as a query parameter
    router.push(`/collections/search?query=${encodeURIComponent(searchValue.trim())}`);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
  };

  return (
    <div>
      <div
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={`transition-all duration-700 ${!isFocused && 'opacity-50 block [@media(max-width:500px)]:hidden'
          }`}
      >
        <SearchBar handleSearch={handleSearch} />
      </div>
      <div className="hidden [@media(max-width:500px)]:block">
        <Block>
          <Link href="/collections/search?query=">
            <SearchIcon size={22} />
          </Link>
        </Block>
      </div>
    </div>


  );
};

export default SearchCollectionComponent;