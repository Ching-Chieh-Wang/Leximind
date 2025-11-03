'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProtectedLayout = ({ children }) => {
  const router = useRouter();

const { } = useSession({
  required: true,
  onUnauthenticated: () => {
    // Let NextAuth mark status as 'unauthenticated' first
    setTimeout(() => router.replace('/login'), 0);
  },
});

  return <>{children}</>;
};

export default ProtectedLayout;