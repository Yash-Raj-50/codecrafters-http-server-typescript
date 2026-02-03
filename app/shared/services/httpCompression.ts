// import { gzip } from "zlib";
import type { sharedResponseInterface } from "../interfaces/sharedInterfaces";

const supportedCompressions = [
    "gzip",
    // Future compression algorithms can be added here
];

export function compressResponse(
    requestHeaders: { [key: string]: string },
    responseData: sharedResponseInterface,
): sharedResponseInterface {

    for (const compression of supportedCompressions) {
        if (requestHeaders["accept-encoding"]?.includes(compression)) {
            switch (compression) {
                case "gzip":
                    responseData.headers["Content-Encoding"] = compression;
                    break;
                default:
                    // Future compression algorithms can be handled here
                    break;
            }
            break; // Apply only the first supported compression
        }
    }
    return responseData;
}