import type { sharedRequestParsedDataInterface } from "../interfaces/sharedInterfaces";

function sharedRequestDataParseFunc(requestData: Buffer): sharedRequestParsedDataInterface {
    let parsedRequestData = {} as sharedRequestParsedDataInterface;

    const [metadata, body = ""] = requestData.toString().split("\r\n\r\n");

    const metaParts = metadata.split("\r\n");

    const [method, requestTarget, httpVersion] = metaParts[0].split(" "); // Parse request line

    const headers: { [key: string]: string } = {}; // Parse headers
    for (let i = 1; i < metaParts.length; i++) {
        const line = metaParts[i];
        if (line === "") break; // End of headers
        const [key, value] = line.split(": ");
        if (key && value) {
            headers[key] = value;
        }
    }

    parsedRequestData.method = method;
    parsedRequestData.target = requestTarget;
    parsedRequestData.httpVersion = httpVersion;
    parsedRequestData.headers = headers;
    parsedRequestData.requestBody = body;
    return parsedRequestData;
}

export { sharedRequestDataParseFunc };
