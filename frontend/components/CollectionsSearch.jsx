'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';

const CollectionsSearch = () => {
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
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      className={`transition-all duration-700 ${!isFocused && 'opacity-50 '
        }`}
    >
      <SearchBar handleSearch={handleSearch} />
    </div>
  )


}

export default CollectionsSearch