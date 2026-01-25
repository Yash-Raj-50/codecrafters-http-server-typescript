interface sharedRequestParsedDataInterface {
    method: string;
    target: string;
    httpVersion: string;
    headers: { [key: string]: string };
    requestBody: string;
}

interface sharedResponseInterface {
    statusLine: {
        httpVersion: string,
        statusCode: number,
        statusMessage: string
    },
    headers: { [key: string]: string | number },
    body: string | number | Buffer | object;
}

export type { sharedRequestParsedDataInterface, sharedResponseInterface };