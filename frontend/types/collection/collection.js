import { z } from 'zod';
import { OriginalWordsSchema, WordsSchema } from '../word/word';
import {  LabelsSchema } from '../label/label';
export const CollectionSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    words: WordsSchema,
    labels: LabelsSchema,
    originalWords:OriginalWordsSchema,
  })