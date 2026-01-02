import type { ResponseType } from "../interfaces/serverInterface.js";

function createResponseFunc(target: string): ResponseType {
    let response: ResponseType = {
        response: {
            statusLine: {
                httpVersion: "HTTP/1.1",
                statusCode: 200,
                statusMessage: "OK"
            },
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
            },
            body: ""
        },
        systemMessage: ""
    };

    if (target === "/") {
        response.response.body = "Request received successfully";
        response.systemMessage = "200 OK - Root path accessed";
    } else {
        response.response.statusLine.statusCode = 404;
        response.response.statusLine.statusMessage = "Not Found";
        response.response.body = "Resource not found!";
        response.systemMessage = "404 Not Found - Invalid path accessed";
    }

    return response;
}

export { createResponseFunc };
