import { PublicCollectionStateSchema } from "../state/PublicCollectionState";
import { PublicCollectionStatus } from "../status/PublicCollectionStatus";
import { PublicCollectionViewingType } from "../viewingType/PublicCollectionViewingType";
import { CollectionInitialState } from "./CollectionInitialState";




export const PublicCollectionInitialState = PublicCollectionStateSchema.parse({
    ...CollectionInitialState,
    words:[],
    originalWords:[],
    status: PublicCollectionStatus.LOADING,
    viewingType: PublicCollectionViewingType.BASIC,
  });