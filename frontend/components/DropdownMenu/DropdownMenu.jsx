// components/DropdownMenu.jsx

'use client';

import { useState, useRef, useEffect } from 'react';

const DropdownMenu = ({ button, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

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
        !buttonRef.current.contains(event.target)
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

  return (
    <div className="relative inline-block text-left">
      <button onClick={toggleDropdown} ref={buttonRef}>
        {button}
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-1 shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 rounded-md" // Added 'rounded-md' here
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