import type { sharedRequestParsedDataInterface, sharedResponseInterface } from "../interfaces/sharedInterfaces";
import { createResponseHTTP1_1Func } from "../../HTTP_1_1/services/createResponse";
import { httpCompression } from "./httpCompression";

async function createSharedResponseFunc(
    requestData: sharedRequestParsedDataInterface,
    args: string[] = [])
    : Promise<{ response: sharedResponseInterface | Promise<sharedResponseInterface>; systemMessage: string; }> {

    let response: sharedResponseInterface | Promise<sharedResponseInterface>;
    switch (requestData.httpVersion) {
        case "HTTP/1.1":
            const responseData = createResponseHTTP1_1Func(requestData, args);
            response = httpCompression(requestData.headers, await responseData);
            break;
        case "HTTP/2.0":
            // Future implementation for HTTP/2.0 can be added here
            response = {
                statusLine: {
                    httpVersion: "HTTP/1.1",
                    statusCode: 400,
                    statusMessage: "Bad Request"
                },
                headers: {
                    "Content-Type": "text/plain"
                },
                body: "Unsupported HTTP Version"
            };
            break;
        default:
            response = {
                statusLine: {
                    httpVersion: "HTTP/1.1",
                    statusCode: 400,
                    statusMessage: "Bad Request"
                },
                headers: {
                    "Content-Type": "text/plain"
                },
                body: "Unsupported HTTP Version"
            };
    }

    return { response, systemMessage: "" };

    // const systemMessage: string = createSystemMessage(await response);
    // return { response, systemMessage };
}

// function createSystemMessage(response: sharedResponseInterface): string {
//     let systemMessage = "";
//     if (response.statusLine.statusCode === 200) {
//         systemMessage = "200 OK - Resource served successfully";
//         systemMessage += '\n Body: ' + response.body;
//     } else if (response.statusLine.statusCode === 404) {
//         systemMessage = "404 Not Found - Resource not found";
//         systemMessage += '\n Body: ' + response.body;
//     } else if (Math.floor(response.statusLine.statusCode / 100) === 1) {
//         systemMessage = `${response.statusLine.statusCode} ${response.statusLine.statusMessage} - Informational response`;
//         systemMessage += '\n Body: ' + response.body;
//     } else if (Math.floor(response.statusLine.statusCode / 100) === 3) {
//         systemMessage = `${response.statusLine.statusCode} ${response.statusLine.statusMessage} - Resource redirected`;
//         systemMessage += '\n Body: ' + response.body;
//     } else if (Math.floor(response.statusLine.statusCode / 100) === 4) {
//         systemMessage = `${response.statusLine.statusCode} ${response.statusLine.statusMessage} - An error occurred`;
//         systemMessage += '\n Body: ' + response.body;
//     } else if (Math.floor(response.statusLine.statusCode / 100) === 5) {
//         systemMessage = `${response.statusLine.statusCode} ${response.statusLine.statusMessage} - Server error occurred`;
//         systemMessage += '\n Body: ' + response.body;
//     } else {
//         systemMessage = `${response.statusLine.statusCode} ${response.statusLine.statusMessage} - Response generated`;
//         systemMessage += '\n Body: ' + response.body;
//     }
//     return systemMessage;
// }

export { createSharedResponseFunc };