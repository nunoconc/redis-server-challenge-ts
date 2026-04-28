import type {RespType} from "./resp.ts";
import * as net from "node:net";
import DataStorage from "./storage.ts";
import {writeBulkString, writeSimpleString} from "./writer.ts";

export default function handleCommand(connection: net.Socket, parsedData: RespType) {

    if (Array.isArray(parsedData)) {
        const [command, ...args] = parsedData;

        if(typeof command !== 'string') {
            throw new Error(`Expected string, got '${typeof command}'`);
        }

        const handler = commandMap[command];

        if(!handler) {
            throw new Error(`Unknown command '${command}'`);
        }

        handler(connection, args);

    } else {
        throw new Error(`Expected array, got '${typeof parsedData}'`);
    }
}

const commandMap: { [key: string]: (connection: net.Socket, args: RespType[]) => void } = {
    'PING': ping,
    'ECHO': echo,
    'SET': set,
    'GET': get,
}

function ping(connection: net.Socket) {
    writeSimpleString(connection, 'PONG');
}

function echo(connection: net.Socket, [message]: RespType[]) {
    if(typeof message !== 'string') {
        throw new Error(`Expected string, got '${typeof message}'`);
    }

    writeBulkString(connection, message);
}

function set(connection: net.Socket, [key, value, expiryUnit, expiryTime ]: RespType[]) {
    if(typeof key !== 'string' || typeof value !== 'string') {
        throw new Error(`Expected string, got '${typeof key}' or '${typeof value}'`);
    }

    if(!expiryUnit && !expiryTime) {
        DataStorage.set(key, value);

        writeSimpleString(connection, 'OK');
        return;
    }

    if(typeof expiryUnit !== 'string' || typeof expiryTime !== 'string') {
        throw new Error(`Expected string and number, got '${typeof expiryUnit}' or '${typeof expiryTime}'`);
    }

    DataStorage.set(key, value, expiryUnit, expiryTime);
    writeSimpleString(connection, 'OK');
}

function get(connection: net.Socket, [key]: RespType[]) {
    if(typeof key !== 'string') {
        throw new Error(`Expected string, got '${typeof key}'`);
    }

    const data = DataStorage.get(key);

    writeBulkString(connection, data);
}


