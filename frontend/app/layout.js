'use client';

import { SessionProvider } from 'next-auth/react';
import Nav from '@/components/Nav';
import '@/styles/globals.css';
import Background from '@/components/Background';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="bg-white md:mb-[400px] lg:mb-[300px]  isolate">
            <Background/>
            
            <div className=" relative  w-full">
              <Nav/>
              {children}
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}