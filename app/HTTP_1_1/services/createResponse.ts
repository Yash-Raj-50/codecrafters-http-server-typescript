import type { sharedRequestParsedDataInterface, sharedResponseInterface } from "../../shared/interfaces/sharedInterfaces";

function createResponseHTTP1_1Func(requestData: sharedRequestParsedDataInterface): sharedResponseInterface {

    let response: sharedResponseInterface = {
        statusLine: {
            httpVersion: "HTTP/1.1",
            statusCode: 400,
            statusMessage: "Bad Request"
        },
        headers: {
            "Content-Type": "text/plain",
            "Content-Length": 0
        },
        body: "Bad Request"
    }

    if (requestData.httpVersion !== "HTTP/1.1") {
        response.body = "Unsupported HTTP Version Called";
        return response;
    }

    if (requestData.method === "GET") {
        if (requestData.target === '/') {
            response.statusLine.statusCode = 200;
            response.statusLine.statusMessage = "OK";
            response.body = "Welcome to my custom HTTP Server! HTTP/1.1 is working perfectly. More features coming soon.";
            response.headers["Content-Length"] = response.body.length;
            return response;
        } else if (requestData.target.startsWith('/echo/')) {
            response.statusLine.statusCode = 200;
            response.statusLine.statusMessage = "OK";
            response.body = requestData.target.slice(6); // Remove "/echo/" prefix
            response.headers["Content-Length"] = response.body.length;
            return response;
        } else {
            response.statusLine.statusCode = 404;
            response.statusLine.statusMessage = "Not Found";
            response.body = "The requested resource was not found on this server.";
            response.headers["Content-Length"] = response.body.length;
            return response;
        }
    } else {
        response.statusLine.statusCode = 405;
        response.statusLine.statusMessage = "Method Not Allowed";
        response.body = "Only GET Method Supported Currently";
        response.headers["Content-Length"] = response.body.length;
        return response;
    }
}

export { createResponseHTTP1_1Func };
