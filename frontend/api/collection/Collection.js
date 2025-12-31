import { z } from 'zod';
import { LabelsSchema } from '@/types/label/label';
import { ApiHelper } from '../ApiHelper';
import { API } from '@/types/API';
import { PrivateWordSchema } from '@/types/word/privateWord';

const responseWordSchema = PrivateWordSchema.extend({
  label_ids:z.array(z.number())
})

const responseWordsSchema=z.record(responseWordSchema);

const responseSchema = z.object({
  name: z.string(),
  words: responseWordsSchema,
  labels: LabelsSchema,
  memorizedCnt: z.number()
});

export const createCollection = async (name,description,is_public) => {
  const url = `/api/protected/collections`;
  return await ApiHelper(url, API.POST, {name, description, is_public}, null, null, 'create collection', false);
}