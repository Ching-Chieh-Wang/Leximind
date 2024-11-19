'use client';

import { SessionProvider } from 'next-auth/react';
import Nav from '@/components/Nav';
import '@/styles/globals.css';
import Background from '@/components/Background';
import { WarningProvider } from '@/context/WarningContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <WarningProvider>
              <Background />
              <div className="relative p-2.5 sm:p-4">
                <Nav />
                {children}
              </div>
          </WarningProvider>
        </SessionProvider>
      </body>
    </html>
  );
}