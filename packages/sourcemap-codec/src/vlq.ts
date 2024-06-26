const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const intToChar = new Uint8Array(64); // 64 possible chars.
const charToInt = new Uint8Array(128); // z is 122 in ASCII

for (let i = 0; i < chars.length; i++) {
  const c = chars.charCodeAt(i);
  intToChar[i] = c;
  charToInt[c] = i;
}

export const comma = ','.charCodeAt(0);
export const semicolon = ';'.charCodeAt(0);

export function hasMoreVlq(mappings: string, i: number, length: number): boolean {
  if (i >= length) return false;
  return mappings.charCodeAt(i) !== comma;
}

export function indexOf(mappings: string, char: string, index: number): number {
  const idx = mappings.indexOf(char, index);
  return idx === -1 ? mappings.length : idx;
}

export let posOut = 0;
export function resetPos() {
  posOut = 0;
}

export function decodeInteger(mappings: string, pos: number, relative: number): number {
  let value = 0;
  let shift = 0;
  let integer = 0;

  do {
    const c = mappings.charCodeAt(pos++);
    integer = charToInt[c];
    value |= (integer & 31) << shift;
    shift += 5;
  } while (integer & 32);

  const shouldNegate = value & 1;
  value >>>= 1;

  if (shouldNegate) {
    value = -0x80000000 | -value;
  }

  posOut = pos;
  return relative + value;
}

export function encodeInteger(buf: Uint8Array, pos: number, num: number, relative: number): number {
  let delta = num - relative;

  delta = delta < 0 ? (-delta << 1) | 1 : delta << 1;
  do {
    let clamped = delta & 0b011111;
    delta >>>= 5;
    if (delta > 0) clamped |= 0b100000;
    buf[pos++] = intToChar[clamped];
  } while (delta > 0);

  posOut = pos;
  return num;
}

export function maybeFlush(
  build: string,
  buf: Uint8Array,
  pos: number,
  copy: Uint8Array,
  length: number,
): string {
  if (pos < length) {
    posOut = pos;
    return build;
  }
  const out = td.decode(buf);
  copy.copyWithin(0, length, pos);
  posOut = pos - length;
  return build + out;
}

export function write(buf: Uint8Array, pos: number, value: number) {
  buf[pos] = value;
  posOut = pos + 1;
}

// Provide a fallback for older environments.
export const td =
  typeof TextDecoder !== 'undefined'
    ? /* #__PURE__ */ new TextDecoder()
    : typeof Buffer !== 'undefined'
    ? {
        decode(buf: Uint8Array) {
          const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
          return out.toString();
        },
      }
    : {
        decode(buf: Uint8Array) {
          let out = '';
          for (let i = 0; i < buf.length; i++) {
            out += String.fromCharCode(buf[i]);
          }
          return out;
        },
      };
