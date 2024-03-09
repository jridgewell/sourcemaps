import {
  decodeInteger,
  encodeInteger,
  comma,
  semicolon,
  hasMoreVlq,
  posOut,
  indexOf,
  td,
} from './vlq';
// export { decodeOriginalScopes } from './scopes';

export type SourceMapSegment =
  | [number]
  | [number, number, number, number]
  | [number, number, number, number, number];
export type SourceMapLine = SourceMapSegment[];
export type SourceMapMappings = SourceMapLine[];

export function decode(mappings: string): SourceMapMappings {
  const decoded: SourceMapMappings = [];
  let genColumn = 0;
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;

  let index = 0;
  do {
    const semi = indexOf(mappings, ';', index);
    const line: SourceMapLine = [];
    let sorted = true;
    let lastCol = 0;
    genColumn = 0;

    for (let i = index; i < semi; i = posOut + 1) {
      let seg: SourceMapSegment;

      genColumn = decodeInteger(mappings, i, genColumn);
      if (genColumn < lastCol) sorted = false;
      lastCol = genColumn;

      if (hasMoreVlq(mappings, posOut, semi)) {
        sourcesIndex = decodeInteger(mappings, posOut, sourcesIndex);
        sourceLine = decodeInteger(mappings, posOut, sourceLine);
        sourceColumn = decodeInteger(mappings, posOut, sourceColumn);

        if (hasMoreVlq(mappings, posOut, semi)) {
          namesIndex = decodeInteger(mappings, posOut, namesIndex);
          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex];
        } else {
          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn];
        }
      } else {
        seg = [genColumn];
      }

      line.push(seg);
    }

    if (!sorted) sort(line);
    decoded.push(line);
    index = semi + 1;
  } while (index <= mappings.length);

  return decoded;
}

function sort(line: SourceMapSegment[]) {
  line.sort(sortComparator);
}

function sortComparator(a: SourceMapSegment, b: SourceMapSegment): number {
  return a[0] - b[0];
}

export function encode(decoded: SourceMapMappings): string;
export function encode(decoded: Readonly<SourceMapMappings>): string;
export function encode(decoded: Readonly<SourceMapMappings>): string {
  const bufLength = 1024 * 16;
  const subLength = bufLength - 36;
  const buf = new Uint8Array(bufLength);
  const sub = buf.subarray(0, subLength);
  let pos = 0;
  let out = '';
  let genColumn = 0;
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;

  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    if (i > 0) {
      if (pos === bufLength) {
        out += td.decode(buf);
        pos = 0;
      }
      buf[pos++] = semicolon;
    }
    if (line.length === 0) continue;

    genColumn = 0;

    for (let j = 0; j < line.length; j++, pos = posOut) {
      const segment = line[j];
      // We can push up to 5 ints, each int can take at most 7 chars, and we
      // may push a comma.
      if (pos > subLength) {
        out += td.decode(sub);
        buf.copyWithin(0, subLength, pos);
        pos -= subLength;
      }
      if (j > 0) buf[pos++] = comma;

      genColumn = encodeInteger(buf, pos, segment[0], genColumn);

      if (segment.length === 1) continue;
      sourcesIndex = encodeInteger(buf, posOut, segment[1], sourcesIndex);
      sourceLine = encodeInteger(buf, posOut, segment[2], sourceLine);
      sourceColumn = encodeInteger(buf, posOut, segment[3], sourceColumn);

      if (segment.length === 4) continue;
      namesIndex = encodeInteger(buf, posOut, segment[4], namesIndex);
    }
  }

  return out + td.decode(buf.subarray(0, pos));
}
