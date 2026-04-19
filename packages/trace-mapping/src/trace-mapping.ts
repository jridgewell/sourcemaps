import {
  encode,
  decode,
  encodeRangeMappings,
  decodeRangeMappings,
} from '@jridgewell/sourcemap-codec';

import resolver from './resolve';
import maybeSort from './sort';
import buildBySources from './by-source';
import { previousSegmentLine, nextSegmentLine } from './utils';
import {
  memoizedState,
  memoizedBinarySearchSegments,
  upperBound,
  lowerBound,
  found as bsFound,
} from './binary-search';
import {
  COLUMN,
  SOURCES_INDEX,
  SOURCE_LINE,
  SOURCE_COLUMN,
  NAMES_INDEX,
  REV_GENERATED_LINE,
  REV_GENERATED_COLUMN,
  REV_RANGE_END_LINE,
  REV_RANGE_END_COLUMN,
} from './sourcemap-segment';
import { assertExhaustive, parse } from './util';

import type { SourceMapSegment, ReverseSegment } from './sourcemap-segment';
import type {
  SourceMapV3,
  DecodedSourceMap,
  EncodedSourceMap,
  InvalidOriginalMapping,
  OriginalMapping,
  InvalidGeneratedMapping,
  GeneratedMapping,
  SourceMapInput,
  Needle,
  SourceNeedle,
  SourceMap,
  EachMapping,
  Bias,
  XInput,
  SectionedSourceMap,
  Ro,
} from './types';
import type { Source } from './by-source';
import type { MemoState } from './binary-search';

export type { SourceMapSegment } from './sourcemap-segment';
export type {
  SourceMap,
  DecodedSourceMap,
  EncodedSourceMap,
  Section,
  SectionedSourceMap,
  SourceMapV3,
  Bias,
  EachMapping,
  GeneratedMapping,
  InvalidGeneratedMapping,
  InvalidOriginalMapping,
  Needle,
  OriginalMapping,
  OriginalMapping as Mapping,
  SectionedSourceMapInput,
  SourceMapInput,
  SourceNeedle,
  XInput,
  EncodedSourceMapXInput,
  DecodedSourceMapXInput,
  SectionedSourceMapXInput,
  SectionXInput,
} from './types';

interface PublicMap {
  _encoded: TraceMap['_encoded'];
  _decoded: TraceMap['_decoded'];
  _decodedMemo: TraceMap['_decodedMemo'];
  _bySources: TraceMap['_bySources'];
  _bySourceMemos: TraceMap['_bySourceMemos'];
  _encodedRangeMappings: TraceMap['_encodedRangeMappings'];
  _decodedRangeMappings: TraceMap['_decodedRangeMappings'];
  _rangeSegments: TraceMap['_rangeSegments'];
}

const LINE_GTR_ZERO = '`line` must be greater than 0 (lines start at line 1)';
const COL_GTR_EQ_ZERO = '`column` must be greater than or equal to 0 (columns start at column 0)';

/**
 * During tracing, if no exact match is found, then we return the segment whose
 * generated column is just less than the target column.
 */
export const LEAST_UPPER_BOUND = -1;

/**
 * During tracing, if no exact match is found, then we return the segment whose
 * generated column is just greater than the target column.
 */
export const GREATEST_LOWER_BOUND = 1;

export { FlattenMap, FlattenMap as AnyMap } from './flatten-map';

export class TraceMap implements SourceMap {
  declare version: SourceMapV3['version'];
  declare file: SourceMapV3['file'];
  declare names: SourceMapV3['names'];
  declare sourceRoot: SourceMapV3['sourceRoot'];
  declare sources: SourceMapV3['sources'];
  declare sourcesContent: SourceMapV3['sourcesContent'];
  declare ignoreList: SourceMapV3['ignoreList'];

  /**
   * The fully resolved sources, relative to the mapUrl with sourceRoot
   * prepended.
   */
  declare resolvedSources: string[];

  /**
   * The mappings encoded as VLQ.
   *
   * This is either extracted from the source map on construction (for regular
   * EncodedSourceMaps), or generated from the decoded mappings on demand.
   */
  declare private _encoded: string | undefined;

  /**
   * The mappings decoded into SourceMapSegments.
   *
   * This is either extracted from the source map on construction (for
   * DecodedSourceMaps), or generated from the encoded mappings on demand.
   */
  declare private _decoded: SourceMapSegment[][] | undefined;

  /**
   * Memoization state for the decoded mappings, to perform slightly faster
   * lookups.
   */
  declare private _decodedMemo: MemoState;

  /**
   * The inverse mappings, from source to generated code positions.
   */
  declare private _bySources: Source[] | undefined;

  /**
   * Memoization state for the inverse mappings, to perform slightly faster
   * lookups.
   */
  declare private _bySourceMemos: MemoState[] | undefined;

  /**
   * The range mappings encoded as VLQ.
   */
  declare private _encodedRangeMappings: string | undefined;

  /**
   * The range mappings decoded into indexes per line.
   */
  declare private _decodedRangeMappings: number[][] | undefined;

  /**
   * A map of segments that are range mappings to their generated line.
   */
  declare private _rangeSegments: Map<SourceMapSegment, number> | undefined;

  constructor(map: Ro<SourceMapInput>, mapUrl?: string | null) {
    const isString = typeof map === 'string';
    if (!isString && (map as unknown as { _decodedMemo: any })._decodedMemo) return map as TraceMap;

    const parsed = parse(map as Exclude<SourceMapInput, TraceMap>);

    const { version, file, names, sourceRoot, sources, sourcesContent } = parsed;
    this.version = version;
    this.file = file;
    this.names = names || [];
    this.sourceRoot = sourceRoot;
    this.sources = sources;
    this.sourcesContent = sourcesContent;
    this.ignoreList = parsed.ignoreList || (parsed as XInput).x_google_ignoreList;

    const resolve = resolver(mapUrl, sourceRoot);
    this.resolvedSources = sources.map(resolve);

    const { mappings, rangeMappings } = parsed;
    if (typeof mappings === 'string') {
      this._encoded = mappings;
      this._decoded = undefined;
    } else if (Array.isArray(mappings)) {
      this._encoded = undefined;
      this._decoded = maybeSort(mappings, isString);
    } else if ((parsed as unknown as SectionedSourceMap).sections) {
      throw new Error(`TraceMap passed sectioned source map, please use FlattenMap export instead`);
    } else {
      throw new Error(`invalid source map: ${JSON.stringify(parsed)}`);
    }

    this._decodedMemo = memoizedState();
    this._bySources = undefined;
    this._bySourceMemos = undefined;

    if (typeof rangeMappings === 'string') {
      this._encodedRangeMappings = rangeMappings;
      this._decodedRangeMappings = undefined;
    } else {
      this._encodedRangeMappings = undefined;
      this._decodedRangeMappings = rangeMappings || undefined;
    }
    this._rangeSegments = undefined;
  }
}

/**
 * Typescript doesn't allow friend access to private fields, so this just casts the map into a type
 * with public access modifiers.
 */
function cast(map: unknown): PublicMap {
  return map as any;
}

/**
 * Returns the encoded (VLQ string) form of the SourceMap's mappings field.
 */
export function encodedMappings(map: TraceMap): EncodedSourceMap['mappings'] {
  return (cast(map)._encoded ??= encode(cast(map)._decoded!));
}

/**
 * Returns the encoded (VLQ string) form of the SourceMap's rangeMappings field.
 */
export function encodedRangeMappings(map: TraceMap): EncodedSourceMap['rangeMappings'] {
  let { _encodedRangeMappings: encoded, _decodedRangeMappings: decoded } = cast(map);
  if (encoded != null) return encoded;
  if (decoded == null) return encoded;
  encoded = encodeRangeMappings(decoded);
  return (cast(map)._encodedRangeMappings = encoded);
}

/**
 * Returns the decoded (array of lines of segments) form of the SourceMap's mappings field.
 */
export function decodedMappings(map: TraceMap): Readonly<DecodedSourceMap['mappings']> {
  return (cast(map)._decoded ||= decode(cast(map)._encoded!));
}

/**
 * Returns the decoded (array of lines of indexes) form of the SourceMap's rangeMappings field.
 */
export function decodedRangeMappings(map: TraceMap): DecodedSourceMap['rangeMappings'] {
  let { _encodedRangeMappings: encoded, _decodedRangeMappings: decoded } = cast(map);
  if (decoded != null) return decoded;
  if (encoded == null) return decoded;
  decoded = decodeRangeMappings(encoded);
  return (cast(map)._decodedRangeMappings = decoded);
}

/**
 * A low-level API to find the segment associated with a generated line/column (think, from a
 * stack trace). Line and column here are 0-based, unlike `originalPositionFor`.
 */
export function traceSegment(
  map: TraceMap,
  line: number,
  column: number,
): Readonly<SourceMapSegment> | null {
  const decoded = decodedMappings(map);
  const rangeSegments = initRangeSegments(map, decoded);

  return traceSegmentInternal(
    decoded,
    rangeSegments,
    cast(map)._decodedMemo,
    line,
    column,
    GREATEST_LOWER_BOUND,
  );
}

/**
 * Returns the range bounds (start line/column and end line/column) if the
 * segment is a range segment. Note, this is NOT a SourceMapSegment.
 */
export function traceRange(
  map: TraceMap,
  segment: SourceMapSegment,
  genLine: number,
  genCol: number,
): [number, number, number, number] | null {
  const decoded = decodedMappings(map);
  const rangeSegments = initRangeSegments(map, decoded);

  const rangeLine = rangeSegments.get(segment);
  if (rangeLine === undefined) return null;

  const line = decoded[rangeLine];
  const index = line.indexOf(segment);

  const nextLine = nextSegmentLine(decoded, rangeLine, index + 1);
  if (nextLine === -1) return [genLine, genCol, Infinity, Infinity];

  const nextIndex = nextLine === rangeLine ? index + 1 : 0;
  const nextSeg = decoded[nextLine][nextIndex];
  return [genLine, genCol, nextLine, nextSeg[0]];
}

/**
 * A higher-level API to find the source/line/column associated with a generated line/column
 * (think, from a stack trace). Line is 1-based, but column is 0-based, due to legacy behavior in
 * `source-map` library.
 */
export function originalPositionFor(
  map: TraceMap,
  needle: Needle,
): OriginalMapping | InvalidOriginalMapping {
  let { line, column, bias } = needle;
  if (line <= 0) throw new Error(LINE_GTR_ZERO);
  if (column < 0) throw new Error(COL_GTR_EQ_ZERO);
  line--;

  const decoded = decodedMappings(map);
  const rangeSegments = initRangeSegments(map, decoded);

  let segment = traceSegmentInternal(
    decoded,
    rangeSegments,
    cast(map)._decodedMemo,
    line,
    column,
    bias || GREATEST_LOWER_BOUND,
  );

  if (segment == null) return OMapping(null, null, null, null);
  if (segment.length === 1) return OMapping(null, null, null, null);

  const rangeLine = rangeSegments.get(segment);
  if (rangeLine !== undefined) {
    segment = rangeOffset(segment, rangeLine, line, column);
    if (segment == null) return OMapping(null, null, null, null);
  }

  const { names, resolvedSources } = map;
  return OMapping(
    resolvedSources[segment[SOURCES_INDEX]],
    segment[SOURCE_LINE] + 1,
    segment[SOURCE_COLUMN],
    segment.length === 5 ? names[segment[NAMES_INDEX]] : null,
  );
}

/**
 * Finds the generated line/column position of the provided source/line/column source position.
 */
export function generatedPositionFor(
  map: TraceMap,
  needle: SourceNeedle,
): GeneratedMapping | InvalidGeneratedMapping {
  const { source, line, column, bias } = needle;
  return generatedPosition(map, source, line, column, bias || GREATEST_LOWER_BOUND, false);
}

/**
 * Finds all generated line/column positions of the provided source/line/column source position.
 */
export function allGeneratedPositionsFor(map: TraceMap, needle: SourceNeedle): GeneratedMapping[] {
  const { source, line, column, bias } = needle;
  // SourceMapConsumer uses LEAST_UPPER_BOUND for some reason, so we follow suit.
  return generatedPosition(map, source, line, column, bias || LEAST_UPPER_BOUND, true);
}

/**
 * Iterates each mapping in generated position order.
 */
export function eachMapping(map: TraceMap, cb: (mapping: EachMapping) => void): void {
  const decoded = decodedMappings(map);
  const { names, resolvedSources } = map;

  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    for (let j = 0; j < line.length; j++) {
      const seg = line[j];

      const generatedLine = i + 1;
      const generatedColumn = seg[0];
      let source = null;
      let originalLine = null;
      let originalColumn = null;
      let name = null;
      if (seg.length !== 1) {
        source = resolvedSources[seg[1]];
        originalLine = seg[2] + 1;
        originalColumn = seg[3];
      }
      if (seg.length === 5) name = names[seg[4]];

      cb({
        generatedLine,
        generatedColumn,
        source,
        originalLine,
        originalColumn,
        name,
      } as EachMapping);
    }
  }
}

/**
 * Searches sources and resolvedSources for the provided source file.
 */
function sourceIndex(map: TraceMap, source: string): number {
  const { sources, resolvedSources } = map;
  let index = sources.indexOf(source);
  if (index === -1) index = resolvedSources.indexOf(source);
  return index;
}

/**
 * Retrieves the source content for a particular source, if its found. Returns null if not.
 */
export function sourceContentFor(map: TraceMap, source: string): string | null {
  const { sourcesContent } = map;
  if (sourcesContent == null) return null;
  const index = sourceIndex(map, source);
  return index === -1 ? null : sourcesContent[index];
}

/**
 * Determines if the source is marked to ignore by the source map.
 */
export function isIgnored(map: TraceMap, source: string): boolean {
  const { ignoreList } = map;
  if (ignoreList == null) return false;
  const index = sourceIndex(map, source);
  return index === -1 ? false : ignoreList.includes(index);
}

/**
 * A helper that skips sorting of the input map's mappings array, which can be expensive for larger
 * maps.
 */
export function presortedDecodedMap(map: DecodedSourceMap, mapUrl?: string): TraceMap {
  const tracer = new TraceMap(clone(map, [], map.rangeMappings), mapUrl);
  cast(tracer)._decoded = map.mappings;
  return tracer;
}

/**
 * Returns a sourcemap object (with decoded mappings) suitable for passing to a library that expects
 * a sourcemap, or to JSON.stringify.
 */
export function decodedMap(
  map: TraceMap,
): Omit<DecodedSourceMap, 'mappings'> & { mappings: readonly SourceMapSegment[][] } {
  return clone(map, decodedMappings(map), decodedRangeMappings(map));
}

/**
 * Returns a sourcemap object (with encoded mappings) suitable for passing to a library that expects
 * a sourcemap, or to JSON.stringify.
 */
export function encodedMap(map: TraceMap): EncodedSourceMap {
  return clone(map, encodedMappings(map), encodedRangeMappings(map));
}

/**
 * Clones the public fields of a sourcemap, without copying internal fields if
 * the input is a TraceMap.
 */
function clone<T extends string | readonly SourceMapSegment[][]>(
  map: TraceMap | DecodedSourceMap,
  mappings: T,
  rangeMappings:
    | (T extends string ? EncodedSourceMap['rangeMappings'] : DecodedSourceMap['rangeMappings'])
    | undefined,
): T extends string ? EncodedSourceMap : DecodedSourceMap {
  const clone = {
    version: map.version,
    file: map.file,
    names: map.names,
    sourceRoot: map.sourceRoot,
    sources: map.sources,
    sourcesContent: map.sourcesContent,
    mappings: mappings as any,
    ignoreList: map.ignoreList || (map as XInput).x_google_ignoreList,
    rangeMappings: rangeMappings as any,
  } satisfies DecodedSourceMap | EncodedSourceMap;
  assertExhaustive(undefined as Exclude<keyof DecodedSourceMap, keyof typeof clone>);
  return clone;
}

/**
 * Returns an OriginalMapping object.
 */
function OMapping(source: null, line: null, column: null, name: null): InvalidOriginalMapping;
function OMapping(
  source: string,
  line: number,
  column: number,
  name: string | null,
): OriginalMapping;
function OMapping(
  source: string | null,
  line: number | null,
  column: number | null,
  name: string | null,
): OriginalMapping | InvalidOriginalMapping {
  return { source, line, column, name } as any;
}

/**
 * Returns a GeneratedMapping object.
 */
function GMapping(line: null, column: null): InvalidGeneratedMapping;
function GMapping(line: number, column: number): GeneratedMapping;
function GMapping(
  line: number | null,
  column: number | null,
): GeneratedMapping | InvalidGeneratedMapping {
  return { line, column } as any;
}

/**
 * Returns the segment that contains the given line and column.
 */
function traceSegmentInternal<T extends SourceMapSegment | ReverseSegment>(
  lines: readonly T[][],
  rangeSegments: Map<T, number>,
  memo: MemoState,
  line: number,
  column: number,
  bias: Bias,
): T | null;
function traceSegmentInternal<T extends SourceMapSegment | ReverseSegment>(
  lines: readonly T[][],
  rangeSegments: Map<T, number>,
  memo: MemoState,
  line: number,
  column: number,
  bias: Bias,
): T | null;
function traceSegmentInternal<T extends SourceMapSegment | ReverseSegment>(
  lines: readonly T[][],
  rangeSegments: Map<T, number>,
  memo: MemoState,
  line: number,
  column: number,
  bias: Bias,
): T | null {
  const segments = line < lines.length ? lines[line] : [];
  let index = memoizedBinarySearchSegments(segments, column, memo, line);
  if (bsFound) {
    // TODO: Chrome, Safari, and Firefox all return the upperBound. Make a breaking change.
    index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
    return segments[index];
  }

  // We didn't get an exact match, but can we find a range mapping that covers
  // our position?
  if (rangeSegments.size > 0) {
    const rangeLine = previousSegmentLine(lines, line, index);
    if (rangeLine > -1) {
      const rangeLineSegs = lines[rangeLine];
      const rangeIndex = rangeLine === line ? index : rangeLineSegs.length - 1;
      const rangeSeg = rangeLineSegs[rangeIndex];
      if (rangeSegments.has(rangeSeg)) return rangeSeg;
    }
  }

  if (bias === LEAST_UPPER_BOUND) {
    // If we didn't find it, the binary search ended at the last index checked.
    // That index is lower than the needle, so we need to increment to give the
    // upper bound.
    index++;
    return index === segments.length ? null : segments[index];
  }

  return index === -1 ? null : segments[index];
}

/**
 * Returns the indices of all segments that contain the given line and column.
 */
function sliceGeneratedPositions(
  lines: ReverseSegment[][],
  rangeSegments: Map<ReverseSegment, number>,
  memo: MemoState,
  line: number,
  column: number,
  bias: Bias,
): GeneratedMapping[] {
  const segments = line < lines.length ? lines[line] : [];
  const index = memoizedBinarySearchSegments(segments, column, memo, line);

  if (bsFound) {
    const min = lowerBound(segments, column, index);
    const max = upperBound(segments, column, index);
    return sliceGeneratedPositionsExact(segments, min, max);
  }

  // We didn't get an exact match, but can we find range mappings that covers
  // our position?
  if (rangeSegments.size > 0) {
    const rangeLine = previousSegmentLine(lines, line, index);
    if (rangeLine > -1) {
      const rangeLineSegs = lines[rangeLine];
      const rangeIndex = rangeLine === line ? index : rangeLineSegs.length - 1;
      const col = rangeLineSegs[rangeIndex][COLUMN];
      // We're necessary at the upper bound of the range mappings, becuase the binary search
      // ended without a match. We just need to see if there are range mapping
      // that are exactly at this source column.
      const min = lowerBound(rangeLineSegs, col, rangeIndex);
      const ranges = sliceGeneratedPositionsRanges(
        rangeLineSegs,
        min,
        rangeIndex,
        rangeSegments,
        rangeLine,
        line,
        column,
      );
      // If we didn't find any range mappings, then we need to fall through to the
      // default behaviors.
      if (ranges.length > 0) return ranges;
    }
  }

  if (bias === LEAST_UPPER_BOUND) {
    // If we didn't find it, the binary search ended at the last index checked.
    // That index is lower than the needle, so we need to increment to give the
    // upper bound.
    const min = index + 1;
    if (min === segments.length) return [];
    const col = segments[min][COLUMN];
    const max = upperBound(segments, col, min);
    return sliceGeneratedPositionsExact(segments, min, max);
  }

  if (index === -1) return [];
  const col = segments[index][COLUMN];
  const min = lowerBound(segments, col, index);
  return sliceGeneratedPositionsExact(segments, min, index);
}

/**
 * Maps all segments in the given range to GeneratedMappings.
 */
function sliceGeneratedPositionsExact(segments: ReverseSegment[], min: number, max: number) {
  const result = [];
  for (; min <= max; min++) {
    const segment = segments[min];
    result.push(GMapping(segment[REV_GENERATED_LINE] + 1, segment[REV_GENERATED_COLUMN]));
  }
  return result;
}

/**
 * Maps all range segments in the given range to offset GeneratedMappings.
 */
function sliceGeneratedPositionsRanges(
  segments: ReverseSegment[],
  min: number,
  max: number,
  rangeSegments: Map<ReverseSegment, number>,
  rangeLine: number,
  line: number,
  column: number,
) {
  const result = [];
  for (; min <= max; min++) {
    const segment = segments[min];
    if (!rangeSegments.has(segment)) continue;
    const offset = rangeOffset(segment, rangeLine, line, column);
    if (offset) {
      result.push(GMapping(offset[REV_GENERATED_LINE] + 1, offset[REV_GENERATED_COLUMN]));
    }
  }
  return result;
}

/**
 * Finds the generated line/column position of the provided source/line/column source position.
 */
function generatedPosition(
  map: TraceMap,
  source: string,
  line: number,
  column: number,
  bias: Bias,
  all: false,
): GeneratedMapping | InvalidGeneratedMapping;
function generatedPosition(
  map: TraceMap,
  source: string,
  line: number,
  column: number,
  bias: Bias,
  all: true,
): GeneratedMapping[];
function generatedPosition(
  map: TraceMap,
  source: string,
  line: number,
  column: number,
  bias: Bias,
  all: boolean,
): GeneratedMapping | InvalidGeneratedMapping | GeneratedMapping[] {
  if (line <= 0) throw new Error(LINE_GTR_ZERO);
  if (column < 0) throw new Error(COL_GTR_EQ_ZERO);
  line--;

  const { sources, resolvedSources } = map;
  let sourceIndex = sources.indexOf(source);
  if (sourceIndex === -1) sourceIndex = resolvedSources.indexOf(source);
  if (sourceIndex === -1) return all ? [] : GMapping(null, null);

  const bySourceMemos = (cast(map)._bySourceMemos ||= sources.map(memoizedState));
  let bySources = cast(map)._bySources;
  if (bySources == null) {
    const decoded = decodedMappings(map);
    const rangeSegments = initRangeSegments(map, decoded);
    bySources = buildBySources(decoded, bySourceMemos, rangeSegments);
    cast(map)._bySources = bySources;
  }

  const { lines, rangeSegments } = bySources[sourceIndex];
  const memo = bySourceMemos[sourceIndex];

  if (all) return sliceGeneratedPositions(lines, rangeSegments, memo, line, column, bias);

  let segment = traceSegmentInternal(lines, rangeSegments, memo, line, column, bias);
  if (segment == null) return GMapping(null, null);

  const rangeLine = rangeSegments.get(segment);
  if (rangeLine !== undefined) {
    segment = rangeOffset(segment, rangeLine, line, column);
    if (segment == null) return GMapping(null, null);
  }
  return GMapping(segment[REV_GENERATED_LINE] + 1, segment[REV_GENERATED_COLUMN]);
}

/**
 * Initializes the range segments for the map.
 *
 * This is done on demand, since we cannot run this without first decoding the mappings.
 */
function initRangeSegments(map: TraceMap, decoded: readonly SourceMapSegment[][]) {
  const existing = cast(map)._rangeSegments;
  if (existing != null) return existing;

  const rangeSegs = new Map<SourceMapSegment, number>();
  cast(map)._rangeSegments = rangeSegs;
  const rangeMappings = decodedRangeMappings(map);
  if (rangeMappings == null) return rangeSegs;

  for (let i = 0; i < rangeMappings.length; i++) {
    const line = decoded[i];
    const ranges = rangeMappings[i];
    for (let j = 0; j < ranges.length; j++) {
      const seg = line[ranges[j]];
      rangeSegs.set(seg, i);
    }
  }

  return rangeSegs;
}

/**
 * Calculates the relative offset between the range mapping's gen line/col, and
 * adds those offsets to the source line/col.
 */
function rangeOffset<T extends SourceMapSegment | ReverseSegment>(
  range: T,
  rangeLine: number,
  line: number,
  column: number,
): T | null {
  if (range.length === 1) return [column] as T;

  const lineDelta = line - rangeLine;
  const columnDelta = lineDelta === 0 ? column - range[COLUMN] : column;
  if (range.length === 6) {
    if (line > range[REV_RANGE_END_LINE]) return null;
    if (line === range[REV_RANGE_END_LINE] && column >= range[REV_RANGE_END_COLUMN]) return null;
  }
  if (range.length === 5) {
    return [
      column,
      range[SOURCES_INDEX],
      range[SOURCE_LINE] + lineDelta,
      range[SOURCE_COLUMN] + columnDelta,
      range[NAMES_INDEX],
    ] as T;
  }
  return [
    column,
    range[SOURCES_INDEX],
    range[SOURCE_LINE] + lineDelta,
    range[SOURCE_COLUMN] + columnDelta,
  ] as T;
}
