import { ApiHelper } from "../ApiHelper";
import { API } from '@/types/API';
import { LabelSchema } from "@/types/label/label";
import { RequestLabelSchema } from '@/types/label/requestLabel';
import { ParseHelper } from "@/utils/ParseHelper";

export const updateLabelRequest= async (collectionId,labelId, data)=> {
  const url=`/api/protected/collections/${collectionId}/labels/${labelId}`
  const [json,error1]= await ApiHelper(url,API.PUT,data,RequestLabelSchema,null,'update label',false)
  if(error1){
    return [null,error1];
  }
  const [label,error2] = ParseHelper(LabelSchema,{...data, id:labelId});
  if(error2){
    console.log(error2)
    return [null,error2]
  }
  return [label,null];
}
