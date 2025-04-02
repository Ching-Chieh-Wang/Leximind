import { PrivateCollectionStateSchema } from "../state/PrivateCollectionState";
import { CollectionInitialState } from "./CollectionInitialState";
import { PrivateCollectionStatus } from "../status/PrivateCollectionStatus";
import { PrivateCollectionViewingType } from "../viewingType/PrivateCollectionViewingType";




export const PrivateCollectionInitialState = PrivateCollectionStateSchema.parse({
    ...CollectionInitialState,
    words:[],
    originalWords:[],
    memorizedCnt: 0,
    status: PrivateCollectionStatus.LOADING,
    viewingType: PrivateCollectionViewingType.BASIC,
    editingWordIdx: null,
    editingLabelIdx: null,
  });