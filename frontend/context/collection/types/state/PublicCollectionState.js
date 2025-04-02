import { z } from 'zod';
import { PublicWordSchema } from "@/types/word/publicWord"
import { CollectionStateSchema } from "./CollectionState"
import { PublicCollectionStatus } from "../status/PublicCollectionStatus"
import { PublicCollectionViewingType } from "../viewingType/PublicCollectionViewingType"

export const PublicCollectionStateSchema = CollectionStateSchema.extend({
    words: z.array(PublicWordSchema),
    originalWords: z.array(PublicWordSchema),
    status: z.nativeEnum(PublicCollectionStatus),
    viewingType: z.nativeEnum(PublicCollectionViewingType)
})