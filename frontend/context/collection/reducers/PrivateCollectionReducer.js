import { PrivateCollectionAction } from '../types/action/PrivateCollectionAction';
import { PrivateCollectionStatus } from '../types/status/PrivateCollectionStatus';
import { PrivateCollectionViewingType } from '../types/viewingType/PrivateCollectionViewingType';
import { CollectionReducer } from './CollectionReducer';

export const privateCollectionReducer = (state, action) => {
  switch (action.type) {
    case PrivateCollectionAction.SET_COLLECTION: {
      const collection = action.payload;
      return {
        ...state,
        id: collection.id,
        name: collection.name,
        words: collection.words,
        originalWords: collection.originalWords,
        status: PrivateCollectionStatus.VIEWING,
        memorizedCnt: collection.memorizedCnt,
        labels: collection.labels,
        viewingType: PrivateCollectionViewingType.BASIC,
        viewingWordIdx: 0,
        editingLabelId: null,
        editingWordIdx: null,
        error: null
      }
    }
    case PrivateCollectionAction.CREATE_WORD: {
      const word = action.payload;
      const words = [ ...state.words,  word ];
      const originalWords = { ...state.originalWords, [word.id]: word };
      
      return {
        ...state,
        status: PrivateCollectionStatus.VIEWING,
        viewingType: PrivateCollectionViewingType.BASIC,
        viewingWordIdx: Object.keys(words).length - 1,
        editingWordIdx: null,
        editingLabelId: null,
        words,
        originalWords
      };
    }
    case PrivateCollectionAction.UPDATE_WORD: {
      const word = action.payload;
      const words = [...state.words];
      const originalWords = {...state.originalWords};

      words[state.editingWordIdx] = {
        ...words[state.editingWordIdx],
        ...word,
      };

      originalWords[word.id] = word;

      return {
        ...state,
        words,
        originalWords,
        status: PrivateCollectionStatus.VIEWING,
        editingWordIdx: null,
        editingLabelId: null,
      };
    }
    case PrivateCollectionAction.REMOVE_WORD: {
      const index = action.payload;
      const { id } = state.words[index];
      const words = [
        ...state.words.slice(0, index),
        ...state.words.slice(index + 1),
      ];
      const { [id]: _, ...originalWords } = state.originalWords;

      return {
        ...state,
        status: PrivateCollectionStatus.VIEWING,
        viewingWordIdx: state.words.length > 1 && index == state.words.length - 1 ? index - 1 : index,
        editingWordIdx: null,
        editingLabelId: null,
        words,
        originalWords
      };
    }
    case PrivateCollectionAction.CREATE_LABEL: {
      const label = action.payload;
      const labels = {...state.labels, [label.id]: label};
      return {
        ...state,
        labels,
        editingLabelId: null,
        status: PrivateCollectionStatus.VIEWING
      };
    }
    case PrivateCollectionAction.UPDATE_LABEL: {
      const label = action.payload;
      const labels = {...state.labels};
      labels[state.editingLabelId] = label;
      return {
        ...state,
        editingLabelId: null,
        editingWordIdx: null,
        labels,
        status: PrivateCollectionStatus.VIEWING,
      };
    }
    case PrivateCollectionAction.REMOVE_LABEL: {
      const labelId = action.payload;
      const { [labelId]: _, ...labels } = state.labels;
      return {
        ...state,
        labels,
        editingWordIdx: null,
        editingLabelId: null,
        status: PrivateCollectionStatus.VIEWING
      };
    }
    case PrivateCollectionAction.UPDATE_MEMORIZE: {
      const { index, is_memorized } = action.payload;

      const words = [...state.words];
      words[index] = {
        ...words[index],
        is_memorized,
      };

      const originalWords = {
        ...state.originalWords,
        [words[index].id]: {
          ...state.originalWords[words[index].id],
          is_memorized
        }
      };

      return {
        ...state,
        words,
        originalWords,
        memorizedCnt: is_memorized
          ? state.memorizedCnt + 1
          : state.memorizedCnt - 1,
      };
    }
    case PrivateCollectionAction.UPDATE_WORD_LABEL: {
      const { word_idx, label_id, isAssociation } = action.payload;

      const words = [...state.words];
      const word = { ...words[word_idx] };
      const label_ids = new Set(word.label_ids);

      if (isAssociation) {
        label_ids.add(label_id);
      } else {
        label_ids.delete(label_id);
      }

      word.label_ids = label_ids;
      words[word_idx] = word;

      const originalWords = {
        ...state.originalWords,
        [word.id]: {
          ...state.originalWords[word.id],
          label_ids: label_ids,
        }
      };

      return {
        ...state,
        words,
        originalWords,
      };
    }
    case PrivateCollectionAction.START_CREATE_WORD_SESSION:
      return { ...state, status: PrivateCollectionStatus.CREATING_WORD, editingWordIdx: null, editingLabelId: null, error: null };
    case PrivateCollectionAction.START_UPDATE_WORD_SESSION:
      return { ...state, status: PrivateCollectionStatus.UPDATING_WORD, editingWordIdx: action.payload, editingLabelId: null, error: null }
    case PrivateCollectionAction.START_CREATE_LABEL_SESSION:
      return { ...state, status: PrivateCollectionStatus.CREATING_LABEL, editingWordIdx: null, editingLabelId: null, error: null };
    case PrivateCollectionAction.START_UPDATE_LABEL_SESSION:
      return { ...state, status: PrivateCollectionStatus.UPDATING_LABEL, editingWordIdx: null, editingLabelId: action.payload, error: null }
    case PrivateCollectionAction.CANCEL_EDIT_SESSION:
      return { ...state, editingWordIdx: null, editingLabelId: null, status: PrivateCollectionStatus.VIEWING };
    case PrivateCollectionAction.CREATE_WORD_SUBMIT:
      return { ...state, status: PrivateCollectionStatus.CREATE_WORD_SUBMIT, error: null };
    case PrivateCollectionAction.UPDATE_WORD_SUBMIT:
      return { ...state, status: PrivateCollectionStatus.UPDATE_WORD_SUBMIT, error: null };
    case PrivateCollectionAction.CREATE_LABEL_SUBMIT:
      return { ...state, status: PrivateCollectionStatus.CREATE_LABEL_SUBMIT, error: null };
    case PrivateCollectionAction.UPDATE_LABEL_SUBMIT:
      return { ...state, status: PrivateCollectionStatus.UPDATE_LABEL_SUBMIT, error: null };
    default:
      return CollectionReducer(state, action);
  }
};