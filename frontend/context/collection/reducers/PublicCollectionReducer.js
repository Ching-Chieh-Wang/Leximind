import { CollectionReducer } from './CollectionReducer';

export const publicCollectionReducer = (state, action) => {
  return CollectionReducer(state, action);
};