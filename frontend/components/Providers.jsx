'use client'; // Mark this as a client component

import { SessionProvider } from 'next-auth/react';
import { WarningProvider } from '@/context/WarningContext';

const Providers = ({ children, initialSession }) => {
  return (
    <SessionProvider session={initialSession}>
      <WarningProvider>
        {children}
      </WarningProvider>
    </SessionProvider>
  );
};

export default Providers;