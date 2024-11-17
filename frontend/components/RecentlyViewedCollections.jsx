'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Collections from '@/components/Collection/Collections';

const RecentlyViewedCollections = () => {
  const { data: session } = useSession();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      if (session) {
        try {
          const res = await fetch('/api/protected/collections', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const data = await res.json();

          // Only set collections if data is not empty
          if (data && data.length > 0) {
            setCollections(data);
          }
        } catch (error) {
          console.error("Failed to fetch collections:", error);
        }
      }
    };

    fetchCollections();
  }, [session]);

  // Do not render component if collections is empty
  if (collections.length === 0) return null;

  return <Collections title="Recently Viewed" collections={collections}/>;
};

export default RecentlyViewedCollections;