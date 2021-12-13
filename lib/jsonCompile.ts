import {IteratorObject} from "./iterator.ts";
import {parseJsonFile} from "./utils.ts";
import {dirname} from "../deps.ts";

export const resolveJsonSchemaRef = (jsonSchema: object, mainSchemaLocate: string): Promise<void> => {
    return new Promise(async (resolve) => {

        const iterableJsonSchema: any = new IteratorObject(jsonSchema);


        const funcIterable = async (): Promise<void> => {

            const dataValue: IteratorResult<any> = iterableJsonSchema.next();
            const isDone: boolean | undefined = dataValue.done;
            const value: object = dataValue.value;

            if (!isDone) {

                let resolveRef = async (obj: any) => {
                    if (obj) {

                        let valueKeys: string[] = Object.keys(obj)

                        for (let valueKey of valueKeys) {
                            // @ts-ignore
                            if (valueKey === "$ref") {

                                let newJsonObj: any = await _resolveURI(obj[valueKey], mainSchemaLocate, jsonSchema)

                                if (typeof newJsonObj === "string") {
                                    try {
                                        newJsonObj = JSON.parse(newJsonObj)
                                    } catch (e) {
                                        await resolveRef(obj)
                                    }
                                }

                                if (typeof newJsonObj === "object") {


                                    // @ts-ignore
                                    jsonSchema["definitions"] = Object.assign((jsonSchema["definitions"] || {}), (newJsonObj["definitions"] || {}))

                                    delete obj[valueKey]
                                    delete newJsonObj["$schema"]
                                    delete newJsonObj["$id"]
                                    delete newJsonObj["definitions"]

                                    obj = Object.assign(obj, newJsonObj)
                                    await resolveRef(newJsonObj)

                                }

                            } else if (typeof obj[valueKey] === "object") {
                                await resolveRef(obj[valueKey])
                            }
                        }
                    }
                }

                await resolveRef(value)

                await funcIterable();
            } else {
                resolve()
            }
        };

        await funcIterable();
    })

}

const _handlePointer$RefURI = (uri: string): string | undefined => {
    if (uri.lastIndexOf("#") === (uri.length - 1)) {
        return uri.replace("#", "")
    } else if (uri.indexOf("#") === -1) {
        return uri
    }
}

const _handlePointer$RefInternalURI = (uri: string): string | undefined => {
    if (uri.startsWith("#") && uri.indexOf("$defs") === -1) {
        return (uri.replace("#/definitions/", "")).trim()
    }

}


const _resolveURI = async (uri: string, mainSchemaLocate: string, jsonSchema: object): Promise<any> => {

    let handleURI: string | undefined;

    handleURI = _handlePointer$RefURI(uri.trim()) // Handle $ref: External schema
    if (handleURI) {
        let fileToRef: string = `${dirname(mainSchemaLocate)}/${handleURI}`
        return await _getExternalJsonObject(fileToRef)
    }

    handleURI = _handlePointer$RefInternalURI(uri.trim()) // Handle $ref: Internal schema
    if (handleURI) {
        // @ts-ignore
        return jsonSchema["definitions"][`${handleURI}`]
    }

    // TODO: Implement: Handle $Defs
}

const _getExternalJsonObject = async (uri: string): Promise<any> => {
    let re = /^http[s]?:\/\//
    // TODO: Download Schemas from http URI
    if (uri.search(re) !== -1) { // http
        console.log("https uri: ", uri)
    } else {  // Local system
        return await parseJsonFile(uri)
    }
}


