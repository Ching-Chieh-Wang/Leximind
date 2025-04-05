import { z } from 'zod';
import { PrivateOriginalWordsSchema, PrivateWordsSchema } from '../word/privateWord';
import { CollectionSchema } from './collection';


  
export const PrivateCollectionSchema = CollectionSchema.extend({
    memorizedCnt: z.number(),
    words: PrivateWordsSchema,
    originalWords:PrivateOriginalWordsSchema,
});

