import type { sharedRequestParsedDataInterface, sharedResponseInterface } from "../../shared/interfaces/sharedInterfaces";
import type { RouteHandler } from "./handlers";
import {
    handleRoot,
    handleEcho,
    handleUserAgent,
    handleFileServer,
    handleNotFound,
    handleMethodNotAllowed,
    handleUnsupportedVersion,
} from "./handlers";

interface RoutePattern {
    method: string;
    targetPattern: string | RegExp;
    handler: RouteHandler;
}

interface MatchResult {
    handler: RouteHandler;
    params: Record<string, string>;
}

// Define all routes in order of specificity (more specific first)
const routes: RoutePattern[] = [
    {
        method: "GET",
        targetPattern: "/",
        handler: handleRoot,
    },
    {
        method: "GET",
        targetPattern: /^\/echo\/(.+)$/,
        handler: handleEcho,
    },
    {
        method: "GET",
        targetPattern: /^\/user-agent$/,
        handler: handleUserAgent,
    },
    {
        method: "GET",
        targetPattern: /^\/files\/(.+)$/,
        handler: handleFileServer,
    },
];

// Match a target against a pattern
function matchPattern(
    target: string,
    pattern: string | RegExp
): { match: boolean; params: Record<string, string> } {
    if (typeof pattern === "string") {
        return {
            match: target === pattern,
            params: {},
        };
    } else {
        const result = target.match(pattern);
        if (!result) {
            return { match: false, params: {} };
        }
        // Extract named groups or indexed groups
        const params: Record<string, string> = {};
        if (result.groups) {
            Object.assign(params, result.groups);
        } else {
            // Indexed groups
            if (result.length > 1) {
                params.message = result[1]; // For /echo/:message
                params.filePath = result[1]; // For /files/:filePath   
            }
        }
        return { match: true, params };
    }
}

// Router: Match request and find appropriate handler
function router(
    requestData: sharedRequestParsedDataInterface,
    args: string[]
): MatchResult {
    const { method, target } = requestData;

    // Find matching route
    for (const route of routes) {
        if (route.method === method) {
            const { match, params } = matchPattern(target, route.targetPattern);
            if (match) {
                return { handler: route.handler, params };
            }
        }
    }

    // Check if method is not supported at all
    const methodExists = routes.some((r) => r.method === method);
    if (!methodExists) {
        return {
            handler: handleMethodNotAllowed,
            params: {},
        };
    }

    // Default: route not found
    return {
        handler: handleNotFound,
        params: {},
    };
}

export { router, type RoutePattern, type MatchResult };
