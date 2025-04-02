import { z } from 'zod';
import { WordSchema } from './word';

export const PublicWordSchema = WordSchema;

export const PublicWordsSchema = z.array(PublicWordSchema);

/**
 * @typedef {z.infer<typeof PublicWordSchema>} PublicWord
 */

/**
 * @typedef {z.infer<typeof PublicWordsSchema>} PublicWords
 */
