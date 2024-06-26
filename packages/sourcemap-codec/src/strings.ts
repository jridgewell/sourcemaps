const bufLength = 1024 * 16;
export const comma = ','.charCodeAt(0);
export const semicolon = ';'.charCodeAt(0);

// Provide a fallback for older environments.
const td =
  typeof TextDecoder !== 'undefined'
    ? /* #__PURE__ */ new TextDecoder()
    : typeof Buffer !== 'undefined'
    ? {
        decode(buf: Uint8Array): string {
          const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
          return out.toString();
        },
      }
    : {
        decode(buf: Uint8Array): string {
          let out = '';
          for (let i = 0; i < buf.length; i++) {
            out += String.fromCharCode(buf[i]);
          }
          return out;
        },
      };

export class StringWriter {
  pos = 0;
  private out = '';
  private buffer = new Uint8Array(bufLength);

  write(v: number): void {
    const { buffer } = this;
    buffer[this.pos++] = v;
    if (this.pos === bufLength) {
      this.out += td.decode(buffer);
      this.pos = 0;
    }
  }

  flush(): string {
    const { buffer, out, pos } = this;
    return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
  }
}

export class StringReader {
  pos = 0;
  private declare buffer: string;

  constructor(buffer: string) {
    this.buffer = buffer;
  }

  next(): number {
    return this.buffer.charCodeAt(this.pos++);
  }

  hasMoreVlq(max: number): boolean {
    const { buffer, pos } = this;
    if (pos >= max) return false;
    return buffer.charCodeAt(pos) !== comma;
  }

  indexOf(char: string): number {
    const { buffer, pos } = this;
    const idx = buffer.indexOf(char, pos);
    return idx === -1 ? buffer.length : idx;
  }
}
