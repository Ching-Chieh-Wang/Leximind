import { z } from 'zod';
import { WordSchema } from '../word/word';
import { LabelSchema } from '../label/label';
export const CollectionSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    words: z.array(WordSchema),
    labels: z.array(LabelSchema),
  })