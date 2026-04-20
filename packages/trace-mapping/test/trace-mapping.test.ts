/// <reference lib="esnext" />

import assert from 'node:assert/strict';
import { encode, decode, encodeRangeMappings } from '@jridgewell/sourcemap-codec';

import {
  TraceMap,
  encodedMappings,
  decodedMappings,
  traceSegment,
  originalPositionFor,
  generatedPositionFor,
  presortedDecodedMap,
  sourceContentFor,
  eachMapping,
  GREATEST_LOWER_BOUND,
  LEAST_UPPER_BOUND,
  allGeneratedPositionsFor,
  isIgnored,
  traceRange,
  type SourceMapInput,
  type EncodedSourceMap,
  type DecodedSourceMap,
  type EachMapping,
  type SourceMapSegment,
} from '../src/trace-mapping';

describe('TraceMap', () => {
  const decodedMap = {
    version: 3,
    file: 'output.js',
    sources: ['input.js'],
    sourceRoot: 'https://astexplorer.net/',
    names: ['foo', 'bar', 'Error'],
    mappings: [
      [
        [0, 0, 0, 0],
        [9, 0, 0, 9, 0],
        [12, 0, 0, 0],
        [13, 0, 0, 13, 1],
        [16, 0, 0, 0],
        [18, 0, 0, 33],
      ],
      [
        [4, 0, 1, 4],
        [8, 0, 1, 10],
        [12, 0, 1, 14, 2],
        [17, 0, 1, 10],
        [18, 0, 1, 20],
        [32, 0, 1, 10],
        [33, 0, 1, 4],
      ],
      [[0, 0, 2, 1]],
      [],
      [
        [0, 0, 3, 0, 0],
        [3, 0, 3, 3],
      ],
      [[0]],
    ],
    sourcesContent: [
      "function foo(bar: number): never {\n    throw new Error('Intentional.');\n}\nfoo();",
    ],
  } satisfies DecodedSourceMap;
  const encodedMap = {
    ...decodedMap,
    mappings: encode(decodedMap.mappings),
  } satisfies EncodedSourceMap;
  function replaceField(
    map: DecodedSourceMap | EncodedSourceMap | string,
    field: keyof (DecodedSourceMap | EncodedSourceMap),
    value: any,
  ): SourceMapInput {
    if (typeof map !== 'string') {
      return {
        ...map,
        [field]: value,
      };
    }

    map = JSON.parse(map);
    (map as any)[field] = value;
    return JSON.stringify(map);
  }

  function testSuite(map: DecodedSourceMap | EncodedSourceMap | string) {
    return () => {
      describe('map properties', () => {
        it('version', () => {
          const tracer = new TraceMap(map);
          assert.equal(tracer.version, decodedMap.version);
        });

        it('file', () => {
          const tracer = new TraceMap(map);
          assert.equal(tracer.file, decodedMap.file);
        });

        it('sourceRoot', () => {
          const tracer = new TraceMap(map);
          assert.equal(tracer.sourceRoot, decodedMap.sourceRoot);
        });

        it('sources', () => {
          const tracer = new TraceMap(map);
          assert.deepEqual(tracer.sources, decodedMap.sources);
        });

        it('names', () => {
          const tracer = new TraceMap(map);
          assert.deepEqual(tracer.names, decodedMap.names);
        });

        it('encodedMappings', () => {
          const tracer = new TraceMap(map);
          assert.equal(encodedMappings(tracer), encodedMap.mappings);
        });

        it('decodedMappings', () => {
          const tracer = new TraceMap(map);
          assert.deepEqual(decodedMappings(tracer), decodedMap.mappings);
        });

        it('sourcesContent', () => {
          const tracer = new TraceMap(map);
          assert.deepEqual(tracer.sourcesContent, decodedMap.sourcesContent);
        });

        describe('sourceContentFor', () => {
          it('returns null if no sourcesContent', () => {
            const tracer = new TraceMap(replaceField(map, 'sourcesContent', undefined));
            const source = tracer.sources[0]!;
            assert.equal(sourceContentFor(tracer, source), null);
          });

          it('returns null if source not found', () => {
            const tracer = new TraceMap(map);
            assert.equal(sourceContentFor(tracer, 'foobar'), null);
          });

          it('returns sourceContent for source', () => {
            const tracer = new TraceMap(map);
            const source = tracer.sources[0]!;
            assert.equal(sourceContentFor(tracer, source), decodedMap.sourcesContent![0]);
          });

          it('returns sourceContent for resolved source', () => {
            const tracer = new TraceMap(map);
            const source = tracer.resolvedSources[0]!;
            assert.equal(sourceContentFor(tracer, source), decodedMap.sourcesContent![0]);
          });
        });

        it('ignoreList', () => {
          const tracer = new TraceMap(replaceField(map, 'ignoreList', [0]));
          assert.deepEqual(tracer.ignoreList, [0]);
        });

        describe('isIgnored', () => {
          it('returns false if no ignoreList', () => {
            const tracer = new TraceMap(replaceField(map, 'ignoreList', undefined));
            const source = tracer.sources[0]!;
            assert.equal(isIgnored(tracer, source), false);
          });

          it('returns false if source not found', () => {
            const tracer = new TraceMap(replaceField(map, 'ignoreList', [0]));
            assert.equal(isIgnored(tracer, 'foobar'), false);
          });

          it('returns false if not ignored', () => {
            const tracer = new TraceMap(replaceField(map, 'ignoreList', []));
            const source = tracer.sources[0]!;
            assert.equal(isIgnored(tracer, source), false);
          });

          it('returns true if ignored', () => {
            const tracer = new TraceMap(replaceField(map, 'ignoreList', [0]));
            const source = tracer.sources[0]!;
            assert.equal(isIgnored(tracer, source), true);
          });

          it('returns ignored for resolved source', () => {
            const tracer = new TraceMap(replaceField(map, 'ignoreList', [0]));
            const source = tracer.resolvedSources[0]!;
            assert.equal(isIgnored(tracer, source), true);
          });

          it('supports deprecated x_google_ignoreList', () => {
            const tracer = new TraceMap(
              replaceField(map, 'x_google_ignoreList' as 'ignoreList', [0]),
            );
            const source = tracer.sources[0]!;
            assert.equal(isIgnored(tracer, source), true);
          });
        });

        describe('resolvedSources', () => {
          it('unresolved without sourceRoot', () => {
            const tracer = new TraceMap(replaceField(map, 'sourceRoot', undefined));
            assert.deepEqual(tracer.resolvedSources, ['input.js']);
          });

          it('relative to mapUrl', () => {
            const tracer = new TraceMap(
              replaceField(map, 'sourceRoot', undefined),
              'foo/script.js.map',
            );
            assert.deepEqual(tracer.resolvedSources, ['foo/input.js']);
          });

          it('relative to sourceRoot', () => {
            const tracer = new TraceMap(replaceField(map, 'sourceRoot', 'foo'));
            assert.deepEqual(tracer.resolvedSources, ['foo/input.js']);
          });

          it('relative to mapUrl then sourceRoot', () => {
            const tracer = new TraceMap(
              replaceField(map, 'sourceRoot', 'bar'),
              'foo/script.js.map',
            );
            assert.deepEqual(tracer.resolvedSources, ['foo/bar/input.js']);
          });
        });
      });

      it('traceSegment', () => {
        const { mappings } = decodedMap;
        const tracer = new TraceMap(map);

        // This comes before any segment on line 2, but importantly there are segments on line 1. If
        // binary searchign returns the last segment of line 1, we've failed.
        assert.equal(traceSegment(tracer, 1, 0), null);

        for (let line = 0; line < mappings.length; line++) {
          const segmentLine = mappings[line];

          for (let j = 0; j < segmentLine.length; j++) {
            const segment = segmentLine[j];
            const next = j + 1 < segmentLine.length ? segmentLine[j + 1] : null;
            const nextColumn = next?.[0] ?? segment[0] + 2;

            for (let column = segment[0]; column < nextColumn; column++) {
              const traced = traceSegment(tracer, line, column);
              assert.deepEqual(traced, segment, `{ line: ${line}, column: ${column} }`);
            }
          }
        }
      });

      it('originalPositionFor', () => {
        const tracer = new TraceMap(map);

        assert.deepEqual(originalPositionFor(tracer, { line: 2, column: 13 }), {
          source: 'https://astexplorer.net/input.js',
          line: 2,
          column: 14,
          name: 'Error',
        });

        assert.deepEqual(
          originalPositionFor(tracer, { line: 2, column: 13, bias: GREATEST_LOWER_BOUND }),
          {
            source: 'https://astexplorer.net/input.js',
            line: 2,
            column: 14,
            name: 'Error',
          },
        );

        assert.deepEqual(
          originalPositionFor(tracer, { line: 2, column: 13, bias: LEAST_UPPER_BOUND }),
          {
            source: 'https://astexplorer.net/input.js',
            line: 2,
            column: 10,
            name: null,
          },
        );

        assert.deepEqual(originalPositionFor(tracer, { line: 100, column: 13 }), {
          source: null,
          line: null,
          column: null,
          name: null,
        });

        assert.throws(() => {
          originalPositionFor(tracer, { line: 0, column: 13 });
        });

        assert.throws(() => {
          originalPositionFor(tracer, { line: 1, column: -1 });
        });
      });

      it('generatedPositionFor', () => {
        const tracer = new TraceMap(map);

        assert.deepEqual(generatedPositionFor(tracer, { source: 'input.js', line: 4, column: 3 }), {
          line: 5,
          column: 3,
        });

        assert.deepEqual(generatedPositionFor(tracer, { source: 'input.js', line: 1, column: 0 }), {
          line: 1,
          column: 0,
        });

        assert.deepEqual(
          generatedPositionFor(tracer, { source: 'input.js', line: 1, column: 33 }),
          {
            line: 1,
            column: 18,
          },
        );

        assert.deepEqual(
          generatedPositionFor(tracer, { source: 'input.js', line: 1, column: 14 }),
          {
            line: 1,
            column: 13,
          },
        );

        assert.deepEqual(
          generatedPositionFor(tracer, {
            source: 'input.js',
            line: 1,
            column: 14,
            bias: GREATEST_LOWER_BOUND,
          }),
          {
            line: 1,
            column: 13,
          },
        );

        assert.deepEqual(
          generatedPositionFor(tracer, {
            source: 'input.js',
            line: 1,
            column: 14,
            bias: LEAST_UPPER_BOUND,
          }),
          {
            line: 1,
            column: 18,
          },
        );

        assert.deepEqual(generatedPositionFor(tracer, { source: 'input.js', line: 4, column: 0 }), {
          line: 5,
          column: 0,
        });
      });

      it('allGeneratedPositionsFor', () => {
        const tracer = new TraceMap(map);

        assert.deepEqual(
          allGeneratedPositionsFor(tracer, {
            source: 'input.js',
            line: 1,
            column: 33,
          }),
          [{ line: 1, column: 18 }],
        );

        assert.deepEqual(
          allGeneratedPositionsFor(tracer, {
            source: 'input.js',
            line: 2,
            column: 9,
          }),
          [
            { line: 2, column: 8 },
            { line: 2, column: 17 },
            { line: 2, column: 32 },
          ],
        );

        assert.deepEqual(
          allGeneratedPositionsFor(tracer, {
            source: 'input.js',
            line: 2,
            column: 9,
            bias: LEAST_UPPER_BOUND,
          }),
          [
            { line: 2, column: 8 },
            { line: 2, column: 17 },
            { line: 2, column: 32 },
          ],
        );

        assert.deepEqual(
          allGeneratedPositionsFor(tracer, {
            source: 'input.js',
            line: 2,
            column: 9,
            bias: GREATEST_LOWER_BOUND,
          }),
          [
            { line: 2, column: 4 },
            { line: 2, column: 33 },
          ],
        );

        assert.deepEqual(
          allGeneratedPositionsFor(tracer, {
            source: 'input.js',
            line: 2,
            column: 10,
          }),
          [
            { line: 2, column: 8 },
            { line: 2, column: 17 },
            { line: 2, column: 32 },
          ],
        );

        assert.deepEqual(
          allGeneratedPositionsFor(tracer, {
            source: 'input.js',
            line: 2,
            column: 10,
            bias: GREATEST_LOWER_BOUND,
          }),
          [
            { line: 2, column: 8 },
            { line: 2, column: 17 },
            { line: 2, column: 32 },
          ],
        );

        assert.deepEqual(
          allGeneratedPositionsFor(tracer, { source: 'input.js', line: 100, column: 13 }),
          [],
        );

        assert.deepEqual(
          allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 100 }),
          [],
        );

        assert.deepEqual(
          allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 10 }),
          [{ line: 1, column: 13 }],
        );
      });
    };
  }

  describe('decoded source map', testSuite(decodedMap));
  describe('json decoded source map', testSuite(JSON.stringify(decodedMap)));
  describe('encoded source map', testSuite(encodedMap));
  describe('json encoded source map', testSuite(JSON.stringify(encodedMap)));

  describe('unordered mappings', () => {
    const mappings = decodedMap.mappings.map((line) => {
      return line.slice().reverse();
    });
    const reversedDecoded: DecodedSourceMap = {
      ...decodedMap,
      mappings,
    };
    const reversedEncoded: EncodedSourceMap = {
      ...encodedMap,
      mappings: encode(mappings),
    };

    function macro(map: SourceMapInput) {
      return () => {
        const tracer = new TraceMap(map);
        assert.deepEqual(decodedMappings(tracer), decodedMap.mappings);
      };
    }
    it('decoded source map', macro(reversedDecoded));
    it('json decoded source map', macro(JSON.stringify(reversedDecoded)));
    it('encoded source map', macro(reversedEncoded));
    it('json encoded source map', macro(JSON.stringify(reversedEncoded)));
  });

  describe('empty mappings with lines', () => {
    const decoded: DecodedSourceMap = {
      ...decodedMap,
      mappings: decode(';;;;;;;;;;;;;;;;'),
    };
    const encoded: EncodedSourceMap = {
      ...encodedMap,
      mappings: ';;;;;;;;;;;;;;;;',
    };

    function macro(map: SourceMapInput) {
      return () => {
        const tracer = new TraceMap(map);
        for (let i = 0; i < decoded.mappings.length; i++) {
          assert.equal(traceSegment(tracer, i, 0), null, `{ line: ${i} }`);
        }
      };
    }

    it('decoded source map', macro(decoded));
    it('json decoded source map', macro(JSON.stringify(decoded)));
    it('encoded source map', macro(encoded));
    it('json encoded source map', macro(JSON.stringify(encoded)));
  });

  describe('eachMapping', () => {
    const mappings = decodedMap.mappings.flatMap((line, i) => {
      return line.map((seg): EachMapping => {
        return {
          generatedLine: i + 1,
          generatedColumn: seg[0],
          source: seg.length === 1 ? null : `https://astexplorer.net/${decodedMap.sources[seg[1]]}`,
          originalLine: seg.length === 1 ? null : seg[2] + 1,
          originalColumn: seg.length === 1 ? null : seg[3],
          name: seg.length === 5 ? decodedMap.names[seg[4]] : null,
        } as any;
      });
    });

    function macro(map: SourceMapInput) {
      return () => {
        const tracer = new TraceMap(map);
        let i = 0;
        eachMapping(tracer, (mapping) => {
          assert.deepEqual(mapping, mappings[i++]);
        });
      };
    }

    it('decoded source map', macro(decodedMap));
    it('json decoded source map', macro(JSON.stringify(decodedMap)));
    it('encoded source map', macro(encodedMap));
    it('json encoded source map', macro(JSON.stringify(encodedMap)));
  });

  describe('presortedDecodedMap', () => {
    it('propagates decoded mappings without sorting', () => {
      const mappings = decodedMap.mappings.map((line) => {
        return line.slice().reverse();
      });
      const reversedDecoded: DecodedSourceMap = {
        ...decodedMap,
        mappings: mappings.map((line) => line.slice()),
      };

      const tracer = presortedDecodedMap(reversedDecoded);
      assert.deepEqual(decodedMappings(tracer), mappings);
    });

    it('ignores non-sourcemap fields from output', () => {
      // `map` will contain a `_encoded` field equal to the encoded map's, a _decoded equal to [],
      // and a _decodedMemo field. This fooled the duck-type early return detection, and preserved
      // invalid values on the presorted tracer.
      // https://github.com/facebook/jest/issues/12998#issuecomment-1212426850
      const map = Object.assign({}, new TraceMap(encodedMap), { mappings: [] });
      const tracer = presortedDecodedMap(map);

      assert.equal(encodedMappings(tracer), '');
    });
  });

  describe('typescript readonly type', () => {
    it('decoded source map', () => {
      // This is a TS lint test, not a real one.

      const decodedMap = {
        version: 3 as const,
        sources: ['input.js'] as readonly string[],
        names: [] as readonly string[],
        mappings: [] as readonly SourceMapSegment[][],
        sourcesContent: [] as readonly string[],
      };

      new TraceMap(decodedMap);
    });
  });

  describe('rangeMappings', () => {
    const rangeDecodedMap = {
      version: 3,
      sources: ['input.js'],
      sourceRoot: 'https://astexplorer.net/',
      names: ['foo'],
      mappings: [
        [
          [0, 0, 0, 0], // (0,0) -> input.js:(0,0), RANGE
          [20, 0, 0, 20], // (0,20) -> input.js:(0,20), NORMAL
        ],
        [], // empty line, should be NORMAL because L0 ended with NORMAL
        [
          [0, 0, 1, 0, 0], // (2,0) -> input.js:(1,0), RANGE
        ],
        [], // empty line, should be RANGE because L2 ended with RANGE
        [
          [20, 0, 0, 20, 0], // (4,20) -> input.js:(0,20), NORMAL.
          [30, 0, 2, 15], // (4, 30) -> input.js:(2,15), NORMAL
        ],
        [
          [0, 0, 5, 0], // (5,0) -> input.js:(5,0), RANGE
        ],
      ],
      rangeMappings: [
        [0], // line 0, segment 0 is range
        [],
        [0], // line 2, segment 0 is range
        [],
        [],
        [0], // line 5, segment 0 is range
      ],
    } satisfies DecodedSourceMap;

    function rangeTestSuite(map: DecodedSourceMap | EncodedSourceMap | string) {
      return () => {
        it('traceSegment', () => {
          const tracer = new TraceMap(map);

          // Exact match
          assert.deepEqual(traceSegment(tracer, 0, 0), [0, 0, 0, 0]);
          // Range offset on same line -> Returns raw segment
          assert.deepEqual(traceSegment(tracer, 0, 10), [0, 0, 0, 0]);
          // Non-range segment match
          assert.deepEqual(traceSegment(tracer, 0, 20), [20, 0, 0, 20]);
          // Non-range segment, tracing after the segment
          assert.deepEqual(traceSegment(tracer, 0, 25), [20, 0, 0, 20]);

          // Range offset on next line (empty, but L0 ended with NORMAL)
          assert.equal(traceSegment(tracer, 1, 5), null);

          // Exact match on line 2
          assert.deepEqual(traceSegment(tracer, 2, 0), [0, 0, 1, 0, 0]);
          // Range offset on line 2 -> Returns raw segment
          assert.deepEqual(traceSegment(tracer, 2, 10), [0, 0, 1, 0, 0]);

          // Range offset on line 3 (empty, L2 ended with RANGE) -> Returns raw segment from L2
          assert.deepEqual(traceSegment(tracer, 3, 5), [0, 0, 1, 0, 0]);

          // Line 4 column 10 (before NORMAL segment at 20, continues RANGE from L3) -> Returns raw segment from L2
          assert.deepEqual(traceSegment(tracer, 4, 10), [0, 0, 1, 0, 0]);
          // Line 4 column 20 (exact match for NORMAL segment)
          assert.deepEqual(traceSegment(tracer, 4, 20), [20, 0, 0, 20, 0]);
          // Line 4 column 25 (after NORMAL segment)
          assert.deepEqual(traceSegment(tracer, 4, 25), [20, 0, 0, 20, 0]);
        });

        it('originalPositionFor', () => {
          const tracer = new TraceMap(map);

          // Exact match L0
          assert.deepEqual(originalPositionFor(tracer, { line: 1, column: 0 }), {
            source: 'https://astexplorer.net/input.js',
            line: 1,
            column: 0,
            name: null,
          });
          // Range offset L0
          assert.deepEqual(originalPositionFor(tracer, { line: 1, column: 10 }), {
            source: 'https://astexplorer.net/input.js',
            line: 1,
            column: 10,
            name: null,
          });
          // Normal segment match L0
          assert.deepEqual(originalPositionFor(tracer, { line: 1, column: 20 }), {
            source: 'https://astexplorer.net/input.js',
            line: 1,
            column: 20,
            name: null,
          });
          // After normal segment L0
          assert.deepEqual(originalPositionFor(tracer, { line: 1, column: 25 }), {
            source: 'https://astexplorer.net/input.js',
            line: 1,
            column: 20,
            name: null,
          });

          // Unmapped line (L1 empty, L0 ended with NORMAL)
          assert.deepEqual(originalPositionFor(tracer, { line: 2, column: 5 }), {
            source: null,
            line: null,
            column: null,
            name: null,
          });

          // Exact match L2
          assert.deepEqual(originalPositionFor(tracer, { line: 3, column: 0 }), {
            source: 'https://astexplorer.net/input.js',
            line: 2,
            column: 0,
            name: 'foo',
          });
          // Range offset L2
          assert.deepEqual(originalPositionFor(tracer, { line: 3, column: 10 }), {
            source: 'https://astexplorer.net/input.js',
            line: 2,
            column: 10,
            name: 'foo',
          });

          // Range offset L3 (empty, L2 ended with RANGE)
          assert.deepEqual(originalPositionFor(tracer, { line: 4, column: 5 }), {
            source: 'https://astexplorer.net/input.js',
            line: 3,
            column: 5,
            name: 'foo',
          });

          // L4 before NORMAL segment (continues RANGE from L3)
          assert.deepEqual(originalPositionFor(tracer, { line: 5, column: 10 }), {
            source: 'https://astexplorer.net/input.js',
            line: 4,
            column: 10,
            name: 'foo',
          });
          // L4 NORMAL segment match
          assert.deepEqual(originalPositionFor(tracer, { line: 5, column: 20 }), {
            source: 'https://astexplorer.net/input.js',
            line: 1,
            column: 20,
            name: 'foo',
          });
          // L4 after NORMAL segment
          assert.deepEqual(originalPositionFor(tracer, { line: 5, column: 25 }), {
            source: 'https://astexplorer.net/input.js',
            line: 1,
            column: 20,
            name: 'foo',
          });
        });

        it('generatedPositionFor', () => {
          const tracer = new TraceMap(map);

          // Exact match
          assert.deepEqual(
            generatedPositionFor(tracer, { source: 'input.js', line: 1, column: 0 }),
            { line: 1, column: 0 },
          );
          // Range offset on same line
          assert.deepEqual(
            generatedPositionFor(tracer, { source: 'input.js', line: 1, column: 10 }),
            { line: 1, column: 10 },
          );
          // Non-range segment match
          assert.deepEqual(
            generatedPositionFor(tracer, { source: 'input.js', line: 1, column: 20 }),
            { line: 1, column: 20 },
          );
          // Conflicting original position from 5th line
          assert.deepEqual(
            generatedPositionFor(tracer, { source: 'input.js', line: 1, column: 25 }),
            { line: 5, column: 20 },
          );

          // Exact match
          assert.deepEqual(
            generatedPositionFor(tracer, { source: 'input.js', line: 2, column: 0 }),
            { line: 3, column: 0 },
          );
          // Range offset on same line
          assert.deepEqual(
            generatedPositionFor(tracer, { source: 'input.js', line: 2, column: 10 }),
            { line: 3, column: 10 },
          );
          // Range offset continuing on next line
          assert.deepEqual(
            generatedPositionFor(tracer, { source: 'input.js', line: 3, column: 5 }),
            { line: 4, column: 5 },
          );
          // Range offset continuing on next line
          assert.deepEqual(
            generatedPositionFor(tracer, { source: 'input.js', line: 3, column: 5 }),
            { line: 4, column: 5 },
          );
          // Non-range segment match
          assert.deepEqual(
            generatedPositionFor(tracer, { source: 'input.js', line: 3, column: 15 }),
            { line: 5, column: 30 },
          );
          // Non-range segment match, tracing after the segment
          assert.deepEqual(
            generatedPositionFor(tracer, { source: 'input.js', line: 3, column: 20 }),
            { line: 5, column: 30 },
          );
        });

        it('allGeneratedPositionsFor', () => {
          const tracer = new TraceMap(map);

          // Exact match L0 (Range segment)
          assert.deepEqual(
            allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 0 }),
            [{ line: 1, column: 0 }],
          );
          // Range offset L0
          assert.deepEqual(
            allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 10 }),
            [{ line: 1, column: 10 }],
          );
          // Normal segment match L0
          assert.deepEqual(
            allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 20 }),
            [
              { line: 1, column: 20 },
              { line: 5, column: 20 },
            ],
          );
          // Conflicting original position from 5th line
          assert.deepEqual(
            allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 25 }),
            [],
          );

          // Exact match L2 (Range segment)
          assert.deepEqual(
            allGeneratedPositionsFor(tracer, { source: 'input.js', line: 2, column: 0 }),
            [{ line: 3, column: 0 }],
          );
          // Range offset L2
          assert.deepEqual(
            allGeneratedPositionsFor(tracer, { source: 'input.js', line: 2, column: 10 }),
            [{ line: 3, column: 10 }],
          );

          // Range offset L3 (empty, L2 ended with RANGE)
          assert.deepEqual(
            allGeneratedPositionsFor(tracer, { source: 'input.js', line: 3, column: 5 }),
            [{ line: 4, column: 5 }],
          );

          // Test with bias
          assert.deepEqual(
            allGeneratedPositionsFor(tracer, {
              source: 'input.js',
              line: 1,
              column: 14,
              bias: LEAST_UPPER_BOUND,
            }),
            [{ line: 1, column: 14 }], // Range mapping covers it, and it ignores bias
          );
        });

        it('traceRange', () => {
          const tracer = new TraceMap(map);

          // Find segment by backtracking from line 3 to line 2
          const segment = traceSegment(tracer, 3, 5);
          assert.deepEqual(segment, [0, 0, 1, 0, 0]);

          // traceRange should bound the start to genLine/genCol
          assert.deepEqual(traceRange(tracer, segment, 3, 5), [3, 5, 4, 20]);

          // Last segment in file should have infinite bounds
          const segment5 = traceSegment(tracer, 5, 0);
          assert.deepEqual(segment5, [0, 0, 5, 0]);
          assert.deepEqual(traceRange(tracer, segment5, 5, 0), [5, 0, Infinity, Infinity]);

          // Normal segment should return null for traceRange
          const normalSegment = traceSegment(tracer, 0, 20);
          assert.deepEqual(normalSegment, [20, 0, 0, 20]);
          assert.equal(traceRange(tracer, normalSegment, 0, 20), null);
        });
      };
    }

    const rangeEncodedMap = {
      ...rangeDecodedMap,
      rangeMappings: encodeRangeMappings(rangeDecodedMap.rangeMappings),
      mappings: encode(rangeDecodedMap.mappings),
    } satisfies EncodedSourceMap;
    describe('decoded source map', rangeTestSuite(rangeDecodedMap));
    describe('json decoded source map', rangeTestSuite(JSON.stringify(rangeDecodedMap)));
    describe('encoded source map', rangeTestSuite(rangeEncodedMap));
    describe('json encoded source map', rangeTestSuite(JSON.stringify(rangeEncodedMap)));
    describe('conflicting range and normal mappings', () => {
      const map: DecodedSourceMap = {
        version: 3,
        sources: ['input.js'],
        names: [],
        mappings: [
          [
            [0, 0, 0, 0], // (0,0) -> (0,0), RANGE
            [10, 0, 0, 10], // (0,10) -> (0,10), NORMAL
            [10, 0, 0, 10], // (0,10) -> (0,10), RANGE
          ],
        ],
        rangeMappings: [[0, 2]],
      };

      it('allGeneratedPositionsFor', () => {
        const tracer = new TraceMap(map);

        // Exact match at column 10 returns both
        assert.deepEqual(
          allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 10 }),
          [
            { line: 1, column: 10 },
            { line: 1, column: 10 },
          ],
        );

        // Trailing match at column 15 only returns the RANGE mapping at col 10
        // (because NORMAL mapping at col 10 is ignored for ranges)
        assert.deepEqual(
          allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 15 }),
          [{ line: 1, column: 15 }],
        );
      });
    });

    describe('reverse range mappings (bakkot/matrixlogs 2026-03-02)', () => {
      it('generatedPositionFor respects range mapping bounds', () => {
        const tracer = new TraceMap({
          version: 3,
          sources: ['input.js'],
          names: [],
          mappings: 'AAAA;EAee', // (0,0) -> (0,0) RANGE; (1,2) -> (15,15) NORMAL
          rangeMappings: 'A', // first segment is range
        });

        // Inside range
        assert.deepEqual(generatedPositionFor(tracer, { source: 'input.js', line: 1, column: 0 }), {
          line: 1,
          column: 0,
        });
        assert.deepEqual(generatedPositionFor(tracer, { source: 'input.js', line: 1, column: 1 }), {
          line: 1,
          column: 1,
        });
        assert.deepEqual(generatedPositionFor(tracer, { source: 'input.js', line: 2, column: 0 }), {
          line: 2,
          column: 0,
        });
        assert.deepEqual(generatedPositionFor(tracer, { source: 'input.js', line: 2, column: 1 }), {
          line: 2,
          column: 1,
        });

        // Outside range limit [0, 2)
        assert.deepEqual(generatedPositionFor(tracer, { source: 'input.js', line: 2, column: 2 }), {
          column: null,
          line: null,
        });
        assert.deepEqual(generatedPositionFor(tracer, { source: 'input.js', line: 3, column: 1 }), {
          column: null,
          line: null,
        });

        // Second segment
        assert.deepEqual(
          generatedPositionFor(tracer, { source: 'input.js', line: 16, column: 16 }),
          { column: 2, line: 2 },
        );
      });

      it('allGeneratedPositionsFor handles multiple range mappings to the same source location', () => {
        const tracer = new TraceMap({
          version: 3,
          sources: ['input.js'],
          names: [],
          mappings: [
            // Gen Line 1: Range mapping starting at Gen(0,0)->Src(0,0), then Normal mapping at Gen(0,5)->Src(10,10)
            [
              [0, 0, 0, 0], // RANGE 1. src 0:0. Range ends at col 5.
              [5, 0, 10, 10], // NORMAL. Ends RANGE 1 at col 5.
            ],
            // Gen Line 2: Range mapping starting at Gen(1,0)->Src(0,0), continues indefinitely.
            [
              [0, 0, 0, 0], // RANGE 2. src 0:0.
            ],
            // Gen Line 3: Normal mapping starting at Gen(2,0)->Src(0,0).
            [
              [0, 0, 0, 0], // NORMAL. src 0:0.
            ],
          ],
          rangeMappings: [
            [0], // Line 0: Segment 0 is a range mapping
            [0], // Line 1: Segment 0 is a range mapping
            [], // Line 2: No range mappings
          ],
        });

        // Test querying exact start (Src Line 0, Col 0 -> line: 1, column: 0).
        // Matches start of RANGE 1, RANGE 2, and NORMAL mappings exactly.
        assert.deepEqual(
          allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 0 }),
          [
            { line: 1, column: 0 },
            { line: 2, column: 0 },
            { line: 3, column: 0 },
          ],
        );

        // Test querying an offset inside RANGE 1 and RANGE 2 (Src Line 0, Col 2 -> line: 1, column: 2).
        // RANGE 1: Gen Line 0, Col 0 -> ends at Col 5. Matches Src Col 2 at Gen Col 2.
        // RANGE 2: Gen Line 1, Col 0 -> continues. Matches Src Col 2 at Gen Col 2.
        // NORMAL: Does not offset.
        assert.deepEqual(
          allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 2 }),
          [
            { line: 1, column: 2 },
            { line: 2, column: 2 },
          ],
        );

        // Test querying an offset past RANGE 1 but inside RANGE 2 (Src Line 0, Col 10 -> line: 1, column: 10).
        // RANGE 1: Ends at Gen Col 5. Outside bounds.
        // RANGE 2: Continues. Matches Src Col 10 at Gen Col 10.
        // NORMAL: Does not offset.
        assert.deepEqual(
          allGeneratedPositionsFor(tracer, { source: 'input.js', line: 1, column: 10 }),
          [{ line: 2, column: 10 }],
        );

        // Test querying the normal segment that ends RANGE 1 (Src Line 10, Col 10 -> line: 11, column: 10).
        // NORMAL at Gen Line 0, Col 5.
        assert.deepEqual(
          allGeneratedPositionsFor(tracer, { source: 'input.js', line: 11, column: 10 }),
          [{ line: 1, column: 5 }],
        );
      });
    });
  });
});
