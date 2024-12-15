// components/DropdownMenu.jsx

'use client';

import { useState, useRef, useEffect } from 'react';

const DropdownMenu = ({ button, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef= useRef(null);

  // Toggle dropdown menu
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    setIsOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        !event.target.closest('[data-keep-open="true"]') // Keep the dropdown open if `data-keep-open="true"`
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown when pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

   // Adjust dropdown position dynamically
   useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      if (menuRect.left < 0) {
        // Dropdown is overflowing to the left
        menuRef.current.style.left = `0px`;
        menuRef.current.style.right = 'auto';
      } else if (menuRect.right > windowWidth) {
        // Dropdown is overflowing to the right
        menuRef.current.style.left = 'auto';
        menuRef.current.style.right = `0px`;
      }
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button onClick={toggleDropdown} ref={buttonRef}>
        {button}
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="origin-top-right absolute left-auto right-0 mt-1 shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40 rounded-md" // Added 'rounded-md' here
          aria-orientation="vertical"
        >
          <ul className="py-2">
            {children}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;