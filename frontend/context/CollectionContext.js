'use client';
import { createContext, useContext, useReducer } from 'react';
import { useDialog } from '@/context/DialogContext';

// Create the context
const CollectionsContext = createContext();

// Initial state
const initialState = {
  collections: [],
  originalCollections: [],
  editingIdx: null,
  isLoading: false,
  error: null,
};

// Reducer function
const collectionsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COLLECTIONS':
      return {
        ...state,
        collections: action.payload,
      };
    case 'ADD_COLLECTION':
      return {
        ...state,
        collections: [...state.collections, action.payload],
        originalCollections: [...state.originalCollections, action.payload],
      };
    case 'UPDATE_COLLECTION': {
      const { index, collection } = action.payload;

      // Update in collections using index
      const updatedCollections = [...state.collections];
      updatedCollections[index] = collection;

      // Update in originalCollections using id
      const updatedOriginalCollections = state.originalCollections.map((oriinalCollection) =>
        oriinalCollection.id === collection.id ? collection : oriinalCollection
      );

      return {
        ...state,
        collections: updatedCollections,
        originalCollections: updatedOriginalCollections,
      };
    }
    case 'REMOVE_COLLECTION': {
      const { index, id } = action.payload;

      // Remove from collections using index
      const updatedCollections = [
        ...state.collections.slice(0, index),
        ...state.collections.slice(index + 1),
      ];

      // Remove from originalCollections using id
      const updatedOriginalCollections = state.originalCollections.filter(
        (collection) => collection.id !== id
      );

      return {
        ...state,
        collections: updatedCollections,
        originalCollections: updatedOriginalCollections,
      };
    }
    case 'UPDATE_AUTHORITY': {
      const { index, is_public } = action.payload;

      // Update in collections using index
      const updatedCollections = [...state.collections];
      updatedCollections[index] = {
        ...updatedCollections[index],
        is_public,
      };

      // Update in originalCollections using id
      const collectionId = updatedCollections[index].id;
      const updatedOriginalCollections = state.originalCollections.map((collection) =>
        collection.id === collectionId ? { ...collection, is_public } : collection
      );

      return {
        ...state,
        collections: updatedCollections,
        originalCollections: updatedOriginalCollections,
      };
    }
    case 'SET_EDITING_IDX':
      return { ...state, editingIdx: action.payload };
    case 'FETCH_COLLECTIONS_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_COLLECTIONS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        collections: action.payload,
        originalCollections: action.payload,
      };
    case 'FETCH_COLLECTIONS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'RESET_COLLECTIONS':
      return { ...state, collections: state.originalCollections };
    default:
      console.error("No method in collection reducer:", action.value)
      return state;
  }
};

// Provider component
export const CollectionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(collectionsReducer, initialState);
  const { showDialog } = useDialog();

  // Actions
  const setCollections = (collections) => {
    dispatch({ type: 'SET_COLLECTIONS', payload: collections });
  };

  const addCollection = (newCollection) => {
    dispatch({ type: 'ADD_COLLECTION', payload: newCollection });
  };

  const updateCollection = (index, updatedCollection) => {
    dispatch({ type: 'UPDATE_COLLECTION', payload: { index, collection: updatedCollection } });
  };

  const removeCollection = (index) => {
    const id = state.collections[index].id;
    dispatch({ type: 'REMOVE_COLLECTION', payload: { index, id } });
  };

  const updateAuthority = (index, is_public) => {
    dispatch({ type: 'UPDATE_AUTHORITY', payload: { index, is_public } });
  };

  const setEditingIdx = (idx) => {
    dispatch({ type: 'SET_EDITING_IDX', payload: idx });
  };

  // Fetch collections
  const fetchCollections = async (url) => {
    if (!url) {
      console.error('URL must be provided');
      dispatch({ type: 'FETCH_COLLECTIONS_FAILURE', payload: 'Internal server error' });
      return;
    }

    dispatch({ type: 'FETCH_COLLECTIONS_REQUEST' });

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error fetching collections:', data.message);
        showDialog('Error!', 'Something went wrong, please try again later.');
        dispatch({ type: 'FETCH_COLLECTIONS_FAILURE', payload: data.message });
        return;
      }

      dispatch({ type: 'FETCH_COLLECTIONS_SUCCESS', payload: data.collections || [] });
    } catch (error) {
      console.error(error);
      showDialog('Error!', 'Something went wrong, please try again later.');
      dispatch({ type: 'FETCH_COLLECTIONS_FAILURE', payload: error.message });
    }
  };

  // Sort collections
  const sortCollections = (sortType) => {
    const sortedCollections = [...state.collections].sort((a, b) => {
      if (sortType === 'A-Z') return a.name.localeCompare(b.name);
      if (sortType === 'Newest first') return new Date(b.created_at) - new Date(a.created_at);
      if (sortType === 'Recently viewed first') return new Date(b.last_viewed_at) - new Date(a.last_viewed_at);
      return 0;
    });
    dispatch({ type: 'SET_COLLECTIONS', payload: sortedCollections });
  };

  // Filter collections
  const filterCollections = (searchQuery) => {

    if (searchQuery.length === 0) {
      dispatch({ type: 'RESET_COLLECTIONS' });
    }
    else {
      // Filter based on the search query
      const filteredCollections = state.originalCollections.filter((collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      dispatch({ type: 'SET_COLLECTIONS', payload: filteredCollections });
    }
  };

  // Context value
  const contextValue = {
    collections: state.collections,
    originalCollections: state.originalCollections,
    editingIdx: state.editingIdx,
    isLoading: state.isLoading,
    error: state.error,
    setCollections,
    addCollection,
    updateCollection,
    removeCollection,
    updateAuthority,
    setEditingIdx,
    fetchCollections,
    sortCollections,
    filterCollections,
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