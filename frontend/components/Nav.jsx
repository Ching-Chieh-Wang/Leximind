'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const Nav = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown element
  const buttonRef = useRef(null); // Reference for the dropdown toggle button
  const router=useRouter();

  // Toggle dropdown menu
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    setIsDropdownOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/')
  };

  // Close dropdown when clicking outside or pressing any key
  useEffect(() => {
    // Handler to close dropdown when clicking outside
    const handleClickOutside = (event) => {
        setIsDropdownOpen(false);
    };

    // Handler to close dropdown on any key press
    const handleKeyPress = (event) => {
      setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleKeyPress);
    }

    // Cleanup event listeners when dropdown is closed
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="flex justify-between items-center p-4 bg-transparent">
      {/* Logo and Brand Name */}
      <Link href="/" className="text-xl font-bold flex items-center space-x-6">
        <Image src="/assets/images/logo.jpg" width={60} height={60} alt="Logo" />
        <span>LexiMind</span>
      </Link>

      {/* Navigation Links and User Section */}
      <div className="flex items-center space-x-4">
        {session ? (
          // User is logged in
          <div className="relative" ref={dropdownRef}>
            <button
              ref={buttonRef}
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <span>{`Hi, ${session?.user?.username || session?.user?.name || 'User'}`}</span>
              <Image
                src={session?.user?.image || '/assets/images/logo.jpg'}
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                alt="Profile"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
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