'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/buttons/Button';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/components/icons/ProfileIcon';
import LogoutIcon from '@/components/icons/LogoutIcon';
import CollectionIcon from './icons/CollectionIcon';

const Nav = () => {
  const { data: session } = useSession();

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Define the dropdown button
  const dropdownButton = (
    <Image
      src={session?.user?.image || '/assets/images/logo.jpg'}
      width={40}
      height={40}
      className="rounded-full cursor-pointer"
      alt="Profile"
    />
  );

  return (
    <nav className="flex justify-between items-center p-4 bg-transparent">
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center space-x-4 sm:space-x-6">
        <Image
          src="/assets/images/logo.jpg"
          width={40}
          height={40}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
          alt="Logo"
        />
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-manrope font-black leading-snug text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-indigo-400 to-sky-300">
          LexiMind
        </h2>
      </Link>

      {/* Navigation Links and User Section */}
      <div className="flex items-center space-x-4">
        {session ? (
          <div className="flex items-center space-x-4">
            {/* Manage Account Button */}
            <Link href='protected/collections' className="inline-flex h-10 items-center justify-center rounded-md border border-gray-400 bg-gray-100 px-4 font-medium text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:bg-gray-300 text-xs sm:text-sm md:text-base lg:text-lg gap-x-1 sm:gap-x-2 md:gap-x-3">
              <CollectionIcon />
              Collections
            </Link>

            {/* Profile Dropdown */}
            <DropdownMenu button={dropdownButton}>
              <DropdownItem>
                <DropdownItem>
                  <div>
                    <h1 className="text-base font-semibold">{session?.user?.username}</h1>
                    <p className="text-sm text-gray-500 mt-1">{session?.user?.email}</p>
                  </div>
                </DropdownItem>
              </DropdownItem>
              <hr className="my-2"></hr>
              <DropdownItem
                href="/protected/profile"
                icon={<ProfileIcon size="14" />}
                label="Profile"
              />
              <DropdownItem
                onClick={handleLogout}
                icon={<LogoutIcon size="14" />}
                label="Logout"
              />
            </DropdownMenu>
          </div>
        ) : (
          // User is not logged in
          <>
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>

            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;