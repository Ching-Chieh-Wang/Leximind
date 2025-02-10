'use client';

import { createContext, useContext, useReducer } from 'react';
import { useDialog } from '@/context/DialogContext';

// Create the context
const CollectionContext = createContext();

// Initial state
const initialState = {
  name: '',
  words: [],
  originalWords: [],
  labels: [],
  viewingType: '',
  memorizedCnt: 0,
  viewingWordIdx: 0,
  editingWordIdx: null,
  editingLabelIdx: null,
  status: 'loading',
  searchQuery: null,
  error: null,
};

// Reducer function
const collectionReducer = (state, action) => {
  switch (action.type) {
    case 'VIEW_NEXT_WORD':
      return { ...state, editingWordIdx: null, editingLabelIdx: null, status: 'viewing', viewingWordIdx: state.viewingWordIdx + 1 };
    case 'VIEW_PREV_WORD':
      return { ...state, editingWordIdx: null, editingLabelIdx: null, status: 'viewing', viewingWordIdx: state.viewingWordIdx - 1 };
    case 'CREATE_WORD': {
      const { newWord } = action.payload;
      const words = [...state.originalWords, newWord]
      console.log(words)
      return {
        ...state,
        status: 'viewing',
        viewingType: '',
        viewingWordIdx: words.length-1,
        editingWordIdx: null,
        editingLabelIdx: null,
        words: words,
        originalWords: words
      };
    }
    case 'UPDATE_WORD': {
      const { updatedWord } = action.payload;
      state.words[state.editingWordIdx].name = updatedWord.name;
      state.words[state.editingWordIdx].description = updatedWord.description;
      state.words[state.editingWordIdx].image_path = updatedWord.image_path;
      return {
        ...state,
        status: 'viewing',
        editingWordIdx: null,
        editingLabelIdx: null,
      };
    }
    case 'REMOVE_WORD': {
      const index = action.payload;
      const { id } = state.words[index]
      const updatedWords = [
        ...state.words.slice(0, index),
        ...state.words.slice(index + 1),
      ];
      const updatedOriginalWords = state.originalWords.filter((word) => word.id != id);


      return {
        ...state,
        status: 'viewing',
        viewingWordIdx: state.words.length>1 && index==state.words.length-1?index-1:index,
        editingWordIdx: null,
        editingLabelIdx: null,
        words: updatedWords,
        originalWords: updatedOriginalWords
      };
    }
    case 'CREATE_LABEL': {
      const { newLabel } = action.payload;
      const updatedLabels = [...state.labels, newLabel];
      return {
        ...state,
        labels: updatedLabels,
        editingLabelIdx: null,
        status: 'viewing'
      };
    }
    case 'UPDATE_LABEL': {
      const { updatedLabel } = action.payload;
      state.labels[state.editingLabelIdx].name = updatedLabel.name;
      return {
        ...state,
        editingLabelIdx: null,
        editingWordIdx: null,
        status: 'viewing',
      };
    }
    case 'REMOVE_LABEL': {
      const index = action.payload;
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
      state.words[index].is_memorized = is_memorized
      return {
        ...state,
        memorizedCnt: is_memorized ? state.memorizedCnt + 1 : state.memorizedCnt - 1,
      };
    }
    case 'UPDATE_WORD_LABEL': {
      const { index, label_id, isAssociation } = action.payload;
      if (isAssociation) {
        state.words[index].label_ids.add(label_id)
      }
      else {
        state.words[index].label_ids.delete(label_id)
      }


      return {
        ...state,
      };
    }

    case 'SEARCH_WORDS': {
      const { searchQuery, searchedWords } = action.payload;
      return {
        ...state,
        editingLabelIdx: -1,
        viewingWordIdx: 0,
        status: 'viewing',
        viewingType: 'search',
        searchQuery,
        words: searchedWords,
      };
    }
    case 'RESET_COLLECTION': {
      return { ...state, status: 'viewing', viewingType: '',viewingWordIdx:0, words:state.originalWords, editingLabelIdx: null, error: null, }
    }
    case 'START_CREATE_WORD_SESSION':
      return { ...state, status: 'creatingWord', editingWordIdx: null, editingLabelIdx: null, error: null };
    case 'START_UPDATE_WORD_SESSION':
      return { ...state, status: 'updatingWord', editingWordIdx: action.payload, editingLabelIdx: null, error: null }
    case 'START_CREATE_LABEL_SESSION':
      return { ...state, status: 'creatingLabel', editingWordIdx: null, editingLabelIdx: null, error: null };
    case 'START_UPDATE_LABEL_SESSION':
      return { ...state, status: 'updatingLabel', editingWordIdx: null, editingLabelIdx: action.payload, error: null }
    case 'CANCEL_EDIT_SESSION':
      return { ...state, editingLabelIdx: null, status: 'viewing' };
    case 'FETCH_COLLECTION_REQUEST':
      return { ...state, status: 'loading', error: null };
    case 'CREATE_WORD_REQUEST':
      return { ...state, status: 'createWordLoading', error: null };
    case 'CREATE_LABEL_REQUEST':
      return { ...state, status: 'createLabelLoading', error: null };
    case 'SET_COLLECTION_SUCCESS':{
      const { words, viewingType } = action.payload;
      return {
        ...state,
        status: 'viewing',
        viewingWordIdx: 0,
        viewingType:viewingType,
        words,
        editingLabelIdx: null,
        editingWordIdx: null,
        error:null
      };}
    case 'FETCH_COLLECTION_SUCCESS':
      const { collection } = action.payload;
      return {
        ...state,
        ...collection,
        originalWords:collection.words,
        status: 'viewing',
        viewingWordIdx: 0,
        editingLabelIdx: null,
        editingWordIdx: null,
      };
    case 'ERROR':
      return { ...state, status: 'error', error: action.payload };
    default:
      console.error('No method in word reducer:', action.type);
      return state;
  }
};

// Provider component
export const CollectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(collectionReducer, initialState);
  const { showDialog } = useDialog();
  const refershPage = () => { window.location.reload() };

  const fetchHelper = async (url, method, body = null, isNotOkShowError = false) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(body && { body: JSON.stringify(body) }),
      });
      if (!response.ok && isNotOkShowError) {
        showDialog({
          title: 'Error',
          description: `Unexpected error: Please try again later.`,
          onOk: refershPage,
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      showDialog({
        title: 'Error',
        description: `Unexpected error: Please try again later.`,
        onOk: refershPage,
      });
      return null;
    }
  };

  const fetchCollection = async (url, id) => {
    if (!url) {
      console.error('URL must be provided');
      dispatch({ type: 'ERROR', payload: 'Internal server error' });
      return;
    }

    dispatch({ type: 'FETCH_COLLECTION_REQUEST' });
    const data = await fetchHelper(url, 'GET',null,true);

    if (data.collection) {
      const collection = data.collection;

      // Transform label_ids for each word into a Set
      collection.words = collection.words.map((word) => {
        return {
          ...word,
          label_ids: new Set(word.label_ids), // Keep numbers directly as keys in the Set
        };
      });

      const memorizedCnt =collection.words.length-collection.not_memorized_cnt
      console.log(memorizedCnt)

      // Include the collection ID in the data
      const modifiedCollection = { ...collection, id, memorizedCnt };

      dispatch({ type: 'FETCH_COLLECTION_SUCCESS', payload: { collection: modifiedCollection } });
    } else {
      dispatch({ type: 'ERROR', payload: 'Failed to fetch collection' });
    }
  };

  const setCollection = async (url, viewingType) => {
    if (!url) {
      console.error('URL must be provided');
      dispatch({ type: 'ERROR', payload: 'Internal server error' });
      return;
    }
  
    dispatch({ type: 'FETCH_COLLECTION_REQUEST' });
  
    const data = await fetchHelper(url, 'GET', null, true);
    console.log("data",data)
    if (data.word_ids) {
      const word_ids = new Set(data.word_ids);

      console.log("original",state.originalWords)
  
      // Use `filter` to create a new array based on matching IDs
      const words = state.originalWords.filter((word) => word_ids.has(word.id));

      console.log("words",words)
  
      dispatch({ type: 'SET_COLLECTION_SUCCESS', payload: { words,viewingType } });
    } else {
      dispatch({ type: 'ERROR', payload: 'Failed to fetch collection' });
    }
  };

  const createWord = async (url, name, description, image_path) => {
    dispatch({ type: 'CREATE_WORD_REQUEST' });
    const data = await fetchHelper(url, 'POST', { name, description, image_path });
    if (data?.word_id) {
      const newWord = { name, description, image_path, id: data.word_id, label_ids: new Set(), is_memorized: false }
      dispatch({ type: 'CREATE_WORD', payload: { newWord } });
    }
    else {
      if (data.errors == null) {
        showDialog({ title: "Error!", description: "Something went wrong, please try again later.", onOk: () => { } })
      }
      dispatch({ type: 'START_CREATE_WORD_SESSION' })
    }
    return data;
  };

  const updateWord = (url, name, description, image_path) => {
    const word=state.words[state.editingWordIdx];
    if(name!=word.name||description!=word.description||image_path!=word.image_path){
      fetchHelper(url, 'PUT', { name, description, image_path }, false);
      const updatedWord = { ...word, name, description, image_path };
      dispatch({ type: 'UPDATE_WORD', payload: { updatedWord } });
    }
    else dispatch({ type: 'UPDATE_WORD', payload: { updatedWord:word } });
  };

  const removeWord = (url, index) => {
    fetchHelper(url, 'DELETE', null, false);
    dispatch({ type: 'REMOVE_WORD', payload: index });
  };

  const createLabel = async (url, name) => {
    dispatch({ type: 'CREATE_LABEL_REQUEST' })
    const data = await fetchHelper(url, 'POST', { name });
    if (data?.label_id) {
      const newLabel = { id: data.label_id, name }
      dispatch({ type: 'CREATE_LABEL', payload: { newLabel } });
    }
    else {
      dispatch({ type: 'START_CREATE_LABEL_SESSION' })
    }
    return data
  };

  const updateLabel = (url, name) => {
    fetchHelper(url, 'PUT', { name }, true);
    const updatedLabel = { ...state.labels[state.editingLabelIdx], name }
    dispatch({ type: 'UPDATE_LABEL', payload: { updatedLabel } });
  };

  const removeLabel = (url, index) => {
    fetchHelper(url, 'DELETE', null, true);
    dispatch({ type: 'REMOVE_LABEL', payload: index });
  };

  const updateMemorization = (url, index) => {
    const is_memorized=!state.words[index].is_memorized;
    fetchHelper(url, 'PATCH', { is_memorized },true)
    dispatch({ type: 'UPDATE_MEMORIZE', payload: { index, is_memorized } });
  };

  const updateWordLabel = (url, index, label_id, isAssociation) => {
    if (isAssociation) {
      fetchHelper(url, 'POST');
      dispatch({ type: 'UPDATE_WORD_LABEL', payload: { index, label_id, isAssociation } });
    }
    else {
      fetchHelper(url, 'DELETE');
      dispatch({ type: 'UPDATE_WORD_LABEL', payload: { index, label_id, isAssociation } });
    }

  }

  const viewNext = () => {
    if (state.viewingWordIdx + 1 < state.words.length) {
      dispatch({ type: "VIEW_NEXT_WORD" })
    }
  }

  const viewPrev = () => {
    if (state.viewingWordIdx > 0) {
      dispatch({ type: "VIEW_PREV_WORD" })
    }
  }

  const startCreateWordSession = () => {
    dispatch({ type: 'START_CREATE_WORD_SESSION' });
  };
  const startCreateLabelSession = () => {
    dispatch({ type: 'START_CREATE_LABEL_SESSION' });
  };

  const startUpdateLabelSession = (index) => {
    dispatch({ type: 'START_UPDATE_LABEL_SESSION', payload: index });
  };

  const startUpdateWordSession = (index) => {
    dispatch({ type: 'START_UPDATE_WORD_SESSION', payload: index });
  };

  const cancelEditSession = () => {
    dispatch({ type: 'CANCEL_EDIT_SESSION' });
  }

  const resetCollection = ()=>{
    dispatch({type:'RESET_COLLECTION'})
  }


  const contextValue = {
    ...state,
    fetchCollection,
    setCollection,
    createWord,
    updateWord,
    removeWord,
    createLabel,
    updateLabel,
    removeLabel,
    updateMemorization,
    updateWordLabel,
    viewNext,
    viewPrev,
    resetCollection,
    startCreateWordSession,
    startCreateLabelSession,
    startUpdateLabelSession,
    startUpdateWordSession,
    cancelEditSession
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