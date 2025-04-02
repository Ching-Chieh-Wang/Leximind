'use client'
import { createContext, useContext, useReducer } from 'react';
import { privateCollectionReducer } from './reducers/PrivateCollectionReducer';
import { publicCollectionReducer } from './reducers/PublicCollectionReducer';
import { createPublicCollectionActions } from './actions/PublicCollectionActions';
import { createPrivateCollectionActions } from './actions/PrivateCollectionActions';
import { PublicCollectionInitialState } from './types/initial_state/PublicCollectionInitialState';
import { PrivateCollectionInitialState } from './types/initial_state/PrivateCollectionInitialState';

const CollectionContext = createContext();

export const CollectionProvider = ({ children, isPublic = false }) => {
  const reducer = isPublic ? publicCollectionReducer : privateCollectionReducer;
  const initialState = isPublic ? PublicCollectionInitialState : PrivateCollectionInitialState;
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = isPublic
    ? createPublicCollectionActions(dispatch, state)
    : createPrivateCollectionActions(dispatch, state);

  const contextValue = { ...state, ...actions };

  return (
    <CollectionContext.Provider value={contextValue}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
};