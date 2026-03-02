import * as net from "net";
import { sharedRequestDataParseFunc } from "./shared/services/sharedRequestDataParse.ts";
import { createSharedResponseFunc } from "./shared/services/sharedResponse.ts";
import { createSharedResponseLineFunc } from "./shared/services/createsharedResponseLine.ts";
// import { createPaddedBoxMessageFunc } from "./shared/visuals/createPaddedBoxMessage.ts";
import type { sharedRequestParsedDataInterface, sharedResponseInterface } from "./shared/interfaces/sharedInterfaces.ts";
import serverLogger from "./shared/services/serverLogging.ts";

const logger = serverLogger;

logger({
  data: "Console logging from the main.ts file. Server code is getting executed.",
  dataKind: "Main", type: "info", level: 0
});

const args = process.argv.slice(2);
logger({
  data: `Command-line arguments: ${args}`,
  dataKind: "Main", type: "info", level: 0
});

const server = net.createServer((socket: net.Socket) => {
  logger({ data: "------------------ New client connected ------------------", dataKind: "Main", type: "info", level: 0 });

  socket.on("data", async (data: Buffer) => {
    const parsedRequestData: sharedRequestParsedDataInterface = sharedRequestDataParseFunc(data);

    logger({
      data: "!!! New Request Received !!!",
      dataKind: "Main", type: "info", level: 1
    });
    logger({
      data: parsedRequestData,
      dataKind: "ParsedRequestData", type: "debug", level: 2
    });

    const { response, systemMessage }: { response: sharedResponseInterface | Promise<sharedResponseInterface>; systemMessage: string }
      = await createSharedResponseFunc(parsedRequestData, args);

    logger({
      data: "Response to be sent -->",
      dataKind: "Main", type: "info", level: 1
    });
    logger({
      data: response,
      dataKind: "ResponseData", type: "debug", level: 2
    });

    const responseLine: string = createSharedResponseLineFunc(await response);

    socket.write(responseLine);
    socket.write((await response).body as string); // Write body separately to handle cases where body is compressed or binary data.
    // socket.write(createPaddedBoxMessageFunc(systemMessage));

    if ((await response).headers["connection"] === "close") {
      socket.end(); // Ending the socket with the request only when asked, otherwise open to allow for multiple requests from the same client. 
      // Clients decide when to close the connection by sending "Connection: close" header in their request. This allows for better performance by reusing the same connection for multiple requests, which is a key feature of HTTP/1.1.
    }
    return;
  });

  socket.on("end", () => {
    logger({
      data: "------------------ Client disconnected ------------------",
      dataKind: "Main", type: "info", level: 0
    });
  });

  socket.on("error", (err) => {
    logger({
      data: `!!!!!!!!!!! Socket error: \n${err}\n!!!!!!!!!!!`,
      dataKind: "Main", type: "error", level: 2
    });
  });
});


server.on("error", (err) => {
  logger({
    data: `!!!!!!!!!!! Server error: \n${err}\n!!!!!!!!!!!`,
    dataKind: "Main", type: "error", level: 3
  });
});

server.listen(4221, "localhost", () => {
  logger({
    data: "Server is listening on port 4221",
    dataKind: "Main", type: "info", level: 0
  });
});


