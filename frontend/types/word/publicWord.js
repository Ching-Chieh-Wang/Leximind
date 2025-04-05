import { z } from 'zod';
import { WordSchema } from './word';

export const PublicWordSchema = WordSchema;

export const PublicWordsSchema = z.array(PublicWordSchema);
export const PUblicOriginalWordsSchema = z.record(PublicWordSchema)

