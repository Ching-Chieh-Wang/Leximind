'use client'
import { SessionProvider } from 'next-auth/react';
import { DialogProvider } from '@/context/DialogContext';

const RootProviders = ({ children }) => {
  return (
    <SessionProvider refetchOnWindowFocus={true} refetchInterval={5 * 60}>
      <DialogProvider>
          {children}
      </DialogProvider>
    </SessionProvider>
  );
};

export default RootProviders;