import type { StringReader, StringWriter } from './strings';

export const comma = ','.charCodeAt(0);
export const semicolon = ';'.charCodeAt(0);

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const intToChar = new Uint8Array(64); // 64 possible chars.
const charToInt = new Uint8Array(128); // z is 122 in ASCII

for (let i = 0; i < chars.length; i++) {
  const c = chars.charCodeAt(i);
  intToChar[i] = c;
  charToInt[c] = i;
}

export function decodeInteger(
  reader: StringReader,
  relative: number,
  signed: boolean = true,
): number {
  let value = 0;
  let shift = 0;
  let integer = 0;

  do {
    const c = reader.next();
    integer = charToInt[c];
    value |= (integer & 31) << shift;
    shift += 5;
  } while (integer & 32);

  const shouldNegate = signed && value & 1;
  if (signed) {
    value >>>= 1;
  }

  if (shouldNegate) {
    value = -0x80000000 | -value;
  }

  return relative + value;
}

export function encodeInteger(
  builder: StringWriter,
  num: number,
  relative: number,
  signed: boolean = true,
): number {
  let delta = num - relative;
  const shift = signed ? 1 : 0;

  delta = delta < 0 ? (-delta << 1) | 1 : delta << shift;
  do {
    let clamped = delta & 0b011111;
    delta >>>= 5;
    if (delta > 0) clamped |= 0b100000;
    builder.write(intToChar[clamped]);
  } while (delta > 0);

  return num;
}

export function hasMoreVlq(reader: StringReader, max: number) {
  if (reader.pos >= max) return false;
  return reader.peek() !== comma;
}
