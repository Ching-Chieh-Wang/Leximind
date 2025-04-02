import { API } from "@/types/API";
import { ApiHelper } from "../ApiHelper";


export default function removeWordRequest(collectionId,wordId) {
  const url=`/api/protected/collections/${collectionId}/words/${wordId}`;
  ApiHelper(url,API.DELETE,null,null,null,'delete word');
}