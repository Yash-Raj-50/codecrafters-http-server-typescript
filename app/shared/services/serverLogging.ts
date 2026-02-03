interface LoggerOptions<T = any> {
    data: T;
    /**
     * A runtime label describing the shape/interface of `data`.
     * Pass a string like "RequestData" or "ResponseData". TypeScript
     * interfaces are erased at runtime so a string is required to identify them.
     */
    dataKind?: string;
    type?: "info" | "error" | "debug" | "warn";
    level?: 0 | 1 | 2 | 3;
}

function serverLogger<T = any>({ data, dataKind = undefined, type = "info", level = 0 }: LoggerOptions<T>): void {
    const timeStamp: string = new Date().toISOString();
    const logType: string = type ? type.toUpperCase() : "INFO";
    const logLevel: number = level;

    let prefix: string = `[${timeStamp}] [${logType}]`;
    prefix += dataKind ? ` [${dataKind}]` : ` [GENERAL]`;

    const payload: string = typeof data === "string" ? data : JSON.stringify(data, null, 2);

    const message = `${prefix} ${payload}`;

    switch (type) {
        case "error":
            console.error(message);
            break;
        case "warn":
            console.warn(message);
            break;
        case "debug":
            // Some environments don't show console.debug; fall back to log
            if (console.debug) console.debug(message);
            else console.log(message);
            break;
        default:
            console.log(message);
    }
}

export default serverLogger;