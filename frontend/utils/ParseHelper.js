export const ParseHelper= (schema,data)=>{
    try{
        return [schema.parse(data),null];
    }
    catch(err) {
        console.error("Schema parsing failed", err);
        err.errors.map((error)=>{
            console.error(error);
        })
        return [null, "Unexpected error"];
    }
}