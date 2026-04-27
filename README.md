# Redis Server Implementation

This repository has the purpose of implementing a Redis server from scratch using Node.js.

My goal is to level up my knowledge in internet protocols, data structures, and server design by building a Redis-like server that can handle basic commands and operations.

And having fun while doing it!


## Used Technologies
- Node.js
- TypeScript

## Steps taken to implement the redis server

1. **Bind to port**: I started by creating a TCP server that listens on a specific port for incoming connections. This allows clients to connect to the server and send commands.
2. **PING**: I implemented the PING command, which is a simple command that clients can use to check if the server is responsive. The server responds with "PONG" when it receives a PING command.
