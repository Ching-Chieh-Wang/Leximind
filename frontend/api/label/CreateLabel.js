import { z } from 'zod';
import { ApiHelper } from '../ApiHelper';
import { API } from '@/types/API';
import { ParseHelper } from '@/utils/ParseHelper';
import { LabelSchema } from '@/types/label/label';
import { ErrorHandle } from '@/utils/ErrorHandle';

const RequestShcema = z.object({
  name: z.string(),
});

const ResponseSchema = z.object({
  id: z.number(),
});


export default async function createLabelReqest(collectionId, data) {
  const [json,error1] = await ApiHelper(`/api/protected/collections/${collectionId}/labels`,API.POST,data,RequestShcema,ResponseSchema, 'create label',false);
  if(error1){
    return [null, error1];
  }
  const [label, error2] = ParseHelper(LabelSchema, {id:json.id,name:data.name});
  if(error2){
    ErrorHandle(`Failed to create label, please try again later!`);
    return [null, error2];
  }
  return [label,null];
}
