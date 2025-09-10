import { COLUMN, SOURCES_INDEX, SOURCE_LINE, SOURCE_COLUMN } from './sourcemap-segment';

import type { ReverseSegment, SourceMapSegment } from './sourcemap-segment';

export type Source = {
  __proto__: null;
  length: number;
  [line: number]: Exclude<ReverseSegment, [number]>[];
};

// Rebuilds the original source files, with mappings that are ordered by source line/column instead
// of generated line/column.
export default function buildBySources(
  decoded: readonly SourceMapSegment[][],
  sourcesCount: number,
): Source[] {
  const sources: Source[] = Array.from({ length: sourcesCount }, buildNullArray<Source>);

  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    for (let j = 0; j < line.length; j++) {
      const seg = line[j];
      if (seg.length === 1) continue;

      const sourceIndex = seg[SOURCES_INDEX];
      const sourceLine = seg[SOURCE_LINE];
      const sourceColumn = seg[SOURCE_COLUMN];

      const source = sources[sourceIndex];
      source.length = Math.max(source.length || 0, sourceLine + 1);
      (source[sourceLine] ||= []).push([sourceColumn, i, seg[COLUMN]]);
    }
  }

  for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
    const source = sources[sourceIndex];
    for (let line = 0; line < source.length; line++) {
      source[line]?.sort((a, b) => a[0] - b[0]);
    }
  }

  return sources;
}

// Null arrays allow us to use ordered index keys without actually allocating contiguous memory like
// a real array. We use a null-prototype object to avoid prototype pollution and deoptimizations.
// Numeric properties on objects are magically sorted in ascending order by the engine regardless of
// the insertion order. So, by setting any numeric keys, even out of order, we'll get ascending
// order when iterating with for-in.
function buildNullArray<T extends { __proto__: null }>(): T {
  return { __proto__: null } as T;
}
