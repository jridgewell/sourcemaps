import { GenMapping, maybeAddSegment, setIgnore, setSourceContent } from '@jridgewell/gen-mapping';
import { traceSegment, decodedMappings } from '@jridgewell/trace-mapping';

import type { TraceMap } from '@jridgewell/trace-mapping';

export type OriginalSource = {
  map: null;
  sources: Sources[];
  source: string;
  content: string | null;
  ignore: boolean;
};

export type MapSource = {
  map: TraceMap;
  sources: Sources[];
  source: string;
  content: null;
  ignore: false;
};

export type Sources = OriginalSource | MapSource;

const EMPTY_SOURCES: Sources[] = [];

function Source(
  map: TraceMap,
  sources: Sources[],
  source: '',
  content: null,
  ignore: false,
): MapSource;
function Source(
  map: null,
  sources: Sources[],
  source: string,
  content: string | null,
  ignore: boolean,
): OriginalSource;
function Source(
  map: TraceMap | null,
  sources: Sources[],
  source: string | '',
  content: string | null,
  ignore: boolean,
): Sources {
  return {
    map,
    sources,
    source,
    content,
    ignore,
  } as any;
}

/**
 * MapSource represents a single sourcemap, with the ability to trace mappings into its child nodes
 * (which may themselves be SourceMapTrees).
 */
export function MapSource(map: TraceMap, sources: Sources[]): MapSource {
  return Source(map, sources, '', null, false);
}

/**
 * A "leaf" node in the sourcemap tree, representing an original, unmodified source file. Recursive
 * segment tracing ends at the `OriginalSource`.
 */
export function OriginalSource(
  source: string,
  content: string | null,
  ignore: boolean,
): OriginalSource {
  return Source(null, EMPTY_SOURCES, source, content, ignore);
}

/**
 * traceMappings is only called on the root level SourceMapTree, and begins the process of
 * resolving each mapping in terms of the original source files.
 */
export function traceMappings(tree: MapSource): GenMapping {
  // TODO: Eventually support sourceRoot, which has to be removed because the sources are already
  // fully resolved. We'll need to make sources relative to the sourceRoot before adding them.
  const gen = new GenMapping({ file: tree.map.file });
  const { sources: rootSources, map } = tree;
  const rootNames = map.names;
  const rootMappings = decodedMappings(map);

  for (let i = 0; i < rootMappings.length; i++) {
    const segments = rootMappings[i];

    for (let j = 0; j < segments.length; j++) {
      const segment = segments[j];
      const genCol = segment[0];

      // 1-length segments only move the current generated column, there's no source information
      // to gather from it.
      if (segment.length === 1) {
        maybeAddSegment(gen, i, genCol);
        continue;
      }

      const source = rootSources[segment[1]];
      originalPositionFor(
        gen,
        i,
        genCol,
        source,
        segment[2],
        segment[3],
        segment.length === 5 ? rootNames[segment[4]] : '',
      );
    }
  }

  return gen;
}

/**
 * originalPositionFor is only called on children SourceMapTrees. It recurses down into its own
 * child SourceMapTrees, until we find the original source map.
 */
export function originalPositionFor(
  gen: GenMapping,
  genLine: number,
  genCol: number,
  source: Sources,
  line: number,
  column: number,
  name: string,
): void {
  if (!source.map) {
    maybeAddSegment(gen, genLine, genCol, source.source, line, column, name);
    if (source.content != null) setSourceContent(gen, source.source, source.content);
    if (source.ignore) setIgnore(gen, source.source, true);
    return;
  }

  const segment = traceSegment(source.map, line, column);

  // If we couldn't find a segment, then this doesn't exist in the sourcemap.
  if (segment == null) return;
  // 1-length segments only move the current generated column, there's no source information
  // to gather from it.
  if (segment.length === 1) {
    maybeAddSegment(gen, genLine, genCol);
    return;
  }

  originalPositionFor(
    gen,
    genLine,
    genCol,
    source.sources[segment[1]],
    segment[2],
    segment[3],
    segment.length === 5 ? source.map.names[segment[4]] : name,
  );
}
