import { PublicCollectionStateSchema } from "../state/PublicCollectionState";
import { CollectionInitialState } from "./CollectionInitialState";

export const PublicCollectionInitialState = PublicCollectionStateSchema.parse({
    ...CollectionInitialState,
  });