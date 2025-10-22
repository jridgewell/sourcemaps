import { StringReader, StringWriter } from './strings';
import { decodeInteger, encodeInteger, semicolon } from './vlq';

export type MappingIndex = number;
export type RangeMappings = MappingIndex[][];

export function decodeRangeMappings(input: string): RangeMappings {
  const { length } = input;
  const reader = new StringReader(input);
  const rangeMappings: RangeMappings = [];
  let offset = 0;

  do {
    const semi = reader.indexOf(';');
    const indices: MappingIndex[] = [];
    offset = 0;

    while (reader.pos < semi) {
      offset = decodeInteger(reader, offset, false);
      indices.push(offset - 1);
    }

    rangeMappings.push(indices);
    reader.pos = semi + 1;
  } while (reader.pos <= length);

  return rangeMappings;
}

export function encodeRangeMappings(decoded: RangeMappings): string {
  if (decoded.length === 0) return '';

  const writer = new StringWriter();

  for (const [index, line] of decoded.entries()) {
    if (index > 0) writer.write(semicolon);
    let lastOffset = 0;
    for (const offset of line) {
      encodeInteger(writer, offset + 1, lastOffset, false);
      lastOffset = offset + 1;
    }
  }

  return writer.flush();
}
