import { z } from 'zod';
import { LabelsSchema } from '@/types/label/label';
import { ApiHelper } from '../ApiHelper';
import { API } from '@/types/API';
import { PrivateCollectionSchema } from '@/types/collection/privateCollection';
import { ParseHelper } from '@/utils/ParseHelper';
import { ErrorHandle } from '../../utils/ErrorHandle';
import { ResponsePrivateWordsSchema } from '@/types/word/responsePrivateWord';

const responseSchema = z.object({
  name: z.string(),
  words: ResponsePrivateWordsSchema,
  labels: LabelsSchema,
  not_memorized_cnt: z.number()
});

export const fetchPrivateCollectionRequest = async (collection_id) => {
  const url = `/api/protected/collections/${collection_id}`;
  const [data, error1] = await ApiHelper(url, API.GET, null, null, responseSchema, 'load collection');
  if (error1) return [data, "Failed to load collection"];
  
  const { words, not_memorized_cnt } = data;
  const processedWords = words.map(word => ({
    ...word,
    label_ids: Object.fromEntries(word.label_ids.map(id => [id, 1]))
  }));
  const memorizedCnt = words.length - not_memorized_cnt;
  const [collection, error2 ] = ParseHelper(PrivateCollectionSchema, { ...data, words: processedWords, id: collection_id, memorizedCnt });
  if(error2) {
    ErrorHandle(`Failed to load collection`);
    return [null, "Failed to load collection"];
  }
  return [collection, null];
}