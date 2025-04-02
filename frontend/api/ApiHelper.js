
import { ErrorHandle } from "@/utils/ErrorHandle";
import { ParseHelper } from "../utils/ParseHelper";


export const ApiHelper = async (url, method, requestBody = null, requestSchema = null, responseSchema = null, action = null, isNotOkThrow = true) => {
    try {
        const [parsedBody, error1] = requestSchema ? ParseHelper(requestSchema,requestBody) : [requestBody,null];
        if(error1) {
            return handleError(error1, action);
        }
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            ...(parsedBody && { body: JSON.stringify(parsedBody) })
        });

        if (!res.ok) {
            const response = await res.json();
            if (isNotOkThrow) {
                return handleError(null, action, response.message);
            }
            return [null, response.message];
        }

        const response = await res.json();
        
        const [parsedResponse, error2]=  responseSchema? ParseHelper(responseSchema, response): [response,null];
        if(error2){
            return handleError(error2, action);
        }
        return [parsedResponse,null];

    } catch (err) {
        return handleError(err, action)
    }
}

const handleError = (err,action,msg= null)=>{
    ErrorHandle(action ? `Failed to ${action}, please try again later! ` : null + msg? msg:'');
    console.error(action + " failed: ", err?err:"");
    return [null, err];
}