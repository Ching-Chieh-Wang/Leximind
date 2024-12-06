'use client';
import { useEffect } from 'react';
import { useCollections } from '@/context/CollectionContext';
import Collections from '@/components/Collection/Collections';
import Card from '@/components/Card';

const RecentlyViewedCollectionsComponent = () => {
  const { collections, fetchCollections } = useCollections();

  useEffect(() => {
    fetchCollections('/api/protected/collections?page=1&limit=3')
  }, [])

  return collections && collections.length !== 0 ? (
    <Card type="page" title="Recently viewed collections">
      <Collections />
    </Card>
  ) : null;
};


export default RecentlyViewedCollectionsComponent;