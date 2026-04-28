import * as net from "node:net";

export function writeError(connection: net.Socket, error: string | Error | unknown) {
    const message = typeof error === 'string' ? error : error instanceof Error ? error.message : 'Unknown error';

    connection.write(`-ERR ${message}\r\n`);
}

export function writeBulkString(connection: net.Socket, message: string | null) {
    if (message === null) {
        connection.write('$-1\r\n');
    } else {
        connection.write(`$${message.length}\r\n${message}\r\n`);
    }
}

export function writeSimpleString(connection: net.Socket, message: string) {
    connection.write(`+${message}\r\n`);
}

export function writeInteger(connection: net.Socket, value: number) {
    connection.write(`:${value}\r\n`);
}

export function writeArray(connection: net.Socket, items: (string | null)[]) {
    connection.write(`*${items.length}\r\n`);
    for (const item of items) {
        writeBulkString(connection, item);
    }
}