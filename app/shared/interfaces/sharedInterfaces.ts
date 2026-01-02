interface sharedRequestParsedDataInterface {
    method: string;
    target: string;
    httpVersion: string;
    headers: { [key: string]: string | number };
    requestBody: string;
}

interface sharedResponseInterface {
    statusLine: {
        httpVersion: string,
        statusCode: number,
        statusMessage: string
    },
    headers: { [key: string]: string | number },
    body: string
}

export type { sharedRequestParsedDataInterface, sharedResponseInterface };