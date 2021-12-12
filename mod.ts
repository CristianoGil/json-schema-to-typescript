import {parseJsonFile} from "./lib/utils.ts";
import {resolveJsonSchemaRef} from "./lib/jsonCompile.ts";

export const compile = async (json: object | string, mainSchemaLocate?: string): Promise<object> => {

    if (!mainSchemaLocate){
        mainSchemaLocate = Deno.cwd()
    }

    let newJsonObj: object

    if (typeof json === "string") {
        newJsonObj = JSON.parse(json)
    } else {
        newJsonObj = json
    }
    // console.log("Antes: =================== \n" , newJsonObj)
     await resolveJsonSchemaRef(newJsonObj,mainSchemaLocate)
    // @ts-ignore
    // console.log("\n Before: ==================\n", newJsonObj)
    // console.log(resolvedRef)
    return {}
}

export const compileFromFile = async (pathToFile: string): Promise<object> => {
    let jsonString: string = await parseJsonFile(pathToFile)

    return await compile(JSON.parse(jsonString), pathToFile)
}

// TODO: Just for test purpose
await compileFromFile("./lib/tests/main-schemas/index.json")