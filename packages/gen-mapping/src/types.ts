import type { MappingIndex } from './range-mappings';
import type { SourceMapSegment } from './sourcemap-segment';

/**
 * The base interface for a Sourcemap
 */
export interface SourceMapV3 {
  /**
   * An optional relative path to the generated file this sourcemap represents.
   *
   * This field does not respect the `sourceRoot` field.
   */
  file?: string | null;

  /**
   * An array of arbitrary strings used within the source file.
   */
  names: readonly string[];

  /**
   * An optional prefix which is prepended to all sources.
   */
  sourceRoot?: string;

  /**
   * An array of paths/URIs to the original sources.
   */
  sources: readonly (string | null)[];

  /**
   * An optional array of the contents of the original sources.
   */
  sourcesContent?: readonly (string | null)[];

  /**
   * The version of the sourcemap format.
   */
  version: 3;

  /**
   * An optional array of indices of sources that should be ignored.
   */
  ignoreList?: readonly number[];

  /**
   * An optional array of mapping indicies which cover a range of generated
   * code and source code.
   */
  rangeMappings?: MappingIndex[][];
}

/**
 * A sourcemap with string encoded mappings.
 */
export interface EncodedSourceMap extends SourceMapV3 {
  /**
   * The mappings for the sourcemap, encoded as a VLQ string.
   */
  mappings: string;
}

/**
 * A sourcemap with decoded mappings, useful to avoid the encoding/decoding
 * overhead during transforms.
 */
export interface DecodedSourceMap extends SourceMapV3 {
  /**
   * The mappings for the sourcemap, decoded into our internal format.
   */
  mappings: readonly SourceMapSegment[][];
}

/**
 * A position in a sourcemap.
 */
export interface Pos {
  line: number; // 1-based
  column: number; // 0-based
}

/**
 * An original position in a sourcemap.
 */
export interface OriginalPos extends Pos {
  source: string;
}

/**
 * A mapping in a sourcemap.
 */
export type Mapping =
  | {
      generated: Pos;
      source: undefined;
      original: undefined;
      name: undefined;
    }
  | {
      generated: Pos;
      source: string;
      original: Pos;
      name: string;
    }
  | {
      generated: Pos;
      source: string;
      original: Pos;
      name: undefined;
    };
