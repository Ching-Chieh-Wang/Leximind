'use client';
import { useEffect } from 'react';
import { useCollections } from '@/context/CollectionsContext';
import Collections from '@/components/Collections/Collections';
import Card from '@/components/Card';
import { useSession } from 'next-auth/react';




const RecentlyViewedCollectionsComponent = () => {
  const { status } = useSession();
  const { collections, fetchCollections,  } = useCollections();

  useEffect(() => {
    if(status=="authenticated")fetchCollections('/api/protected/collections?page=1&limit=3')
  }, [status])


  return status=="authenticated"&&collections&&collections.length != 0 ? (
    <Card type="page" title="Recently viewed collections">
      <Collections/>
    </Card>
  ) : null;
};


export default RecentlyViewedCollectionsComponent;