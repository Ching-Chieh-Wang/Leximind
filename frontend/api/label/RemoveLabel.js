import { ApiHelper } from "../ApiHelper";
import { API } from '@/types/API';

export const removeLabelReqest = (collectionId,labelId) => {
    const url=`/api/protected/collections/${collectionId}/labels/${labelId}`;
    ApiHelper(url,API.DELETE,null,null,null,'remove label');
};
  