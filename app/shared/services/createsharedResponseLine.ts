import type { sharedResponseInterface } from "../interfaces/sharedInterfaces";

function createSharedResponseLineFunc(responseData: sharedResponseInterface): string {
    let responseLine = "";

    // Append status line
    responseLine += responseData.statusLine.httpVersion + " " +
        responseData.statusLine.statusCode + " " +
        responseData.statusLine.statusMessage + "\r\n";

    // Append headers
    for (const headerKey in responseData.headers) {
        responseLine += headerKey + ": " + responseData.headers[headerKey] + "\r\n";
    }
    responseLine += "\r\n"; // End of headers
    // Body handled in Main
    return responseLine;
}

export { createSharedResponseLineFunc };