import * as net from "net";
import { sharedRequestDataParseFunc } from "./shared/services/sharedRequestDataParse.js";
import { createSharedResponseFunc } from "./shared/services/sharedResponse.js";
import { createPaddedBoxMessageFunc } from "./shared/visuals/createPaddedBoxMessage.js";
import type { sharedRequestParsedDataInterface, sharedResponseInterface } from "./shared/interfaces/sharedInterfaces.js";
import { createSharedResponseLineFunc } from "./shared/services/createsharedResponseLine.js";

console.log("Console logging from the main.ts file. Server code is getting executed.");

const server = net.createServer((socket: net.Socket) => {
  console.log("\n------------------ New client connected ------------------\n");

  socket.on("data", (data: Buffer) => {
    const parsedRequestData: sharedRequestParsedDataInterface = sharedRequestDataParseFunc(data);
    const { method, target, httpVersion, headers, requestBody } = parsedRequestData;

    console.log("!!! New Request Received !!!");
    console.log("Request Method:", method);
    console.log("Request Target:", target);
    console.log("HTTP Version:", httpVersion);
    console.log("Headers:", headers);
    console.log("Request Body:", requestBody, "\n");

    const { responseData, systemMessage }: { responseData: sharedResponseInterface; systemMessage: string }
      = createSharedResponseFunc(parsedRequestData);

    console.log("Response to be sent -->");
    console.log("Status Line:", responseData.statusLine);
    console.log("Headers:", responseData.headers);
    console.log("Body:", responseData.body, "\n");

    const responseLine: string = createSharedResponseLineFunc(responseData);

    socket.write(responseLine);
    // socket.write(createPaddedBoxMessageFunc(systemMessage));
    socket.end();
    return;
  });

  socket.on("end", () => {
    console.log("------------------ Client disconnected ------------------\n");
  });

  socket.on("error", (err) => {
    console.error("!!!!!!!!!!! Socket error: \n", err, "\n!!!!!!!!!!!");
  });
});


server.on("error", (err) => {
  console.error("Server error:", err);
});

server.listen(4221, "localhost", () => {
  console.log("Server is listening on port 4221");
});


