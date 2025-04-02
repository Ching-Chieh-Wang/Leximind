import { z } from 'zod';
import { CollectionSchema } from "./collection";


  
export const PrivateCollectionSchema = CollectionSchema.extend({
    memorizedCnt: z.number(),
    words: z.any(),
});

/**
 * @typedef {z.infer<typeof PrivateCollectionSchema>} PrivateCollection
 */
