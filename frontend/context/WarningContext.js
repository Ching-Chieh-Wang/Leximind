'use client';

import { createContext, useContext, useState } from 'react';

const WarningContext = createContext();

export const WarningProvider = ({ children }) => {
  const [warning, setWarning] = useState('');

  const showWarning = (message) => {
    setWarning(message);
    setTimeout(() => {
      clearWarning(); // Automatically clear the warning after 5 seconds
    }, 999999999);
  };

  const clearWarning = () => setWarning('');

  return (
    <WarningContext.Provider value={{ warning, showWarning }}>
      {/* Render the warning modal outside the regular children flow */}
        {children}
        {/* {warning !== '' && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background with opacity
              backdropFilter: 'blur(5px)', // Optional blur effect for aesthetics
            }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
              <p className="text-gray-800 mb-4">{warning}</p>
              <button
                onClick={clearWarning}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                OK
              </button>
            </div>
          </div>
        )} */}
    </WarningContext.Provider>
  );
};

export const useWarning = () => useContext(WarningContext);