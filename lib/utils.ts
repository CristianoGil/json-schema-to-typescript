import {red} from "../deps.ts";

export const parseJsonFile = async (pathString: string): Promise<string> => {

    if (!(await isValidPathFile(pathString))) {
        let code: number = 2;
        console.error(`${red('error')}: Path to JSON file is invalid`)
        console.log(`\nExit code:  ${code} `)
        Deno.exit(code)
    }

    let decoder = new TextDecoder("utf-8");
    const jsonFile = await Deno.readFile(pathString);
    return decoder.decode(jsonFile);
}

export const isValidPathFile = (pathToFile: string): Promise<boolean> => {

    return new Promise(async (resolve, reject) => {
        try {
            // @ts-ignore
            let fileInfo: FileList = await Deno.lstat(pathToFile); // Check permissions by Changing the current working directory
            resolve(fileInfo.isFile)
        } catch (err) {
            console.error(err)
            reject(false)
        }
    })
}