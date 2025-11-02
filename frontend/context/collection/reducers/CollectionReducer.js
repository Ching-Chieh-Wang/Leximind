import { ErrorHandle } from "@/utils/ErrorHandle";
import { CollectionAction } from "../types/action/CollectionAction";
import { CollectionStatus } from "../types/status/CollectionStatus";
import { CollectionViewingType } from "../types/viewingType/CollectionViewingType";



export const CollectionReducer = (state, action) => {
  switch (action.type) {
    case CollectionAction.LOADING: {
      return {
        ...state,
        status: CollectionStatus.LOADING,
        editingLabelIdx: null,
        editingWordIdx: null,
        error: null
      }
    }
    case CollectionAction.SET_COLLECTION: {
      const collection = action.payload;
      return {
        ...state,
        id: collection.id,
        words: collection.words,
        originalWords: collection.originalWords,
        status: CollectionStatus.VIEWING,
        labels: collection.labels,
        viewingType: CollectionViewingType.BASIC,
        name:collection.name,
        viewingWordIdx: 0,
        editingLabelIdx: null,
        editingWordIdx: null,
        error: null
      }
    }
    case CollectionAction.VIEW_NEXT_WORD:
      return {
        ...state,
        editingWordIdx: null,
        editingLabelIdx: null,
        status: CollectionStatus.VIEWING,
        viewingWordIdx: state.viewingWordIdx + 1,
      };

    case CollectionAction.VIEW_PREV_WORD:
      return {
        ...state,
        editingWordIdx: null,
        editingLabelIdx: null,
        status: CollectionStatus.VIEWING,
        viewingWordIdx: state.viewingWordIdx - 1,
      };
    
    case CollectionAction.SET_IS_ALWAYS_SHOW_DESCRIPTION:
      const isAlwaysShowDescription = action.payload;
      return{
        ...state,
        isFlipped: isAlwaysShowDescription,
        isAlwaysShowDescription
      }

    case CollectionAction.SET_IS_FLIPPED:
      const isFlipped = action.payload;
      return{
        ...state,
        isFlipped
      }

    case CollectionAction.SEARCH_WORDS: {
      const { searchQuery, words } = action.payload;
      return {
        ...state,
        editingWordIdx: null,
        editingLabelIdx: null,
        viewingWordIdx: 0,
        status: CollectionStatus.VIEWING,
        viewingType: CollectionViewingType.SEARCH,
        searchQuery,
        words,
        error: null,
      };
    }

    case CollectionAction.SET_CATEGORIZED_WORDS: {
      const { words, viewingType, viewingName } = action.payload;
      return {
        ...state,
        status: CollectionStatus.VIEWING,
        viewingWordIdx: 0,
        viewingType,
        viewingName,
        words,
        editingLabelIdx: null,
        editingWordIdx: null,
        error: null,
      };
    }

    case CollectionAction.RESET_COLLECTION: {
      return {
        ...state,
        status: CollectionStatus.VIEWING,
        viewingType: CollectionViewingType.BASIC,
        viewingWordIdx: 0,
        words: Object.values(state.originalWords),
        editingLabelIdx: null,
        editingWordIdx: null,
        error: null,
      };
    }

    case CollectionAction.ERROR: {
      const error = action.payload;
      return {
        ...state,
        status: CollectionStatus.ERROR,
        error: error
      }
    }

    default:
      console.error("No such action type:" + action.type)
      ErrorHandle();
      return state;
  }
};