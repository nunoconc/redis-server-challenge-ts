type RespType = string | number | Array<RespType> | null | Error;
type RespParserType = { value: RespType | null, bytesConsumed: number } | null

const CRLF = '\r\n';
const CRLF_LENGTH = CRLF.length;

class Resp {
    buffer: Buffer = Buffer.alloc(0);


    public append(data: Buffer) {
        this.buffer = Buffer.concat([this.buffer, data]);
    }

    public clearBuffer() {
        this.buffer = Buffer.alloc(0);
    }

    public parseNext(): RespType | null {
        if (this.buffer.length === 0) {
            return null;
        }

        const result = this.parse(0);

        if (!result) {
            return null;
        }

        this.buffer = this.buffer.subarray(result.bytesConsumed);

        return result.value;
    }

    private parse(offset: number): RespParserType {
        if (offset >= this.buffer.length) {
            return null;
        }

        const type = String.fromCharCode(this.buffer[offset]);

        const parseHandler = this.respParseHandlers[type];

        if (!parseHandler) {
            throw new Error(`Unknown RESP type: ${type}`);
        }

        return parseHandler.apply(this, [offset]);
    }

    respParseHandlers: { [key: string]: (offset: number) => RespParserType } = {
        '+': this.parseSimpleString,
        '-': this.parseError,
        ':': this.parseInteger,
        '$': this.parseBulkString,
        '*': this.parseArray
    }

    parseSimpleString(offset: number) {
        const lineEnd = this.buffer.indexOf(CRLF, offset);

        if (lineEnd === -1) {
            return null;
        }

        return {
            value: this.buffer.toString('utf-8', offset + 1, lineEnd),
            bytesConsumed: lineEnd + CRLF_LENGTH - offset
        };
    }

    parseError(offset: number) {
        const res = this.parseSimpleString(offset);

        return res ? {
            value: new Error(res.value),
            bytesConsumed: res.bytesConsumed
        } : null;
    }

    parseInteger(offset: number) {
        const res = this.parseSimpleString(offset);

        return res ? {
            value: parseInt(res.value),
            bytesConsumed: res.bytesConsumed
        } : null;
    }

    parseBulkString(offset: number) {
        const lineEnd = this.buffer.indexOf(CRLF, offset);

        if (lineEnd === -1) {
            return null;
        }

        const length = parseInt(this.buffer.toString('utf-8', offset + 1, lineEnd));

        if (length === -1) {
            return {
                value: null,
                bytesConsumed: lineEnd + CRLF_LENGTH - offset
            };
        }

        const dataStart = lineEnd + CRLF_LENGTH;
        const dataEnd = dataStart + length;

        if (dataEnd + CRLF_LENGTH > this.buffer.length) {
            return null;
        }

        return {
            value: this.buffer.toString('utf-8', dataStart, dataEnd),
            bytesConsumed: dataEnd + CRLF_LENGTH - offset
        }

    }

    parseArray(offset: number) {
        const lineEnd = this.buffer.indexOf(CRLF, offset);

        if (lineEnd === -1) {
            return null;
        }

        const length = parseInt(this.buffer.toString('utf-8', offset + 1, lineEnd));

        if (length === -1) {
            return {
                value: null,
                bytesConsumed: lineEnd + CRLF_LENGTH - offset
            };
        }

        let currentOffset = lineEnd + CRLF_LENGTH;

        const parsedItems: RespType[] = [];

        for (let i = 0; i < length; i++) {
            const parsedItem = this.parse(currentOffset);

            if (!parsedItem) {
                return null;
            }


            parsedItems.push(parsedItem.value);
            currentOffset += parsedItem.bytesConsumed;
        }

        return {
            value: parsedItems,
            bytesConsumed: currentOffset - offset
        };
    }


}

export default Resp;