import { GenMapping, maybeAddSegment, setIgnore, setSourceContent } from '@jridgewell/gen-mapping';
import { traceSegment, decodedMappings, traceRange } from '@jridgewell/trace-mapping';

import type { TraceMap, SourceMapSegment, RangeBounds } from '@jridgewell/trace-mapping';

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
  const { map } = tree;
  // TODO: Eventually support sourceRoot, which has to be removed because the sources are already
  // fully resolved. We'll need to make sources relative to the sourceRoot before adding them.
  const gen = new GenMapping({ file: map.file });
  const rootMappings = decodedMappings(map);

  for (let i = 0; i < rootMappings.length; i++) {
    const segments = rootMappings[i];

    for (let j = 0; j < segments.length; j++) {
      const segment = segments[j];
      const genCol = segment[0];
      const range = traceRange(map, segment, i, genCol);
      originalPositionForSegment(gen, i, genCol, tree, '', segment, range, range == null);
    }
  }

  return gen;
}

function originalPositionForSegment(
  gen: GenMapping,
  genLine: number,
  genCol: number,
  source: MapSource,
  parentName: string,
  segment: Readonly<SourceMapSegment> | null,
  range: RangeBounds | null,
  isPoint: boolean,
): void {
  // 1-length segments only move the current generated column, there's no source information
  // to gather from it.
  if (segment == null || segment.length === 1) {
    maybeAddSegment(gen, genLine, genCol);
    return;
  }

  const childSource = source.sources[segment[1]];
  const childLine = segment[2];
  const childCol = segment[3];
  const childName = segment.length === 5 ? source.map.names[segment[4]] : parentName;

  return originalPositionFor(
    gen,
    genLine,
    genCol,
    childSource,
    childLine,
    childCol,
    childName,
    range,
    isPoint,
  );
}

export function originalPositionFor(
  gen: GenMapping,
  genLine: number,
  genCol: number,
  source: Sources,
  line: number,
  column: number,
  name: string,
  range: RangeBounds | null,
  isPoint: boolean,
): void {
  const { map } = source;
  if (!map) {
    if (range) {
      line += range[0];
      column += range[1];
    }
    maybeAddSegment(gen, genLine, genCol, source.source, line, column, name);
    if (source.content != null) setSourceContent(gen, source.source, source.content);
    if (source.ignore) setIgnore(gen, source.source, true);
    return;
  }

  const segment = traceSegment(map, line, column);
  const childRange = segment && traceRange(map, segment, line, column);
  return originalPositionForSegment(
    gen,
    genLine,
    genCol,
    source,
    name,
    segment,
    childRange,
    isPoint || childRange == null,
  );
}
