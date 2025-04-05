import { z } from 'zod';
import {  PrivateOriginalWordsSchema, PrivateWordsSchema } from "@/types/word/privateWord"
import { CollectionStateSchema } from "./CollectionState"
import { PrivateCollectionStatus } from "../status/PrivateCollectionStatus"
import { PrivateCollectionViewingType } from "../viewingType/PrivateCollectionViewingType"

export const PrivateCollectionStateSchema = CollectionStateSchema.extend({
    words: PrivateWordsSchema,
    originalWords: PrivateOriginalWordsSchema,
    status: z.nativeEnum(PrivateCollectionStatus),
    viewingType: z.nativeEnum(PrivateCollectionViewingType)
})