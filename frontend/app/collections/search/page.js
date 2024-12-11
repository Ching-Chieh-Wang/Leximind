'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCollections } from '@/context/CollectionsContext';
import Collections from '@/components/Collection/Collections';
import Card from '@/components/Card';

const CollectionSearchPage = () => {
  const { fetchCollections } = useCollections();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query');
  useEffect(() => {
    fetchCollections(`/api/collections/search?query=${searchQuery}&page=1&limit=50`)
  }, [searchParams.get('query')]);
  return (
      (<Card type="page" title={ searchQuery =='' ? "Popular collections": `Search collection: "${searchQuery}"`}>
        <Collections />
      </Card>) 
  )
};

export default CollectionSearchPage;