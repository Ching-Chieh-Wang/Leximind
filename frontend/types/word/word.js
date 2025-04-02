import { z } from 'zod';

export const WordSchema = z.object({
  id: z.number(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  img_path: z.string().nullable(),
  label_ids: z.record(z.number()),
})

export const WordsSchema = z.array(WordSchema);

/**
 * @typedef {z.infer<typeof WordSchema>} Word
 */

/**
 * @typedef {z.infer<typeof WordsSchema>} Words
 */
