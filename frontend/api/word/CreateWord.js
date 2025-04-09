import { z } from 'zod';
import { ApiHelper } from "../ApiHelper";
import { RequestWordSchema } from '@/types/word/requestWord';
import { API } from '@/types/API';
import { ParseHelper } from '@/utils/ParseHelper';
import { ErrorHandle } from "@/utils/ErrorHandle";
import { PrivateWordSchema } from '@/types/word/privateWord';


const ResponseSchema = z.object({
  id: z.number(),
});

export const createWordRequest = async (collectionId, data) => {
  const url = `/api/protected/collections/${collectionId}/words`;
  const [json, error1] = await ApiHelper(url, API.POST, data, RequestWordSchema, ResponseSchema, 'create word', false);
  if (error1!=null) {
    return [null, error1];
  }
  const [word, error2] = ParseHelper(PrivateWordSchema, { ...data, id: json.id, label_ids: new Set(), img_path: "", is_memorized: false });
  if (error2) {
    ErrorHandle(`Failed to create word, please try again later!`);
    return [null, error2];
  }
  return [word, null];
}
