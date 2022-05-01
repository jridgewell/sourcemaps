import { AnyMap, originalPositionFor } from '@jridgewell/trace-mapping';
import {
  GenMapping,
  maybeAddMapping,
  toDecodedMap,
  toEncodedMap,
  setSourceContent,
} from '@jridgewell/gen-mapping';

import type { TraceMap, SectionedSourceMapInput } from '@jridgewell/trace-mapping';
export type { TraceMap, SectionedSourceMapInput };

import type { Mapping, EncodedSourceMap, DecodedSourceMap } from '@jridgewell/gen-mapping';
export type { Mapping, EncodedSourceMap, DecodedSourceMap };

export class SourceMapConsumer {
  private declare _map: TraceMap;
  declare file: TraceMap['file'];
  declare names: TraceMap['names'];
  declare sourceRoot: TraceMap['sourceRoot'];
  declare sources: TraceMap['sources'];
  declare sourcesContent: TraceMap['sourcesContent'];

  constructor(map: ConstructorParameters<typeof AnyMap>[0], mapUrl: Parameters<typeof AnyMap>[1]) {
    const trace = (this._map = new AnyMap(map, mapUrl));

    this.file = trace.file;
    this.names = trace.names;
    this.sourceRoot = trace.sourceRoot;
    this.sources = trace.resolvedSources;
    this.sourcesContent = trace.sourcesContent;
  }

  originalPositionFor(
    needle: Parameters<typeof originalPositionFor>[1],
  ): ReturnType<typeof originalPositionFor> {
    return originalPositionFor(this._map, needle);
  }

  destroy() {
    // noop.
  }
}

export class SourceMapGenerator {
  private declare _map: GenMapping;

  constructor(opts: ConstructorParameters<typeof GenMapping>[0]) {
    this._map = new GenMapping(opts);
  }

  addMapping(mapping: Parameters<typeof maybeAddMapping>[1]): ReturnType<typeof maybeAddMapping> {
    maybeAddMapping(this._map, mapping);
  }

  setSourceContent(
    source: Parameters<typeof setSourceContent>[1],
    content: Parameters<typeof setSourceContent>[2],
  ): ReturnType<typeof setSourceContent> {
    setSourceContent(this._map, source, content);
  }

  toJSON(): ReturnType<typeof toEncodedMap> {
    return toEncodedMap(this._map);
  }

  toDecodedMap(): ReturnType<typeof toDecodedMap> {
    return toDecodedMap(this._map);
  }
}
