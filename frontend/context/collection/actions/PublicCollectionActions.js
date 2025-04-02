// publicCollectionActions.js
import { CollectionActions } from './CollectionActions';

export const createPublicCollectionActions = (dispatch, state) => ({
  ...CollectionActions(dispatch, state),
});