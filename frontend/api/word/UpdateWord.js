import { WordSchema } from "@/types/word/word";
import { ApiHelper } from "../ApiHelper";
import { API } from "@/types/API";

export const updateWordRequest = (collectionId, word) => {
    const url = `/api/protected/collections/${collectionId}/words/${word.id}`;
    ApiHelper(url, API.PUT, word, WordSchema, null, 'update word');
}
