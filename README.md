# Redis Server Implementation

This repository has the purpose of implementing a Redis server from scratch using Node.js.

My goal is to level up my knowledge in internet protocols, data structures, and server design by building a Redis-like server that can handle basic commands and operations.

And having fun while doing it!


## Used Technologies
- Bun
- Node.js
- TypeScript

## Steps taken to implement the redis server

### Base Stage
1. **Bind to port**: I started by creating a TCP server that listens on a specific port for incoming connections. This allows clients to connect to the server and send commands.
2. **PING**: I implemented the PING command, which is a simple command that clients can use to check if the server is responsive. The server responds with "PONG" when it receives a PING command.
3. **ECHO**: I added the ECHO command, which allows clients to send a message to the server and receive the same message back as a response.
4. **SET & GET**: I implemented the SET and GET commands to allow clients to store and retrieve key-value pairs. The SET command allows clients to set a value for a specific key, while the GET command retrieves the value associated with a given key.
5. **Expire**: I added support for expiring keys. This allows clients to set a time-to-live (TTL) for a key, after which the key will be automatically deleted from the server. Implemented with lazy expiration, which means that the server checks for expired keys only when they are accessed.