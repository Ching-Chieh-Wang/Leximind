export const ParseHelper= (schema,data)=>{
    try{
        return [schema.parse(data),null];
    }
    catch(err) {
        console.error("Schema parsing failed");
        err.errors.map((error)=>{
            let input=data;
            for(let i=0;i<error.path.length;i++){
                input=input[error.path[i]]
            }
            error={...error,input}
            console.error(error);
        })
        return [null, "Unexpected error"];
    }
}