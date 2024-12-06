'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCollections } from '@/context/CollectionContext';
import Collections from '@/components/Collection/Collections';
import Card from '@/components/Card';

const CollectionSearchPage = () => {
  const { collections, fetchCollections } = useCollections();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query');

  useEffect(() => {
    fetchCollections(`/api/collections/search?query=${searchQuery}&page=1&limit=50`)
  }, [searchParams.get('query')]);
  return (
    collections ?
      (<Card type="page" title={`Search collection: "${searchQuery}"`}>
        {/* Display Collections */}
        <Collections type='global' />
      </Card>) : null
  )
};

export default CollectionSearchPage;