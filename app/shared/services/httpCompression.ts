// import { gzip } from "zlib";
import type { sharedResponseInterface } from "../interfaces/sharedInterfaces";

const supportedCompressions = [
    "gzip",
    // Future compression algorithms can be added here
];

export function httpCompression(
    requestHeaders: { [key: string]: string },
    responseData: sharedResponseInterface,
): sharedResponseInterface {

    (requestHeaders["accept-encoding"]?.split(',').map(enc => enc.trim()) || []).forEach(enc => {
        if (supportedCompressions.includes(enc)) {
            switch (enc) {
                case "gzip":
                    responseData.headers["Content-Encoding"] = enc;
                    break;
                default:
                    break;
            }
            return responseData;
        }
    });
    return responseData;
}