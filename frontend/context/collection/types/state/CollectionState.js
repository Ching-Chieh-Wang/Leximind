import { z } from 'zod';
import { LabelsSchema } from "@/types/label/label";
import { OriginalWordsSchema, WordsSchema } from '@/types/word/word';
import { CollectionStatus } from '../status/CollectionStatus';
import { CollectionViewingType } from '../viewingType/CollectionViewingType';

export const CollectionStateSchema = z.object({
  id: z.number(),
  name: z.string(),
  words: WordsSchema,
  originalWords: OriginalWordsSchema,
  labels: LabelsSchema,
  status: z.nativeEnum(CollectionStatus),
  viewingType: z.nativeEnum(CollectionViewingType),
  viewingName: z.string(),
  viewingWordIdx: z.number(),
  searchQuery: z.string().nullable(),
  error: z.string().nullable(),
  is_public: z.boolean(),
});