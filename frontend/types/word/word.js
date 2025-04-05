import { z } from 'zod';

export const WordSchema = z.object({
  id: z.number(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  img_path: z.string().nullable(),
  label_ids: z.instanceof(Set),
})

export const WordsSchema = z.array(WordSchema);
export const OriginalWordsSchema = z.record(WordSchema);
