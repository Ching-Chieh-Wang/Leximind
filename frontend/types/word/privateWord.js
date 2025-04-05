import { z } from 'zod';
import { WordSchema } from './word';

export const PrivateWordSchema = WordSchema.extend({
  is_memorized: z.boolean(),
});

export const PrivateWordsSchema = z.array(PrivateWordSchema);
export const PrivateOriginalWordsSchema = z.record(PrivateWordSchema)

