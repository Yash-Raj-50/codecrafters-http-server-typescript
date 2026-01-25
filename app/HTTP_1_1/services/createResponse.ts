import type { sharedRequestParsedDataInterface, sharedResponseInterface } from "../../shared/interfaces/sharedInterfaces";
import { router } from "../routes/router";
import { handleUnsupportedVersion } from "../routes/handlers";

function createResponseHTTP1_1Func(
    requestData: sharedRequestParsedDataInterface,
    args: string[] = []
): sharedResponseInterface | Promise<sharedResponseInterface> {
    // Validate HTTP version
    if (requestData.httpVersion !== "HTTP/1.1") {
        return handleUnsupportedVersion(requestData, args);
    }

    // Route the request to appropriate handler
    const { handler, params } = router(requestData, args);
    const response = handler(requestData, args, params);

    return response;
}

export { createResponseHTTP1_1Func };
