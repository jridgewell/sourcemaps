import { SetArray, put } from '@jridgewell/set-array';
import { encode } from '@jridgewell/sourcemap-codec';
import { TraceMap, decodedMappings } from '@jridgewell/trace-mapping';

import type { SourceMapInput } from '@jridgewell/trace-mapping';
import type { SourceMapSegment } from './sourcemap-segment';
import type { DecodedSourceMap, EncodedSourceMap, Pos, Mapping } from './types';

export type { DecodedSourceMap, EncodedSourceMap, Mapping };

export type Options = {
  file?: string | null;
  sourceRoot?: string | null;
};

/**
 * A low-level API to associate a generated position with an original source position. Line and
 * column here are 0-based, unlike `addMapping`.
 */
export let addSegment: {
  (
    map: GenMapping,
    genLine: number,
    genColumn: number,
    source?: null,
    sourceLine?: null,
    sourceColumn?: null,
    name?: null,
  ): void;
  (
    map: GenMapping,
    genLine: number,
    genColumn: number,
    source: string,
    sourceLine: number,
    sourceColumn: number,
    name?: null,
  ): void;
  (
    map: GenMapping,
    genLine: number,
    genColumn: number,
    source: string,
    sourceLine: number,
    sourceColumn: number,
    name: string,
  ): void;
};

/**
 * A high-level API to associate a generated position with an original source position. Line is
 * 1-based, but column is 0-based, due to legacy behavior in `source-map` library.
 */
export let addMapping: {
  (
    map: GenMapping,
    mapping: {
      generated: Pos;
      source?: null;
      original?: null;
      name?: null;
    },
  ): void;
  (
    map: GenMapping,
    mapping: {
      generated: Pos;
      source: string;
      original: Pos;
      name?: null;
    },
  ): void;
  (
    map: GenMapping,
    mapping: {
      generated: Pos;
      source: string;
      original: Pos;
      name: string;
    },
  ): void;
};

/**
 * Adds/removes the content of the source file to the source map.
 */
export let setSourceContent: (map: GenMapping, source: string, content: string | null) => void;

/**
 * Returns a sourcemap object (with decoded mappings) suitable for passing to a library that expects
 * a sourcemap, or to JSON.stringify.
 */
export let toDecodedMap: (map: GenMapping) => DecodedSourceMap;

/**
 * Returns a sourcemap object (with encoded mappings) suitable for passing to a library that expects
 * a sourcemap, or to JSON.stringify.
 */
export let toEncodedMap: (map: GenMapping) => EncodedSourceMap;

/**
 * Constructs a new GenMapping, using the already present mappings of the input.
 */
export let fromMap: (input: SourceMapInput) => GenMapping;

/**
 * Returns an array of high-level mapping objects for every recorded segment, which could then be
 * passed to the `source-map` library.
 */
export let allMappings: (map: GenMapping) => Mapping[];

/**
 * Provides the state to generate a sourcemap.
 */
export class GenMapping {
  private _names = new SetArray();
  private _sources = new SetArray();
  private _sourcesContent: (string | null)[] = [];
  private _mappings: SourceMapSegment[][] = [];
  declare file: string | null | undefined;
  declare sourceRoot: string | null | undefined;

  constructor({ file, sourceRoot }: Options = {}) {
    this.file = file;
    this.sourceRoot = sourceRoot;
  }

  static {
    addSegment = (map, genLine, genColumn, source, sourceLine, sourceColumn, name) => {
      const {
        _mappings: mappings,
        _sources: sources,
        _sourcesContent: sourcesContent,
        _names: names,
      } = map;

      const line = getLine(mappings, genLine);
      if (!source) {
        const seg: SourceMapSegment = [genColumn];
        const index = getColumnIndex(line, genColumn, seg);
        return insert(line, index, seg);
      }

      // Sigh, TypeScript can't figure out sourceLine and sourceColumn aren't nullish if source
      // isn't nullish.
      assert<number>(sourceLine);
      assert<number>(sourceColumn);
      const sourcesIndex = put(sources, source);
      const seg: SourceMapSegment = name
        ? [genColumn, sourcesIndex, sourceLine, sourceColumn, put(names, name)]
        : [genColumn, sourcesIndex, sourceLine, sourceColumn];

      const index = getColumnIndex(line, genColumn, seg);
      if (sourcesIndex === sourcesContent.length) sourcesContent[sourcesIndex] = null;
      insert(line, index, seg);
    };

    addMapping = (map, mapping) => {
      const { generated, source, original, name } = mapping;
      return (addSegment as any)(
        map,
        generated.line - 1,
        generated.column,
        source,
        original == null ? undefined : original.line - 1,
        original?.column,
        name,
      );
    };

    setSourceContent = (map, source, content) => {
      const { _sources: sources, _sourcesContent: sourcesContent } = map;
      sourcesContent[put(sources, source)] = content;
    };

    toDecodedMap = (map) => {
      const {
        file,
        sourceRoot,
        _mappings: mappings,
        _sources: sources,
        _sourcesContent: sourcesContent,
        _names: names,
      } = map;

      return {
        version: 3,
        file,
        names: names.array,
        sourceRoot: sourceRoot || undefined,
        sources: sources.array,
        sourcesContent,
        mappings,
      };
    };

    toEncodedMap = (map) => {
      const decoded = toDecodedMap(map);
      return {
        ...decoded,
        mappings: encode(decoded.mappings as SourceMapSegment[][]),
      };
    };

    allMappings = (map) => {
      const out: Mapping[] = [];
      const { _mappings: mappings, _sources: sources, _names: names } = map;

      for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        for (let j = 0; j < line.length; j++) {
          const seg = line[j];

          const generated = { line: i + 1, column: seg[0] };
          let source: string | undefined = undefined;
          let original: Pos | undefined = undefined;
          let name: string | undefined = undefined;

          if (seg.length !== 1) {
            source = sources.array[seg[1]];
            original = { line: seg[2] + 1, column: seg[3] };

            if (seg.length === 5) name = names.array[seg[4]];
          }

          out.push({ generated, source, original, name } as Mapping);
        }
      }

      return out;
    };

    fromMap = (input) => {
      const map = new TraceMap(input);
      const gen = new GenMapping({ file: map.file, sourceRoot: map.sourceRoot });

      putAll(gen._names, map.names);
      putAll(gen._sources, map.sources as string[]);
      gen._sourcesContent = map.sourcesContent || map.sources.map(() => null);
      gen._mappings = decodedMappings(map) as GenMapping['_mappings'];

      return gen;
    };
  }
}

function assert<T>(_val: unknown): asserts _val is T {
  // noop.
}

function getLine(mappings: SourceMapSegment[][], index: number): SourceMapSegment[] {
  for (let i = mappings.length; i <= index; i++) {
    mappings[i] = [];
  }
  return mappings[index];
}

function getColumnIndex(line: SourceMapSegment[], column: number, seg: SourceMapSegment): number {
  let index = line.length;
  for (let i = index - 1; i >= 0; i--, index--) {
    const current = line[i];
    const col = current[0];
    if (col > column) continue;
    if (col < column) break;

    const cmp = compare(current, seg);
    if (cmp === 0) return index;
    if (cmp < 0) break;
  }
  return index;
}

function compare(a: SourceMapSegment, b: SourceMapSegment): number {
  let cmp = compareNum(a.length, b.length);
  if (cmp !== 0) return cmp;

  // We've already checked genColumn
  if (a.length === 1) return 0;

  cmp = compareNum(a[1], b[1]!);
  if (cmp !== 0) return cmp;
  cmp = compareNum(a[2], b[2]!);
  if (cmp !== 0) return cmp;
  cmp = compareNum(a[3], b[3]!);
  if (cmp !== 0) return cmp;

  if (a.length === 4) return 0;
  return compareNum(a[4], b[4]!);
}

function compareNum(a: number, b: number): number {
  return a - b;
}

function insert<T>(array: T[], index: number, value: T) {
  for (let i = array.length; i > index; i--) {
    array[i] = array[i - 1];
  }
  array[index] = value;
}

function putAll(strarr: SetArray, array: string[]) {
  for (let i = 0; i < array.length; i++) put(strarr, array[i]);
}
