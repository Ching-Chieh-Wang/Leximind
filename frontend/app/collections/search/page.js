'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCollections } from '@/context/CollectionsContext';
import Collections from '@/components/collections/Collections';
import Card from '@/components/Card';
import CollectionsSearch from '@/components/CollectionsSearch';

export default function CollectionSearchPage() {
  const { fetchCollections } = useCollections();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query');

  useEffect(() => {
    fetchCollections(`/api/collections/search?query=${searchQuery}&page=1&limit=50`);
  }, [searchQuery]);

  return (

      <Card
        type="page"
        title={searchQuery === '' ? "Popular collections" : `Search collection: "${searchQuery}"`}
      >
        <div className="flex justify-end w-full">
           <div className="w-3/4 max-w-80">
              <CollectionsSearch />
           </div>
        </div>
       
        <Collections />
      </Card>

  );
}