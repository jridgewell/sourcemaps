import resolveUri from '@jridgewell/resolve-uri';

import {
  AnyMap,
  originalPositionFor,
  generatedPositionFor,
  eachMapping,
  encodedMappings,
  sourceContentFor,
} from '@jridgewell/trace-mapping';
import {
  GenMapping,
  maybeAddMapping,
  toDecodedMap,
  toEncodedMap,
  setSourceContent,
  fromMap,
} from '@jridgewell/gen-mapping';

import type {
  TraceMap,
  SourceMapInput,
  SectionedSourceMapInput,
  DecodedSourceMap,
} from '@jridgewell/trace-mapping';
export type { TraceMap, SourceMapInput, SectionedSourceMapInput, DecodedSourceMap };

import type { Mapping, EncodedSourceMap } from '@jridgewell/gen-mapping';
export type { Mapping, EncodedSourceMap };

function resolve(input: string, base: string | undefined): string {
  // The base is always treated as a directory, if it's not empty.
  // https://github.com/mozilla/source-map/blob/8cb3ee57/lib/util.js#L327
  // https://github.com/chromium/chromium/blob/da4adbb3/third_party/blink/renderer/devtools/front_end/sdk/SourceMap.js#L400-L401
  if (base && !base.endsWith('/')) base += '/';

  return resolveUri(input, base);
}

export class SourceMapConsumer {
  private declare _map: TraceMap;
  declare file: TraceMap['file'];
  declare names: TraceMap['names'];
  declare sourceRoot: TraceMap['sourceRoot'];
  declare sources: TraceMap['sources'];
  declare sourcesContent: TraceMap['sourcesContent'];
  declare version: TraceMap['version'];

  constructor(map: ConstructorParameters<typeof AnyMap>[0], mapUrl: Parameters<typeof AnyMap>[1]) {
    const trace = (this._map = new AnyMap(map, mapUrl));

    this.file = trace.file;
    this.names = trace.names;
    this.sourceRoot = trace.sourceRoot;
    this.sources = trace.resolvedSources;
    this.sourcesContent = trace.sourcesContent;
    this.version = trace.version;
  }

  static fromSourceMap(map: SourceMapGenerator, mapUrl: Parameters<typeof AnyMap>[1]) {
    // This is more performant if we receive
    // a @jridgewell/source-map SourceMapGenerator
    if (map.toDecodedMap) {
      return new SourceMapConsumer(map.toDecodedMap() as SectionedSourceMapInput, mapUrl);
    }

    // This is a fallback for `source-map` and `source-map-js`
    return new SourceMapConsumer(map.toJSON() as SectionedSourceMapInput, mapUrl);
  }

  get mappings(): string {
    // TODO :: should this be cached ?
    return encodedMappings(this._map);
  }

  originalPositionFor(
    needle: Parameters<typeof originalPositionFor>[1],
  ): ReturnType<typeof originalPositionFor> {
    return originalPositionFor(this._map, needle);
  }

  generatedPositionFor(
    originalPosition: Parameters<typeof generatedPositionFor>[1],
  ): ReturnType<typeof generatedPositionFor> {
    return generatedPositionFor(this._map, originalPosition);
  }

  allGeneratedPositionsFor(
    originalPosition: Parameters<typeof generatedPositionFor>[1],
  ): ReturnType<typeof generatedPositionFor>[] {
    // This doesn't map exactly to the same feature
    return [generatedPositionFor(this._map, originalPosition)];
  }

  hasContentsOfAllSources(): boolean {
    if (!this.sourcesContent) {
      return false;
    }
    return (
      this.sourcesContent.length >= this.sources.length &&
      !this.sourcesContent.some(function (sc) {
        return sc == null;
      })
    );
  }

  sourceContentFor(aSource: string, nullOnMissing?: boolean): string | null {
    if (!this.sourcesContent) {
      return null;
    }

    const sourceContent = sourceContentFor(this._map, aSource);
    if (sourceContent != null) {
      return sourceContent;
    }

    const resolvedSource = resolve(aSource, this.sourceRoot);
    if (this.sources.indexOf(resolvedSource) > -1) {
      return this.sourcesContent[this.sources.indexOf(resolvedSource)];
    }

    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + resolvedSource + '" is not in the SourceMap.');
    }
  }

  eachMapping(
    aCallback: Parameters<typeof eachMapping>[1],
    aContext?: any /*, aOrder?: number*/,
  ): void {
    // order is ignored as @jridgewell/trace-map doesn't implement it

    const context = aContext || null;
    const boundCallback = aCallback.bind(context);

    eachMapping(this._map, boundCallback);
  }

  destroy() {
    // noop.
  }
}

export class SourceMapGenerator {
  private declare _map: GenMapping;

  constructor(opts: ConstructorParameters<typeof GenMapping>[0] | GenMapping) {
    // TODO :: should this be duck-typed ?
    this._map = opts instanceof GenMapping ? opts : new GenMapping(opts);
  }

  static fromSourceMap(sourceMapConsumer: SourceMapConsumer) {
    return new SourceMapGenerator(fromMap(sourceMapConsumer));
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

  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  toDecodedMap(): ReturnType<typeof toDecodedMap> {
    return toDecodedMap(this._map);
  }
}
