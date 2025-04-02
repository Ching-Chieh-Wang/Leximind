import { z } from 'zod';
import { CollectionSchema } from "./collection";
import { PublicWordSchema } from '../word/publicWord';


export const PublicCollectionSchema = CollectionSchema.extend({
    memorizedCnt: z.number(),
    words: z.array(PublicWordSchema),
});

/**
 * @typedef {z.infer<typeof PublicCollectionSchema>} PublicCollection
 */