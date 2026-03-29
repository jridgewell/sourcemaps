import {
  GenMapping,
  maybeAddSegment,
  setIgnore,
  setSourceContent,
  setRangeSegment,
} from '@jridgewell/gen-mapping';
import {
  traceSegment,
  traceSegmentsInRange,
  isRange,
  decodedMappings,
  decodedRangeMappings,
} from '@jridgewell/trace-mapping';

import type { TraceMap } from '@jridgewell/trace-mapping';

export type SourceMapSegmentObject = {
  column: number;
  line: number;
  name: string;
  source: string;
  content: string | null;
  ignore: boolean;
  isRangeMapping: boolean;
  rangeMappingOffset: { line: number; column: number };
};

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

const SOURCELESS_MAPPING = /* #__PURE__ */ SegmentObject('', -1, -1, '', null, false);
const EMPTY_SOURCES: Sources[] = [];

function SegmentObject(
  source: string,
  line: number,
  column: number,
  name: string,
  content: string | null,
  ignore: boolean,
  isRangeMapping?: boolean,
  rangeMappingOffset?: { line: number; column: number },
): SourceMapSegmentObject {
  return {
    source,
    line,
    column,
    name,
    content,
    ignore,
    isRangeMapping: isRangeMapping || false,
    rangeMappingOffset: rangeMappingOffset || { line: 0, column: 0 },
  };
}

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
  const rootRangeMappings = decodedRangeMappings(map) || [];

  // Find the next segment either in the current line or in
  // the next line if we're at the end and there are further lines.
  function nextSegment(line: number, index: number) {
    let current = index + 1;

    while (line < rootMappings.length) {
      if (current < rootMappings[line].length) {
        return { line, segment: rootMappings[line][current] };
      } else {
        line++;
        current = 0;
      }
    }

    return null;
  }

  for (let i = 0; i < rootMappings.length; i++) {
    const segments = rootMappings[i];
    const rangeMappings = rootRangeMappings[i] || [];

    for (let j = 0; j < segments.length; j++) {
      const segment = segments[j];
      const isRangeMapping = rangeMappings.includes(j);
      const genCol = segment[0];

      if (segment.length === 1 || !isRangeMapping) {
        let tracedSegment: SourceMapSegmentObject | null = SOURCELESS_MAPPING;

        // 1-length segments only move the current generated column, there's no source information
        // to gather from it.
        if (segment.length !== 1) {
          const source = rootSources[segment[1]];

          tracedSegment = originalPositionFor(
            source,
            segment[2],
            segment[3],
            segment.length === 5 ? rootNames[segment[4]] : '',
          );

          // If the trace is invalid, then the trace ran into a sourcemap that doesn't contain a
          // respective segment into an original source.
          if (tracedSegment === null) continue;
        }

        const { column, line, name, content, source, ignore } = tracedSegment!;

        maybeAddSegment(gen, i, genCol, source, line, column, name);
        if (source && content != null) setSourceContent(gen, source, content);
        if (ignore) setIgnore(gen, source, true);
      } else {
        // isRangeMapping
        const source = rootSources[segment[1]];

        // Find end segment, if none exists it's an invalid range mapping and
        // we will skip it.
        const next = nextSegment(i, j);
        if (next === null) continue;
        const { line: nextSegmentLine, segment: endSegment } = next;
        const rangeLineOffset = nextSegmentLine - i;
        const rangeColumnOffset = endSegment[0] - segment[0];
        const endLine = segment[2] + rangeLineOffset;
        const endColumn = segment[2] === endLine ? segment[3] + rangeColumnOffset : endSegment[0];

        const tracedSegments = originalPositionsForRange(
          source,
          segment[2],
          segment[3],
          segment.length === 5 ? rootNames[segment[4]] : '',
          endLine,
          endColumn,
          false,
        );

        if (tracedSegments.length === 0) continue;

        for (const tracedSegment of tracedSegments) {
          const {
            column,
            line,
            name,
            content,
            source,
            ignore,
            isRangeMapping,
            rangeMappingOffset,
          } = tracedSegment;

          // The range mapping offset is the amount that we need to offset the
          // generated line/column from the root. We have to return this up
          // because originalPositionsForRange can't increment it.
          const genLine = i + rangeMappingOffset.line;
          // If the traced segment isn't on the same line as the range start,
          // genCol is irrelevant
          const genColumn =
            rangeMappingOffset.line === 0
              ? genCol + rangeMappingOffset.column
              : rangeMappingOffset.column;
          maybeAddSegment(gen, genLine, genColumn, source, line, column, name, null);
          if (isRangeMapping)
            setRangeSegment(gen, genLine, genColumn);
          if (source && content != null) setSourceContent(gen, source, content);
          if (ignore) setIgnore(gen, source, true);
        }
      }
    }
  }

  return gen;
}

/**
 * originalPositionFor is only called on children SourceMapTrees. It recurses down into its own
 * child SourceMapTrees, until we find the original source map.
 */
export function originalPositionFor(
  source: Sources,
  line: number,
  column: number,
  name: string,
): SourceMapSegmentObject | null {
  if (!source.map) {
    return SegmentObject(source.source, line, column, name, source.content, source.ignore);
  }

  const segment = traceSegment(source.map, line, column);

  // If we couldn't find a segment, then this doesn't exist in the sourcemap.
  if (segment == null) return null;
  const maybeRange = isRange(source.map, segment);
  let startLine = line;
  if (maybeRange) {
    startLine = maybeRange.line;
  }

  // 1-length segments only move the current generated column, there's no source information
  // to gather from it.
  if (segment.length === 1) return SOURCELESS_MAPPING;

  // If the child is a range mapping, we need to offset the next lookup point by the
  // offset of the parent mapping into the range.
  let rangeMappingOffset = { line: 0, column: 0 };
  if (maybeRange) {
    if (startLine === line) rangeMappingOffset = { line: 0, column: column - segment[0] };
    else rangeMappingOffset = { line: line - startLine, column: 0 };
  }

  return originalPositionFor(
    source.sources[segment[1]],
    segment[2] + rangeMappingOffset.line,
    segment[3] + rangeMappingOffset.column,
    segment.length === 5 ? source.map.names[segment[4]] : name,
  );
}

function originalPositionsForRange(
  source: Sources,
  line: number,
  column: number,
  name: string,
  endLine: number,
  endColumn: number,
  emitEndPoint: boolean,
): SourceMapSegmentObject[] {
  // If this is the bottom node then we just return the current range.
  if (source.map === null) {
    return [
      SegmentObject(source.source, line, column, '', source.content, source.ignore, true),
      // The end point isn't always emitted, because the end point may be
      // a separate mapping that will be processed & translated too. We only emit this
      // if we need to make up a mapping because we split or clamped a range.
      ...(emitEndPoint
        ? [
            SegmentObject(
              source.source,
              endLine,
              endColumn,
              '',
              source.content,
              source.ignore,
              false,
              { line: endLine - line, column: endColumn - column },
            ),
          ]
        : []),
    ];
  }

  // We additionally trace the start position of the range to because we may need to
  // intersect with a range that starts before the given position, or map the start
  // of the range to it if there aren't any exact hits.
  const initialSegment = traceSegment(source.map, line, column);
  const segments = traceSegmentsInRange(source.map, line, column, endLine, endColumn);

  // If tracing the start of the range hits a mapping that isn't in the segmenObjects list,
  // add it to the list to process first.
  if (initialSegment !== null && (segments.length === 0 || initialSegment !== segments[0][1])) {
    segments.splice(0, 0, [line, initialSegment]);
  }

  const originalPositions = [];
  for (const [startLine, segment] of segments) {
    if (segment == null) continue;

    let childEndLine, endSegment;
    const maybeRange = isRange(source.map, segment);
    if (maybeRange) {
      childEndLine = maybeRange.endLine;
      endSegment = maybeRange.endSegment;
    }

    // At the very beginning of a range, the child position might be behind
    // the start of the range. In that case we clamp the offset to 0.
    const rangeOffsetLine = startLine - line;
    const rangeOffsetColumn = rangeOffsetLine === 0 ? Math.max(0, segment[0] - column) : segment[0];
    const rangeOffset = { line: rangeOffsetLine, column: rangeOffsetColumn };

    // Sourceless mappings just have the offset added and we skip the recursive
    // step because there's no source to process.
    if (segment.length === 1) {
      const mapping = SOURCELESS_MAPPING;
      mapping.rangeMappingOffset = rangeOffset;
      originalPositions.push(mapping);
      continue;
    }

    if (!maybeRange) {
      const position = originalPositionFor(
        source.sources[segment[1]],
        segment[2],
        segment[3],
        segment.length === 5 ? source.map.names[segment[4]] : name,
      );
      if (position !== null) {
        position.rangeMappingOffset.line += rangeOffset.line;
        position.rangeMappingOffset.column += rangeOffset.column;
        originalPositions.push(position);
      }
    } else {
      // Compute the intersection of the child and parent ranges.
      //
      //                line,column              endLine,endColumn
      //  Parent range    |-----------------------------|
      //  Child range   |------------------------|
      //              startLine,segment[0]   childEndLine,endSegment[0]
      //  Child mapped  |------------------------|
      //              segment[2],segment[3]  endSegment[2],endSegment[3]
      //
      // For example, if segment[0] < column as in this diagram, we
      // need to clamp the start point to column, which maps to
      // segment[3] + (column - segment[0]). The end point needs to
      // be clamped if endSegment[3] > endColumn.
      const clampedStartLine = Math.max(line, startLine);
      const clampedStartColumn = Math.max(column, segment[0]);
      const clampedEndLine = Math.min(endLine, childEndLine!);
      const clampedEndColumn = Math.min(endColumn, endSegment![0]);

      const originalStartLine = segment[2] + (clampedStartLine - startLine);
      let originalStartColumn;
      if (startLine == line) {
        originalStartColumn = segment[3] + (clampedStartColumn - segment[0]);
      } else if (startLine > line) {
        originalStartColumn = segment[3];
      } else {
        originalStartColumn = column;
      }

      const originalEndLine = originalStartLine + (clampedEndLine - clampedStartLine);
      // When the range ends on the same line, the end column is calculated from the
      // segment distance because the range is exclusive of the end segment.
      // If the range ends on a different line, we end on the end segment generated
      // column.
      const originalEndColumn =
        originalStartLine == originalEndLine
          ? originalStartColumn + (clampedEndColumn - clampedStartColumn)
          : clampedEndColumn;

      const positions = originalPositionsForRange(
        source.sources[segment[1]],
        originalStartLine,
        originalStartColumn,
        segment.length === 5 ? source.map.names[segment[4]] : name,
        originalEndLine,
        originalEndColumn,
        // If the range had to be clamped then we need to emit a new mapping
        // for the end, as no existing explicit mapping will exist at that point.
        // Otherwise, we should be able to rely on the original end mapping being
        // translated appropriately.
        clampedEndLine !== childEndLine || clampedEndColumn !== endSegment![0],
      );

      for (const position of positions) {
        position.rangeMappingOffset.line += rangeOffset.line;
        position.rangeMappingOffset.column += rangeOffset.column;
      }
      originalPositions.push(...positions);
    }
  }

  return originalPositions;
}
