
import { ErrorHandle } from "@/utils/ErrorHandle";
import { ParseHelper } from "../utils/ParseHelper";


export const ApiHelper = async (url, method, requestBody = null, requestSchema = null, responseSchema = null, actionName = null, isNotOkShowErrorDialog = true) => {
    try {
        const [parsedBody, error1] = requestSchema ? ParseHelper(requestSchema,requestBody) : [requestBody,null];
        if(error1) {
            return handleError(error1, actionName);
        }
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            ...(parsedBody && { body: JSON.stringify(parsedBody) })
        });

        if (!res.ok) {
            const response = await res.json();
            if (isNotOkShowErrorDialog) {
                return handleError(response.message, actionName );
            }
            return [null, response];
        }

        const response = await res.json();

        
        const [parsedResponse, error2]=  responseSchema? ParseHelper(responseSchema, response): [response,null];
        if(error2){
            return handleError(error2, actionName);
        }
        return [parsedResponse,null];

    } catch (err) {
        return handleError(err, actionName)
    }
}

const handleError = (err,action,msg= null)=>{
    ErrorHandle(action ? `Failed to ${action}, please try again later! ` : null + msg? msg:'');
    console.error(action + " failed: ", err?err:"");
    return [null, err];
}