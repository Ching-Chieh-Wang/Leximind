'use client';

import { createContext, useContext, useReducer } from 'react';
import { useDialog } from '@/context/DialogContext';

// Create the context
const CollectionContext = createContext();

// Initial state
const initialState = {
  collectionName: '',
  words: [],
  labels: [],
  memorized_cnt: 0,
  originalWords: [],
  viewingWordIdx: 0,
  editingWordIdx:null,
  editingLabelIdx:null,
  status: 'loading',
  searchQuery: null,
  error: null,
};

// Reducer function
const collectionReducer = (state, action) => {
  switch (action.type) {
    case 'VIEW_NEXT_WORD':
      return { ...state, editingWordIdx: null,editingLabelIdx:null, status: 'viewing', viewingIdx:state.viewingIdx+1 };
    case 'VIEW_PREV_WORD':
      return { ...state, editingWordIdx: null,editingLabelIdx:null, status: 'viewing', viewingIdx:state.viewingIdx-1 };
    case 'ADD_WORD': {
      const { word } = action.payload;
      return {
        ...state,
        status: 'viewing',
        editingWordIdx:null,
        editingLabelIdx:null,
        words: [...state.words, word],
        originalWords: [...state.originalWords, word],
      };
    }
    case 'UPDATE_WORD': {
      const { updatedWord } = action.payload;
      const updatedWords = [...state.words];
      updatedWords[state.editingWordIdx].name=updatedWord.name;
      updatedWords[state.editingWordIdx].description=updatedWord.description;
      updatedWords[state.editingWordIdx].image_path=updatedWord.image_path;

      return {
        ...state,
        status: 'viewing',
        editingWordIdx:null,
        editingLabelIdx:null,
      };
    }
    case 'REMOVE_WORD': {
      const { index } = action.payload;
      const { id } = state.words[index]
      const updatedWords = [
        ...state.words.slice(0, index),
        ...state.words.slice(index + 1),
      ];

      let updatedOriginalWords;
      if (state.searchQuery===null) {
        updatedOriginalWords = [...updatedWords];
      }
      else {
        updatedOriginalWords = state.originalWords.filter(
          (word) => word.id !== id
        );
      }

      return {
        ...state,
        status: 'viewing',
        editingWordIdx:null,
        editingLabelIdx:null,
        words: updatedWords,
        originalWords: updatedOriginalWords,
      };
    }
    case 'ADD_LABEL': {
      const { label } = action.payload;
      return {
        ...state,
        labels: [...state.labels, label],
      };
    }
    case 'UPDATE_LABEL': {
      const { updatedLabel } = action.payload;
      const updatedLabels=[...state.labels]
      updatedLabels[state.editingLabelIdx].name=updatedLabel.name;
      return {
        ...state,
        editingLabelIdx:null,
        editingWordIdx:null,
        status:'viewing',
      };
    }
    case 'REMOVE_LABEL': {
      const { index } = action.payload;
      const updatedLabels = [
        ...state.labels.slice(0, index),
        ...state.labels.slice(index + 1),
      ];
      return {
        ...state,
        labels: updatedLabels,
      };
    }
    case 'UPDATE_MEMORIZE': {
      const { index, is_memorized } = action.payload;
      const updatedWords=[...state.words];
      updatedWords[index].is_memorized=is_memorized
      return {
        ...state,
        memorized_cnt: is_memorized? state.memorized_cnt + 1:state.memorized_cnt-1,
      };
    }
    case 'SEARCH_WORDS': {
      const { searchQuery, searchedWords } = action.payload;
      return {
        ...state,
        editingLabelIdx:-1,
        editingWordIdx:-1,
        viewingWordIdx:0,
        status: 'viewing',
        searchQuery,
        words: searchedWords,
      };
    }
    case 'RESET_WORDS':
      return { ...state, status: 'viewing', words: state.originalWords };
    case 'START_CREATE_WORD_SESSION':
      return { ...state, status: 'adding', editingWordIdx:action.payload };
    case 'START_UPDATE_WORD_SESSION':
      return { ...state, status: 'updating', editingWordIdx: action.payload };
    case 'START_CREATE_Label_SESSION':
      return { ...state, status: 'adding', editingLabelIdx: action.payload };
    case 'START_UPDATE_WORD_SESSION':
      return { ...state, status: 'updating', editingLabelIdx: action.payload };
    case 'FETCH_COLLECTION_REQUEST':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_COLLECTION_SUCCESS':
      const {collection}=action.payload;
      return {
        ...state,
        status: 'viewing',
        collectionName: collection.collectionName,
        viewingIdx:0,
        words: collection.words,
        editingLabelIdx:null,
        editingWordIdx:null,
        originalWords: collection.words,
      };
    case 'FETCH_COLLECTION_FAILURE':
      return { ...state, status: 'error', error: action.payload };
    case 'CANCEL_EDIT_SESSION':
      return { ...state, editingWordIdx: null,editingLabelIdx:null, status: 'viewing' };
    default:
      console.error('No method in word reducer:', action.type);
      return state;
  }
};

// Provider component
export const CollectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(collectionReducer, initialState);
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

  const fetchCollection = async (url) => {
    if (!url) {
      console.error('URL must be provided');
      dispatch({ type: 'FETCH_COLLECTION_FAILURE', payload: 'Internal server error' });
      return;
    }

    dispatch({ type: 'FETCH_COLLECTION_REQUEST' });

    const data = await fetchHelper(url, 'GET');
    if (data) {
      dispatch({ type: 'FETCH_COLLECTION_SUCCESS', payload: {collection: data.collection}  });
    } else {
      dispatch({ type: 'FETCH_COLLECTION_FAILURE', payload: 'Failed to fetch collection' });
    }
  };

  const createWord = async (url, word) => {
    const newWord = await fetchHelper(url, 'POST', word);
    if (newWord) {
      dispatch({ type: 'ADD_WORD', payload: { word: newWord } });
    }
  };

  const updateWord = (url, word) => {
    fetchHelper(url, 'PUT', word);
    const updatedWord = { ...state.words[state.editingWordIdx], name: word.name, description: word.description, image_path: word.image_path };
    dispatch({ type: 'UPDATE_WORD', payload: { updatedWord } });
  };

  const removeWord = (url, index,  id) => {
    fetchHelper(url, 'DELETE');
    dispatch({ type: 'REMOVE_WORD', payload: { index, id } });
  };

  const addLabel = (url, label) => {
    fetchHelper(url, 'POST', label);
    dispatch({ type: 'ADD_LABEL', payload: { label } });
  };

  const updateLabel = (url, index, label) => {
    fetchHelper(url, 'PUT', label);
    dispatch({ type: 'UPDATE_LABEL', payload: { index, label } });
  };

  const removeLabel = (url, index) => {
    fetchHelper(url, 'DELETE', label);
    dispatch({ type: 'REMOVE_LABEL', payload: { index } });
  };

  const updateMemorization = (url, index, is_memorized) => {
    fetchHelper(url,'PUT',is_memorized)
    dispatch({ type: 'MEMORIZE_WORD', payload: { index,is_memorized } });
  };

  const viewNext=()=>{
    if(state.viewingIdx+1<state.words.length){
      dispatch({type:"VIEW_NEXT_WORD"})
      return state.viewingIdx+1<state.words.length;
    }
    return false;
  }


  const viewPrev=()=>{
    if(state.viewingIdx>0){
      dispatch({type:"VIEW_PREV_WORD"})
      return state.viewingIdx>0;
    }
    return false;
  }


  const contextValue = {
    ...state,
    fetchCollection,
    createWord,
    updateWord,
    removeWord,
    addLabel,
    updateMemorization,
    updateLabel,
    removeLabel,
    viewNext,
    viewPrev
  };

  return <CollectionContext.Provider value={contextValue}>{children}</CollectionContext.Provider>;
};

// Custom hook for using the context
export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
};