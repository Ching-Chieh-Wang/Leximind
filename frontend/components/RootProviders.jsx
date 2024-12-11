'use client'
import { SessionProvider } from 'next-auth/react';
import { DialogProvider } from '@/context/DialogContext';

const RootProviders = ({ children }) => {
  return (
    <SessionProvider >
      <DialogProvider>
          {children}
      </DialogProvider>
    </SessionProvider>
  );
};

export default RootProviders;