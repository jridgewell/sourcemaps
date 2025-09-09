import { COLUMN, SOURCES_INDEX, SOURCE_LINE, SOURCE_COLUMN } from './sourcemap-segment';
import { memoizedBinarySearch, upperBound } from './binary-search';

import type { ReverseSegment, SourceMapSegment } from './sourcemap-segment';
import type { MemoState } from './binary-search';

export type Source = {
  __proto__: null;
  [line: number]: Exclude<ReverseSegment, [number]>[];
};

// Rebuilds the original source files, with mappings that are ordered by source line/column instead
// of generated line/column.
export default function buildBySources(
  decoded: readonly SourceMapSegment[][],
  memos: MemoState[],
): Source[] {
  const sources: Source[] = memos.map(buildNullArray);
  const todo: ReverseSegment[][][] = [];

  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    for (let j = 0; j < line.length; j++) {
      const seg = line[j];
      if (seg.length === 1) continue;

      const sourceIndex = seg[SOURCES_INDEX];
      const sourceLine = seg[SOURCE_LINE];
      const sourceColumn = seg[SOURCE_COLUMN];

      todo[sourceIndex] ||= [];
      (todo[sourceIndex][sourceLine] ||= []).push([sourceColumn, i, seg[COLUMN]]);
    }
  }

  for (let sourceIndex = 0; sourceIndex < todo.length; sourceIndex++) {
    const lines = todo[sourceIndex];
    if (!lines) continue;
    const originalSource = sources[sourceIndex];
    const memo = memos[sourceIndex];

    for (let sourceLine = 0; sourceLine < lines.length; sourceLine++) {
      const segs = lines[sourceLine];
      if (!segs) continue;

      segs.sort((a, b) => a[0] - b[0]);
      const originalLine = (originalSource[sourceLine] ||= []);

      let lastIndex = 0;
      const newOriginalLine: ReverseSegment[] = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];

        // The binary search either found a match, or it found the left-index just before where the
        // segment should go. Either way, we want to insert after that. And there may be multiple
        // generated segments associated with an original location, so there may need to move several
        // indexes before we find where we need to insert.
        const originalLineJoint = jointArray(newOriginalLine, originalLine, lastIndex);
        let index = upperBound(
          originalLineJoint,
          seg[0],
          memoizedBinarySearch(originalLineJoint, seg[0], memo, sourceLine),
        );

        memo.lastIndex = ++index;
        if (index <= newOriginalLine.length) {
          insert(newOriginalLine, index, seg);
          continue;
        }

        index = index - newOriginalLine.length + lastIndex;
        while (lastIndex < index) {
          newOriginalLine.push(originalLine[lastIndex++]);
        }

        newOriginalLine.push(seg);
      }

      while (lastIndex < originalLine.length) {
        newOriginalLine.push(originalLine[lastIndex++]);
      }
      originalSource[sourceLine] = newOriginalLine;
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

function jointArray<T>(a: T[], b: T[], bOffset: number): T[] {
  return new Proxy([], {
    get(_, p) {
      if (p === 'length') return a.length + (b.length - bOffset);
      const index = typeof p === 'symbol' ? NaN : parseInt(p, 10);
      if (isNaN(index)) return (a as any)[p];
      return index < a.length ? a[index] : b[index - bOffset];
    },
  });
}

function insert<T>(array: T[], index: number, value: T) {
  for (let i = array.length; i > index; i--) {
    array[i] = array[i - 1];
  }
  array[index] = value;
}
