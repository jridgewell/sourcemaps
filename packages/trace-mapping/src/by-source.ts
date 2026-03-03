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
      const segs = getLine(source.lines, sourceLine);
      const s: ReverseSegment = [sourceColumn, sourceIndex, i, seg[COLUMN]];
      segs.push(s);

      if (rangeSegments.has(seg)) source.rangeSegments.add(s);
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

function getLine<T>(arr: T[][], index: number): T[] {
  for (let i = arr.length; i <= index; i++) {
    arr[i] = [];
  }
  return arr[index];
}
