import { ParseHelper } from "@/utils/ParseHelper";
import { PrivateCollectionAction } from "../types/action/PrivateCollectionAction";
import { PrivateCollectionViewingType } from "../types/viewingType/PrivateCollectionViewingType";
import { CollectionActions } from "./CollectionActions";
import { PrivateWordSchema } from "@/types/word/privateWord";
import { ErrorHandle } from "@/utils/ErrorHandle";
import { LabelSchema } from "@/types/label/label";


export const createPrivateCollectionActions = (dispatch, state) => ({
  ...CollectionActions(dispatch, state),
  createWord: (word) => {
    dispatch({ type: PrivateCollectionAction.CREATE_WORD, payload: word });
  },
  updateWord: (word) => {
    dispatch({ type: PrivateCollectionAction.UPDATE_WORD, payload: word });
  },
  removeWord: (index) => {
    if(state.words[index].is_memorized){
      dispatch({type: PrivateCollectionAction.UPDATE_MEMORIZE, payload: { index, is_memorized:false }});
    }
    dispatch({ type: PrivateCollectionAction.REMOVE_WORD, payload: index });
  },
  createLabel: (label) => {
    dispatch({ type: PrivateCollectionAction.CREATE_LABEL, payload: label });
  },
  updateLabel: (label) => {
    dispatch({ type: PrivateCollectionAction.UPDATE_LABEL, payload: label });
  },
  removeLabel: (labelId) => {
    dispatch({ type: PrivateCollectionAction.REMOVE_LABEL, payload: labelId });
  },
  updateMemorization: (index) => {
    const is_memorized = !state.words[index].is_memorized;
    dispatch({
      type: PrivateCollectionAction.UPDATE_MEMORIZE,
      payload: { index, is_memorized },
    });
  },
  updateWordLabel: (word_idx, label_id, isAssociation) => {
    dispatch({
      type: PrivateCollectionAction.UPDATE_WORD_LABEL,
      payload: { word_idx,label_id, isAssociation },
    });
  },
  viewUnmemorized: () => {
    const words = Object.values(state.originalWords).filter((word) =>  !word.is_memorized);
    dispatch({ type: PrivateCollectionAction.SET_CATEGORIZED_WORDS, payload: { words, viewingType: PrivateCollectionViewingType.UNMEMORIZED, viewingName: `Unmemorized` } });
  },
  startCreateWordSession: () =>
    dispatch({ type: PrivateCollectionAction.START_CREATE_WORD_SESSION }),
  startUpdateWordSession: (index) =>
    dispatch({ type: PrivateCollectionAction.START_UPDATE_WORD_SESSION, payload: index }),
  startCreateLabelSession: () =>
    dispatch({ type: PrivateCollectionAction.START_CREATE_LABEL_SESSION }),
  startUpdateLabelSession: (index) =>
    dispatch({ type: PrivateCollectionAction.START_UPDATE_LABEL_SESSION, payload: index }),
  createWordSubmit:()=>
    dispatch({ type: PrivateCollectionAction.CREATE_WORD_SUBMIT }),
  updateWordSubmit:()=>
    dispatch({ type: PrivateCollectionAction.UPDATE_WORD_SUBMIT }),
  createLabelSubmit:()=>
    dispatch({ type: PrivateCollectionAction.CREATE_LABEL_SUBMIT }),
  updateLabelSubmit:()=>
    dispatch({ type: PrivateCollectionAction.UPDATE_LABEL_SUBMIT }),
  cancelEditSession: () =>
    dispatch({ type: PrivateCollectionAction.CANCEL_EDIT_SESSION }),
});