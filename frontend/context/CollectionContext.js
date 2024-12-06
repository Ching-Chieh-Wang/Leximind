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
  type:'unknown',
  status: 'none',
  searchQuery:'',
  sortType: 'none',
  error: null,
};

// Reducer function
const collectionsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COLLECTIONS': {
      const { collections } = action.payload;
      return {
        ...state,
        sortType: 'none',
        status:'viewing',
        editingIdx: -1,
        collections,
        originalCollections: collections,
      };
    }
    case 'ADD_COLLECTION': {
      const { collection } = action.payload;
      return {
        ...state,
        sortType: 'none',
        status: 'viewing',
        editingIdx: -1,
        collections: [...state.collections, collection],
        originalCollections: [...state.originalCollections, collection],
      };
    }
    case 'UPDATE_COLLECTION': {
      const { updatedCollection } = action.payload;
      
      // Update in collections using index
      const updatedCollections = [...state.collections];
      updatedCollections[state.editingIdx] =updatedCollection;
      
      let updatedOriginalCollections;
      // Update in originalCollections using id
      if (state.sortType === 'none') {
        updatedOriginalCollections = [...updatedCollections];
      } else {
        updatedOriginalCollections = state.originalCollections.map((originalCollection) =>
          originalCollection.id === updatedCollection.id
            ? updatedCollection
            : originalCollection
        );
      }
      
      return {
        ...state,
        status: 'viewing',
        editingIdx: -1,
        collections: updatedCollections,
        originalCollections: updatedOriginalCollections,
      };
    }
    case 'REMOVE_COLLECTION': {
      const updatedCollections = [
        ...state.collections.slice(0, state.index),
        ...state.collections.slice(state.index + 1),
      ];

      let updatedOriginalCollections;
      if (state.sortType === 'none') {
        updatedOriginalCollections = [...updatedCollections];
      }
      else {
        updatedOriginalCollections = state.originalCollections.filter(
          (collection) => collection.id !== id
        );
      }

      return {
        ...state,
        status:'viewing',
        editingIdx: -1,
        collections: updatedCollections,
        originalCollections: updatedOriginalCollections,
      };
    }
    case 'UPDATE_AUTHORITY': {
      const { is_public } = action.payload;
      const updatedCollections = [...state.collections];
      updatedCollections[state.editingIndex] = {
        ...updatedCollections[state.editingIndex],
        is_public,
      };

      let updatedOriginalCollections;
      if (state.sortType === 'none') {
        updatedOriginalCollections = [...updatedCollections];
      }
      else {
        updatedOriginalCollections = state.originalCollections.map((collection) =>
          collection.id === updatedCollections[state.editingIdx].id
            ? { ...collection, is_public }
            : collection
        );
      }

      return {
        ...state,
        status:'viewing',
        editingIdx: -1,
        collections: updatedCollections,
        originalCollections: updatedOriginalCollections,
      };
    }
    case 'SORT_COLLECTIONS': {
      const { sortType, sortedCollections } = action.payload;
      return { ...state, editingIdx: -1, status: 'viewing', sortType:sortType, collections:sortedCollections };
    }
    case 'SEARCH_COLLECTIONS':{
      const {searchQuery,searchedCollections}=action.payload;
      return { ...state, editingIdx: -1, status: 'viewing', sortType:'none',searchQuery:searchQuery, collections:searchedCollections };    }
    case 'START_CREATE_COLLECTION_SESSION':
      return { ...state, status: 'adding', editingIdx:-1 };
    case 'START_UPDATE_COLLECTION_SESSION':
      return { ...state, status: 'updating', editingIdx: action.payload };
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
      return { ...state, status: 'viewing', collections: state.originalCollections };
    case 'SET_COLLECTIONS_TYPE':
      return {...state, type:action.payload};
    case 'CANCEL_EDIT_COLLECTION':
      return {...state, editingIdx:-1,status:'viewing'}
    default:
      console.error('No method in collection reducer:', action.type);
      return state;
  }
};

// Provider component
export const CollectionsProvider = ({type,children}) => {
  if(!type){
    console.error("CollectionsProvider needs to provide type");
  }

  const [state, dispatch] = useReducer(collectionsReducer, {...initialState,type:type});
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

      if (response.status === 204) return null; // Handle no-content responses

      const data = await response.json();

      if (!response.ok) {
        showDialog('Error', `Unexpected error: ${data.message || 'Please try again later.'}`);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      showDialog('Error', 'Network error! Please try again later.');
      return null;
    }
  };

  const createCollection = async (url, collection) => {
    const newCollection = await fetchHelper(url, 'POST', collection);
    if (newCollection) {
      dispatch({ type: 'ADD_COLLECTION', payload: newCollection });
    }
  };

  const updateCollection = async (url, name, description, is_public) => {
    const isUpdateSuccess = await fetchHelper(url, 'PUT', {name,description,is_public});
    const updatedCollection={...state.collections[state.editingIdx],name:name,description:description,is_public:is_public}
    if (isUpdateSuccess) {
      dispatch({ type: 'UPDATE_COLLECTION', payload: {  updatedCollection } });
    }
  };

  const removeCollection = async (url, index, id) => {
    const isRemoveSuccess = await fetchHelper(url, 'DELETE');
    if (isRemoveSuccess) {
      dispatch({ type: 'REMOVE_COLLECTION', payload: { index, id } });
    }
  };

  const updateAuthority = async (url, index, is_public) => {
    const updateSuccess = await fetchHelper(url, 'PUT', { is_public });
    if (updateSuccess) {
      dispatch({ type: 'UPDATE_AUTHORITY', payload: { index, is_public } });
    }
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
    if (sortType!='A-Z'&&sortType!='Newest first'&&sortType!='Recently viewed first'&&sortType!='None') {
      console.error('SortType not supported:', sortType);
      dispatch({ type: 'FETCH_COLLECTIONS_FAILURE', payload: 'SortType not suppport' });
      return;
    }
    let sortedCollections;
    if(sortType=='None'){
      sortedCollections=[...state.originalCollections]
    }
    else{
      sortedCollections = [...state.collections].sort((a, b) => {
        if (sortType === 'A-Z') return a.name.localeCompare(b.name);
        if (sortType === 'Newest first') return new Date(b.created_at) - new Date(a.created_at);
        if (sortType === 'Recently viewed first') return new Date(b.last_viewed_at) - new Date(a.last_viewed_at);
        return 0;
      });
    }

    dispatch({ type: 'SORT_COLLECTIONS', payload: {sortType, sortedCollections} });
  };

  const searchCollections = (searchQuery) => {
    if (!searchQuery) {
      dispatch({ type: 'RESET_COLLECTIONS' });
    } else {
      const searchedCollections = state.originalCollections.filter((collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      dispatch({ type: 'SEARCH_COLLECTIONS', payload: {searchQuery, searchedCollections} });
    }
  };

  const startUpdateCollectionSession = (index) => {
    dispatch({ type: 'START_UPDATE_COLLECTION_SESSION', payload: index });
  };

  const startCreateCollectionSession = () => {
    dispatch({ type: 'START_CREATE_COLLECTION_SESSION' });
  };
  const setCollectionsType = (type) => {
    dispatch({ type: 'SET_COLLECTIONS_TYPE',payload:type });
  };

  const cancelEditCollection=()=>{
    dispatch({ type: 'CANCEL_EDIT_COLLECTION' });
  }

  const contextValue = {
    ...state,
    type,
    createCollection,
    setCollectionsType,
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