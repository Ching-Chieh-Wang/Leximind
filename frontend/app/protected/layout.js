'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const ProtectedLayout = ({children}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
    useEffect(() => {
        if (status === 'unauthenticated') {
          router.push('/login')
        }
      }, [session, status]);
  return (
    <div>{children}</div>
  )
}

export default ProtectedLayout