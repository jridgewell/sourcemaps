import { TraceMap, presortedDecodedMap, decodedMappings } from './trace-mapping';
import {
  COLUMN,
  SOURCES_INDEX,
  SOURCE_LINE,
  SOURCE_COLUMN,
  NAMES_INDEX,
} from './sourcemap-segment';
import { assertExhaustive, parse, EMPTY } from './util';

import type {
  DecodedSourceMap,
  DecodedSourceMapXInput,
  EncodedSourceMapXInput,
  SectionedSourceMapXInput,
  SectionedSourceMapInput,
  SectionXInput,
  Ro,
} from './types';
import type { SourceMapSegment } from './sourcemap-segment';

// A utility type that allows FlattenMap to be called or new'd.
type FlattenMap = {
  new (map: Ro<SectionedSourceMapInput>, mapUrl?: string | null): TraceMap;
  (map: Ro<SectionedSourceMapInput>, mapUrl?: string | null): TraceMap;
};

/**
 * FlattenMap recursively flattens a SectionedSourceMap into a DecodedSourceMap.
 */
export const FlattenMap: FlattenMap = function (map, mapUrl) {
  const parsed = parse(map as SectionedSourceMapInput);

  if (!('sections' in parsed)) {
    return new TraceMap(parsed as DecodedSourceMapXInput | EncodedSourceMapXInput, mapUrl);
  }

  const mappings: SourceMapSegment[][] = [];
  const sources: string[] = [];
  const sourcesContent: (string | null)[] = [];
  const names: string[] = [];
  const ignoreList: number[] = [];
  const rangeMappings: number[][] = [];

  recurse(
    parsed,
    mapUrl,
    mappings,
    sources,
    sourcesContent,
    names,
    ignoreList,
    rangeMappings,
    0,
    0,
    Infinity,
    Infinity,
  );

  const joined = {
    version: 3,
    file: parsed.file,
    names,
    sources,
    sourcesContent,
    mappings,
    ignoreList,
    rangeMappings,
  } satisfies DecodedSourceMap;
  assertExhaustive(
    undefined as Exclude<keyof DecodedSourceMap, keyof typeof joined | 'sourceRoot'>,
  );

  return presortedDecodedMap(joined);
} as FlattenMap;

/**
 * Recursively flattens a SectionedSourceMap into a DecodedSourceMap.
 */
function recurse(
  input: SectionedSourceMapXInput,
  mapUrl: string | null | undefined,
  mappings: SourceMapSegment[][],
  sources: string[],
  sourcesContent: (string | null)[],
  names: string[],
  ignoreList: number[],
  rangeMappings: number[][],
  lineOffset: number,
  columnOffset: number,
  stopLine: number,
  stopColumn: number,
) {
  const { sections } = input;
  for (let i = 0; i < sections.length; i++) {
    const { map, offset } = sections[i];

    // For each section, we need to adjust the stopLine and stopColumn to be the
    // line/column of the next section. The final section just uses the recursive
    // stopLine and stopColumn.
    let sl = stopLine;
    let sc = stopColumn;
    if (i + 1 < sections.length) {
      const nextOffset = sections[i + 1].offset;
      sl = Math.min(stopLine, lineOffset + nextOffset.line);
      sc = columnOffset + nextOffset.column;

      // If the next section starts on the same line as the recursive stopLine, then we need to
      // constrain the next stopColumn to be within the recusrive stopColumn.
      if (sl === stopLine) sc = Math.min(stopColumn, sc);
    }

    addSection(
      map,
      mapUrl,
      mappings,
      sources,
      sourcesContent,
      names,
      ignoreList,
      rangeMappings,
      lineOffset + offset.line,
      columnOffset + offset.column,
      sl,
      sc,
    );
  }
}

/**
 * Merges this section's data into the flattened map.
 */
function addSection(
  input: SectionXInput['map'],
  mapUrl: string | null | undefined,
  mappings: SourceMapSegment[][],
  sources: string[],
  sourcesContent: (string | null)[],
  names: string[],
  ignoreList: number[],
  rangeMappings: number[][],
  lineOffset: number,
  columnOffset: number,
  stopLine: number,
  stopColumn: number,
) {
  const parsed = parse(input);
  if ('sections' in parsed) return recurse(...(arguments as unknown as Parameters<typeof recurse>));

  const map = new TraceMap(parsed, mapUrl);
  const sourcesOffset = sources.length;
  const namesOffset = names.length;
  const decoded = decodedMappings(map);
  const {
    resolvedSources,
    sourcesContent: contents,
    ignoreList: ignores,
    rangeMappings: ranges,
  } = map;

  append(sources, resolvedSources);
  append(names, map.names);

  if (contents) append(sourcesContent, contents);
  else for (let i = 0; i < resolvedSources.length; i++) sourcesContent.push(null);

  if (ignores) for (let i = 0; i < ignores.length; i++) ignoreList.push(ignores[i] + sourcesOffset);

  for (let i = 0; i < decoded.length; i++) {
    const lineI = lineOffset + i;

    // We can only add so many lines before we step into the range that the next section's map
    // controls. When we get to the last line, then we'll start checking the segments to see if
    // they've crossed into the column range. But it may not have any columns that overstep, so we
    // still need to check that we don't overstep lines, too.
    if (lineI > stopLine) return;

    // The out line may already exist in mappings (if we're continuing the line started by a
    // previous section). Or, we may have jumped ahead several lines to start this section.
    const out = getLine(mappings, lineI);

    let rangeIn = EMPTY;
    let rangeOut = EMPTY;
    let rIndex = 0;
    if (ranges && i < ranges.length) {
      rangeIn = ranges[i];
      rangeOut = getLine(rangeMappings, lineI);
    }

    // On the 0th loop, the section's column offset shifts us forward. On all other lines (since the
    // map can be multiple lines), it doesn't.
    const cOffset = i === 0 ? columnOffset : 0;

    const line = decoded[i];
    for (let j = 0; j < line.length; j++) {
      const seg = line[j];
      const column = cOffset + seg[COLUMN];

      // If this segment steps into the column range that the next section's map controls, we need
      // to stop early.
      if (lineI === stopLine && column >= stopColumn) return;

      // If the current segment is a range mapping, then we need to record the
      // flattened index as one too.
      if (rIndex < rangeIn.length && j === rangeIn[rIndex]) {
        rIndex++;
        rangeOut.push(out.length);
      }

      if (seg.length === 1) {
        out.push([column]);
        continue;
      }

      const sourcesIndex = sourcesOffset + seg[SOURCES_INDEX];
      const sourceLine = seg[SOURCE_LINE];
      const sourceColumn = seg[SOURCE_COLUMN];
      out.push(
        // The ternary allows us to create arrays with the exact size, which is
        // required for later checking if the tuple carries name information.
        seg.length === 4
          ? [column, sourcesIndex, sourceLine, sourceColumn]
          : [column, sourcesIndex, sourceLine, sourceColumn, namesOffset + seg[NAMES_INDEX]],
      );
    }
  }
}

function append<T>(arr: T[], other: T[]) {
  for (let i = 0; i < other.length; i++) arr.push(other[i]);
}

function getLine<T>(arr: T[][], index: number): T[] {
  for (let i = arr.length; i <= index; i++) arr[i] = [];
  return arr[index];
}
