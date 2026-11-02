/// <reference lib="esnext" />

import assert from 'node:assert/strict';
import {
  FlattenMap,
  encodedMappings,
  decodedMappings,
  decodedRangeMappings,
  encodedRangeMappings,
  originalPositionFor,
  generatedPositionFor,
  type SectionedSourceMap,
  type SourceMapSegment,
} from '../src/trace-mapping';

describe('FlattenMap', () => {
  const map: SectionedSourceMap = {
    version: 3,
    file: 'sectioned.js',
    sections: [
      {
        offset: { line: 1, column: 1 },
        map: {
          version: 3,
          sections: [
            {
              offset: { line: 0, column: 1 },
              map: {
                version: 3,
                names: ['first'],
                sources: ['first.js'],
                sourcesContent: ['firstsource'],
                mappings: 'AAAAA,CAAC',
                ignoreList: [0],
              },
            },
            {
              offset: { line: 0, column: 2 },
              map: {
                version: 3,
                names: ['second'],
                sources: ['second.js'],
                sourcesContent: ['secondsource'],
                mappings: 'AAAAA;AAAA',
              },
            },
          ],
        },
      },
      {
        offset: { line: 2, column: 0 },
        map: {
          version: 3,
          sections: [
            {
              offset: { line: 0, column: 0 },
              map: {
                version: 3,
                names: ['third'],
                sources: ['third.js'],
                sourcesContent: ['thirdsource'],
                sourceRoot: 'nested',
                mappings: 'AAAAA,CAAA;AAAA',
                rangeMappings: 'A',
              },
            },
            {
              offset: { line: 0, column: 1 },
              map: {
                version: 3,
                names: [],
                sources: ['fourth.js'],
                sourcesContent: ['fourthsource'],
                mappings: [[[0, 0, 0, 0]]],
                ignoreList: [0],
                rangeMappings: [[0]],
              },
            },
          ],
        },
      },
    ],
  };

  describe('map properties', () => {
    it('version', () => {
      const tracer = new FlattenMap(map);
      assert.equal(tracer.version, map.version);
    });

    it('file', () => {
      const tracer = new FlattenMap(map);
      assert.equal(tracer.file, map.file);
    });

    it('sourceRoot', () => {
      const tracer = new FlattenMap(map);
      assert.equal(tracer.sourceRoot, undefined);
    });

    it('sources', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(tracer.sources, ['first.js', 'second.js', 'nested/third.js', 'fourth.js']);
    });

    it('names', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(tracer.names, ['first', 'second', 'third']);
    });

    it('encodedMappings', () => {
      const tracer = new FlattenMap(map);
      assert.equal(encodedMappings(tracer), ';EAAAA,CCAAC;ACAAC,CCAA');
    });

    it('decodedMappings', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(decodedMappings(tracer), [
        [],
        [
          [2, 0, 0, 0, 0],
          [3, 1, 0, 0, 1],
        ],
        [
          [0, 2, 0, 0, 2],
          [1, 3, 0, 0],
        ],
      ]);
    });

    it('sourcesContent', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(tracer.sourcesContent, [
        'firstsource',
        'secondsource',
        'thirdsource',
        'fourthsource',
      ]);
    });

    it('ignoreList', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(tracer.ignoreList, [0, 3]);
    });

    it('rangeMappings', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(decodedRangeMappings(tracer), [[], [], [0, 1]]);
      assert.deepEqual(encodedRangeMappings(tracer), ';;AB');
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

      new FlattenMap(decodedMap);
    });
  });

  describe('nested section offsets', () => {
    for (const line of [0, 1]) {
      it(`applies the parent column only to the first line (child line ${line})`, () => {
        const input: SectionedSourceMap = {
          version: 3,
          sections: [
            {
              offset: { line: 2, column: 7 },
              map: {
                version: 3,
                sections: [
                  {
                    offset: { line, column: 3 },
                    map: {
                      version: 3,
                      sources: ['input.js'],
                      names: [],
                      mappings: 'AAAA;EACA',
                    },
                  },
                ],
              },
            },
          ],
        };
        const tracer = new FlattenMap(input);
        const column = line === 0 ? 10 : 3;
        const expected: SourceMapSegment[][] = Array.from({ length: 2 + line }, () => []);
        expected.push([[column, 0, 0, 0]], [[2, 0, 1, 0]]);
        assert.deepEqual(decodedMappings(tracer), expected);
        assert.deepEqual(originalPositionFor(tracer, { line: 3 + line, column }), {
          source: 'input.js',
          line: 1,
          column: 0,
          name: null,
        });
        assert.deepEqual(generatedPositionFor(tracer, { source: 'input.js', line: 1, column: 0 }), {
          line: 3 + line,
          column,
        });
      });
    }

    it('clips a preceding map at a nested section on a later line', () => {
      const tracer = new FlattenMap({
        version: 3,
        sections: [
          {
            offset: { line: 0, column: 5 },
            map: {
              version: 3,
              sections: [
                {
                  offset: { line: 0, column: 0 },
                  map: {
                    version: 3,
                    sources: ['first.js'],
                    names: [],
                    mappings: [
                      [[0, 0, 0, 0]],
                      [
                        [0, 0, 1, 0],
                        [2, 0, 1, 2],
                        [4, 0, 1, 4],
                        [7, 0, 1, 7],
                      ],
                    ],
                    rangeMappings: [[], [1]],
                  },
                },
                {
                  offset: { line: 1, column: 3 },
                  map: {
                    version: 3,
                    sources: ['second.js'],
                    names: [],
                    mappings: [
                      [
                        [0, 0, 0, 0],
                        [2, 0, 0, 2],
                      ],
                    ],
                    rangeMappings: [[0]],
                  },
                },
              ],
            },
          },
        ],
      });
      assert.deepEqual(decodedMappings(tracer), [
        [[5, 0, 0, 0]],
        [
          [0, 0, 1, 0],
          [2, 0, 1, 2],
          [3, 1, 0, 0],
          [5, 1, 0, 2],
        ],
      ]);
      assert.deepEqual(decodedRangeMappings(tracer), [[], [1, 2]]);
      assert.deepEqual(originalPositionFor(tracer, { line: 2, column: 3 }), {
        source: 'second.js',
        line: 1,
        column: 0,
        name: null,
      });
    });

    it('resets the column through multiple nested line offsets and respects an outer stop', () => {
      const tracer = new FlattenMap({
        version: 3,
        sections: [
          {
            offset: { line: 1, column: 9 },
            map: {
              version: 3,
              sections: [
                {
                  offset: { line: 1, column: 4 },
                  map: {
                    version: 3,
                    sections: [
                      {
                        offset: { line: 1, column: 2 },
                        map: {
                          version: 3,
                          sources: ['first.js'],
                          names: [],
                          mappings: [
                            [
                              [0, 0, 0, 0],
                              [2, 0, 0, 2],
                              [4, 0, 0, 4],
                            ],
                            [[0, 0, 1, 0]],
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            offset: { line: 3, column: 5 },
            map: { version: 3, sources: ['second.js'], names: [], mappings: 'AAAA' },
          },
        ],
      });
      assert.deepEqual(decodedMappings(tracer), [
        [],
        [],
        [],
        [
          [2, 0, 0, 0],
          [4, 0, 0, 2],
          [5, 1, 0, 0],
        ],
      ]);
      assert.deepEqual(originalPositionFor(tracer, { line: 4, column: 2 }), {
        source: 'first.js',
        line: 1,
        column: 0,
        name: null,
      });
    });
  });
});
