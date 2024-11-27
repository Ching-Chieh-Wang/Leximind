'use client'
import  { createContext, useContext, useState } from 'react';

// Create the context
const CollectionsContext = createContext();

// Provider component
export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  const [editingIdx,setEditingIdx]=useState(null);

  // Add a collection optimistically
  const addCollection = (newCollection) => {
    setCollections((prev) => [...prev,newCollection]); // Adding at the top for immediate display
  };

  // Update a collection optimistically
  const updateCollection = (updatedCollection) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === updatedCollection.id ? updatedCollection : collection
      )
    );
  };

  // Remove a collection optimistically
  const removeCollection = (id) => {
    setCollections((prev) => prev.filter((collection) => collection.id !== id));
  };

  // Context value
  const contextValue = {
    collections,
    setCollections, // Expose setCollections
    addCollection,
    updateCollection,
    removeCollection,
    editingIdx,
    setEditingIdx
  };

  return (
    <CollectionsContext.Provider value={contextValue}>
      {children}
    </CollectionsContext.Provider>
  );
};

// Custom hook for using the context
export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
};