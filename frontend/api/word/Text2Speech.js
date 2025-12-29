import { API } from "@/types/API";
import { ApiHelper } from "../ApiHelper";
import { ErrorHandle } from "@/utils/ErrorHandle";


export const  text2Speech = async (collectionId, wordId) => {
    const url = `/api/protected/collections/${collectionId}/words/${wordId}/text_to_speech`;
    const [json, error] = await ApiHelper(url, API.GET, null, null, null, 'text2speech');
    if (error != null) {
        ErrorHandle("Failed to generate pronounciation, please try again later.")
    }
    return json.url;
}