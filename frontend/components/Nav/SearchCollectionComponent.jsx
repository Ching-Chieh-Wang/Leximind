'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '../SearchBar';

const SearchCollectionComponent = () => {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (searchValue) => {
    if (searchValue.trim()) {
      // Pass searchValue as a query parameter
      router.push(`/collections/search?query=${encodeURIComponent(searchValue.trim())}`);
    } else {
      alert('Please enter a search term.');
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
  };

  return (
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      className={`transition-all duration-700 ${
        !isFocused &&  'opacity-50'
      }`}
    >
      <SearchBar handleSearch={handleSearch} />
    </div>
  );
};

export default SearchCollectionComponent;