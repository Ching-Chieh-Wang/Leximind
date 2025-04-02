import { z } from 'zod';
import { PrivateWordSchema } from "@/types/word/privateWord"
import { CollectionStateSchema } from "./CollectionState"
import { PrivateCollectionStatus } from "../status/PrivateCollectionStatus"
import { PrivateCollectionViewingType } from "../viewingType/PrivateCollectionViewingType"

export const PrivateCollectionStateSchema = CollectionStateSchema.extend({
    words: z.array(PrivateWordSchema),
    originalWords: z.array(PrivateWordSchema),
    status: z.nativeEnum(PrivateCollectionStatus),
    viewingType: z.nativeEnum(PrivateCollectionViewingType)
})