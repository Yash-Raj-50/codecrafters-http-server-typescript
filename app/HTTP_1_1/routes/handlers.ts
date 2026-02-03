import type { sharedRequestParsedDataInterface, sharedResponseInterface } from "../../shared/interfaces/sharedInterfaces";

type RouteHandler = (
    requestData: sharedRequestParsedDataInterface,
    args: string[],
    params?: Record<string, string>
) => sharedResponseInterface | Promise<sharedResponseInterface>;

// Helper function to create a default response object
function createDefaultResponse(
    statusCode: number = 400,
    statusMessage: string = "Bad Request",
    body: string | number | ArrayBuffer | Buffer | object = "Bad Request",
): sharedResponseInterface {
    const headers: { [key: string]: string | number } = {};

    if (typeof body === "string" || typeof body === "number") {
        headers["Content-Type"] = "text/plain";
        headers["Content-Length"] = body.toString().length;
    } else if (Buffer.isBuffer(body)) {
        headers["Content-Type"] = "application/octet-stream";
        headers["Content-Length"] = (body as Buffer).length;
    } else if (typeof body === "object" && body !== null) {
        const jsonString = JSON.stringify(body);
        headers["Content-Length"] = Buffer.byteLength(jsonString);
        headers["Content-Type"] = "application/json";
    } else {
        headers["Content-Length"] = 0;
    }

    return {
        statusLine: {
            httpVersion: "HTTP/1.1",
            statusCode,
            statusMessage,
        },
        headers,
        body,
    };
}

// Route handler: GET /
const handleRoot: RouteHandler = (requestData, args) => {
    const body = "Welcome to my custom HTTP Server! HTTP/1.1 is working perfectly. More features coming soon.";
    return createDefaultResponse(200, "OK", body);
};

// Route handler: GET /echo/:message
const handleEcho: RouteHandler = (requestData, args, params) => {
    const message = params?.message || "";
    return createDefaultResponse(200, "OK", message);
};

// Route handler: GET /user-agent
const handleUserAgent: RouteHandler = (requestData, args) => {
    const userAgent = requestData.headers["user-agent"] || "Unknown";
    return createDefaultResponse(200, "OK", userAgent);
};

const handleFileServer: RouteHandler = async (requestData, args, params) => {
    const filePath = params?.filePath || "";
    let status_code = 200,
        message = "OK",
        body: Buffer | string | undefined;
    if (!args.includes("--directory")) {
        status_code = 403;
        message = "Forbidden";
        body = "Directory serving not enabled. Use --directory <path> to enable.";
    } else {
        const directoryIndex = args.indexOf("--directory") + 1;
        const directoryPath = args[directoryIndex];
        const fullPath = require("path").join(directoryPath, filePath);
        const file = Bun.file(fullPath);
        if (await file.exists()) {
            status_code = 200;
            message = "OK";
            const fileBuffer = Buffer.from(await file.arrayBuffer());
            body = fileBuffer;
        } else {
            status_code = 404;
            message = "Not Found";
            body = "";
        }
    }
    return createDefaultResponse(status_code, message, body);
}

const handleFileCreation: RouteHandler = async (requestData, args, params) => {
    const filename = params?.filename || "";
    let status_code = 201,
        message = "Created",
        body: string | undefined;
    if (!args.includes("--directory")) {
        status_code = 403;
        message = "Forbidden";
        body = "Directory serving not enabled. Use --directory <path> to enable.";
    } else if (filename === "") {
        status_code = 400;
        message = "Bad Request";
        body = "Filename not provided in the URL.";
    } else if (requestData.headers['content-type'] !== 'application/octet-stream') {
        status_code = 415;
        message = "Unsupported Media Type";
        body = "Only 'application/octet-stream' content type is supported for file creation as of now.";
    } else {
        const directoryIndex = args.indexOf("--directory") + 1;
        const directoryPath = args[directoryIndex];
        const fullPath = require("path").join(directoryPath, filename);
        try {
            const writeStream = Bun.write(fullPath, requestData.requestBody as string | Uint8Array | Blob);
            await writeStream;
            status_code = 201;
            message = "Created";
            body = `File created at ${fullPath}`;
        } catch (error) {
            status_code = 500;
            message = "Internal Server Error";
            body = `Error creating file: ${error}`;
        }
    }
    return createDefaultResponse(status_code, message, body);
};

// Route handler: 404 Not Found
const handleNotFound: RouteHandler = (requestData, args) => {
    const body = "The requested resource was not found on this server.";
    return createDefaultResponse(404, "Not Found", body);
};

// Route handler: 405 Method Not Allowed
const handleMethodNotAllowed: RouteHandler = (requestData, args) => {
    const body = "Only GET Method Supported Currently";
    return createDefaultResponse(405, "Method Not Allowed", body);
};

// Route handler: Unsupported HTTP Version
const handleUnsupportedVersion: RouteHandler = (requestData, args) => {
    const body = "Unsupported HTTP Version Called";
    return createDefaultResponse(400, "Bad Request", body);
};

export {
    handleRoot,
    handleEcho,
    handleUserAgent,
    handleFileServer,
    handleFileCreation,
    handleNotFound,
    handleMethodNotAllowed,
    handleUnsupportedVersion,
    createDefaultResponse,
    type RouteHandler,
};
