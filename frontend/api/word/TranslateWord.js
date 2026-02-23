import { z } from 'zod';
import { ApiHelper } from "../ApiHelper";
import { RequestWordSchema } from '@/types/word/requestWord';
import { API } from '@/types/API';
import { ParseHelper } from '@/utils/ParseHelper';
import { ErrorHandle } from "@/utils/ErrorHandle";
import { PrivateWordSchema } from '@/types/word/privateWord';


const ResponseSchema = z.object({
  translation: z.string(),
});

export const translateWordRequest = async (text, target) => {
  const url = `/api/protected/ai/translate`;
  const data = { text, target };
  const [json, error1] = await ApiHelper(url, API.POST, data, null, ResponseSchema, 'translate word', true);
  if (error1!=null) {
    return [null, error1];
  }
  return [json.translation, null];
}
