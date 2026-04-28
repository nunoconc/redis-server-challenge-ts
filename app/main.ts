import * as net from "net";
import Resp from "./resp.ts";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");


// Uncomment the code below to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    const resp = new Resp();

    // Handle connection
    connection.on("data", (data: Buffer) => {
        try {
            resp.append(data);

            let parsedData;
            
            while ((parsedData = resp.parseNext()) !== null) {
                // Handle the parsed command
                if (Array.isArray(parsedData)) {
                    const [command, ...args] = parsedData;

                    if (command === 'PING') {
                        connection.write('+PONG\r\n');
                    } else if (command === 'ECHO' && parsedData.length >= 2) {
                        const message = args[0];

                        if(typeof message !== 'string') {
                            throw new Error(`Expected string, got '${typeof message}'`);
                        }

                        connection.write(`$${message.length}\r\n${message}\r\n`);
                    } else {
                        throw new Error(`Unknown command '${command}'`);
                    }

                } else {
                    throw new Error(`Expected array, got '${typeof parsedData}'`);
                }
            }
        } catch (error) {
            // Send error response but keep connection alive
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            connection.write(`-ERR ${errorMessage}\r\n`);
            
            // Clear the buffer to avoid getting stuck on invalid data
            resp.clearBuffer();
        }
    })
});

server.listen(6379, "127.0.0.1");
