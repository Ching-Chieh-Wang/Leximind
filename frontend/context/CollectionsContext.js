'use client';

import { createContext, useContext, useReducer } from 'react';
import { createCollection as createCollectionAPI } from '@/api/collection/Collection';
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
      const {name,description,is_public}=updatedCollection

      state.collections[state.editingIdx].name = name;
      state.collections[state.editingIdx].description = description;
      state.collections[state.editingIdx].is_public = is_public;

      return {
        ...state,
        status: 'viewing',
        editingIdx: null,
      };
    }
    case "UPDATE_AUTHORITY":{
      const {index,is_public}=action.payload;
      state.collections[index].is_public=is_public
      return {...state}
    }
    case 'REMOVE_COLLECTION': {
      const { index } = action.payload;
      const { id } = state.collections[index]
      const updatedCollections = [
        ...state.collections.slice(0, index),
        ...state.collections.slice(index + 1),
      ];

      let updatedOriginalCollections;
      if (state.sortType === null && state.searchQuery === null) {
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

    case 'SORT_COLLECTIONS': {
      const { sortType, sortedCollections } = action.payload;
      return { ...state, editingIdx: null, status: 'viewing', sortType: sortType, collections: sortedCollections };
    }
    case 'SEARCH_COLLECTIONS': {
      const { searchQuery, searchedCollections } = action.payload;
      return { ...state, editingIdx: null, status: 'viewing', sortType: null, searchQuery: searchQuery, collections: searchedCollections };
    }
    case 'START_CREATE_COLLECTION_SESSION':
      return { ...state, status: 'creatingCollection', editingIdx: null };
    case 'START_UPDATE_COLLECTION_SESSION':
      const { index } = action.payload
      return { ...state, status: 'updatingCollection', editingIdx: index };
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
    case 'CREATE_COLLECTION_LOADING':
      return { ...state, status: 'createCollectionLoading' }
    case 'RESET_COLLECTIONS':
      return { ...state, status: 'viewing', sortType: null, editingIdx: null, collections: state.originalCollections };
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
  const refershPage = () => { window.location.reload() };

const fetchHelper = async (url, method, body = null, isShowErr = true) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body && { body: JSON.stringify(body) }),
        credentials: 'include', // add if you’re using protected routes
      });


      if (!response.ok) {
        showDialog({
          title: 'Error',
          description: `Something went wrong. Please come back later.`,
          onOk: refershPage,
        });
        if (response.status === 404)
          console.error('Error', 'API URL not found:', url);
        return null;
      }

      const text = await response.text();
      if (text.startsWith('<!DOCTYPE html>')) {
        window.location.href = url;
        return null;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Invalid JSON response:', text);
        throw new Error('Invalid JSON response');
      }
      return data;
    } catch (error) {
      console.error('Fetch error:',url, method,  error);
      if (isShowErr)
        showDialog({
          title: 'Error',
          description: 'Error: Please try again later.',
          onOk: refershPage,
        });
      return null;
    }
  };

  const createCollection = async ( name,description,is_public) => {
    dispatch({type:'CREATE_COLLECTION_LOADING'})
    const [data, error] = await createCollectionAPI(name,description,is_public);
    if(error){
      throw error;
    }
    const newCollection = { name,description,is_public, id: data.id, view_cnt: 0, last_viewed_at: null, save_cnt: 0, created_at: data.created_at, word_cnt: 0 }
    dispatch({ type: 'CREATE_COLLECTION', payload: { newCollection } });
    return data
  };

  const updateCollection = (url, name,description,is_public) => {
    const data=fetchHelper(url, 'PUT', {name,description,is_public});
    if(!data){
      return {errors:{path:'general',msg:'Unexptected error! Please try again later.'}}
    }
    if(data.errors==null){
      const updatedCollection = { ...state.collections[state.editingIdx], name, description, is_public }
      dispatch({ type: 'UPDATE_COLLECTION', payload: { updatedCollection } });
    }
  };

  const removeCollection = (url, index, id) => {
    fetchHelper(url, 'DELETE');
    dispatch({ type: 'REMOVE_COLLECTION', payload: { index, id } });
  };

  const updateCollectionAuthority = (url, index) => {
    const is_public=!state.collections[index].is_public;
    fetchHelper(url, 'PUT', { is_public});
    dispatch({ type: 'UPDATE_AUTHORITY', payload: {index,is_public}});
  };

  const fetchCollections = async (url) => {
    if (!url) {
      console.error('URL must be provided');
      dispatch({ type: 'FETCH_COLLECTIONS_FAILURE', payload: 'Internal server error' });
      return;
    }

    dispatch({ type: 'FETCH_COLLECTIONS_REQUEST' });

    const collections = await fetchHelper(url, 'GET');
    if (collections) {
      dispatch({ type: 'FETCH_COLLECTIONS_SUCCESS', payload: collections });
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
    updateCollectionAuthority,
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