import type { sharedResponseInterface } from "../interfaces/sharedInterfaces";

const supportedCompressions = [
    "gzip",
    // Future compression algorithms can be added here
];

export function httpCompression(
    requestHeaders: { [key: string]: string },
    responseData: sharedResponseInterface,
): sharedResponseInterface {

    const encodings = (requestHeaders["accept-encoding"]?.split(',').map(enc => enc.trim()) || []);

    for (const enc of encodings) {
        if (supportedCompressions.includes(enc)) {
            switch (enc) {
                case "gzip":
                    responseData.headers["Content-Encoding"] = enc;
                    responseData.body = Bun.gzipSync(responseData.body as string);
                    responseData.headers["Content-Length"] = (responseData.body as Buffer).length;
                    break;
                default:
                    break;
            }
            break; // Exit after applying compression
        }
    }

    return responseData;
}