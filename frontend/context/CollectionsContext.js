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
  type: null,
  status: 'loading',
  searchQuery: null,
  sortType: null,
  error: null,
};

// Reducer function
const collectionsReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_COLLECTION': {
      const { newCollection } = action.payload;
      return {
        ...state,
        sortType: null,
        status: 'viewing',
        editingIdx: null,
        collections: [newCollection, ...state.collections,],
        originalCollections: [newCollection, ...state.originalCollections,],
      };
    }
    case 'UPDATE_COLLECTION': {
      const { updatedCollection } = action.payload;

      // Update in collections using index
      const updatedCollections = [...state.collections];
      updatedCollections[state.editingIdx].name=updatedCollection.name;
      updatedCollections[state.editingIdx].description=updatedCollection.description;
      updatedCollections[state.editingIdx].is_public=updatedCollection.is_public;

      return {
        ...state,
        status: 'viewing',
        editingIdx: null,
      };
    }
    case 'REMOVE_COLLECTION': {
      const { index } = action.payload;
      const { id } = state.collections[index]
      const updatedCollections = [
        ...state.collections.slice(0, index),
        ...state.collections.slice(index + 1),
      ];

      let updatedOriginalCollections;
      if (state.sortType===null&&state.searchQuery===null) {
        updatedOriginalCollections = [...updatedCollections];
      }
      else {
        updatedOriginalCollections = state.originalCollections.filter(
          (collection) => collection.id !== id
        );
      }

      return {
        ...state,
        status: 'viewing',
        editingIdx: null,
        collections: updatedCollections,
        originalCollections: updatedOriginalCollections,
      };
    }
    case 'UPDATE_AUTHORITY': {
      const { is_public,index } = action.payload;
      const updatedCollections = [...state.collections];
      updatedCollections[index].is_public=is_public;

      return {
        ...state,
        status: 'viewing',
        editingIdx: null,
      };
    }
    case 'SORT_COLLECTIONS': {
      const { sortType, sortedCollections } = action.payload;
      return { ...state, editingIdx: null, status: 'viewing', sortType: sortType, collections: sortedCollections };
    }
    case 'SEARCH_COLLECTIONS': {
      const { searchQuery, searchedCollections } = action.payload;
      return { ...state, editingIdx: null, status: 'viewing', sortType: null, searchQuery: searchQuery, collections: searchedCollections };
    }
    case 'START_CREATE_COLLECTION_SESSION':
      return { ...state, status: 'adding', editingIdx: null };
    case 'START_UPDATE_COLLECTION_SESSION':
      const { index } = action.payload
      return { ...state, status: 'updating', editingIdx: index };
    case 'FETCH_COLLECTIONS_REQUEST':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_COLLECTIONS_SUCCESS':
      return {
        ...state,
        status: 'viewing',
        collections: action.payload,
        originalCollections: action.payload,
      };
    case 'FETCH_COLLECTIONS_FAILURE':
      return { ...state, status: 'error', error: action.payload };
    case 'RESET_COLLECTIONS':
      return { ...state, status: 'viewing', sortType: null, editingIdx: null, collections: state.originalCollections };
    case 'SET_COLLECTIONS_TYPE':
      return { ...state, type: action.payload };
    case 'CANCEL_EDIT_COLLECTION':
      return { ...state, editingIdx: null, status: 'viewing' }
    default:
      console.error('No method in collection reducer:', action.type);
      return state;
  }
};

// Provider component
export const CollectionsProvider = ({ type, children }) => {
  if (!type) {
    console.error("CollectionsProvider needs to provide type");
  }
  if (type !== 'user' && type !== 'global') {
    console.error("type must be either user or global but given:", type)
  }

  const [state, dispatch] = useReducer(collectionsReducer, { ...initialState, type: type });
  const { showDialog } = useDialog();

  const fetchHelper = async (url, method, body = null) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      const data = await response.json();

      if (!response.ok) {
        const refershPage = () => { window.location.reload() };
        showDialog({ title: 'Error', description: `Unexpected error: ${data.message || 'Please try again later.'}`, onOk: refershPage, onCancel: refershPage });
        return null;
      }

      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      showDialog({ title: 'Error', description: `Unexpected error: ${data.message || 'Please try again later.'}`, onOk: refershPage, onCancel: refershPage });
      return null;
    }
  };

  const createCollection = async (url, collection) => {
    const data = await fetchHelper(url, 'POST', collection);
    if (data) {
      const newCollection = { ...collection, id: data.id, view_cnt: 0, last_viewed_at: null, save_cnt: 0, created_at: data.created_at, word_cnt: 0 }
      dispatch({ type: 'CREATE_COLLECTION', payload: { newCollection } });
    }

  };

  const updateCollection = (url, collection) => {
    fetchHelper(url, 'PUT', collection);
    const updatedCollection = { ...state.collections[state.editingIdx], name: collection.name, description: collection.description, is_public: collection.is_public }
    dispatch({ type: 'UPDATE_COLLECTION', payload: { updatedCollection } });
  };

  const removeCollection =  (url, index, id) => {
    fetchHelper(url, 'DELETE');
    dispatch({ type: 'REMOVE_COLLECTION', payload: { index, id } });
  };

  const updateAuthority =  (url, index, is_public) => {
    fetchHelper(url, 'PUT', { is_public });
    dispatch({ type: 'UPDATE_AUTHORITY', payload: { index, is_public } });
  };

  const fetchCollections = async (url) => {
    if (!url) {
      console.error('URL must be provided');
      dispatch({ type: 'FETCH_COLLECTIONS_FAILURE', payload: 'Internal server error' });
      return;
    }

    dispatch({ type: 'FETCH_COLLECTIONS_REQUEST' });

    const data = await fetchHelper(url, 'GET');
    if (data) {
      dispatch({ type: 'FETCH_COLLECTIONS_SUCCESS', payload: data.collections || [] });
    } else {
      dispatch({ type: 'FETCH_COLLECTIONS_FAILURE', payload: 'Failed to fetch collections' });
    }
  };

  const sortCollections = (sortType) => {
    if (sortType != 'A-Z' && sortType != 'Newest first' && sortType != 'Recently viewed first' && sortType != 'None') {
      console.error('SortType not supported:', sortType);
      dispatch({ type: 'FETCH_COLLECTIONS_FAILURE', payload: 'SortType not suppport' });
      return;
    }
    let sortedCollections;
    if (sortType == 'None') {
      sortedCollections = [...state.originalCollections]
    }
    else {
      sortedCollections = [...state.collections].sort((a, b) => {
        if (sortType === 'A-Z') return a.name.localeCompare(b.name);
        if (sortType === 'Newest first') return new Date(b.created_at) - new Date(a.created_at);
        if (sortType === 'Recently viewed first') return new Date(b.last_viewed_at) - new Date(a.last_viewed_at);
        return 0;
      });
    }

    dispatch({ type: 'SORT_COLLECTIONS', payload: { sortType, sortedCollections } });
  };

  const searchCollections = (searchQuery) => {
    if (!searchQuery) {
      dispatch({ type: 'RESET_COLLECTIONS' });
    } else {
      const searchedCollections = state.originalCollections.filter((collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      dispatch({ type: 'SEARCH_COLLECTIONS', payload: { searchQuery, searchedCollections } });
    }
  };

  const startUpdateCollectionSession = (index) => {
    dispatch({ type: 'START_UPDATE_COLLECTION_SESSION', payload: { index } });
  };

  const startCreateCollectionSession = () => {
    dispatch({ type: 'START_CREATE_COLLECTION_SESSION' });
  };

  const cancelEditCollection = () => {
    dispatch({ type: 'CANCEL_EDIT_COLLECTION' });
  }

  const contextValue = {
    ...state,
    createCollection,
    updateCollection,
    removeCollection,
    updateAuthority,
    fetchCollections,
    sortCollections,
    searchCollections,
    startUpdateCollectionSession,
    startCreateCollectionSession,
    cancelEditCollection
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