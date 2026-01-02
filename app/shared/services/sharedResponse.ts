import type { sharedRequestParsedDataInterface, sharedResponseInterface } from "../interfaces/sharedInterfaces";
import { createResponseHTTP1_1Func } from "../../HTTP_1_1/services/createResponse";

function createSharedResponseFunc(requestData: sharedRequestParsedDataInterface): { responseData: sharedResponseInterface; systemMessage: string } {

    let responseData: sharedResponseInterface;
    switch (requestData.httpVersion) {
        case "HTTP/1.1":
            responseData = createResponseHTTP1_1Func(requestData);
            break;
        case "HTTP/2.0":
            // Future implementation for HTTP/2.0 can be added here
            responseData = {
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
            responseData = {
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

    const systemMessage: string = createSystemMessage(responseData);
    return { responseData, systemMessage };
}

function createSystemMessage(responseData: sharedResponseInterface): string {
    let systemMessage = "";
    if (responseData.statusLine.statusCode === 200) {
        systemMessage = "200 OK - Resource served successfully";
        systemMessage += '\n Body: ' + responseData.body;
    } else if (responseData.statusLine.statusCode === 404) {
        systemMessage = "404 Not Found - Resource not found";
        systemMessage += '\n Body: ' + responseData.body;
    } else if (Math.floor(responseData.statusLine.statusCode / 100) === 1) {
        systemMessage = `${responseData.statusLine.statusCode} ${responseData.statusLine.statusMessage} - Informational response`;
        systemMessage += '\n Body: ' + responseData.body;
    } else if (Math.floor(responseData.statusLine.statusCode / 100) === 3) {
        systemMessage = `${responseData.statusLine.statusCode} ${responseData.statusLine.statusMessage} - Resource redirected`;
        systemMessage += '\n Body: ' + responseData.body;
    } else if (Math.floor(responseData.statusLine.statusCode / 100) === 4) {
        systemMessage = `${responseData.statusLine.statusCode} ${responseData.statusLine.statusMessage} - An error occurred`;
        systemMessage += '\n Body: ' + responseData.body;
    } else if (Math.floor(responseData.statusLine.statusCode / 100) === 5) {
        systemMessage = `${responseData.statusLine.statusCode} ${responseData.statusLine.statusMessage} - Server error occurred`;
        systemMessage += '\n Body: ' + responseData.body;
    } else {
        systemMessage = `${responseData.statusLine.statusCode} ${responseData.statusLine.statusMessage} - Response generated`;
        systemMessage += '\n Body: ' + responseData.body;
    }
    return systemMessage;
}

export { createSharedResponseFunc };