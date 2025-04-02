import { z } from 'zod';
import { API } from "@/types/API";
import { ApiHelper } from "../ApiHelper";

const RequestSchemna = z.object({
  is_memorized: z.boolean()
});


export default function updateWordMemorizationRequest(collectionId, wordId , data) {
  const url = `/api/protected/collections/${collectionId}/words/${wordId}/memorize`
  ApiHelper(url, API.PATCH,data, RequestSchemna, null, 'adjust memorization');
}
