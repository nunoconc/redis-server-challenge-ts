import * as net from "net";
import Resp, {type RespType} from "./resp.ts";
import handleCommand from "./command.ts";
import {writeError} from "./writer.ts";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const resp = new Resp();

const server: net.Server = net.createServer((connection: net.Socket) => {

    // Handle connection
    connection.on("data", (data: Buffer) => {
        try {
            resp.append(data);

            let parsedData: RespType | null;
            
            while ((parsedData = resp.parseNext()) !== null) {
                // Handle the parsed command

                handleCommand(connection, parsedData);
            }
        } catch (error) {
            // Send error response but keep connection alive
            writeError(connection, error);
            
            // Clear the buffer to avoid getting stuck on invalid data
            resp.clearBuffer();
        }
    })
});

server.listen(6379, "127.0.0.1");
