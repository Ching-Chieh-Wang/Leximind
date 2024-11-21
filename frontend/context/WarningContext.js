'use client';
import Button from '@/components/buttons/Button';


import { createContext, useContext, useState, useEffect } from 'react';

const WarningContext = createContext();

export const WarningProvider = ({ children }) => {
  const [warning, setWarning] = useState(null);
  const [handleOK, setHandleOk] = useState(null);

  const showWarning = (message) => {
    setWarning(message);
    setTimeout(() => {
      clearWarning(); // Automatically clear the warning after 5 seconds
    }, 5000);
  };

  const clearWarning = () => {
    setWarning(null);
    setHandleOk(null);
  }

  // Disable scrolling when the warning is displayed
  useEffect(() => {
    if (warning) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = ''; // Re-enable scrolling
    }

    // Cleanup to reset overflow style on component unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [warning]);

  return (
    <WarningContext.Provider value={{ warning, showWarning }}>
      {/* Render the warning modal outside the regular children flow */}
      {children}
      {warning  && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background with opacity
            backdropFilter: 'blur(5px)', // Optional blur effect for aesthetics
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="text-gray-800 mb-4">{warning}</p>
            <Button onClick={setHandleOk} >
              OK
            </Button>
            <Button onClick={clearWarning} >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </WarningContext.Provider>
  );
};

export const useWarning = () => useContext(WarningContext);