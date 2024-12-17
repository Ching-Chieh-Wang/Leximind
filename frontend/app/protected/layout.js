'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProtectedLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Run effect only when the status changes
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]); // Only depend on 'status'

  // Render children only when authenticated
  if (status === 'loading') {
    return <div>Loading...</div>; // Optional loading state
  }

  if (status !== 'authenticated') {
    return null; // Prevent rendering during redirect
  }

  return <>{children}</>;
};

export default ProtectedLayout;