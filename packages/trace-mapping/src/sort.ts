import { COLUMN } from './sourcemap-segment';

import type { ReverseSegment, SourceMapSegment } from './sourcemap-segment';

/**
 * Sorts the mappings if they are not already sorted. If the mappings are not
 * owned (the array was provided by the dev), then a clone is made.
 */
export default function maybeSort(
  mappings: SourceMapSegment[][],
  owned: boolean,
): SourceMapSegment[][] {
  const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
  if (unsortedIndex === mappings.length) return mappings;

  // If we own the array (meaning we parsed it from JSON), then we're free to directly mutate it. If
  // not, we do not want to modify the consumer's input array.
  if (!owned) mappings = mappings.slice();

  for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1)) {
    mappings[i] = sortSegments(mappings[i], owned);
  }
  return mappings;
}

/**
 * Finds the next line that is not sorted.
 */
function nextUnsortedSegmentLine(mappings: SourceMapSegment[][], start: number): number {
  for (let i = start; i < mappings.length; i++) {
    if (!isSorted(mappings[i])) return i;
  }
  return mappings.length;
}

/**
 * Checks if a line is sorted.
 */
function isSorted(line: SourceMapSegment[]): boolean {
  for (let j = 1; j < line.length; j++) {
    if (line[j][COLUMN] < line[j - 1][COLUMN]) {
      return false;
    }
  }
  return true;
}

/**
 * Sorts a line of segments.
 */
function sortSegments(line: SourceMapSegment[], owned: boolean): SourceMapSegment[] {
  if (!owned) line = line.slice();
  return line.sort(sortComparator);
}

/**
 * Compares two segments for sorting.
 */
export function sortComparator<T extends SourceMapSegment | ReverseSegment>(a: T, b: T): number {
  return a[COLUMN] - b[COLUMN];
}
