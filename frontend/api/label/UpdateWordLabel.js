import { ApiHelper } from "../ApiHelper";
import { API } from '@/types/API';

export const updateWordLabelRequest = (collectionId,labelId,wordId, isAssociated) => {
  const url=`/api/protected/collections/${collectionId}/labels/${labelId}/words/${wordId}`
  ApiHelper(url,isAssociated?API.POST:API.DELETE,null,null,null,'assign label to word');
};
