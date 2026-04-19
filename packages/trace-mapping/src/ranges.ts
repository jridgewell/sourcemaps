import type { ReverseSegment, SourceMapSegment } from './sourcemap-segment';

type StartLine = number;
type StartColumn = number;
type EndLine = number;
type EndColumn = number;

export type RangeBounds = [StartLine, StartColumn, EndLine, EndColumn];

/**
 * Looks backwards to find the previous line that has a segment at or before
 * index.
 */
export function previousSegmentLine<T extends SourceMapSegment | ReverseSegment>(
  lines: readonly T[][],
  line: number,
  index: number,
): number {
  if (index === -1) {
    while (--line >= 0) {
      const segments = lines[line];
      if (segments && segments.length > 0) break;
    }
  }
  return line;
}

/**
 * Looks forward to find the next line that has a segment at or after index.
 */
export function nextSegmentLine<T extends SourceMapSegment | ReverseSegment>(
  lines: readonly T[][],
  line: number,
  index: number,
): number {
  for (let i = line; i < lines.length; i++) {
    if (index < lines[i].length) return i;
    index = 0;
  }
  return -1;
}
