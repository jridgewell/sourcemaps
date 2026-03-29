import { COLUMN, SOURCES_INDEX, SOURCE_LINE, SOURCE_COLUMN } from './sourcemap-segment';
import { sortComparator } from './sort';

import type { ReverseSegment, SourceMapSegment } from './sourcemap-segment';

export type Source = {
  lines: ReverseSegment[][];
  rangeSegments: Set<ReverseSegment>;
};

/**
 * Rebuilds the original source files, with mappings that are ordered by source
 * line/column instead of generated line/column.
 */
export default function buildBySources(
  decoded: readonly SourceMapSegment[][],
  memos: unknown[],
  rangeSegments: Map<SourceMapSegment, any>,
): Source[] {
  const sources: Source[] = memos.map(() => ({ lines: [], rangeSegments: new Set() }));

  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    for (let j = 0; j < line.length; j++) {
      const seg = line[j];
      if (seg.length === 1) continue;

      const sourceIndex = seg[SOURCES_INDEX];
      const sourceLine = seg[SOURCE_LINE];
      const sourceColumn = seg[SOURCE_COLUMN];

      const source = sources[sourceIndex];
      const revs = getLine(source.lines, sourceLine);

      let rev: ReverseSegment;
      if (rangeSegments.has(seg)) {
        // If it's a range segment, we need to know where the range ends in
        // generated code. This prevents generatedPositionFor returning offsets
        // that cross over the next segment.
        const nextSegLine = nextSegmentLine(decoded, i, j + 1);
        if (nextSegLine === -1) {
          rev = [sourceColumn, 0, i, seg[COLUMN], Infinity, Infinity];
        } else {
          const index = nextSegLine === i ? j + 1 : 0;
          const nextSeg = decoded[nextSegLine][index];
          rev = [sourceColumn, 0, i, seg[COLUMN], nextSegLine, nextSeg[COLUMN]];
        }
        source.rangeSegments.add(rev);
      } else {
        rev = [sourceColumn, 0, i, seg[COLUMN]];
      }
      revs.push(rev);
    }
  }

  for (let i = 0; i < sources.length; i++) {
    const { lines } = sources[i];
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      if (line != null) line.sort(sortComparator);
    }
  }

  return sources;
}

function nextSegmentLine(decoded: readonly SourceMapSegment[][], line: number, index: number) {
  for (let i = line; i < decoded.length; i++) {
    if (index < decoded[i].length) return i;
    index = 0;
  }
  return -1;
}

function getLine<T>(arr: T[][], index: number): T[] {
  for (let i = arr.length; i <= index; i++) {
    arr[i] = [];
  }
  return arr[index];
}
