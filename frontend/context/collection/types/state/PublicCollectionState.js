import { z } from 'zod';
import { PUblicOriginalWordsSchema, PublicWordsSchema } from "@/types/word/publicWord"
import { CollectionStateSchema } from "./CollectionState"
import { PublicCollectionStatus } from "../status/PublicCollectionStatus"
import { PublicCollectionViewingType } from "../viewingType/PublicCollectionViewingType"

export const PublicCollectionStateSchema = CollectionStateSchema.extend({
    words: PublicWordsSchema,
    originalWords: PUblicOriginalWordsSchema,
    status: z.nativeEnum(PublicCollectionStatus),
    viewingType: z.nativeEnum(PublicCollectionViewingType)
})