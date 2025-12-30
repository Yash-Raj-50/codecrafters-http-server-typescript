import * as net from "net";

console.log("Console logging from the main.ts file. Server code is getting executed.");

const server = net.createServer((socket) => {

  console.log("\n------------------ New client connected ------------------\n");

  socket.on("data", (data) => {

    // All data received from the client
    const requestData = data.toString();
    const metadata = requestData.split("\r\n\r\n")[0];
    const requestBody = requestData.split("\r\n\r\n")[1] || "";  // Parse body

    const requestParts = metadata.split("\r\n");
    const [method, requestTarget, httpVersion] = requestParts[0].split(" "); // Parse request line
    const headers: { [key: string]: string } = {}; // Parse headers
    for (let i = 1; i < requestParts.length; i++) {
      const line = requestParts[i];
      if (line === "") break; // End of headers
      const [key, value] = line.split(": ");
      if (key && value) {
        headers[key] = value;
      }
    }

    console.log("!!! New Request Received !!!");
    console.log("Request Method:", method);
    console.log("Request Target:", requestTarget);
    console.log("HTTP Version:", httpVersion);
    console.log("Headers:", headers);
    console.log("Request Body:", requestBody, "\n");

    let responseMessage = "";
    if (requestTarget === "/") {
      socket.write('HTTP/1.1 200 OK\r\n\r\n');
      responseMessage = "Request received successfully";
    } else {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      responseMessage = "Resource not found!";
    }

    const boxPadding = 8;
    const boxWidth = responseMessage.length + boxPadding * 2;
    const topBorder = "┌" + "─".repeat(boxWidth - 2) + "┐";
    const bottomBorder = "└" + "─".repeat(boxWidth - 2) + "┘";
    const paddedMessage = " ".repeat(boxPadding) + responseMessage + " ".repeat(boxPadding - 2);

    socket.end(`
      ${topBorder}
      │${paddedMessage}│
      ${bottomBorder}
    `);
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


