import { CollectionAction } from "../types/action/CollectionAction";
import { CollectionViewingType } from "../types/viewingType/CollectionViewingType";


export const CollectionActions = (dispatch, state) => ({
  loading: () => {
    dispatch({ type: CollectionAction.LOADING });
  },
  setCollection: (collection) => {
    dispatch({ type: CollectionAction.SET_COLLECTION, payload: collection })
  },
  loading: () => {
    dispatch({ type: CollectionAction.LOADING })
  },
  viewNext: () => {
    if (state.viewingWordIdx + 1 < state.words.length) {
      dispatch({ type: CollectionAction.VIEW_NEXT_WORD });
    }
  },
  viewPrev: () => {
    if (state.viewingWordIdx > 0) {
      dispatch({ type: CollectionAction.VIEW_PREV_WORD });
    }
  },
  resetCollection: () => {
    dispatch({ type: CollectionAction.RESET_COLLECTION });
  },
  searchWords: (searchParam) => {
    if(searchParam.length==0){
      dispatch({type:CollectionAction.RESET_COLLECTION});
    }
    else{
      const searchTerm = searchParam.toLowerCase();
      const words = Object.values(state.originalWords).filter((word) => word.name.toLowerCase().includes(searchTerm) || word.description.toLowerCase().includes(searchTerm));
      dispatch({type: CollectionAction.SET_CATEGORIZED_WORDS,payload: {words, viewingType: CollectionViewingType.SEARCH, viewingName: `Search: "${searchParam}"`}});
    }
  },
  showWordsByLabel: (label) => {
    const words = Object.values(state.originalWords).filter((word) => word.label_ids.has(label.id ));
    dispatch({ type: CollectionAction.SET_CATEGORIZED_WORDS, payload: { words, viewingType: CollectionViewingType.LABEL, viewingName: "label: " + label.name } });
  },
  setError: (msg) => {
    dispatch({ type: CollectionAction.ERROR, payload: msg });
  },
});