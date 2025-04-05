import { PrivateCollectionStateSchema } from "../state/PrivateCollectionState";
import { CollectionInitialState } from "./CollectionInitialState";

export const PrivateCollectionInitialState = PrivateCollectionStateSchema.parse({
    ...CollectionInitialState,
    memorizedCnt: 0,
    editingWordIdx: null,
    editingLabelId: null,
  });