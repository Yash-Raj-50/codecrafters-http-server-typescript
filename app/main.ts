import * as net from "net";
import { sharedRequestDataParseFunc } from "./shared/services/sharedRequestDataParse.js";
import { createSharedResponseFunc } from "./shared/services/sharedResponse.js";
import { createSharedResponseLineFunc } from "./shared/services/createsharedResponseLine.js";
// import { createPaddedBoxMessageFunc } from "./shared/visuals/createPaddedBoxMessage.js";
import type { sharedRequestParsedDataInterface, sharedResponseInterface } from "./shared/interfaces/sharedInterfaces.js";
import serverLogger from "./shared/services/serverLogger.js";

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

    const { responseData, systemMessage }: { responseData: sharedResponseInterface | Promise<sharedResponseInterface>; systemMessage: string }
      = await createSharedResponseFunc(parsedRequestData, args);

    logger({
      data: "Response to be sent -->",
      dataKind: "Main", type: "info", level: 1
    });
    logger({
      data: responseData,
      dataKind: "ResponseData", type: "debug", level: 2
    });

    const responseLine: string = createSharedResponseLineFunc(await responseData);

    socket.write(responseLine);
    // socket.write(createPaddedBoxMessageFunc(systemMessage));
    socket.end();
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


